-- CreateEnum
CREATE TYPE "WhatsAppIntegrationStatus" AS ENUM ('CONNECTED', 'DISCONNECTED', 'ERROR');

-- CreateTable
CREATE TABLE "WhatsAppIntegration" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "businessAccountId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "displayPhoneNumber" TEXT,
    "verifiedName" TEXT,
    "status" "WhatsAppIntegrationStatus" NOT NULL DEFAULT 'CONNECTED',
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppIntegration_tenantId_key" ON "WhatsAppIntegration"("tenantId");

-- CreateIndex
CREATE INDEX "WhatsAppIntegration_status_idx" ON "WhatsAppIntegration"("status");

-- CreateIndex
CREATE INDEX "WhatsAppIntegration_businessAccountId_idx" ON "WhatsAppIntegration"("businessAccountId");

-- CreateIndex
CREATE INDEX "WhatsAppIntegration_phoneNumberId_idx" ON "WhatsAppIntegration"("phoneNumberId");

-- AddForeignKey
ALTER TABLE "WhatsAppIntegration" ADD CONSTRAINT "WhatsAppIntegration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
