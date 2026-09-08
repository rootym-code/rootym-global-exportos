/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the interactive Website-scoped Media
 *          Library including upload, listing, search,
 *          filtering and pagination for the authenticated
 *          customer Website.
 * ============================================================
 */

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText,
  FolderOpen,
  ImageIcon,
  Link2,
  Loader2,
  Maximize2,
  Music2,
  Eye,
  HardDrive,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  Video,
  X,
} from "lucide-react";

type MediaType =
  | "IMAGE"
  | "VIDEO"
  | "DOCUMENT"
  | "AUDIO"
  | "OTHER";

interface MediaItem {
  id: string;
  fileName: string;
  storedFileName: string;
  fileUrl: string;
  storageProvider: string | null;
  mimeType: string | null;
  mediaType: MediaType;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  title: string | null;
  description: string | null;
  folder: string | null;
  isDeleted: boolean;
  uploadedById: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MediaApiResponse {
  success?: boolean;
  data?: MediaItem | MediaItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  error?: string;
}

interface MediaLibraryClientProps {
  initialTotal?: number;
}

type MediaUsageReferenceType =
  | "PAGE"
  | "PRODUCT"
  | "WHATSAPP";

interface MediaUsageReference {
  type: MediaUsageReferenceType;
  id: string;
  title: string;
  detail: string | null;
  languageCode?: string | null;
  href?: string | null;
  createdAt?: string | null;
}

interface MediaUsageItem {
  media: {
    id: string;
    fileName: string;
    title: string | null;
    fileUrl: string;
    mediaType: MediaType;
  };
  usageCount: number;
  pageCount: number;
  productCount: number;
  whatsappCount: number;
  references: MediaUsageReference[];
}

interface MediaUsageApiResponse {
  success?: boolean;
  data?: {
    totalMedia: number;
    usedMedia: number;
    unusedMedia: number;
    totalReferences: number;
    items: MediaUsageItem[];
  };
  message?: string;
  error?: string;
}

type StorageStatus =
  | "CONNECTED"
  | "NOT_CONFIGURED"
  | "CONNECTION_ERROR"
  | "NOT_CONNECTED";

interface MediaStorageApiResponse {
  success?: boolean;
  data?: {
    provider: string;
    status: StorageStatus;
    website: {
      mediaCount: number;
      usedBytes: number;
    };
    storage: {
      usedBytes: number;
      capacityBytes: number | null;
      availableBytes: number | null;
      usagePercent: number | null;
      capacityStatus:
        | "PROVIDER_MANAGED"
        | "FIXED"
        | "NOT_AVAILABLE";
    };
    configuration: {
      bucket: string | null;
      publicUrl: string | null;
    };
    checkedAt: string;
  };
  message?: string;
  error?: string;
}

const MEDIA_TYPE_OPTIONS: Array<{
  value: "" | MediaType;
  label: string;
}> = [
  { value: "", label: "All Media" },
  { value: "IMAGE", label: "Images" },
  { value: "VIDEO", label: "Videos" },
  { value: "DOCUMENT", label: "Documents" },
  { value: "AUDIO", label: "Audio" },
  { value: "OTHER", label: "Other" },
];

const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  IMAGE: "Image",
  VIDEO: "Video",
  DOCUMENT: "Document",
  AUDIO: "Audio",
  OTHER: "Other",
};

type FileAssetType = "DOCUMENT" | "VIDEO" | "AUDIO" | "OTHER";

const FILE_ASSET_OPTIONS: Array<{
  value: FileAssetType;
  label: string;
  description: string;
}> = [
  {
    value: "DOCUMENT",
    label: "Documents",
    description: "PDF, Word and Excel files",
  },
  {
    value: "VIDEO",
    label: "Videos",
    description: "Website video files",
  },
  {
    value: "AUDIO",
    label: "Audio",
    description: "Website audio files",
  },
  {
    value: "OTHER",
    label: "Other",
    description: "Other supported file types",
  },
];

const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "video/mp4",
  "video/webm",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
].join(",");

const FILE_ASSET_ACCEPTED_TYPES = [
  "video/mp4",
  "video/webm",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
].join(",");

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function getMediaIcon(mediaType: MediaType) {
  switch (mediaType) {
    case "IMAGE":
      return ImageIcon;

    case "VIDEO":
      return Video;

    case "DOCUMENT":
      return FileText;

    case "AUDIO":
      return Music2;

    case "OTHER":
    default:
      return FileText;
  }
}

function formatFileSize(bytes: number | null) {
  if (!bytes || bytes <= 0) {
    return "Size unavailable";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getResponseMessage(payload: MediaApiResponse) {
  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  if (typeof payload.error === "string" && payload.error.trim()) {
    return payload.error;
  }

  return "Unable to complete the Media Library request.";
}

export default function MediaLibraryClient({
  initialTotal = 0,
}: MediaLibraryClientProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);

  // ============================================================
  // IMAGE ASSETS STATE
  // ============================================================

  const [imageAssets, setImageAssets] = useState<MediaItem[]>([]);
  const [imagePage, setImagePage] = useState(1);
  const [imageTotal, setImageTotal] = useState(0);
  const [imageTotalPages, setImageTotalPages] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] =
    useState<MediaItem | null>(null);

  // ============================================================
  // FILE ASSETS STATE
  // ============================================================

  const [fileAssetType, setFileAssetType] =
    useState<FileAssetType>("DOCUMENT");
  const [fileAssets, setFileAssets] = useState<MediaItem[]>([]);
  const [fileAssetPage, setFileAssetPage] = useState(1);
  const [fileAssetTotal, setFileAssetTotal] = useState(0);
  const [fileAssetTotalPages, setFileAssetTotalPages] = useState(1);
  const [fileAssetLoading, setFileAssetLoading] = useState(true);
  const [fileAssetError, setFileAssetError] =
    useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [total, setTotal] = useState(initialTotal);

  const [totalPages, setTotalPages] = useState(
    initialTotal > 0 ? Math.ceil(initialTotal / 20) : 1,
  );

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [mediaType, setMediaType] = useState<
    "" | MediaType
  >("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // UPLOAD STATE
  // ============================================================

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadFormRef = useRef<HTMLFormElement | null>(null);
  const fileAssetInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadAltText, setUploadAltText] = useState("");
  const [uploadDescription, setUploadDescription] =
    useState("");
  const [uploadFolder, setUploadFolder] =
    useState("general");

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] =
    useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] =
    useState<string | null>(null);

  // ============================================================
  // DELETE STATE
  // ============================================================

  const [deletingMediaId, setDeletingMediaId] =
    useState<string | null>(null);

  // ============================================================
  // MEDIA USAGE STATE
  // ============================================================

  const [mediaUsage, setMediaUsage] =
    useState<MediaUsageItem[]>([]);
  const [mediaUsageTotal, setMediaUsageTotal] =
    useState(0);
  const [mediaUsageUsed, setMediaUsageUsed] =
    useState(0);
  const [mediaUsageUnused, setMediaUsageUnused] =
    useState(0);
  const [mediaUsageReferences, setMediaUsageReferences] =
    useState(0);
  const [mediaUsageLoading, setMediaUsageLoading] =
    useState(true);
  const [mediaUsageError, setMediaUsageError] =
    useState<string | null>(null);
  const [expandedUsageMediaId, setExpandedUsageMediaId] =
    useState<string | null>(null);

  // ============================================================
  // STORAGE STATE
  // ============================================================

  const [storage, setStorage] =
    useState<MediaStorageApiResponse["data"] | null>(null);
  const [storageLoading, setStorageLoading] =
    useState(true);
  const [storageError, setStorageError] =
    useState<string | null>(null);

  // ============================================================
  // LOAD MEDIA
  // ============================================================

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", String(limit));

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (mediaType) {
        params.set("mediaType", mediaType);
      }

      const response = await fetch(
        `/api/workspace/website/media?${params.toString()}`,
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        },
      );

      const payload =
        (await response.json()) as MediaApiResponse;

      if (!response.ok) {
        throw new Error(getResponseMessage(payload));
      }

      setMedia(
        Array.isArray(payload.data)
          ? payload.data
          : [],
      );

      const pagination = payload.pagination;

      if (pagination) {
        setTotal(pagination.total);
        setTotalPages(
          Math.max(1, pagination.totalPages),
        );
      } else {
        setTotal(0);
        setTotalPages(1);
      }
    } catch (loadError) {
      setMedia([]);

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load the Media Library.",
      );
    } finally {
      setLoading(false);
    }
  }, [limit, mediaType, page, search]);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  // ============================================================
  // IMAGE ASSETS
  // ============================================================

  const loadImageAssets = useCallback(async () => {
    setImageLoading(true);
    setImageError(null);

    try {
      const params = new URLSearchParams();

      params.set("page", String(imagePage));
      params.set("limit", "12");
      params.set("mediaType", "IMAGE");

      const response = await fetch(
        `/api/workspace/website/media?${params.toString()}`,
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        },
      );

      const payload =
        (await response.json()) as MediaApiResponse;

      if (!response.ok) {
        throw new Error(getResponseMessage(payload));
      }

      const assets = Array.isArray(payload.data)
        ? payload.data.filter(
            (item) => item.mediaType === "IMAGE",
          )
        : [];

      setImageAssets(assets);

      const pagination = payload.pagination;

      if (pagination) {
        setImageTotal(pagination.total);
        setImageTotalPages(
          Math.max(1, pagination.totalPages),
        );
      } else {
        setImageTotal(assets.length);
        setImageTotalPages(1);
      }
    } catch (imageLoadError) {
      setImageAssets([]);
      setImageTotal(0);
      setImageTotalPages(1);

      setImageError(
        imageLoadError instanceof Error
          ? imageLoadError.message
          : "Unable to load Image Assets.",
      );
    } finally {
      setImageLoading(false);
    }
  }, [imagePage]);

  useEffect(() => {
    void loadImageAssets();
  }, [loadImageAssets]);

  // ============================================================
  // FILE ASSETS
  // ============================================================

  const loadFileAssets = useCallback(async () => {
    setFileAssetLoading(true);
    setFileAssetError(null);

    try {
      const params = new URLSearchParams();

      params.set("page", String(fileAssetPage));
      params.set("limit", "12");
      params.set("mediaType", fileAssetType);

      const response = await fetch(
        `/api/workspace/website/media?${params.toString()}`,
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        },
      );

      const payload =
        (await response.json()) as MediaApiResponse;

      if (!response.ok) {
        throw new Error(getResponseMessage(payload));
      }

      const assets = Array.isArray(payload.data)
        ? payload.data.filter(
            (item) => item.mediaType === fileAssetType,
          )
        : [];

      setFileAssets(assets);

      const pagination = payload.pagination;

      if (pagination) {
        setFileAssetTotal(pagination.total);
        setFileAssetTotalPages(
          Math.max(1, pagination.totalPages),
        );
      } else {
        setFileAssetTotal(assets.length);
        setFileAssetTotalPages(1);
      }
    } catch (fileLoadError) {
      setFileAssets([]);
      setFileAssetTotal(0);
      setFileAssetTotalPages(1);

      setFileAssetError(
        fileLoadError instanceof Error
          ? fileLoadError.message
          : "Unable to load File Assets.",
      );
    } finally {
      setFileAssetLoading(false);
    }
  }, [fileAssetPage, fileAssetType]);

  useEffect(() => {
    void loadFileAssets();
  }, [loadFileAssets]);

  // ============================================================
  // MEDIA COUNTS
  // ============================================================

  const imageCount = useMemo(
    () =>
      media.filter(
        (item) => item.mediaType === "IMAGE",
      ).length,
    [media],
  );

  const videoCount = useMemo(
    () =>
      media.filter(
        (item) => item.mediaType === "VIDEO",
      ).length,
    [media],
  );

  const documentCount = useMemo(
    () =>
      media.filter(
        (item) => item.mediaType === "DOCUMENT",
      ).length,
    [media],
  );

  const audioCount = useMemo(
    () =>
      media.filter(
        (item) => item.mediaType === "AUDIO",
      ).length,
    [media],
  );

  // ============================================================
  // SEARCH / FILTER HANDLERS
  // ============================================================

  function handleSearchSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleMediaTypeChange(
    value: "" | MediaType,
  ) {
    setPage(1);
    setMediaType(value);
  }

  function handlePreviousPage() {
    setPage((current) =>
      Math.max(1, current - 1),
    );
  }

  function handleNextPage() {
    setPage((current) =>
      Math.min(totalPages, current + 1),
    );
  }

  // ============================================================
  // UPLOAD HANDLERS
  // ============================================================

  function handleFileSelection(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setUploadError(null);
    setUploadSuccess(null);

    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size <= 0) {
      setSelectedFile(null);
      setUploadError(
        "The selected file is empty.",
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setUploadError(
        "The selected file is larger than the 20 MB limit.",
      );
      return;
    }

    setSelectedFile(file);

    uploadFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    if (!uploadTitle.trim()) {
      const extensionIndex =
        file.name.lastIndexOf(".");

      const fileStem =
        extensionIndex > 0
          ? file.name.slice(0, extensionIndex)
          : file.name;

      setUploadTitle(fileStem.slice(0, 200));
    }

    if (!uploadAltText.trim()) {
      const extensionIndex =
        file.name.lastIndexOf(".");

      const fileStem =
        extensionIndex > 0
          ? file.name.slice(0, extensionIndex)
          : file.name;

      setUploadAltText(fileStem.slice(0, 500));
    }
  }

  function clearSelectedFile() {
    setSelectedFile(null);
    setUploadError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function resetUploadForm() {
    setSelectedFile(null);
    setUploadTitle("");
    setUploadAltText("");
    setUploadDescription("");
    setUploadFolder("general");
    setUploadError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleUpload(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setUploadError(null);
    setUploadSuccess(null);

    if (!selectedFile) {
      setUploadError(
        "Please select a media file first.",
      );
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setUploadError(
        "The selected file is larger than the 20 MB limit.",
      );
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      if (uploadTitle.trim()) {
        formData.append(
          "title",
          uploadTitle.trim(),
        );
      }

      if (uploadAltText.trim()) {
        formData.append(
          "altText",
          uploadAltText.trim(),
        );
      }

      if (uploadDescription.trim()) {
        formData.append(
          "description",
          uploadDescription.trim(),
        );
      }

      if (uploadFolder.trim()) {
        formData.append(
          "folder",
          uploadFolder.trim(),
        );
      }

      const response = await fetch(
        "/api/workspace/website/media/upload",
        {
          method: "POST",
          credentials: "same-origin",
          body: formData,
        },
      );

      const payload =
        (await response.json()) as MediaApiResponse;

      if (!response.ok) {
        throw new Error(
          getResponseMessage(payload),
        );
      }

      setUploadSuccess(
        "Media uploaded successfully.",
      );

      resetUploadForm();

      // Return to the first page so the newly uploaded
      // asset can be shown immediately.
      setPage(1);

      await loadMedia();
      await loadImageAssets();
      await loadFileAssets();
      await loadMediaUsage();
      await loadStorage();
    } catch (uploadRequestError) {
      setUploadError(
        uploadRequestError instanceof Error
          ? uploadRequestError.message
          : "Unable to upload the media file.",
      );
    } finally {
      setUploading(false);
    }
  }

  // ============================================================
  // MEDIA USAGE
  // ============================================================

  const loadMediaUsage = useCallback(async () => {
    setMediaUsageLoading(true);
    setMediaUsageError(null);

    try {
      const response = await fetch(
        "/api/workspace/website/media/usage",
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        },
      );

      const payload =
        (await response.json()) as MediaUsageApiResponse;

      if (!response.ok) {
        throw new Error(
          payload.message ||
            payload.error ||
            "Unable to load Media Usage.",
        );
      }

      if (!payload.data) {
        throw new Error("Media Usage response was empty.");
      }

      setMediaUsage(payload.data.items);
      setMediaUsageTotal(payload.data.totalMedia);
      setMediaUsageUsed(payload.data.usedMedia);
      setMediaUsageUnused(payload.data.unusedMedia);
      setMediaUsageReferences(payload.data.totalReferences);
    } catch (usageError) {
      setMediaUsage([]);
      setMediaUsageTotal(0);
      setMediaUsageUsed(0);
      setMediaUsageUnused(0);
      setMediaUsageReferences(0);

      setMediaUsageError(
        usageError instanceof Error
          ? usageError.message
          : "Unable to load Media Usage.",
      );
    } finally {
      setMediaUsageLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMediaUsage();
  }, [loadMediaUsage]);

  // ============================================================
  // STORAGE
  // ============================================================

  const loadStorage = useCallback(async () => {
    setStorageLoading(true);
    setStorageError(null);

    try {
      const response = await fetch(
        "/api/workspace/website/media/storage",
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        },
      );

      const payload =
        (await response.json()) as MediaStorageApiResponse;

      if (!response.ok) {
        throw new Error(
          payload.message ||
            payload.error ||
            "Unable to load Storage information.",
        );
      }

      if (!payload.data) {
        throw new Error(
          "Storage response was empty.",
        );
      }

      setStorage(payload.data);
    } catch (storageLoadError) {
      setStorage(null);
      setStorageError(
        storageLoadError instanceof Error
          ? storageLoadError.message
          : "Unable to load Storage information.",
      );
    } finally {
      setStorageLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStorage();
  }, [loadStorage]);

  // ============================================================
  // DELETE HANDLER
  // ============================================================

  async function handleDeleteMedia(item: MediaItem) {
    const confirmed = window.confirm(
      `Delete "${item.title || item.fileName}" from this Website Media Library?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingMediaId(item.id);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const response = await fetch(
        `/api/workspace/website/media/${item.id}`,
        {
          method: "DELETE",
          credentials: "same-origin",
        },
      );

      const payload =
        (await response.json()) as MediaApiResponse;

      if (!response.ok) {
        throw new Error(getResponseMessage(payload));
      }

      if (selectedImage?.id === item.id) {
        setSelectedImage(null);
      }

      setUploadSuccess("Media deleted successfully.");

      await Promise.all([
        loadMedia(),
        loadImageAssets(),
        loadFileAssets(),
        loadMediaUsage(),
        loadStorage(),
      ]);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete the media file.",
      );
      setFileAssetError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete the media file.",
      );
    } finally {
      setDeletingMediaId(null);
    }
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section id="media-upload" className="mt-8 scroll-mt-24">
      {/* ============================================================
          UPLOAD & MANAGE
          ============================================================ */}

      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
          Upload & Manage
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Upload website media
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Upload images, documents, videos and audio files
          to this customer website&apos;s Media Library.
        </p>
      </div>

      <form
        ref={uploadFormRef}
        onSubmit={handleUpload}
        className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-7"
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* ========================================================
              FILE SELECTOR
              ======================================================== */}

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Media File
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Maximum file size: 20 MB.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              onChange={handleFileSelection}
              className="sr-only"
              disabled={uploading}
            />

            <input
              ref={fileAssetInputRef}
              type="file"
              accept={FILE_ASSET_ACCEPTED_TYPES}
              onChange={handleFileSelection}
              className="sr-only"
              disabled={uploading}
            />

            {!selectedFile ? (
              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={uploading}
                className="mt-4 flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition hover:border-emerald-300 hover:bg-emerald-50/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                  <UploadCloud className="h-6 w-6 text-emerald-600" />
                </div>

                <span className="mt-4 text-sm font-bold text-slate-900">
                  Choose a file
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  Images, videos, documents or audio
                </span>
              </button>
            ) : (
              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-emerald-100">
                    <ImageIcon className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatFileSize(
                        selectedFile.size,
                      )}
                      {" · "}
                      {selectedFile.type ||
                        "Unknown file type"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={clearSelectedFile}
                    disabled={uploading}
                    title="Remove selected file"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={uploading}
                  className="mt-4 text-xs font-semibold text-emerald-700 underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Choose a different file
                </button>
              </div>
            )}
          </div>

          {/* ========================================================
              MEDIA DETAILS
              ======================================================== */}

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Media Details
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              These details can be used later when the asset
              is placed on website pages.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="media-upload-title"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Title
                </label>

                <input
                  id="media-upload-title"
                  type="text"
                  value={uploadTitle}
                  onChange={(event) =>
                    setUploadTitle(
                      event.target.value,
                    )
                  }
                  maxLength={200}
                  placeholder="Media title"
                  disabled={uploading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                />
              </div>

              <div>
                <label
                  htmlFor="media-upload-alt"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Alt Text
                </label>

                <input
                  id="media-upload-alt"
                  type="text"
                  value={uploadAltText}
                  onChange={(event) =>
                    setUploadAltText(
                      event.target.value,
                    )
                  }
                  maxLength={500}
                  placeholder="Describe the image or asset"
                  disabled={uploading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                />
              </div>

              <div>
                <label
                  htmlFor="media-upload-folder"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Folder
                </label>

                <div className="relative">
                  <FolderOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="media-upload-folder"
                    type="text"
                    value={uploadFolder}
                    onChange={(event) =>
                      setUploadFolder(
                        event.target.value,
                      )
                    }
                    maxLength={100}
                    placeholder="general"
                    disabled={uploading}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="media-upload-description"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="media-upload-description"
                  value={uploadDescription}
                  onChange={(event) =>
                    setUploadDescription(
                      event.target.value,
                    )
                  }
                  maxLength={1000}
                  rows={3}
                  placeholder="Optional description"
                  disabled={uploading}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            UPLOAD STATUS
            ============================================================ */}

        {uploadError && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm font-semibold text-red-800">
              Upload failed
            </p>

            <p className="mt-1 text-sm leading-5 text-red-700">
              {uploadError}
            </p>
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-semibold text-emerald-800">
              Upload successful
            </p>

            <p className="mt-1 text-sm leading-5 text-emerald-700">
              {uploadSuccess}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-400">
            Uploaded files are stored against this customer
            Website and are not shared with other Websites.
          </p>

          <button
            type="submit"
            disabled={!selectedFile || uploading}
            className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4" />
                Upload Media
              </>
            )}
          </button>
        </div>
      </form>

      {/* ============================================================
          LIBRARY SUMMARY
          ============================================================ */}

      <div id="media-library" className="mb-6 mt-10 scroll-mt-24">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
          Library
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Website media assets
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Browse the media assets currently associated with
          this customer website.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {total}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Images
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {imageCount}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Current page
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Videos
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {videoCount}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Current page
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Documents
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {documentCount}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Current page
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Audio
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {audioCount}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Current page
          </p>
        </div>
      </div>

      {/* ============================================================
          IMAGE ASSETS
          ============================================================ */}

      <div id="media-images" className="mt-10 scroll-mt-24">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
            Image Assets
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Website image library
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Browse image assets as visual thumbnails with their
            key metadata. This view is limited to image files.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Image Assets
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {imageLoading
                  ? "Loading images..."
                  : `${imageTotal} image ${
                      imageTotal === 1 ? "asset" : "assets"
                    }`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadImageAssets()}
              disabled={imageLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  imageLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>

          {imageLoading ? (
            <div className="flex min-h-56 items-center justify-center px-6 py-12">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                Loading Image Assets...
              </div>
            </div>
          ) : imageError ? (
            <div className="px-6 py-8">
              <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                <p className="text-sm font-semibold text-red-800">
                  Unable to load Image Assets
                </p>

                <p className="mt-2 text-sm leading-6 text-red-700">
                  {imageError}
                </p>

                <button
                  type="button"
                  onClick={() => void loadImageAssets()}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </div>
          ) : imageAssets.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <ImageIcon className="h-6 w-6 text-slate-400" />
              </div>

              <h4 className="mt-5 text-lg font-bold text-slate-900">
                No image assets yet
              </h4>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Upload an image using Upload & Manage above
                and it will appear here automatically.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {imageAssets.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedImage(item)}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={item.fileUrl}
                        alt={
                          item.altText ||
                          item.title ||
                          item.fileName
                        }
                        className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.03]"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/0 transition group-hover:bg-slate-950/30">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm transition group-hover:opacity-100">
                          <Eye className="h-4 w-4 text-slate-700" />
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="min-w-0 truncate text-sm font-bold text-slate-900">
                          {item.title || item.fileName}
                        </h4>

                        <Maximize2 className="h-4 w-4 shrink-0 text-slate-300" />
                      </div>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {item.fileName}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                        <span>
                          {formatFileSize(item.fileSize)}
                        </span>

                        {item.width && item.height ? (
                          <span>
                            {item.width} × {item.height}
                          </span>
                        ) : null}
                      </div>

                      {item.folder ? (
                        <p className="mt-2 truncate text-xs text-slate-400">
                          Folder: {item.folder}
                        </p>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>

              {imageTotalPages > 1 ? (
                <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-medium text-slate-500">
                    Showing page {imagePage} of{" "}
                    {imageTotalPages}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setImagePage((current) =>
                          Math.max(1, current - 1),
                        )
                      }
                      disabled={imagePage <= 1}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setImagePage((current) =>
                          Math.min(
                            imageTotalPages,
                            current + 1,
                          ),
                        )
                      }
                      disabled={imagePage >= imageTotalPages}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* ============================================================
          IMAGE PREVIEW
          ============================================================ */}

      {selectedImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-slate-900">
                  {selectedImage.title ||
                    selectedImage.fileName}
                </h3>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {selectedImage.fileName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                title="Close preview"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-slate-100 p-4 sm:p-8">
              <img
                src={selectedImage.fileUrl}
                alt={
                  selectedImage.altText ||
                  selectedImage.title ||
                  selectedImage.fileName
                }
                className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-sm"
              />
            </div>

            <div className="grid gap-3 border-t border-slate-200 px-5 py-4 text-xs text-slate-500 sm:grid-cols-4 sm:px-6">
              <div>
                <p className="font-semibold text-slate-700">
                  File Size
                </p>
                <p className="mt-1">
                  {formatFileSize(selectedImage.fileSize)}
                </p>
              </div>

              <div>
                <p className="font-semibold text-slate-700">
                  Dimensions
                </p>
                <p className="mt-1">
                  {selectedImage.width &&
                  selectedImage.height
                    ? `${selectedImage.width} × ${selectedImage.height}`
                    : "Not available"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-slate-700">
                  Folder
                </p>
                <p className="mt-1 truncate">
                  {selectedImage.folder || "Unorganized"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-slate-700">
                  MIME Type
                </p>
                <p className="mt-1 truncate">
                  {selectedImage.mimeType ||
                    "Not available"}
                </p>
              </div>

              <div className="sm:col-span-4 sm:flex sm:justify-end">
                <button
                  type="button"
                  onClick={() => void handleDeleteMedia(selectedImage)}
                  disabled={deletingMediaId === selectedImage.id}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingMediaId === selectedImage.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete Image
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ============================================================
          FILE ASSETS
          ============================================================ */}

      <div id="media-files" className="mt-10 scroll-mt-24">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
            File Assets
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Website file library
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Browse non-image assets with their key metadata. Use the
            categories below to manage documents, videos, audio and
            other supported files. Use Upload File to add a new file
            directly from this section.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {FILE_ASSET_OPTIONS.map((option) => {
                const isActive = fileAssetType === option.value;
                const Icon = getMediaIcon(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setFileAssetType(option.value);
                      setFileAssetPage(1);
                    }}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      isActive
                        ? "border-emerald-200 bg-emerald-50/60 ring-1 ring-emerald-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isActive
                            ? "bg-white text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900">
                          {option.label}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {
                  FILE_ASSET_OPTIONS.find(
                    (option) => option.value === fileAssetType,
                  )?.label
                }
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {fileAssetLoading
                  ? "Loading files..."
                  : `${fileAssetTotal} file ${
                      fileAssetTotal === 1 ? "asset" : "assets"
                    }`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileAssetInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UploadCloud className="h-4 w-4" />
                Upload File
              </button>

              <button
                type="button"
                onClick={() => void loadFileAssets()}
                disabled={fileAssetLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    fileAssetLoading ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </button>
            </div>
          </div>

          {fileAssetLoading ? (
            <div className="flex min-h-56 items-center justify-center px-6 py-12">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                Loading File Assets...
              </div>
            </div>
          ) : fileAssetError ? (
            <div className="px-6 py-8">
              <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                <p className="text-sm font-semibold text-red-800">
                  Unable to load File Assets
                </p>

                <p className="mt-2 text-sm leading-6 text-red-700">
                  {fileAssetError}
                </p>

                <button
                  type="button"
                  onClick={() => void loadFileAssets()}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </div>
          ) : fileAssets.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                {(() => {
                  const EmptyIcon = getMediaIcon(fileAssetType);
                  return (
                    <EmptyIcon className="h-6 w-6 text-slate-400" />
                  );
                })()}
              </div>

              <h4 className="mt-5 text-lg font-bold text-slate-900">
                No {MEDIA_TYPE_LABELS[fileAssetType].toLowerCase()} assets yet
              </h4>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Upload a supported file using Upload &amp; Manage above
                and it will appear in this category.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-100">
                {fileAssets.map((item) => {
                  const Icon = getMediaIcon(item.mediaType);

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                        <Icon className="h-6 w-6 text-slate-500" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="truncate text-sm font-bold text-slate-900">
                            {item.title || item.fileName}
                          </h4>

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                            {MEDIA_TYPE_LABELS[item.mediaType]}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {item.fileName}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                          <span>
                            {formatFileSize(item.fileSize)}
                          </span>

                          {item.folder && (
                            <span>
                              Folder: {item.folder}
                            </span>
                          )}

                          {item.mimeType && (
                            <span>
                              {item.mimeType}
                            </span>
                          )}

                          <span>
                            Added {formatDate(item.createdAt)}
                          </span>
                        </div>

                        {item.description ? (
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                            {item.description}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Open
                        </a>

                        <button
                          type="button"
                          onClick={() => void handleDeleteMedia(item)}
                          disabled={deletingMediaId === item.id}
                          title="Delete media"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingMediaId === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {fileAssetTotalPages > 1 ? (
                <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-medium text-slate-500">
                    Showing page {fileAssetPage} of{" "}
                    {fileAssetTotalPages}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFileAssetPage((current) =>
                          Math.max(1, current - 1),
                        )
                      }
                      disabled={fileAssetPage <= 1}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFileAssetPage((current) =>
                          Math.min(
                            fileAssetTotalPages,
                            current + 1,
                          ),
                        )
                      }
                      disabled={
                        fileAssetPage >= fileAssetTotalPages
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* ============================================================
          MEDIA USAGE
          ============================================================ */}

      <div id="media-usage" className="mt-10 scroll-mt-24">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
            Media Usage
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Where your media is being used
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            See detected references to Website media across CMS page
            content and existing Product or WhatsApp relationships.
            Review unused assets before removing them.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total Media
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {mediaUsageLoading ? "—" : mediaUsageTotal}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Used Assets
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-700">
              {mediaUsageLoading ? "—" : mediaUsageUsed}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Unused Assets
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-700">
              {mediaUsageLoading ? "—" : mediaUsageUnused}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              References
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {mediaUsageLoading ? "—" : mediaUsageReferences}
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Usage by media asset
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {mediaUsageLoading
                  ? "Checking media references..."
                  : `${mediaUsageTotal} media ${
                      mediaUsageTotal === 1 ? "asset" : "assets"
                    } checked`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadMediaUsage()}
              disabled={mediaUsageLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  mediaUsageLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>

          {mediaUsageLoading ? (
            <div className="flex min-h-48 items-center justify-center px-6 py-12">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                Checking Media Usage...
              </div>
            </div>
          ) : mediaUsageError ? (
            <div className="px-6 py-8">
              <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                <p className="text-sm font-semibold text-red-800">
                  Unable to load Media Usage
                </p>
                <p className="mt-2 text-sm leading-6 text-red-700">
                  {mediaUsageError}
                </p>
                <button
                  type="button"
                  onClick={() => void loadMediaUsage()}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </div>
          ) : mediaUsage.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <BarChart3 className="h-6 w-6 text-slate-400" />
              </div>
              <h4 className="mt-5 text-lg font-bold text-slate-900">
                No media assets to analyze
              </h4>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Upload a media asset first and its detected usage will
                appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {mediaUsage.map((item) => {
                const expanded =
                  expandedUsageMediaId === item.media.id;

                return (
                  <div key={item.media.id} className="px-6 py-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                        {item.media.mediaType === "IMAGE" ? (
                          <img
                            src={item.media.fileUrl}
                            alt={item.media.title || item.media.fileName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FileText className="h-6 w-6 text-slate-500" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="truncate text-sm font-bold text-slate-900">
                            {item.media.title || item.media.fileName}
                          </h4>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              item.usageCount > 0
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {item.usageCount > 0
                              ? `${item.usageCount} ${
                                  item.usageCount === 1
                                    ? "reference"
                                    : "references"
                                }`
                              : "Unused"}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {item.media.fileName}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                          <span>Pages: {item.pageCount}</span>
                          <span>Products: {item.productCount}</span>
                          <span>WhatsApp: {item.whatsappCount}</span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <a
                          href={item.media.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                          title="Open media"
                        >
                          <Eye className="h-4 w-4" />
                        </a>

                        {item.usageCount > 0 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedUsageMediaId(
                                expanded ? null : item.media.id,
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                          >
                            <Link2 className="h-4 w-4" />
                            {expanded ? "Hide Usage" : "View Usage"}
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {expanded ? (
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="space-y-3">
                          {item.references.map((reference, index) => (
                            <div
                              key={`${reference.type}-${reference.id}-${index}`}
                              className="flex flex-col gap-2 rounded-xl bg-white p-4 ring-1 ring-slate-200 sm:flex-row sm:items-start sm:justify-between"
                            >
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                    {reference.type === "PAGE"
                                      ? "Page"
                                      : reference.type === "PRODUCT"
                                        ? "Product"
                                        : "WhatsApp"}
                                  </span>

                                  {reference.languageCode ? (
                                    <span className="text-[11px] font-semibold uppercase text-slate-400">
                                      {reference.languageCode}
                                    </span>
                                  ) : null}
                                </div>

                                <p className="mt-2 text-sm font-semibold text-slate-900">
                                  {reference.title}
                                </p>

                                {reference.detail ? (
                                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                    {reference.detail}
                                  </p>
                                ) : null}
                              </div>

                              {reference.href ? (
                                <a
                                  href={reference.href}
                                  className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                  Open
                                </a>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
          STORAGE
          ============================================================ */}

      <div id="media-storage" className="mt-10 scroll-mt-24">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
            Storage
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Media storage
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Review this Website&apos;s media storage usage and the configured
            storage provider connection.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <HardDrive className="h-5 w-5 text-slate-600" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Storage overview
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {storageLoading
                    ? "Checking storage..."
                    : storage
                      ? `${storage.website.mediaCount} media ${
                          storage.website.mediaCount === 1
                            ? "asset"
                            : "assets"
                        }`
                      : "Storage information unavailable"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void loadStorage()}
              disabled={storageLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  storageLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>

          {storageLoading ? (
            <div className="flex min-h-48 items-center justify-center px-6 py-12">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                Checking Storage...
              </div>
            </div>
          ) : storageError ? (
            <div className="px-6 py-8">
              <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                <p className="text-sm font-semibold text-red-800">
                  Unable to load Storage
                </p>

                <p className="mt-2 text-sm leading-6 text-red-700">
                  {storageError}
                </p>

                <button
                  type="button"
                  onClick={() => void loadStorage()}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </div>
          ) : storage ? (
            <div className="p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Provider
                  </p>
                  <p className="mt-2 text-xl font-bold uppercase text-slate-900">
                    {storage.provider}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Connection
                  </p>
                  <p
                    className={`mt-2 text-xl font-bold ${
                      storage.status === "CONNECTED"
                        ? "text-emerald-700"
                        : "text-red-700"
                    }`}
                  >
                    {storage.status === "CONNECTED"
                      ? "Connected"
                      : storage.status === "NOT_CONFIGURED"
                        ? "Not configured"
                        : storage.status === "CONNECTION_ERROR"
                          ? "Connection error"
                          : "Not connected"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Website Usage
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    {formatFileSize(storage.website.usedBytes)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Media Assets
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    {storage.website.mediaCount}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Capacity
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {storage.storage.capacityStatus === "PROVIDER_MANAGED"
                        ? "Storage capacity is managed by the configured storage provider. No fixed Website quota is currently configured."
                        : storage.storage.capacityStatus === "FIXED"
                          ? `${formatFileSize(
                              storage.storage.capacityBytes,
                            )} fixed capacity`
                          : "Storage capacity information is not available."}
                    </p>
                  </div>

                  <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    {storage.storage.capacityStatus === "PROVIDER_MANAGED"
                      ? "Provider Managed"
                      : storage.storage.capacityStatus === "FIXED"
                        ? "Fixed Capacity"
                        : "Not Available"}
                  </span>
                </div>

                {storage.storage.capacityBytes !== null ? (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>
                        {formatFileSize(storage.storage.usedBytes)} used
                      </span>
                      <span>
                        {storage.storage.usagePercent !== null
                          ? `${storage.storage.usagePercent.toFixed(1)}%`
                          : "—"}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              storage.storage.usagePercent ?? 0,
                            ),
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      {storage.storage.availableBytes !== null
                        ? `${formatFileSize(
                            storage.storage.availableBytes,
                          )} available`
                        : "Available capacity unavailable"}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Storage Location
                  </p>

                  <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                    {storage.configuration.bucket ||
                      storage.configuration.publicUrl ||
                      "Provider managed"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Last Checked
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {formatDate(storage.checkedAt)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-48 items-center justify-center px-6 py-12 text-center">
              <div>
                <HardDrive className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Storage information is unavailable.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
          SEARCH AND FILTERS
          ============================================================ */}

      <div id="media-all" className="mt-6 scroll-mt-24 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-1 gap-3"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(event.target.value)
                }
                placeholder="Search media files..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-3">
            <select
              value={mediaType}
              onChange={(event) =>
                handleMediaTypeChange(
                  event.target.value as
                    | ""
                    | MediaType,
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              {MEDIA_TYPE_OPTIONS.map((option) => (
                <option
                  key={option.value || "all"}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => void loadMedia()}
              disabled={loading}
              title="Refresh media"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {(search || mediaType) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold">
              Active filters:
            </span>

            {search && (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700">
                Search: {search}
              </span>
            )}

            {mediaType && (
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700">
                Type: {MEDIA_TYPE_LABELS[mediaType]}
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSearch("");
                setMediaType("");
                setPage(1);
              }}
              className="ml-1 font-semibold text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ============================================================
          MEDIA LIST
          ============================================================ */}

      <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Media Files
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading media..."
                  : `${total} media asset${
                      total === 1 ? "" : "s"
                    } found`}
              </p>
            </div>

            {!loading && totalPages > 1 && (
              <p className="text-xs font-medium text-slate-400">
                Page {page} of {totalPages}
              </p>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex min-h-64 items-center justify-center px-6 py-12">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
              Loading Media Library...
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="px-6 py-12">
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
              <p className="text-sm font-semibold text-red-800">
                Unable to load Media Library
              </p>

              <p className="mt-2 text-sm leading-6 text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void loadMedia()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          media.length === 0 && (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <ImageIcon className="h-6 w-6 text-slate-400" />
              </div>

              <h4 className="mt-5 text-lg font-bold text-slate-900">
                No media found
              </h4>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search || mediaType
                  ? "No media assets match the current search or filter."
                  : "There are currently no media assets associated with this website. Use the Upload & Manage section above to add your first asset."}
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          media.length > 0 && (
            <div className="divide-y divide-slate-100">
              {media.map((item) => {
                const Icon = getMediaIcon(
                  item.mediaType,
                );

                const isImage =
                  item.mediaType === "IMAGE" &&
                  Boolean(item.fileUrl);

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                      {isImage ? (
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
                        <Icon className="h-7 w-7 text-slate-500" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="truncate text-sm font-bold text-slate-900">
                          {item.title ||
                            item.fileName}
                        </h4>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                          {
                            MEDIA_TYPE_LABELS[
                              item.mediaType
                            ]
                          }
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {item.fileName}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span>
                          {formatFileSize(
                            item.fileSize,
                          )}
                        </span>

                        {item.folder && (
                          <span>
                            Folder: {item.folder}
                          </span>
                        )}

                        {item.mimeType && (
                          <span>
                            {item.mimeType}
                          </span>
                        )}

                        <span>
                          Added{" "}
                          {formatDate(
                            item.createdAt,
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Open
                      </a>

                      <button
                        type="button"
                        onClick={() => void handleDeleteMedia(item)}
                        disabled={deletingMediaId === item.id}
                        title="Delete media"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingMediaId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        {/* ============================================================
            PAGINATION
            ============================================================ */}

        {!loading &&
          !error &&
          totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-medium text-slate-500">
                Showing page {page} of{" "}
                {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
      </div>
    </section>
  );
}