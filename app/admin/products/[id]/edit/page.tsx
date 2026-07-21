"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Loader2,
  Save,
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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const productId = params.id as string;

  const [form, setForm] =
    useState<ProductFormData>(emptyForm);

  const [featuredImage, setFeaturedImage] =
    useState<MediaDto | null>(null);

  const [pickerOpen, setPickerOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
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
      loadProduct();
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
            <h1 className="text-3xl font-bold text-slate-900">
              Edit Product
            </h1>

            <p className="mt-2 text-slate-600">
              Update your export product information.
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Featured Image
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload a new image or choose an existing
              image from the Media Library.
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
      </Card>

      <MediaPicker
        open={pickerOpen}
        selectedId={featuredImage?.id}
        onClose={() =>
          setPickerOpen(false)
        }
        onSelect={(media) => {
          setFeaturedImage(media);
        }}
      />
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

// END OF FILE