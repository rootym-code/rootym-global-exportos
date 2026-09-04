/**
 * ============================================================
 * ROOTYM Business Operating Preferences Validation
 * ============================================================
 * Author: Prem Singh
 * Purpose: Validates tenant-scoped operational, document,
 *          shipment, workflow and working preferences.
 * ============================================================
 */

import { z } from "zod";

const optionalText = z.string().trim().optional().or(z.literal(""));

export const businessOperatingPreferencesSchema = z.object({
  // Order & Export Operations
  defaultOrderProcessingPriority: optionalText,
  defaultShipmentMode: optionalText,
  defaultIncoterm: optionalText,
  defaultPortOfLoading: optionalText,
  defaultDestinationHandling: optionalText,

  allowPartialShipment: z.boolean().optional(),
  allowSplitShipment: z.boolean().optional(),

  // Document Preferences
  defaultDocumentLanguage: optionalText,
  documentNumberingPreference: optionalText,
  invoiceNumberPrefix: optionalText,
  quoteNumberPrefix: optionalText,
  packingListNumberPrefix: optionalText,
  shippingDocumentNumberPrefix: optionalText,
  documentNotes: optionalText,

  // Shipment Preferences
  defaultTransportMode: optionalText,
  defaultShipmentType: optionalText,
  defaultPackageUnit: optionalText,
  defaultWeightUnit: optionalText,
  defaultDimensionUnit: optionalText,
  shipmentHandlingInstructions: optionalText,

  // Communication & Workflow
  defaultCustomerCommunicationChannel: optionalText,

  internalApprovalRequired: z.boolean().optional(),
  orderApprovalRequired: z.boolean().optional(),
  shipmentApprovalRequired: z.boolean().optional(),
  documentApprovalRequired: z.boolean().optional(),

  workflowNotes: optionalText,

  // Business Working Preferences
  businessWorkingDays: optionalText,
  businessTimezone: optionalText,
  defaultDateFormat: optionalText,
  defaultNumberFormat: optionalText,
  operationalNotes: optionalText,
});

export type BusinessOperatingPreferencesInput = z.infer<
  typeof businessOperatingPreferencesSchema
>;