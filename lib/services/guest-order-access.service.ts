
import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

function getSecret(): string {
  const secret = process.env.CUSTOMER_JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "CUSTOMER_JWT_SECRET must be configured with at least 32 characters.",
    );
  }

  return secret;
}

/**
 * Creates a purpose-specific signed token for guest order access.
 * The token is deterministic for an order, so checkout retries
 * do not require storing or regenerating a random token.
 */
export function createGuestOrderAccessToken(
  orderId: string,
  websiteId: string,
): string {
  const payload = `guest-order:v1:${websiteId}:${orderId}`;

  return createHmac("sha256", getSecret())
    .update(payload, "utf8")
    .digest("hex");
}

/**
 * Validates a guest order access token using a constant-time comparison.
 */
export function verifyGuestOrderAccessToken(
  orderId: string,
  websiteId: string,
  token: string,
): boolean {
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return false;
  }

  const expected = Buffer.from(
    createGuestOrderAccessToken(orderId, websiteId),
    "hex",
  );
  const received = Buffer.from(token, "hex");

  return (
    expected.length === received.length &&
    timingSafeEqual(expected, received)
  );
}
