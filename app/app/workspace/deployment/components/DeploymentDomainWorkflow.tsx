/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the interactive custom-domain workflow for
 *          domain verification, website connection, routing DNS,
 *          SSL confirmation, and website publishing.
 * ============================================================
 */

"use client";

import {
  CheckCircle2,
  Clipboard,
  Globe2,
  Loader2,
  ServerCog,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

type WebsiteDomain = {
  id: string;
  websiteId: string;
  domain: string;
  label: string | null;
  isPrimary: boolean;
  verificationStatus: string;
  verificationMethod: string;
  verificationRecordType: string | null;
  verificationRecordName: string | null;
  verificationRecordValue: string | null;
  verifiedAt: string | null;
  sslStatus: string;
  sslIssuedAt: string | null;
  sslExpiresAt: string | null;
  deploymentStatus: string;
  lastDeploymentAt: string | null;
  lastCheckedAt: string | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  ok?: boolean;
  domains?: WebsiteDomain[];
  domain?: WebsiteDomain;
  error?: string;
  message?: string;
  code?: string;
  success?: boolean;
  verified?: boolean;
  websiteDomain?: WebsiteDomain;
  ssl?: {
    status: "PENDING" | "ACTIVE" | "FAILED";
    providerVerified: boolean;
    providerMisconfigured: boolean;
    tlsReachable: boolean;
    httpStatus: number | null;
    lastError: string | null;
  };
  dnsConfiguration?: {
    domain: string;
    records: {
      type: "A" | "CNAME";
      name: string;
      value: string;
      purpose: "ROUTING";
    }[];
  };
};

type DeploymentDomainWorkflowProps = {
  enabled: boolean;
};

function getErrorMessage(data: ApiResponse, fallback: string) {
  return (
    data.error ||
    data.message ||
    fallback
  );
}

function verificationLabel(status: string) {
  switch (status) {
    case "VERIFIED":
      return "DNS Verified";

    case "VERIFYING":
      return "Verifying DNS";

    case "FAILED":
      return "Verification Failed";

    case "PENDING":
    default:
      return "DNS Verification Required";
  }
}

function verificationClasses(status: string) {
  switch (status) {
    case "VERIFIED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";

    case "FAILED":
      return "bg-red-50 text-red-700 ring-red-100";

    case "VERIFYING":
      return "bg-amber-50 text-amber-700 ring-amber-100";

    case "PENDING":
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}

export default function DeploymentDomainWorkflow({
  enabled,
}: DeploymentDomainWorkflowProps) {
  const [domains, setDomains] = useState<WebsiteDomain[]>([]);
  const [domainInput, setDomainInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDomains, setLoadingDomains] = useState(false);
  const [verifyingDomainId, setVerifyingDomainId] = useState<string | null>(
    null,
  );
  const [preparingDomainId, setPreparingDomainId] = useState<string | null>(
    null,
  );
  const [checkingSslDomainId, setCheckingSslDomainId] = useState<string | null>(
    null,
  );
  const [publishingDomainId, setPublishingDomainId] = useState<string | null>(
    null,
  );
  const [settingPrimaryDomainId, setSettingPrimaryDomainId] = useState<string | null>(
    null,
  );
  const [preparedDomainIds, setPreparedDomainIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [dnsConfigurations, setDnsConfigurations] = useState<
    Record<
      string,
      {
        domain: string;
        records: {
          type: "A" | "CNAME";
          name: string;
          value: string;
          purpose: "ROUTING";
        }[];
      }
    >
  >({});
  const [loadingDnsDomainId, setLoadingDnsDomainId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [focusedDomainId, setFocusedDomainId] = useState<string | null>(null);
  const focusedDomainRef = useRef<HTMLDivElement | null>(null);

  const loadDomains = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setLoadingDomains(true);
    setError(null);

    try {
      const response = await fetch(
        "/app/api/workspace/website/domains",
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        },
      );

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Unable to load custom domains.",
          ),
        );
      }

      const loadedDomains = data.domains ?? [];

      setDomains(loadedDomains);

      const preparedDomains = loadedDomains.filter(
        (domain) =>
          domain.deploymentStatus === "READY" ||
          domain.deploymentStatus === "LIVE",
      );

      for (const preparedDomain of preparedDomains) {
        void loadDnsConfiguration(preparedDomain.id);
      }

      setPreparedDomainIds(
        new Set(
          loadedDomains
            .filter(
              (domain) =>
                domain.deploymentStatus === "READY" ||
                domain.deploymentStatus === "LIVE",
            )
            .map((domain) => domain.id),
        ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load custom domains.",
      );
    } finally {
      setLoadingDomains(false);
    }
  }, [enabled]);

  useEffect(() => {
    void loadDomains();
  }, [loadDomains]);

  useEffect(() => {
    if (!focusedDomainId || loadingDomains) {
      return;
    }

    const element = focusedDomainRef.current;

    if (!element) {
      return;
    }

    window.requestAnimationFrame(() => {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    setFocusedDomainId(null);
  }, [focusedDomainId, loadingDomains]);

  async function connectDomain() {
    const domain = domainInput.trim();

    if (!domain) {
      setError("Enter a custom domain first.");
      setSuccess(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        "/app/api/workspace/website/domains",
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            domain,
            label: labelInput.trim() || null,
          }),
        },
      );

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.ok || !data.domain) {
        throw new Error(
          getErrorMessage(
            data,
            "Unable to connect the custom domain.",
          ),
        );
      }

      setDomainInput("");
      setLabelInput("");
      setFocusedDomainId(data.domain.id);

      await loadDomains();
      setSuccess(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to connect the custom domain.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyDomain(domainId: string) {
    setVerifyingDomainId(domainId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/app/api/workspace/website/domains/${encodeURIComponent(domainId)}/verify`,
        {
          method: "POST",
          credentials: "same-origin",
        },
      );

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.verified) {
        throw new Error(
          getErrorMessage(
            data,
            "The DNS record could not be verified yet.",
          ),
        );
      }

      setSuccess(
        "DNS verification successful. Your domain is now verified.",
      );

      await loadDomains();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The DNS record could not be verified yet.",
      );

      await loadDomains();
    } finally {
      setVerifyingDomainId(null);
    }
  }

  async function loadDnsConfiguration(domainId: string) {
    setLoadingDnsDomainId(domainId);
    setError(null);

    try {
      const response = await fetch(
        `/app/api/workspace/website/domains/${encodeURIComponent(
          domainId,
        )}?provider=vercel`,
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        },
      );

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.dnsConfiguration) {
        throw new Error(
          getErrorMessage(
            data,
            "Unable to retrieve the DNS records required for this domain.",
          ),
        );
      }

      setDnsConfigurations((current) => ({
        ...current,
        [domainId]: data.dnsConfiguration!,
      }));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to retrieve the DNS records required for this domain.",
      );
    } finally {
      setLoadingDnsDomainId(null);
    }
  }

  async function prepareProduction(domainId: string) {
    setPreparingDomainId(domainId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/app/api/workspace/website/domains/${encodeURIComponent(domainId)}`,
        {
          method: "POST",
          credentials: "same-origin",
        },
      );

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          getErrorMessage(
            data,
            "Unable to connect the verified domain to the production provider.",
          ),
        );
      }

      setPreparedDomainIds((current) => {
        const next = new Set(current);
        next.add(domainId);
        return next;
      });

      setSuccess(
        "Website connection completed. Add the routing DNS records shown in Step 03. SSL and publishing remain pending until those states are confirmed.",
      );

      await loadDomains();
      await loadDnsConfiguration(domainId);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to prepare production for this domain.",
      );
    } finally {
      setPreparingDomainId(null);
    }
  }

  async function checkSsl(domainId: string) {
    setCheckingSslDomainId(domainId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/app/api/workspace/website/domains/${encodeURIComponent(
          domainId,
        )}?action=ssl`,
        {
          method: "POST",
          credentials: "same-origin",
        },
      );

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          getErrorMessage(
            data,
            "Unable to check SSL status for this domain.",
          ),
        );
      }

      await loadDomains();

      if (data.websiteDomain?.sslStatus === "ACTIVE") {
        setSuccess(
          "SSL is active. Your custom domain is securely connected.",
        );
      } else if (data.websiteDomain?.sslStatus === "PENDING") {
        setSuccess(
          "SSL is still being provisioned. Check again shortly.",
        );
      } else {
        setError(
          data.websiteDomain?.lastError ||
            "SSL could not be confirmed yet.",
        );
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to check SSL status for this domain.",
      );
      await loadDomains();
    } finally {
      setCheckingSslDomainId(null);
    }
  }

  async function publishWebsite(domainId: string) {
    setPublishingDomainId(domainId);
    setError(null);
    setSuccess(null);

    const domain = domains.find((item) => item.id === domainId);

    if (!domain || domain.sslStatus !== "ACTIVE") {
      setError(
        "SSL must be active before the website can be published.",
      );
      setPublishingDomainId(null);
      return;
    }

    try {
      const response = await fetch(
        `/app/api/workspace/website/domains/${encodeURIComponent(
          domainId,
        )}?action=publish`,
        {
          method: "POST",
          credentials: "same-origin",
        },
      );

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          getErrorMessage(
            data,
            "Unable to publish the website.",
          ),
        );
      }

      await loadDomains();

      if (data.websiteDomain?.deploymentStatus === "LIVE") {
        setSuccess(
          `Website published successfully at https://${domain.domain}/`,
        );
      } else {
        setError(
          data.websiteDomain?.lastError ||
            "The website could not be confirmed as live.",
        );
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to publish the website.",
      );
      await loadDomains();
    } finally {
      setPublishingDomainId(null);
    }
  }

  async function setPrimaryDomain(domainId: string) {
    setSettingPrimaryDomainId(domainId);
    setError(null);
    setSuccess(null);

    const domain = domains.find((item) => item.id === domainId);

    if (!domain || domain.verificationStatus !== "VERIFIED") {
      setError("Only a verified domain can be made primary.");
      setSettingPrimaryDomainId(null);
      return;
    }

    try {
      const response = await fetch(
        `/app/api/workspace/website/domains/${encodeURIComponent(
          domainId,
        )}?action=primary`,
        {
          method: "POST",
          credentials: "same-origin",
        },
      );

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.success || !data.websiteDomain) {
        throw new Error(
          getErrorMessage(data, "Unable to make this domain primary."),
        );
      }

      await loadDomains();
      setSuccess(`${domain.domain} is now the primary domain.`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to make this domain primary.",
      );
      await loadDomains();
    } finally {
      setSettingPrimaryDomainId(null);
    }
  }

  async function copyValue(
    value: string,
    field: string,
  ) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);

      window.setTimeout(() => {
        setCopiedField((current) =>
          current === field ? null : current,
        );
      }, 1800);
    } catch {
      setError(
        "Unable to copy automatically. Please copy the value manually.",
      );
    }
  }

  if (!enabled) {
    return null;
  }

  return (
    <section className="mt-7 rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
              <Globe2 className="h-4 w-4" />
              Step 01 · Connect Domain
            </div>

            <h4 className="mt-2 text-xl font-bold text-slate-900">
              Connect your custom domain
            </h4>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Connect the domain you want to use for this ROOTYM
              website. ROOTYM will generate a unique DNS record
              to verify domain ownership.
            </p>
          </div>

          <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Deployment Enabled
          </div>
        </div>
      </div>

      <div className="space-y-6 px-5 py-6 sm:px-6">
        {error ? (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        {success ? (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{success}</p>
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4">
            <h5 className="text-base font-bold text-slate-900">
              Connect a New Domain
            </h5>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              Add another domain for this website. Existing connected domains
              remain unchanged.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_220px_auto] lg:items-end">
            <div>
              <label
                htmlFor="custom-domain"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Custom domain
              </label>

              <input
                id="custom-domain"
                type="text"
                value={domainInput}
                onChange={(event) =>
                  setDomainInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !loading
                  ) {
                    void connectDomain();
                  }
                }}
                placeholder="www.example.com"
                autoComplete="url"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                Enter only the domain name. https:// is optional.
              </p>
            </div>

            <div>
              <label
                htmlFor="domain-label"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Label <span className="font-normal text-slate-400">(optional)</span>
              </label>

              <input
                id="domain-label"
                type="text"
                value={labelInput}
                onChange={(event) =>
                  setLabelInput(event.target.value)
                }
                placeholder="e.g. Main Website"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                Use a name to help identify this domain.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void connectDomain()}
              disabled={loading || !domainInput.trim()}
              className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Globe2 className="h-4 w-4" />
              )}

              {loading
                ? "Connecting..."
                : "Connect Domain"}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {loadingDomains ? (
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading domains...
            </div>
          ) : null}

          {domains.length === 0 && !loadingDomains ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                <Globe2 className="mx-auto h-7 w-7 text-slate-400" />

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No custom domain connected yet
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Connect your domain above to begin deployment.
                </p>
              </div>
            </div>
          ) : null}

          {domains.length > 0
            ? [...domains]
                .sort((a, b) => {
                  const aVerified = a.verificationStatus === "VERIFIED";
                  const bVerified = b.verificationStatus === "VERIFIED";
                  return Number(aVerified) - Number(bVerified);
                })
                .map((domain, index, orderedDomains) => {
              const isVerified =
                domain.verificationStatus ===
                "VERIFIED";

              const isVerifying =
                verifyingDomainId === domain.id;

                  const showVerificationHeading =
                    index === 0 &&
                    domain.verificationStatus !== "VERIFIED";

                  const showConnectedHeading =
                    domain.verificationStatus === "VERIFIED" &&
                    (index === 0 ||
                      orderedDomains[index - 1].verificationStatus !==
                        "VERIFIED");

                  return (
                    <Fragment key={domain.id}>
                      {showVerificationHeading ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 px-5 py-4">
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
                            Step 02 · Verify Domain Ownership
                          </p>
                          <h5 className="mt-1 text-lg font-bold text-slate-900">
                            Verify your new domain
                          </h5>
                          <p className="mt-1 text-sm leading-5 text-slate-600">
                            Add the DNS TXT record shown below and verify domain
                            ownership before production setup can continue.
                          </p>
                        </div>
                      ) : null}

                      {showConnectedHeading ? (
                        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                          <h5 className="text-lg font-bold text-slate-900">
                            Connected Domains
                          </h5>
                          <p className="mt-1 text-sm leading-5 text-slate-500">
                            Manage domain verification, website connection,
                            SSL, and publishing for each domain independently.
                          </p>
                        </div>
                      ) : null}

                      <div
                  ref={
                    focusedDomainId === domain.id
                      ? focusedDomainRef
                      : undefined
                  }
                  className={`rounded-2xl border bg-white p-5 transition ${
                    focusedDomainId === domain.id
                      ? "border-emerald-300 ring-2 ring-emerald-100"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h6 className="break-all text-xl font-bold text-slate-900 sm:text-2xl">
                          {domain.domain}
                        </h6>

                        {domain.isPrimary ? (
                          <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white">
                            Primary
                          </span>
                        ) : null}

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${verificationClasses(
                            domain.verificationStatus,
                          )}`}
                        >
                          {verificationLabel(
                            domain.verificationStatus,
                          )}
                        </span>
                      </div>

                      {domain.label ? (
                        <p className="mt-1 text-xs text-slate-500">
                          {domain.label}
                        </p>
                      ) : null}
                    </div>

                    {!isVerified ? (
                      <button
                        type="button"
                        onClick={() =>
                          void verifyDomain(
                            domain.id,
                          )
                        }
                        disabled={isVerifying}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isVerifying ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ShieldCheck className="h-4 w-4" />
                        )}

                        {isVerifying
                          ? "Checking DNS..."
                          : "Verify DNS"}
                      </button>
                    ) : !domain.isPrimary ? (
                      <button
                        type="button"
                        onClick={() => void setPrimaryDomain(domain.id)}
                        disabled={settingPrimaryDomainId === domain.id}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {settingPrimaryDomainId === domain.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Globe2 className="h-4 w-4" />
                        )}
                        {settingPrimaryDomainId === domain.id
                          ? "Setting Primary..."
                          : "Set as Primary"}
                      </button>
                    ) : (
                      <div className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        <CheckCircle2 className="h-4 w-4" />
                        Primary Domain
                      </div>
                    )}
                  </div>

                  {!isVerified &&
                  domain.verificationRecordName &&
                  domain.verificationRecordValue ? (
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-amber-900">
                            Add this DNS TXT record
                          </p>

                          <p className="mt-1 text-xs leading-5 text-amber-800">
                            Add the following record at your DNS
                            provider. DNS propagation can take
                            some time.
                          </p>

                          <div className="mt-4 grid gap-3">
                            <div>
                              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700">
                                Record Type
                              </p>

                              <div className="rounded-lg border border-amber-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800">
                                {domain.verificationRecordType ||
                                  "TXT"}
                              </div>
                            </div>

                            <div>
                              <div className="mb-1 flex items-center justify-between gap-3">
                                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700">
                                  Name
                                </p>

                                <button
                                  type="button"
                                  onClick={() =>
                                    void copyValue(
                                      domain.verificationRecordName!,
                                      `${domain.id}-name`,
                                    )
                                  }
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950"
                                >
                                  <Clipboard className="h-3.5 w-3.5" />

                                  {copiedField ===
                                  `${domain.id}-name`
                                    ? "Copied"
                                    : "Copy"}
                                </button>
                              </div>

                              <div className="break-all rounded-lg border border-amber-200 bg-white px-3 py-2.5 font-mono text-xs text-slate-800">
                                {domain.verificationRecordName}
                              </div>
                            </div>

                            <div>
                              <div className="mb-1 flex items-center justify-between gap-3">
                                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700">
                                  Value
                                </p>

                                <button
                                  type="button"
                                  onClick={() =>
                                    void copyValue(
                                      domain.verificationRecordValue!,
                                      `${domain.id}-value`,
                                    )
                                  }
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950"
                                >
                                  <Clipboard className="h-3.5 w-3.5" />

                                  {copiedField ===
                                  `${domain.id}-value`
                                    ? "Copied"
                                    : "Copy"}
                                </button>
                              </div>

                              <div className="break-all rounded-lg border border-amber-200 bg-white px-3 py-2.5 font-mono text-xs text-slate-800">
                                {domain.verificationRecordValue}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {isVerified ? (
                    <>
                      <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
                              <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-bold text-slate-900">
                                  Step 02 · Verify Domain Ownership
                                </p>
                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                  DNS Verified
                                </span>
                              </div>
                              <p className="mt-1 text-xs leading-5 text-slate-600">
                                ROOTYM has verified that you control this domain.
                              </p>
                            </div>
                          </div>

                          <div className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
                            <CheckCircle2 className="h-4 w-4" />
                            Verified
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${
                              preparedDomainIds.has(domain.id)
                                ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                                : "bg-white text-slate-500 ring-slate-200"
                            }`}
                          >
                            {preparedDomainIds.has(domain.id) ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <ServerCog className="h-5 w-5" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-bold text-slate-900">
                                Step 03 · Connect Website
                              </p>

                              {preparedDomainIds.has(domain.id) ? (
                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                                  Website Connected
                                </span>
                              ) : (
                                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-100">
                                  Ready to connect
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              Connect this verified domain to the configured ROOTYM
                              production provider. After connection, add the routing
                              DNS records shown below. SSL and publishing remain
                              separate steps.
                            </p>
                          </div>
                        </div>

                        {preparedDomainIds.has(domain.id) ? (
                          <div className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
                            <CheckCircle2 className="h-4 w-4" />
                            Website Connected
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void prepareProduction(domain.id)}
                            disabled={preparingDomainId === domain.id}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {preparingDomainId === domain.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ServerCog className="h-4 w-4" />
                            )}

                            {preparingDomainId === domain.id
                              ? "Connecting..."
                              : "Connect Website"}
                          </button>
                        )}
                      </div>

                      {preparedDomainIds.has(domain.id) ? (
                        <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/70 p-4">
                          <div className="flex items-start gap-3">
                            <ServerCog className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-blue-900">
                                DNS records required to connect your website
                              </p>
                              <p className="mt-1 text-xs leading-5 text-blue-800">
                                Add these routing records at the DNS provider that
                                manages your domain. These records are supplied by
                                the production provider for this domain.
                              </p>

                              <div className="mt-4 space-y-3">
                                {dnsConfigurations[domain.id]?.records?.length ? (
                                  dnsConfigurations[domain.id].records.map(
                                    (record, recordIndex) => {
                                      const recordKey = `${domain.id}-dns-${recordIndex}`;

                                      return (
                                        <div
                                          key={recordKey}
                                          className="rounded-xl border border-blue-200 bg-white p-3"
                                        >
                                          <div className="grid gap-3 sm:grid-cols-[90px_1fr]">
                                            <div>
                                              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                                                Type
                                              </p>
                                              <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs font-semibold text-slate-800">
                                                {record.type}
                                              </div>
                                            </div>

                                            <div>
                                              <div className="flex items-center justify-between gap-3">
                                                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                                                  Name
                                                </p>
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    void copyValue(
                                                      record.name,
                                                      `${recordKey}-name`,
                                                    )
                                                  }
                                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900"
                                                >
                                                  <Clipboard className="h-3.5 w-3.5" />
                                                  {copiedField ===
                                                  `${recordKey}-name`
                                                    ? "Copied"
                                                    : "Copy"}
                                                </button>
                                              </div>
                                              <div className="mt-1 break-all rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-800">
                                                {record.name}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="mt-3">
                                            <div className="flex items-center justify-between gap-3">
                                              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                                                Value
                                              </p>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  void copyValue(
                                                    record.value,
                                                    `${recordKey}-value`,
                                                  )
                                                }
                                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900"
                                              >
                                                <Clipboard className="h-3.5 w-3.5" />
                                                {copiedField ===
                                                `${recordKey}-value`
                                                  ? "Copied"
                                                  : "Copy"}
                                              </button>
                                            </div>
                                            <div className="mt-1 break-all rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-800">
                                              {record.value}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    },
                                  )
                                ) : loadingDnsDomainId === domain.id ? (
                                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Loading DNS records...
                                  </div>
                                ) : (
                                  <p className="text-xs text-blue-800">
                                    DNS routing records have not been loaded yet.
                                  </p>
                                )}
                              </div>

                              <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    void loadDnsConfiguration(domain.id)
                                  }
                                  disabled={loadingDnsDomainId === domain.id}
                                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {loadingDnsDomainId === domain.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <ServerCog className="h-4 w-4" />
                                  )}
                                  {loadingDnsDomainId === domain.id
                                    ? "Loading..."
                                    : dnsConfigurations[domain.id]
                                      ? "Refresh DNS Records"
                                      : "Show DNS Records"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    </>
                  ) : null}

                  {preparedDomainIds.has(domain.id) ? (
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${
                              domain.sslStatus === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                                : domain.sslStatus === "FAILED"
                                  ? "bg-red-50 text-red-600 ring-red-100"
                                  : "bg-amber-50 text-amber-600 ring-amber-100"
                            }`}
                          >
                            {domain.sslStatus === "ACTIVE" ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : domain.sslStatus === "FAILED" ? (
                              <TriangleAlert className="h-5 w-5" />
                            ) : (
                              <ShieldCheck className="h-5 w-5" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-bold text-slate-900">
                                Step 04 · Secure Domain
                              </p>

                              {domain.sslStatus === "ACTIVE" ? (
                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                                  SSL Active
                                </span>
                              ) : domain.sslStatus === "FAILED" ? (
                                <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 ring-1 ring-red-100">
                                  SSL Check Failed
                                </span>
                              ) : (
                                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-100">
                                  SSL Pending
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              ROOTYM confirms the Vercel domain configuration and
                              performs a real HTTPS/TLS check before treating SSL
                              as active.
                            </p>
                          </div>
                        </div>

                        {domain.sslStatus === "ACTIVE" ? (
                          <div className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
                            <ShieldCheck className="h-4 w-4" />
                            Secure
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void checkSsl(domain.id)}
                            disabled={checkingSslDomainId === domain.id}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {checkingSslDomainId === domain.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ShieldCheck className="h-4 w-4" />
                            )}

                            {checkingSslDomainId === domain.id
                              ? "Checking SSL..."
                              : domain.sslStatus === "FAILED"
                                ? "Check SSL Again"
                                : "Check SSL"}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {preparedDomainIds.has(domain.id) &&
                  domain.sslStatus === "ACTIVE" ? (
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${
                              domain.deploymentStatus === "LIVE"
                                ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                                : domain.deploymentStatus === "FAILED"
                                  ? "bg-red-50 text-red-600 ring-red-100"
                                  : "bg-white text-slate-500 ring-slate-200"
                            }`}
                          >
                            {domain.deploymentStatus === "LIVE" ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : domain.deploymentStatus === "FAILED" ? (
                              <TriangleAlert className="h-5 w-5" />
                            ) : (
                              <Globe2 className="h-5 w-5" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-bold text-slate-900">
                                Step 05 · Publish Website
                              </p>

                              {domain.deploymentStatus === "LIVE" ? (
                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                                  LIVE
                                </span>
                              ) : domain.deploymentStatus === "DEPLOYING" ? (
                                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-100">
                                  Publishing
                                </span>
                              ) : domain.deploymentStatus === "FAILED" ? (
                                <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 ring-1 ring-red-100">
                                  Publish Failed
                                </span>
                              ) : (
                                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-100">
                                  Ready to publish
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              Publish the website only after DNS verification,
                              production provider connection, and active SSL are
                              confirmed. ROOTYM will verify the public HTTPS
                              endpoint before recording the domain as LIVE.
                            </p>
                          </div>
                        </div>

                        {domain.deploymentStatus === "LIVE" ? (
                          <a
                            href={`https://${domain.domain}/`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                          >
                            <Globe2 className="h-4 w-4" />
                            Open Live Website
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void publishWebsite(domain.id)}
                            disabled={publishingDomainId === domain.id}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {publishingDomainId === domain.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Globe2 className="h-4 w-4" />
                            )}

                            {publishingDomainId === domain.id
                              ? "Publishing..."
                              : domain.deploymentStatus === "FAILED"
                                ? "Publish Again"
                                : "Publish Website"}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {domain.lastError ? (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
                      <span className="font-semibold">
                        Last check:
                      </span>{" "}
                      {domain.lastError}
                    </div>
                  ) : null}
                      </div>
                    </Fragment>
                  );
                })
            : null}
        </div>
      </div>
    </section>
  );
}
