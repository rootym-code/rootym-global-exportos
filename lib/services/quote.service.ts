/**
 * ============================================================
 * ROOTYM
 * File: lib/services/quote.service.ts
 * Sprint 8.1
 * ============================================================
 */

import type {
  Quote,
  QuoteStatus,
} from "@/lib/generated/prisma";

const API_BASE = "/api/admin/quotes";

export interface QuoteListResponse {
  items: Quote[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface QuoteListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export interface SendQuotePayload {
  to: string;
  cc?: string;
  subject: string;
  message: string;
}

class QuoteService {
  private async request<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
      ...options,
    });

    if (!response.ok) {
      let message = "Request failed.";

      try {
        const body = await response.json();
        message =
          body.message ??
          body.error ??
          message;
      } catch {}

      throw new Error(message);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async list(
    params: QuoteListParams = {}
  ): Promise<QuoteListResponse> {
    const query = new URLSearchParams();

    if (params.page)
      query.set("page", String(params.page));

    if (params.pageSize)
      query.set(
        "pageSize",
        String(params.pageSize)
      );

    if (params.search)
      query.set("search", params.search);

    if (params.status)
      query.set("status", params.status);

    return this.request<QuoteListResponse>(
      `${API_BASE}?${query.toString()}`
    );
  }

  async get(id: string): Promise<Quote> {
    return this.request<Quote>(
      `${API_BASE}/${id}`
    );
  }

  async create(
    payload: unknown
  ): Promise<Quote> {
    return this.request<Quote>(API_BASE, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async update(
    id: string,
    payload: unknown
  ): Promise<Quote> {
    return this.request<Quote>(
      `${API_BASE}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  }

  async delete(
    id: string
  ): Promise<void> {
    return this.request<void>(
      `${API_BASE}/${id}`,
      {
        method: "DELETE",
      }
    );
  }

  async changeStatus(
    id: string,
    status: QuoteStatus,
    remarks?: string
  ): Promise<Quote> {
    return this.request<Quote>(
      `${API_BASE}/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status,
          remarks,
        }),
      }
    );
  }

  async duplicate(
    id: string
  ): Promise<Quote> {
    return this.request<Quote>(
      `${API_BASE}/${id}/duplicate`,
      {
        method: "POST",
      }
    );
  }

  async send(
    id: string,
    payload: SendQuotePayload
  ): Promise<void> {
    return this.request<void>(
      `${API_BASE}/${id}/send`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  }

  getPdfUrl(id: string): string {
    return `${API_BASE}/${id}/pdf`;
  }

  downloadPdf(id: string): void {
    window.open(
      this.getPdfUrl(id),
      "_blank",
      "noopener,noreferrer"
    );
  }
}

export const quoteService =
  new QuoteService();