/**
 * ============================================================
 * ROOTYM Deployment Provider
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides a server-side Vercel API adapter for
 *          custom-domain management without coupling provider
 *          operations to WebsiteDomain persistence.
 * ============================================================
 */

type VercelVerificationRecord = {
  type?: string;
  domain?: string;
  value?: string;
  reason?: string;
};

type VercelDomainResponse = {
  name: string;
  apexName?: string;
  projectId?: string;
  verified?: boolean;
  redirect?: string | null;
  redirectStatusCode?: number | null;
  gitBranch?: string | null;
  customEnvironmentId?: string | null;
  updatedAt?: number;
  createdAt?: number;
  verification?: VercelVerificationRecord[];
};

type VercelDnsRecommendation = {
  value?: string | string[] | null;
  rank?: number;
};

type VercelDomainConfigResponse = {
  domain?: string;
  configuredBy?: string | null;
  nameservers?: string[];
  serviceType?: string | null;
  misconfigured?: boolean;
  recommendedCNAME?: Array<VercelDnsRecommendation> | string | VercelDnsRecommendation | null;
  recommendedIPv4?: Array<
    | string
    | VercelDnsRecommendation
  >;
  recommendedIPv6?: Array<
    | string
    | VercelDnsRecommendation
  >;
  verification?: VercelVerificationRecord[];
};

type VercelCertificate = {
  id: string;
  createdAt: number;
  expiresAt: number;
  autoRenew: boolean;
  cns: string[];
};

type VercelCertificatesResponse = {
  certs?: VercelCertificate[];
  pagination?: {
    count?: number;
    next?: number | null;
    prev?: number | null;
  };
};

type VercelApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;
  };
};

export type VercelProviderDomain = {
  name: string;
  apexName: string | null;
  projectId: string | null;
  verified: boolean;
  redirect: string | null;
  redirectStatusCode: number | null;
  gitBranch: string | null;
  customEnvironmentId: string | null;
  verification: VercelVerificationRecord[];
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type VercelProviderDnsRecordType =
  | "A"
  | "CNAME";

export type VercelProviderDnsRecord = {
  type: VercelProviderDnsRecordType;
  name: string;
  value: string;
  purpose: "ROUTING";
};

export type VercelProviderDomainConfig = {
  domain: string;
  configuredBy: string | null;
  nameservers: string[];
  serviceType: string | null;
  misconfigured: boolean;
  recommendedCNAME: string | null;
  recommendedIPv4: string[];
  recommendedIPv6: string[];
  verification: VercelVerificationRecord[];
};

export type VercelProviderSslStatus =
  | "PENDING"
  | "ACTIVE"
  | "FAILED";

export type VercelProviderSslCheck = {
  domain: string;
  status: VercelProviderSslStatus;
  providerVerified: boolean;
  providerMisconfigured: boolean;
  tlsReachable: boolean;
  httpStatus: number | null;
  lastError: string | null;
};

export class VercelProviderError extends Error {
  readonly status: number;
  readonly code: string | null;

  constructor(
    message: string,
    status: number,
    code?: string | null,
  ) {
    super(message);
    this.name = "VercelProviderError";
    this.status = status;
    this.code = code ?? null;
  }
}

function getVercelToken(): string {
  const token = process.env.VERCEL_TOKEN?.trim();

  if (!token) {
    throw new VercelProviderError(
      "Vercel deployment provider is not configured.",
      500,
      "VERCEL_TOKEN_MISSING",
    );
  }

  return token;
}

function getVercelProjectId(): string {
  const projectId = process.env.VERCEL_PROJECT_ID?.trim();

  if (!projectId) {
    throw new VercelProviderError(
      "Vercel project is not configured.",
      500,
      "VERCEL_PROJECT_ID_MISSING",
    );
  }

  return projectId;
}

function getVercelTeamId(): string | null {
  return process.env.VERCEL_TEAM_ID?.trim() || null;
}

function buildApiUrl(path: string): string {
  const teamId = getVercelTeamId();
  const query = teamId
    ? `?teamId=${encodeURIComponent(teamId)}`
    : "";

  return `https://api.vercel.com${path}${query}`;
}

function normalizeDomain(domain: string): string {
  return domain.trim().toLowerCase().replace(/\.$/, "");
}

function encodeDomain(domain: string): string {
  return encodeURIComponent(normalizeDomain(domain));
}

function toProviderDomain(
  response: VercelDomainResponse,
): VercelProviderDomain {
  return {
    name: response.name,
    apexName: response.apexName ?? null,
    projectId: response.projectId ?? null,
    verified: response.verified === true,
    redirect: response.redirect ?? null,
    redirectStatusCode: response.redirectStatusCode ?? null,
    gitBranch: response.gitBranch ?? null,
    customEnvironmentId: response.customEnvironmentId ?? null,
    verification: response.verification ?? [],
    createdAt:
      typeof response.createdAt === "number"
        ? new Date(response.createdAt)
        : null,
    updatedAt:
      typeof response.updatedAt === "number"
        ? new Date(response.updatedAt)
        : null,
  };
}

function toDnsRecommendationValues(
  value: string | string[] | VercelDnsRecommendation | null | undefined,
): string[] {
  if (typeof value === "string") {
    const normalizedValue = value.trim();
    return normalizedValue ? [normalizedValue] : [];
  }

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (value && typeof value.value === "string") {
    const normalizedValue = value.value.trim();
    return normalizedValue ? [normalizedValue] : [];
  }

  if (value && Array.isArray(value.value)) {
    return value.value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function toDnsRecommendationEntries(
  value:
    | string
    | VercelDnsRecommendation
    | Array<VercelDnsRecommendation>
    | null
    | undefined,
): VercelDnsRecommendation[] {
  if (typeof value === "string") {
    const normalizedValue = value.trim();
    return normalizedValue ? [{ value: normalizedValue, rank: 1 }] : [];
  }

  if (Array.isArray(value)) {
    return value.filter(
      (item): item is VercelDnsRecommendation =>
        typeof item === "object" && item !== null,
    );
  }

  return value ? [value] : [];
}

function toProviderDomainConfig(
  response: VercelDomainConfigResponse,
  domain: string,
): VercelProviderDomainConfig {
  return {
    domain: response.domain ?? domain,
    configuredBy: response.configuredBy ?? null,
    nameservers: response.nameservers ?? [],
    serviceType: response.serviceType ?? null,
    misconfigured: response.misconfigured === true,
    recommendedCNAME:
      toDnsRecommendationEntries(response.recommendedCNAME)
        .sort((left, right) => (left.rank ?? 999) - (right.rank ?? 999))
        .map((entry) => toDnsRecommendationValues(entry.value))
        .flat()[0] ?? null,
    recommendedIPv4: (response.recommendedIPv4 ?? [])
      .flatMap((value) => toDnsRecommendationValues(value))
      .filter(Boolean),
    recommendedIPv6: (response.recommendedIPv6 ?? [])
      .flatMap((value) => toDnsRecommendationValues(value))
      .filter(Boolean),
    verification: response.verification ?? [],
  };
}

async function parseResponseBody(
  response: Response,
): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
}

async function requestVercel<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getVercelToken();

  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  });

  const body = await parseResponseBody(response);

  if (!response.ok) {
    const errorBody =
      typeof body === "object" && body !== null
        ? (body as VercelApiErrorResponse)
        : null;

    const message =
      errorBody?.error?.message ||
      `Vercel API request failed with status ${response.status}.`;

    throw new VercelProviderError(
      message,
      response.status,
      errorBody?.error?.code ?? null,
    );
  }

  return body as T;
}

/**
 * Add a custom domain to the configured ROOTYM Vercel project.
 *
 * This operation only communicates with Vercel. It does not change
 * ROOTYM WebsiteDomain persistence.
 */
export async function addVercelProjectDomain(
  domain: string,
): Promise<VercelProviderDomain> {
  const projectId = getVercelProjectId();
  const normalizedDomain = normalizeDomain(domain);

  if (!normalizedDomain) {
    throw new VercelProviderError(
      "A domain is required.",
      400,
      "DOMAIN_REQUIRED",
    );
  }

  /*
   * The domain may already be attached to the configured ROOTYM
   * Vercel project. Treat that state as idempotently prepared rather
   * than attempting a second POST that Vercel will reject with 409.
   */
  try {
    const existingDomain = await getVercelProjectDomain(
      normalizedDomain,
    );

    if (
      existingDomain.projectId === null ||
      existingDomain.projectId === projectId
    ) {
      return existingDomain;
    }
  } catch (error) {
    if (
      !(error instanceof VercelProviderError) ||
      error.status !== 404
    ) {
      throw error;
    }
  }

  const response = await requestVercel<VercelDomainResponse>(
    `/v10/projects/${encodeURIComponent(projectId)}/domains`,
    {
      method: "POST",
      body: JSON.stringify({
        name: normalizedDomain,
      }),
    },
  );

  return toProviderDomain(response);
}

/**
 * Retrieve a custom domain attached to the configured
 * ROOTYM Vercel project.
 */
export async function getVercelProjectDomain(
  domain: string,
): Promise<VercelProviderDomain> {
  const projectId = getVercelProjectId();
  const normalizedDomain = normalizeDomain(domain);

  if (!normalizedDomain) {
    throw new VercelProviderError(
      "A domain is required.",
      400,
      "DOMAIN_REQUIRED",
    );
  }

  const response = await requestVercel<VercelDomainResponse>(
    `/v9/projects/${encodeURIComponent(projectId)}/domains/${encodeDomain(
      normalizedDomain,
    )}`,
    {
      method: "GET",
    },
  );

  return toProviderDomain(response);
}

/**
 * Ask Vercel to verify a project domain after its DNS
 * configuration has been completed.
 */
export async function verifyVercelProjectDomain(
  domain: string,
): Promise<VercelProviderDomain> {
  const projectId = getVercelProjectId();
  const normalizedDomain = normalizeDomain(domain);

  if (!normalizedDomain) {
    throw new VercelProviderError(
      "A domain is required.",
      400,
      "DOMAIN_REQUIRED",
    );
  }

  const response = await requestVercel<VercelDomainResponse>(
    `/v9/projects/${encodeURIComponent(
      projectId,
    )}/domains/${encodeDomain(normalizedDomain)}/verify`,
    {
      method: "POST",
    },
  );

  return toProviderDomain(response);
}

/**
 * Retrieve Vercel's current DNS/domain configuration for a
 * custom domain.
 *
 * This is separate from project-domain verification because a
 * domain can be registered with the project while its DNS
 * configuration is still incomplete.
 */
export async function getVercelDomainConfig(
  domain: string,
): Promise<VercelProviderDomainConfig> {
  const normalizedDomain = normalizeDomain(domain);

  if (!normalizedDomain) {
    throw new VercelProviderError(
      "A domain is required.",
      400,
      "DOMAIN_REQUIRED",
    );
  }

  const response = await requestVercel<VercelDomainConfigResponse>(
    `/v6/domains/${encodeDomain(normalizedDomain)}/config`,
    {
      method: "GET",
    },
  );

  return toProviderDomainConfig(response, normalizedDomain);
}

/**
 * Build customer-facing DNS routing records from Vercel's current
 * domain configuration. The record values come from Vercel; ROOTYM
 * does not hard-code provider routing values here.
 *
 * This operation only reads provider state. It does not change
 * ROOTYM WebsiteDomain persistence or Vercel DNS records.
 */
export async function getVercelDomainDnsRecords(
  domain: string,
): Promise<VercelProviderDnsRecord[]> {
  const normalizedDomain = normalizeDomain(domain);

  if (!normalizedDomain) {
    throw new VercelProviderError(
      "A domain is required.",
      400,
      "DOMAIN_REQUIRED",
    );
  }

  const [providerDomain, providerConfig] = await Promise.all([
    getVercelProjectDomain(normalizedDomain),
    getVercelDomainConfig(normalizedDomain),
  ]);

  const records: VercelProviderDnsRecord[] = [];
  const apexName = providerDomain.apexName
    ? normalizeDomain(providerDomain.apexName)
    : null;
  const isApexDomain = apexName === normalizedDomain;

  if (isApexDomain) {
    for (const value of providerConfig.recommendedIPv4) {
      records.push({
        type: "A",
        name: "@",
        value,
        purpose: "ROUTING",
      });
    }
  } else if (providerConfig.recommendedCNAME) {
    const cnameTarget = providerConfig.recommendedCNAME;

    if (cnameTarget) {
      const recordName =
        apexName && normalizedDomain.endsWith(`.${apexName}`)
          ? normalizedDomain.slice(0, -(apexName.length + 1))
          : normalizedDomain;

      records.push({
        type: "CNAME",
        name: recordName || "@",
        value: cnameTarget,
        purpose: "ROUTING",
      });
    }
  }

  return records;
}

async function getVercelCertificates(): Promise<VercelCertificate[]> {
  const response = await requestVercel<VercelCertificatesResponse>(
    "/v8/certs",
    {
      method: "GET",
    },
  );

  return response.certs ?? [];
}

function certificateCoversDomain(
  certificate: VercelCertificate,
  domain: string,
): boolean {
  const normalizedDomain = normalizeDomain(domain);

  return certificate.cns.some((commonName) => {
    const normalizedCommonName = normalizeDomain(commonName);

    if (normalizedCommonName === normalizedDomain) {
      return true;
    }

    if (normalizedCommonName.startsWith("*.")) {
      const suffix = normalizedCommonName.slice(1);
      return normalizedDomain.endsWith(suffix);
    }

    return false;
  });
}

/**
 * Check whether a Vercel-connected custom domain has an active certificate.
 *
 * Vercel automatically manages SSL certificates for project domains. The
 * project-domain API does not expose certificate state directly, so this
 * check combines Vercel's authoritative project-domain/config state with
 * Vercel's certificate API.
 *
 * A matching, non-expired certificate is treated as the provider-authoritative
 * SSL state. We intentionally do not make an additional public HTTPS request
 * here because the ROOTYM application server's outbound network path can
 * time out even when the public domain is serving correctly in a browser.
 *
 * This operation only reads provider state. It does not change
 * ROOTYM WebsiteDomain persistence.
 */
export async function checkVercelDomainSsl(
  domain: string,
): Promise<VercelProviderSslCheck> {
  const normalizedDomain = normalizeDomain(domain);

  if (!normalizedDomain) {
    throw new VercelProviderError(
      "A domain is required.",
      400,
      "DOMAIN_REQUIRED",
    );
  }

  const [providerDomain, providerConfig] = await Promise.all([
    getVercelProjectDomain(normalizedDomain),
    getVercelDomainConfig(normalizedDomain),
  ]);

  if (!providerDomain.verified || providerConfig.misconfigured) {
    return {
      domain: normalizedDomain,
      status: "PENDING",
      providerVerified: providerDomain.verified,
      providerMisconfigured: providerConfig.misconfigured,
      tlsReachable: false,
      httpStatus: null,
      lastError: providerDomain.verified
        ? "Vercel reports that the domain configuration is incomplete."
        : "Vercel has not verified the project domain yet.",
    };
  }

  try {
    const certificates = await getVercelCertificates();
    const matchingCertificate = certificates
      .filter((certificate) => certificateCoversDomain(certificate, normalizedDomain))
      .filter((certificate) => certificate.expiresAt > Date.now())
      .sort((left, right) => right.expiresAt - left.expiresAt)[0];

    if (!matchingCertificate) {
      return {
        domain: normalizedDomain,
        status: "PENDING",
        providerVerified: providerDomain.verified,
        providerMisconfigured: providerConfig.misconfigured,
        tlsReachable: false,
        httpStatus: null,
        lastError:
          "Vercel has verified the domain, but no active SSL certificate covering this domain was found yet.",
      };
    }

    return {
      domain: normalizedDomain,
      status: "ACTIVE",
      providerVerified: providerDomain.verified,
      providerMisconfigured: providerConfig.misconfigured,
      tlsReachable: true,
      httpStatus: null,
      lastError: null,
    };
  } catch (error) {
    return {
      domain: normalizedDomain,
      status: "FAILED",
      providerVerified: providerDomain.verified,
      providerMisconfigured: providerConfig.misconfigured,
      tlsReachable: false,
      httpStatus: null,
      lastError:
        error instanceof Error
          ? error.message
          : "Vercel certificate status check failed.",
    };
  }
}

/**
 * Remove a custom domain from the configured ROOTYM Vercel project.
 *
 * This operation only changes Vercel. ROOTYM WebsiteDomain
 * persistence remains the responsibility of the domain service.
 */
export async function removeVercelProjectDomain(
  domain: string,
): Promise<void> {
  const projectId = getVercelProjectId();
  const normalizedDomain = normalizeDomain(domain);

  if (!normalizedDomain) {
    throw new VercelProviderError(
      "A domain is required.",
      400,
      "DOMAIN_REQUIRED",
    );
  }

  await requestVercel<unknown>(
    `/v9/projects/${encodeURIComponent(projectId)}/domains/${encodeDomain(
      normalizedDomain,
    )}`,
    {
      method: "DELETE",
    },
  );
}