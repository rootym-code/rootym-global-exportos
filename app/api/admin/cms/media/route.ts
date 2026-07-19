import { NextRequest } from "next/server";
import { MediaType } from "@/lib/generated/prisma";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";

import mediaService from "@/lib/services/cms/media.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);

    const folder = searchParams.get("folder") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const mediaType =
      (searchParams.get("mediaType") as MediaType | null) ??
      undefined;

    const includeDeleted =
      searchParams.get("includeDeleted") === "true";

    const result = await mediaService.list(
      {
        mediaType,
        folder,
        includeDeleted,
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
    const body = await request.json();

    const media = await mediaService.create(body);

    return ApiResponse.created({
      message: "Media uploaded successfully.",
      data: media,
    });
  } catch (error) {
    return handleApiError(error);
  }
}