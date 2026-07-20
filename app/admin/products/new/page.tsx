"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Save,
  Loader2,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import MediaUploader from "@/components/admin/media/MediaUploader";
import MediaPicker from "@/components/admin/media/MediaPicker";

type ProductStatus =
  | "PUBLISHED"
  | "DRAFT"
  | "ARCHIVED";

interface UploadedMedia {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  url: string;
  altText: string | null;
}

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

export default function NewProductPage() {
  const router = useRouter();

  const [form, setForm] =
    useState<ProductFormData>(initialForm);

  const [featuredImage, setFeaturedImage] =
    useState<UploadedMedia | null>(null);

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

      const response = await fetch(
        "/api/admin/products",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
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
            "Unable to create product."
        );
      }

      router.push("/admin/products");
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
              Create Product
            </h1>

            <p className="mt-2 text-slate-600">
              Add a new export product to your global
              catalogue.
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
              Upload or select the main product image.
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
            featuredImage?.id
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

// END OF FILE