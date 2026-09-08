/**
 * ============================================================
 * ROOTYM Customer Website Media API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-safe Website Media Library listing
 *          using the authenticated workspace Website and the
 *          Website-scoped Media Library service.
 * ============================================================
 */

import { NextRequest } from "next/server";

import { MediaType } from "@/lib/generated/prisma";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import prisma from "@/lib/prisma";

import websiteMediaLibraryService from "@/app/lib/workspace/website/website-media-library.service";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

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

const MEDIA_TYPES = [
  MediaType.IMAGE,
  MediaType.VIDEO,
  MediaType.DOCUMENT,
  MediaType.AUDIO,
  MediaType.OTHER,
] as const;

function isMediaType(
  value: string | null,
): value is MediaType {
  return (
    value !== null &&
    MEDIA_TYPES.includes(
      value as MediaType,
    )
  );
}

export async function GET(request: NextRequest) {
  try {
    const { website, error } =
      await getCustomerWebsite();

    if (error) {
      return error;
    }

    const { searchParams } =
      new URL(request.url);

    const page = Number(
      searchParams.get("page") ?? 1,
    );

    const limit = Number(
      searchParams.get("limit") ?? 20,
    );

    const search =
      searchParams.get("search") ??
      undefined;

    const folder =
      searchParams.get("folder") ??
      undefined;

    const mediaTypeParam =
      searchParams.get("mediaType");

    const mediaType =
      isMediaType(mediaTypeParam)
        ? mediaTypeParam
        : undefined;

    if (
      mediaTypeParam &&
      !mediaType
    ) {
      return ApiResponse.error({
        message: "Invalid media type.",
        code: "INVALID_MEDIA_TYPE",
        status: 400,
      });
    }

    const includeDeleted =
      searchParams.get(
        "includeDeleted",
      ) === "true";

    const result =
      await websiteMediaLibraryService.list(
        website.id,
        {
          mediaType,
          folder,
          includeDeleted,
          search,
        },
        {
          page,
          limit,
        },
      );

    return ApiResponse.paginated({
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}