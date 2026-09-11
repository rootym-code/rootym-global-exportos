/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author      : Prem Singh
 * Module      : Customer Workspace
 * Feature     : Website Product Editing
 * File        : app/app/workspace/products/[id]/edit/page.tsx
 * Purpose     : Provides customer-safe editing for the shared
 *               Website Product catalogue without creating a
 *               separate Workspace Product record.
 * ============================================================
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  FileText,
  Globe2,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Upload,
  X,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { MediaDto } from "@/lib/types/media";

type ProductStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

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

interface ProductRecord extends ProductFormData {
  id: string;
  websiteId: string;
  featuredImageId: string | null;
  specificationDocumentId: string | null;
  featuredImage: MediaDto | null;
  specificationDocument: MediaDto | null;
}

interface ProductPricingRecord {
  id: string;
  productId: string;
  pricingType: string;
  currency: string;
  price: string | number | null;
  validFrom: string | null;
  validTo: string | null;
  isActive: boolean;
  remarks: string | null;
}

interface ProductPricingResponse {
  success: boolean;
  message?: string;
  data: ProductPricingRecord[];
}

interface PricingFormData {
  pricingType: "FIXED" | "MARKET";
  currency: string;
  price: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  remarks: string;
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

const emptyForm: ProductFormData = {
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

const emptyPricingForm: PricingFormData = {
  pricingType: "FIXED",
  currency: "USD",
  price: "",
  validFrom: "",
  validTo: "",
  isActive: true,
  remarks: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100";

function formatDate(value: string | null) {
  if (!value) return "Open";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mediaLabel(media: MediaDto | null) {
  if (!media) return "No file selected";
  return media.title || media.fileName;
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

function MediaChooser({
  open,
  title,
  mediaType,
  selectedId,
  accept,
  onClose,
  onSelect,
}: {
  open: boolean;
  title: string;
  mediaType: "IMAGE" | "DOCUMENT";
  selectedId: string | null;
  accept: string;
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
        params.set("mediaType", mediaType);

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
            getResponseMessage(payload, "Unable to load Website Media Library."),
          );
        }

        const data = Array.isArray(payload.data) ? payload.data : [];
        setItems(
          data.filter(
            (item) =>
              item.mediaType === mediaType && !item.isDeleted,
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
  }, [open, mediaType, search]);

  async function handleUpload(file: File) {
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", mediaType === "IMAGE" ? "products" : "products/specifications");

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
        throw new Error("Media upload succeeded but no media record was returned.");
      }

      if (uploaded.mediaType !== mediaType) {
        throw new Error(
          mediaType === "IMAGE"
            ? "Please upload an image."
            : "Please upload a document.",
        );
      }

      onSelect(uploaded);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to upload media.",
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
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-xs text-slate-500">
              Select from this Website&apos;s Media Library or upload a new file.
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
              placeholder={`Search ${mediaType === "IMAGE" ? "images" : "documents"}...`}
              className={inputClass}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleUpload(file);
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
              <p className="font-medium text-slate-700">No media found.</p>
              <p className="mt-1 text-sm text-slate-500">
                Upload a new file or use the Website Media Library to add one.
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
                      {item.mediaType === "IMAGE" && item.fileUrl ? (
                        <img
                          src={item.fileUrl}
                          alt={item.altText || item.title || item.fileName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FileText className="h-10 w-10 text-slate-400" />
                      )}
                    </div>

                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                          {mediaLabel(item)}
                        </p>
                        {selected && (
                          <span className="shrink-0 rounded-full bg-green-100 p-1 text-green-700">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.mimeType}
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

export default function WorkspaceEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [featuredImage, setFeaturedImage] = useState<MediaDto | null>(null);
  const [specificationDocument, setSpecificationDocument] =
    useState<MediaDto | null>(null);

  const [imageChooserOpen, setImageChooserOpen] = useState(false);
  const [documentChooserOpen, setDocumentChooserOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [pricing, setPricing] = useState<ProductPricingRecord[]>([]);
  const [pricingForm, setPricingForm] =
    useState<PricingFormData>(emptyPricingForm);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingError, setPricingError] = useState("");

  function updateField(field: keyof ProductFormData, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function loadPricing() {
    setPricingLoading(true);
    setPricingError("");

    try {
      const response = await fetch(
        `/api/workspace/products/${encodeURIComponent(productId)}/pricing`,
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        },
      );

      const payload = (await response.json()) as ProductPricingResponse;

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.message ?? "Unable to load product pricing.",
        );
      }

      setPricing(payload.data ?? []);
    } catch (err) {
      setPricingError(
        err instanceof Error
          ? err.message
          : "Unable to load product pricing.",
      );
    } finally {
      setPricingLoading(false);
    }
  }

  useEffect(() => {
    if (!productId) return;

    async function loadProduct() {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const response = await fetch(
          `/api/workspace/products/${encodeURIComponent(productId)}`,
          {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store",
          },
        );

        const payload = (await response.json()) as ProductRecord & {
          success?: boolean;
          message?: string;
        };

        if (!response.ok || payload.success === false) {
          throw new Error(
            payload.message ?? "Unable to load product.",
          );
        }

        setForm({
          sku: payload.sku,
          slug: payload.slug,
          name: payload.name,
          description: payload.description ?? "",
          category: payload.category ?? "",
          origin: payload.origin ?? "",
          hsCode: payload.hsCode ?? "",
          defaultUnit: payload.defaultUnit,
          minOrderQty:
            payload.minOrderQty === null ||
            payload.minOrderQty === undefined
              ? ""
              : String(payload.minOrderQty),
          maxOrderQty:
            payload.maxOrderQty === null ||
            payload.maxOrderQty === undefined
              ? ""
              : String(payload.maxOrderQty),
          status: payload.status,
        });

        setFeaturedImage(payload.featuredImage ?? null);
        setSpecificationDocument(payload.specificationDocument ?? null);

        await loadPricing();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load product.",
        );
        setPricingLoading(false);
      } finally {
        setLoading(false);
      }
    }

    void loadProduct();
  }, [productId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/workspace/products/${encodeURIComponent(productId)}`,
        {
          method: "PUT",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            featuredImageId: featuredImage?.id ?? null,
            specificationDocumentId:
              specificationDocument?.id ?? null,
            minOrderQty:
              form.minOrderQty.trim() === ""
                ? null
                : Number(form.minOrderQty),
            maxOrderQty:
              form.maxOrderQty.trim() === ""
                ? null
                : Number(form.maxOrderQty),
          }),
        },
      );

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || payload.success === false) {
        throw new Error(
          payload.message ?? "Unable to update product.",
        );
      }

      setSuccess("Product updated successfully.");

      // Give the success state a moment to render before returning to
      // the shared Website Product catalogue.
      window.setTimeout(() => {
        router.push("/app/workspace/products");
        router.refresh();
      }, 500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update product.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePricingSubmit() {
    setPricingSaving(true);
    setPricingError("");

    try {
      const response = await fetch(`/api/workspace/products/${encodeURIComponent(productId)}/pricing`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          pricingType: pricingForm.pricingType,
          currency: pricingForm.currency.trim().toUpperCase(),
          price:
            pricingForm.price.trim() === ""
              ? null
              : Number(pricingForm.price),
          validFrom: pricingForm.validFrom || null,
          validTo: pricingForm.validTo || null,
          isActive: pricingForm.isActive,
          remarks: pricingForm.remarks.trim() || undefined,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: ProductPricingRecord;
        errors?: {
          fieldErrors?: Record<string, string[]>;
          formErrors?: string[];
        };
      };

      if (!response.ok || !payload.success) {
        const fieldErrors = payload.errors?.fieldErrors
          ? Object.entries(payload.errors.fieldErrors).flatMap(
              ([field, messages]) =>
                messages.map((message) => `${field}: ${message}`),
            )
          : [];

        const formErrors = payload.errors?.formErrors ?? [];
        const details = [...fieldErrors, ...formErrors];

        throw new Error(
          details.length
            ? `${payload.message ?? "Validation failed."}\n${details.join("\n")}`
            : payload.message ?? "Unable to create product pricing.",
        );
      }

      setPricingForm(emptyPricingForm);

      if (payload.data) {
        setPricing((current) => [
          payload.data!,
          ...current.map((item) =>
            payload.data!.isActive
              ? { ...item, isActive: false }
              : item,
          ),
        ]);
      } else {
        await loadPricing();
      }
    } catch (err) {
      setPricingError(
        err instanceof Error
          ? err.message
          : "Unable to create product pricing.",
      );
    } finally {
      setPricingSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-700" />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/app/workspace/products">
              <Button type="button" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900">
                  Edit Product
                </h1>
                <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  <Globe2 className="h-3.5 w-3.5" />
                  Website Product
                </span>
              </div>
              <p className="mt-2 text-slate-600">
                Update the shared Website product catalogue. Changes made here
                are reflected in the ROOTYM administration system.
              </p>
            </div>
          </div>

          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {error && (
          <Card
            hover={false}
            className="whitespace-pre-line border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {error}
          </Card>
        )}

        {success && (
          <Card
            hover={false}
            className="border border-green-200 bg-green-50 p-4 text-green-700"
          >
            {success}
          </Card>
        )}

        <Card
          hover={false}
          className="border border-green-200 bg-gradient-to-r from-green-50 via-white to-emerald-50 p-5"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100">
              <Globe2 className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
                Shared Website Data
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Customer Workspace ↔ ROOTYM Admin
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                This is the same Website Product record used by the Admin
                catalogue. No Workspace copy is created.
              </p>
            </div>
          </div>
        </Card>

        <Card hover={false} className="p-6">
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
                onChange={(event) => updateField("name", event.target.value)}
                className={inputClass}
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
                  updateField("sku", event.target.value.toUpperCase())
                }
                className={inputClass}
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
                    event.target.value.toLowerCase().replace(/\s+/g, "-"),
                  )
                }
                className={inputClass}
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
                  updateField("category", event.target.value)
                }
                className={inputClass}
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
                updateField("description", event.target.value)
              }
              className={inputClass}
            />
          </div>
        </Card>

        <Card hover={false} className="p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                  <ImageIcon className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Featured Image
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Use an image from this Website&apos;s Media Library.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setImageChooserOpen(true)}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Choose Image
            </Button>
          </div>

          {featuredImage ? (
            <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-white">
                {featuredImage.fileUrl ? (
                  <img
                    src={featuredImage.fileUrl}
                    alt={
                      featuredImage.altText ||
                      featuredImage.title ||
                      featuredImage.fileName
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-slate-400" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">
                  {mediaLabel(featuredImage)}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Website-scoped featured image.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setFeaturedImage(null)}
              >
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
              <p className="font-medium text-slate-700">
                No featured image selected.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Featured images are optional.
              </p>
            </div>
          )}
        </Card>

        <Card hover={false} className="p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <FileText className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Specification Document
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Select or upload a Website-scoped product specification.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setDocumentChooserOpen(true)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Choose Document
            </Button>
          </div>

          {specificationDocument ? (
            <div className="flex flex-col gap-4 rounded-2xl border border-blue-200 bg-blue-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">
                  {mediaLabel(specificationDocument)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Website-scoped specification file.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {specificationDocument.fileUrl && (
                  <a
                    href={specificationDocument.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    View Document
                  </a>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSpecificationDocument(null)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
              <p className="font-medium text-slate-700">
                No specification document selected.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Specification documents are optional.
              </p>
            </div>
          )}
        </Card>

        <Card hover={false} className="p-6">
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
                onChange={(event) => updateField("origin", event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                HS Code
              </label>
              <input
                type="text"
                value={form.hsCode}
                onChange={(event) => updateField("hsCode", event.target.value)}
                className={inputClass}
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
                  updateField("defaultUnit", event.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>
        </Card>

        <Card hover={false} className="p-6">
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
                  updateField("minOrderQty", event.target.value)
                }
                className={inputClass}
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
                  updateField("maxOrderQty", event.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>
        </Card>

        <Card hover={false} className="p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <CalendarDays className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Pricing
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage Website-specific prices and their validity periods.
                  </p>
                </div>
              </div>
            </div>

            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              {pricing.length} {pricing.length === 1 ? "price" : "prices"}
            </span>
          </div>

          {pricingError && (
            <div className="mb-6 whitespace-pre-line rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {pricingError}
            </div>
          )}

          {pricingLoading ? (
            <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
              <Loader2 className="h-5 w-5 animate-spin text-green-700" />
            </div>
          ) : pricing.length > 0 ? (
            <div className="mb-8 overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Currency
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Validity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {pricing.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">
                        {item.pricingType}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {item.currency}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900">
                        {item.price ?? "Price on Request"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {item.validFrom || item.validTo
                          ? `${formatDate(item.validFrom)} → ${formatDate(item.validTo)}`
                          : "Open-ended"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={
                            item.isActive
                              ? "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                              : "inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500"
                          }
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mb-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
              <p className="font-medium text-slate-700">
                No pricing records yet.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Add the first price below for this Website product.
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">Add Pricing</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Activating a new price makes it the active price for this product.
                </p>
              </div>

              <Button
                type="button"
                variant="primary"
                disabled={pricingSaving}
                onClick={() => void handlePricingSubmit()}
              >
                {pricingSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Pricing
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Pricing Type *
                </label>
                <select
                  value={pricingForm.pricingType}
                  onChange={(event) =>
                    setPricingForm((previous) => ({
                      ...previous,
                      pricingType: event.target.value as "FIXED" | "MARKET",
                    }))
                  }
                  className={inputClass}
                >
                  <option value="FIXED">Fixed</option>
                  <option value="MARKET">Market / Price on Request</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Currency *
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={pricingForm.currency}
                  onChange={(event) =>
                    setPricingForm((previous) => ({
                      ...previous,
                      currency: event.target.value.toUpperCase(),
                    }))
                  }
                  className={`${inputClass} uppercase`}
                  placeholder="USD"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Price{pricingForm.pricingType === "FIXED" ? " *" : ""}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pricingForm.price}
                  onChange={(event) =>
                    setPricingForm((previous) => ({
                      ...previous,
                      price: event.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder={
                    pricingForm.pricingType === "MARKET"
                      ? "Optional"
                      : "0.00"
                  }
                />
                <p className="mt-1 text-xs text-slate-500">
                  {pricingForm.pricingType === "MARKET"
                    ? "Optional — leave blank for Price on Request."
                    : "Required for Fixed pricing."}
                </p>
              </div>

              <div className="flex items-end pb-1">
                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={pricingForm.isActive}
                    onChange={(event) =>
                      setPricingForm((previous) => ({
                        ...previous,
                        isActive: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-green-700 focus:ring-green-600"
                  />
                  Active price
                </label>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Valid From
                </label>
                <input
                  type="date"
                  value={pricingForm.validFrom}
                  onChange={(event) =>
                    setPricingForm((previous) => ({
                      ...previous,
                      validFrom: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Valid To
                </label>
                <input
                  type="date"
                  value={pricingForm.validTo}
                  onChange={(event) =>
                    setPricingForm((previous) => ({
                      ...previous,
                      validTo: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Remarks
              </label>
              <textarea
                rows={3}
                value={pricingForm.remarks}
                onChange={(event) =>
                  setPricingForm((previous) => ({
                    ...previous,
                    remarks: event.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Optional pricing notes"
              />
            </div>
          </div>
        </Card>

        <Card hover={false} className="p-6">
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
                updateField("status", event.target.value as ProductStatus)
              }
              className={inputClass}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </Card>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <Link href="/app/workspace/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>

          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>

      <MediaChooser
        open={imageChooserOpen}
        title="Choose Featured Image"
        mediaType="IMAGE"
        selectedId={featuredImage?.id ?? null}
        accept="image/*"
        onClose={() => setImageChooserOpen(false)}
        onSelect={(media) => {
          setFeaturedImage(media);
          setImageChooserOpen(false);
        }}
      />

      <MediaChooser
        open={documentChooserOpen}
        title="Choose Specification Document"
        mediaType="DOCUMENT"
        selectedId={specificationDocument?.id ?? null}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,image/*"
        onClose={() => setDocumentChooserOpen(false)}
        onSelect={(media) => {
          setSpecificationDocument(media);
          setDocumentChooserOpen(false);
        }}
      />
    </>
  );
}
