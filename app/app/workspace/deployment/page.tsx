/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated Domain & Deployment
 *          workspace area for future domain, deployment and
 *          production configuration capabilities.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CloudCog,
  Globe2,
  LayoutDashboard,
  LockKeyhole,
  ServerCog,
  Settings,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

const deploymentModules = [
  {
    title: "Domain Management",
    description:
      "Manage customer domains, website addresses and future domain connection workflows.",
    icon: Globe2,
    status: "Preparing",
  },
  {
    title: "Deployment Configuration",
    description:
      "Configure website deployment targets and environment-specific deployment settings.",
    icon: CloudCog,
    status: "Preparing",
  },
  {
    title: "Production Environment",
    description:
      "Manage future production environment configuration and controlled release workflows.",
    icon: ServerCog,
    status: "Preparing",
  },
  {
    title: "SSL & Security",
    description:
      "Manage future SSL, secure domain and website security configuration.",
    icon: LockKeyhole,
    status: "Preparing",
  },
  {
    title: "Deployment Workflows",
    description:
      "Prepare controlled publishing, deployment and release workflows for customer websites.",
    icon: Workflow,
    status: "Preparing",
  },
];

export default async function DomainDeploymentPage() {
  const workspace = await requireWorkspaceAccess();

  const { membership } = workspace;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        {/* =====================================================
            TOP NAVIGATION
            ===================================================== */}

        <header className="mb-8">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950">
                <ServerCog className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  ROOTYM
                </p>

                <p className="text-lg font-bold">
                  Domain & Deployment
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/app/workspace"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Workspace
              </Link>

              <Link
                href="/settings"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
        </header>

        {/* =====================================================
            MODULE HEADER
            ===================================================== */}

        <section className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm sm:p-9">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
                <ServerCog className="h-4 w-4" />
                Domain & Deployment
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Manage your digital infrastructure
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Manage the domains, deployment configuration and
                future production controls that connect your ROOTYM
                workspace to its customer-facing digital environment.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {String(membership.role)}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 ring-1 ring-white/10">
                Module Preparing
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WORKSPACE CONTEXT
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Workspace
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {membership.tenant.name}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {membership.tenant.slug}
                </p>
              </div>

              <Link
                href="/app/workspace"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                Workspace Home
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            DEPLOYMENT CAPABILITIES
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Deployment Capabilities
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Manage your digital environment
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Domain and deployment capabilities will be
              progressively enabled as the ROOTYM customer platform
              and website infrastructure are built.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {deploymentModules.map((module) => {
              const Icon = module.icon;

              return (
                <div
                  key={module.title}
                  className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                      {module.status}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {module.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {module.description}
                  </p>

                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400">
                      Coming soon
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            DEPLOYMENT ARCHITECTURE
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Deployment Architecture
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Controlled path from workspace to production
                </h2>

                <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                  This workspace area will provide the customer-facing
                  control layer for domains, website deployment and
                  production configuration. Deployment infrastructure
                  will remain separated from business configuration
                  and application workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FOOTER NAVIGATION
            ===================================================== */}

        <footer className="mt-10 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-semibold text-slate-700">
                ROOTYM Domain & Deployment
              </span>

              <span className="ml-2">
                · {membership.tenant.name}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/app/workspace"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Workspace
              </Link>

              <Link
                href="/app"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <LayoutDashboard className="h-4 w-4" />
                Control Center
              </Link>

              <Link
                href="/settings"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}