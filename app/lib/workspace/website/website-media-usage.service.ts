/**
 * ============================================================
 * ROOTYM Customer Website Media Usage Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Resolves tenant-safe media usage across Website CMS
 *          content and existing Product / WhatsApp media
 *          relationships without introducing a duplicate usage
 *          database model.
 * ============================================================
 */

import prisma from "@/lib/prisma";

export interface WebsiteMediaUsageReference {
  type: "PAGE" | "PRODUCT" | "WHATSAPP";
  id: string;
  title: string;
  detail: string | null;
  languageCode?: string | null;
  href?: string | null;
  createdAt?: string | null;
}

export interface WebsiteMediaUsageItem {
  media: {
    id: string;
    fileName: string;
    title: string | null;
    fileUrl: string;
    mediaType: string;
  };
  usageCount: number;
  pageCount: number;
  productCount: number;
  whatsappCount: number;
  references: WebsiteMediaUsageReference[];
}

export interface WebsiteMediaUsageOverview {
  totalMedia: number;
  usedMedia: number;
  unusedMedia: number;
  totalReferences: number;
  items: WebsiteMediaUsageItem[];
}

function stringifyContent(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

export async function getWebsiteMediaUsage(
  websiteId: string,
): Promise<WebsiteMediaUsageOverview> {
  if (!websiteId?.trim()) {
    throw new Error("Website context is required to retrieve media usage.");
  }

  const [website, media, pages, products, whatsappAttachments] =
    await Promise.all([
      prisma.website.findUnique({
        where: {
          id: websiteId,
        },
        select: {
          slug: true,
        },
      }),

      prisma.media.findMany({
        where: {
          websiteId,
          isDeleted: false,
        },
        select: {
          id: true,
          fileName: true,
          title: true,
          fileUrl: true,
          storedFileName: true,
          mediaType: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.cmsPage.findMany({
        where: {
          websiteId,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          translations: {
            select: {
              title: true,
              slug: true,
              language: {
                select: {
                  code: true,
                },
              },
              content: true,
              structuredContent: true,
            },
          },
        },
      }),

      prisma.product.findMany({
        where: {
          featuredImage: {
            websiteId,
          },
        },
        select: {
          id: true,
          name: true,
          sku: true,
          featuredImageId: true,
        },
      }),

      prisma.whatsAppAttachment.findMany({
        where: {
          media: {
            websiteId,
          },
        },
        select: {
          mediaId: true,
          createdAt: true,
          whatsappMessage: {
            select: {
              id: true,
              message: true,
              createdAt: true,
              direction: true,
            },
          },
        },
      }),
    ]);

  const items: WebsiteMediaUsageItem[] = media.map((asset) => {
    const references: WebsiteMediaUsageReference[] = [];

    for (const page of pages) {
      for (const translation of page.translations) {
        const searchableContent = [
          translation.content,
          stringifyContent(translation.structuredContent),
        ]
          .filter(Boolean)
          .join("\n");

        if (
          searchableContent.includes(asset.id) ||
          searchableContent.includes(asset.fileUrl) ||
          searchableContent.includes(asset.storedFileName)
        ) {
          references.push({
            type: "PAGE",
            id: page.id,
            title: translation.title || page.title,
            detail: translation.slug || page.slug,
            languageCode: translation.language.code,
            href: website?.slug
              ? `/website/${website.slug}/${translation.language.code}/${translation.slug}`
              : null,
          });
        }
      }
    }

    for (const product of products) {
      if (product.featuredImageId === asset.id) {
        references.push({
          type: "PRODUCT",
          id: product.id,
          title: product.name,
          detail: product.sku,
        });
      }
    }

    for (const attachment of whatsappAttachments) {
      if (attachment.mediaId === asset.id) {
        references.push({
          type: "WHATSAPP",
          id: attachment.whatsappMessage.id,
          title: "WhatsApp message",
          detail: attachment.whatsappMessage.message || null,
          createdAt: attachment.whatsappMessage.createdAt.toISOString(),
        });
      }
    }

    return {
      media: {
        id: asset.id,
        fileName: asset.fileName,
        title: asset.title,
        fileUrl: asset.fileUrl,
        mediaType: asset.mediaType,
      },
      usageCount: references.length,
      pageCount: references.filter(
        (reference) => reference.type === "PAGE",
      ).length,
      productCount: references.filter(
        (reference) => reference.type === "PRODUCT",
      ).length,
      whatsappCount: references.filter(
        (reference) => reference.type === "WHATSAPP",
      ).length,
      references,
    };
  });

  const usedMedia = items.filter(
    (item) => item.usageCount > 0,
  ).length;

  return {
    totalMedia: items.length,
    usedMedia,
    unusedMedia: items.length - usedMedia,
    totalReferences: items.reduce(
      (total, item) => total + item.usageCount,
      0,
    ),
    items,
  };
}

export default getWebsiteMediaUsage;
