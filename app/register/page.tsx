/**
 * ============================================================
 * ROOTYM Customer Registration Page
 * ============================================================
 * Purpose:
 * Provides the customer-facing account creation UI.
 *
 * Responsibilities:
 * - Collect customer name, email and password.
 * - Validate the registration form before submission.
 * - Call the existing customer registration API.
 * - Clearly handle existing-account and registration errors.
 * - Offer Google authentication.
 * - Provide navigation back to the ROOTYM marketing website.
 *
 * Registration API:
 *   POST /api/auth/register
 *
 * The registration API creates:
 *   User + Tenant + OWNER Membership
 *
 * Authentication/session creation remains handled separately.
 * ============================================================
 */

"use client";

import { FormEvent, useMemo, useState } from "react";

type RegistrationResponse = {
  success?: boolean;
  message?: string;
  customer?: {
    id: string;
    email: string;
    name: string;
    isActive: boolean;
  };
  workspace?: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
};

function getMarketingUrl(): string {
  if (typeof window === "undefined") {
    return "http://localhost:3000/";
  }

  return window.location.hostname === "export.rootym.com"
    ? "https://export.rootym.com/"
    : "http://localhost:3000/";
}

export default function RegisterPage() {
  const marketingUrl = useMemo(() => getMarketingUrl(), []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!normalizedEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: trimmedName,
          email: normalizedEmail,
          password,
        }),
      });

      const data = (await response.json()) as RegistrationResponse;

      if (!response.ok || !data.success) {
        if (response.status === 409) {
          setErrorMessage(
            "An account with this email already exists. Please sign in instead."
          );
        } else {
          setErrorMessage(
            data.message || "Unable to create your ROOTYM account."
          );
        }

        return;
      }

      setPassword("");
      setConfirmPassword("");

      setSuccessMessage(
        "Your ROOTYM account and workspace have been created successfully. You can now sign in."
      );
    } catch (error) {
      console.error("Customer registration request failed:", error);

      setErrorMessage(
        "We could not connect to ROOTYM. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGoogleSignIn() {
    window.location.href = "/api/auth/google";
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <div className="relative flex min-h-screen flex-col items-center px-6 py-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 flex w-full max-w-md flex-1 flex-col">
          <a
            href={marketingUrl}
            className="mb-10 flex items-center justify-center gap-3 text-sm font-medium text-slate-300 transition hover:text-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-lg font-bold text-emerald-400">
              R
            </span>

            <span>
              <span className="font-semibold text-white">ROOTYM</span>
              <span className="ml-2 text-slate-400">SaaS Platform</span>
            </span>
          </a>

          <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="text-center">
              <p className="text-sm font-semibold tracking-wide text-emerald-400">
                ROOTYM SaaS
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight">
                Create your account
              </h1>

              <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-400">
                Create your ROOTYM workspace and start managing your business,
                website, branding, domain and deployment from one place.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Use at least 8 characters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Re-enter your password"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {errorMessage ? (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-200"
                >
                  {errorMessage}

                  {errorMessage.includes("already exists") ? (
                    <div className="mt-2">
                      <a
                        href="/login"
                        className="font-semibold text-emerald-400 hover:text-emerald-300"
                      >
                        Go to Sign in
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {successMessage ? (
                <div
                  role="status"
                  className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm leading-5 text-emerald-200"
                >
                  {successMessage}

                  <div className="mt-2">
                    <a
                      href="/login"
                      className="font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      Continue to Sign in
                    </a>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-emerald-500 px-5 py-4 text-base font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="mt-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Or
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              <span className="text-lg font-bold">G</span>
              Continue with Google
            </button>

            <p className="mt-7 text-center text-sm text-slate-400">
              Already have a ROOTYM account?{" "}
              <a
                href="/login"
                className="font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                Sign in
              </a>
            </p>
          </section>

          <a
            href={marketingUrl}
            className="mt-7 text-center text-sm text-slate-500 transition hover:text-slate-300"
          >
            ← Back to ROOTYM
          </a>
        </div>
      </div>
    </main>
  );
}
