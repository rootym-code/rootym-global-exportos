/**
 * ============================================================
 * ROOTYM Customer Website Configuration API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-safe Website Configuration retrieval
 *          and updates for the authenticated customer Website.
 *
 * Includes:
 *   - Website identity configuration
 *   - Google Tag Manager configuration
 *   - Google Analytics / Google Tag configuration
 *   - Google Search Console verification configuration
 *   - Meta Pixel configuration
 *
 * PATCH behavior:
 *   - Supports partial updates.
 *   - Omitted fields are NOT modified.
 *   - Explicit null values clear the corresponding field.
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
  companyDescription?: string | null;

  gtmContainerId?: string | null;
  googleAnalyticsMeasurementId?: string | null;
  searchConsoleVerificationCode?: string | null;
  metaPixelId?: string | null;
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

function validateTrackingId(
  value: string | null,
  pattern: RegExp,
  message: string,
) {
  if (value && !pattern.test(value)) {
    return ApiResponse.error({
      message,
      code: "INVALID_TRACKING_CONFIGURATION",
      status: 400,
    });
  }

  return null;
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
          companyDescription: true,
          gtmContainerId: true,
          googleAnalyticsMeasurementId: true,
          searchConsoleVerificationCode: true,
          metaPixelId: true,
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

    /**
     * ----------------------------------------------------------
     * IMPORTANT:
     * PATCH is intentionally partial.
     *
     * We must distinguish between:
     *
     *   field omitted
     *      -> do not change existing database value
     *
     *   field: null
     *      -> explicitly clear existing database value
     *
     *   field: "value"
     *      -> save new value
     * ----------------------------------------------------------
     */

    const hasField = (field: keyof ConfigurationPayload) =>
      Object.prototype.hasOwnProperty.call(body, field);

    /**
     * ----------------------------------------------------------
     * Normalize only fields actually supplied by the client.
     * ----------------------------------------------------------
     */

    const websiteTitle = hasField("websiteTitle")
      ? normalizeOptionalString(body.websiteTitle)
      : undefined;

    const tagline = hasField("tagline")
      ? normalizeOptionalString(body.tagline)
      : undefined;

    const websiteDescription = hasField("websiteDescription")
      ? normalizeOptionalString(body.websiteDescription)
      : undefined;

    const companyDescription = hasField("companyDescription")
      ? normalizeOptionalString(body.companyDescription)
      : undefined;

    const gtmContainerId = hasField("gtmContainerId")
      ? normalizeOptionalString(body.gtmContainerId)
      : undefined;

    const googleAnalyticsMeasurementId = hasField(
      "googleAnalyticsMeasurementId",
    )
      ? normalizeOptionalString(
          body.googleAnalyticsMeasurementId,
        )
      : undefined;

    const searchConsoleVerificationCode = hasField(
      "searchConsoleVerificationCode",
    )
      ? normalizeOptionalString(
          body.searchConsoleVerificationCode,
        )
      : undefined;

    const metaPixelId = hasField("metaPixelId")
      ? normalizeOptionalString(body.metaPixelId)
      : undefined;

    /**
     * ----------------------------------------------------------
     * Website identity validation
     * ----------------------------------------------------------
     */

    if (websiteTitle !== undefined) {
      if (websiteTitle && websiteTitle.length > 200) {
        return ApiResponse.error({
          message:
            "Website title must be 200 characters or fewer.",
          code: "WEBSITE_TITLE_TOO_LONG",
          status: 400,
        });
      }
    }

    if (tagline !== undefined) {
      if (tagline && tagline.length > 300) {
        return ApiResponse.error({
          message: "Tagline must be 300 characters or fewer.",
          code: "TAGLINE_TOO_LONG",
          status: 400,
        });
      }
    }

    if (websiteDescription !== undefined) {
      if (websiteDescription && websiteDescription.length > 2000) {
        return ApiResponse.error({
          message:
            "Website description must be 2000 characters or fewer.",
          code: "WEBSITE_DESCRIPTION_TOO_LONG",
          status: 400,
        });
      }
    }

    if (companyDescription !== undefined) {
      if (companyDescription && companyDescription.length > 2000) {
        return ApiResponse.error({
          message:
            "Company description must be 2000 characters or fewer.",
          code: "COMPANY_DESCRIPTION_TOO_LONG",
          status: 400,
        });
      }
    }

    /**
     * ----------------------------------------------------------
     * Tracking configuration length validation
     * ----------------------------------------------------------
     */

    if (gtmContainerId !== undefined) {
      if (gtmContainerId && gtmContainerId.length > 100) {
        return ApiResponse.error({
          message:
            "Google Tag Manager Container ID is too long.",
          code: "GTM_CONTAINER_ID_TOO_LONG",
          status: 400,
        });
      }
    }

    if (googleAnalyticsMeasurementId !== undefined) {
      if (
        googleAnalyticsMeasurementId &&
        googleAnalyticsMeasurementId.length > 100
      ) {
        return ApiResponse.error({
          message:
            "Google Analytics Measurement ID is too long.",
          code: "GOOGLE_ANALYTICS_ID_TOO_LONG",
          status: 400,
        });
      }
    }

    if (searchConsoleVerificationCode !== undefined) {
      if (
        searchConsoleVerificationCode &&
        searchConsoleVerificationCode.length > 500
      ) {
        return ApiResponse.error({
          message:
            "Google Search Console verification value is too long.",
          code: "SEARCH_CONSOLE_VERIFICATION_TOO_LONG",
          status: 400,
        });
      }
    }

    if (metaPixelId !== undefined) {
      if (metaPixelId && metaPixelId.length > 100) {
        return ApiResponse.error({
          message: "Meta Pixel ID is too long.",
          code: "META_PIXEL_ID_TOO_LONG",
          status: 400,
        });
      }
    }

    /**
     * ----------------------------------------------------------
     * Tracking ID format validation
     * ----------------------------------------------------------
     */

    if (gtmContainerId !== undefined) {
      const gtmValidation = validateTrackingId(
        gtmContainerId,
        /^GTM-[A-Z0-9]+$/i,
        "Google Tag Manager Container ID must use the format GTM-XXXXXXX.",
      );

      if (gtmValidation) {
        return gtmValidation;
      }
    }

    if (googleAnalyticsMeasurementId !== undefined) {
      const analyticsValidation = validateTrackingId(
        googleAnalyticsMeasurementId,
        /^G-[A-Z0-9]+$/i,
        "Google Analytics Measurement ID must use the format G-XXXXXXXXXX.",
      );

      if (analyticsValidation) {
        return analyticsValidation;
      }
    }

    if (metaPixelId !== undefined) {
      const metaPixelValidation = validateTrackingId(
        metaPixelId,
        /^\d+$/,
        "Meta Pixel ID must contain numbers only.",
      );

      if (metaPixelValidation) {
        return metaPixelValidation;
      }
    }

    /**
     * ----------------------------------------------------------
     * Build partial update object.
     *
     * Undefined properties are deliberately NOT included.
     * Therefore Prisma leaves those database values unchanged.
     * ----------------------------------------------------------
     */

    const updateData: Record<string, string | null> = {};

    if (websiteTitle !== undefined) {
      updateData.websiteTitle = websiteTitle;
    }

    if (tagline !== undefined) {
      updateData.tagline = tagline;
    }

    if (websiteDescription !== undefined) {
      updateData.websiteDescription = websiteDescription;
    }

    if (companyDescription !== undefined) {
      updateData.companyDescription = companyDescription;
    }

    if (gtmContainerId !== undefined) {
      updateData.gtmContainerId = gtmContainerId;
    }

    if (googleAnalyticsMeasurementId !== undefined) {
      updateData.googleAnalyticsMeasurementId =
        googleAnalyticsMeasurementId;
    }

    if (searchConsoleVerificationCode !== undefined) {
      updateData.searchConsoleVerificationCode =
        searchConsoleVerificationCode;
    }

    if (metaPixelId !== undefined) {
      updateData.metaPixelId = metaPixelId;
    }

    /**
     * ----------------------------------------------------------
     * Upsert configuration.
     *
     * CREATE:
     * Missing values become null.
     *
     * UPDATE:
     * Only supplied fields are modified.
     * ----------------------------------------------------------
     */

    const configuration =
      await prisma.websiteConfiguration.upsert({
        where: {
          websiteId: website.id,
        },

        create: {
          websiteId: website.id,

          websiteTitle:
            websiteTitle !== undefined
              ? websiteTitle
              : null,

          tagline:
            tagline !== undefined
              ? tagline
              : null,

          websiteDescription:
            websiteDescription !== undefined
              ? websiteDescription
              : null,

          companyDescription:
            companyDescription !== undefined
              ? companyDescription
              : null,

          gtmContainerId:
            gtmContainerId !== undefined
              ? gtmContainerId
              : null,

          googleAnalyticsMeasurementId:
            googleAnalyticsMeasurementId !== undefined
              ? googleAnalyticsMeasurementId
              : null,

          searchConsoleVerificationCode:
            searchConsoleVerificationCode !== undefined
              ? searchConsoleVerificationCode
              : null,

          metaPixelId:
            metaPixelId !== undefined
              ? metaPixelId
              : null,
        },

        update: updateData,

        select: {
          id: true,
          websiteId: true,
          websiteTitle: true,
          tagline: true,
          websiteDescription: true,
          companyDescription: true,
          gtmContainerId: true,
          googleAnalyticsMeasurementId: true,
          searchConsoleVerificationCode: true,
          metaPixelId: true,
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