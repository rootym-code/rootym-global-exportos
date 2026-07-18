/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/types.ts
 * ------------------------------------------------------------
 * Core type definitions for the ROOTYM Brain Engine.
 * ============================================================
 */

import type { BrainContext } from "./context";

export type BrainAction =
  | "CREATE_INQUIRY"
  | "UPDATE_INQUIRY"
  | "DELETE_INQUIRY"
  | "CREATE_CUSTOMER"
  | "UPDATE_CUSTOMER"
  | "CREATE_QUOTE"
  | "UPDATE_QUOTE"
  | "CREATE_PRODUCT"
  | "UPDATE_PRODUCT"
  | "SEND_NOTIFICATION"
  | "GENERATE_ANALYTICS";

export type BrainModule =
  | "INQUIRY"
  | "CUSTOMER"
  | "PRODUCT"
  | "QUOTE"
  | "PRICING"
  | "INVENTORY"
  | "NOTIFICATION"
  | "ANALYTICS"
  | "SYSTEM";

export type BrainDecision =
  | "APPROVED"
  | "REJECTED"
  | "PENDING"
  | "MANUAL_REVIEW";

export type BrainStatus =
  | "SUCCESS"
  | "FAILED"
  | "WARNING";

export interface BrainExecution<TPayload = unknown> {
  action: BrainAction;
  payload: TPayload;
  context?: Partial<BrainContext>;
}

export interface BrainResult<TResult = unknown> {
  success: boolean;

  status: BrainStatus;

  decision: BrainDecision;

  action: BrainAction;

  module: BrainModule;

  data?: TResult;

  message?: string;

  errors?: string[];

  warnings?: string[];

  metadata?: Record<string, unknown>;

  executedAt: Date;

  duration: number;
}

export interface BrainEvent {
  id: string;

  action: BrainAction;

  module: BrainModule;

  occurredAt: Date;

  payload?: unknown;
}

export interface BrainLogEntry {
  level: "INFO" | "WARN" | "ERROR";

  action: BrainAction;

  module: BrainModule;

  message: string;

  timestamp: Date;

  metadata?: Record<string, unknown>;
}

export interface BrainRegistryItem<
  TPayload = unknown,
  TResult = unknown,
> {
  action: BrainAction;

  module: BrainModule;

  handler: {
    execute(
      payload: TPayload,
      context: BrainContext,
    ): Promise<TResult>;
  };
}