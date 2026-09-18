/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Public Website
 * Feature     : Tenant Request Quote Page
 * Purpose     : Provides a Website-scoped Request Quote page
 *               using the existing ExportInquiryForm and
 *               tenant business identity.
 * ============================================================
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ExportInquiryForm from "@/components/forms/ExportInquiryForm";

import { ProductStatus } from "@/lib/generated/prisma";
import { listProducts } from "@/lib/services/product.service";
import prisma from "@/lib/prisma";
import { getSubscriptionAccessStatus } from "@/lib/services/billing/subscription-access.service";

type PageProps = {
  params: Promise<{
    websiteSlug: string;
    locale: string;
  }>;
};

/**
 * ============================================================
 * WEBSITE RESOLVER
 * ============================================================
 */

async function getWebsite(websiteSlug: string) {
  return prisma.website.findUnique({
    where: {
      slug: websiteSlug,
    },
    select: {
      id: true,
      name: true,
      isActive: true,

      branding: {
        select: {
          logoMedia: {
            select: {
              fileUrl: true,
            },
          },
          primaryColor: true,
          secondaryColor: true,
          accentColor: true,
          fontFamily: true,
        },
      },

      configuration: {
        select: {
          websiteTitle: true,
          tagline: true,
          websiteDescription: true,
        },
      },

      tenant: {
        select: {
          id: true,
          businessProfile: {
            select: {
              businessName: true,
              legalName: true,
              description: true,
            },
          },

          businessAddress: {
            select: {
              addressLine1: true,
              addressLine2: true,
              city: true,
              state: true,
              postalCode: true,
              country: true,
            },
          },

          businessContactCommunication: {
            select: {
              primaryEmail: true,
              primaryPhone: true,
              whatsapp: true,
              linkedinUrl: true,
              facebookUrl: true,
              instagramUrl: true,
              youtubeUrl: true,
            },
          },
        },
      },
    },
  });
}

/**
 * ============================================================
 * METADATA
 * ============================================================
 */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { websiteSlug } = await params;

  const website = await getWebsite(websiteSlug);

  if (!website || !website.isActive) {
    return {};
  }

  const businessName =
    website.tenant.businessProfile?.businessName?.trim() ||
    website.name;

  const websiteTitle =
    website.configuration?.websiteTitle?.trim() ||
    businessName;

  const websiteDescription =
    website.configuration?.websiteDescription?.trim() ||
    website.tenant.businessProfile?.description?.trim() ||
    undefined;

  return {
    title: `Request a Quote | ${websiteTitle}`,
    description:
      websiteDescription ||
      `Submit a product and export enquiry to ${businessName}.`,
  };
}

/**
 * ============================================================
 * PUBLIC TENANT REQUEST QUOTE PAGE
 * ============================================================
 */

export default async function TenantRequestQuotePage({
  params,
}: PageProps) {
  const { websiteSlug, locale } = await params;

  const website = await getWebsite(websiteSlug);

  if (!website || !website.isActive) {
    notFound();
  }

  /**
   * ------------------------------------------------------------
   * SUBSCRIPTION ACCESS
   * ------------------------------------------------------------
   *
   * An expired or unsubscribed customer Website must not expose
   * its public Request Quote page or inquiry form.
   *
   * The check is server-side and runs before tenant contact data,
   * business context, products, or the enquiry form are resolved.
   * ------------------------------------------------------------
   */

  const subscriptionAccess =
    await getSubscriptionAccessStatus(
      website.tenant.id,
    );

  const websiteAccessBlocked =
    subscriptionAccess.status === "EXPIRED" ||
    subscriptionAccess.status === "NO_SUBSCRIPTION";

  if (websiteAccessBlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-slate-900">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl font-semibold text-slate-700">
            R
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            ROOTYM Website
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            This Website is currently offline
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">
            This customer Website is temporarily unavailable because the
            ROOTYM subscription is not currently active.
          </p>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            The Website owner can restore it by activating a ROOTYM
            subscription.
          </p>
        </div>
      </main>
    );
  }

  const businessProfile =
    website.tenant.businessProfile;

  const businessName =
    businessProfile?.businessName?.trim() ||
    website.name;

  const businessIdentity = {
    businessName:
      businessProfile?.businessName ?? null,
    legalName:
      businessProfile?.legalName ?? null,
  };

  const businessAddress =
    website.tenant.businessAddress;

  const businessContact =
    website.tenant
      .businessContactCommunication;

  const websiteBranding = {
    companyName: businessName,

    logoMediaUrl:
      website.branding?.logoMedia?.fileUrl ??
      null,

    primaryColor:
      website.branding?.primaryColor ??
      null,

    secondaryColor:
      website.branding?.secondaryColor ??
      null,

    accentColor:
      website.branding?.accentColor ??
      null,

    fontFamily:
      website.branding?.fontFamily ??
      null,
  };

  /**
   * ------------------------------------------------------------
   * Website-scoped published products
   * ------------------------------------------------------------
   */

  const { items: products } = await listProducts(
    website.id,
    {
      status: ProductStatus.PUBLISHED,
      page: 1,
      pageSize: 100,
    },
  );

  const serializedProducts = products
    .filter(
      (product) =>
        product.id &&
        product.name &&
        product.slug,
    )
    .map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
    }));

  return (
    <>
      <Navbar
        websiteSlug={websiteSlug}
        websiteBranding={websiteBranding}
      />

      <main className="bg-gray-50">
        {/* ======================================================
            HERO
            ====================================================== */}

        <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-950">
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl" />

            <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-green-600/10 blur-3xl" />

            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

          <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-36 text-center lg:px-8">
            <span className="inline-flex rounded-full border border-green-400/30 bg-white/10 px-5 py-2 text-sm font-semibold text-green-100 backdrop-blur-md">
              Export Enquiry
            </span>

            <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
              Request a
              <span className="block bg-gradient-to-r from-green-300 via-emerald-200 to-lime-300 bg-clip-text text-transparent">
                Customized Quote
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-4xl text-lg leading-8 text-green-100/90 md:text-xl">
              Tell {businessName} about your product, quantity, packaging,
              destination and commercial requirements. The enquiry will be
              routed through the existing business enquiry workflow.
            </p>
          </div>
        </section>

        {/* ======================================================
            BUSINESS CONTEXT
            ====================================================== */}

        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  {businessName}
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {website.configuration?.tagline?.trim() ||
                    "Business enquiries and commercial sourcing."}
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  Business Contact
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {businessContact?.primaryEmail?.trim() ||
                    "Email available on request"}
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {businessContact?.primaryPhone?.trim() ||
                    "Phone available on request"}
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  Business Location
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {[
                    businessAddress?.city,
                    businessAddress?.state,
                    businessAddress?.country,
                  ]
                    .map((value) => value?.trim())
                    .filter(Boolean)
                    .join(", ") ||
                    "Business location available on request"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            QUOTE FORM
            ====================================================== */}

        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
                Enquiry Form
              </span>

              <h2 className="mt-6 text-4xl font-bold text-gray-900">
                Tell Us About Your Requirements
              </h2>

              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                Select a product from the {businessName} catalogue and provide
                the commercial details needed to prepare your enquiry.
              </p>
            </div>

            <div className="mx-auto max-w-5xl">
              <ExportInquiryForm
                products={serializedProducts}
              />
            </div>
          </div>
        </section>

        {/* ======================================================
            TENANT TRUST BANNER
            ====================================================== */}

        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 p-10 text-center text-white shadow-2xl">
              <h2 className="text-3xl font-bold">
                Submit Your Business Enquiry
              </h2>

              <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-green-100">
                Provide accurate product, quantity and destination information
                so {businessName} can review your requirements and respond with
                the appropriate commercial next steps.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer
        websiteBranding={websiteBranding}
        websiteConfiguration={
          website.configuration
        }
        businessIdentity={
          businessIdentity
        }
        businessAddress={
          businessAddress
        }
        businessContactCommunication={
          businessContact
        }
      />
    </>
  );
}
