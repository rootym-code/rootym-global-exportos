/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author      : Prem Singh
 * Module      : CMS
 * Feature     : Restore Deleted Media
 * File        : app/api/admin/cms/media/[id]/restore/route.ts
 * Purpose     : Restores a previously soft-deleted media
 *               record without modifying its stored object.
 * ============================================================
 */

import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";

import mediaService from "@/lib/services/cms/media.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const media =
      await mediaService.restore(id);

    return ApiResponse.success({
      message: "Media restored successfully.",
      data: media,
    });
  } catch (error) {
    return handleApiError(error);
  }
}