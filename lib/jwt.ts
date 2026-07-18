import { SignJWT, jwtVerify, type JWTPayload } from "jose";

import { AdminRole } from "@/lib/generated/prisma";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined.");
}

const secretKey = new TextEncoder().encode(secret);

export interface AdminJWTPayload extends JWTPayload {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
}

export async function signAdminToken(
  payload: AdminJWTPayload
): Promise<string> {
  return await new SignJWT({
    adminId: payload.adminId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyAdminToken(
  token: string
): Promise<AdminJWTPayload> {
  const { payload } = await jwtVerify(token, secretKey);

  return {
    adminId: payload.adminId as string,
    email: payload.email as string,
    name: payload.name as string,
    role: payload.role as AdminRole,
    iat: payload.iat,
    exp: payload.exp,
    nbf: payload.nbf,
    iss: payload.iss,
    sub: payload.sub,
    aud: payload.aud,
    jti: payload.jti,
  };
}