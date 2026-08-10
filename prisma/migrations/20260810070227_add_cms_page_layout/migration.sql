-- CreateEnum
CREATE TYPE "CmsPageLayout" AS ENUM ('WEBSITE', 'STANDALONE');

-- AlterTable
ALTER TABLE "CmsPage" ADD COLUMN     "layout" "CmsPageLayout" NOT NULL DEFAULT 'WEBSITE';
