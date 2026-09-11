/**
 * ROOTYM Global ExportOS
 * Author: Prem Singh
 * Purpose: Adds buyer GST and address snapshots to shared quotation
 *          and Proforma Invoice records.
 */

ALTER TABLE "Quote"
  ADD COLUMN "buyerAddress" TEXT,
  ADD COLUMN "buyerGstin" TEXT;

ALTER TABLE "ProformaInvoice"
  ADD COLUMN "buyerAddress" TEXT,
  ADD COLUMN "buyerGstin" TEXT;
