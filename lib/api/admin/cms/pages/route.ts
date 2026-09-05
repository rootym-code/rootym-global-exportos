/**
 * ============================================================
 * ROOTYM Admin CMS Pages API Helper
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides Website-scoped CMS page listing and
 *          creation for the existing admin API layer.
 * ============================================================
 */

import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";

import cmsPageService from "@/lib/services/cms/page.service";

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const websiteId =
      searchParams
        .get("websiteId")
        ?.trim();

    if (!websiteId) {
      return ApiResponse.error({
        message:
          "Website ID is required.",
        code: "WEBSITE_REQUIRED",
        status: 400,
      });
    }

    const page = Number(
      searchParams.get("page") ?? 1
    );

    const limit = Number(
      searchParams.get("limit") ?? 20
    );

    const status =
      searchParams.get("status") ||
      undefined;

    const search =
      searchParams.get("search") ||
      undefined;

    const result =
      await cmsPageService.list(
        websiteId,
        {
          status: status as any,
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
        totalPages:
          result.totalPages,
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
    const body =
      await request.json();

    const websiteId =
      typeof body?.websiteId ===
        "string"
        ? body.websiteId.trim()
        : "";

    if (!websiteId) {
      return ApiResponse.error({
        message:
          "Website ID is required.",
        code: "WEBSITE_REQUIRED",
        status: 400,
      });
    }

    const {
      websiteId: _websiteId,
      ...pageData
    } = body;

    const page =
      await cmsPageService.create(
        websiteId,
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