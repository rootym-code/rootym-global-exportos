/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/context.ts
 *
 * Brain Execution Context
 * ============================================================
 */

import type { NextRequest } from "next/server";

export interface BrainRequestContext {
  ip: string;
  userAgent: string;
  requestId: string;
  timestamp: Date;
}

export interface BrainUserContext {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface BrainContext {
  request: BrainRequestContext;
  user?: BrainUserContext;
  metadata?: Record<string, unknown>;
}

/**
 * Creates a Brain execution context from a Next.js request.
 */
export function createBrainContext(
  request: NextRequest,
): BrainContext {
  const forwardedFor = request.headers.get("x-forwarded-for");

  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const userAgent =
    request.headers.get("user-agent") ?? "unknown";

  const requestId =
    request.headers.get("x-request-id") ??
    crypto.randomUUID();

  return {
    request: {
      ip,
      userAgent,
      requestId,
      timestamp: new Date(),
    },
  };
}

/**
 * Creates a Brain context for internal/server-side execution.
 */
export function createInternalBrainContext(
  metadata?: Record<string, unknown>,
): BrainContext {
  return {
    request: {
      ip: "internal",
      userAgent: "ROOTYM_INTERNAL",
      requestId: crypto.randomUUID(),
      timestamp: new Date(),
    },
    metadata,
  };
}

/**
 * Attaches user information to an existing Brain context.
 */
export function withUser(
  context: BrainContext,
  user: BrainUserContext,
): BrainContext {
  return {
    ...context,
    user,
  };
}

export default BrainContext;