"use client";

/**
 * ============================================================
 * ROOTYM
 * File: lib/hooks/useQuotes.ts
 * Sprint 8.1
 * ============================================================
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  quoteService,
  type QuoteListParams,
  type QuoteListResponse,
  type SendQuotePayload,
} from "@/lib/services/quote.service";

import type {
  Quote,
  QuoteStatus,
} from "@/lib/generated/prisma";

interface UseQuotesState {
  items: Quote[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const DEFAULT_STATE: UseQuotesState = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

export function useQuotes(initial?: QuoteListParams) {
  const [state, setState] =
    useState<UseQuotesState>(DEFAULT_STATE);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [filters, setFilters] =
    useState<QuoteListParams>({
      page: initial?.page ?? 1,
      pageSize: initial?.pageSize ?? 10,
      search: initial?.search ?? "",
      status: initial?.status ?? "",
    });

  const load = useCallback(
    async (
      params: QuoteListParams = filters,
      silent = false
    ) => {
      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const result: QuoteListResponse =
          await quoteService.list(params);

        setState({
          items: result.items,
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: result.totalPages,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load quotes."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    load(filters);
  }, [filters, load]);

  const refresh = useCallback(async () => {
    await load(filters, true);
  }, [filters, load]);

  const updateFilters = useCallback(
    (changes: Partial<QuoteListParams>) => {
      setFilters((previous) => ({
        ...previous,
        ...changes,
      }));
    },
    []
  );

  const remove = useCallback(
    async (id: string) => {
      await quoteService.delete(id);
      await refresh();
    },
    [refresh]
  );

  const duplicate = useCallback(
    async (id: string) => {
      const quote =
        await quoteService.duplicate(id);

      await refresh();

      return quote;
    },
    [refresh]
  );

  const updateStatus = useCallback(
    async (
      id: string,
      status: QuoteStatus,
      remarks?: string
    ) => {
      const quote =
        await quoteService.changeStatus(
          id,
          status,
          remarks
        );

      await refresh();

      return quote;
    },
    [refresh]
  );

  const send = useCallback(
    async (
      id: string,
      payload: SendQuotePayload
    ) => {
      await quoteService.send(id, payload);
    },
    []
  );

  const create = useCallback(
    async (payload: unknown) => {
      const quote =
        await quoteService.create(payload);

      await refresh();

      return quote;
    },
    [refresh]
  );

  const update = useCallback(
    async (
      id: string,
      payload: unknown
    ) => {
      const quote =
        await quoteService.update(
          id,
          payload
        );

      await refresh();

      return quote;
    },
    [refresh]
  );

  return useMemo(
    () => ({
      quotes: state.items,

      total: state.total,

      page: state.page,

      pageSize: state.pageSize,

      totalPages: state.totalPages,

      filters,

      loading,

      refreshing,

      error,

      load,

      refresh,

      updateFilters,

      create,

      update,

      remove,

      duplicate,

      updateStatus,

      send,

      getQuote: quoteService.get,

      getPdfUrl:
        quoteService.getPdfUrl.bind(
          quoteService
        ),

      downloadPdf:
        quoteService.downloadPdf.bind(
          quoteService
        ),
    }),
    [
      state,
      filters,
      loading,
      refreshing,
      error,
      load,
      refresh,
      updateFilters,
      create,
      update,
      remove,
      duplicate,
      updateStatus,
      send,
    ]
  );
}