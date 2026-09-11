/**
 * ============================================================
 * ROOTYM Business Settings Shell
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides fast setting search, sticky section navigation
 *          and active-section tracking for Business Settings.
 * ============================================================
 */

"use client";

import {
  Check,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type BusinessSettingsSection = {
  id: string;
  label: string;
  description: string;
  keywords: string[];
};

const sections: BusinessSettingsSection[] = [
  {
    id: "identity",
    label: "Company & Identity",
    description: "Business profile, company information and primary address",
    keywords: [
      "company",
      "identity",
      "profile",
      "business",
      "business name",
      "legal name",
      "business type",
      "website",
      "description",
      "address",
      "address line",
      "city",
      "state",
      "postal code",
      "zip",
      "country",
      "registered address",
      "primary address",
    ],
  },
  {
    id: "contact",
    label: "Contact & Online Presence",
    description: "Email, phone, WhatsApp and social channels",
    keywords: [
      "contact",
      "communication",
      "email",
      "primary email",
      "alternate email",
      "sales email",
      "info email",
      "phone",
      "primary phone",
      "alternate phone",
      "whatsapp",
      "linkedin",
      "facebook",
      "instagram",
      "youtube",
      "google business",
      "twitter",
      "x",
      "pinterest",
      "social",
      "online presence",
    ],
  },
  {
    id: "compliance",
    label: "Export & Compliance",
    description: "IEC, GST, LUT, RCMC and regulatory credentials",
    keywords: [
      "export",
      "compliance",
      "iec",
      "iec number",
      "iec status",
      "dgft",
      "dgft profile",
      "gst",
      "gstin",
      "gst registration",
      "gst status",
      "gst treatment",
      "gst export treatment",
      "udyam",
      "udyam number",
      "ad code",
      "ad code bank",
      "icegate",
      "icegate registration",
      "rcmc",
      "rcmc number",
      "rcmc authority",
      "lut",
      "lut bond",
      "lut number",
      "tds",
      "tcs",
      "tax",
      "tax rate",
      "tax compliance",
      "regulatory",
      "license",
      "licence",
    ],
  },
  {
    id: "finance",
    label: "Finance & Payments",
    description: "Currency, payment terms, banking and remittance",
    keywords: [
      "finance",
      "financial",
      "currency",
      "base currency",
      "invoice currency",
      "currency notes",
      "invoice",
      "payment",
      "payment terms",
      "payment method",
      "beneficiary",
      "bank",
      "banking",
      "bank name",
      "branch",
      "account",
      "account number",
      "account currency",
      "ifsc",
      "swift",
      "swift bic",
      "bic",
      "iban",
      "bank address",
      "bank country",
      "remittance",
      "remittance bank",
      "foreign bank",
      "foreign remittance",
      "routing",
      "sort code",
      "rbi",
      "purpose code",
      "bank charges",
      "charges arrangement",
    ],
  },
  {
    id: "operations",
    label: "Operations & Documents",
    description: "Orders, shipments, documents, communication and workflows",
    keywords: [
      "operations",
      "operating",
      "order",
      "orders",
      "order processing",
      "priority",
      "shipment",
      "shipments",
      "shipment mode",
      "incoterm",
      "incoterms",
      "port",
      "port of loading",
      "destination",
      "transport",
      "package",
      "package unit",
      "weight",
      "weight unit",
      "dimension",
      "dimension unit",
      "partial shipment",
      "split shipment",
      "document",
      "documents",
      "document language",
      "document numbering",
      "invoice prefix",
      "quote prefix",
      "packing list",
      "shipping document",
      "approval",
      "approvals",
      "workflow",
      "communication channel",
      "working days",
      "timezone",
      "date format",
      "number format",
    ],
  },
  {
    id: "access",
    label: "Team & Access",
    description: "Workspace members, invitations, roles and permissions",
    keywords: [
      "team",
      "access",
      "member",
      "members",
      "invite",
      "invitation",
      "role",
      "owner",
      "admin",
      "administrator",
      "permissions",
      "user",
      "users",
    ],
  },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default function BusinessSettingsShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState("identity");

  useEffect(() => {
    const sectionElements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sectionElements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-120px 0px -55% 0px",
        threshold: [0, 0.1, 0.25],
      }
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!normalizedQuery) {
      return sections;
    }

    return sections.filter((section) => {
      const searchableText = [
        section.label,
        section.description,
        ...section.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const handleSectionClick = (id: string) => {
    setActiveSection(id);
    scrollToSection(id);
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
            <div className="flex max-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="shrink-0 border-b border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                  Business Settings
                </p>

                <h2 className="mt-1 text-base font-bold text-slate-950">
                  Find a setting
                </h2>

                <div className="relative mt-4">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search settings..."
                    aria-label="Search business settings"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                  />

                  {query && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      aria-label="Clear business settings search"
                      className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {query && (
                  <p className="mt-2 text-[11px] text-slate-400">
                    {matches.length} section{matches.length === 1 ? "" : "s"} found
                  </p>
                )}
              </div>

              <nav className="min-h-0 flex-1 overflow-y-auto p-2">
                {matches.length > 0 ? (
                  matches.map((section) => {
                    const isActive = activeSection === section.id;

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => handleSectionClick(section.id)}
                        className={[
                          "group mb-1 flex w-full items-start gap-2 rounded-xl px-3 py-3 text-left transition",
                          isActive
                            ? "bg-slate-950 text-white shadow-sm"
                            : "text-slate-800 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <span className="min-w-0 flex-1">
                          <span
                            className={[
                              "block text-sm font-semibold",
                              isActive ? "text-white" : "text-slate-800",
                            ].join(" ")}
                          >
                            {section.label}
                          </span>

                          <span
                            className={[
                              "mt-0.5 block text-xs leading-5",
                              isActive
                                ? "text-slate-300"
                                : "text-slate-400",
                            ].join(" ")}
                          >
                            {section.description}
                          </span>
                        </span>

                        <span
                          className={[
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                            isActive
                              ? "bg-emerald-500 text-white"
                              : "text-slate-300 group-hover:text-slate-500",
                          ].join(" ")}
                        >
                          {isActive ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3 py-8 text-center">
                    <Search className="mx-auto h-5 w-5 text-slate-300" />

                    <p className="mt-3 text-xs font-medium text-slate-500">
                      No matching business setting
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-400">
                      Try GST, IEC, bank, WhatsApp, Incoterm or team.
                    </p>
                  </div>
                )}
              </nav>

              {!query && (
                <div className="shrink-0 border-t border-slate-100 px-4 py-3">
                  <p className="text-[10px] leading-4 text-slate-400">
                    Search by setting name or field, then jump directly to
                    its section.
                  </p>
                </div>
              )}
            </div>
          </aside>

          <div className="min-w-0 space-y-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
