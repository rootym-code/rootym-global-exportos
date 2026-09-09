/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author      : Prem Singh
 * Module      : Product Management
 * Feature     : Website Product Editing
 * File        : app/admin/products/[id]/edit/page.tsx
 * Purpose     : Updates a Website-owned product and allows
 *               selection of a Website-scoped featured image.
 * ============================================================
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Save,
  Globe2,
  Plus,
  CalendarDays,
  FileText,
  Upload,
  X,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import MediaPicker from "@/components/admin/media/MediaPicker";
import MediaUploader from "@/components/admin/media/MediaUploader";

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

interface ProductResponse {
  success: boolean;
  message?: string;
  data: {
    id: string;
    sku: string;
    slug: string;
    name: string;
    description: string | null;
    category: string | null;
    origin: string | null;
    hsCode: string | null;
    defaultUnit: string;
    minOrderQty: number | null;
    maxOrderQty: number | null;
    status: ProductStatus;
    featuredImage: MediaDto | null;
    specificationDocument: MediaDto | null;
  };
}


interface ProductPricingRecord {
  id: string;
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

interface ProductPricingFormData {
  pricingType: string;
  currency: string;
  price: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  remarks: string;
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

const emptyPricingForm: ProductPricingFormData = {
  pricingType: "FIXED",
  currency: "USD",
  price: "",
  validFrom: "",
  validTo: "",
  isActive: true,
  remarks: "",
};

const CURRENT_WEBSITE_NAME = "ROOTYM";
const CURRENT_WEBSITE_SLUG = "rootym-agro";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const productId = params.id as string;

  const [form, setForm] =
    useState<ProductFormData>(emptyForm);

  const [featuredImage, setFeaturedImage] =
    useState<MediaDto | null>(null);

  const [specificationDocument, setSpecificationDocument] =
    useState<MediaDto | null>(null);

  const [pickerOpen, setPickerOpen] =
    useState(false);

  const [specificationPickerOpen, setSpecificationPickerOpen] =
    useState(false);

  const specificationFileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [specificationUploading, setSpecificationUploading] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [pricing, setPricing] =
    useState<ProductPricingRecord[]>([]);

  const [pricingForm, setPricingForm] =
    useState<ProductPricingFormData>(emptyPricingForm);

  const [pricingLoading, setPricingLoading] =
    useState(true);

  const [pricingSaving, setPricingSaving] =
    useState(false);

  const [pricingError, setPricingError] =
    useState("");

  const updateField = (
    field: keyof ProductFormData,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/admin/products/${productId}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const result: ProductResponse =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ??
              "Unable to load product."
          );
        }

        setForm({
          sku: result.data.sku,
          slug: result.data.slug,
          name: result.data.name,
          description:
            result.data.description ?? "",
          category:
            result.data.category ?? "",
          origin:
            result.data.origin ?? "",
          hsCode:
            result.data.hsCode ?? "",
          defaultUnit:
            result.data.defaultUnit,
          minOrderQty:
            result.data.minOrderQty?.toString() ??
            "",
          maxOrderQty:
            result.data.maxOrderQty?.toString() ??
            "",
          status:
            result.data.status,
        });

        setFeaturedImage(
          result.data.featuredImage
        );

        setSpecificationDocument(
          result.data.specificationDocument
        );

        try {
          setPricingLoading(true);
          setPricingError("");

          const pricingResponse = await fetch(
            `/api/admin/product-pricing?productId=${encodeURIComponent(productId)}`,
            {
              credentials: "include",
              cache: "no-store",
            }
          );

          const pricingResult: ProductPricingResponse =
            await pricingResponse.json();

          if (
            !pricingResponse.ok ||
            !pricingResult.success
          ) {
            throw new Error(
              pricingResult.message ??
                "Unable to load product pricing."
            );
          }

          setPricing(pricingResult.data ?? []);
        } catch (pricingErr) {
          setPricingError(
            pricingErr instanceof Error
              ? pricingErr.message
              : "Unable to load product pricing."
          );
        } finally {
          setPricingLoading(false);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      void loadProduct();
    }
  }, [productId]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/products/${productId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...form,

            /*
             * The selected media ID is sent only as
             * the Product featured image reference.
             *
             * Website ownership is enforced server-side.
             */
            featuredImageId:
              featuredImage?.id ?? null,

            minOrderQty:
              form.minOrderQty
                ? Number(form.minOrderQty)
                : null,

            maxOrderQty:
              form.maxOrderQty
                ? Number(form.maxOrderQty)
                : null,

            specificationDocumentId:
              specificationDocument?.id ?? null,
          }),
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
            "Unable to update product."
        );
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSpecificationUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ]);

    if (!allowedTypes.has(file.type)) {
      setError(
        "Specification must be a JPG, PNG, WEBP, GIF image or PDF file."
      );

      event.target.value = "";
      return;
    }

    if (file.size <= 0) {
      setError("The selected specification file is empty.");
      event.target.value = "";
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("The specification file must be 20 MB or smaller.");
      event.target.value = "";
      return;
    }

    try {
      setSpecificationUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products/specifications");
      formData.append(
        "title",
        file.name.replace(/\.[^/.]+$/, "").trim()
      );

      const response = await fetch("/api/admin/cms/media", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(
          result.message ?? "Unable to upload specification file."
        );
      }

      const uploadedMedia = result.data as MediaDto;

      if (
        uploadedMedia.mediaType !== "IMAGE" &&
        uploadedMedia.mediaType !== "DOCUMENT"
      ) {
        throw new Error(
          "The uploaded file is not a supported specification type."
        );
      }

      setSpecificationDocument(uploadedMedia);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload specification file."
      );
    } finally {
      setSpecificationUploading(false);

      if (specificationFileInputRef.current) {
        specificationFileInputRef.current.value = "";
      }
    }
  }

  async function handlePricingSubmit() {
    setPricingSaving(true);
    setPricingError("");

    try {
      const response = await fetch(
        "/api/admin/product-pricing",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            pricingType: pricingForm.pricingType,
            currency: pricingForm.currency
              .trim()
              .toUpperCase(),
            /*
             * Normalize the optional HTML number input before sending it
             * to the API. A blank Market price must remain null rather
             * than becoming 0 through Number("").
             */
            price:
              pricingForm.price.trim() === ""
                ? null
                : Number(pricingForm.price),
            validFrom: pricingForm.validFrom || null,
            validTo: pricingForm.validTo || null,
            isActive: pricingForm.isActive,
            /*
             * Remarks are optional in the validation schema. Do not send
             * null for an empty field because an optional string accepts
             * undefined/omitted values, not null.
             */
            remarks:
              pricingForm.remarks.trim() || undefined,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        /*
         * Surface the server-side validation details instead of only
         * showing the generic "Validation failed." message. The API
         * returns Zod's flattened fieldErrors/formErrors payload.
         */
        const fieldErrors =
          result?.errors?.fieldErrors &&
          typeof result.errors.fieldErrors === "object"
            ? Object.entries(result.errors.fieldErrors)
                .flatMap(([field, messages]) => {
                  if (!Array.isArray(messages)) {
                    return [];
                  }

                  return messages.map(
                    (message) => `${field}: ${String(message)}`
                  );
                })
            : [];

        const formErrors =
          Array.isArray(result?.errors?.formErrors)
            ? result.errors.formErrors.map(
                (message: unknown) => String(message)
              )
            : [];

        const validationDetails = [
          ...fieldErrors,
          ...formErrors,
        ];

        const message = result.message ??
          "Unable to create product pricing.";

        throw new Error(
          validationDetails.length > 0
            ? `${message}\n${validationDetails.join("\n")}`
            : message
        );
      }

      setPricingForm(emptyPricingForm);
      setPricing((current) => [
        result.data,
        ...current.map((item) =>
          result.data?.isActive
            ? { ...item, isActive: false }
            : item
        ),
      ]);
    } catch (err) {
      setPricingError(
        err instanceof Error
          ? err.message
          : "Unable to create product pricing."
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
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline">
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
                Website: {CURRENT_WEBSITE_NAME}
              </span>
            </div>

            <p className="mt-2 text-slate-600">
              Update the product information for this
              Website catalogue.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={saving}
        >
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
          className="border border-red-200 bg-red-50 p-4 text-red-700"
        >
          {error}
        </Card>
      )}

      {/* Website Context */}

      <Card
        hover={false}
        className="border border-green-200 bg-gradient-to-r from-green-50 via-white to-emerald-50 p-5"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100">
              <Globe2 className="h-5 w-5 text-green-700" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
                Current Website
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                {CURRENT_WEBSITE_NAME}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Product catalogue for{" "}
                <span className="font-medium text-slate-700">
                  {CURRENT_WEBSITE_SLUG}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-green-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            Website-owned product
          </div>
        </div>
      </Card>

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
              onChange={(e) =>
                updateField(
                  "name",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
              onChange={(e) =>
                updateField(
                  "sku",
                  e.target.value.toUpperCase()
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
              onChange={(e) =>
                updateField(
                  "slug",
                  e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>

            <input
              type="text"
              value={form.category}
              onChange={(e) =>
                updateField(
                  "category",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
            onChange={(e) =>
              updateField(
                "description",
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>
      </Card>

      {/* Featured Image */}

      <Card
        hover={false}
        className="p-6"
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Featured Image
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload a new image or choose an existing
              image from this Website&apos;s Media Library.
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

        <MediaUploader
          value={featuredImage}
          onChange={setFeaturedImage}
          onRemove={() =>
            setFeaturedImage(null)
          }
        />

        <MediaPicker
          open={pickerOpen}
          selectedId={
            featuredImage?.id ?? null
          }
          onClose={() =>
            setPickerOpen(false)
          }
          onSelect={(media) => {
            setFeaturedImage(media);
            setPickerOpen(false);
          }}
        />
      </Card>

      {/* Specification Document */}

      <Card
        hover={false}
        className="p-6"
      >
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
                  Upload a specification document or choose an existing
                  document from this Website&apos;s Media Library.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setSpecificationPickerOpen(true)
            }
          >
            Media Library
          </Button>
        </div>

        {specificationDocument ? (
          <div className="mb-4 flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                {specificationDocument.title ||
                  specificationDocument.fileName}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Website-scoped document selected for this product.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {specificationDocument.fileUrl && (
                <a
                  href={specificationDocument.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  View File
                </a>
              )}

              <button
                type="button"
                onClick={() => setSpecificationDocument(null)}
                className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 text-center">
            <p className="font-medium text-slate-700">
              No specification document selected.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Specification documents are optional.
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <FileText className="h-6 w-6 text-blue-700" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-900">
              Upload Specification
            </h3>

            <p className="mt-1 max-w-lg text-sm text-slate-500">
              Upload a product specification as an image or PDF. Maximum file
              size is 20 MB.
            </p>

            <input
              ref={specificationFileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,image/jpeg,image/png,image/webp,image/gif,application/pdf"
              onChange={handleSpecificationUpload}
              className="hidden"
            />

            <Button
              type="button"
              variant="primary"
              disabled={specificationUploading}
              onClick={() =>
                specificationFileInputRef.current?.click()
              }
              className="mt-5"
            >
              {specificationUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image / PDF
                </>
              )}
            </Button>

            <p className="mt-3 text-xs text-slate-400">
              Supported: JPG, PNG, WEBP, GIF, PDF
            </p>
          </div>
        </div>

        <MediaPicker
          open={specificationPickerOpen}
          selectedId={specificationDocument?.id ?? null}
          mediaType="DOCUMENT_OR_IMAGE"
          onClose={() =>
            setSpecificationPickerOpen(false)
          }
          onSelect={(media) => {
            if (
              media.mediaType !== "DOCUMENT" &&
              media.mediaType !== "IMAGE"
            ) {
              setError(
                "Please select an image or document for the product specification."
              );
              return;
            }

            setError("");
            setSpecificationDocument(media);
            setSpecificationPickerOpen(false);
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
              onChange={(e) =>
                updateField(
                  "origin",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              HS Code
            </label>

            <input
              type="text"
              value={form.hsCode}
              onChange={(e) =>
                updateField(
                  "hsCode",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Default Unit
            </label>

            <input
              type="text"
              value={form.defaultUnit}
              onChange={(e) =>
                updateField(
                  "defaultUnit",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
              onChange={(e) =>
                updateField(
                  "minOrderQty",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
              onChange={(e) =>
                updateField(
                  "maxOrderQty",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </Card>

      {/* Pricing */}

      <Card
        hover={false}
        className="p-6"
      >
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
                      {item.price}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {item.validFrom || item.validTo
                        ? `${item.validFrom ?? "Open"} → ${item.validTo ?? "Open"}`
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

        <div
          className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-900">
                Add Pricing
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Activating a new price will make it the active price for this product.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              disabled={pricingSaving}
              onClick={() => {
                void handlePricingSubmit();
              }}
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
                onChange={(e) =>
                  setPricingForm((prev) => ({
                    ...prev,
                    pricingType: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
                onChange={(e) =>
                  setPricingForm((prev) => ({
                    ...prev,
                    currency: e.target.value.toUpperCase(),
                  }))
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 uppercase outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                placeholder="USD"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Price
                {pricingForm.pricingType === "FIXED" ? " *" : ""}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={pricingForm.price}
                onChange={(e) =>
                  setPricingForm((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
                  onChange={(e) =>
                    setPricingForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
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
                onChange={(e) =>
                  setPricingForm((prev) => ({
                    ...prev,
                    validFrom: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Valid To
              </label>
              <input
                type="date"
                value={pricingForm.validTo}
                onChange={(e) =>
                  setPricingForm((prev) => ({
                    ...prev,
                    validTo: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
              onChange={(e) =>
                setPricingForm((prev) => ({
                  ...prev,
                  remarks: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="Optional pricing notes"
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
            onChange={(e) =>
              updateField(
                "status",
                e.target.value as ProductStatus
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

      {/* Footer Actions */}

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <Link href="/admin/products">
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
          disabled={saving}
        >
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
  );
}