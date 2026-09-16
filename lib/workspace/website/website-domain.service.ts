/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides Website-scoped custom-domain management
 *          for the Workspace deployment workflow.
 * ============================================================
 */

import {
  WebsiteDomainDeploymentStatus,
  WebsiteDomainSslStatus,
  WebsiteDomainVerificationMethod,
  WebsiteDomainVerificationStatus,
} from "@/lib/generated/prisma";

import { prisma } from "@/lib/prisma";

export type WebsiteDomainSummary = {
  id: string;
  websiteId: string;
  domain: string;
  label: string | null;
  isPrimary: boolean;
  verificationStatus: WebsiteDomainVerificationStatus;
  verificationMethod: WebsiteDomainVerificationMethod;
  verificationRecordType: string | null;
  verificationRecordName: string | null;
  verificationRecordValue: string | null;
  verifiedAt: Date | null;
  sslStatus: WebsiteDomainSslStatus;
  sslIssuedAt: Date | null;
  sslExpiresAt: Date | null;
  deploymentStatus: WebsiteDomainDeploymentStatus;
  lastDeploymentAt: Date | null;
  lastCheckedAt: Date | null;
  lastError: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AddWebsiteDomainInput = {
  domain: string;
  label?: string | null;
  isPrimary?: boolean;
};

export type UpdateWebsiteDomainInput = {
  label?: string | null;
  isPrimary?: boolean;
};

const DOMAIN_PATTERN =
  /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;

function normalizeDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.$/, "");
}

function normalizeLabel(value?: string | null) {
  const normalized = value?.trim() ?? "";
  return normalized.length > 0 ? normalized : null;
}

function assertValidDomain(domain: string) {
  if (!DOMAIN_PATTERN.test(domain)) {
    throw new Error("Enter a valid custom domain, such as www.example.com.");
  }

  if (
    domain === "localhost" ||
    domain.endsWith(".localhost") ||
    domain === "127.0.0.1"
  ) {
    throw new Error("Local development domains cannot be connected as custom domains.");
  }
}

function buildVerificationToken() {
  return crypto.randomUUID().replace(/-/g, "");
}

async function findWebsite(websiteId: string) {
  return prisma.website.findUnique({
    where: {
      id: websiteId,
    },
    select: {
      id: true,
      tenantId: true,
    },
  });
}

async function findWebsiteDomain(websiteId: string, domainId: string) {
  return prisma.websiteDomain.findFirst({
    where: {
      id: domainId,
      websiteId,
    },
  });
}

/**
 * Return all custom domains belonging to the supplied Website.
 *
 * IMPORTANT:
 * The caller must obtain websiteId from the authenticated Workspace
 * context. This service never discovers a Website from an arbitrary
 * customer-supplied tenant/domain value.
 */
export async function listWebsiteDomains(
  websiteId: string
): Promise<WebsiteDomainSummary[]> {
  const website = await findWebsite(websiteId);

  if (!website) {
    throw new Error("Website not found.");
  }

  return prisma.websiteDomain.findMany({
    where: {
      websiteId: website.id,
    },
    orderBy: [
      {
        isPrimary: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
  });
}

/**
 * Return one custom domain, strictly scoped to the supplied Website.
 */
export async function getWebsiteDomain(
  websiteId: string,
  domainId: string
): Promise<WebsiteDomainSummary | null> {
  const website = await findWebsite(websiteId);

  if (!website) {
    throw new Error("Website not found.");
  }

  return findWebsiteDomain(website.id, domainId);
}

/**
 * Add a custom domain to a Website.
 *
 * DNS verification is deliberately not performed here. The record
 * information is generated and persisted so the UI/API can present
 * deterministic instructions before verification.
 */
export async function addWebsiteDomain(
  websiteId: string,
  input: AddWebsiteDomainInput
): Promise<WebsiteDomainSummary> {
  const website = await findWebsite(websiteId);

  if (!website) {
    throw new Error("Website not found.");
  }

  const domain = normalizeDomain(input.domain);

  assertValidDomain(domain);

  const existing = await prisma.websiteDomain.findUnique({
    where: {
      domain,
    },
    select: {
      id: true,
      websiteId: true,
    },
  });

  if (existing) {
    if (existing.websiteId === website.id) {
      throw new Error("This domain is already connected to this website.");
    }

    throw new Error("This domain is already connected to another website.");
  }

  const shouldBePrimary =
    input.isPrimary === true ||
    (await prisma.websiteDomain.count({
      where: {
        websiteId: website.id,
      },
    })) === 0;

  const verificationToken = buildVerificationToken();

  return prisma.$transaction(async (tx) => {
    if (shouldBePrimary) {
      await tx.websiteDomain.updateMany({
        where: {
          websiteId: website.id,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    return tx.websiteDomain.create({
      data: {
        websiteId: website.id,
        domain,
        label: normalizeLabel(input.label),
        isPrimary: shouldBePrimary,
        verificationStatus: WebsiteDomainVerificationStatus.PENDING,
        verificationMethod: WebsiteDomainVerificationMethod.DNS,
        verificationToken,
        verificationRecordType: "TXT",
        verificationRecordName: `_rootym-verification.${domain}`,
        verificationRecordValue: verificationToken,
        sslStatus: WebsiteDomainSslStatus.NOT_CONFIGURED,
        deploymentStatus: WebsiteDomainDeploymentStatus.NOT_DEPLOYED,
      },
    });
  });
}

/**
 * Update presentation/primary-domain settings without changing
 * verification or deployment state.
 */
export async function updateWebsiteDomain(
  websiteId: string,
  domainId: string,
  input: UpdateWebsiteDomainInput
): Promise<WebsiteDomainSummary> {
  const website = await findWebsite(websiteId);

  if (!website) {
    throw new Error("Website not found.");
  }

  const existing = await findWebsiteDomain(website.id, domainId);

  if (!existing) {
    throw new Error("Domain not found.");
  }

  if (input.isPrimary === true) {
    const primaryDomain = await setPrimaryWebsiteDomain(
      website.id,
      domainId,
    );

    if (input.label === undefined) {
      return primaryDomain;
    }

    return prisma.websiteDomain.update({
      where: {
        id: domainId,
      },
      data: {
        label: normalizeLabel(input.label),
      },
    });
  }

  return prisma.websiteDomain.update({
    where: {
      id: domainId,
    },
    data: {
      ...(input.label !== undefined
        ? {
            label: normalizeLabel(input.label),
          }
        : {}),
      ...(input.isPrimary !== undefined
        ? {
            isPrimary: input.isPrimary,
          }
        : {}),
    },
  });
}

/**
 * Mark a verified domain as the Website's primary domain.
 *
 * A domain does not need to be deployed to become primary, but it must
 * first pass verification.
 */
export async function setPrimaryWebsiteDomain(
  websiteId: string,
  domainId: string
): Promise<WebsiteDomainSummary> {
  const website = await findWebsite(websiteId);

  if (!website) {
    throw new Error("Website not found.");
  }

  const existing = await findWebsiteDomain(website.id, domainId);

  if (!existing) {
    throw new Error("Domain not found.");
  }

  if (existing.verificationStatus !== WebsiteDomainVerificationStatus.VERIFIED) {
    throw new Error("Only a verified domain can be made primary.");
  }

  return prisma.$transaction(async (tx) => {
    await tx.websiteDomain.updateMany({
      where: {
        websiteId: website.id,
        isPrimary: true,
      },
      data: {
        isPrimary: false,
      },
    });

    return tx.websiteDomain.update({
      where: {
        id: domainId,
      },
      data: {
        isPrimary: true,
      },
    });
  });
}

/**
 * Remove a custom domain from a Website.
 *
 * This is intentionally a Website-scoped operation. Deployment-provider
 * teardown should be performed by a separate integration service once
 * an actual provider is connected.
 */
export async function removeWebsiteDomain(
  websiteId: string,
  domainId: string
): Promise<void> {
  const website = await findWebsite(websiteId);

  if (!website) {
    throw new Error("Website not found.");
  }

  const existing = await findWebsiteDomain(website.id, domainId);

  if (!existing) {
    throw new Error("Domain not found.");
  }

  await prisma.websiteDomain.delete({
    where: {
      id: domainId,
    },
  });
}

/**
 * Update DNS verification state after an external DNS check.
 *
 * The actual DNS lookup/provider implementation belongs outside this
 * persistence service. This function only persists the verified result.
 */
export async function markWebsiteDomainVerified(
  websiteId: string,
  domainId: string
): Promise<WebsiteDomainSummary> {
  const website = await findWebsite(websiteId);

  if (!website) {
    throw new Error("Website not found.");
  }

  const existing = await findWebsiteDomain(website.id, domainId);

  if (!existing) {
    throw new Error("Domain not found.");
  }

  return prisma.websiteDomain.update({
    where: {
      id: domainId,
    },
    data: {
      verificationStatus: WebsiteDomainVerificationStatus.VERIFIED,
      verifiedAt: new Date(),
      lastCheckedAt: new Date(),
      lastError: null,
    },
  });
}

/**
 * Persist a failed verification attempt.
 */
export async function markWebsiteDomainVerificationFailed(
  websiteId: string,
  domainId: string,
  errorMessage: string
): Promise<WebsiteDomainSummary> {
  const website = await findWebsite(websiteId);

  if (!website) {
    throw new Error("Website not found.");
  }

  const existing = await findWebsiteDomain(website.id, domainId);

  if (!existing) {
    throw new Error("Domain not found.");
  }

  return prisma.websiteDomain.update({
    where: {
      id: domainId,
    },
    data: {
      verificationStatus: WebsiteDomainVerificationStatus.FAILED,
      lastCheckedAt: new Date(),
      lastError: errorMessage.trim().slice(0, 1000),
    },
  });
}

/**
 * Persist SSL lifecycle state.
 *
 * Provider-specific certificate issuance remains outside this service.
 */
export async function updateWebsiteDomainSsl(
  websiteId: string,
  domainId: string,
  input: {
    status: WebsiteDomainSslStatus;
    issuedAt?: Date | null;
    expiresAt?: Date | null;
    error?: string | null;
  }
): Promise<WebsiteDomainSummary> {
  const website = await findWebsite(websiteId);

  if (!website) {
    throw new Error("Website not found.");
  }

  const existing = await findWebsiteDomain(website.id, domainId);

  if (!existing) {
    throw new Error("Domain not found.");
  }

  return prisma.websiteDomain.update({
    where: {
      id: domainId,
    },
    data: {
      sslStatus: input.status,
      sslIssuedAt: input.issuedAt ?? null,
      sslExpiresAt: input.expiresAt ?? null,
      lastCheckedAt: new Date(),
      lastError: input.error?.trim().slice(0, 1000) ?? null,
    },
  });
}

/**
 * Persist deployment lifecycle state.
 *
 * This does not deploy anything. A provider integration should perform
 * the deployment and then call this function with the resulting state.
 */
export async function updateWebsiteDomainDeployment(
  websiteId: string,
  domainId: string,
  input: {
    status: WebsiteDomainDeploymentStatus;
    error?: string | null;
    deployedAt?: Date | null;
  }
): Promise<WebsiteDomainSummary> {
  const website = await findWebsite(websiteId);

  if (!website) {
    throw new Error("Website not found.");
  }

  const existing = await findWebsiteDomain(website.id, domainId);

  if (!existing) {
    throw new Error("Domain not found.");
  }

  return prisma.websiteDomain.update({
    where: {
      id: domainId,
    },
    data: {
      deploymentStatus: input.status,
      lastDeploymentAt:
        input.deployedAt !== undefined ? input.deployedAt : existing.lastDeploymentAt,
      lastCheckedAt: new Date(),
      lastError: input.error?.trim().slice(0, 1000) ?? null,
    },
  });
}