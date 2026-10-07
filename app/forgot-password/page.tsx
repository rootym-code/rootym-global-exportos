"use client";

/**
 * ============================================================
 * ROOTYM ExportOS
 * Forgot Password Page
 * ============================================================
 *
 * Purpose:
 * Allows a customer to request a password-reset email.
 *
 * Flow:
 * /login
 *   ↓
 * /forgot-password
 *   ↓
 * POST /api/auth/forgot-password
 *   ↓
 * Reset email
 *
 * Security:
 * - The API intentionally returns a generic response.
 * - This page does not reveal whether an email exists.
 * - No password or reset token is handled on this page.
 *
 * ============================================================
 */

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to process your request. Please try again.",
        );
      }

      setMessage(
        data?.message ||
          "If an account exists for that email address, a password reset link has been sent.",
      );

      setEmail("");
    } catch (requestError) {
      console.error(
        "Forgot-password request failed:",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to process your request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full">
          {/* Brand */}
          <div className="mb-8 text-center">
            <Link
              href="/login"
              className="inline-block text-2xl font-bold tracking-tight text-slate-900"
            >
              ROOTYM <span className="text-emerald-700">ExportOS</span>
            </Link>

            <p className="mt-2 text-sm text-slate-500">
              Secure account access
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-slate-900">
                Forgot your password?
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Enter the email address associated with your
                ROOTYM ExportOS account. If an account exists,
                we&apos;ll send you a password reset link.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  disabled={loading}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {/* Success */}
              {message && (
                <div
                  role="status"
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800"
                >
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Sending reset link..."
                  : "Send Reset Link"}
              </button>
            </form>

            {/* Back to login */}
            <div className="mt-6 border-t border-slate-100 pt-6 text-center">
              <Link
                href="/login"
                className="text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                ← Back to Login
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-slate-500">
            ROOTYM ExportOS · Secure customer access
          </p>
        </div>
      </div>
    </main>
  );
}