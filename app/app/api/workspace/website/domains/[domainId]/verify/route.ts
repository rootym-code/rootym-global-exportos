/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Verifies a Workspace Website domain through its DNS
 *          verification record using reliable TXT resolution.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

import { getSubscriptionAccessStatus } from "@/lib/services/billing/subscription-access.service";

import { prisma } from "@/lib/prisma";

import { resolveTxtRecord } from "@/lib/services/dns/dns-txt.service";

import {
  markWebsiteDomainVerificationFailed,
  markWebsiteDomainVerified,
} from "@/lib/workspace/website/website-domain.service";

type RouteContext = {
  params: Promise<{
    domainId: string;
  }>;
};

class SubscriptionRequiredError extends Error {
  constructor() {
    super("An active paid subscription is required.");
    this.name = "SubscriptionRequiredError";
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

  const subscriptionAccess = await getSubscriptionAccessStatus(
    workspace.membership.tenant.id,
  );

  if (
    subscriptionAccess.status === "EXPIRED" ||
    subscriptionAccess.status === "NO_SUBSCRIPTION"
  ) {
    throw new SubscriptionRequiredError();
  }

  return { workspace, website };
}

function normalizeDnsName(value: string) {
  return value.trim().toLowerCase().replace(/\.$/, "");
}

function normalizeDnsValue(value: string) {
  return value.trim().replace(/^"(.*)"$/, "$1").replace(/\.$/, "");
}

async function findTxtVerificationRecord(
  name: string,
  expectedValue: string,
) {
  const records = await resolveTxtRecord(name);
  const expected = normalizeDnsValue(expectedValue);

  return records.some((record) => {
    const value = normalizeDnsValue(record.join(""));
    return value === expected;
  });
}

export async function POST(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { website } = await getWorkspaceWebsite();
    const { domainId } = await context.params;

    if (!domainId) {
      return NextResponse.json(
        { error: "Domain ID is required." },
        { status: 400 },
      );
    }

    /*
     * Read the verification fields directly from the Website-scoped row.
     * The persistence service intentionally exposes a smaller summary type
     * in some repository versions, so the verification endpoint selects
     * only the fields it needs here.
     */
    const domain = await prisma.websiteDomain.findFirst({
      where: {
        id: domainId,
        websiteId: website.id,
      },
      select: {
        id: true,
        verificationStatus: true,
        verificationToken: true,
        verificationRecordName: true,
        verificationRecordValue: true,
      },
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Website domain not found." },
        { status: 404 },
      );
    }

    if (domain.verificationStatus === "VERIFIED") {
      return NextResponse.json({
        success: true,
        verified: true,
        domainId: domain.id,
        message: "Domain is already verified.",
      });
    }

    if (
      !domain.verificationToken ||
      !domain.verificationRecordName ||
      !domain.verificationRecordValue
    ) {
      return NextResponse.json(
        {
          error:
            "DNS verification has not been configured for this domain.",
          code: "VERIFICATION_NOT_CONFIGURED",
        },
        { status: 400 },
      );
    }

    const recordName = normalizeDnsName(
      domain.verificationRecordName,
    );

    try {
      const verified = await findTxtVerificationRecord(
        recordName,
        domain.verificationRecordValue,
      );

      if (!verified) {
        await markWebsiteDomainVerificationFailed(
          website.id,
          domainId,
          "DNS TXT verification record was not found.",
        );

        return NextResponse.json(
          {
            success: false,
            verified: false,
            domainId: domain.id,
            code: "DNS_RECORD_NOT_FOUND",
            message:
              "The required DNS TXT record was not found. Please add the record and try again.",
          },
          { status: 422 },
        );
      }

      const verifiedDomain =
        await markWebsiteDomainVerified(
          website.id,
          domainId,
        );

      return NextResponse.json({
        success: true,
        verified: true,
        domain: verifiedDomain,
        message: "Domain DNS verification successful.",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "DNS lookup failed.";

      await markWebsiteDomainVerificationFailed(
        website.id,
        domainId,
        message,
      );

      return NextResponse.json(
        {
          success: false,
          verified: false,
          domainId: domain.id,
          code: "DNS_LOOKUP_FAILED",
          message:
            "We could not verify the DNS record yet. Please confirm the record and try again.",
        },
        { status: 422 },
      );
    }
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
          error: "An active paid subscription is required.",
          code: "SUBSCRIPTION_REQUIRED",
        },
        { status: 403 },
      );
    }

    if (
      error instanceof Error &&
      error.message === "Website domain not found."
    ) {
      return NextResponse.json(
        { error: "Website domain not found." },
        { status: 404 },
      );
    }

    console.error(
      "[Workspace Website Domain Verify]",
      error,
    );

    return NextResponse.json(
      { error: "Failed to verify website domain." },
      { status: 500 },
    );
  }
}