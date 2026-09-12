/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author      : Prem Singh
 * Module      : Customer Workspace Product Management
 * Feature     : Website Product Creation
 * File        : app/app/workspace/products/new/page.tsx
 * Purpose     : Creates a Website-owned product from the
 *               authenticated Customer Workspace.
 * ============================================================
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  FileText,
  Loader2,
  Save,
  Upload,
  X,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import type { MediaDto } from "@/lib/types/media";

type ProductStatus =
  | "PUBLISHED"
  | "DRAFT"
  | "ARCHIVED";

interface ProductFormData {
  sku: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  origin: string;
  hsCode: string;
  defaultUnit: string;
  minOrderQty: string;
  maxOrderQty: string;
  status: ProductStatus;
}


interface MediaResponse {
  success?: boolean;
  message?: string;
  data?: MediaDto[] | MediaDto;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function getResponseMessage(payload: unknown, fallback: string) {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return fallback;
}

function WorkspaceMediaChooser({
  open,
  selectedId,
  onClose,
  onSelect,
}: {
  open: boolean;
  selectedId: string | null;
  onClose: () => void;
  onSelect: (media: MediaDto) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<MediaDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    async function loadMedia() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        params.set("page", "1");
        params.set("limit", "48");
        params.set("mediaType", "IMAGE");

        if (search.trim()) {
          params.set("search", search.trim());
        }

        const response = await fetch(
          `/api/workspace/website/media?${params.toString()}`,
          {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store",
          },
        );

        const payload = (await response.json()) as MediaResponse;

        if (!response.ok) {
          throw new Error(
            getResponseMessage(
              payload,
              "Unable to load Website Media Library.",
            ),
          );
        }

        const data = Array.isArray(payload.data) ? payload.data : [];

        setItems(
          data.filter(
            (item) => item.mediaType === "IMAGE" && !item.isDeleted,
          ),
        );
      } catch (err) {
        setItems([]);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load Website Media Library.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadMedia();
  }, [open, search]);

  async function handleUpload(file: File) {
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const response = await fetch(
        "/api/workspace/website/media/upload",
        {
          method: "POST",
          credentials: "same-origin",
          body: formData,
        },
      );

      const payload = (await response.json()) as MediaResponse;

      if (!response.ok) {
        throw new Error(
          getResponseMessage(payload, "Unable to upload media."),
        );
      }

      const uploaded =
        payload.data && !Array.isArray(payload.data)
          ? payload.data
          : null;

      if (!uploaded) {
        throw new Error(
          "Media upload succeeded but no media record was returned.",
        );
      }

      if (uploaded.mediaType !== "IMAGE") {
        throw new Error("Please upload an image.");
      }

      onSelect(uploaded);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload media.",
      );
    } finally {
      setUploading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Website Media Library
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Select an image from this Website&apos;s Media Library or
              upload a new product image.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close media selector"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search images..."
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  void handleUpload(file);
                }

                event.currentTarget.value = "";
              }}
            />

            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload
            </Button>
          </div>

          {error && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-green-700" />
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
              <p className="font-medium text-slate-700">
                No images found.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Upload a new product image or add one to the Website Media
                Library first.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => {
                const selected = item.id === selectedId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item)}
                    className={`group overflow-hidden rounded-xl border text-left transition ${
                      selected
                        ? "border-green-600 ring-2 ring-green-100"
                        : "border-slate-200 hover:border-green-400"
                    }`}
                  >
                    <div className="flex h-32 items-center justify-center bg-slate-100">
                      {item.fileUrl ? (
                        <img
                          src={item.fileUrl}
                          alt={
                            item.altText ||
                            item.title ||
                            item.fileName
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FileText className="h-10 w-10 text-slate-400" />
                      )}
                    </div>

                    <div className="p-3">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {item.title || item.fileName}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const initialForm: ProductFormData = {
  sku: "",
  slug: "",
  name: "",
  description: "",
  category: "",
  origin: "",
  hsCode: "",
  defaultUnit: "KG",
  minOrderQty: "",
  maxOrderQty: "",
  status: "DRAFT",
};

export default function NewWorkspaceProductPage() {
  const router = useRouter();

  const [form, setForm] =
    useState<ProductFormData>(initialForm);

  const [featuredImage, setFeaturedImage] =
    useState<MediaDto | null>(null);

  const [pickerOpen, setPickerOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const updateField = (
    field: keyof ProductFormData,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      /*
       * Website ownership is intentionally NOT sent by the
       * browser.
       *
       * The authenticated Customer Workspace API resolves
       * the current tenant Website and assigns websiteId
       * on the server side.
       */
      const payload = {
        ...form,

        featuredImageId:
          featuredImage?.id ?? null,

        minOrderQty: form.minOrderQty
          ? Number(form.minOrderQty)
          : null,

        maxOrderQty: form.maxOrderQty
          ? Number(form.maxOrderQty)
          : null,
      };

      const response = await fetch(
        "/api/workspace/products",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ??
            "Unable to create product."
        );
      }

      router.push("/app/workspace/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/app/workspace/products">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Create Product
            </h1>

            <p className="mt-2 text-slate-600">
              Add a new export product to your
              Website catalogue.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Product
            </>
          )}
        </Button>
      </div>

      {error && (
        <Card
          hover={false}
          className="border border-red-200 bg-red-50 p-4 text-red-700"
        >
          {error}
        </Card>
      )}

      {/* Product Information */}

      <Card
        hover={false}
        className="p-6"
      >
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          Product Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Product Name *
            </label>

            <input
              type="text"
              required
              value={form.name}
              onChange={(event) =>
                updateField(
                  "name",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="Premium Fox Nuts"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              SKU *
            </label>

            <input
              type="text"
              required
              value={form.sku}
              onChange={(event) =>
                updateField(
                  "sku",
                  event.target.value.toUpperCase()
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="PFN-001"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Slug *
            </label>

            <input
              type="text"
              required
              value={form.slug}
              onChange={(event) =>
                updateField(
                  "slug",
                  event.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="premium-fox-nuts"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>

            <input
              type="text"
              value={form.category}
              onChange={(event) =>
                updateField(
                  "category",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="Makhana"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            rows={6}
            value={form.description}
            onChange={(event) =>
              updateField(
                "description",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            placeholder="Describe the product, quality, export specifications and highlights..."
          />
        </div>
      </Card>

      {/* Featured Image */}

      <Card
        hover={false}
        className="p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Featured Image
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload or select the main product image
              from this Website&apos;s Media Library.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setPickerOpen(true)
            }
          >
            Media Library
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white">
          {featuredImage ? (
            <div className="relative">
              <div className="flex min-h-64 items-center justify-center bg-slate-50 p-4">
                {featuredImage.fileUrl ? (
                  <img
                    src={featuredImage.fileUrl}
                    alt={
                      featuredImage.altText ||
                      featuredImage.title ||
                      featuredImage.fileName
                    }
                    className="max-h-80 max-w-full rounded-lg object-contain"
                  />
                ) : (
                  <FileText className="h-12 w-12 text-slate-400" />
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">
                    {featuredImage.title || featuredImage.fileName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Selected as the featured product image.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPickerOpen(true)}
                  >
                    Change Image
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFeaturedImage(null)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                <Upload className="h-9 w-9 text-green-700" />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                Upload Product Image
              </h3>

              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Upload a new image directly to this Website&apos;s Media
                Library or select an existing image.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setPickerOpen(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPickerOpen(true)}
                >
                  Media Library
                </Button>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Supported formats: JPG, PNG, WEBP
              </p>
            </div>
          )}
        </div>

        <WorkspaceMediaChooser
          open={pickerOpen}
          selectedId={featuredImage?.id ?? null}
          onClose={() => setPickerOpen(false)}
          onSelect={(media) => {
            setFeaturedImage(media);
            setPickerOpen(false);
          }}
        />
      </Card>

      {/* Export Information */}

      <Card
        hover={false}
        className="p-6"
      >
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          Export Information
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Country of Origin
            </label>

            <input
              type="text"
              value={form.origin}
              onChange={(event) =>
                updateField(
                  "origin",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="India"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              HS Code
            </label>

            <input
              type="text"
              value={form.hsCode}
              onChange={(event) =>
                updateField(
                  "hsCode",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="08029090"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Default Unit
            </label>

            <input
              type="text"
              value={form.defaultUnit}
              onChange={(event) =>
                updateField(
                  "defaultUnit",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="KG"
            />
          </div>
        </div>
      </Card>

      {/* Order Configuration */}

      <Card
        hover={false}
        className="p-6"
      >
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          Order Configuration
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Minimum Order Quantity
            </label>

            <input
              type="number"
              min="0"
              value={form.minOrderQty}
              onChange={(event) =>
                updateField(
                  "minOrderQty",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Maximum Order Quantity
            </label>

            <input
              type="number"
              min="0"
              value={form.maxOrderQty}
              onChange={(event) =>
                updateField(
                  "maxOrderQty",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="10000"
            />
          </div>
        </div>
      </Card>

      {/* Publication */}

      <Card
        hover={false}
        className="p-6"
      >
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          Publication
        </h2>

        <div className="max-w-sm">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            value={form.status}
            onChange={(event) =>
              updateField(
                "status",
                event.target.value as ProductStatus
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          >
            <option value="DRAFT">
              Draft
            </option>

            <option value="PUBLISHED">
              Published
            </option>

            <option value="ARCHIVED">
              Archived
            </option>
          </select>
        </div>
      </Card>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <Link href="/app/workspace/products">
          <Button
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
        </Link>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Product
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
