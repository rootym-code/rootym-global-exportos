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

  type VercelDomainConfigResponse = {
    domain?: string;
    configuredBy?: string | null;
    nameservers?: string[];
    serviceType?: string | null;
    misconfigured?: boolean;
    recommendedCNAME?: string | null;
    recommendedIPv4?: string[];
    recommendedIPv6?: string[];
    verification?: VercelVerificationRecord[];
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
      recommendedCNAME: response.recommendedCNAME ?? null,
      recommendedIPv4: response.recommendedIPv4 ?? [],
      recommendedIPv6: response.recommendedIPv6 ?? [],
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
