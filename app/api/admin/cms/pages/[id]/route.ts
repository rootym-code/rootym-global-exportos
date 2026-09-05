/**
 * ============================================================
 * ROOTYM Admin CMS Page API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated platform-admin CMS page
 *          retrieval, update, and deletion scoped to a Website.
 * ============================================================
 */

import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";

import { authenticateAdmin } from "@/lib/auth";

import cmsPageService from "@/lib/services/cms/page.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const auth =
      await authenticateAdmin(request);

    if (!auth.authenticated) {
      return ApiResponse.error({
        message:
          auth.error ?? "Unauthorized.",
        code: "UNAUTHORIZED",
        status: auth.status,
      });
    }

    const { id } = await params;

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

    const page =
      await cmsPageService.getById(
        websiteId,
        id
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
    const auth =
      await authenticateAdmin(request);

    if (!auth.authenticated) {
      return ApiResponse.error({
        message:
          auth.error ?? "Unauthorized.",
        code: "UNAUTHORIZED",
        status: auth.status,
      });
    }

    const { id } = await params;

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
      await cmsPageService.update(
        websiteId,
        id,
        pageData
      );

    return ApiResponse.success({
      message:
        "CMS page updated successfully.",
      data: page,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const auth =
      await authenticateAdmin(request);

    if (!auth.authenticated) {
      return ApiResponse.error({
        message:
          auth.error ?? "Unauthorized.",
        code: "UNAUTHORIZED",
        status: auth.status,
      });
    }

    const { id } = await params;

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

    await cmsPageService.delete(
      websiteId,
      id
    );

    return ApiResponse.noContent();
  } catch (error) {
    return handleApiError(error);
  }
}