/**
 * ============================================================
 * ROOTYM Global ExportOS
 * Author: Prem Singh
 * Purpose: Backfill the four default CMS pages for all active
 *          customer Websites without overwriting existing pages.
 * ============================================================
 */

import prisma from "../lib/prisma";
import { CmsPageStatus } from "../lib/generated/prisma";
import type { Prisma } from "../lib/generated/prisma";

const DEFAULT_PAGES = [
  {
    title: "Home",
    slug: "home",
    isHomePage: true,
    showInMenu: true,
  },
  {
    title: "Products",
    slug: "products",
    isHomePage: false,
    showInMenu: true,
  },
  {
    title: "Request Quote",
    slug: "request-quote",
    isHomePage: false,
    showInMenu: true,
  },
  {
    title: "Contact",
    slug: "contact",
    isHomePage: false,
    showInMenu: true,
  },
] as const;

async function main() {
  const defaultLanguage = await prisma.language.findFirst({
    where: {
      isDefault: true,
      isActive: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
    select: {
      id: true,
      code: true,
      name: true,
    },
  });

  if (!defaultLanguage) {
    throw new Error(
      "No active default language is configured. Run the language seed before running this backfill.",
    );
  }

  console.log(
    `Using default language: ${defaultLanguage.code} (${defaultLanguage.name}).`,
  );

  const websites = await prisma.website.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  console.log(
    `Found ${websites.length} active Website(s) to inspect.`,
  );

  let totalCreated = 0;

  for (const website of websites) {
    console.log(
      `\nProcessing Website: ${website.name} (${website.slug})`,
    );

    const created = await prisma.$transaction((tx) =>
      provisionWebsitePagesWithTransaction(
        tx,
        website.id,
        defaultLanguage.id,
      ),
    );

    totalCreated += created;
  }

  console.log(
    `\nDefault Website page backfill completed. Created ${totalCreated} page(s).`,
  );
}

async function provisionWebsitePagesWithTransaction(
  tx: Prisma.TransactionClient,
  websiteId: string,
  defaultLanguageId: string,
): Promise<number> {
  let createdCount = 0;

  const existingHomepage = await tx.cmsPage.findFirst({
    where: {
      websiteId,
      isHomePage: true,
    },
    select: {
      id: true,
    },
  });

  for (const defaultPage of DEFAULT_PAGES) {
    const existingPage = await tx.cmsPage.findUnique({
      where: {
        websiteId_slug: {
          websiteId,
          slug: defaultPage.slug,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingPage) {
      continue;
    }

    await tx.cmsPage.create({
      data: {
        websiteId,
        title: defaultPage.title,
        slug: defaultPage.slug,
        status: CmsPageStatus.PUBLISHED,
        isHomePage:
          defaultPage.isHomePage && !existingHomepage,
        showInMenu: defaultPage.showInMenu,
        publishedAt: new Date(),
        translations: {
          create: {
            languageId: defaultLanguageId,
            title: defaultPage.title,
            slug: defaultPage.slug,
            isPublished: true,
          },
        },
      },
    });

    createdCount += 1;

    console.log(
      `Created default page "${defaultPage.slug}" for Website ${websiteId}.`,
    );
  }

  return createdCount;
}

main()
  .catch((error) => {
    console.error("Default Website page backfill failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
