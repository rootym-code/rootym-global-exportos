/**
 * ============================================================
 * ROOTYM Customer Website Branding API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-safe Website Branding retrieval and
 *          updates for the authenticated customer Website.
 * ============================================================
 */

import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

interface BrandingPayload {
  logoMediaId?: string | null;
  faviconMediaId?: string | null;
  ogImageMediaId?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  fontFamily?: string | null;
}

function normalizeOptionalString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("Branding values must be strings or null.");
  }

  const normalized = value.trim();

  return normalized || null;
}

function validateColor(
  value: string | null,
  fieldName: string,
): string | null {
  if (!value) {
    return null;
  }

  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(value);

  if (!isValidHex) {
    throw new Error(
      `${fieldName} must be a valid 6-digit hexadecimal color.`,
    );
  }

  return value;
}

async function getCustomerWebsite() {
  const { tenant } = await requireWorkspaceAccess();

  const website = await prisma.website.findUnique({
    where: {
      tenantId: tenant.id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      tenantId: true,
    },
  });

  if (!website || !website.isActive) {
    return {
      website: null,
      error: ApiResponse.error({
        message: "Customer Website is not available.",
        code: "WEBSITE_NOT_AVAILABLE",
        status: 404,
      }),
    };
  }

  return {
    website,
    error: null,
  };
}

async function validateMediaOwnership(
  websiteId: string,
  mediaIds: Array<string | null>,
) {
  const uniqueMediaIds = [
    ...new Set(mediaIds.filter((id): id is string => Boolean(id))),
  ];

  if (uniqueMediaIds.length === 0) {
    return;
  }

  const media = await prisma.media.findMany({
    where: {
      id: {
        in: uniqueMediaIds,
      },
      websiteId,
      isDeleted: false,
    },
    select: {
      id: true,
      mediaType: true,
    },
  });

  if (media.length !== uniqueMediaIds.length) {
    throw new Error(
      "One or more selected media assets do not belong to this Website.",
    );
  }

  const invalidMedia = media.find(
    (item) => item.mediaType !== "IMAGE",
  );

  if (invalidMedia) {
    throw new Error(
      "Website Branding assets must be image media.",
    );
  }
}

export async function GET() {
  try {
    const { website, error } = await getCustomerWebsite();

    if (error) {
      return error;
    }

    const branding = await prisma.websiteBranding.findUnique({
      where: {
        websiteId: website.id,
      },
      select: {
        id: true,
        websiteId: true,
        logoMediaId: true,
        faviconMediaId: true,
        ogImageMediaId: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        fontFamily: true,
        createdAt: true,
        updatedAt: true,
        logoMedia: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            mimeType: true,
            mediaType: true,
            width: true,
            height: true,
            altText: true,
            title: true,
          },
        },
        faviconMedia: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            mimeType: true,
            mediaType: true,
            width: true,
            height: true,
            altText: true,
            title: true,
          },
        },
        ogImageMedia: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            mimeType: true,
            mediaType: true,
            width: true,
            height: true,
            altText: true,
            title: true,
          },
        },
      },
    });

    return ApiResponse.success({
      message: "Website Branding loaded successfully.",
      data: {
        website: {
          id: website.id,
          name: website.name,
          slug: website.slug,
        },
        branding,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { membership } = await requireWorkspaceAccess();

    const canEdit =
      membership.role === "OWNER" || membership.role === "ADMIN";

    if (!canEdit) {
      return ApiResponse.error({
        message:
          "You do not have permission to update Website Branding.",
        code: "WEBSITE_BRANDING_FORBIDDEN",
        status: 403,
      });
    }

    const { website, error } = await getCustomerWebsite();

    if (error) {
      return error;
    }

    const body = (await request.json()) as BrandingPayload;

    const logoMediaId = normalizeOptionalString(body.logoMediaId);
    const faviconMediaId = normalizeOptionalString(
      body.faviconMediaId,
    );
    const ogImageMediaId = normalizeOptionalString(
      body.ogImageMediaId,
    );

    const primaryColor = validateColor(
      normalizeOptionalString(body.primaryColor),
      "Primary color",
    );

    const secondaryColor = validateColor(
      normalizeOptionalString(body.secondaryColor),
      "Secondary color",
    );

    const accentColor = validateColor(
      normalizeOptionalString(body.accentColor),
      "Accent color",
    );

    const fontFamily = normalizeOptionalString(body.fontFamily);

    if (fontFamily && fontFamily.length > 100) {
      return ApiResponse.error({
        message: "Font family must be 100 characters or fewer.",
        code: "FONT_FAMILY_TOO_LONG",
        status: 400,
      });
    }

    await validateMediaOwnership(website.id, [
      logoMediaId,
      faviconMediaId,
      ogImageMediaId,
    ]);

    const branding = await prisma.websiteBranding.upsert({
      where: {
        websiteId: website.id,
      },
      create: {
        websiteId: website.id,
        logoMediaId,
        faviconMediaId,
        ogImageMediaId,
        primaryColor,
        secondaryColor,
        accentColor,
        fontFamily,
      },
      update: {
        logoMediaId,
        faviconMediaId,
        ogImageMediaId,
        primaryColor,
        secondaryColor,
        accentColor,
        fontFamily,
      },
      select: {
        id: true,
        websiteId: true,
        logoMediaId: true,
        faviconMediaId: true,
        ogImageMediaId: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        fontFamily: true,
        createdAt: true,
        updatedAt: true,
        logoMedia: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            mimeType: true,
            mediaType: true,
            width: true,
            height: true,
            altText: true,
            title: true,
          },
        },
        faviconMedia: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            mimeType: true,
            mediaType: true,
            width: true,
            height: true,
            altText: true,
            title: true,
          },
        },
        ogImageMedia: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            mimeType: true,
            mediaType: true,
            width: true,
            height: true,
            altText: true,
            title: true,
          },
        },
      },
    });

    return ApiResponse.success({
      message: "Website Branding saved successfully.",
      data: {
        website: {
          id: website.id,
          name: website.name,
          slug: website.slug,
        },
        branding,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}