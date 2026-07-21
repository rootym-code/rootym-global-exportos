"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Search,
  Image as ImageIcon,
  Loader2,
  Check,
  X,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import type {
  MediaDto,
  MediaListResponse,
} from "@/lib/types/media";

interface MediaPickerProps {
  open: boolean;
  selectedId?: string | null;
  onClose: () => void;
  onSelect: (media: MediaDto) => void;
}

export default function MediaPicker({
  open,
  selectedId,
  onClose,
  onSelect,
}: MediaPickerProps) {
  const [media, setMedia] = useState<MediaDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(
    selectedId ?? null
  );

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    params.set("page", "1");
    params.set("limit", "50");

    return params.toString();
  }, [search]);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/cms/media?${queryString}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const result: MediaListResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
            "Unable to load media library."
        );
      }

      setMedia(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load media library."
      );
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    if (!open) {
      return;
    }

    fetchMedia();
    setSelected(selectedId ?? null);
  }, [open, selectedId, fetchMedia]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="flex h-[85vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Media Library
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select an image for this content.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="border-b border-slate-200 p-6">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search media..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-green-700" />
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center">
              <Card
                hover={false}
                className="border border-red-200 bg-red-50 p-6 text-center text-red-700"
              >
                {error}
              </Card>
            </div>
          ) : media.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-full bg-green-100 p-5">
                <ImageIcon className="h-10 w-10 text-green-700" />
              </div>

              <h3 className="mt-6 text-2xl font-semibold text-slate-900">
                No Media Found
              </h3>

              <p className="mt-3 max-w-md text-slate-500">
                Upload images to your media library before selecting one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {media.map((item) => {
                const isSelected =
                  selected === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setSelected(item.id)
                    }
                    className={`group overflow-hidden rounded-2xl border bg-white text-left transition ${
                      isSelected
                        ? "border-green-600 ring-2 ring-green-200"
                        : "border-slate-200 hover:border-green-400"
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                      <Image
                        src={item.fileUrl}
                        alt={
                          item.altText ??
                          item.title ??
                          item.fileName
                        }
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />

                      {isSelected && (
                        <div className="absolute right-3 top-3 rounded-full bg-green-600 p-1 text-white shadow-lg">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {item.title ?? item.fileName}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {item.mimeType ?? "-"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="text-sm text-slate-500">
            {selected
              ? "1 image selected"
              : "No image selected"}
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="primary"
              disabled={!selected}
              onClick={() => {
                const selectedMedia = media.find(
                  (item) => item.id === selected
                );

                if (!selectedMedia) {
                  return;
                }

                onSelect(selectedMedia);
                onClose();
              }}
            >
              Select Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// END OF FILE