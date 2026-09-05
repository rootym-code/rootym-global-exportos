/**
 * ============================================================
 * ROOTYM Customer Website Pages API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-safe customer Website page listing
 *          and creation using the authenticated workspace
 *          Website and the existing Website-scoped CMS service.
 * ============================================================
 */

import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import cmsPageService from "@/lib/services/cms/page.service";
import prisma from "@/lib/prisma";

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
      searchParams.get("page") ?? 1
    );

    const limit = Number(
      searchParams.get("limit") ?? 20
    );

    const status =
      searchParams.get("status") ??
      undefined;

    const search =
      searchParams.get("search") ??
      undefined;

    const result =
      await cmsPageService.list(
        website.id,
        {
          status: status as never,
          search,
        },
        {
          page,
          limit,
        }
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

export async function POST(
  request: NextRequest
) {
  try {
    const { website, error } =
      await getCustomerWebsite();

    if (error) {
      return error;
    }

    const body =
      await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return ApiResponse.error({
        message:
          "Invalid CMS page payload.",
        code: "INVALID_PAYLOAD",
        status: 400,
      });
    }

    const page =
      await cmsPageService.create(
        website.id,
        body
      );

    return ApiResponse.created({
      message:
        "Website page created successfully.",
      data: page,
    });
  } catch (error) {
    return handleApiError(error);
  }
}