/*
  Warnings:

  - The values [PENDING_APPROVAL] on the enum `WhatsAppMessageStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `approvedById` on the `WhatsAppMessage` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryStatus` on the `WhatsAppMessage` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappMessageId` on the `WhatsAppMessage` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- AlterEnum
BEGIN;
CREATE TYPE "WhatsAppMessageStatus_new" AS ENUM ('DRAFT', 'APPROVED', 'QUEUED', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'REJECTED');
ALTER TABLE "public"."WhatsAppMessage" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "WhatsAppMessage" ALTER COLUMN "status" TYPE "WhatsAppMessageStatus_new" USING ("status"::text::"WhatsAppMessageStatus_new");
ALTER TYPE "WhatsAppMessageStatus" RENAME TO "WhatsAppMessageStatus_old";
ALTER TYPE "WhatsAppMessageStatus_new" RENAME TO "WhatsAppMessageStatus";
DROP TYPE "public"."WhatsAppMessageStatus_old";
ALTER TABLE "WhatsAppMessage" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- DropForeignKey
ALTER TABLE "WhatsAppMessage" DROP CONSTRAINT "WhatsAppMessage_approvedById_fkey";

-- AlterTable
ALTER TABLE "WhatsAppMessage" DROP COLUMN "approvedById",
DROP COLUMN "deliveryStatus",
DROP COLUMN "whatsappMessageId",
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "direction" "MessageDirection" NOT NULL DEFAULT 'OUTBOUND',
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "failedAt" TIMESTAMP(3),
ADD COLUMN     "queuedAt" TIMESTAMP(3),
ADD COLUMN     "readAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- CreateIndex
CREATE INDEX "WhatsAppMessage_direction_idx" ON "WhatsAppMessage"("direction");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_externalId_idx" ON "WhatsAppMessage"("externalId");
