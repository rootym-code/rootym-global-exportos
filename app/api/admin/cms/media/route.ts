import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import { MediaType } from "@/lib/generated/prisma";

import ApiResponse from "@/lib/api/api-response";
import mediaService from "@/lib/services/cms/media.service";

export const runtime = "nodejs";

const UPLOAD_ROOT = path.join(
  process.cwd(),
  "public",
  "uploads"
);

const PRODUCT_UPLOAD_FOLDER = "products";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

async function ensureDirectoryExists(
  directory: string
) {
  await fs.mkdir(directory, {
    recursive: true,
  });
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(
      searchParams.get("page") ?? 1
    );

    const limit = Number(
      searchParams.get("limit") ?? 10
    );

    const search =
      searchParams.get("search") ?? undefined;

    const folder =
      searchParams.get("folder") ?? undefined;

    const mediaType =
      (searchParams.get("mediaType") as
        | MediaType
        | null) ?? undefined;

    const includeDeleted =
      searchParams.get("includeDeleted") ===
      "true";

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
    console.error(error);

    return ApiResponse.error({
      message: "Failed to load media.",
    });
  }
}
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return ApiResponse.error({
        message: "No file uploaded.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return ApiResponse.error({
        message: "Unsupported file type.",
        code: "INVALID_FILE_TYPE",
        status: 400,
      });
    }

    const uploadDirectory = path.join(
      UPLOAD_ROOT,
      PRODUCT_UPLOAD_FOLDER
    );

    await ensureDirectoryExists(uploadDirectory);

    const storedFileName = generateStoredFilename(
      file.name
    );

    const absolutePath = path.join(
      uploadDirectory,
      storedFileName
    );

    const bytes = await file.arrayBuffer();

    await fs.writeFile(
      absolutePath,
      Buffer.from(bytes)
    );

    const media = await mediaService.create({
      fileName: file.name,
      storedFileName,
      fileUrl: `/uploads/products/${storedFileName}`,
      storageProvider: "local",
      mimeType: file.type,
      mediaType: MediaType.IMAGE,
      fileSize: file.size,
      folder: PRODUCT_UPLOAD_FOLDER,
      title: path.parse(file.name).name,
      altText: path.parse(file.name).name,
    });

    return ApiResponse.created({
      message: "Media uploaded successfully.",
      data: media,
    });
  } catch (error) {
    console.error(error);

    return ApiResponse.error({
      message: "Failed to upload media.",
    });
  }
}

 