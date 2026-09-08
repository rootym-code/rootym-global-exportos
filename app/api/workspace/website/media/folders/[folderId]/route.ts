/**
 * ============================================================
 * ROOTYM Customer Website Media Folder Item API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated, tenant-safe rename and
 *          delete operations for Website Media Library folders.
 * ============================================================
 */

import { NextRequest } from "next/server";

import { Prisma } from "@/lib/generated/prisma";

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

function isPrismaKnownRequestError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError
  );
}

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      folderId: string;
    }>;
  },
) {
  try {
    const { website, error } =
      await getCustomerWebsite();

    if (error) {
      return error;
    }

    const { folderId } = await context.params;
    const normalizedFolderId = folderId.trim();

    if (!normalizedFolderId) {
      return ApiResponse.error({
        message: "Folder ID is required.",
        code: "FOLDER_ID_REQUIRED",
        status: 400,
      });
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

    const path = normalizeFolderPath(name);

    if (!path) {
      return ApiResponse.error({
        message: "A valid folder name is required.",
        code: "INVALID_FOLDER_NAME",
        status: 400,
      });
    }

    const folder =
      await prisma.mediaFolder.findFirst({
        where: {
          id: normalizedFolderId,
          websiteId: website.id,
        },
        select: {
          id: true,
          websiteId: true,
          name: true,
          path: true,
        },
      });

    if (!folder) {
      return ApiResponse.error({
        message: "Media folder not found.",
        code: "FOLDER_NOT_FOUND",
        status: 404,
      });
    }

    if (
      folder.name === name &&
      folder.path === path
    ) {
      return ApiResponse.success({
        data: {
          ...folder,
          mediaCount: await prisma.media.count({
            where: {
              websiteId: website.id,
              folder: folder.path,
              isDeleted: false,
            },
          }),
        },
        message: "Folder is already up to date.",
      });
    }

    const existingFolder =
      await prisma.mediaFolder.findFirst({
        where: {
          websiteId: website.id,
          path,
          NOT: {
            id: folder.id,
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

    const result = await prisma.$transaction(
      async (transaction) => {
        const updatedFolder =
          await transaction.mediaFolder.update({
            where: {
              id: folder.id,
            },
            data: {
              name,
              path,
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

        const mediaUpdate =
          await transaction.media.updateMany({
            where: {
              websiteId: website.id,
              folder: folder.path,
            },
            data: {
              folder: path,
            },
          });

        return {
          updatedFolder,
          mediaUpdated: mediaUpdate.count,
        };
      },
    );

    const mediaCount = await prisma.media.count({
      where: {
        websiteId: website.id,
        folder: path,
        isDeleted: false,
      },
    });

    return ApiResponse.success({
      data: {
        ...result.updatedFolder,
        mediaCount,
        mediaUpdated: result.mediaUpdated,
      },
      message: "Folder renamed successfully.",
    });
  } catch (error) {
    if (
      isPrismaKnownRequestError(error) &&
      error.code === "P2002"
    ) {
      return ApiResponse.error({
        message:
          "A folder with this path already exists.",
        code: "FOLDER_ALREADY_EXISTS",
        status: 409,
      });
    }

    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  context: {
    params: Promise<{
      folderId: string;
    }>;
  },
) {
  try {
    const { website, error } =
      await getCustomerWebsite();

    if (error) {
      return error;
    }

    const { folderId } = await context.params;
    const normalizedFolderId = folderId.trim();

    if (!normalizedFolderId) {
      return ApiResponse.error({
        message: "Folder ID is required.",
        code: "FOLDER_ID_REQUIRED",
        status: 400,
      });
    }

    const folder =
      await prisma.mediaFolder.findFirst({
        where: {
          id: normalizedFolderId,
          websiteId: website.id,
        },
        select: {
          id: true,
          name: true,
          path: true,
        },
      });

    if (!folder) {
      return ApiResponse.error({
        message: "Media folder not found.",
        code: "FOLDER_NOT_FOUND",
        status: 404,
      });
    }

    const mediaCount = await prisma.media.count({
      where: {
        websiteId: website.id,
        folder: folder.path,
        isDeleted: false,
      },
    });

    if (mediaCount > 0) {
      return ApiResponse.error({
        message:
          `This folder contains ${mediaCount} media ${
            mediaCount === 1 ? "asset" : "assets"
          }. Move or remove those assets before deleting the folder.`,
        code: "FOLDER_NOT_EMPTY",
        status: 409,
      });
    }

    await prisma.mediaFolder.delete({
      where: {
        id: folder.id,
      },
    });

    return ApiResponse.success({
      data: {
        id: folder.id,
        name: folder.name,
        path: folder.path,
        mediaCount: 0,
      },
      message: "Folder deleted successfully.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
