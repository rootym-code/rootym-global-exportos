-- CreateEnum
CREATE TYPE "GoogleIntegrationStatus" AS ENUM ('CONNECTED', 'DISCONNECTED', 'ERROR');

-- CreateTable
CREATE TABLE "GoogleIntegration" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "googleAccountId" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3),
    "scopes" TEXT,
    "status" "GoogleIntegrationStatus" NOT NULL DEFAULT 'CONNECTED',
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleIntegration_tenantId_key" ON "GoogleIntegration"("tenantId");

-- CreateIndex
CREATE INDEX "GoogleIntegration_status_idx" ON "GoogleIntegration"("status");

-- CreateIndex
CREATE INDEX "GoogleIntegration_googleAccountId_idx" ON "GoogleIntegration"("googleAccountId");

-- CreateIndex
CREATE INDEX "GoogleIntegration_email_idx" ON "GoogleIntegration"("email");

-- AddForeignKey
ALTER TABLE "GoogleIntegration" ADD CONSTRAINT "GoogleIntegration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
