/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Module      : CMS
 * Feature     : Company Management
 * File        : CompanyDetails.tsx
 * Purpose     : Company Details Section
 * Sprint      : Sprint 10.3
 * ============================================================
 */

"use client";

import type { CompanySettings } from "../types";

interface CompanyDetailsProps {
  settings: CompanySettings;
  onChange: (
    field: keyof CompanySettings,
    value: string
  ) => void;
}

export default function CompanyDetails({
  settings,
  onChange,
}: CompanyDetailsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* ============================================================
          Section Header
      ============================================================ */}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Company Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Basic information about your company.
        </p>
      </div>

      {/* ============================================================
          Form
      ============================================================ */}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Company Name */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Company Name
          </label>

          <input
            type="text"
            value={settings.companyName}
            onChange={(event) =>
              onChange(
                "companyName",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-700"
            placeholder="ROOTYM Agro Harvest Pvt. Ltd."
          />
        </div>

        {/* Legal Name */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Legal Company Name
          </label>

          <input
            type="text"
            value={settings.legalName}
            onChange={(event) =>
              onChange(
                "legalName",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-700"
            placeholder="ROOTYM Agro Harvest Private Limited"
          />
        </div>

        {/* Tagline */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Tagline
          </label>

          <input
            type="text"
            value={settings.tagline}
            onChange={(event) =>
              onChange(
                "tagline",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-700"
            placeholder="Rooted in India. Trusted Worldwide."
          />
        </div>
      </div>
    </section>
  );
}