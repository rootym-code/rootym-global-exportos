/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated Media Library page
 *          for the customer Website & Marketing workspace.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleUserRound,
  FileImage,
  FolderOpen,
  HardDrive,
  ImageIcon,
  LayoutDashboard,
  LockKeyhole,
  MonitorCog,
  Search,
  Settings,
  ShieldCheck,
  UploadCloud,
  Files,
} from "lucide-react";

import {
  getWebsiteMediaOverview,
  type WebsiteMediaStatus,
} from "@/app/lib/workspace/website/website-media.service";

function getStatusLabel(status: WebsiteMediaStatus) {
  switch (status) {
    case "READY":
      return "Ready";

    case "NOT_CONNECTED":
      return "Not Connected";

    case "PREPARING":
    default:
      return "Preparing";
  }
}

function getStatusClassName(status: WebsiteMediaStatus) {
  switch (status) {
    case "READY":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";

    case "NOT_CONNECTED":
      return "bg-slate-100 text-slate-500 ring-slate-200";

    case "PREPARING":
    default:
      return "bg-amber-50 text-amber-700 ring-amber-100";
  }
}

function getStatusIcon(status: WebsiteMediaStatus) {
  switch (status) {
    case "READY":
      return CheckCircle2;

    case "NOT_CONNECTED":
      return LockKeyhole;

    case "PREPARING":
    default:
      return MonitorCog;
  }
}

const mediaAreas = [
  {
    title: "Upload & Manage",
    description:
      "Upload, review and manage media assets associated with your customer website.",
    icon: UploadCloud,
  },
  {
    title: "Folders & Organization",
    description:
      "Organize website media into folders and maintain a structured asset library.",
    icon: FolderOpen,
  },
  {
    title: "Image Assets",
    description:
      "Manage images used across website pages, sections and future marketing content.",
    icon: FileImage,
  },
  {
    title: "File Assets",
    description:
      "Manage downloadable documents and other reusable website files.",
    icon: Files,
  },
  {
    title: "Media Usage",
    description:
      "Understand where media assets are used across the customer website.",
    icon: Search,
  },
  {
    title: "Storage",
    description:
      "Review future storage usage, capacity and media storage configuration.",
    icon: HardDrive,
  },
];

export default async function WebsiteMediaPage() {
  const overview = await getWebsiteMediaOverview();

  const mediaStatusIcon = getStatusIcon(
    overview.media.status
  );

  const storageStatusIcon = getStatusIcon(
    overview.media.storageStatus
  );

  const libraryStatusIcon = getStatusIcon(
    overview.media.libraryStatus
  );

  const MediaStatusIcon = mediaStatusIcon;
  const StorageStatusIcon = storageStatusIcon;
  const LibraryStatusIcon = libraryStatusIcon;

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
                <ImageIcon className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  ROOTYM
                </p>

                <p className="text-lg font-bold">
                  Media Library
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/app/workspace/website"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Website & Marketing
              </Link>

              <Link
                href="/app/workspace"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <LayoutDashboard className="h-4 w-4" />
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
                <ImageIcon className="h-4 w-4" />
                Website & Marketing
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Media Library
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Manage the images, documents and reusable media
                assets associated with your ROOTYM website.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Customer Workspace
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
                  {overview.workspace.name}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {overview.workspace.slug}
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-5 py-4 ring-1 ring-slate-200">
                <CircleUserRound className="h-5 w-5 text-slate-600" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {overview.owner.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {overview.owner.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            MEDIA STATUS
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Media Environment
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Media library status
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              These indicators show the current readiness of the
              customer website media environment.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <ImageIcon className="h-5 w-5 text-emerald-600" />
                </div>

                <MediaStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Media Library
              </p>

              <p className="mt-2 text-xl font-bold">
                {getStatusLabel(overview.media.status)}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.media.status
                )}`}
              >
                {getStatusLabel(overview.media.status)}
              </span>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <HardDrive className="h-5 w-5 text-slate-700" />
                </div>

                <StorageStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Storage
              </p>

              <p className="mt-2 text-xl font-bold">
                {getStatusLabel(
                  overview.media.storageStatus
                )}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.media.storageStatus
                )}`}
              >
                {getStatusLabel(
                  overview.media.storageStatus
                )}
              </span>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <MonitorCog className="h-5 w-5 text-slate-700" />
                </div>

                <LibraryStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Library Connection
              </p>

              <p className="mt-2 text-xl font-bold">
                {getStatusLabel(
                  overview.media.libraryStatus
                )}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.media.libraryStatus
                )}`}
              >
                {getStatusLabel(
                  overview.media.libraryStatus
                )}
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            MEDIA READINESS
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Media Readiness
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Prepare your media environment
                </h2>

                <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
                  The customer workspace boundary is ready for
                  future tenant-specific media management. Existing
                  global media records remain separate until a
                  customer website media binding is established.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-emerald-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                    <span className="text-sm font-medium text-slate-700">
                      Workspace connected
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-emerald-100">
                    <MonitorCog className="h-4 w-4 text-amber-500" />

                    <span className="text-sm font-medium text-slate-700">
                      Media environment preparing
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-emerald-100">
                    <HardDrive className="h-4 w-4 text-slate-400" />

                    <span className="text-sm font-medium text-slate-700">
                      Storage not connected
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-emerald-100">
                    <LockKeyhole className="h-4 w-4 text-slate-400" />

                    <span className="text-sm font-medium text-slate-700">
                      Media library not connected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            MEDIA MANAGEMENT AREAS
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Media Management
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Manage website assets
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              These capabilities will be enabled progressively as
              the customer website media and storage architecture
              is implemented.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {mediaAreas.map((area) => {
              const Icon = area.icon;

              return (
                <div
                  key={area.title}
                  className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                      Preparing
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold">
                    {area.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {area.description}
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
            SUBSCRIPTION CONTEXT
            ===================================================== */}

        <section className="mt-8">
          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Workspace Subscription
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  {overview.subscription.planName ??
                    "No active plan"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Status:{" "}
                  {overview.subscription.status ??
                    "No subscription"}
                </p>
              </div>

              <Link
                href="/app/billing"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Manage Billing
                <ArrowRight className="h-4 w-4" />
              </Link>
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
                ROOTYM Media Library
              </span>

              <span className="ml-2">
                · {overview.workspace.name}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/app/workspace/website"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Website & Marketing
              </Link>

              <Link
                href="/app/workspace"
                className="inline-flex items-center gap-1.5 transition hover:text-slate-900"
              >
                <LayoutDashboard className="h-4 w-4" />
                Workspace
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