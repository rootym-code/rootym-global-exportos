
import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function getEncryptionKey(): Buffer {
  const encodedKey = process.env.ROOTYM_STORE_ENCRYPTION_KEY;

  if (!encodedKey) {
    throw new Error(
      "ROOTYM_STORE_ENCRYPTION_KEY is not configured.",
    );
  }

  const key = Buffer.from(encodedKey, "base64");

  if (
    key.length !== KEY_LENGTH ||
    key.toString("base64") !== encodedKey
  ) {
    throw new Error(
      "ROOTYM_STORE_ENCRYPTION_KEY must be a valid base64-encoded 32-byte key.",
    );
  }

  return key;
}

export function encryptSecret(plaintext: string): string {
  if (!plaintext) {
    throw new Error("Cannot encrypt an empty secret.");
  }

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(
    ALGORITHM,
    getEncryptionKey(),
    iv,
  );

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // Versioned format: v1:IV:AUTH_TAG:CIPHERTEXT
  return [
    "v1",
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

export function decryptSecret(payload: string): string {
  const parts = payload.split(":");

  if (parts.length !== 4 || parts[0] !== "v1") {
    throw new Error("Unsupported or invalid encrypted secret format.");
  }

  const [, encodedIv, encodedAuthTag, encodedCiphertext] = parts;

  const iv = Buffer.from(encodedIv, "base64");
  const authTag = Buffer.from(encodedAuthTag, "base64");
  const ciphertext = Buffer.from(encodedCiphertext, "base64");

  if (
    iv.length !== IV_LENGTH ||
    authTag.length !== AUTH_TAG_LENGTH ||
    ciphertext.length === 0
  ) {
    throw new Error("Invalid encrypted secret payload.");
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    iv,
  );

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
