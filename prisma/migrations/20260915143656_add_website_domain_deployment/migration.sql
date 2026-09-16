-- CreateEnum
CREATE TYPE "WebsiteDomainVerificationStatus" AS ENUM ('PENDING', 'VERIFYING', 'VERIFIED', 'FAILED');

-- CreateEnum
CREATE TYPE "WebsiteDomainVerificationMethod" AS ENUM ('DNS');

-- CreateEnum
CREATE TYPE "WebsiteDomainSslStatus" AS ENUM ('NOT_CONFIGURED', 'PENDING', 'ACTIVE', 'EXPIRED', 'FAILED');

-- CreateEnum
CREATE TYPE "WebsiteDomainDeploymentStatus" AS ENUM ('NOT_DEPLOYED', 'READY', 'DEPLOYING', 'LIVE', 'FAILED', 'DISABLED');

-- CreateTable
CREATE TABLE "WebsiteDomain" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "label" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" "WebsiteDomainVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verificationMethod" "WebsiteDomainVerificationMethod" NOT NULL DEFAULT 'DNS',
    "verificationToken" TEXT,
    "verificationRecordType" TEXT,
    "verificationRecordName" TEXT,
    "verificationRecordValue" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "sslStatus" "WebsiteDomainSslStatus" NOT NULL DEFAULT 'NOT_CONFIGURED',
    "sslIssuedAt" TIMESTAMP(3),
    "sslExpiresAt" TIMESTAMP(3),
    "deploymentStatus" "WebsiteDomainDeploymentStatus" NOT NULL DEFAULT 'NOT_DEPLOYED',
    "lastDeploymentAt" TIMESTAMP(3),
    "lastCheckedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteDomain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteDomain_domain_key" ON "WebsiteDomain"("domain");

-- CreateIndex
CREATE INDEX "WebsiteDomain_websiteId_idx" ON "WebsiteDomain"("websiteId");

-- CreateIndex
CREATE INDEX "WebsiteDomain_websiteId_isPrimary_idx" ON "WebsiteDomain"("websiteId", "isPrimary");

-- CreateIndex
CREATE INDEX "WebsiteDomain_verificationStatus_idx" ON "WebsiteDomain"("verificationStatus");

-- CreateIndex
CREATE INDEX "WebsiteDomain_sslStatus_idx" ON "WebsiteDomain"("sslStatus");

-- CreateIndex
CREATE INDEX "WebsiteDomain_deploymentStatus_idx" ON "WebsiteDomain"("deploymentStatus");

-- CreateIndex
CREATE INDEX "WebsiteDomain_verifiedAt_idx" ON "WebsiteDomain"("verifiedAt");

-- AddForeignKey
ALTER TABLE "WebsiteDomain" ADD CONSTRAINT "WebsiteDomain_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
