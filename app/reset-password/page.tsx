"use client";

/**
 * ============================================================
 * ROOTYM ExportOS
 * Reset Password Page
 * ============================================================
 *
 * Purpose:
 * Allows a customer to create a new password using the
 * single-use reset token received by email.
 *
 * Flow:
 * /reset-password?token=...
 *   ↓
 * Enter new password
 *   ↓
 * POST /api/auth/reset-password
 *   ↓
 * Password updated
 *   ↓
 * Return to /login
 *
 * ============================================================
 */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FormEvent,
  Suspense,
  useState,
} from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError(
        "This password reset link is invalid or incomplete.",
      );
      return;
    }

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Your new password must be at least 8 characters long.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "The passwords do not match.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to reset your password. Please try again.",
        );
      }

      setMessage(
        data?.message ||
          "Your password has been reset successfully.",
      );

      setPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      console.error(
        "Reset-password request failed:",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to reset your password. Please try again.",
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
              ROOTYM{" "}
              <span className="text-emerald-700">
                ExportOS
              </span>
            </Link>

            <p className="mt-2 text-sm text-slate-500">
              Secure account access
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-slate-900">
                Reset your password
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose a new password for your ROOTYM
                ExportOS account.
              </p>
            </div>

            {!token && (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
              >
                This password reset link is invalid or
                incomplete.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* New password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  New password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your new password"
                  disabled={loading || !token}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Minimum 8 characters.
                </p>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Confirm new password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value,
                    )
                  }
                  placeholder="Enter your new password again"
                  disabled={loading || !token}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
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
              {!message && (
                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Resetting password..."
                    : "Reset Password"}
                </button>
              )}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-4 py-10">
          <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
            <div className="text-sm text-slate-500">
              Loading password reset...
            </div>
          </div>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}