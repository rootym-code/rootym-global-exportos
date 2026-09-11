/**
 * ============================================================
 * ROOTYM Admin CMS Pages API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated Admin CMS page listing and
 *          creation using the current ROOTYM Website context.
 *
 *          Website ownership is resolved server-side so the
 *          client does not need to provide or control websiteId.
 * ============================================================
 */

import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import { authenticateAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import cmsPageService from "@/lib/services/cms/page.service";

const ROOTYM_WEBSITE_SLUG = "rootym-agro";

async function getAdminWebsite() {
  const website = await prisma.website.findUnique({
    where: {
      slug: ROOTYM_WEBSITE_SLUG,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!website || !website.isActive) {
    return null;
  }

  return website;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated) {
      return ApiResponse.error({
        message: auth.error ?? "Unauthorized.",
        code: "UNAUTHORIZED",
        status: auth.status,
      });
    }

    const website = await getAdminWebsite();

    if (!website) {
      return ApiResponse.error({
        message: "Website is not available.",
        code: "WEBSITE_NOT_AVAILABLE",
        status: 404,
      });
    }

    const { searchParams } = new URL(request.url);

    const page = Number(
      searchParams.get("page") ?? "1"
    );

    const limit = Number(
      searchParams.get("limit") ?? "20"
    );

    const status =
      searchParams.get("status") ?? undefined;

    const search =
      searchParams.get("search") ?? undefined;

    const result = await cmsPageService.list(
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
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated) {
      return ApiResponse.error({
        message: auth.error ?? "Unauthorized.",
        code: "UNAUTHORIZED",
        status: auth.status,
      });
    }

    const website = await getAdminWebsite();

    if (!website) {
      return ApiResponse.error({
        message: "Website is not available.",
        code: "WEBSITE_NOT_AVAILABLE",
        status: 404,
      });
    }

    const body = await request.json();

    /*
     * websiteId is intentionally not accepted from the client.
     *
     * The Admin CMS currently operates against the ROOTYM Website
     * context, matching the existing Admin Product architecture.
     */
    const {
      websiteId: _websiteId,
      ...pageData
    } = body ?? {};

    const page = await cmsPageService.create(
      website.id,
      pageData
    );

    return ApiResponse.created({
      message:
        "CMS page created successfully.",
      data: page,
    });
  } catch (error) {
    return handleApiError(error);
  }
}