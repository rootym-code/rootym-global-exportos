"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Save,
  Send,
  Archive,
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
  status: CmsPageStatus;
  isHomePage: boolean;
  showInMenu: boolean;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
};

const INITIAL_FORM: FormState = {
  internalTitle: "",
  title: "",
  slug: "",
  status: CmsPageStatus.DRAFT,
  isHomePage: false,
  showInMenu: true,
  excerpt: "",
  content: "",
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

function getErrorMessage(
  result: unknown,
  fallback: string
) {
  if (!result || typeof result !== "object") {
    return fallback;
  }

  const data = result as {
    message?: unknown;
    error?: unknown;
    details?: unknown;
  };

  if (typeof data.message === "string") {
    return data.message;
  }

  if (typeof data.error === "string") {
    return data.error;
  }

  if (
    data.error &&
    typeof data.error === "object"
  ) {
    const nested = data.error as {
      message?: unknown;
    };

    if (typeof nested.message === "string") {
      return nested.message;
    }
  }

  return fallback;
}

export default function EditCmsPage() {
  const router = useRouter();
  const params = useParams();

  const pageId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [form, setForm] =
    useState<FormState>(INITIAL_FORM);

  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(true);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!pageId) {
      setError("CMS page ID is missing.");
      setIsLoading(false);
      return;
    }

    async function loadPage() {
      try {
        setError("");

        const response = await fetch(
          `/api/admin/cms/pages/${pageId}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          throw new Error(
            getErrorMessage(
              result,
              "Failed to load CMS page."
            )
          );
        }

        const page = result?.data;

        if (!page) {
          throw new Error(
            "CMS page data was not returned."
          );
        }

        const defaultTranslation =
          page.translations?.find(
            (translation: {
              language?: {
                isDefault?: boolean;
              };
            }) =>
              translation.language?.isDefault
          ) ??
          page.translations?.[0];

        setForm({
          internalTitle:
            page.title ?? "",

          title:
            defaultTranslation?.title ??
            page.title ??
            "",

          slug:
            defaultTranslation?.slug ??
            page.slug ??
            "",

          status:
            page.status ??
            CmsPageStatus.DRAFT,

          isHomePage:
            page.isHomePage ?? false,

          showInMenu:
            page.showInMenu ?? true,

          excerpt:
            defaultTranslation?.excerpt ??
            "",

          content:
            defaultTranslation?.content ??
            "",

          metaTitle:
            defaultTranslation?.metaTitle ??
            page.metaTitle ??
            "",

          metaDescription:
            defaultTranslation?.metaDescription ??
            page.metaDescription ??
            "",

          metaKeywords:
            defaultTranslation?.metaKeywords ??
            page.metaKeywords ??
            "",

          canonicalUrl:
            page.canonicalUrl ??
            "",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load CMS page."
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadPage();
  }, [pageId]);

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

  async function handleSave(
    requestedStatus?: CmsPageStatus
  ) {
    setError("");
    setSuccess("");

    const internalTitle =
      form.internalTitle.trim();

    const title = form.title.trim();

    const slug = form.slug.trim();

    if (!internalTitle) {
      setError(
        "Internal page title is required."
      );
      return;
    }

    if (!title) {
      setError("Page title is required.");
      return;
    }

    if (!slug) {
      setError("Page slug is required.");
      return;
    }

    if (!pageId) {
      setError("CMS page ID is missing.");
      return;
    }

    const status =
      requestedStatus ?? form.status;

    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/admin/cms/pages/${pageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: internalTitle,

            slug,

            status,

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

              excerpt:
                form.excerpt.trim(),

              content:
                form.content,

              metaTitle:
                form.metaTitle.trim(),

              metaDescription:
                form.metaDescription.trim(),

              metaKeywords:
                form.metaKeywords.trim(),

              isPublished:
                status ===
                CmsPageStatus.PUBLISHED,
            },
          }),
        }
      );

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            result,
            "Failed to update CMS page."
          )
        );
      }

      const successMessage =
        status === CmsPageStatus.PUBLISHED
          ? "CMS page published successfully."
          : status === CmsPageStatus.ARCHIVED
            ? "CMS page archived successfully."
            : "CMS page saved as draft successfully.";

      setSuccess(successMessage);

      setTimeout(() => {
        router.push("/admin/cms/pages");
        router.refresh();
      }, 700);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update CMS page."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    void handleSave(form.status);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading CMS page...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() =>
            router.push("/admin/cms/pages")
          }
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#2E7D32]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to CMS Pages
        </button>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Edit CMS Page
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update page content, publishing settings
          and SEO metadata.
        </p>
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
              Basic page information and publishing
              settings.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
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
                maxLength={200}
                required
              />

              <p className="text-xs text-gray-500">
                Used internally to identify the page
                in the CMS.
              </p>
            </div>

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
                    value: CmsPageStatus.DRAFT,
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
                maxLength={200}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                URL Slug
              </Label>

              <Input
                id="slug"
                value={form.slug}
                onChange={(event) => {
                  setSlugManuallyEdited(true);

                  updateField(
                    "slug",
                    createSlug(
                      event.target.value
                    )
                  );
                }}
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
                  Controls whether this page is
                  intended to appear in site navigation.
                </p>
              </div>
            </div>

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
                  Only enable this when this page should
                  become the website homepage.
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
              Edit the content stored with the default
              CMS language.
            </p>
          </div>

          <div className="space-y-5">
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
                maxLength={500}
                rows={4}
              />
            </div>

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
                rows={16}
              />
            </div>
          </div>
        </Card>

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
              Search-engine metadata for this page.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
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
                maxLength={255}
              />
            </div>

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
                maxLength={500}
                rows={4}
              />
            </div>

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
              router.push("/admin/cms/pages")
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
              ) : form.status ===
                CmsPageStatus.ARCHIVED ? (
                <Archive className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {form.status ===
              CmsPageStatus.ARCHIVED
                ? "Archive"
                : form.status ===
                    CmsPageStatus.PUBLISHED
                  ? "Save Changes"
                  : "Save Draft"}
            </Button>

            <Button
              type="button"
              variant="success"
              disabled={isSaving}
              onClick={() => {
                void handleSave(
                  CmsPageStatus.PUBLISHED
                );
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