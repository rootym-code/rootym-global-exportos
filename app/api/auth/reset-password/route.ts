/**
 * ============================================================
 * ROOTYM Customer Reset Password API
 * ============================================================
 *
 * Purpose:
 * Completes the customer password-reset process.
 *
 * Responsibilities:
 * - Validate the reset token.
 * - Confirm that the token has not expired.
 * - Confirm that the token has not already been used.
 * - Validate the new password.
 * - Hash the new password using the existing ROOTYM
 *   customer password hashing service.
 * - Update User.passwordHash.
 * - Mark the reset token as used.
 *
 * Security:
 * - Raw reset tokens are never stored in the database.
 * - Reset tokens are single-use.
 * - Reset tokens expire after 30 minutes.
 * - Passwords are never stored in plaintext.
 *
 * This route does NOT:
 * - modify Google OAuth.
 * - modify the existing login route.
 * - create users.
 * - create tenants.
 *
 * ============================================================
 */

import { createHash } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
  createCustomerPasswordHash,
} from "@/lib/auth/customer-password";

/**
 * Hash the raw reset token using the same SHA-256
 * algorithm used when the token was created.
 */
function hashResetToken(token: string): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body = await request.json();

    const token =
      typeof body?.token === "string"
        ? body.token.trim()
        : "";

    const password =
      typeof body?.password === "string"
        ? body.password
        : "";

    /**
     * ========================================================
     * Basic validation
     * ========================================================
     */
    if (!token || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Reset token and new password are required.",
        },
        { status: 400 },
      );
    }

    /**
     * ========================================================
     * Password validation
     * ========================================================
     */
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your new password must be at least 8 characters long.",
        },
        { status: 400 },
      );
    }

    /**
     * ========================================================
     * Hash supplied token
     * ========================================================
     */
    const tokenHash =
      hashResetToken(token);

    /**
     * ========================================================
     * Find reset token
     * ========================================================
     *
     * The token must:
     * - exist
     * - not have been used
     * - not be expired
     */
    const resetToken =
      await prisma.passwordResetToken.findUnique({
        where: {
          tokenHash,
        },
        include: {
          user: true,
        },
      });

    if (!resetToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link is invalid or has expired.",
        },
        { status: 400 },
      );
    }

    /**
     * ========================================================
     * Single-use validation
     * ========================================================
     */
    if (resetToken.usedAt) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link has already been used.",
        },
        { status: 400 },
      );
    }

    /**
     * ========================================================
     * Expiration validation
     * ========================================================
     */
    if (
      resetToken.expiresAt.getTime() <=
      Date.now()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link is invalid or has expired.",
        },
        { status: 400 },
      );
    }

    /**
     * ========================================================
     * Account validation
     * ========================================================
     */
    if (!resetToken.user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This account is inactive. Please contact support.",
        },
        { status: 403 },
      );
    }

    /**
     * ========================================================
     * Create new password hash
     * ========================================================
     *
     * Uses the existing customer password hashing
     * implementation, which uses bcrypt.
     */
    const passwordHash =
      await createCustomerPasswordHash(
        password,
      );

    /**
     * ========================================================
     * Update password + consume token
     * ========================================================
     *
     * These operations are performed in one transaction so
     * that the password and token state remain consistent.
     */
    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          passwordHash,
        },
      }),

      prisma.passwordResetToken.update({
        where: {
          id: resetToken.id,
        },
        data: {
          usedAt: new Date(),
        },
      }),
    ]);

    /**
     * ========================================================
     * Success
     * ========================================================
     */
    return NextResponse.json(
      {
        success: true,
        message:
          "Your password has been reset successfully. You can now log in with your new password.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Reset-password request failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to reset your password. Please try again.",
      },
      { status: 500 },
    );
  }
}