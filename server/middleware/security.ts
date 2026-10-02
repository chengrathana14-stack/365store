import { defineEventHandler, getHeader, getRequestURL, createError, setHeader } from "h3";

/**
 * Server-Wide Security Middleware
 *
 * Provides active defense against:
 * 1. Path traversal & sensitive file probing (.env, .git, etc.)
 * 2. Cross-Site Request Forgery (CSRF) on state-changing API requests
 * 3. Oversized payload Denial of Service (DoS)
 * 4. Server information fingerprinting
 */

const SUSPICIOUS_PATH_PATTERNS = [
  /\.\./,                  // Path traversal (..)
  /\/\.env/i,              // Environment files
  /\/\.git/i,              // Git repository inspection
  /\/(wp-login|wp-admin|phpmyadmin|xmlrpc)/i, // CMS / database scanner probes
  /\.(bak|config|sql|tar|gz|zip)$/i,           // Backup archives / raw DB dumps
];

export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const pathname = url.pathname;
  const method = event.node.req.method || "GET";

  // 1. Block Automated Exploits and Path Traversal Probes
  for (const pattern of SUSPICIOUS_PATH_PATTERNS) {
    if (pattern.test(pathname) || pattern.test(url.search)) {
      throw createError({
        statusCode: 403,
        statusMessage: "Access Denied: Malicious request signature detected.",
      });
    }
  }

  // 2. Hide Server Implementation Fingerprint
  if (event.node.res && typeof event.node.res.removeHeader === "function") {
    event.node.res.removeHeader("x-powered-by");
  }

  // 3. Prevent Oversized Request Payload DoS (Max 2MB for API endpoints)
  if (["POST", "PUT", "PATCH"].includes(method)) {
    const contentLength = Number(getHeader(event, "content-length") || 0);
    const MAX_ALLOWED_BYTES = 2 * 1024 * 1024; // 2MB
    if (contentLength > MAX_ALLOWED_BYTES) {
      throw createError({
        statusCode: 413,
        statusMessage: "Payload Too Large: Maximum allowed request size is 2MB.",
      });
    }

    // 4. Anti-CSRF Origin Validation for Mutating API Routes
    if (pathname.startsWith("/api/")) {
      const origin = getHeader(event, "origin");
      const host = getHeader(event, "host");

      if (origin && host) {
        try {
          const originHost = new URL(origin).host;
          // In production or local dev, ensure the request origin matches the host
          if (originHost !== host && !originHost.includes("localhost") && !originHost.includes("127.0.0.1")) {
            throw createError({
              statusCode: 403,
              statusMessage: "Cross-Site Request Forgery (CSRF) blocked.",
            });
          }
        } catch {
          // If URL parsing fails, reject untrusted origin
          throw createError({
            statusCode: 403,
            statusMessage: "Invalid request origin.",
          });
        }
      }
    }
  }
});
