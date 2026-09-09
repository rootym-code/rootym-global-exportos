-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "specificationDocumentId" TEXT;

-- CreateIndex
CREATE INDEX "Product_specificationDocumentId_idx" ON "Product"("specificationDocumentId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_specificationDocumentId_fkey" FOREIGN KEY ("specificationDocumentId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
