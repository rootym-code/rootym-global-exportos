-- CreateTable
CREATE TABLE "BusinessExportCredentials" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "iecNumber" TEXT,
    "iecStatus" TEXT,
    "iecIssueDate" TIMESTAMP(3),
    "dgftProfileUrl" TEXT,
    "gstin" TEXT,
    "gstStatus" TEXT,
    "gstRegistrationDate" TIMESTAMP(3),
    "udyamNumber" TEXT,
    "udyamStatus" TEXT,
    "udyamRegistrationDate" TIMESTAMP(3),
    "adCode" TEXT,
    "adCodeStatus" TEXT,
    "adCodeBankName" TEXT,
    "icegateRegistrationId" TEXT,
    "icegateStatus" TEXT,
    "rcmcNumber" TEXT,
    "rcmcIssuingAuthority" TEXT,
    "rcmcStatus" TEXT,
    "rcmcIssueDate" TIMESTAMP(3),
    "rcmcExpiryDate" TIMESTAMP(3),
    "otherLicense1Name" TEXT,
    "otherLicense1Number" TEXT,
    "otherLicense1Status" TEXT,
    "otherLicense1ExpiryDate" TIMESTAMP(3),
    "otherLicense2Name" TEXT,
    "otherLicense2Number" TEXT,
    "otherLicense2Status" TEXT,
    "otherLicense2ExpiryDate" TIMESTAMP(3),
    "otherLicense3Name" TEXT,
    "otherLicense3Number" TEXT,
    "otherLicense3Status" TEXT,
    "otherLicense3ExpiryDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessExportCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessExportCredentials_tenantId_key" ON "BusinessExportCredentials"("tenantId");

-- CreateIndex
CREATE INDEX "BusinessExportCredentials_iecNumber_idx" ON "BusinessExportCredentials"("iecNumber");

-- CreateIndex
CREATE INDEX "BusinessExportCredentials_gstin_idx" ON "BusinessExportCredentials"("gstin");

-- CreateIndex
CREATE INDEX "BusinessExportCredentials_udyamNumber_idx" ON "BusinessExportCredentials"("udyamNumber");

-- CreateIndex
CREATE INDEX "BusinessExportCredentials_adCode_idx" ON "BusinessExportCredentials"("adCode");

-- CreateIndex
CREATE INDEX "BusinessExportCredentials_icegateRegistrationId_idx" ON "BusinessExportCredentials"("icegateRegistrationId");

-- CreateIndex
CREATE INDEX "BusinessExportCredentials_rcmcNumber_idx" ON "BusinessExportCredentials"("rcmcNumber");

-- AddForeignKey
ALTER TABLE "BusinessExportCredentials" ADD CONSTRAINT "BusinessExportCredentials_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
