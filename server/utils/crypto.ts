import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
  createHmac,
} from "node:crypto";

/**
 * Enterprise-grade AES-256-GCM Authenticated Encryption
 *
 * Provides:
 * 1. Confidentiality: 256-bit AES encryption
 * 2. Authenticity & Integrity: GCM 128-bit authentication tag prevents tampering
 * 3. Unique IV: 96-bit random IV per encryption operation
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits recommended for GCM
const TAG_LENGTH = 16; // 128 bits auth tag
const SALT_LENGTH = 16;

// Derive master encryption key from environment variable or secure system seed
const getMasterKey = (salt: Buffer): Buffer => {
  const secret =
    process.env.APP_ENCRYPTION_KEY ||
    process.env.APP_SECRET ||
    "365_SPORTS_SECURE_VAULT_KEY_2026_CAMBODIA_KHQR_TELEGRAM";

  return scryptSync(secret, salt, 32);
};

/**
 * Encrypts a plaintext string into a tamper-proof ciphertext bundle:
 * Format: hex(salt):hex(iv):hex(authTag):hex(encryptedData)
 */
export const encryptSecret = (plaintext: string): string => {
  if (!plaintext) return "";

  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const key = getMasterKey(salt);

  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    salt.toString("hex"),
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
};

/**
 * Decrypts an encrypted bundle formatted as hex(salt):hex(iv):hex(authTag):hex(encryptedData)
 * Throws or returns null if tampered with or corrupted
 */
export const decryptSecret = (ciphertext: string): string => {
  if (!ciphertext) return "";

  const parts = ciphertext.split(":");
  if (parts.length !== 4) {
    // If not encrypted format, return as-is (graceful backward compatibility)
    return ciphertext;
  }

  try {
    const [saltHex, ivHex, authTagHex, encryptedHex] = parts;
    const salt = Buffer.from(saltHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const key = getMasterKey(salt);
    const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf8");
  } catch (err) {
    console.error("[Decryption Error]: Data tampering detected or invalid key.", err);
    return "";
  }
};

/**
 * Mask sensitive customer information (e.g. phone number, email) for logs/audits
 */
export const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 6) return "***";
  return phone.slice(0, 3) + "****" + phone.slice(-3);
};

export const maskEmail = (email: string): string => {
  if (!email || !email.includes("@")) return "***";
  const [user, domain] = email.split("@");
  const visible = user.length > 2 ? user.slice(0, 2) : user.slice(0, 1);
  return `${visible}***@${domain}`;
};

/**
 * Cryptographic HMAC signature generation for webhook / request verification
 */
export const generateHmacSignature = (data: string, secretKey: string): string => {
  return createHmac("sha256", secretKey).update(data).digest("hex");
};
