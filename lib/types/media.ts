import { MediaType } from "@/lib/generated/prisma";

export interface MediaDto {
  id: string;

  fileName: string;
  storedFileName: string;
  fileUrl: string;

  storageProvider: string | null;
  mimeType: string | null;

  mediaType: MediaType;

  fileSize: number | bigint | null;

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

export interface MediaPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MediaListResponse {
  success: boolean;
  message?: string;

  data: MediaDto[];
  pagination: MediaPagination;
}

export interface MediaUploadResponse {
  success: boolean;
  message?: string;

  data: MediaDto;
}