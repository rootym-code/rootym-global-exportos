"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  CmsLandingPageContent,
  PageLayout,
  PageTemplate,
} from "@/components/admin/cms/pages/types";

import StructuredLandingPageEditor from "@/components/admin/cms/pages/StructuredLandingPageEditor";

import {
  ArrowLeft,
  Loader2,
  Save,
  Send,
} from "lucide-react";

import { CmsPageStatus } from "@/lib/generated/prisma";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FormState = {
  internalTitle: string;
  title: string;
  slug: string;
  template: PageTemplate;
  layout: PageLayout;
  status: CmsPageStatus;
  isHomePage: boolean;
  showInMenu: boolean;
  excerpt: string;
  content: string;
  structuredContent: CmsLandingPageContent;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
};

const INITIAL_FORM: FormState = {
  internalTitle: "",
  title: "",
  slug: "",
  template: "STANDARD",
  layout: "WEBSITE",
  status: CmsPageStatus.DRAFT,
  isHomePage: false,
  showInMenu: true,
  excerpt: "",
  content: "",
  structuredContent: {
    version: 1,
    template: "COUNTRY_LANDING",
    sections: [],
  },
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  canonicalUrl: "",
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CreateCmsPage() {
  const router = useRouter();

  const [form, setForm] =
    useState<FormState>(INITIAL_FORM);

  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugManuallyEdited
        ? current.slug
        : createSlug(value),
    }));
  }

  async function handleSave(publish: boolean) {
    setError("");
    setSuccess("");

    const internalTitle =
      form.internalTitle.trim();

    const title =
      form.title.trim();

    const slug =
      form.slug.trim();

    if (!internalTitle) {
      setError(
        "Internal page title is required."
      );
      return;
    }

    if (!title) {
      setError(
        "Page title is required."
      );
      return;
    }

    if (!slug) {
      setError(
        "Page slug is required."
      );
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        "/api/admin/cms/pages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: internalTitle,
            slug,

            status: publish
              ? CmsPageStatus.PUBLISHED
              : CmsPageStatus.DRAFT,

            template: form.template,

            layout: form.layout,

            isHomePage:
              form.isHomePage,

            showInMenu:
              form.showInMenu,

            ...(form.canonicalUrl.trim()
              ? {
                  canonicalUrl:
                    form.canonicalUrl.trim(),
                }
              : {}),

            metaTitle:
              form.metaTitle.trim(),

            metaDescription:
              form.metaDescription.trim(),

            metaKeywords:
              form.metaKeywords.trim(),

            translation: {
              title,

              slug,

              ...(form.excerpt.trim()
                ? {
                    excerpt:
                      form.excerpt.trim(),
                  }
                : {}),

              content:
                form.content,

              ...(form.template ===
                "COUNTRY_LANDING"
                ? {
                    structuredContent:
                      form.structuredContent,
                  }
                : {}),

              metaTitle:
                form.metaTitle.trim(),

              metaDescription:
                form.metaDescription.trim(),

              metaKeywords:
                form.metaKeywords.trim(),

              isPublished:
                publish,
            },
          }),
        }
      );

      const result =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ??
            result?.error ??
            "Failed to create CMS page."
        );
      }

      setSuccess(
        publish
          ? "CMS page published successfully."
          : "CMS page saved as draft successfully."
      );

      setTimeout(() => {
        router.push(
          "/admin/cms/pages"
        );

        router.refresh();
      }, 700);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create CMS page."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    void handleSave(false);
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/cms/pages"
              )
            }
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#2E7D32]"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to CMS Pages
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Create CMS Page
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create a new website page,
            configure its content and SEO
            settings, then save it as a draft
            or publish it.
          </p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* General */}
        <Card
          hover={false}
          className="p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              General
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Basic page information,
              template and publishing settings.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Internal Title */}
            <div className="space-y-2">
              <Label htmlFor="internalTitle">
                Internal Page Title
              </Label>

              <Input
                id="internalTitle"
                value={form.internalTitle}
                onChange={(event) =>
                  updateField(
                    "internalTitle",
                    event.target.value
                  )
                }
                placeholder="e.g. UAE Onion Flakes Landing Page"
                maxLength={200}
                required
              />

              <p className="text-xs text-gray-500">
                Used internally to identify
                the page in the CMS.
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">
                Status
              </Label>

              <Select
                id="status"
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target
                      .value as CmsPageStatus
                  )
                }
                options={[
                  {
                    label: "Draft",
                    value:
                      CmsPageStatus.DRAFT,
                  },
                  {
                    label: "Published",
                    value:
                      CmsPageStatus.PUBLISHED,
                  },
                  {
                    label: "Archived",
                    value:
                      CmsPageStatus.ARCHIVED,
                  },
                ]}
              />
            </div>

            {/* Template */}
            <div className="space-y-2">
              <Label htmlFor="template">
                Page Template
              </Label>

              <Select
                id="template"
                value={form.template}
                onChange={(event) =>
                  updateField(
                    "template",
                    event.target
                      .value as PageTemplate
                  )
                }
                options={[
                  {
                    label: "Standard Page",
                    value: "STANDARD",
                  },
                  {
                    label:
                      "Country Landing Page",
                    value:
                      "COUNTRY_LANDING",
                  },
                ]}
              />

              <p className="text-xs text-gray-500">
                Select the intended presentation
                structure for this page.
              </p>
            </div>

            {/* Page Presentation */}
            <div className="space-y-2">
              <Label htmlFor="layout">
                Page Presentation
              </Label>

              <Select
                id="layout"
                value={form.layout}
                onChange={(event) =>
                  updateField(
                    "layout",
                    event.target.value as PageLayout
                  )
                }
                options={[
                  {
                    label: "ROOTYM Website",
                    value: "WEBSITE",
                  },
                  {
                    label:
                      "Standalone Landing Page",
                    value: "STANDALONE",
                  },
                ]}
              />

              <p className="text-xs text-gray-500">
                Choose whether this page uses the
                ROOTYM website header and footer or
                works as a standalone landing page.
              </p>
            </div>

            {/* Page Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Page Title
              </Label>

              <Input
                id="title"
                value={form.title}
                onChange={(event) =>
                  handleTitleChange(
                    event.target.value
                  )
                }
                placeholder="e.g. Dehydrated Onion Flakes Supplier in UAE"
                maxLength={200}
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                URL Slug
              </Label>

              <Input
                id="slug"
                value={form.slug}
                onChange={(event) => {
                  setSlugManuallyEdited(
                    true
                  );

                  updateField(
                    "slug",
                    createSlug(
                      event.target.value
                    )
                  );
                }}
                placeholder="dehydrated-onion-flakes-uae"
                maxLength={200}
                required
              />

              <p className="text-xs text-gray-500">
                Public URL preview:{" "}
                <span className="font-medium text-gray-700">
                  {form.slug
                    ? `/${form.slug}`
                    : "/your-page-slug"}
                </span>
              </p>
            </div>

            {/* Show in Menu */}
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
              <input
                id="showInMenu"
                type="checkbox"
                checked={form.showInMenu}
                onChange={(event) =>
                  updateField(
                    "showInMenu",
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-gray-300 accent-[#2E7D32]"
              />

              <div>
                <Label
                  htmlFor="showInMenu"
                  className="cursor-pointer"
                >
                  Show in Menu
                </Label>

                <p className="mt-1 text-xs text-gray-500">
                  Controls whether this page
                  is intended to appear in
                  site navigation.
                </p>
              </div>
            </div>

            {/* Homepage */}
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
              <input
                id="isHomePage"
                type="checkbox"
                checked={form.isHomePage}
                onChange={(event) =>
                  updateField(
                    "isHomePage",
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-gray-300 accent-[#2E7D32]"
              />

              <div>
                <Label
                  htmlFor="isHomePage"
                  className="cursor-pointer"
                >
                  Set as Homepage
                </Label>

                <p className="mt-1 text-xs text-gray-500">
                  Only enable this when this
                  page should become the
                  website homepage.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Content */}
        <Card
          hover={false}
          className="p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Page Content
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add the content that will be
              stored with the default CMS
              language.
            </p>
          </div>

          <div className="space-y-5">
            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">
                Excerpt
              </Label>

              <Textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(event) =>
                  updateField(
                    "excerpt",
                    event.target.value
                  )
                }
                placeholder="Short summary of this page..."
                maxLength={500}
                rows={4}
              />

              <p className="text-xs text-gray-500">
                Maximum 500 characters.
              </p>
            </div>

            {/* Standard Page Content */}
            {form.template === "STANDARD" && (
              <div className="space-y-2">
                <Label htmlFor="content">
                  Page Content
                </Label>

                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(event) =>
                    updateField(
                      "content",
                      event.target.value
                    )
                  }
                  placeholder="Enter page content..."
                  rows={16}
                />

                <p className="text-xs text-gray-500">
                  Enter the content that should
                  appear on this standard CMS page.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Structured Country Landing Page */}
        {form.template ===
          "COUNTRY_LANDING" && (
          <StructuredLandingPageEditor
            value={form.structuredContent}
            onChange={(
              structuredContent
            ) =>
              updateField(
                "structuredContent",
                structuredContent
              )
            }
          />
        )}

        {/* SEO */}
        <Card
          hover={false}
          className="p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              SEO
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Search-engine metadata for this
              page.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Meta Title */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">
                Meta Title
              </Label>

              <Input
                id="metaTitle"
                value={form.metaTitle}
                onChange={(event) =>
                  updateField(
                    "metaTitle",
                    event.target.value
                  )
                }
                placeholder="SEO title"
                maxLength={255}
              />
            </div>

            {/* Canonical URL */}
            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">
                Canonical URL
              </Label>

              <Input
                id="canonicalUrl"
                type="url"
                value={form.canonicalUrl}
                onChange={(event) =>
                  updateField(
                    "canonicalUrl",
                    event.target.value
                  )
                }
                placeholder="https://www.rootym.com/..."
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="metaDescription">
                Meta Description
              </Label>

              <Textarea
                id="metaDescription"
                value={form.metaDescription}
                onChange={(event) =>
                  updateField(
                    "metaDescription",
                    event.target.value
                  )
                }
                placeholder="Describe this page for search engines..."
                maxLength={500}
                rows={4}
              />
            </div>

            {/* Meta Keywords */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="metaKeywords">
                Meta Keywords
              </Label>

              <Input
                id="metaKeywords"
                value={form.metaKeywords}
                onChange={(event) =>
                  updateField(
                    "metaKeywords",
                    event.target.value
                  )
                }
                placeholder="onion flakes, dehydrated onion, UAE, India"
                maxLength={500}
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push(
                "/admin/cms/pages"
              )
            }
            disabled={isSaving}
          >
            Cancel
          </Button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="submit"
              variant="outline"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              Save Draft
            </Button>

            <Button
              type="button"
              variant="success"
              disabled={isSaving}
              onClick={() => {
                void handleSave(true);
              }}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}

              Publish
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}