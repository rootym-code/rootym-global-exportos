/**
 * ============================================================
 * ROOTYM Customer Website Configuration API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-safe Website Configuration retrieval
 *          and updates for the authenticated customer Website.
 * ============================================================
 */

import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

interface ConfigurationPayload {
  websiteTitle?: string | null;
  tagline?: string | null;
  websiteDescription?: string | null;
}

function normalizeOptionalString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("Website Configuration values must be strings or null.");
  }

  const normalized = value.trim();

  return normalized || null;
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

export async function GET() {
  try {
    const { website, error } = await getCustomerWebsite();

    if (error) {
      return error;
    }

    const configuration =
      await prisma.websiteConfiguration.findUnique({
        where: {
          websiteId: website.id,
        },
        select: {
          id: true,
          websiteId: true,
          websiteTitle: true,
          tagline: true,
          websiteDescription: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return ApiResponse.success({
      message: "Website Configuration loaded successfully.",
      data: {
        website: {
          id: website.id,
          name: website.name,
          slug: website.slug,
        },
        configuration,
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
          "You do not have permission to update Website Configuration.",
        code: "WEBSITE_CONFIGURATION_FORBIDDEN",
        status: 403,
      });
    }

    const { website, error } = await getCustomerWebsite();

    if (error) {
      return error;
    }

    const body = (await request.json()) as ConfigurationPayload;

    const websiteTitle = normalizeOptionalString(
      body.websiteTitle,
    );

    const tagline = normalizeOptionalString(body.tagline);

    const websiteDescription = normalizeOptionalString(
      body.websiteDescription,
    );

    if (websiteTitle && websiteTitle.length > 200) {
      return ApiResponse.error({
        message: "Website title must be 200 characters or fewer.",
        code: "WEBSITE_TITLE_TOO_LONG",
        status: 400,
      });
    }

    if (tagline && tagline.length > 300) {
      return ApiResponse.error({
        message: "Tagline must be 300 characters or fewer.",
        code: "TAGLINE_TOO_LONG",
        status: 400,
      });
    }

    if (websiteDescription && websiteDescription.length > 2000) {
      return ApiResponse.error({
        message:
          "Website description must be 2000 characters or fewer.",
        code: "WEBSITE_DESCRIPTION_TOO_LONG",
        status: 400,
      });
    }

    const configuration =
      await prisma.websiteConfiguration.upsert({
        where: {
          websiteId: website.id,
        },

        create: {
          websiteId: website.id,
          websiteTitle,
          tagline,
          websiteDescription,
        },

        update: {
          websiteTitle,
          tagline,
          websiteDescription,
        },

        select: {
          id: true,
          websiteId: true,
          websiteTitle: true,
          tagline: true,
          websiteDescription: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return ApiResponse.success({
      message: "Website Configuration saved successfully.",
      data: {
        website: {
          id: website.id,
          name: website.name,
          slug: website.slug,
        },
        configuration,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}