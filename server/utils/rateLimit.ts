import { H3Event, createError, getRequestIP } from "h3";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  key: string;
  maxRequests: number;
  windowMs: number;
}

// In-memory store for rate limiting with memory-leak protection
const rateLimitMap = new Map<string, RateLimitRecord>();
const MAX_RATE_LIMIT_ENTRIES = 1000;
let lastPrune = Date.now();

// Prune expired entries to prevent memory growth
const pruneExpired = () => {
  const now = Date.now();
  if (now - lastPrune < 60000 && rateLimitMap.size < MAX_RATE_LIMIT_ENTRIES) {
    return;
  }
  lastPrune = now;

  for (const [key, record] of rateLimitMap.entries()) {
    if (record.resetAt <= now) {
      rateLimitMap.delete(key);
    }
  }

  // Hard safety cap: if still too large, drop oldest entries
  if (rateLimitMap.size > MAX_RATE_LIMIT_ENTRIES) {
    const keysToDelete = Array.from(rateLimitMap.keys()).slice(
      0,
      rateLimitMap.size - MAX_RATE_LIMIT_ENTRIES
    );
    for (const k of keysToDelete) {
      rateLimitMap.delete(k);
    }
  }
};

/**
 * Checks rate limit for a given request. Throws 429 if limit is exceeded.
 */
export const checkRateLimit = (
  event: H3Event,
  options: RateLimitOptions
) => {
  pruneExpired();

  const ip =
    getRequestIP(event, { xForwardedFor: true }) ||
    event.node.req.socket.remoteAddress ||
    "127.0.0.1";

  const mapKey = `${options.key}:${ip}`;
  const now = Date.now();
  let record = rateLimitMap.get(mapKey);

  if (!record || record.resetAt <= now) {
    record = {
      count: 1,
      resetAt: now + options.windowMs,
    };
    rateLimitMap.set(mapKey, record);
    return;
  }

  record.count += 1;

  if (record.count > options.maxRequests) {
    const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
    throw createError({
      statusCode: 429,
      statusMessage: `Too many requests. Please wait ${retryAfterSec}s and try again.`,
    });
  }
};
