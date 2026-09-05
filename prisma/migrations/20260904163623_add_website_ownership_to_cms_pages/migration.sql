/*
  Warnings:

  - Added the required column `websiteId` to the `CmsPage` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Website_isActive_idx";

-- AlterTable
ALTER TABLE "CmsPage" ADD COLUMN     "websiteId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "CmsPage_websiteId_idx" ON "CmsPage"("websiteId");

-- AddForeignKey
ALTER TABLE "CmsPage" ADD CONSTRAINT "CmsPage_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
