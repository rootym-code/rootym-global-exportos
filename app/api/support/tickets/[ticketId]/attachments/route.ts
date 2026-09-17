/**
 * ============================================================
 * ROOTYM Customer Support Attachment API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated customer upload of files and
 *          screenshots to a tenant-owned Support Ticket.
 * ============================================================
 */

import { randomUUID } from "crypto";
import path from "path";

import { NextRequest, NextResponse } from "next/server";
import { MediaType } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { requireCustomerSession } from "@/lib/auth/customer";
import getStorageProvider from "@/lib/services/storage/storage.service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    ticketId: string;
  }>;
};

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

function resolveMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith("image/")) {
    return MediaType.IMAGE;
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

function getExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

function generateStoredFilename(originalName: string): string {
  return `${Date.now()}-${randomUUID()}${getExtension(originalName)}`;
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  let storageKey: string | null = null;

  const auth = await requireCustomerSession(request);

  if (!auth.ok) {
    return NextResponse.json(
      {
        success: false,
        error: auth.error,
      },
      { status: auth.status },
    );
  }

  const { ticketId } = await context.params;

  if (!ticketId) {
    return NextResponse.json(
      {
        success: false,
        error: "Ticket ID is required.",
      },
      { status: 400 },
    );
  }

  try {
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id: ticketId,
        tenantId: auth.tenant.id,
        createdById: auth.user.id,
      },
      select: {
        id: true,
        websiteId: true,
        status: true,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: "Support ticket not found.",
        },
        { status: 404 },
      );
    }

    if (ticket.status === "CLOSED") {
      return NextResponse.json(
        {
          success: false,
          error: "Attachments cannot be added to a closed ticket.",
        },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No file uploaded.",
        },
        { status: 400 },
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unsupported file type. Allowed files are images, PDF, Word and Excel documents.",
        },
        { status: 400 },
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "The uploaded file is empty.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File size must not exceed 20 MB.",
        },
        { status: 400 },
      );
    }

    const storedFileName = generateStoredFilename(file.name);

    storageKey = `support/${ticket.id}/${storedFileName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const storage = getStorageProvider();

    const uploaded = await storage.upload({
      key: storageKey,
      body: buffer,
      contentType: file.type,
    });

    const title =
      formData.get("title")?.toString().trim() ||
      path.parse(file.name).name;

    const media = await prisma.media.create({
      data: {
        fileName: file.name,
        storedFileName: uploaded.key,
        fileUrl: uploaded.url,
        storageProvider: uploaded.provider,
        mimeType: file.type,
        mediaType: resolveMediaType(file.type),
        fileSize: file.size,
        title,
        altText: title,
        folder: "support",
        websiteId: ticket.websiteId,
      },
    });

    const attachment = await prisma.supportTicketAttachment.create({
      data: {
        ticketId: ticket.id,
        mediaId: media.id,
      },
      include: {
        media: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Support attachment uploaded successfully.",
        data: attachment,
      },
      { status: 201 },
    );
  } catch (error) {
    if (storageKey) {
      try {
        const storage = getStorageProvider();
        await storage.delete(storageKey);
      } catch (cleanupError) {
        console.error(
          "Failed to clean up support attachment after error.",
          cleanupError,
        );
      }
    }

    console.error(
      "POST /api/support/tickets/[ticketId]/attachments failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to upload the support attachment.",
      },
      { status: 500 },
    );
  }
}
