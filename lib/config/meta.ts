/**
 * ============================================================================
 * ROOTYM GLOBAL EXPORT PLATFORM
 * ============================================================================
 * File: lib/config/meta.ts
 * Module: Meta WhatsApp Cloud API Configuration
 *
 * Description:
 * Centralized configuration for Meta WhatsApp Cloud API.
 *
 * Responsibilities:
 * - Read environment variables
 * - Validate required configuration
 * - Export strongly typed configuration
 *
 * Design Principles:
 * - Single Source of Truth
 * - Fail Fast Configuration Validation
 * - Production Ready
 *
 * Author: ROOTYM Engineering
 * ============================================================================
 */

interface MetaConfig {
    apiVersion: string;
    accessToken: string;
    phoneNumberId: string;
    businessAccountId: string;
    verifyToken: string;
  }
  
  function getRequiredEnv(name: string): string {
    const value = process.env[name];
  
    if (!value || value.trim() === "") {
      throw new Error(
        `Missing required environment variable: ${name}`
      );
    }
  
    return value.trim();
  }
  
  export const metaConfig: MetaConfig = {
    apiVersion:
      process.env.META_API_VERSION?.trim() || "v23.0",
  
    accessToken: getRequiredEnv(
      "META_ACCESS_TOKEN"
    ),
  
    phoneNumberId: getRequiredEnv(
      "META_PHONE_NUMBER_ID"
    ),
  
    businessAccountId: getRequiredEnv(
      "META_BUSINESS_ACCOUNT_ID"
    ),
  
    verifyToken: getRequiredEnv(
      "META_VERIFY_TOKEN"
    ),
  };
  
  export default metaConfig;