/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Module      : CMS
 * Feature     : Company Management
 * File        : BusinessDetails.tsx
 * Purpose     : Business Details Section
 * Sprint      : Sprint 10.3
 * ============================================================
 */

"use client";

import type { CompanySettings } from "../types";

interface BusinessDetailsProps {
  settings: CompanySettings;
  onChange: (
    section: keyof CompanySettings,
    field: string,
    value: string
  ) => void;
}

export default function BusinessDetails({
  settings,
  onChange,
}: BusinessDetailsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Business Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage your business registration details used on the website,
          invoices and export documents.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* GST Number */}

        <div>
          <label
            htmlFor="gst"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            GST Number
          </label>

          <input
            id="gst"
            type="text"
            value={settings.business.gst}
            onChange={(e) =>
              onChange(
                "business",
                "gst",
                e.target.value
              )
            }
            placeholder="27ABCDE1234F1Z5"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>

        {/* IEC */}

        <div>
          <label
            htmlFor="iec"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Import Export Code (IEC)
          </label>

          <input
            id="iec"
            type="text"
            value={settings.business.iec}
            onChange={(e) =>
              onChange(
                "business",
                "iec",
                e.target.value
              )
            }
            placeholder="0516901234"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>

        {/* APEDA */}

        <div className="md:col-span-2">
          <label
            htmlFor="apeda"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            APEDA Registration Number
          </label>

          <input
            id="apeda"
            type="text"
            value={settings.business.apeda}
            onChange={(e) =>
              onChange(
                "business",
                "apeda",
                e.target.value
              )
            }
            placeholder="APEDA Registration Number"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>
      </div>
    </div>
  );
}