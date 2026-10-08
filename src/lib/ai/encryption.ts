import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET_KEY =
  process.env.ENCRYPTION_SECRET_KEY || "dicatetin-secret-encryption-key-32-chars-min!";

// Ensure key is exactly 32 bytes
function getKey(): Buffer {
  return crypto.createHash("sha256").update(SECRET_KEY).digest();
}

/**
 * Encrypts an API key or sensitive token using AES-256-GCM
 */
export function encryptSecret(plainText: string): string {
  if (!plainText) return "";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  // Format: iv:authTag:encrypted
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an encrypted token
 */
export function decryptSecret(cipherText: string): string {
  if (!cipherText) return "";
  try {
    const parts = cipherText.split(":");
    if (parts.length !== 3) return cipherText; // Return as-is if unencrypted

    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encryptedText = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Decryption error:", err);
    return "";
  }
}

/**
 * Masks an API key for safe UI display (e.g. sk-proj...x9A2)
 */
export function maskApiKey(key: string): string {
  if (!key) return "Belum diisi";
  if (key.length <= 8) return "••••••••";
  return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
}
