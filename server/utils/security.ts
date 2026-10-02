/**
 * Security and sanitization utilities
 */

/**
 * Escapes characters for safe inclusion in HTML (e.g. Telegram parse_mode='HTML')
 * Prevents HTML entity injection and formatting breakage
 */
export const escapeHtml = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Sanitizes and truncates a string to avoid memory / payload abuse
 */
export const sanitizeText = (value: unknown, maxLength = 1000): string => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};
