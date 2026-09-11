/**
 * ============================================================
 * ROOTYM Admin CMS Page API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated platform-admin CMS page
 *          retrieval, update, and deletion using the current
 *          ROOTYM Website context.
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
        code: "WEBSITE_NOT_FOUND",
        status: 404,
      });
    }

    const { id } = await params;

    const page = await cmsPageService.getById(
      website.id,
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
        code: "WEBSITE_NOT_FOUND",
        status: 404,
      });
    }

    const { id } = await params;

    const body = await request.json();

    const {
      websiteId: _websiteId,
      ...pageData
    } = body ?? {};

    const page = await cmsPageService.update(
      website.id,
      id,
      pageData
    );

    return ApiResponse.success({
      message: "CMS page updated successfully.",
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
        code: "WEBSITE_NOT_FOUND",
        status: 404,
      });
    }

    const { id } = await params;

    await cmsPageService.delete(
      website.id,
      id
    );

    return ApiResponse.noContent();
  } catch (error) {
    return handleApiError(error);
  }
}