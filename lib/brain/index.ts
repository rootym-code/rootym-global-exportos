/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/index.ts
 *
 * Brain Module Entry Point
 * ============================================================
 */

export * from "./types";
export * from "./constants";
export * from "./context";
export * from "./logger";
export * from "./registry";
export * from "./engine";

/**
 * Inquiry Brain
 */
export * from "./inquiry";

/**
 * Register all Brain modules.
 */
import { registerInquiryBrain } from "./inquiry";

registerInquiryBrain();