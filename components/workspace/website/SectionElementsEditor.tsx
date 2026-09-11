/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the reusable optional-element editor for
 *          structured website page sections.
 * ============================================================
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Link2,
  Loader2,
  Plus,
  Trash2,
  Video,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type {
  SectionElement,
  SectionElementPlacement,
  SectionElementType,
} from "@/lib/workspace/website/section-elements";

type MediaType = "IMAGE" | "VIDEO" | "DOCUMENT";

type MediaItem = {
  id: string;
  fileName: string;
  fileUrl: string;
  mediaType: MediaType;
  mimeType: string | null;
  title: string | null;
  altText: string | null;
};

type MediaApiResponse = {
  data?: MediaItem | MediaItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  error?: string;
};

type Props = {
  value?: SectionElement[];
  onChange: (value: SectionElement[]) => void;
};

const ELEMENT_OPTIONS: Array<{
  value: SectionElementType;
  label: string;
  description: string;
}> = [
  {
    value: "image",
    label: "Image",
    description: "Add an image from the Website Media Library.",
  },
  {
    value: "youtube",
    label: "YouTube Video",
    description: "Embed a YouTube video by URL.",
  },
  {
    value: "video",
    label: "Video Clip",
    description: "Add a video file from the Website Media Library.",
  },
  {
    value: "pdf",
    label: "PDF Document",
    description: "Add a downloadable PDF from the Website Media Library.",
  },
  {
    value: "cta",
    label: "CTA Button",
    description: "Add a custom call-to-action button.",
  },
];

const PLACEMENT_OPTIONS = [
  {
    value: "before",
    label: "Before section content",
  },
  {
    value: "after",
    label: "After section content",
  },
];

function createElementId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `section-element-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function createElement(type: SectionElementType): SectionElement {
  const base = {
    id: createElementId(),
    placement: "after" as SectionElementPlacement,
  };

  switch (type) {
    case "image":
      return {
        ...base,
        type,
        url: "",
        altText: "",
        caption: "",
      };

    case "youtube":
      return {
        ...base,
        type,
        url: "",
        title: "",
      };

    case "video":
      return {
        ...base,
        type,
        url: "",
        title: "",
      };

    case "pdf":
      return {
        ...base,
        type,
        url: "",
        label: "Download PDF",
      };

    case "cta":
      return {
        ...base,
        type,
        label: "",
        href: "",
        openInNewTab: false,
      };
  }
}

function getElementLabel(type: SectionElementType) {
  return (
    ELEMENT_OPTIONS.find((option) => option.value === type)?.label ??
    type
  );
}

function getElementIcon(type: SectionElementType) {
  switch (type) {
    case "image":
      return ImageIcon;
    case "youtube":
      return Video;
    case "video":
      return Video;
    case "pdf":
      return FileText;
    case "cta":
      return Link2;
  }
}

function getMediaFilter(type: SectionElementType) {
  if (type === "image") return "IMAGE";
  if (type === "video") return "VIDEO";
  if (type === "pdf") return "DOCUMENT";
  return "";
}

function getResponseMessage(payload: MediaApiResponse) {
  return (
    payload.message ||
    payload.error ||
    "Unable to load Website Media Library."
  );
}

function MediaPicker({
  elementType,
  onSelect,
  onClose,
}: {
  elementType: "image" | "video" | "pdf";
  onSelect: (item: MediaItem) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mediaType = getMediaFilter(elementType);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", "12");
        if (mediaType) params.set("mediaType", mediaType);
        if (search.trim()) params.set("search", search.trim());

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

        if (cancelled) return;

        let nextItems = Array.isArray(payload.data)
          ? payload.data
          : payload.data
            ? [payload.data]
            : [];

        if (elementType === "pdf") {
          nextItems = nextItems.filter(
            (item) => item.mimeType === "application/pdf",
          );
        }

        setItems(nextItems);
        setTotalPages(
          Math.max(1, payload.pagination?.totalPages ?? 1),
        );
      } catch (loadError) {
        if (cancelled) return;

        setItems([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load Website Media Library.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [elementType, mediaType, page, search]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Select ${getElementLabel(elementType)}`}
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-lg font-bold text-slate-950">
              Select {getElementLabel(elementType)}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Choose an asset already stored in this Website Media Library.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close media picker"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-slate-200 p-4 sm:p-5">
          <Input
            value={search}
            placeholder="Search media..."
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading media...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              No matching media found.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    {item.mediaType === "IMAGE" ? (
                      <img
                        src={item.fileUrl}
                        alt={item.altText || item.title || item.fileName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        {item.mediaType === "VIDEO" ? (
                          <Video className="h-12 w-12 text-slate-400" />
                        ) : (
                          <FileText className="h-12 w-12 text-slate-400" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {item.title || item.fileName}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {item.fileName}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-4 sm:px-5">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={page >= totalPages || loading}
              onClick={() =>
                setPage((current) =>
                  Math.min(totalPages, current + 1),
                )
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ElementEditor({
  element,
  onChange,
  onRemove,
  onOpenPicker,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  isExpanded,
  onToggleExpanded,
}: {
  element: SectionElement;
  onChange: (value: SectionElement) => void;
  onRemove: () => void;
  onOpenPicker: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}) {
  const Icon = getElementIcon(element.type);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">
              {getElementLabel(element.type)}
            </p>
            <p className="text-xs text-slate-500">
              Optional element for this section.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="outline"
            className="h-9 w-9 px-0"
            onClick={onToggleExpanded}
            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${getElementLabel(element.type)}`}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 w-9 px-0"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            aria-label="Move element up"
            title="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 w-9 px-0"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            aria-label="Move element down"
            title="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 w-9 px-0"
            onClick={onDuplicate}
            aria-label={`Duplicate ${getElementLabel(element.type)}`}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 w-9 px-0"
            onClick={onRemove}
            aria-label={`Remove ${getElementLabel(element.type)}`}
            title="Remove"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Display Position</Label>
          <Select
            value={element.placement}
            onChange={(event) =>
              onChange({
                ...element,
                placement:
                  event.target.value as SectionElementPlacement,
              })
            }
            options={PLACEMENT_OPTIONS}
          />
        </div>

        {element.type === "image" && (
          <>
            <div className="space-y-2 md:col-span-2">
              <Label>Media Library Image</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={element.url}
                  placeholder="Select an image or paste its URL"
                  onChange={(event) =>
                    onChange({
                      ...element,
                      url: event.target.value,
                      mediaId: undefined,
                    })
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={onOpenPicker}
                  className="shrink-0"
                >
                  <ImageIcon className="h-4 w-4" />
                  Choose Image
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={element.altText ?? ""}
                placeholder="Describe the image"
                onChange={(event) =>
                  onChange({
                    ...element,
                    altText: event.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Caption</Label>
              <Input
                value={element.caption ?? ""}
                placeholder="Optional caption"
                onChange={(event) =>
                  onChange({
                    ...element,
                    caption: event.target.value,
                  })
                }
              />
            </div>
          </>
        )}

        {element.type === "youtube" && (
          <>
            <div className="space-y-2 md:col-span-2">
              <Label>YouTube URL</Label>
              <Input
                value={element.url}
                placeholder="https://www.youtube.com/watch?v=..."
                onChange={(event) =>
                  onChange({
                    ...element,
                    url: event.target.value,
                  })
                }
              />
              <p className="text-xs text-slate-500">
                Paste a standard YouTube video, youtu.be, or embed URL.
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Video Title</Label>
              <Input
                value={element.title ?? ""}
                placeholder="Optional video title"
                onChange={(event) =>
                  onChange({
                    ...element,
                    title: event.target.value,
                  })
                }
              />
            </div>
          </>
        )}

        {element.type === "video" && (
          <>
            <div className="space-y-2 md:col-span-2">
              <Label>Video Clip</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={element.url}
                  placeholder="Select a video or paste its URL"
                  onChange={(event) =>
                    onChange({
                      ...element,
                      url: event.target.value,
                      mediaId: undefined,
                    })
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={onOpenPicker}
                  className="shrink-0"
                >
                  <Video className="h-4 w-4" />
                  Choose Video
                </Button>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Video Title</Label>
              <Input
                value={element.title ?? ""}
                placeholder="Optional video title"
                onChange={(event) =>
                  onChange({
                    ...element,
                    title: event.target.value,
                  })
                }
              />
            </div>
          </>
        )}

        {element.type === "pdf" && (
          <>
            <div className="space-y-2 md:col-span-2">
              <Label>PDF Document</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={element.url}
                  placeholder="Select a PDF or paste its URL"
                  onChange={(event) =>
                    onChange({
                      ...element,
                      url: event.target.value,
                      mediaId: undefined,
                    })
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={onOpenPicker}
                  className="shrink-0"
                >
                  <FileText className="h-4 w-4" />
                  Choose PDF
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Download Label</Label>
              <Input
                value={element.label ?? ""}
                placeholder="Download PDF"
                onChange={(event) =>
                  onChange({
                    ...element,
                    label: event.target.value,
                  })
                }
              />
            </div>
          </>
        )}

        {element.type === "cta" && (
          <>
            <div className="space-y-2">
              <Label>Button Label</Label>
              <Input
                value={element.label}
                placeholder="Request a Quote"
                onChange={(event) =>
                  onChange({
                    ...element,
                    label: event.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Destination</Label>
              <Input
                value={element.href}
                placeholder="/en/request-quote or https://..."
                onChange={(event) =>
                  onChange({
                    ...element,
                    href: event.target.value,
                  })
                }
              />
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 md:col-span-2">
              <input
                type="checkbox"
                checked={Boolean(element.openInNewTab)}
                onChange={(event) =>
                  onChange({
                    ...element,
                    openInNewTab: event.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-slate-300 accent-[#2E7D32]"
              />
              Open in a new tab
              <ExternalLink className="ml-auto h-4 w-4 text-slate-400" />
            </label>
          </>
        )}
        </div>
      )}
    </div>
  );
}

export default function SectionElementsEditor({
  value = [],
  onChange,
}: Props) {
  const [selectedElementType, setSelectedElementType] =
    useState<SectionElementType>("image");
  const [pickerElementId, setPickerElementId] =
    useState<string | null>(null);
  const [expandedElementIds, setExpandedElementIds] =
    useState<Set<string>>(() => new Set());

  const safeValue = useMemo(
    () => (Array.isArray(value) ? value : []),
    [value],
  );

  function updateElement(
    id: string,
    nextElement: SectionElement,
  ) {
    onChange(
      safeValue.map((element) =>
        element.id === id ? nextElement : element,
      ),
    );
  }

  function removeElement(id: string) {
    onChange(
      safeValue.filter((element) => element.id !== id),
    );
    setExpandedElementIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }

  function addElement() {
    const nextElement = createElement(selectedElementType);

    onChange([...safeValue, nextElement]);
    setExpandedElementIds((current) => {
      const next = new Set(current);
      next.add(nextElement.id);
      return next;
    });
  }

  function toggleElementExpanded(id: string) {
    setExpandedElementIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function duplicateElement(id: string) {
    const source = safeValue.find((element) => element.id === id);
    if (!source) return;

    const duplicate = {
      ...source,
      id: createElementId(),
    } as SectionElement;
    const sourceIndex = safeValue.findIndex((element) => element.id === id);
    const next = [...safeValue];
    next.splice(sourceIndex + 1, 0, duplicate);

    onChange(next);
    setExpandedElementIds((current) => {
      const nextExpanded = new Set(current);
      nextExpanded.add(duplicate.id);
      return nextExpanded;
    });
  }

  function moveElement(id: string, direction: -1 | 1) {
    const index = safeValue.findIndex((element) => element.id === id);
    const nextIndex = index + direction;

    if (index < 0 || nextIndex < 0 || nextIndex >= safeValue.length) {
      return;
    }

    const next = [...safeValue];
    const [moved] = next.splice(index, 1);
    next.splice(nextIndex, 0, moved);
    onChange(next);
  }

  const pickerElement = safeValue.find(
    (element) => element.id === pickerElementId,
  );

  return (
    <>
      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">
                Optional Elements
              </p>
              {safeValue.length > 0 && (
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                  {safeValue.length} {safeValue.length === 1 ? "element" : "elements"}
                </span>
              )}
            </div>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              Add an image, YouTube video, video clip, PDF or CTA to this
              section. Choose whether each element appears before or after
              the section&apos;s normal content.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              value={selectedElementType}
              onChange={(event) =>
                setSelectedElementType(
                  event.target.value as SectionElementType,
                )
              }
              options={ELEMENT_OPTIONS.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              className="min-w-48"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addElement}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add Element
            </Button>
          </div>
        </div>

        {safeValue.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-500">
            No optional elements added to this section.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-[11px] leading-5 text-slate-500">
              Use the arrow controls to change display order. Duplicate an element when you want to reuse its settings.
            </p>
            {safeValue.map((element, index) => (
              <ElementEditor
                key={element.id}
                element={element}
                onChange={(nextElement) =>
                  updateElement(element.id, nextElement)
                }
                onRemove={() => removeElement(element.id)}
                onOpenPicker={() => setPickerElementId(element.id)}
                onDuplicate={() => duplicateElement(element.id)}
                onMoveUp={() => moveElement(element.id, -1)}
                onMoveDown={() => moveElement(element.id, 1)}
                canMoveUp={index > 0}
                canMoveDown={index < safeValue.length - 1}
                isExpanded={expandedElementIds.has(element.id)}
                onToggleExpanded={() => toggleElementExpanded(element.id)}
              />
            ))}
          </div>
        )}
      </div>

      {pickerElement &&
        (pickerElement.type === "image" ||
          pickerElement.type === "video" ||
          pickerElement.type === "pdf") && (
          <MediaPicker
            elementType={pickerElement.type}
            onClose={() => setPickerElementId(null)}
            onSelect={(item) => {
              const nextElement =
                pickerElement.type === "image"
                  ? {
                      ...pickerElement,
                      url: item.fileUrl,
                      mediaId: item.id,
                      altText:
                        pickerElement.altText ||
                        item.altText ||
                        item.title ||
                        "",
                    }
                  : pickerElement.type === "video"
                    ? {
                        ...pickerElement,
                        url: item.fileUrl,
                        mediaId: item.id,
                        title:
                          pickerElement.title ||
                          item.title ||
                          "",
                      }
                    : {
                        ...pickerElement,
                        url: item.fileUrl,
                        mediaId: item.id,
                        label:
                          pickerElement.label ||
                          item.title ||
                          "Download PDF",
                      };

              updateElement(
                pickerElement.id,
                nextElement,
              );
              setPickerElementId(null);
            }}
          />
        )}
    </>
  );
}
