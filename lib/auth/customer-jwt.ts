/**
 * Author: Prem Singh
 * Purpose: Signs and verifies SaaS customer sessions separately from ROOTYM admin sessions.
 */

import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const secret = process.env.CUSTOMER_JWT_SECRET;

if (!secret) {
  throw new Error("CUSTOMER_JWT_SECRET is not defined.");
}

const secretKey = new TextEncoder().encode(secret);

export const CUSTOMER_AUTH_COOKIE_NAME = "rootym_customer_token";

export const CUSTOMER_AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export interface CustomerJWTPayload extends JWTPayload {
  userId: string;
  tenantId: string;
  membershipId: string;
}

export async function signCustomerToken(
  payload: CustomerJWTPayload
): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    tenantId: payload.tenantId,
    membershipId: payload.membershipId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyCustomerToken(
  token: string
): Promise<CustomerJWTPayload> {
  const { payload } = await jwtVerify(token, secretKey);

  if (
    typeof payload.userId !== "string" ||
    typeof payload.tenantId !== "string" ||
    typeof payload.membershipId !== "string"
  ) {
    throw new Error("Invalid customer session payload.");
  }

  return {
    userId: payload.userId,
    tenantId: payload.tenantId,
    membershipId: payload.membershipId,
    iat: payload.iat,
    exp: payload.exp,
    nbf: payload.nbf,
    iss: payload.iss,
    sub: payload.sub,
    aud: payload.aud,
    jti: payload.jti,
  };
}