"use client";

/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose:
 * Customer login page supporting:
 * - Email/password authentication
 * - Existing Google OAuth
 * - Customer session cookie integration through /api/auth/login
 * - Registration entry point
 *
 * Important:
 * - Google OAuth flow is not modified.
 * - Customer authentication remains separate from Admin auth.
 * - Successful email/password login redirects to the
 *   existing authenticated SaaS entry point.
 * ============================================================
 */

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type LoginError =
  | "authentication_required"
  | "account_inactive"
  | "oauth_state"
  | "oauth_failed"
  | null;

function getErrorMessage(error: LoginError): string | null {
  switch (error) {
    case "authentication_required":
      return "Please sign in to access your ROOTYM workspace.";

    case "account_inactive":
      return "Your ROOTYM customer account is inactive. Please contact support.";

    case "oauth_state":
      return "The sign-in request expired or was invalid. Please try again.";

    case "oauth_failed":
      return "Google sign-in could not be completed. Please try again.";

    default:
      return null;
  }
}

const MARKETING_HOME_URL =
  process.env.NODE_ENV === "production"
    ? "https://export.rootym.com/"
    : "http://localhost:3000/";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [isTrialIntent, setIsTrialIntent] = useState(false);
  const [googleAuthUrl, setGoogleAuthUrl] =
    useState("/api/auth/google");

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const error =
      params.get("error") as LoginError;

    const intent =
      params.get("intent");

    const oauthError =
      getErrorMessage(error);

    if (oauthError) {
      setErrorMessage(oauthError);
    }

    if (intent === "trial") {
      setIsTrialIntent(true);

      setGoogleAuthUrl(
        "/api/auth/google?intent=trial"
      );
    }
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(
          data?.message ||
            "Unable to sign in. Please check your email and password."
        );

        return;
      }

      /**
       * The API sets the HTTP-only
       * rootym_customer_token cookie.
       *
       * A full browser navigation is intentional here so
       * the next server request uses the newly established
       * customer session.
       */
      window.location.assign("/");
    } catch (error) {
      console.error(
        "Customer login failed:",
        error
      );

      setErrorMessage(
        "Unable to sign in right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />

          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Brand */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-xl font-bold text-emerald-400">
                R
              </div>

              <div className="text-left">
                <div className="text-lg font-semibold tracking-tight">
                  ROOTYM
                </div>

                <div className="text-xs text-slate-400">
                  SaaS Platform
                </div>
              </div>
            </Link>
          </div>

          {/* Login card */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
            <div className="text-center">
              <p className="text-sm font-medium text-emerald-400">
                ROOTYM SaaS
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                Welcome back
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Sign in to manage your business,
                website, branding, domain and
                deployment from one workspace.
              </p>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-200">
                {errorMessage}
              </div>
            )}

            {/* Email/password login */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Signing in..."
                  : "Sign in"}
              </button>
            </form>

            {/* New customer */}
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="text-slate-400">
                New to ROOTYM?
              </span>

              <Link
                href="/register"
                className="font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                Create an account
              </Link>
            </div>

            {/* Forgot password intentionally omitted for now */}

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs text-slate-500">
                OR
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Google sign-in */}
            <a
              href={googleAuthUrl}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.23c0-.79-.07-1.55-.2-2.28H12v4.31h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.92-4.18 2.92-7.39Z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.51A9.75 9.75 0 0 0 12 21.5Z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.54 13.6A5.86 5.86 0 0 1 6.23 12c0-.56.11-1.1.31-1.6V7.89H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.11l3.24-2.51Z"
                />

                <path
                  fill="#EA4335"
                  d="M12 6.37c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.48 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.7 5.39l3.24 2.51c.77-2.31 2.92-4.03 5.46-4.03Z"
                />
              </svg>

              Continue with Google
            </a>

            {isTrialIntent && (
              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                Your free-trial request will continue
                through Google authentication.
              </p>
            )}
          </section>

          {/* Footer */}
          <div className="mt-6 text-center">
            <a
              href={MARKETING_HOME_URL}
              className="text-sm text-slate-500 transition hover:text-slate-300"
            >
              ← Back to ROOTYM
            </a>

            <p className="mt-4 text-xs text-slate-600">
              Secure authentication for your ROOTYM
              customer workspace.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}