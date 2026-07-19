  /**
   * ============================================================
   * ROOTYM Global Export Platform
   * ============================================================
   * Module      : CMS
   * Feature     : Media Library
   * File        : app/admin/cms/media/page.tsx
   * Purpose     : Media Library Management
   * Sprint      : Sprint 10
   * ============================================================
   */

  "use client";

  import { useMemo, useRef, useState, useEffect, useCallback } from "react";
  import Image from "next/image";

  import { MediaType } from "@/lib/generated/prisma";

  import {
    AlertCircle,
    File,
    FileText,
    Filter,
    FolderOpen,
    ImageIcon,
    Loader2,
    Music,
    RefreshCw,
    Search,
    Upload,
    Video,
  } from "lucide-react";

  /* ============================================================
    Types
  ============================================================ */

  interface MediaDto {
    id: string;

    fileName: string;
    storedFileName: string;
    fileUrl: string;

    storageProvider: string | null;
    mimeType: string | null;

    mediaType: MediaType;

    fileSize: bigint | number | null;

    width: number | null;
    height: number | null;

    title: string | null;
    altText: string | null;
    description: string | null;

    folder: string | null;

    uploadedById: string | null;

    isDeleted: boolean;

    createdAt: string;
    updatedAt: string;
  }

  interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }

  interface MediaListResponse {
    success: boolean;
    message?: string;

    data: MediaDto[];

    pagination: Pagination;
  }

  /* ============================================================
    Constants
  ============================================================ */

  const PAGE_SIZE = 20;

  const MEDIA_TYPES = [
    "ALL",
    "IMAGE",
    "VIDEO",
    "DOCUMENT",
    "AUDIO",
    "OTHER",
  ] as const;

  type MediaFilter = (typeof MEDIA_TYPES)[number];

  /* ============================================================
    Helpers
  ============================================================ */

  function formatFileSize(
    bytes?: bigint | number | null
  ): string {
    if (bytes === null || bytes === undefined) {
      return "-";
    }

    let value =
      typeof bytes === "bigint"
        ? Number(bytes)
        : bytes;

    if (Number.isNaN(value)) {
      return "-";
    }

    const units = [
      "B",
      "KB",
      "MB",
      "GB",
      "TB",
    ];

    let unit = 0;

    while (
      value >= 1024 &&
      unit < units.length - 1
    ) {
      value /= 1024;
      unit++;
    }

    return `${value.toFixed(
      unit === 0 ? 0 : 1
    )} ${units[unit]}`;
  }

  function getMediaIcon(type: MediaType) {
    switch (type) {
      case MediaType.IMAGE:
        return ImageIcon;

      case MediaType.VIDEO:
        return Video;

      case MediaType.DOCUMENT:
        return FileText;

      case MediaType.AUDIO:
        return Music;

      default:
        return File;
    }
  }

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }

  function imageAlt(media: MediaDto) {
    return (
      media.altText ??
      media.title ??
      media.fileName
    );
  }

  function hasImagePreview(media: MediaDto) {
    return (
      media.mediaType === MediaType.IMAGE &&
      media.fileUrl.length > 0
    );
  }
  /* ============================================================
    Component
  ============================================================ */

  export default function MediaLibraryPage() {
    /* ============================================================
      State
    ============================================================ */

    const [items, setItems] = useState<MediaDto[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [page, setPage] = useState(1);

    const [pagination, setPagination] =
      useState<Pagination>({
        page: 1,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 1,
      });

    /* ============================================================
      Filters
    ============================================================ */

    const [searchInput, setSearchInput] =
      useState("");

    const [search, setSearch] =
      useState("");

    const [folder, setFolder] =
      useState("");

    const [mediaType, setMediaType] =
      useState<MediaFilter>("ALL");

    const debounceTimer =
      useRef<ReturnType<typeof setTimeout> | null>(
        null
      );

    /* ============================================================
      Debounced Search
    ============================================================ */

    useEffect(() => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        setPage(1);
        setSearch(searchInput.trim());
      }, 500);

      return () => {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
      };
    }, [searchInput]);

    /* ============================================================
      Load Media
    ============================================================ */

    const loadMedia = useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        params.set("page", page.toString());
        params.set("limit", PAGE_SIZE.toString());

        if (search) {
          params.set("search", search);
        }

        if (folder.trim()) {
          params.set(
            "folder",
            folder.trim()
          );
        }

        if (mediaType !== "ALL") {
          params.set(
            "mediaType",
            mediaType
          );
        }

        const response = await fetch(
          `/api/admin/cms/media?${params.toString()}`,
          {
            cache: "no-store",
          }
        );

        const result: MediaListResponse =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ??
              "Unable to load media."
          );
        }

        setItems(result.data);

        setPagination(result.pagination);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    }, [
      page,
      search,
      folder,
      mediaType,
    ]);

    useEffect(() => {
      loadMedia();
    }, [loadMedia]);

    /* ============================================================
      Dashboard Statistics
    ============================================================ */

    const statistics = useMemo(() => {
      const images = items.filter(
        (item) =>
          item.mediaType ===
          MediaType.IMAGE
      ).length;

      const documents = items.filter(
        (item) =>
          item.mediaType ===
          MediaType.DOCUMENT
      ).length;

      const videos = items.filter(
        (item) =>
          item.mediaType ===
          MediaType.VIDEO
      ).length;

      const folders = new Set(
        items
          .map((item) => item.folder)
          .filter(
            (
              folder
            ): folder is string =>
              Boolean(folder)
          )
      ).size;

      return {
        total: pagination.total,
        images,
        documents,
        videos,
        folders,
      };
    }, [items, pagination.total]);

    /* ============================================================
      Render
    ============================================================ */

    return (
      <div className="space-y-8">
            {/* ============================================================
            Header
        ============================================================ */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Media Library
            </h1>

            <p className="mt-2 text-slate-500">
              Browse and manage all CMS media assets including images,
              documents, videos and audio files.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadMedia}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

            <button
              type="button"
              disabled
              title="Upload workflow will be added in the next CMS task."
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-medium text-white opacity-70"
            >
              <Upload className="h-4 w-4" />
              Upload Media
            </button>
          </div>
        </div>

        {/* ============================================================
            Statistics
        ============================================================ */}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Total Files
              </span>

              <File className="h-6 w-6 text-green-700" />
            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {statistics.total}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Available in the media library
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Images
              </span>

              <ImageIcon className="h-6 w-6 text-blue-600" />
            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {statistics.images}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              On current page
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Documents
              </span>

              <FileText className="h-6 w-6 text-amber-600" />
            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {statistics.documents}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              On current page
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Folders
              </span>

              <FolderOpen className="h-6 w-6 text-purple-600" />
            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
              {statistics.folders}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Visible folders
            </p>
          </div>
        </div>

        {/* ============================================================
            Filters
        ============================================================ */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-12">
            {/* Search */}

            <div className="relative lg:col-span-5">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(event.target.value)
                }
                placeholder="Search filename, title or alt text..."
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-green-700"
              />
            </div>

            {/* Folder */}

            <div className="relative lg:col-span-3">
              <FolderOpen className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={folder}
                onChange={(event) => {
                  setPage(1);
                  setFolder(event.target.value);
                }}
                placeholder="Folder"
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-green-700"
              />
            </div>

            {/* Media Type */}

            <div className="relative lg:col-span-3">
              <Filter className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                value={mediaType}
                onChange={(event) => {
                  setPage(1);
                  setMediaType(
                    event.target.value as MediaFilter
                  );
                }}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-green-700"
              >
                {MEDIA_TYPES.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Apply */}

            <button
              type="button"
              onClick={loadMedia}
              disabled={loading}
              className="rounded-xl bg-green-700 px-5 py-3 font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Apply
            </button>
          </div>
        </div>

        {/* ============================================================
            Error
        ============================================================ */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

              <div>
                <h3 className="font-semibold text-red-700">
                  Unable to load media library
                </h3>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
              {/* ============================================================
            Loading State
        ============================================================ */}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-56 animate-pulse bg-slate-200" />

                <div className="space-y-4 p-5">
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((__, i) => (
                      <div key={i}>
                        <div className="mb-2 h-3 w-16 animate-pulse rounded bg-slate-100" />
                        <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          /* ============================================================
              Empty State
          ============================================================ */

          <div className="rounded-2xl border border-slate-200 bg-white py-24 text-center shadow-sm">
            <ImageIcon className="mx-auto h-16 w-16 text-slate-300" />

            <h2 className="mt-6 text-2xl font-semibold text-slate-800">
              No Media Found
            </h2>

            <p className="mt-2 text-slate-500">
              No media files matched your current filters.
            </p>
          </div>
        ) : (
          /* ============================================================
              Media Grid
          ============================================================ */

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {items.map((item) => {
              const Icon = getMediaIcon(item.mediaType);

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* ====================================================
                      Preview
                  ==================================================== */}

                  <div className="relative flex h-56 items-center justify-center overflow-hidden bg-slate-100">
                    {hasImagePreview(item) ? (
                      <Image
                        src={item.fileUrl}
                        alt={imageAlt(item)}
                        fill
                        sizes="400px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Icon className="h-16 w-16 text-slate-400" />

                        <span className="rounded-full bg-slate-200 px-4 py-1 text-xs font-semibold tracking-wide text-slate-700">
                          {item.mediaType}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ====================================================
                      Content
                  ==================================================== */}

                  <div className="space-y-4 p-5">
                    <div>
                      <h3
                        className="truncate text-lg font-semibold text-slate-900"
                        title={item.title ?? item.fileName}
                      >
                        {item.title ?? item.fileName}
                      </h3>

                      <p
                        className="mt-1 truncate text-sm text-slate-500"
                        title={item.fileName}
                      >
                        {item.fileName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">
                          Type
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                          {item.mediaType}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400">
                          Size
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                          {formatFileSize(item.fileSize)}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400">
                          Folder
                        </p>

                        <p
                          className="mt-1 truncate font-medium text-slate-700"
                          title={item.folder ?? "-"}
                        >
                          {item.folder ?? "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400">
                          Storage
                        </p>

                        <p
                          className="mt-1 truncate font-medium text-slate-700"
                          title={item.storageProvider ?? "-"}
                        >
                          {item.storageProvider ?? "-"}
                        </p>
                      </div>
                    </div>

                    {item.description && (
                      <p
                        className="line-clamp-2 text-sm text-slate-600"
                        title={item.description}
                      >
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs text-slate-500">
                        {formatDate(item.createdAt)}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.isDeleted
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.isDeleted ? "Deleted" : "Active"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
              {/* ============================================================
            Footer
        ============================================================ */}

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm text-slate-600">
            Showing{" "}
            <span className="font-semibold">
              {items.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
              {pagination.total}
            </span>{" "}
            media files
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <div className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              Page {pagination.page} of {pagination.totalPages}
            </div>

            <button
              type="button"
              disabled={
                page >= pagination.totalPages || loading
              }
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    pagination.totalPages,
                    current + 1
                  )
                )
              }
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

