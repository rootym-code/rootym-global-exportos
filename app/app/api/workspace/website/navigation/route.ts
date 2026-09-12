/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides Website-scoped Navigation API endpoints
 *          for the authenticated customer workspace.
 * ============================================================
 */

import { NextResponse } from "next/server";

import {
  getWebsiteNavigation,
  updateWebsiteNavigation,
} from "@/app/lib/workspace/website/website-navigation.service";

function isRedirectError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

function errorResponse(error: unknown) {
  if (isRedirectError(error)) {
    throw error;
  }

  const message =
    error instanceof Error
      ? error.message
      : "Unable to process Website navigation.";

  const normalized = message.toLowerCase();

  if (
    normalized.includes("authentication") ||
    normalized.includes("unauthorized") ||
    normalized.includes("customer workspace")
  ) {
    return NextResponse.json(
      {
        success: false,
        message,
        code: "AUTHENTICATION_REQUIRED",
      },
      { status: 401 }
    );
  }

  if (
    normalized.includes("not found") ||
    normalized.includes("not configured")
  ) {
    return NextResponse.json(
      {
        success: false,
        message,
        code: "NOT_FOUND",
      },
      { status: 404 }
    );
  }

  if (
    normalized.includes("another website") ||
    normalized.includes("invalid menu item") ||
    normalized.includes("invalid parent")
  ) {
    return NextResponse.json(
      {
        success: false,
        message,
        code: "INVALID_NAVIGATION",
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message,
      code: "NAVIGATION_ERROR",
    },
    { status: 500 }
  );
}

export async function GET() {
  try {
    const data = await getWebsiteNavigation();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json(
        {
          success: false,
          message: "Navigation items are required.",
          code: "INVALID_REQUEST",
        },
        { status: 400 }
      );
    }

    const items = body.items.map((item: unknown) => {
      if (!item || typeof item !== "object") {
        throw new Error("Navigation contains an invalid item.");
      }

      const value = item as Record<string, unknown>;

      if (
        typeof value.id !== "string" ||
        typeof value.label !== "string" ||
        typeof value.url !== "string" ||
        typeof value.sortOrder !== "number"
      ) {
        throw new Error("Navigation contains an invalid item.");
      }

      return {
        id: value.id,
        label: value.label,
        url: value.url,
        pageId:
          typeof value.pageId === "string"
            ? value.pageId
            : value.pageId === null
              ? null
              : undefined,
        parentId:
          typeof value.parentId === "string"
            ? value.parentId
            : value.parentId === null
              ? null
              : undefined,
        sortOrder: value.sortOrder,
        openInNewTab:
          typeof value.openInNewTab === "boolean"
            ? value.openInNewTab
            : false,
        isVisible:
          typeof value.isVisible === "boolean"
            ? value.isVisible
            : true,
      };
    });

    const data = await updateWebsiteNavigation(items);

    return NextResponse.json({
      success: true,
      data,
      message: "Website navigation saved successfully.",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
