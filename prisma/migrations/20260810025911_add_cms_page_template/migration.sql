-- CreateEnum
CREATE TYPE "CmsPageTemplate" AS ENUM ('STANDARD', 'COUNTRY_LANDING');

-- AlterTable
ALTER TABLE "CmsPage" ADD COLUMN     "template" "CmsPageTemplate" NOT NULL DEFAULT 'STANDARD';
