"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import type {
  MediaDto,
  MediaUploadResponse,
} from "@/lib/types/media";

interface MediaUploaderProps {
  value?: MediaDto | null;
  onChange: (media: MediaDto) => void;
  onRemove?: () => void;
  accept?: string;
  maxSizeMB?: number;
}

export default function MediaUploader({
  value,
  onChange,
  onRemove,
  accept = "image/*",
  maxSizeMB = 10,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragging, setDragging] = useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] = useState("");

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image.");
        return;
      }

      if (
        file.size >
        maxSizeMB * 1024 * 1024
      ) {
        setError(
          `Maximum file size is ${maxSizeMB} MB.`
        );
        return;
      }

      try {
        setUploading(true);
        setError("");

        const formData = new FormData();

        formData.append("file", file);

        const response = await fetch(
          "/api/admin/cms/media",
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        const result: MediaUploadResponse =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ?? "Upload failed."
          );
        }

        onChange(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Upload failed."
        );
      } finally {
        setUploading(false);
      }
    },
    [maxSizeMB, onChange]
  );

  const handleFiles = (
    files: FileList | null
  ) => {
    if (!files?.length) {
      return;
    }

    uploadFile(files[0]);
  };

  return (
    <Card
      hover={false}
      className="overflow-hidden"
    >
      <div
        className={`relative flex min-h-[320px] flex-col items-center justify-center border-2 border-dashed transition ${
          dragging
            ? "border-green-600 bg-green-50"
            : "border-slate-300 bg-white"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) =>
            handleFiles(e.target.files)
          }
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="h-12 w-12 animate-spin text-green-700" />

            <div className="text-center">
              <p className="font-medium text-slate-900">
                Uploading image...
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Please wait while your file is uploaded.
              </p>
            </div>
          </div>
        ) : value ? (
          <div className="w-full p-6">
            <div className="relative mx-auto aspect-square max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <Image
                src={value.fileUrl}
                alt={
                  value.altText ??
                  value.title ??
                  value.fileName
                }
                fill
                className="object-cover"
              />
            </div>

            <div className="mt-6 text-center">
              <p className="font-semibold text-slate-900">
                {value.title ?? value.fileName}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {value.mimeType ?? "-"}
              </p>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  inputRef.current?.click()
                }
              >
                <Upload className="mr-2 h-4 w-4" />
                Replace
              </Button>

              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onRemove}
                >
                  <X className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center px-8 py-12 text-center">
            <div className="rounded-full bg-green-100 p-5">
              <ImageIcon className="h-10 w-10 text-green-700" />
            </div>

            <h3 className="mt-6 text-xl font-semibold text-slate-900">
              Upload Product Image
            </h3>

            <p className="mt-3 max-w-md text-slate-500">
              Drag & drop an image here or browse your
              computer to upload.
            </p>

            <Button
              type="button"
              variant="primary"
              className="mt-8"
              onClick={() =>
                inputRef.current?.click()
              }
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose Image
            </Button>

            <p className="mt-4 text-xs text-slate-400">
              Supported formats: JPG, PNG, WEBP • Maximum{" "}
              {maxSizeMB} MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="border-t border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </Card>
  );
}

 