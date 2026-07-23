"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Plus,
  Search,
  Package,
  Filter,
  Download,
  Pencil,
  Trash2,
  ImageIcon,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type ProductStatus =
  | "PUBLISHED"
  | "DRAFT"
  | "ARCHIVED";

interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string | null;
  status: ProductStatus;
  updatedAt: string;

  featuredImage: {
    id: string;
    fileUrl: string;
    altText: string | null;
  } | null;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface ProductsResponse {
  success: boolean;
  items: Product[];
  pagination: Pagination;
}

const statusOptions = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "Published",
    value: "PUBLISHED",
  },
  {
    label: "Draft",
    value: "DRAFT",
  },
  {
    label: "Archived",
    value: "ARCHIVED",
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [deleteLoading, setDeleteLoading] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("ALL");

  const [pagination, setPagination] =
    useState<Pagination>({
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0,
    });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set(
        "search",
        search.trim()
      );
    }

    if (status !== "ALL") {
      params.set(
        "status",
        status
      );
    }

    params.set(
      "page",
      String(pagination.page)
    );

    params.set(
      "pageSize",
      String(pagination.pageSize)
    );

    return params.toString();
  }, [
    search,
    status,
    pagination.page,
    pagination.pageSize,
  ]);

  const fetchProducts =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/admin/products?${queryString}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const result: ProductsResponse =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            "Unable to load products."
          );
        }

        setProducts(result.items);

        setPagination(
          result.pagination
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    }, [queryString]);

  async function handleDelete(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(id);
      setError("");
      setMessage("");

      const response =
        await fetch(
          `/api/admin/products/${id}`,
          {
            method: "DELETE",
            credentials: "include",
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
            "Unable to delete product."
        );
      }

      setMessage(
        "Product deleted successfully."
      );

      await fetchProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete product."
      );
    } finally {
      setDeleteLoading(null);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="space-y-8">
      {/* Header */}
            {/* Header */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Product Management
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your export product catalogue,
            visibility, and product information for
            global buyers.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Link href="/admin/products/new">
            <Button variant="primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>


      {/* Filters */}

      <Card
        hover={false}
        className="p-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2">
              <Filter className="h-4 w-4 text-slate-500" />

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="bg-transparent text-sm outline-none"
              >
                {statusOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>


      {message && (
        <Card
          hover={false}
          className="border border-green-200 bg-green-50 p-4 text-green-700"
        >
          {message}
        </Card>
      )}


      {/* Product Table */}

      <Card
        hover={false}
        className="overflow-hidden"
      >
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-900">
            Products
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {pagination.total} product(s) found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-sm font-semibold text-slate-600">
                <th className="px-6 py-4">
                  Product
                </th>

                <th className="px-6 py-4">
                  Category
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Updated
                </th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-slate-500"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-20"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="rounded-full bg-green-100 p-5">
                        <Package className="h-10 w-10 text-green-700" />
                      </div>

                      <h3 className="mt-6 text-2xl font-semibold text-slate-900">
                        No Products Available
                      </h3>

                      <p className="mt-3 max-w-xl text-slate-500">
                        Your export product catalogue is
                        currently empty. Add your first
                        product to begin building a
                        professional digital export catalog.
                      </p>

                      <div className="mt-8">
                        <Link href="/admin/products/new">
                          <Button variant="primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add First Product
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          {product.featuredImage ? (
                            <Image
                              src={
                                product.featuredImage.fileUrl
                              }
                              alt={
                                product.featuredImage.altText ??
                                product.name
                              }
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-slate-400" />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {product.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {product.sku}
                          </p>

                          <p className="text-xs text-slate-400">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {product.category ?? "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          product.status === "PUBLISHED"
                            ? "bg-green-100 text-green-700"
                            : product.status === "DRAFT"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(
                        product.updatedAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={
                            deleteLoading === product.id
                          }
                          onClick={() =>
                            handleDelete(product.id)
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          {deleteLoading === product.id ? (
                            "Deleting..."
                          ) : (
                            <>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>


      {/* Future Features */}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card
          hover={false}
          className="p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900">
            Product Categories
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Organize export products into reusable
            categories for easier management and buyer
            discovery.
          </p>
        </Card>

        <Card
          hover={false}
          className="p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900">
            SEO & Visibility
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Manage metadata, featured products, search
            optimization, and international visibility.
          </p>
        </Card>

        <Card
          hover={false}
          className="p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900">
            Bulk Operations
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Future releases will support imports,
            exports, bulk publishing, duplication,
            and advanced product management.
          </p>
        </Card>
      </div>
    </div>
  );
}

 