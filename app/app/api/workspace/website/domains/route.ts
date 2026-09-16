/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated Workspace API access for
 *          custom-domain listing and connection.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import { getSubscriptionAccessStatus } from "@/lib/services/billing/subscription-access.service";
import { prisma } from "@/lib/prisma";
import {
  addWebsiteDomain,
  listWebsiteDomains,
  type AddWebsiteDomainInput,
} from "@/lib/workspace/website/website-domain.service";

function isNextRedirect(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const digest = "digest" in error ? error.digest : undefined;

  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Unable to process the domain request.";
}

function assertPaidDeploymentAccess(
  subscriptionAccess: Awaited<ReturnType<typeof getSubscriptionAccessStatus>>
) {
  const isPaid =
    subscriptionAccess.subscriptionStatus === "ACTIVE" &&
    (subscriptionAccess.status === "ACTIVE" ||
      subscriptionAccess.status === "EXPIRING");

  if (!isPaid) {
    throw new Error(
      "A paid ROOTYM subscription is required for custom-domain deployment."
    );
  }
}

async function getWorkspaceWebsite() {
  const workspace = await requireWorkspaceAccess();

  const website = await prisma.website.findUnique({
    where: {
      tenantId: workspace.membership.tenant.id,
    },
    select: {
      id: true,
      tenantId: true,
    },
  });

  if (!website) {
    throw new Error("Website not found for this workspace.");
  }

  return {
    workspace,
    website,
  };
}

function errorResponse(error: unknown) {
  if (isNextRedirect(error)) {
    throw error;
  }

  const message = getErrorMessage(error);

  const status =
    message.includes("required") || message.includes("subscription")
      ? 403
      : message.includes("not found")
        ? 404
        : message.includes("already connected")
          ? 409
          : 400;

  return NextResponse.json(
    {
      ok: false,
      error: message,
    },
    { status }
  );
}

export async function GET() {
  try {
    const { workspace, website } = await getWorkspaceWebsite();

    const subscriptionAccess = await getSubscriptionAccessStatus(
      workspace.membership.tenant.id
    );

    assertPaidDeploymentAccess(subscriptionAccess);

    const domains = await listWebsiteDomains(website.id);

    return NextResponse.json({
      ok: true,
      domains,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { workspace, website } = await getWorkspaceWebsite();

    const subscriptionAccess = await getSubscriptionAccessStatus(
      workspace.membership.tenant.id
    );

    assertPaidDeploymentAccess(subscriptionAccess);

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          ok: false,
          error: "Request body must be an object.",
        },
        { status: 400 }
      );
    }

    const payload = body as Record<string, unknown>;

    if (typeof payload.domain !== "string") {
      return NextResponse.json(
        {
          ok: false,
          error: "Domain is required.",
        },
        { status: 400 }
      );
    }

    const input: AddWebsiteDomainInput = {
      domain: payload.domain,
      label:
        payload.label === null || typeof payload.label === "string"
          ? payload.label
          : undefined,
      isPrimary:
        payload.isPrimary === undefined
          ? undefined
          : payload.isPrimary === true,
    };

    const domain = await addWebsiteDomain(website.id, input);

    return NextResponse.json(
      {
        ok: true,
        domain,
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
