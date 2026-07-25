"use client";

import type { CompanySettings } from "../types";

interface SocialLinksProps {
  settings: CompanySettings;
  onChange: (
    field: keyof CompanySettings,
    value: string
  ) => void;
}

export default function SocialLinks({
  settings,
  onChange,
}: SocialLinksProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Social Media Links
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure your company's official social media profiles. These
          links can be displayed in the website footer, contact page and
          other public sections.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Facebook */}
        <div>
          <label
            htmlFor="facebook"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Facebook
          </label>

          <input
            id="facebook"
            type="url"
            value={settings.facebook}
            onChange={(e) =>
              onChange("facebook", e.target.value)
            }
            placeholder="https://facebook.com/rootym"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label
            htmlFor="linkedin"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            LinkedIn
          </label>

          <input
            id="linkedin"
            type="url"
            value={settings.linkedin}
            onChange={(e) =>
              onChange("linkedin", e.target.value)
            }
            placeholder="https://linkedin.com/company/rootym"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>

        {/* Instagram */}
        <div>
          <label
            htmlFor="instagram"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Instagram
          </label>

          <input
            id="instagram"
            type="url"
            value={settings.instagram}
            onChange={(e) =>
              onChange("instagram", e.target.value)
            }
            placeholder="https://instagram.com/rootym"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>

        {/* YouTube */}
        <div>
          <label
            htmlFor="youtube"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            YouTube
          </label>

          <input
            id="youtube"
            type="url"
            value={settings.youtube}
            onChange={(e) =>
              onChange("youtube", e.target.value)
            }
            placeholder="https://youtube.com/@rootym"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>

        {/* X (Twitter) */}
        <div className="md:col-span-2">
          <label
            htmlFor="twitter"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            X (Twitter)
          </label>

          <input
            id="twitter"
            type="url"
            value={settings.twitter}
            onChange={(e) =>
              onChange("twitter", e.target.value)
            }
            placeholder="https://x.com/rootym"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>
      </div>
    </div>
  );
}