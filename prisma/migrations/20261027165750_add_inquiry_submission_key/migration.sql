/*
  Warnings:

  - A unique constraint covering the columns `[submissionKey]` on the table `Inquiry` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "submissionKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Inquiry_submissionKey_key" ON "Inquiry"("submissionKey");
