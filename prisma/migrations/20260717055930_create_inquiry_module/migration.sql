/*
  Warnings:

  - The values [QUOTED,WON,LOST,CLOSED] on the enum `InquiryStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[inquiryNumber]` on the table `Inquiry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inquiryNumber` to the `Inquiry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InquiryStatus_new" AS ENUM ('NEW', 'CONTACTED', 'QUOTATION_SENT', 'NEGOTIATION', 'CONFIRMED', 'REJECTED');
ALTER TABLE "public"."Inquiry" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Inquiry" ALTER COLUMN "status" TYPE "InquiryStatus_new" USING ("status"::text::"InquiryStatus_new");
ALTER TYPE "InquiryStatus" RENAME TO "InquiryStatus_old";
ALTER TYPE "InquiryStatus_new" RENAME TO "InquiryStatus";
DROP TYPE "public"."InquiryStatus_old";
ALTER TABLE "Inquiry" ALTER COLUMN "status" SET DEFAULT 'NEW';
COMMIT;

-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "inquiryNumber" TEXT NOT NULL,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "unit" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Inquiry_inquiryNumber_key" ON "Inquiry"("inquiryNumber");

-- CreateIndex
CREATE INDEX "Inquiry_inquiryNumber_idx" ON "Inquiry"("inquiryNumber");

-- CreateIndex
CREATE INDEX "Inquiry_email_idx" ON "Inquiry"("email");
