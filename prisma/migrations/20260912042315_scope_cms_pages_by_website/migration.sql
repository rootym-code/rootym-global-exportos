/*
  Warnings:

  - A unique constraint covering the columns `[websiteId,slug]` on the table `CmsPage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CmsPage_slug_key";

-- DropIndex
DROP INDEX "CmsPageTranslation_languageId_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "CmsPage_websiteId_slug_key" ON "CmsPage"("websiteId", "slug");
