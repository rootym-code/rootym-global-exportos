/**
 * ============================================================
 * ROOTYM Customer Website Pages Bulk Action API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-safe bulk actions for customer
 *          Website CMS pages using the existing Website-scoped
 *          CMS page service.
 * ============================================================
 */

import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";

import cmsPageService from "@/lib/services/cms/page.service";

import prisma from "@/lib/prisma";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

async function getCustomerWebsite() {
  const { tenant } = await requireWorkspaceAccess();

  const website = await prisma.website.findUnique({
    where: {
      tenantId: tenant.id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      tenantId: true,
    },
  });

  if (!website || !website.isActive) {
    return {
      website: null,
      error: ApiResponse.error({
        message: "Customer Website is not available.",
        code: "WEBSITE_NOT_AVAILABLE",
        status: 404,
      }),
    };
  }

  return {
    website,
    error: null,
  };
}

const BULK_ACTIONS = [
  "publish",
  "draft",
  "archive",
] as const;

type BulkAction = (typeof BULK_ACTIONS)[number];

function isBulkAction(
  value: unknown,
): value is BulkAction {
  return (
    typeof value === "string" &&
    BULK_ACTIONS.includes(
      value as BulkAction,
    )
  );
}

export async function POST(
  request: NextRequest,
) {
  try {
    const { website, error } =
      await getCustomerWebsite();

    if (error) {
      return error;
    }

    const body =
      await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return ApiResponse.error({
        message:
          "Invalid CMS bulk action payload.",
        code: "INVALID_PAYLOAD",
        status: 400,
      });
    }

    const pageIds: unknown[] =
      Array.isArray(body.pageIds)
        ? body.pageIds
        : [];

    if (
      pageIds.length === 0 ||
      pageIds.some(
        (id: unknown) =>
          typeof id !== "string" ||
          !id.trim(),
      )
    ) {
      return ApiResponse.error({
        message:
          "At least one valid CMS page ID is required.",
        code: "INVALID_PAGE_IDS",
        status: 400,
      });
    }

    const action = body.action;

    if (!isBulkAction(action)) {
      return ApiResponse.error({
        message:
          "Invalid CMS bulk action.",
        code: "INVALID_BULK_ACTION",
        status: 400,
      });
    }

    const normalizedPageIds: string[] = [
      ...new Set(
        pageIds
          .filter(
            (id): id is string =>
              typeof id === "string",
          )
          .map(
            (id) => id.trim(),
          ),
      ),
    ];

    if (normalizedPageIds.length === 0) {
      return ApiResponse.error({
        message:
          "At least one valid CMS page ID is required.",
        code: "INVALID_PAGE_IDS",
        status: 400,
      });
    }

    let result;

    switch (action) {
      case "publish":
        result =
          await cmsPageService.publishMany(
            website.id,
            normalizedPageIds,
          );
        break;

      case "draft":
        result =
          await cmsPageService.draftMany(
            website.id,
            normalizedPageIds,
          );
        break;

      case "archive":
        result =
          await cmsPageService.archiveMany(
            website.id,
            normalizedPageIds,
          );
        break;
    }

    return ApiResponse.success({
      message:
        "Website pages updated successfully.",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}