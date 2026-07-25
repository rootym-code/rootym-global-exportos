"use client";

import type { CompanySettings } from "../types";

interface BrandingProps {
  settings: CompanySettings;
  onChange: (
    field: keyof CompanySettings,
    value: string
  ) => void;
}

export default function Branding({
  settings,
  onChange,
}: BrandingProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Branding
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure your company branding assets that will be used
          throughout the website and customer-facing pages.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Logo URL */}
        <div>
          <label
            htmlFor="logo"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Company Logo URL
          </label>

          <input
            id="logo"
            type="text"
            value={settings.logo}
            onChange={(e) =>
              onChange("logo", e.target.value)
            }
            placeholder="https://cdn.example.com/logo.png"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
          />

          <p className="mt-2 text-xs text-slate-500">
            Enter the public URL of your company logo.
          </p>
        </div>

        {/* Favicon URL */}
        <div>
          <label
            htmlFor="favicon"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Favicon URL
          </label>

          <input
            id="favicon"
            type="text"
            value={settings.favicon}
            onChange={(e) =>
              onChange("favicon", e.target.value)
            }
            placeholder="https://cdn.example.com/favicon.ico"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
          />

          <p className="mt-2 text-xs text-slate-500">
            Enter the public URL of your website favicon.
          </p>
        </div>
      </div>

      {(settings.logo || settings.favicon) && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Logo Preview */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-slate-700">
              Logo Preview
            </h3>

            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt="Company Logo"
                  className="max-h-28 max-w-full object-contain"
                />
              ) : (
                <span className="text-sm text-slate-400">
                  No logo selected
                </span>
              )}
            </div>
          </div>

          {/* Favicon Preview */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-slate-700">
              Favicon Preview
            </h3>

            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
              {settings.favicon ? (
                <img
                  src={settings.favicon}
                  alt="Favicon"
                  className="h-12 w-12 object-contain"
                />
              ) : (
                <span className="text-sm text-slate-400">
                  No favicon selected
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}