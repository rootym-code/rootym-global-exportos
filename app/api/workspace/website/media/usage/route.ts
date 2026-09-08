/**
 * ============================================================
 * ROOTYM Customer Website Media Usage API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-safe media usage information for
 *          the authenticated customer Website.
 * ============================================================
 */

import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import prisma from "@/lib/prisma";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import getWebsiteMediaUsage from "@/app/lib/workspace/website/website-media-usage.service";

async function getCustomerWebsite() {
  const { tenant } = await requireWorkspaceAccess();

  const website = await prisma.website.findUnique({
    where: {
      tenantId: tenant.id,
    },
    select: {
      id: true,
      isActive: true,
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

export async function GET(_request: NextRequest) {
  try {
    const { website, error } = await getCustomerWebsite();

    if (error) {
      return error;
    }

    const usage = await getWebsiteMediaUsage(website.id);

    return ApiResponse.success({
      data: usage,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
