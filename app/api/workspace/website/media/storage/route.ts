/**
 * ============================================================
 * ROOTYM Customer Website Media Storage API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-safe media storage usage and
 *          storage provider status for the customer Website.
 * ============================================================
 */

import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import prisma from "@/lib/prisma";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import getWebsiteMediaStorageOverview from "@/app/lib/workspace/website/website-media-storage.service";

async function getCustomerWebsite() {
  const { tenant } =
    await requireWorkspaceAccess();

  const website =
    await prisma.website.findUnique({
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
        message:
          "Customer Website is not available.",
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

export async function GET(
  _request: NextRequest,
) {
  try {
    const {
      website,
      error,
    } = await getCustomerWebsite();

    if (error) {
      return error;
    }

    const storage =
      await getWebsiteMediaStorageOverview(
        website.id,
      );

    return ApiResponse.success({
      message:
        "Website media storage information loaded successfully.",
      data: storage,
    });
  } catch (error) {
    return handleApiError(error);
  }
}