-- CreateEnum
CREATE TYPE "BillingEnvironment" AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION');

-- CreateTable
CREATE TABLE "BillingProviderConfig" (
    "id" TEXT NOT NULL,
    "environment" "BillingEnvironment" NOT NULL,
    "provider" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "displayName" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingProviderConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BillingProviderConfig_environment_idx" ON "BillingProviderConfig"("environment");

-- CreateIndex
CREATE INDEX "BillingProviderConfig_environment_enabled_idx" ON "BillingProviderConfig"("environment", "enabled");

-- CreateIndex
CREATE INDEX "BillingProviderConfig_provider_idx" ON "BillingProviderConfig"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "BillingProviderConfig_environment_provider_key" ON "BillingProviderConfig"("environment", "provider");
