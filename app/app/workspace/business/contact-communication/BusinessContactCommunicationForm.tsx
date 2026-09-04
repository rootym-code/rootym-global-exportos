/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated form for managing
 *          tenant business contact, communication, social
 *          media and online business presence details.
 * ============================================================
 */

"use client";

import { useState } from "react";

import {
    Globe2,
    Mail,
    Phone,
    Save,
  } from "lucide-react";

interface BusinessContactCommunicationData {
  primaryEmail: string | null;
  alternateEmail1: string | null;
  alternateEmail2: string | null;
  salesEmail: string | null;
  infoEmail: string | null;

  primaryPhone: string | null;
  alternatePhone: string | null;
  whatsapp: string | null;

  linkedinUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  googleBusinessUrl: string | null;
  xTwitterUrl: string | null;
  pinterestUrl: string | null;
  otherSocialUrls: string | null;
}

interface BusinessContactCommunicationFormProps {
  initialData: BusinessContactCommunicationData | null;
  canEdit: boolean;
}

type FormData = {
  primaryEmail: string;
  alternateEmail1: string;
  alternateEmail2: string;
  salesEmail: string;
  infoEmail: string;

  primaryPhone: string;
  alternatePhone: string;
  whatsapp: string;

  linkedinUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  googleBusinessUrl: string;
  xTwitterUrl: string;
  pinterestUrl: string;
  otherSocialUrls: string;
};

const emptyFormData: FormData = {
  primaryEmail: "",
  alternateEmail1: "",
  alternateEmail2: "",
  salesEmail: "",
  infoEmail: "",

  primaryPhone: "",
  alternatePhone: "",
  whatsapp: "",

  linkedinUrl: "",
  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  googleBusinessUrl: "",
  xTwitterUrl: "",
  pinterestUrl: "",
  otherSocialUrls: "",
};

function createFormData(
  initialData: BusinessContactCommunicationData | null
): FormData {
  if (!initialData) {
    return { ...emptyFormData };
  }

  return {
    primaryEmail: initialData.primaryEmail ?? "",
    alternateEmail1: initialData.alternateEmail1 ?? "",
    alternateEmail2: initialData.alternateEmail2 ?? "",
    salesEmail: initialData.salesEmail ?? "",
    infoEmail: initialData.infoEmail ?? "",

    primaryPhone: initialData.primaryPhone ?? "",
    alternatePhone: initialData.alternatePhone ?? "",
    whatsapp: initialData.whatsapp ?? "",

    linkedinUrl: initialData.linkedinUrl ?? "",
    facebookUrl: initialData.facebookUrl ?? "",
    instagramUrl: initialData.instagramUrl ?? "",
    youtubeUrl: initialData.youtubeUrl ?? "",
    googleBusinessUrl: initialData.googleBusinessUrl ?? "",
    xTwitterUrl: initialData.xTwitterUrl ?? "",
    pinterestUrl: initialData.pinterestUrl ?? "",
    otherSocialUrls: initialData.otherSocialUrls ?? "",
  };
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
}: {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (name: keyof FormData, value: string) => void;
  placeholder?: string;
  type?: string;
  disabled: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
      />
    </div>
  );
}

function UrlField({
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (name: keyof FormData, value: string) => void;
  placeholder?: string;
  disabled: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type="url"
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
      />
    </div>
  );
}

export default function BusinessContactCommunicationForm({
  initialData,
  canEdit,
}: BusinessContactCommunicationFormProps) {
  const [formData, setFormData] = useState<FormData>(() =>
    createFormData(initialData)
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    name: keyof FormData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!canEdit) {
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/workspace/business/contact-communication",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        const validationErrors = result.errors;

        if (validationErrors) {
          const firstError = Object.values(
            validationErrors
          ).flat()[0];

          setError(
            typeof firstError === "string"
              ? firstError
              : "Please review the highlighted information."
          );
        } else {
          setError(
            result.message ||
              "Unable to save Contact & Communication configuration."
          );
        }

        return;
      }

      setMessage(
        result.message ||
          "Contact & Communication saved successfully."
      );
    } catch (submitError) {
      console.error(
        "Contact & Communication form submission error:",
        submitError
      );

      setError(
        "Unable to save Contact & Communication configuration."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* =====================================================
          BUSINESS EMAIL
          ===================================================== */}

      <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
            <Mail className="h-5 w-5 text-emerald-600" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Email
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Business email addresses
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Configure the email addresses your business uses
              for general, sales and customer communication.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <Field
            label="Primary Business Email"
            name="primaryEmail"
            type="email"
            value={formData.primaryEmail}
            onChange={handleChange}
            placeholder="business@example.com"
            disabled={!canEdit}
          />

          <Field
            label="Sales Email"
            name="salesEmail"
            type="email"
            value={formData.salesEmail}
            onChange={handleChange}
            placeholder="sales@example.com"
            disabled={!canEdit}
          />

          <Field
            label="Information / General Email"
            name="infoEmail"
            type="email"
            value={formData.infoEmail}
            onChange={handleChange}
            placeholder="info@example.com"
            disabled={!canEdit}
          />

          <Field
            label="Alternate Email 1"
            name="alternateEmail1"
            type="email"
            value={formData.alternateEmail1}
            onChange={handleChange}
            placeholder="alternate@example.com"
            disabled={!canEdit}
          />

          <Field
            label="Alternate Email 2"
            name="alternateEmail2"
            type="email"
            value={formData.alternateEmail2}
            onChange={handleChange}
            placeholder="another@example.com"
            disabled={!canEdit}
          />
        </div>
      </section>

      {/* =====================================================
          BUSINESS PHONE
          ===================================================== */}

      <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
            <Phone className="h-5 w-5 text-emerald-600" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Phone
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Business phone numbers
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Configure the primary, alternate and WhatsApp
              numbers used by your business.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <Field
            label="Primary Phone"
            name="primaryPhone"
            value={formData.primaryPhone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            disabled={!canEdit}
          />

          <Field
            label="Alternate Phone"
            name="alternatePhone"
            value={formData.alternatePhone}
            onChange={handleChange}
            placeholder="+91 98765 43211"
            disabled={!canEdit}
          />

          <Field
            label="WhatsApp Number"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            disabled={!canEdit}
          />
        </div>
      </section>

      {/* =====================================================
          SOCIAL & ONLINE PRESENCE
          ===================================================== */}

      <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
            <Globe2 className="h-5 w-5 text-emerald-600" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Online Presence
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Social & business profiles
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add your official social media and online business
              profile links.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <div>
          <div className="text-sm font-semibold text-slate-700">
  LinkedIn
</div>

            <input
              id="linkedinUrl"
              name="linkedinUrl"
              type="url"
              value={formData.linkedinUrl}
              onChange={(event) =>
                handleChange("linkedinUrl", event.target.value)
              }
              placeholder="https://www.linkedin.com/company/..."
              disabled={!canEdit}
              className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          <div>
          <div className="text-sm font-semibold text-slate-700">
  Facebook
</div>

            <input
              id="facebookUrl"
              name="facebookUrl"
              type="url"
              value={formData.facebookUrl}
              onChange={(event) =>
                handleChange("facebookUrl", event.target.value)
              }
              placeholder="https://www.facebook.com/..."
              disabled={!canEdit}
              className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          <div>
          <div className="text-sm font-semibold text-slate-700">
  Instagram
</div>

            <input
              id="instagramUrl"
              name="instagramUrl"
              type="url"
              value={formData.instagramUrl}
              onChange={(event) =>
                handleChange("instagramUrl", event.target.value)
              }
              placeholder="https://www.instagram.com/..."
              disabled={!canEdit}
              className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          <div>
          <div className="text-sm font-semibold text-slate-700">
  YouTube
</div>

            <input
              id="youtubeUrl"
              name="youtubeUrl"
              type="url"
              value={formData.youtubeUrl}
              onChange={(event) =>
                handleChange("youtubeUrl", event.target.value)
              }
              placeholder="https://www.youtube.com/..."
              disabled={!canEdit}
              className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          <UrlField
            label="Google Business Profile"
            name="googleBusinessUrl"
            value={formData.googleBusinessUrl}
            onChange={handleChange}
            placeholder="https://www.google.com/maps/..."
            disabled={!canEdit}
          />

          <UrlField
            label="X / Twitter"
            name="xTwitterUrl"
            value={formData.xTwitterUrl}
            onChange={handleChange}
            placeholder="https://x.com/..."
            disabled={!canEdit}
          />

          <UrlField
            label="Pinterest"
            name="pinterestUrl"
            value={formData.pinterestUrl}
            onChange={handleChange}
            placeholder="https://www.pinterest.com/..."
            disabled={!canEdit}
          />
        </div>

        <div className="mt-5">
          <label
            htmlFor="otherSocialUrls"
            className="block text-sm font-semibold text-slate-700"
          >
            Other Business Social / Profile URLs
          </label>

          <textarea
            id="otherSocialUrls"
            name="otherSocialUrls"
            value={formData.otherSocialUrls}
            onChange={(event) =>
              handleChange("otherSocialUrls", event.target.value)
            }
            placeholder="Add other official business profile URLs, one per line."
            disabled={!canEdit}
            rows={5}
            className="mt-2 block w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
          />

          <p className="mt-2 text-xs text-slate-400">
            You can enter multiple URLs, preferably one URL per line.
          </p>
        </div>
      </section>

      {/* =====================================================
          SAVE STATUS
          ===================================================== */}

      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          ACTIONS
          ===================================================== */}

      {canEdit ? (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Contact & Communication"}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
          You have view-only access to Contact & Communication
          settings.
        </div>
      )}
    </form>
  );
}