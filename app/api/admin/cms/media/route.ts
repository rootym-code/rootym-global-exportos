/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author      : Prem Singh
 * Module      : CMS
 * Feature     : Media Library Upload API
 * File        : app/api/admin/cms/media/route.ts
 * Purpose     : Authenticated CMS media upload and listing.
 * ============================================================
 */

import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import { NextRequest } from "next/server";

import { MediaType } from "@/lib/generated/prisma";
import { authenticateAdmin } from "@/lib/auth";
import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import mediaService from "@/lib/services/cms/media.service";

export const runtime = "nodejs";

const UPLOAD_ROOT = path.join(
  process.cwd(),
  "public",
  "uploads"
);

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
    mimeType.includes("wordprocessingml") ||
    mimeType === "application/vnd.ms-excel" ||
    mimeType.includes("spreadsheetml")
  ) {
    return MediaType.DOCUMENT;
  }

  return MediaType.OTHER;
}

function sanitizeFolder(value: string | null): string {
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

function generateStoredFilename(originalName: string) {
  return `${Date.now()}-${randomUUID()}${getExtension(
    originalName
  )}`;
}

async function ensureDirectoryExists(directory: string) {
  await fs.mkdir(directory, { recursive: true });
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated) {
      return ApiResponse.error({
        message: auth.error ?? "Unauthorized.",
        code: "UNAUTHORIZED",
        status: auth.status,
      });
    }

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);
    const search = searchParams.get("search") ?? undefined;
    const folder = searchParams.get("folder") ?? undefined;
    const mediaType =
      (searchParams.get("mediaType") as MediaType | null) ??
      undefined;
    const includeDeleted =
      searchParams.get("includeDeleted") === "true";

    const result = await mediaService.list(
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
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  let absolutePath: string | null = null;

  try {
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated || !auth.admin) {
      return ApiResponse.error({
        message: auth.error ?? "Unauthorized.",
        code: "UNAUTHORIZED",
        status: auth.status,
      });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return ApiResponse.error({
        message: "No file uploaded.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return ApiResponse.error({
        message: "Unsupported file type.",
        code: "INVALID_FILE_TYPE",
        status: 400,
      });
    }

    if (file.size <= 0) {
      return ApiResponse.error({
        message: "The uploaded file is empty.",
        code: "INVALID_FILE",
        status: 400,
      });
    }

    if (file.size > MAX_FILE_SIZE) {
      return ApiResponse.error({
        message: "File size must not exceed 20 MB.",
        code: "FILE_TOO_LARGE",
        status: 400,
      });
    }

    const folder = sanitizeFolder(
      formData.get("folder")?.toString() ?? "general"
    );

    const uploadDirectory = path.join(
      UPLOAD_ROOT,
      folder
    );

    await ensureDirectoryExists(uploadDirectory);

    const storedFileName = generateStoredFilename(
      file.name
    );

    absolutePath = path.join(
      uploadDirectory,
      storedFileName
    );

    const bytes = await file.arrayBuffer();

    await fs.writeFile(
      absolutePath,
      Buffer.from(bytes)
    );

    const title =
      formData.get("title")?.toString().trim() ||
      path.parse(file.name).name;

    const altText =
      formData.get("altText")?.toString().trim() ||
      path.parse(file.name).name;

    const description =
      formData.get("description")?.toString().trim() ||
      undefined;

    const media = await mediaService.create({
      fileName: file.name,
      storedFileName,
      fileUrl: `/uploads/${folder}/${storedFileName}`,
      storageProvider: "local",
      mimeType: file.type,
      mediaType: resolveMediaType(file.type),
      fileSize: file.size,
      folder,
      title,
      altText,
      description,
    });

    return ApiResponse.created({
      message: "Media uploaded successfully.",
      data: media,
    });
  } catch (error) {
    if (absolutePath) {
      try {
        await fs.unlink(absolutePath);
      } catch {
        // Ignore cleanup errors after a failed upload.
      }
    }

    return handleApiError(error);
  }
}
