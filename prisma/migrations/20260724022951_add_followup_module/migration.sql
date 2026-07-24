-- CreateEnum
CREATE TYPE "FollowUpStatus" AS ENUM ('PENDING', 'COMPLETED', 'MISSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FollowUpPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "FollowUpActionType" AS ENUM ('CALL', 'WHATSAPP', 'EMAIL', 'QUOTATION', 'MEETING', 'SAMPLE', 'PAYMENT', 'DOCUMENTATION', 'SHIPMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "FollowUpResult" AS ENUM ('BUYER_RESPONDED', 'NO_ANSWER', 'BUSY', 'FOLLOWUP_REQUIRED', 'DEAL_CLOSED', 'NOT_INTERESTED');

-- CreateEnum
CREATE TYPE "FollowUpCategory" AS ENUM ('SALES', 'NEGOTIATION', 'PAYMENT', 'DOCUMENTATION', 'SHIPMENT', 'GENERAL');

-- CreateTable
CREATE TABLE "FollowUp" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "completedById" TEXT,
    "sequence" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "notes" TEXT,
    "actionType" "FollowUpActionType" NOT NULL,
    "category" "FollowUpCategory" NOT NULL,
    "priority" "FollowUpPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "FollowUpStatus" NOT NULL DEFAULT 'PENDING',
    "result" "FollowUpResult",
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "dueAt" TIMESTAMP(3),
    "estimatedMinutes" INTEGER,
    "actualMinutes" INTEGER,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FollowUp_inquiryId_idx" ON "FollowUp"("inquiryId");

-- CreateIndex
CREATE INDEX "FollowUp_assignedToId_idx" ON "FollowUp"("assignedToId");

-- CreateIndex
CREATE INDEX "FollowUp_status_idx" ON "FollowUp"("status");

-- CreateIndex
CREATE INDEX "FollowUp_scheduledAt_idx" ON "FollowUp"("scheduledAt");

-- CreateIndex
CREATE INDEX "FollowUp_priority_idx" ON "FollowUp"("priority");

-- CreateIndex
CREATE INDEX "FollowUp_category_idx" ON "FollowUp"("category");

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
