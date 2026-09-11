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

type PageProps = {
  params: Promise<{
    websiteSlug: string;
    locale: string;
    slug: string;
  }>;
};

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
    page.translations.find(
      (item) => item.isPublished,
    );

  if (!translation) {
    return null;
  }

  return {
    page,
    translation,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const {
    websiteSlug,
    locale,
    slug,
  } = await params;

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
  const {
    websiteSlug,
    locale,
    slug,
  } = await params;

  const website = await getWebsite(websiteSlug);

  if (!website || !website.isActive) {
    notFound();
  }

  const resolved = await getPublishedCmsPage(
    website.id,
    locale,
    slug,
  );

  if (!resolved) {
    notFound();
  }

  const businessProfile =
    website.tenant.businessProfile;

  const websiteBranding = {
    companyName:
      businessProfile?.businessName?.trim() ||
      website.name,

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

  const pageContent = renderCmsPageContent({
    translation: resolved.translation,
    pageTemplate: resolved.page.template,
    locale,
    branding: websiteBranding,
  });

  if (resolved.page.layout === "WEBSITE") {
    return (
      <>
        <Navbar
          websiteBranding={websiteBranding}
        />

        {pageContent}

        <Footer
          websiteSlug={websiteSlug}
          locale={locale}
          websiteBranding={websiteBranding}
          websiteConfiguration={
            website.configuration
          }
          businessIdentity={{
            businessName:
              businessProfile?.businessName ??
              null,
            legalName:
              businessProfile?.legalName ??
              null,
          }}
          businessAddress={
            website.tenant.businessAddress
          }
          businessContactCommunication={
            website.tenant
              .businessContactCommunication
          }
        />
      </>
    );
  }

  return pageContent;
}