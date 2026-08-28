/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author      : Prem Singh
 * Module      : CMS
 * Feature     : Permanently Purge Media
 * File        : app/api/admin/cms/media/[id]/purge/route.ts
 * Purpose     : Permanently removes a soft-deleted media
 *               object from persistent storage and then
 *               removes its database record.
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

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    await mediaService.purge(id);

    return ApiResponse.success({
      message:
        "Media permanently deleted successfully.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}