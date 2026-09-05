/**
 * ROOTYM ExportOS
 * Author: Prem Singh
 * Purpose: Resolve and render published CMS pages in the public Website context.
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
      isActive: true,
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

  const pageContent = renderCmsPageContent({
    translation,
    pageTemplate: page.template,
    locale,
  });

  if (page.layout === CmsPageLayout.WEBSITE) {
    return (
      <>
        <Navbar />
        {pageContent}
        <Footer />
      </>
    );
  }

  return pageContent;
}
