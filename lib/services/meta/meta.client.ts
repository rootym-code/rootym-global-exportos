/**
 * ============================================================================
 * ROOTYM GLOBAL EXPORT PLATFORM
 * ============================================================================
 * File: lib/services/meta/meta.client.ts
 * Module: Meta WhatsApp Cloud API Client
 *
 * Description:
 * Reusable client for communicating with the Meta WhatsApp Cloud API.
 *
 * Responsibilities:
 * - Build API endpoints
 * - Load Meta configuration
 * - Attach authorization headers
 * - Execute HTTP requests
 * - Handle Meta API errors
 *
 * Design Principles:
 * - Single Responsibility Principle
 * - Centralized HTTP Client
 * - Production Ready
 * ============================================================================
 */

import metaConfig from "@/lib/config/meta";
import metaConfigService from "./meta-config.service";

export interface MetaApiError {
  error?: {
    message?: string;
    type?: string;
    code?: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
}

class MetaClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = `https://graph.facebook.com/${metaConfig.apiVersion}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<T> {
    const config =
      await metaConfigService.getConfiguration();

    const response = await fetch(
      `${this.baseUrl}${endpoint}`,
      {
        ...options,
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          "Content-Type": "application/json",
          ...(options.headers ?? {}),
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const error = data as MetaApiError;

      throw new Error(
        error.error?.message ??
          "Meta WhatsApp API request failed."
      );
    }

    return data as T;
  }

  async post<T>(
    endpoint: string,
    body: unknown
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async get<T>(
    endpoint: string
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
    });
  }
}

const metaClient = new MetaClient();

export default metaClient;