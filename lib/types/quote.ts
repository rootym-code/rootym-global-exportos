/**
 * ============================================================
 * ROOTYM
 * File: lib/types/quote.ts
 * Sprint 8.1
 * ============================================================
 */

export type QuoteStatus =
  | "DRAFT"
  | "SENT"
  | "VIEWED"
  | "NEGOTIATION"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

export interface QuoteItem {
  id: string;

  productId: string;

  description?: string | null;

  quantity: number;

  unit: string;

  unitPrice: number;

  lineTotal: number;

  createdAt?: string;

  updatedAt?: string;

  product?: {
    id: string;
    name: string;
    sku?: string | null;
    unit?: string | null;
  };
}

export interface Quote {
  id: string;

  quoteNumber: string;

  inquiryId?: string | null;

  companyName: string;

  contactPerson: string;

  email: string;

  phone?: string | null;

  country: string;

  currency: string;

  subtotal: number;

  discount: number;

  freight: number;

  insurance: number;

  tax: number;

  grandTotal: number;

  validityDays: number;

  status: QuoteStatus;

  notes?: string | null;

  createdById?: string | null;

  updatedById?: string | null;

  createdAt: string;

  updatedAt: string;

  items: QuoteItem[];
}

export interface QuoteListResponse {
  items: Quote[];

  total: number;

  page: number;

  pageSize: number;

  totalPages: number;
}

export interface QuoteFilter {
  search?: string;

  status?: QuoteStatus | "";

  page?: number;

  pageSize?: number;
}

export interface QuoteSendRequest {
  to: string;

  cc?: string;

  subject: string;

  message: string;
}

export interface QuoteStatusRequest {
  status: QuoteStatus;

  remarks?: string;
}