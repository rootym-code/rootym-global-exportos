/**
 * ============================================================
 * ROOTYM Customer Forgot Password API
 * ============================================================
 *
 * Purpose:
 * Starts the customer password-reset flow.
 *
 * Responsibilities:
 * - Accept customer email address.
 * - Never reveal whether an email exists.
 * - Generate a cryptographically secure reset token.
 * - Store only the SHA-256 token hash in the database.
 * - Expire reset tokens after 30 minutes.
 * - Invalidate previous unused reset tokens for the user.
 * - Send the password-reset email through ExportOS email service.
 *
 * This route does NOT:
 * - modify the existing customer login route.
 * - modify Google OAuth.
 * - change the user's password.
 * - expose the reset token in the API response.
 *
 * ============================================================
 */

import { createHash, randomBytes } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { sendEmail } from "@/lib/email/sendEmail";

/**
 * Normalize an email address before database lookup.
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Hash the raw reset token before storing it in the database.
 *
 * The raw token is sent only to the user's email.
 * The database stores only this hash.
 */
function hashResetToken(token: string): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

/**
 * Resolve the public application origin used in
 * the password-reset link.
 *
 * Production should use SAAS_APP_URL.
 * Local development falls back to the current request origin.
 */
function getApplicationOrigin(request: NextRequest): string {
  const configuredOrigin =
  process.env.NEXT_PUBLIC_SAAS_APP_URL?.trim();

  if (configuredOrigin) {
    return configuredOrigin.replace(/\/+$/, "");
  }

  return request.nextUrl.origin;
}

/**
 * Generic response intentionally used for both:
 * - existing accounts
 * - non-existing accounts
 *
 * This prevents email-account enumeration.
 */
function genericResponse() {
  return NextResponse.json(
    {
      success: true,
      message:
        "If an account exists for that email address, a password reset link has been sent.",
    },
    { status: 200 },
  );
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body = await request.json();

    const email =
      typeof body?.email === "string"
        ? normalizeEmail(body.email)
        : "";

    /**
     * We intentionally use the same generic response
     * for an empty/invalid email rather than exposing
     * account information.
     */
    if (!email) {
      return genericResponse();
    }

    /**
     * ========================================================
     * Find customer account
     * ========================================================
     */
    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    /**
     * Do not reveal whether the email exists.
     */
    if (!user) {
      return genericResponse();
    }

    /**
     * ========================================================
     * Account status
     * ========================================================
     *
     * Do not issue reset links for inactive accounts.
     */
    if (!user.isActive) {
      return genericResponse();
    }

    /**
     * ========================================================
     * Password credential
     * ========================================================
     *
     * Google-only accounts may not have a passwordHash.
     * In that case there is no password to reset.
     */
    if (!user.passwordHash) {
      return genericResponse();
    }

    /**
     * ========================================================
     * Invalidate previous unused reset tokens
     * ========================================================
     *
     * Only the newest reset request remains usable.
     */
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
    });

    /**
     * ========================================================
     * Generate secure reset token
     * ========================================================
     */
    const rawToken =
      randomBytes(32).toString("hex");

    const tokenHash =
      hashResetToken(rawToken);

    /**
     * Reset token validity:
     * 30 minutes from creation.
     */
    const expiresAt =
      new Date(
        Date.now() + 30 * 60 * 1000,
      );

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    /**
     * ========================================================
     * Build password-reset URL
     * ========================================================
     */
    const applicationOrigin =
      getApplicationOrigin(request);

    const resetUrl =
      `${applicationOrigin}/reset-password?token=${encodeURIComponent(rawToken)}`;

    /**
     * ========================================================
     * Send password-reset email
     * ========================================================
     */
    try {
      await sendEmail({
        to: user.email,
        subject:
          "Reset your ROOTYM ExportOS password",
        text: [
          "Hello,",
          "",
          "We received a request to reset your ROOTYM ExportOS password.",
          "",
          `Reset your password using this link:`,
          resetUrl,
          "",
          "This link will expire in 30 minutes.",
          "",
          "If you did not request a password reset, you can safely ignore this email.",
          "",
          "Regards,",
          "ROOTYM ExportOS",
        ].join("\n"),
        html: `
          <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937;">
            <h2 style="margin-bottom: 16px;">
              Reset your ROOTYM ExportOS password
            </h2>

            <p>Hello,</p>

            <p>
              We received a request to reset your ROOTYM ExportOS password.
            </p>

            <p style="margin: 24px 0;">
              <a
                href="${resetUrl}"
                style="
                  display: inline-block;
                  padding: 12px 20px;
                  background: #166534;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: 600;
                "
              >
                Reset Password
              </a>
            </p>

            <p>
              This link will expire in <strong>30 minutes</strong>.
            </p>

            <p>
              If you did not request a password reset, you can safely ignore
              this email.
            </p>

            <p style="margin-top: 24px;">
              Regards,<br />
              <strong>ROOTYM ExportOS</strong>
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      /**
       * Do not expose email-provider errors to the caller.
       *
       * The reset token remains in the database, but because
       * the email was not delivered, the user cannot normally
       * obtain the token.
       */
      console.error(
        "Forgot-password email delivery failed:",
        emailError,
      );
    }

    /**
     * Always return the same response.
     */
    return genericResponse();
  } catch (error) {
    console.error(
      "Forgot-password request failed:",
      error,
    );

    /**
     * Do not expose internal errors or account existence.
     */
    return genericResponse();
  }
}