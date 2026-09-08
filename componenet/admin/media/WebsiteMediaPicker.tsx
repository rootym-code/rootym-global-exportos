"use client";

/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides a Website-scoped media picker for customer
 *          Website Settings and branding assets.
 * ============================================================
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Search,
  Image as ImageIcon,
  Loader2,
  Check,
  X,
} from "lucide-react";

import { MediaType } from "@/lib/generated/prisma";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import type {
  MediaDto,
  MediaListResponse,
} from "@/lib/types/media";

interface WebsiteMediaPickerProps {
  open: boolean;
  selectedId?: string | null;
  onClose: () => void;
  onSelect: (media: MediaDto) => void;
}

export default function WebsiteMediaPicker({
  open,
  selectedId,
  onClose,
  onSelect,
}: WebsiteMediaPickerProps) {
  const [media, setMedia] = useState<MediaDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(
    selectedId ?? null,
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
        `/api/workspace/website/media?${queryString}`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      const result: MediaListResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ?? "Unable to load Website media library.",
        );
      }

      setMedia(
        result.data.filter(
          (item) =>
            item.mediaType === MediaType.IMAGE &&
            !item.isDeleted &&
            Boolean(item.fileUrl),
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Website media library.",
      );
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    if (!open) return;

    setSelected(selectedId ?? null);
    void fetchMedia();
  }, [open, selectedId, fetchMedia]);

  const selectedMedia = media.find((item) => item.id === selected);

  const handleSelect = () => {
    if (!selectedMedia) return;

    onSelect(selectedMedia);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Select Website Image
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose an image from this Website&apos;s media library.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close media picker"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b px-6 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Website media..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading Website media...
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[260px] items-center justify-center">
              <div className="max-w-md rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                {error}
              </div>
            </div>
          ) : media.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
              <div className="mb-3 rounded-full bg-slate-100 p-4">
                <ImageIcon className="h-7 w-7 text-slate-400" />
              </div>

              <h3 className="text-sm font-semibold text-slate-800">
                No images found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Upload an image to this Website&apos;s Media Library first,
                then return here to select it.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {media.map((item) => {
                const isSelected = selected === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelected(item.id)}
                    className={`group relative overflow-hidden rounded-xl border-2 bg-white text-left transition ${
                      isSelected
                        ? "border-slate-900 ring-2 ring-slate-200"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                      <Image
                        src={item.fileUrl}
                        alt={
                          item.altText ||
                          item.title ||
                          item.fileName ||
                          "Website image"
                        }
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover transition duration-200 group-hover:scale-105"
                      />

                      {isSelected && (
                        <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white shadow">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    <div className="p-2.5">
                      <p
                        className="truncate text-xs font-medium text-slate-800"
                        title={item.fileName}
                      >
                        {item.title || item.fileName}
                      </p>

                      {item.width && item.height ? (
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {item.width} × {item.height}
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-4">
          <p className="text-sm text-slate-500">
            {selectedMedia
              ? `Selected: ${selectedMedia.title || selectedMedia.fileName}`
              : "Select an image to continue."}
          </p>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSelect}
              disabled={!selectedMedia}
            >
              Select Image
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}