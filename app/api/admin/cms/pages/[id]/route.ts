import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";

import cmsPageService from "@/lib/services/cms/page.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const page = await cmsPageService.getById(id);

    return ApiResponse.success({
      data: page,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const page = await cmsPageService.update(id, body);

    return ApiResponse.success({
      message: "CMS page updated successfully.",
      data: page,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    await cmsPageService.delete(id);

    return ApiResponse.success({
      message: "CMS page deleted successfully.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}