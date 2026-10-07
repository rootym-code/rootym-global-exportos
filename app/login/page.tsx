"use client";

/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose:
 * Premium customer login page for ROOTYM ExportOS.
 *
 * Supports:
 * - Email/password authentication
 * - Existing Google OAuth
 * - Customer session cookie integration
 * - Registration entry point
 * - Trial intent through /login?intent=trial
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
            "Content-Type": "application/json",
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
       * Full browser navigation is intentional so
       * the next server request uses the new session.
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
    <main className="min-h-screen overflow-hidden bg-[#030817] text-white">
      <div className="relative min-h-screen">
        {/* ================================================== */}
        {/* Background */}
        {/* ================================================== */}

        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />

          <div className="absolute left-[-180px] top-[20%] h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[120px]" />

          <div className="absolute right-[-160px] top-[-100px] h-[480px] w-[480px] rounded-full bg-emerald-500/10 blur-[120px]" />

          <div className="absolute bottom-[-220px] left-[35%] h-[420px] w-[420px] rounded-full bg-cyan-500/5 blur-[120px]" />
        </div>

        {/* ================================================== */}
        {/* Main shell */}
        {/* ================================================== */}

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1240px] items-center px-5 py-6 sm:px-8 lg:px-10">
          <div className="grid w-full overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">

            {/* ================================================== */}
            {/* LEFT BRAND / PRODUCT PANEL */}
            {/* ================================================== */}

            <section className="relative hidden overflow-hidden border-r border-white/10 bg-gradient-to-br from-slate-950 via-[#061225] to-[#04131b] p-10 lg:flex lg:min-h-[690px] lg:flex-col">
              {/* Decorative glow */}
              <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-[360px] w-[360px] rounded-full bg-cyan-400/10 blur-[100px]" />

              <div className="pointer-events-none absolute bottom-[-140px] left-[-100px] h-[300px] w-[300px] rounded-full bg-emerald-400/10 blur-[100px]" />

              {/* Brand */}
              <a
                href={MARKETING_HOME_URL}
                className="relative z-10 inline-flex w-fit items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-400 text-lg font-black text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.25)]">
                  R
                </div>

                <div>
                  <div className="text-[17px] font-black tracking-[0.28em] text-white">
                    ROOTYM
                  </div>

                  <div className="mt-0.5 text-[10px] font-semibold tracking-[0.3em] text-slate-500">
                    EXPORTOS
                  </div>
                </div>
              </a>

              {/* Main message */}
              <div className="relative z-10 mt-auto max-w-[480px] pb-8">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                  Intelligent Export Operations
                </div>

                <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white">
                  Export smarter.
                  <span className="mt-1 block text-cyan-400">
                    Grow globally.
                  </span>
                </h1>

                <p className="mt-6 max-w-[440px] text-[15px] leading-7 text-slate-400">
                  ROOTYM ExportOS brings your products,
                  customers, websites, domains and deployment
                  into one connected business workspace.
                </p>

                {/* Product highlights */}
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                    <div className="text-lg font-semibold text-white">
                      One workspace
                    </div>

                    <div className="mt-1 text-xs leading-5 text-slate-500">
                      Manage your export business from one place.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                    <div className="text-lg font-semibold text-white">
                      Built for growth
                    </div>

                    <div className="mt-1 text-xs leading-5 text-slate-500">
                      Connect operations, products and digital presence.
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between border-t border-white/8 pt-5 text-[11px] text-slate-600">
                <span>ROOTYM ExportOS</span>
                <span>Rooted in India. Built for global business.</span>
              </div>
            </section>

            {/* ================================================== */}
            {/* RIGHT AUTH PANEL */}
            {/* ================================================== */}

            <section className="flex min-h-[690px] flex-col justify-center bg-[#07101f]/95 px-6 py-8 sm:px-10 lg:px-12">
              {/* Mobile brand */}
              <div className="mb-7 flex items-center justify-between lg:hidden">
                <a
                  href={MARKETING_HOME_URL}
                  className="inline-flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-lg font-black text-slate-950">
                    R
                  </div>

                  <div>
                    <div className="text-sm font-black tracking-[0.25em]">
                      ROOTYM
                    </div>

                    <div className="text-[9px] font-semibold tracking-[0.28em] text-slate-500">
                      EXPORTOS
                    </div>
                  </div>
                </a>
              </div>

              <div className="mx-auto w-full max-w-[500px]">
                {/* Trial / Login badge */}
                <div className="mb-5">
                  <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                    {isTrialIntent
                      ? "Start Your Free Trial"
                      : "Customer Sign In"}
                  </span>
                </div>

                {/* Heading */}
                <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.035em] text-white sm:text-[38px] sm:leading-[1.05]">
                    {isTrialIntent
                      ? "Start your journey."
                      : "Welcome back."}
                  </h2>

                  <p className="mt-3 max-w-[470px] text-sm leading-6 text-slate-400">
                    {isTrialIntent
                      ? "Create or access your ROOTYM workspace and start exploring ExportOS."
                      : "Sign in to manage your export business from one connected ROOTYM workspace."}
                  </p>
                </div>

                {/* Trial highlight */}
                {isTrialIntent && (
                  <div className="mt-6 flex items-center gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-300">
                      ✓
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-emerald-300">
                        30-Day Free Trial
                      </div>

                      <div className="mt-0.5 text-xs leading-5 text-slate-400">
                        Explore ROOTYM ExportOS and build your business workspace during your trial.
                      </div>
                    </div>
                  </div>
                )}

                {/* Error */}
                {errorMessage && (
                  <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-200">
                    {errorMessage}
                  </div>
                )}

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-300"
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
                      className="h-12 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-slate-900 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-300"
                      >
                        Password
                      </label>

                      <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-cyan-300 transition hover:text-cyan-200 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

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
                      className="h-12 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-slate-900 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-cyan-400 px-5 text-sm font-bold text-slate-950 shadow-[0_8px_30px_rgba(34,211,238,0.16)] transition hover:bg-cyan-300 hover:shadow-[0_10px_35px_rgba(34,211,238,0.22)] focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#07101f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting
                      ? "Signing in..."
                      : "Sign in to ExportOS"}
                  </button>
                </form>

                {/* Registration */}
                <div className="mt-5 text-center text-sm">
                  <span className="text-slate-500">
                    New to ROOTYM?
                  </span>{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                  >
                    Create an account
                  </Link>
                </div>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/8" />

                  <span className="text-[10px] font-semibold tracking-[0.16em] text-slate-600">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-white/8" />
                </div>

                {/* Google */}
                <a
                  href={googleAuthUrl}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
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
                  <p className="mt-3 text-center text-[11px] leading-5 text-slate-600">
                    Your free-trial request will continue through Google authentication.
                  </p>
                )}

                {/* Bottom navigation */}
                <div className="mt-7 flex items-center justify-between border-t border-white/8 pt-5">
                  <a
                    href={MARKETING_HOME_URL}
                    className="text-xs font-medium text-slate-500 transition hover:text-slate-300"
                  >
                    ← Back to ROOTYM
                  </a>

                  <span className="text-[10px] text-slate-700">
                    Secure customer authentication
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}