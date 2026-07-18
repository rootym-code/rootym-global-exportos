/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/constants.ts
 * ------------------------------------------------------------
 * Shared constants used by the ROOTYM Brain Engine.
 * ============================================================
 */

import type {
    BrainAction,
    BrainDecision,
    BrainModule,
    BrainStatus,
  } from "./types";
  
  /* -------------------------------------------------------------------------- */
  /* Default Values                                                             */
  /* -------------------------------------------------------------------------- */
  
  export const DEFAULT_BRAIN_MODULE: BrainModule = "SYSTEM";
  
  export const DEFAULT_BRAIN_DECISION: BrainDecision = "APPROVED";
  
  export const DEFAULT_BRAIN_STATUS: BrainStatus = "SUCCESS";
  
  /* -------------------------------------------------------------------------- */
  /* Supported Actions                                                          */
  /* -------------------------------------------------------------------------- */
  
  export const BRAIN_ACTIONS: readonly BrainAction[] = [
    "CREATE_INQUIRY",
    "UPDATE_INQUIRY",
    "DELETE_INQUIRY",
  
    "CREATE_CUSTOMER",
    "UPDATE_CUSTOMER",
  
    "CREATE_QUOTE",
    "UPDATE_QUOTE",
  
    "CREATE_PRODUCT",
    "UPDATE_PRODUCT",
  
    "SEND_NOTIFICATION",
  
    "GENERATE_ANALYTICS",
  ] as const;
  
  /* -------------------------------------------------------------------------- */
  /* Modules                                                                    */
  /* -------------------------------------------------------------------------- */
  
  export const BRAIN_MODULES: readonly BrainModule[] = [
    "SYSTEM",
    "INQUIRY",
    "CUSTOMER",
    "PRODUCT",
    "QUOTE",
    "PRICING",
    "INVENTORY",
    "NOTIFICATION",
    "ANALYTICS",
  ] as const;
  
  /* -------------------------------------------------------------------------- */
  /* Status                                                                      */
  /* -------------------------------------------------------------------------- */
  
  export const BRAIN_STATUSES: readonly BrainStatus[] = [
    "SUCCESS",
    "FAILED",
    "WARNING",
  ] as const;
  
  /* -------------------------------------------------------------------------- */
  /* Decisions                                                                   */
  /* -------------------------------------------------------------------------- */
  
  export const BRAIN_DECISIONS: readonly BrainDecision[] = [
    "APPROVED",
    "REJECTED",
    "PENDING",
    "MANUAL_REVIEW",
  ] as const;
  
  /* -------------------------------------------------------------------------- */
  /* Metadata Keys                                                               */
  /* -------------------------------------------------------------------------- */
  
  export const BRAIN_METADATA_KEYS = {
    REQUEST_ID: "requestId",
    SOURCE: "source",
    ACTOR: "actor",
    MODULE: "module",
    ACTION: "action",
  } as const;
  
  /* -------------------------------------------------------------------------- */
  /* Timing                                                                      */
  /* -------------------------------------------------------------------------- */
  
  export const BRAIN_DEFAULT_TIMEOUT_MS = 30_000;
  
  export const BRAIN_VERSION = "1.0.0";