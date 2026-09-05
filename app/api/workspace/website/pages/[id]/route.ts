/**
 * ============================================================
 * ROOTYM Customer Website Page API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-safe customer Website page retrieval
 *          and updates using the authenticated workspace Website
 *          and the existing Website-scoped CMS page service.
 * ============================================================
 */

import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import cmsPageService from "@/lib/services/cms/page.service";
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
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id?.trim()) {
      return ApiResponse.error({
        message: "CMS page ID is required.",
        code: "PAGE_ID_REQUIRED",
        status: 400,
      });
    }

    const { website, error } =
      await getCustomerWebsite();

    if (error) {
      return error;
    }

    const page =
      await cmsPageService.getById(
        website.id,
        id.trim()
      );

    return ApiResponse.success({
      data: page,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id?.trim()) {
      return ApiResponse.error({
        message: "CMS page ID is required.",
        code: "PAGE_ID_REQUIRED",
        status: 400,
      });
    }

    const { website, error } =
      await getCustomerWebsite();

    if (error) {
      return error;
    }

    const body = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return ApiResponse.error({
        message: "Invalid page update payload.",
        code: "INVALID_PAYLOAD",
        status: 400,
      });
    }

    const page =
      await cmsPageService.update(
        website.id,
        id.trim(),
        body
      );

    return ApiResponse.success({
      message:
        "Website page updated successfully.",
      data: page,
    });
  } catch (error) {
    return handleApiError(error);
  }
}