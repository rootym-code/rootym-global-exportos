/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Resolve and render published CMS pages in the public
 *          Website context with Website-specific branding and
 *          tenant business identity.
 * ============================================================
 */

import { notFound } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import cmsPageService from "@/lib/services/cms/page.service";
import {
  CmsPageLayout,
  CmsPageStatus,
} from "@/lib/generated/prisma";
import { renderCmsPageContent } from "@/components/public/cms-page-renderer";

type PageProps = {
  params: Promise<{
    websiteSlug: string;
    locale: string;
    slug: string;
  }>;
};

export default async function CustomerCmsPage({
  params,
}: PageProps) {
  const { websiteSlug, locale, slug } = await params;

  const website = await prisma.website.findUnique({
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
      tenant: {
        select: {
          businessProfile: {
            select: {
              businessName: true,
              legalName: true,
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

  if (!website || !website.isActive) {
    notFound();
  }

  const page = await cmsPageService.getByWebsiteAndSlug(
    website.id,
    slug
  );

  if (!page) {
    notFound();
  }

  if (page.status !== CmsPageStatus.PUBLISHED) {
    notFound();
  }

  const translation = page.translations.find(
    (item) =>
      item.language.code.toLowerCase() === locale.toLowerCase()
  );

  if (!translation || !translation.isPublished) {
    notFound();
  }

  const businessProfile = website.tenant.businessProfile;

  const websiteBranding = {
    companyName:
      businessProfile?.businessName?.trim() || website.name,
    logoMediaUrl: website.branding?.logoMedia?.fileUrl ?? null,
    primaryColor: website.branding?.primaryColor ?? null,
    secondaryColor: website.branding?.secondaryColor ?? null,
    accentColor: website.branding?.accentColor ?? null,
    fontFamily: website.branding?.fontFamily ?? null,
  };

  const businessIdentity = {
    businessName: businessProfile?.businessName ?? null,
    legalName: businessProfile?.legalName ?? null,
  };

  const pageContent = renderCmsPageContent({
    translation,
    pageTemplate: page.template,
    locale,
    branding: websiteBranding,
  });

  if (page.layout === CmsPageLayout.WEBSITE) {
    return (
      <>
        <Navbar websiteBranding={websiteBranding} />
        {pageContent}
        <Footer
          websiteBranding={websiteBranding}
          businessIdentity={businessIdentity}
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
