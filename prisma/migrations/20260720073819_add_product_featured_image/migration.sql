-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "featuredImageId" TEXT;

-- CreateIndex
CREATE INDEX "Product_featuredImageId_idx" ON "Product"("featuredImageId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_featuredImageId_fkey" FOREIGN KEY ("featuredImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
