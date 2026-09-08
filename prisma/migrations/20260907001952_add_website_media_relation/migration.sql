-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "websiteId" TEXT;

-- CreateIndex
CREATE INDEX "Media_websiteId_idx" ON "Media"("websiteId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE SET NULL ON UPDATE CASCADE;
