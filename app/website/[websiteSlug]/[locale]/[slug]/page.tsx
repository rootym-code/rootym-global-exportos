/**
 * ============================================================
 * ROOTYM Customer Website CMS Page
 * ============================================================
 * Author: Prem Singh
 * Purpose: Resolves and renders Website-scoped published CMS
 *          pages using the shared public CMS renderer while
 *          keeping Product Detail routes under /products/[slug].
 * ============================================================
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { renderCmsPageContent } from "@/components/public/cms-page-renderer";
import { CmsPageStatus } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import cmsPageService from "@/lib/services/cms/page.service";
import { getSubscriptionAccessStatus } from "@/lib/services/billing/subscription-access.service";

type PageProps = {
  params: Promise<{
    websiteSlug: string;
    locale: string;
    slug: string;
  }>;
};

async function getWebsite(websiteSlug: string) {
  return prisma.website.findUnique({
    where: { slug: websiteSlug },
    select: {
      id: true,
      name: true,
      isActive: true,
      branding: {
        select: {
          logoMedia: { select: { fileUrl: true } },
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

async function getPublishedCmsPage(
  websiteId: string,
  locale: string,
  slug: string,
) {
  const page = await cmsPageService.getByWebsiteAndSlug(
    websiteId,
    slug,
  );

  if (!page || page.status !== CmsPageStatus.PUBLISHED) {
    return null;
  }

  const translation =
    page.translations.find(
      (item) =>
        item.isPublished &&
        item.language.code.toLowerCase() === locale.toLowerCase(),
    ) ||
    page.translations.find(
      (item) =>
        item.isPublished &&
        item.language.code.toLowerCase() === "en",
    ) ||
    page.translations.find((item) => item.isPublished);

  if (!translation) {
    return null;
  }

  return { page, translation };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { websiteSlug, locale, slug } = await params;
  const website = await getWebsite(websiteSlug);

  if (!website || !website.isActive) {
    return {};
  }

  const resolved = await getPublishedCmsPage(
    website.id,
    locale,
    slug,
  );

  if (!resolved) {
    return {};
  }

  const websiteTitle =
    website.configuration?.websiteTitle?.trim() ||
    website.tenant.businessProfile?.businessName?.trim() ||
    website.name;

  const metaTitle =
    resolved.translation.metaTitle?.trim() ||
    resolved.translation.title?.trim();

  return {
    title: metaTitle
      ? `${metaTitle} | ${websiteTitle}`
      : websiteTitle,
    description:
      resolved.translation.metaDescription?.trim() ||
      resolved.translation.excerpt?.trim() ||
      website.configuration?.websiteDescription?.trim() ||
      website.tenant.businessProfile?.description?.trim() ||
      undefined,
  };
}

export default async function CustomerWebsiteCmsPage({
  params,
}: PageProps) {
  const { websiteSlug, locale, slug } = await params;
  const website = await getWebsite(websiteSlug);

  if (!website || !website.isActive) {
    notFound();
  }

  /*
   * ============================================================
   * SERVER-SIDE SUBSCRIPTION ACCESS
   * ============================================================
   * Prevents expired or unsubscribed customers from serving
   * published CMS content by bypassing the public Website UI.
   * ============================================================
   */

  const subscriptionAccess =
    await getSubscriptionAccessStatus(website.tenant.id);

  const websiteAccessBlocked =
    subscriptionAccess.status === "EXPIRED" ||
    subscriptionAccess.status === "NO_SUBSCRIPTION";

  if (websiteAccessBlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-slate-900">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl font-bold text-slate-700">
            R
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            ROOTYM Website
          </p>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
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

  const resolved = await getPublishedCmsPage(
    website.id,
    locale,
    slug,
  );

  if (!resolved) {
    notFound();
  }

  const businessProfile = website.tenant.businessProfile;

  const websiteBranding = {
    companyName:
      businessProfile?.businessName?.trim() ||
      website.name,
    logoMediaUrl:
      website.branding?.logoMedia?.fileUrl ?? null,
    primaryColor: website.branding?.primaryColor ?? null,
    secondaryColor: website.branding?.secondaryColor ?? null,
    accentColor: website.branding?.accentColor ?? null,
    fontFamily: website.branding?.fontFamily ?? null,
  };

  const pageContent = renderCmsPageContent({
    translation: resolved.translation,
    pageTemplate: resolved.page.template,
    locale,
    branding: websiteBranding,
  });

  if (resolved.page.layout === "WEBSITE") {
    return (
      <>
        <Navbar websiteBranding={websiteBranding} />
        {pageContent}
        <Footer
          websiteSlug={websiteSlug}
          locale={locale}
          websiteBranding={websiteBranding}
          websiteConfiguration={website.configuration}
          businessIdentity={{
            businessName: businessProfile?.businessName ?? null,
            legalName: businessProfile?.legalName ?? null,
          }}
          businessAddress={website.tenant.businessAddress}
          businessContactCommunication={
            website.tenant.businessContactCommunication
          }
        />
      </>
    );
  }

  return pageContent;
}
