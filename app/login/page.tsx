/**
 * Author: Prem Singh
 * Purpose: Provides the ROOTYM SaaS customer Google sign-in page.
 */

import Link from "next/link";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(
  error?: string
) {
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

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params =
    await searchParams;

  const errorMessage =
    getErrorMessage(params?.error);

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

            {errorMessage && (
              <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-200">
                {errorMessage}
              </div>
            )}

            {/* Google sign-in */}
            <div className="mt-8">
              <a
                href="/api/auth/google"
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
            </div>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs text-slate-500">
                SECURE SIGN-IN
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* New customer information */}
            <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-5">
              <h2 className="text-sm font-semibold text-white">
                New to ROOTYM?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Sign in with your Google account to
                create your ROOTYM workspace. You can
                start with the available trial or choose
                a paid subscription.
              </p>
            </div>

            {/* Planned capabilities */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold text-slate-200">
                  Business
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Manage your business
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold text-slate-200">
                  Website
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Build your website
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold text-slate-200">
                  Domain
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Connect your domain
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold text-slate-200">
                  Deployment
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Take your site live
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link
        href="/"
              className="text-sm text-slate-500 transition hover:text-slate-300"
            >
              ← Back to ROOTYM
            </Link>

            <p className="mt-4 text-xs text-slate-600">
              Secure authentication powered by
              Google OAuth.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}