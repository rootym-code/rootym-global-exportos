
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireWorkspaceWebsite } from "@/app/lib/workspace/website/website-context.service";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 },
      );
    }

    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("onlinePurchaseEnabled" in body) ||
      typeof body.onlinePurchaseEnabled !== "boolean" ||
      Object.keys(body).length !== 1
    ) {
      return NextResponse.json(
        {
          error:
            "Provide only a Boolean onlinePurchaseEnabled value.",
        },
        { status: 400 },
      );
    }

    const { website, membership } = await requireWorkspaceWebsite();

    if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only workspace owners and admins can update online purchase settings." },
        { status: 403 },
      );
    }

    const result = await prisma.product.updateMany({
      where: {
        id,
        websiteId: website.id,
      },
      data: {
        onlinePurchaseEnabled: body.onlinePurchaseEnabled,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      id,
      onlinePurchaseEnabled: body.onlinePurchaseEnabled,
    });
  } catch (error) {
    console.error(
      "[Online Purchase PATCH] Failed to update preference:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update online purchase preference.",
      },
      { status: 500 },
    );
  }
}
