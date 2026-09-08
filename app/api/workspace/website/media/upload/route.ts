/**
 * ============================================================
 * ROOTYM Customer Website Media Upload API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated, tenant-safe media uploads
 *          for the customer's Website and creates a Website-
 *          scoped Media record using the existing storage layer.
 * ============================================================
 */

import { randomUUID } from "crypto";
import path from "path";

import { MediaType } from "@/lib/generated/prisma";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import prisma from "@/lib/prisma";
import getStorageProvider from "@/lib/services/storage/storage.service";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/x-icon",
  "image/vnd.microsoft.icon",

  "video/mp4",
  "video/webm",

  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
]);

function resolveMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith("image/")) {
    return MediaType.IMAGE;
  }

  if (mimeType.startsWith("video/")) {
    return MediaType.VIDEO;
  }

  if (mimeType.startsWith("audio/")) {
    return MediaType.AUDIO;
  }

  if (
    mimeType === "application/pdf" ||
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/vnd.ms-excel" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return MediaType.DOCUMENT;
  }

  return MediaType.OTHER;
}

function sanitizeFolder(value: string | null) {
  const folder = value?.trim();

  if (!folder) {
    return "general";
  }

  return (
    folder
      .replace(/\\/g, "/")
      .replace(/[^a-zA-Z0-9/_-]/g, "-")
      .replace(/\/+/g, "/")
      .replace(/^\/+|\/+$/g, "")
      .slice(0, 100) || "general"
  );
}

function sanitizeText(
  value: FormDataEntryValue | null,
  maxLength: number,
) {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();

  if (!normalized) {
    return undefined;
  }

  return normalized.slice(0, maxLength);
}

function getFileExtension(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();

  if (!extension) {
    return "";
  }

  return extension.slice(0, 20);
}

function getFileStem(fileName: string) {
  const extension = path.extname(fileName);

  return path.basename(fileName, extension);
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

export async function POST(request: Request) {
  let uploadedStorageKey: string | null = null;
  let uploadedStorageProvider: Awaited<
    ReturnType<typeof getStorageProvider>
  > | null = null;

  try {
    const { website, error } = await getCustomerWebsite();

    if (error) {
      return error;
    }

    const formData = await request.formData();

    const fileEntry = formData.get("file");

    if (!(fileEntry instanceof File)) {
      return ApiResponse.error({
        message: "A media file is required.",
        code: "MEDIA_FILE_REQUIRED",
        status: 400,
      });
    }

    if (fileEntry.size <= 0) {
      return ApiResponse.error({
        message: "The selected file is empty.",
        code: "EMPTY_MEDIA_FILE",
        status: 400,
      });
    }

    if (fileEntry.size > MAX_FILE_SIZE) {
      return ApiResponse.error({
        message: "Media files must be 20 MB or smaller.",
        code: "MEDIA_FILE_TOO_LARGE",
        status: 400,
      });
    }

    const mimeType = fileEntry.type.trim().toLowerCase();

    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return ApiResponse.error({
        message: "This file type is not supported.",
        code: "UNSUPPORTED_MEDIA_TYPE",
        status: 400,
      });
    }

    const originalFileName =
      fileEntry.name.trim() || "uploaded-file";

    const extension = getFileExtension(originalFileName);

    const storedFileName = `${Date.now()}-${randomUUID()}${extension}`;

    const folderEntry = formData.get("folder");

    const folder = sanitizeFolder(
      typeof folderEntry === "string"
        ? folderEntry
        : null,
    );

    const storageKey = `${folder}/${storedFileName}`;

    const title =
      sanitizeText(formData.get("title"), 200) ??
      getFileStem(originalFileName).slice(0, 200);

    const altText =
      sanitizeText(formData.get("altText"), 500) ??
      title;

    const description = sanitizeText(
      formData.get("description"),
      1000,
    );

    const buffer = Buffer.from(
      await fileEntry.arrayBuffer(),
    );

    const storageProvider = await getStorageProvider();

    uploadedStorageProvider = storageProvider;

    const uploaded = await storageProvider.upload({
      key: storageKey,
      body: buffer,
      contentType: mimeType,
    });

    uploadedStorageKey = uploaded.key;

    const media = await prisma.media.create({
      data: {
        websiteId: website.id,

        fileName: originalFileName,
        storedFileName,
        fileUrl: uploaded.url,

        storageProvider: uploaded.provider,

        mimeType,
        mediaType: resolveMediaType(mimeType),

        fileSize: fileEntry.size,

        altText,
        title,
        description,

        folder,

        isDeleted: false,
      },
    });

    return ApiResponse.success({
      data: media,
      message: "Media uploaded successfully.",
    });
  } catch (error) {
    if (
      uploadedStorageKey &&
      uploadedStorageProvider
    ) {
      try {
        await uploadedStorageProvider.delete(
          uploadedStorageKey,
        );
      } catch {
        // Preserve the original database/upload error.
      }
    }

    return handleApiError(error);
  }
}