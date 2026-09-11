/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Customer Workspace home and workspace identity.
 * ============================================================
 */

import {
  Building2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import {
  requireWorkspaceAccess,
} from "@/app/lib/workspace/require-workspace-access";

export default async function CustomerWorkspacePage() {
  const workspace = await requireWorkspaceAccess();
  const { membership } = workspace;

  return (
    <main className="min-h-full bg-gradient-to-br from-slate-50 via-white to-green-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">

        {/* =====================================================
            WELCOME
            ===================================================== */}
        <section className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm sm:p-9">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
              <Building2 className="h-4 w-4" />
              Workspace
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome, {membership.tenant.name}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              This is your central ROOTYM workspace. Use the navigation
              on the left to access your business, website, integrations
              and account settings.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-400/20">
                <CheckCircle2 className="h-4 w-4" />
                Workspace Active
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 ring-1 ring-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {String(membership.role)}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WORKSPACE IDENTITY
            ===================================================== */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Workspace Identity
            </p>

            <h2 className="mt-2 text-xl font-bold tracking-tight">
              Current workspace
            </h2>
          </div>

          <dl className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Workspace
              </dt>

              <dd className="text-sm font-semibold text-slate-900 sm:col-span-2">
                {membership.tenant.name}
              </dd>
            </div>

            <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Workspace Slug
              </dt>

              <dd className="break-all text-sm font-medium text-slate-700 sm:col-span-2">
                {membership.tenant.slug}
              </dd>
            </div>

            <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Signed-in Customer
              </dt>

              <dd className="text-sm font-medium text-slate-700 sm:col-span-2">
                {membership.user.name}
                <span className="ml-2 text-slate-400">
                  ({membership.user.email})
                </span>
              </dd>
            </div>
          </dl>
        </section>

      </div>
    </main>
  );
}
