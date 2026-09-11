/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Customer Workspace Product catalogue
 *          using the shared Website-scoped Product data.
 * ============================================================
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ChevronLeft,
  ChevronRight,
  Filter,
  ImageIcon,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
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

/**
 * Workspace Product list API returns the catalogue directly:
 *
 * {
 *   items: [...],
 *   pagination: {...}
 * }
 *
 * Error responses may additionally contain success/message.
 */
interface ProductsResponse {
  items: Product[];
  pagination: Pagination;
  success?: boolean;
  message?: string;
}

const statusOptions = [
  {
    label: "All Status",
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

function getStatusLabel(status: ProductStatus) {
  switch (status) {
    case "PUBLISHED":
      return "Published";

    case "ARCHIVED":
      return "Archived";

    case "DRAFT":
    default:
      return "Draft";
  }
}

function getStatusClassName(status: ProductStatus) {
  switch (status) {
    case "PUBLISHED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";

    case "ARCHIVED":
      return "bg-slate-100 text-slate-600 ring-slate-200";

    case "DRAFT":
    default:
      return "bg-amber-50 text-amber-700 ring-amber-100";
  }
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function WorkspaceProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [deleteLoading, setDeleteLoading] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

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
      params.set("search", search.trim());
    }

    if (status !== "ALL") {
      params.set("status", status);
    }

    params.set(
      "page",
      String(pagination.page),
    );

    params.set(
      "pageSize",
      String(pagination.pageSize),
    );

    return params.toString();
  }, [
    search,
    status,
    pagination.page,
    pagination.pageSize,
  ]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/workspace/products?${queryString}`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      const result =
        (await response.json()) as ProductsResponse;

      /*
       * IMPORTANT:
       * The successful Workspace Product API response is:
       *
       * {
       *   items: [...],
       *   pagination: {...}
       * }
       *
       * It does not contain success: true.
       *
       * Therefore HTTP status is the primary success check.
       */
      if (!response.ok) {
        throw new Error(
          result.message ??
            "Unable to load products.",
        );
      }

      setProducts(result.items ?? []);

      setPagination(
        result.pagination ?? {
          page: 1,
          pageSize: 20,
          total: 0,
          totalPages: 0,
        },
      );
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load products.",
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  function handleSearchChange(
    value: string,
  ) {
    setSearch(value);

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  }

  function handleStatusChange(
    value: string,
  ) {
    setStatus(value);

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  }

  function goToPage(page: number) {
    if (
      page < 1 ||
      page > pagination.totalPages
    ) {
      return;
    }

    setPagination((previous) => ({
      ...previous,
      page,
    }));
  }

  async function handleDelete(
    product: Product,
  ) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(product.id);
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/workspace/products/${product.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        result.success === false
      ) {
        throw new Error(
          result.message ??
            "Unable to delete product.",
        );
      }

      setMessage(
        "Product deleted successfully.",
      );

      await fetchProducts();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete product.",
      );
    } finally {
      setDeleteLoading(null);
    }
  }

  const hasPreviousPage =
    pagination.page > 1;

  const hasNextPage =
    pagination.page <
    pagination.totalPages;

  return (
    <div className="space-y-8">
      {/* ========================================================
          HEADER
          ======================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <Package className="h-5 w-5 text-emerald-700" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Business
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Products
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Manage the products published through your
            Website. Product changes made here are shared
            with the ROOTYM administration system.
          </p>
        </div>

        <Link href="/app/workspace/products/new">
          <Button variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* ========================================================
          CONTEXT
          ======================================================== */}

      <Card
        hover={false}
        className="border border-emerald-100 bg-emerald-50/60 p-5"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-800">
              Website Product Catalogue
            </p>

            <p className="mt-1 text-sm text-emerald-700/80">
              Products are shared Website data. There is
              no separate Customer Workspace product copy.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
            Shared data
          </span>
        </div>
      </Card>

      {/* ========================================================
          FILTERS
          ======================================================== */}

      <Card
        hover={false}
        className="p-5"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                handleSearchChange(
                  event.target.value,
                )
              }
              placeholder="Search products by name, SKU or slug..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5">
            <Filter className="h-4 w-4 text-slate-500" />

            <select
              value={status}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value,
                )
              }
              className="bg-transparent text-sm text-slate-700 outline-none"
            >
              {statusOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
      </Card>

      {/* ========================================================
          FEEDBACK
          ======================================================== */}

      {message && (
        <Card
          hover={false}
          className="border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700"
        >
          {message}
        </Card>
      )}

      {error && (
        <Card
          hover={false}
          className="border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
        >
          {error}
        </Card>
      )}

      {/* ========================================================
          PRODUCT TABLE
          ======================================================== */}

      <Card
        hover={false}
        className="overflow-hidden"
      >
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Product Catalogue
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {pagination.total} product
                {pagination.total === 1
                  ? ""
                  : "s"} found
              </p>
            </div>

            {pagination.totalPages > 0 && (
              <p className="text-sm text-slate-500">
                Page {pagination.page} of{" "}
                {pagination.totalPages}
              </p>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                    className="px-6 py-16 text-center text-sm text-slate-500"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : products.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-20"
                  >
                    <div className="mx-auto flex max-w-lg flex-col items-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                        <Package className="h-8 w-8 text-emerald-700" />
                      </div>

                      <h3 className="mt-5 text-xl font-semibold text-slate-900">
                        No products found
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {search.trim()
                          ? "Try a different search term."
                          : "Your Website product catalogue is currently empty."}
                      </p>

                      {!search.trim() && (
                        <Link
                          href="/app/workspace/products/new"
                          className="mt-6"
                        >
                          <Button variant="primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                products.map(
                  (product) => (
                    <tr
                      key={product.id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex min-w-[280px] items-center gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                            {product.featuredImage ? (
                              <Image
                                src={
                                  product
                                    .featuredImage
                                    .fileUrl
                                }
                                alt={
                                  product
                                    .featuredImage
                                    .altText ??
                                  product.name
                                }
                                width={56}
                                height={56}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-slate-400" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                              {product.name}
                            </p>

                            <p className="mt-0.5 text-sm text-slate-500">
                              {product.sku}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {product.category ??
                          "-"}
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusClassName(
                            product.status,
                          )}`}
                        >
                          {getStatusLabel(
                            product.status,
                          )}
                        </span>
                      </td>

                      {/* Updated */}
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {formatDate(
                          product.updatedAt,
                        )}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/app/workspace/products/${product.id}/edit`}
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
                              deleteLoading ===
                              product.id
                            }
                            onClick={() =>
                              void handleDelete(
                                product,
                              )
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            {deleteLoading ===
                            product.id ? (
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
                  ),
                )
              )}
            </tbody>
          </table>
        </div>

        {/* ======================================================
            PAGINATION
            ====================================================== */}

        {!loading &&
          pagination.totalPages > 1 && (
            <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                {Math.min(
                  (pagination.page - 1) *
                    pagination.pageSize +
                    1,
                  pagination.total,
                )}{" "}
                to{" "}
                {Math.min(
                  pagination.page *
                    pagination.pageSize,
                  pagination.total,
                )}{" "}
                of {pagination.total}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    !hasPreviousPage
                  }
                  onClick={() =>
                    goToPage(
                      pagination.page - 1,
                    )
                  }
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>

                <span className="px-2 text-sm font-medium text-slate-600">
                  {pagination.page} /{" "}
                  {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasNextPage}
                  onClick={() =>
                    goToPage(
                      pagination.page + 1,
                    )
                  }
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
      </Card>
    </div>
  );
}