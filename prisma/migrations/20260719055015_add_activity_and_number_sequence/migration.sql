-- CreateEnum
CREATE TYPE "SalesStage" AS ENUM ('NEW', 'QUALIFIED', 'QUOTE_PREPARING', 'QUOTE_SENT', 'NEGOTIATION', 'PO_RECEIVED', 'ORDER_CONFIRMED', 'CLOSED_WON', 'CLOSED_LOST');

-- CreateEnum
CREATE TYPE "ActivityEntityType" AS ENUM ('INQUIRY', 'QUOTE', 'ORDER', 'SHIPMENT', 'PRODUCT', 'CUSTOMER', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "ActivityActorType" AS ENUM ('ADMIN', 'CUSTOMER', 'SYSTEM', 'AI');

-- CreateEnum
CREATE TYPE "NumberSequenceType" AS ENUM ('INQUIRY', 'QUOTE', 'ORDER', 'SHIPMENT', 'INVOICE', 'CUSTOMER', 'SUPPLIER');

-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "salesStage" "SalesStage" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "parentQuoteId" TEXT,
ADD COLUMN     "validUntil" TIMESTAMP(3),
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "entityType" "ActivityEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityNumber" TEXT,
    "action" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "actorType" "ActivityActorType" NOT NULL DEFAULT 'ADMIN',
    "performedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NumberSequence" (
    "id" TEXT NOT NULL,
    "type" "NumberSequenceType" NOT NULL,
    "year" INTEGER NOT NULL,
    "lastValue" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NumberSequence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Activity_entityType_entityId_idx" ON "Activity"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Activity_entityNumber_idx" ON "Activity"("entityNumber");

-- CreateIndex
CREATE INDEX "Activity_action_idx" ON "Activity"("action");

-- CreateIndex
CREATE INDEX "Activity_actorType_idx" ON "Activity"("actorType");

-- CreateIndex
CREATE INDEX "Activity_performedById_idx" ON "Activity"("performedById");

-- CreateIndex
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt");

-- CreateIndex
CREATE INDEX "NumberSequence_type_idx" ON "NumberSequence"("type");

-- CreateIndex
CREATE INDEX "NumberSequence_year_idx" ON "NumberSequence"("year");

-- CreateIndex
CREATE UNIQUE INDEX "NumberSequence_type_year_key" ON "NumberSequence"("type", "year");

-- CreateIndex
CREATE INDEX "Inquiry_salesStage_idx" ON "Inquiry"("salesStage");

-- CreateIndex
CREATE INDEX "Quote_parentQuoteId_idx" ON "Quote"("parentQuoteId");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_parentQuoteId_fkey" FOREIGN KEY ("parentQuoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
