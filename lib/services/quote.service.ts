/**
 * ============================================================================
 * Project      : ROOTYM Global Export Platform
 * Organization : ROOTYM AGRO HARVEST PRIVATE LIMITED
 * Module       : Quote Management
 * Feature      : Quote API Client
 * File         : lib/services/quote.service.ts
 * Version      : 2.0.0
 *
 * Description:
 * Client-side service responsible for communicating with the Quote
 * Management API. This service should only contain HTTP communication
 * logic and must not contain business rules.
 *
 * Responsibilities
 * ----------------
 * • Retrieve quote list
 * • Retrieve quote details
 * • Create quote
 * • Update quote
 * • Delete quote
 * • Change quote status
 * • Create quote revision
 * • Send quote
 * • Retrieve activity timeline
 * • PDF download helpers
 *
 * Notes
 * -----
 * Business logic, calculations, versioning and Prisma transactions belong
 * to the server-side business service and NOT in this client.
 * ============================================================================
 */

import type {
  Activity,
  Quote,
  QuoteStatus,
} from "@/lib/generated/prisma";

/* ============================================================================
 * CONSTANTS
 * ========================================================================== */

const API_BASE = "/api/admin/quotes";

/* ============================================================================
 * RESPONSE TYPES
 * ========================================================================== */

export interface QuoteListResponse {
  items: Quote[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/* ============================================================================
 * QUERY PARAMETERS
 * ========================================================================== */

export interface QuoteListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

/* ============================================================================
 * REQUEST PAYLOADS
 * ========================================================================== */

export interface CreateQuotePayload {
  inquiryId?: string;

  companyName: string;
  contactPerson: string;
  email: string;

  phone?: string;
  country: string;

  currency: string;

  items: unknown[];

  notes?: string;

  validityDays?: number;
}

export interface UpdateQuotePayload
  extends Partial<CreateQuotePayload> {}

export interface SendQuotePayload {
  to: string;
  cc?: string;
  subject: string;
  message: string;
}

export interface ChangeStatusPayload {
  status: QuoteStatus;
  remarks?: string;
}

/* ============================================================================
 * QUOTE SERVICE
 * ========================================================================== */

class QuoteService {
  /**
   * ------------------------------------------------------------------------
   * Generic HTTP Request Helper
   * ------------------------------------------------------------------------
   */
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
      } catch {
        // Ignore JSON parsing errors.
      }

      throw new Error(message);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  /* ========================================================================
   * CRUD OPERATIONS
   * ====================================================================== */

  async list(
    params: QuoteListParams = {}
  ): Promise<QuoteListResponse> {
    const query = new URLSearchParams();

    if (params.page) {
      query.set("page", String(params.page));
    }

    if (params.pageSize) {
      query.set(
        "pageSize",
        String(params.pageSize)
      );
    }

    if (params.search) {
      query.set("search", params.search);
    }

    if (params.status) {
      query.set("status", params.status);
    }

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
    payload: CreateQuotePayload
  ): Promise<Quote> {
    return this.request<Quote>(
      API_BASE,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  }

  async update(
    id: string,
    payload: UpdateQuotePayload
  ): Promise<Quote> {
    return this.request<Quote>(
      `${API_BASE}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  }

  async delete(id: string): Promise<void> {
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
    /* ==========================================================================
   * QUOTE VERSIONING
   * ======================================================================== */

  /**
   * --------------------------------------------------------------------------
   * Create Quote Revision
   * --------------------------------------------------------------------------
   * Creates a new version of an existing quote.
   */
  async createRevision(id: string): Promise<Quote> {
    return this.request<Quote>(
      `${API_BASE}/${id}/revision`,
      {
        method: "POST",
      }
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Duplicate Quote
   * --------------------------------------------------------------------------
   * Creates a copy of the selected quote.
   */
  async duplicate(id: string): Promise<Quote> {
    return this.request<Quote>(
      `${API_BASE}/${id}/duplicate`,
      {
        method: "POST",
      }
    );
  }

  /* ==========================================================================
   * QUOTE COMMUNICATION
   * ======================================================================== */

  /**
   * --------------------------------------------------------------------------
   * Send Quote
   * --------------------------------------------------------------------------
   * Sends the quotation email to the customer.
   */
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

  /* ==========================================================================
   * ACTIVITY TIMELINE
   * ======================================================================== */

  /**
   * --------------------------------------------------------------------------
   * Get Quote Timeline
   * --------------------------------------------------------------------------
   * Returns the complete activity history for a quote.
   */
  async getTimeline(id: string): Promise<Activity[]> {
    return this.request<Activity[]>(
      `${API_BASE}/${id}/timeline`
    );
  }

  /* ==========================================================================
   * PDF HELPERS
   * ======================================================================== */

  /**
   * Returns the PDF endpoint for the quote.
   */
  getPdfUrl(id: string): string {
    return `${API_BASE}/${id}/pdf`;
  }

  /**
   * Opens the quote PDF in a new browser tab.
   */
  downloadPdf(id: string): void {
    window.open(
      this.getPdfUrl(id),
      "_blank",
      "noopener,noreferrer"
    );
  }
}

/* ============================================================================
 * SINGLETON EXPORT
 * ============================================================================
 *
 * A single shared client instance is exported for use across the
 * application, ensuring consistent API communication.
 * ========================================================================== */

export const quoteService = new QuoteService();

export default quoteService;