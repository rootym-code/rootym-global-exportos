/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Orchestrates Website domain deployment readiness,
 *          lifecycle state, and verified-domain integration
 *          with the configured Vercel deployment provider.
 * ============================================================
 */

import {
  WebsiteDomainDeploymentStatus,
  WebsiteDomainSslStatus,
  WebsiteDomainVerificationStatus,
} from "@/lib/generated/prisma";

import { prisma } from "@/lib/prisma";

import {
  addVercelProjectDomain,
  type VercelProviderDomain,
} from "@/lib/services/deployment/vercel.provider";

import {
  getWebsiteDomain,
  updateWebsiteDomainDeployment,
  updateWebsiteDomainSsl,
  type WebsiteDomainSummary,
} from "@/lib/workspace/website/website-domain.service";

export type WebsiteDeploymentReadiness = {
  ready: boolean;
  websiteId: string;
  domainId: string;
  domain: string;
  verificationStatus: WebsiteDomainVerificationStatus;
  sslStatus: WebsiteDomainSslStatus;
  deploymentStatus: WebsiteDomainDeploymentStatus;
  blockers: string[];
};

export type WebsiteDeploymentSnapshot = {
  domain: WebsiteDomainSummary;
  readiness: WebsiteDeploymentReadiness;
};

async function requireWebsiteDomain(
  websiteId: string,
  domainId: string,
): Promise<WebsiteDomainSummary> {
  const domain = await getWebsiteDomain(websiteId, domainId);

  if (!domain) {
    throw new Error("Domain not found.");
  }

  return domain;
}

/**
 * Calculate whether a verified domain is ready for provider work.
 *
 * This function intentionally does not call a deployment provider.
 */
export function getWebsiteDeploymentReadiness(
  domain: WebsiteDomainSummary,
): WebsiteDeploymentReadiness {
  const blockers: string[] = [];

  if (
    domain.verificationStatus !==
    WebsiteDomainVerificationStatus.VERIFIED
  ) {
    blockers.push("Domain DNS verification is required.");
  }

  if (domain.sslStatus !== WebsiteDomainSslStatus.ACTIVE) {
    blockers.push("Active SSL is required before publishing.");
  }

  if (
    domain.deploymentStatus !==
      WebsiteDomainDeploymentStatus.READY &&
    domain.deploymentStatus !== WebsiteDomainDeploymentStatus.LIVE
  ) {
    blockers.push("The deployment is not ready for publishing.");
  }

  return {
    ready: blockers.length === 0,
    websiteId: domain.websiteId,
    domainId: domain.id,
    domain: domain.domain,
    verificationStatus: domain.verificationStatus,
    sslStatus: domain.sslStatus,
    deploymentStatus: domain.deploymentStatus,
    blockers,
  };
}

/**
 * Return the current deployment snapshot for one Website domain.
 */
export async function getWebsiteDeploymentSnapshot(
  websiteId: string,
  domainId: string,
): Promise<WebsiteDeploymentSnapshot> {
  const domain = await requireWebsiteDomain(websiteId, domainId);

  return {
    domain,
    readiness: getWebsiteDeploymentReadiness(domain),
  };
}

/**
 * Attach a verified ROOTYM Website domain to the configured
 * Vercel project.
 *
 * This performs the real provider operation but deliberately
 * does not claim that SSL or deployment is complete. Vercel
 * may still need to verify DNS and provision the certificate.
 */
export async function attachWebsiteDomainToVercel(
  websiteId: string,
  domainId: string,
): Promise<VercelProviderDomain> {
  const domain = await requireWebsiteDomain(websiteId, domainId);

  if (
    domain.verificationStatus !==
    WebsiteDomainVerificationStatus.VERIFIED
  ) {
    throw new Error(
      "Domain DNS verification is required before connecting the domain to Vercel.",
    );
  }

  return addVercelProjectDomain(domain.domain);
}

/**
 * Mark a verified domain as ready for deployment.
 *
 * This is a lifecycle transition only. It does not deploy the Website
 * or issue an SSL certificate.
 */
export async function markWebsiteDomainReadyForDeployment(
  websiteId: string,
  domainId: string,
): Promise<WebsiteDomainSummary> {
  const domain = await requireWebsiteDomain(websiteId, domainId);

  if (
    domain.verificationStatus !==
    WebsiteDomainVerificationStatus.VERIFIED
  ) {
    throw new Error(
      "Only a verified domain can be prepared for deployment.",
    );
  }

  return updateWebsiteDomainDeployment(websiteId, domainId, {
    status: WebsiteDomainDeploymentStatus.READY,
    error: null,
  });
}

/**
 * Start the SSL lifecycle after DNS verification.
 *
 * The actual certificate provider integration must call the persistence
 * helper with the resulting ACTIVE/FAILED state. This function only
 * transitions the domain into PENDING and never claims that SSL exists.
 */
export async function beginWebsiteDomainSslProvisioning(
  websiteId: string,
  domainId: string,
): Promise<WebsiteDomainSummary> {
  const domain = await requireWebsiteDomain(websiteId, domainId);

  if (
    domain.verificationStatus !==
    WebsiteDomainVerificationStatus.VERIFIED
  ) {
    throw new Error(
      "Domain DNS verification is required before SSL provisioning.",
    );
  }

  if (domain.sslStatus === WebsiteDomainSslStatus.ACTIVE) {
    return domain;
  }

  return updateWebsiteDomainSsl(websiteId, domainId, {
    status: WebsiteDomainSslStatus.PENDING,
    issuedAt: null,
    expiresAt: null,
    error: null,
  });
}

/**
 * Record successful SSL issuance from a real certificate provider.
 */
export async function markWebsiteDomainSslActive(
  websiteId: string,
  domainId: string,
  input?: {
    issuedAt?: Date | null;
    expiresAt?: Date | null;
  },
): Promise<WebsiteDomainSummary> {
  const domain = await requireWebsiteDomain(websiteId, domainId);

  if (
    domain.verificationStatus !==
    WebsiteDomainVerificationStatus.VERIFIED
  ) {
    throw new Error(
      "Domain DNS verification is required before SSL activation.",
    );
  }

  return updateWebsiteDomainSsl(websiteId, domainId, {
    status: WebsiteDomainSslStatus.ACTIVE,
    issuedAt: input?.issuedAt ?? new Date(),
    expiresAt: input?.expiresAt ?? null,
    error: null,
  });
}

/**
 * Record SSL provisioning failure from a real certificate provider.
 */
export async function markWebsiteDomainSslFailed(
  websiteId: string,
  domainId: string,
  errorMessage: string,
): Promise<WebsiteDomainSummary> {
  await requireWebsiteDomain(websiteId, domainId);

  return updateWebsiteDomainSsl(websiteId, domainId, {
    status: WebsiteDomainSslStatus.FAILED,
    error: errorMessage,
  });
}

/**
 * Begin an actual deployment lifecycle transition.
 *
 * Provider execution is intentionally not performed here. A provider
 * integration should call markWebsiteDomainDeployed/Failed after it
 * completes the external operation.
 */
export async function beginWebsiteDomainDeployment(
  websiteId: string,
  domainId: string,
): Promise<WebsiteDomainSummary> {
  const domain = await requireWebsiteDomain(websiteId, domainId);

  if (
    domain.verificationStatus !==
    WebsiteDomainVerificationStatus.VERIFIED
  ) {
    throw new Error(
      "Domain DNS verification is required before deployment.",
    );
  }

  if (domain.sslStatus !== WebsiteDomainSslStatus.ACTIVE) {
    throw new Error("Active SSL is required before deployment.");
  }

  return updateWebsiteDomainDeployment(websiteId, domainId, {
    status: WebsiteDomainDeploymentStatus.DEPLOYING,
    error: null,
  });
}

/**
 * Record successful deployment after a real provider confirms it.
 */
export async function markWebsiteDomainDeployed(
  websiteId: string,
  domainId: string,
): Promise<WebsiteDomainSummary> {
  const domain = await requireWebsiteDomain(websiteId, domainId);

  if (
    domain.verificationStatus !==
    WebsiteDomainVerificationStatus.VERIFIED
  ) {
    throw new Error("Domain DNS verification is required.");
  }

  if (domain.sslStatus !== WebsiteDomainSslStatus.ACTIVE) {
    throw new Error("Active SSL is required.");
  }

  return updateWebsiteDomainDeployment(websiteId, domainId, {
    status: WebsiteDomainDeploymentStatus.LIVE,
    deployedAt: new Date(),
    error: null,
  });
}

/**
 * Record deployment failure after a provider reports an error.
 */
export async function markWebsiteDomainDeploymentFailed(
  websiteId: string,
  domainId: string,
  errorMessage: string,
): Promise<WebsiteDomainSummary> {
  await requireWebsiteDomain(websiteId, domainId);

  return updateWebsiteDomainDeployment(websiteId, domainId, {
    status: WebsiteDomainDeploymentStatus.FAILED,
    error: errorMessage,
  });
}

/**
 * Return the Website's currently selected primary domain, if any.
 *
 * This is intentionally Website-scoped and does not select a domain
 * belonging to another tenant.
 */
export async function getPrimaryWebsiteDomain(
  websiteId: string,
): Promise<WebsiteDomainSummary | null> {
  return prisma.websiteDomain.findFirst({
    where: {
      websiteId,
      isPrimary: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}