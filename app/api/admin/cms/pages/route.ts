import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";

import { authenticateAdmin } from "@/lib/auth";

import cmsPageService from "@/lib/services/cms/page.service";

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

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);

    const status = searchParams.get("status") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const result = await cmsPageService.list(
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

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated) {
      return ApiResponse.error({
        message: auth.error ?? "Unauthorized.",
        code: "UNAUTHORIZED",
        status: auth.status,
      });
    }

    const body = await request.json();

    const page = await cmsPageService.create(body);

    return ApiResponse.created({
      message: "CMS page created successfully.",
      data: page,
    });
  } catch (error) {
    return handleApiError(error);
  }
}