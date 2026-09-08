/**
 * ============================================================
 * ROOTYM Customer Website Media Folders API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated, tenant-safe Media Folder
 *          listing and creation for the customer's Website.
 * ============================================================
 */

import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import prisma from "@/lib/prisma";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

const MAX_FOLDER_NAME_LENGTH = 100;
const MAX_FOLDER_PATH_LENGTH = 200;

function normalizeFolderName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeFolderPath(value: string) {
  return value
    .trim()
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9/_-]/g, "-")
    .slice(0, MAX_FOLDER_PATH_LENGTH);
}

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

export async function GET() {
  try {
    const { website, error } =
      await getCustomerWebsite();

    if (error) {
      return error;
    }

    const folders = await prisma.mediaFolder.findMany({
      where: {
        websiteId: website.id,
      },
      select: {
        id: true,
        websiteId: true,
        name: true,
        path: true,
        createdAt: true,
        updatedAt: true,

      },
      orderBy: {
        name: "asc",
      },
    });

    const mediaCounts = await prisma.media.groupBy({
      by: ["folder"],
      where: {
        websiteId: website.id,
        isDeleted: false,
        folder: {
          not: null,
        },
      },
      _count: {
        _all: true,
      },
    });

    const countsByFolder = new Map<string, number>();

    for (const item of mediaCounts) {
      const folder = item.folder?.trim();

      if (!folder) {
        continue;
      }

      countsByFolder.set(
        folder,
        item._count._all,
      );
    }

    const data = folders.map((folder) => ({
      id: folder.id,
      websiteId: folder.websiteId,
      name: folder.name,
      path: folder.path,
      mediaCount:
        countsByFolder.get(folder.path) ?? 0,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    }));

    return ApiResponse.success({
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { website, error } =
      await getCustomerWebsite();

    if (error) {
      return error;
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return ApiResponse.error({
        message: "Invalid JSON request body.",
        code: "INVALID_REQUEST_BODY",
        status: 400,
      });
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return ApiResponse.error({
        message: "A valid folder object is required.",
        code: "INVALID_FOLDER_REQUEST",
        status: 400,
      });
    }

    const requestBody = body as Record<
      string,
      unknown
    >;

    if (typeof requestBody.name !== "string") {
      return ApiResponse.error({
        message: "Folder name is required.",
        code: "FOLDER_NAME_REQUIRED",
        status: 400,
      });
    }

    const name = normalizeFolderName(
      requestBody.name,
    );

    if (!name) {
      return ApiResponse.error({
        message: "Folder name is required.",
        code: "FOLDER_NAME_REQUIRED",
        status: 400,
      });
    }

    if (name.length > MAX_FOLDER_NAME_LENGTH) {
      return ApiResponse.error({
        message:
          "Folder name must be 100 characters or fewer.",
        code: "FOLDER_NAME_TOO_LONG",
        status: 400,
      });
    }

    const requestedPath =
      typeof requestBody.path === "string"
        ? requestBody.path
        : name;

    const pathValue =
      normalizeFolderPath(requestedPath);

    if (!pathValue) {
      return ApiResponse.error({
        message: "A valid folder path is required.",
        code: "FOLDER_PATH_REQUIRED",
        status: 400,
      });
    }

    const existingFolder =
      await prisma.mediaFolder.findUnique({
        where: {
          websiteId_path: {
            websiteId: website.id,
            path: pathValue,
          },
        },
        select: {
          id: true,
        },
      });

    if (existingFolder) {
      return ApiResponse.error({
        message:
          "A folder with this path already exists.",
        code: "FOLDER_ALREADY_EXISTS",
        status: 409,
      });
    }

    const folder =
      await prisma.mediaFolder.create({
        data: {
          websiteId: website.id,
          name,
          path: pathValue,
        },
        select: {
          id: true,
          websiteId: true,
          name: true,
          path: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return ApiResponse.success({
      data: {
        ...folder,
        mediaCount: 0,
      },
      message: "Folder created successfully.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}