/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author      : Prem Singh
 * Module      : CMS
 * Feature     : Media Library Upload API
 * File        : app/api/admin/cms/media/route.ts
 * Purpose     : Authenticated CMS media upload and listing
 *               using provider-independent persistent storage.
 * ============================================================
 */

import { randomUUID } from "crypto";
import path from "path";

import { NextRequest } from "next/server";

import { MediaType } from "@/lib/generated/prisma";

import { authenticateAdmin } from "@/lib/auth";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";

import mediaService from "@/lib/services/cms/media.service";
import getStorageProvider from "@/lib/services/storage/storage.service";

export const runtime = "nodejs";

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

function resolveMediaType(
  mimeType: string
): MediaType {
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
    mimeType.includes("wordprocessingml") ||
    mimeType ===
      "application/vnd.ms-excel" ||
    mimeType.includes("spreadsheetml")
  ) {
    return MediaType.DOCUMENT;
  }

  return MediaType.OTHER;
}

function sanitizeFolder(
  value: string | null
): string {
  const sanitized = (value ?? "general")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

  return sanitized || "general";
}

function getExtension(filename: string) {
  return path.extname(filename).toLowerCase();
}

function generateStoredFilename(
  originalName: string
) {
  return `${Date.now()}-${randomUUID()}${getExtension(
    originalName
  )}`;
}

export async function GET(
  request: NextRequest
) {
  try {
    const auth = await authenticateAdmin(
      request
    );

    if (!auth.authenticated) {
      return ApiResponse.error({
        message:
          auth.error ?? "Unauthorized.",
        code: "UNAUTHORIZED",
        status: auth.status,
      });
    }

    const { searchParams } =
      new URL(request.url);

    const page = Number(
      searchParams.get("page") ?? 1
    );

    const limit = Number(
      searchParams.get("limit") ?? 20
    );

    const search =
      searchParams.get("search") ??
      undefined;

    const folder =
      searchParams.get("folder") ??
      undefined;

    const mediaType =
      (searchParams.get(
        "mediaType"
      ) as MediaType | null) ??
      undefined;

    const includeDeleted =
      searchParams.get(
        "includeDeleted"
      ) === "true";

    const result =
      await mediaService.list(
        {
          mediaType,
          folder,
          includeDeleted,
          search,
        },
        {
          page,
          limit,
        }
      );

    return ApiResponse.paginated({
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages:
          result.totalPages,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest
) {
  let storageKey: string | null = null;

  try {
    const auth =
      await authenticateAdmin(request);

    if (
      !auth.authenticated ||
      !auth.admin
    ) {
      return ApiResponse.error({
        message:
          auth.error ?? "Unauthorized.",
        code: "UNAUTHORIZED",
        status: auth.status,
      });
    }

    const formData =
      await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return ApiResponse.error({
        message: "No file uploaded.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    if (
      !ALLOWED_MIME_TYPES.has(
        file.type
      )
    ) {
      return ApiResponse.error({
        message:
          "Unsupported file type.",
        code: "INVALID_FILE_TYPE",
        status: 400,
      });
    }

    if (file.size <= 0) {
      return ApiResponse.error({
        message:
          "The uploaded file is empty.",
        code: "INVALID_FILE",
        status: 400,
      });
    }

    if (
      file.size > MAX_FILE_SIZE
    ) {
      return ApiResponse.error({
        message:
          "File size must not exceed 20 MB.",
        code: "FILE_TOO_LARGE",
        status: 400,
      });
    }

    const folder =
      sanitizeFolder(
        formData
          .get("folder")
          ?.toString() ??
          "general"
      );

    const storedFileName =
      generateStoredFilename(
        file.name
      );

    /*
     * The storage key is intentionally independent
     * of the physical storage provider.
     *
     * Example:
     * products/1750000000000-uuid.webp
     *
     * This same key works with both local storage
     * and Cloudflare R2.
     */
    storageKey =
      `${folder}/${storedFileName}`;

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const storage =
      getStorageProvider();

    /*
     * Upload the physical file first.
     *
     * The selected provider is determined by:
     *
     * STORAGE_PROVIDER=local
     * or
     * STORAGE_PROVIDER=r2
     */
    const uploaded =
      await storage.upload({
        key: storageKey,
        body: buffer,
        contentType: file.type,
      });

    const title =
      formData
        .get("title")
        ?.toString()
        .trim() ||
      path.parse(
        file.name
      ).name;

    const altText =
      formData
        .get("altText")
        ?.toString()
        .trim() ||
      path.parse(
        file.name
      ).name;

    const description =
      formData
        .get("description")
        ?.toString()
        .trim() ||
      undefined;

    /*
     * Store the logical storage key in storedFileName.
     *
     * Example:
     * products/1750000000000-uuid.webp
     *
     * fileUrl contains the actual public URL returned
     * by the storage provider.
     */
    const media =
      await mediaService.create({
        fileName: file.name,
        storedFileName:
          uploaded.key,
        fileUrl:
          uploaded.url,
        storageProvider:
          uploaded.provider,
        mimeType: file.type,
        mediaType:
          resolveMediaType(
            file.type
          ),
        fileSize: file.size,
        folder,
        title,
        altText,
        description,
      });

    return ApiResponse.created({
      message:
        "Media uploaded successfully.",
      data: media,
    });
  } catch (error) {
    /*
     * If storage upload succeeded but the Media database
     * record failed, remove the physical object so we
     * don't leave orphaned files in local storage or R2.
     */
    if (storageKey) {
      try {
        const storage =
          getStorageProvider();

        await storage.delete(
          storageKey
        );
      } catch (cleanupError) {
        console.error(
          "Failed to clean up uploaded media after error.",
          cleanupError
        );
      }
    }

    return handleApiError(error);
  }
}