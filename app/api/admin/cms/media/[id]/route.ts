import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";

import mediaService from "@/lib/services/cms/media.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const media = await mediaService.getById(id);

    return ApiResponse.success({
      data: media,
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

    const media = await mediaService.update(id, body);

    return ApiResponse.success({
      message: "Media updated successfully.",
      data: media,
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

    await mediaService.delete(id);

    return ApiResponse.success({
      message: "Media deleted successfully.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}