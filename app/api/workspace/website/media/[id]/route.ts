/**
 * ============================================================
 * ROOTYM Customer Website Media API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-safe customer Website media retrieval
 *          and soft deletion through the authenticated workspace
 *          Website context and existing Media service.
 * ============================================================
 */

import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import mediaService from "@/lib/services/cms/media.service";
import prisma from "@/lib/prisma";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    if (!id?.trim()) {
      return ApiResponse.error({
        message: "Media ID is required.",
        code: "MEDIA_ID_REQUIRED",
        status: 400,
      });
    }

    const { website, error } = await getCustomerWebsite();

    if (error) {
      return error;
    }

    const media = await prisma.media.findFirst({
      where: {
        id: id.trim(),
        websiteId: website.id,
        isDeleted: false,
      },
      select: {
        id: true,
        fileName: true,
      },
    });

    if (!media) {
      return ApiResponse.error({
        message: "Media asset not found for this Website.",
        code: "MEDIA_NOT_FOUND",
        status: 404,
      });
    }

    await mediaService.delete(media.id);

    return ApiResponse.success({
      message: "Media deleted successfully.",
      data: {
        id: media.id,
        fileName: media.fileName,
        isDeleted: true,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
