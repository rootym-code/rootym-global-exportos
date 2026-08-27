/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Module      : CMS
 * Feature     : Company Management
 * File        : ContactDetails.tsx
 * Purpose     : Contact Details Section
 * Sprint      : Sprint 10.3
 * ============================================================
 */

"use client";

import type { CompanySettings } from "../types";

interface ContactDetailsProps {
  settings: CompanySettings;
  onChange: (
    section: keyof CompanySettings,
    field: string,
    value: string
  ) => void;
}

export default function ContactDetails({
  settings,
  onChange,
}: ContactDetailsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Contact Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure your business contact information used across the
          website and customer inquiries.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Phone */}

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Phone Number
          </label>

          <input
            id="phone"
            type="text"
            value={settings.contact.phone}
            onChange={(e) =>
              onChange(
                "contact",
                "phone",
                e.target.value
              )
            }
            placeholder="+91 9876543210"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>

        {/* WhatsApp */}

        <div>
          <label
            htmlFor="whatsapp"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            WhatsApp Number
          </label>

          <input
            id="whatsapp"
            type="text"
            value={settings.contact.whatsapp}
            onChange={(e) =>
              onChange(
                "contact",
                "whatsapp",
                e.target.value
              )
            }
            placeholder="+91 9876543210"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>

        {/* Email */}

        <div className="md:col-span-2">
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            value={settings.contact.email}
            onChange={(e) =>
              onChange(
                "contact",
                "email",
                e.target.value
              )
            }
            placeholder="info@rootym.com"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>

        {/* Address */}

        <div className="md:col-span-2">
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Business Address
          </label>

          <textarea
            id="address"
            rows={4}
            value={settings.contact.address}
            onChange={(e) =>
              onChange(
                "contact",
                "address",
                e.target.value
              )
            }
            placeholder="Enter your complete business address..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>
      </div>
    </div>
  );
}