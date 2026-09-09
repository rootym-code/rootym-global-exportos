/*
  Warnings:

  - A unique constraint covering the columns `[websiteId,sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[websiteId,slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Product_sku_key";

-- DropIndex
DROP INDEX "Product_slug_key";

-- DropIndex
DROP INDEX "Product_status_idx";

-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "websiteId" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "websiteId" TEXT;

-- AlterTable
ALTER TABLE "ProformaInvoice" ADD COLUMN     "websiteId" TEXT;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "websiteId" TEXT;

-- CreateIndex
CREATE INDEX "Inquiry_websiteId_idx" ON "Inquiry"("websiteId");

-- CreateIndex
CREATE INDEX "Product_websiteId_idx" ON "Product"("websiteId");

-- CreateIndex
CREATE INDEX "Product_websiteId_status_idx" ON "Product"("websiteId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Product_websiteId_sku_key" ON "Product"("websiteId", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_websiteId_slug_key" ON "Product"("websiteId", "slug");

-- CreateIndex
CREATE INDEX "ProformaInvoice_websiteId_idx" ON "ProformaInvoice"("websiteId");

-- CreateIndex
CREATE INDEX "Quote_websiteId_idx" ON "Quote"("websiteId");

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoice" ADD CONSTRAINT "ProformaInvoice_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE SET NULL ON UPDATE CASCADE;
