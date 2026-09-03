/**
 * Author: Prem Singh
 * Purpose: Provides admin authentication, JWT creation, and active-admin authorization.
 */

import { NextRequest } from "next/server";
import { SignJWT, type JWTPayload } from "jose";

import { verifyAdminToken } from "./jwt";
import { prisma } from "@/lib/prisma";
import { AdminRole } from "@/lib/generated/prisma";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined.");
}

const secretKey = new TextEncoder().encode(secret);

export const AUTH_COOKIE_NAME = "rootym_admin_token";

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export interface CreateAdminTokenPayload extends JWTPayload {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
}

export async function createAdminToken(
  payload: CreateAdminTokenPayload
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

export interface AuthResult {
  authenticated: boolean;
  admin?: {
    adminId: string;
    email: string;
    name: string;
    role: AdminRole;
  };
  error?: string;
  status?: number;
}

export async function authenticateAdmin(
  request: NextRequest
): Promise<AuthResult> {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return {
        authenticated: false,
        error: "Authentication required.",
        status: 401,
      };
    }

    const payload = await verifyAdminToken(token);

    const admin = await prisma.admin.findUnique({
      where: {
        id: payload.adminId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!admin) {
      return {
        authenticated: false,
        error: "Admin account not found.",
        status: 401,
      };
    }

    if (!admin.isActive) {
      return {
        authenticated: false,
        error: "Admin account is inactive.",
        status: 403,
      };
    }

    return {
      authenticated: true,
      admin: {
        adminId: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  } catch {
    return {
      authenticated: false,
      error: "Invalid or expired session.",
      status: 401,
    };
  }
}