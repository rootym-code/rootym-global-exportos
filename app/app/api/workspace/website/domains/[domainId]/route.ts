/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides Workspace-scoped CRUD operations and
 *          controlled Vercel connection and provider-state
 *          inspection for an individual Website domain.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

import { getSubscriptionAccessStatus } from "@/lib/services/billing/subscription-access.service";

import {
  getVercelDomainConfig,
  getVercelProjectDomain,
  VercelProviderError,
} from "@/lib/services/deployment/vercel.provider";

import { prisma } from "@/lib/prisma";

import {
  attachWebsiteDomainToVercel,
} from "@/lib/workspace/website/website-deployment.service";

import {
  getWebsiteDomain,
  removeWebsiteDomain,
  updateWebsiteDomain,
  type UpdateWebsiteDomainInput,
} from "@/lib/workspace/website/website-domain.service";

type RouteContext = {
  params: Promise<{ domainId: string }>;
};

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

async function requirePaidWorkspace() {
  const { workspace, website } = await getWorkspaceWebsite();

  const subscriptionAccess = await getSubscriptionAccessStatus(
    workspace.membership.tenant.id,
  );

  if (
    subscriptionAccess.status === "EXPIRED" ||
    subscriptionAccess.status === "NO_SUBSCRIPTION"
  ) {
    throw new SubscriptionRequiredError();
  }

  return {
    workspace,
    website,
  };
}

class SubscriptionRequiredError extends Error {
  constructor() {
    super("An active paid subscription is required.");
    this.name = "SubscriptionRequiredError";
  }
}

function isNotFoundError(error: unknown) {
  return (
    error instanceof Error &&
    error.message === "Website domain not found."
  );
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { website } = await requirePaidWorkspace();

    const { domainId } = await context.params;

    if (!domainId) {
      return NextResponse.json(
        { error: "Domain ID is required." },
        { status: 400 },
      );
    }

    const domain = await getWebsiteDomain(
      website.id,
      domainId,
    );

    if (!domain) {
      return NextResponse.json(
        { error: "Website domain not found." },
        { status: 404 },
      );
    }

    const provider =
      request.nextUrl.searchParams.get("provider");

    if (provider === "vercel") {
      const providerDomain =
        await getVercelProjectDomain(domain.domain);

      const providerConfig =
        await getVercelDomainConfig(domain.domain);

      return NextResponse.json({
        domain,
        provider: "vercel",
        providerDomain,
        providerConfig,
      });
    }

    return NextResponse.json({ domain });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "NEXT_REDIRECT"
    ) {
      throw error;
    }

    if (error instanceof SubscriptionRequiredError) {
      return NextResponse.json(
        {
          error: error.message,
          code: "SUBSCRIPTION_REQUIRED",
        },
        { status: 403 },
      );
    }

    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Website domain not found." },
        { status: 404 },
      );
    }

    if (error instanceof VercelProviderError) {
      const status =
        error.status >= 400 && error.status < 500
          ? error.status
          : 502;

      return NextResponse.json(
        {
          error: error.message,
          code: error.code ?? "VERCEL_PROVIDER_ERROR",
        },
        { status },
      );
    }

    console.error(
      "[Workspace Website Domains GET]",
      error,
    );

    return NextResponse.json(
      { error: "Failed to retrieve website domain." },
      { status: 500 },
    );
  }
}

/**
 * Connect a verified Website domain to the configured
 * ROOTYM Vercel project.
 *
 * This performs the real provider operation. It does not
 * mark SSL ACTIVE or deployment LIVE.
 */
export async function POST(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { website } = await requirePaidWorkspace();

    const { domainId } = await context.params;

    if (!domainId) {
      return NextResponse.json(
        { error: "Domain ID is required." },
        { status: 400 },
      );
    }

    const providerDomain =
      await attachWebsiteDomainToVercel(
        website.id,
        domainId,
      );

    return NextResponse.json({
      success: true,
      provider: "vercel",
      domain: providerDomain,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "NEXT_REDIRECT"
    ) {
      throw error;
    }

    if (error instanceof SubscriptionRequiredError) {
      return NextResponse.json(
        {
          error: error.message,
          code: "SUBSCRIPTION_REQUIRED",
        },
        { status: 403 },
      );
    }

    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Website domain not found." },
        { status: 404 },
      );
    }

    if (error instanceof VercelProviderError) {
      const status =
        error.status >= 400 && error.status < 500
          ? error.status
          : 502;

      return NextResponse.json(
        {
          error: error.message,
          code: error.code ?? "VERCEL_PROVIDER_ERROR",
        },
        { status },
      );
    }

    console.error(
      "[Workspace Website Domains POST]",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to connect website domain to Vercel.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { website } = await requirePaidWorkspace();

    const { domainId } = await context.params;

    if (!domainId) {
      return NextResponse.json(
        { error: "Domain ID is required." },
        { status: 400 },
      );
    }

    const body =
      (await request.json()) as Record<string, unknown>;

    const input: UpdateWebsiteDomainInput = {};

    if (body.label !== undefined) {
      if (
        body.label !== null &&
        typeof body.label !== "string"
      ) {
        return NextResponse.json(
          {
            error:
              "Label must be a string or null.",
          },
          { status: 400 },
        );
      }

      input.label = body.label as string | null;
    }

    if (body.isPrimary !== undefined) {
      if (typeof body.isPrimary !== "boolean") {
        return NextResponse.json(
          {
            error:
              "isPrimary must be a boolean.",
          },
          { status: 400 },
        );
      }

      input.isPrimary = body.isPrimary;
    }

    if (Object.keys(input).length === 0) {
      return NextResponse.json(
        {
          error:
            "No supported fields were provided.",
        },
        { status: 400 },
      );
    }

    const domain = await updateWebsiteDomain(
      website.id,
      domainId,
      input,
    );

    return NextResponse.json({ domain });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "NEXT_REDIRECT"
    ) {
      throw error;
    }

    if (error instanceof SubscriptionRequiredError) {
      return NextResponse.json(
        {
          error: error.message,
          code: "SUBSCRIPTION_REQUIRED",
        },
        { status: 403 },
      );
    }

    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Website domain not found." },
        { status: 404 },
      );
    }

    console.error(
      "[Workspace Website Domains PATCH]",
      error,
    );

    return NextResponse.json(
      { error: "Failed to update website domain." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { website } = await requirePaidWorkspace();

    const { domainId } = await context.params;

    if (!domainId) {
      return NextResponse.json(
        { error: "Domain ID is required." },
        { status: 400 },
      );
    }

    await removeWebsiteDomain(
      website.id,
      domainId,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "NEXT_REDIRECT"
    ) {
      throw error;
    }

    if (error instanceof SubscriptionRequiredError) {
      return NextResponse.json(
        {
          error: error.message,
          code: "SUBSCRIPTION_REQUIRED",
        },
        { status: 403 },
      );
    }

    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Website domain not found." },
        { status: 404 },
      );
    }

    console.error(
      "[Workspace Website Domains DELETE]",
      error,
    );

    return NextResponse.json(
      { error: "Failed to remove website domain." },
      { status: 500 },
    );
  }
}