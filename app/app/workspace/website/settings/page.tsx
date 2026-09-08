/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the tenant-scoped Website Settings page
 *          with live Business Profile, Business Address and
 *          Contact & Communication configuration.
 * ============================================================
 */

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleUserRound,
  Globe2,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  MapPin,
  MonitorCog,
  Palette,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import BusinessProfileForm from "@/app/app/workspace/business/profile/BusinessProfileForm";
import BusinessAddressForm from "@/app/app/workspace/business/address/BusinessAddressForm";
import BusinessContactCommunicationForm from "@/app/app/workspace/business/contact-communication/BusinessContactCommunicationForm";

import getBusinessProfile from "@/app/lib/workspace/business/business-profile.service";
import getBusinessAddress from "@/app/lib/workspace/business/business-address.service";
import getBusinessContactCommunication from "@/app/lib/workspace/business/business-contact-communication.service";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

import {
  getWebsiteSettingsOverview,
  type WebsiteSettingsStatus,
} from "@/app/lib/workspace/website/website-settings.service";

import WebsiteBrandingForm from "@/app/app/workspace/website/settings/WebsiteBrandingForm";

function getStatusLabel(status: WebsiteSettingsStatus) {
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

function getStatusClassName(status: WebsiteSettingsStatus) {
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

function getStatusIcon(status: WebsiteSettingsStatus) {
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

function displayValue(value: string | null | undefined) {
  return value?.trim() ? value : "Not configured";
}

export default async function WebsiteSettingsPage() {
  const [{ membership }, overview, businessProfile, businessAddress, contact] =
    await Promise.all([
      requireWorkspaceAccess(),
      getWebsiteSettingsOverview(),
      getBusinessProfile(),
      getBusinessAddress(),
      getBusinessContactCommunication(),
    ]);

  const canEdit =
    membership.role === "OWNER" || membership.role === "ADMIN";

  const settingsStatusIcon = getStatusIcon(
    overview.settings.status
  );

  const brandingStatusIcon = getStatusIcon(
    overview.settings.brandingStatus
  );

  const contactStatusIcon = getStatusIcon(
    overview.settings.contactStatus
  );

  const websiteBindingStatusIcon = getStatusIcon(
    overview.settings.websiteBindingStatus
  );

  const SettingsStatusIcon = settingsStatusIcon;
  const BrandingStatusIcon = brandingStatusIcon;
  const ContactStatusIcon = contactStatusIcon;
  const WebsiteBindingStatusIcon = websiteBindingStatusIcon;

  const businessProfileInitialData = {
    businessName: businessProfile?.businessName ?? "",
    legalName: businessProfile?.legalName ?? "",
    businessType: businessProfile?.businessType ?? "",
    email: businessProfile?.email ?? "",
    phone: businessProfile?.phone ?? "",
    country: businessProfile?.country ?? "",
    website: businessProfile?.website ?? "",
    description: businessProfile?.description ?? "",
  };

  const businessAddressInitialData = {
    addressLine1: businessAddress?.addressLine1 ?? "",
    addressLine2: businessAddress?.addressLine2 ?? "",
    city: businessAddress?.city ?? "",
    state: businessAddress?.state ?? "",
    postalCode: businessAddress?.postalCode ?? "",
    country: businessAddress?.country ?? "",
  };

  const contactInitialData = contact
    ? {
        primaryEmail: contact.primaryEmail,
        alternateEmail1: contact.alternateEmail1,
        alternateEmail2: contact.alternateEmail2,
        salesEmail: contact.salesEmail,
        infoEmail: contact.infoEmail,
        primaryPhone: contact.primaryPhone,
        alternatePhone: contact.alternatePhone,
        whatsapp: contact.whatsapp,
        linkedinUrl: contact.linkedinUrl,
        facebookUrl: contact.facebookUrl,
        instagramUrl: contact.instagramUrl,
        youtubeUrl: contact.youtubeUrl,
        googleBusinessUrl: contact.googleBusinessUrl,
        xTwitterUrl: contact.xTwitterUrl,
        pinterestUrl: contact.pinterestUrl,
        otherSocialUrls: contact.otherSocialUrls,
      }
    : null;

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
                <Settings className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  ROOTYM
                </p>

                <p className="text-lg font-bold">
                  Website Settings
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
                <Settings className="h-4 w-4" />
                Website & Marketing
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Website Settings
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Manage the business identity, address and contact
                information used by your customer website.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Customer Workspace
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-400/20">
                Settings Active
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
                  Workspace: {overview.workspace.slug}
                </p>
                <p className="mt-1 text-sm text-slate-500">
  Website settings are connected to this workspace.
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

                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                    {membership.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SETTINGS STATUS
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Settings Environment
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Website settings status
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              These indicators reflect the current tenant-scoped
              website configuration.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <Settings className="h-5 w-5 text-emerald-600" />
                </div>

                <SettingsStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Settings
              </p>

              <p className="mt-2 text-xl font-bold">
                {getStatusLabel(overview.settings.status)}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.settings.status
                )}`}
              >
                {getStatusLabel(overview.settings.status)}
              </span>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <Palette className="h-5 w-5 text-slate-700" />
                </div>

                <BrandingStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Branding
              </p>

              <p className="mt-2 text-xl font-bold">
                {getStatusLabel(
                  overview.settings.brandingStatus
                )}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.settings.brandingStatus
                )}`}
              >
                {getStatusLabel(
                  overview.settings.brandingStatus
                )}
              </span>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <Mail className="h-5 w-5 text-slate-700" />
                </div>

                <ContactStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Contact Information
              </p>

              <p className="mt-2 text-xl font-bold">
                {getStatusLabel(
                  overview.settings.contactStatus
                )}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.settings.contactStatus
                )}`}
              >
                {getStatusLabel(
                  overview.settings.contactStatus
                )}
              </span>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <Globe2 className="h-5 w-5 text-slate-700" />
                </div>

                <WebsiteBindingStatusIcon className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Website Binding
              </p>

              <p className="mt-2 text-xl font-bold">
                {getStatusLabel(
                  overview.settings.websiteBindingStatus
                )}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusClassName(
                  overview.settings.websiteBindingStatus
                )}`}
              >
                {getStatusLabel(
                  overview.settings.websiteBindingStatus
                )}
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            BUSINESS IDENTITY
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Company Identity
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Business identity
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              This information is stored against the authenticated
              workspace and can be used throughout the customer
              website.
            </p>
          </div>

          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Business Name
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {displayValue(businessProfile?.businessName)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Legal Name
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {displayValue(businessProfile?.legalName)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Business Type
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {displayValue(businessProfile?.businessType)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Country
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {displayValue(businessProfile?.country)}
                </p>
              </div>
            </div>
          </div>

          <BusinessProfileForm
            initialData={businessProfileInitialData}
            canEdit={canEdit}
          />
        </section>

        {/* =====================================================
            BUSINESS ADDRESS
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Business Location
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Primary business address
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Maintain the primary business location that can be
              presented on the customer website and business
              communication surfaces.
            </p>
          </div>

          <div className="mb-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Address
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {displayValue(businessAddress?.addressLine1)}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <Building2 className="h-5 w-5 text-slate-700" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                City / State
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {[
                  businessAddress?.city,
                  businessAddress?.state,
                ]
                  .filter(Boolean)
                  .join(", ") || "Not configured"}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <Globe2 className="h-5 w-5 text-slate-700" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Country
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {displayValue(businessAddress?.country)}
              </p>
            </div>
          </div>

          <BusinessAddressForm
            initialData={businessAddressInitialData}
            canEdit={canEdit}
          />
        </section>

        {/* =====================================================
            CONTACT & COMMUNICATION
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Contact & Communication
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Customer-facing communication
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Manage the business email addresses, phone numbers,
              WhatsApp number and official online profiles used by
              the customer website.
            </p>
          </div>

          <div className="mb-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <Mail className="h-5 w-5 text-emerald-600" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Primary Email
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                {displayValue(contact?.primaryEmail)}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <CircleUserRound className="h-5 w-5 text-slate-700" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Sales Email
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                {displayValue(contact?.salesEmail)}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <Globe2 className="h-5 w-5 text-slate-700" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                WhatsApp
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {displayValue(contact?.whatsapp)}
              </p>
            </div>
          </div>

          <BusinessContactCommunicationForm
            initialData={contactInitialData}
            canEdit={canEdit}
          />
        </section>

        {/* =====================================================
            FUTURE SETTINGS
            ===================================================== */}

        <section className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Additional Configuration
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Website configuration areas
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              These areas will be enabled as their tenant-scoped
              configuration models are implemented.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <WebsiteBrandingForm canEdit={canEdit} />
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                  <Globe2 className="h-6 w-6 text-emerald-600" />
                </div>

                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                  Preparing
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Website Configuration
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Website-level behavior, domains and customer-facing
                configuration will be managed here.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                  <SlidersHorizontal className="h-6 w-6 text-emerald-600" />
                </div>

                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                  Preparing
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold">
                General Preferences
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Default website preferences and future customer
                website options will be configured here.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                  <Settings className="h-6 w-6 text-emerald-600" />
                </div>

                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                  Preparing
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Website Integrations
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                External website services and customer-specific
                integrations will be connected here.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 md:col-span-2">
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                  <Sparkles className="h-6 w-6 text-emerald-600" />
                </div>

                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                  Preparing
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold">
                AI Website Assistance
              </h3>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                ROOTYM AI assistance for website configuration,
                content optimization and future website operations
                will be connected here.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            SUBSCRIPTION
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
                ROOTYM Website Settings
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