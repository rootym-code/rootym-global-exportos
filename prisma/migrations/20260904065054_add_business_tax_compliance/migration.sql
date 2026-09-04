-- CreateTable
CREATE TABLE "BusinessTaxCompliance" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "gstRegistrationType" TEXT,
    "gstExportTreatment" TEXT,
    "defaultTaxRate" DECIMAL(5,2),
    "taxNotes" TEXT,
    "lutBondStatus" TEXT,
    "lutBondNumber" TEXT,
    "lutBondFinancialYear" TEXT,
    "lutBondIssueDate" TIMESTAMP(3),
    "lutBondExpiryDate" TIMESTAMP(3),
    "tdsApplicable" BOOLEAN NOT NULL DEFAULT false,
    "tdsNotes" TEXT,
    "tcsApplicable" BOOLEAN NOT NULL DEFAULT false,
    "tcsNotes" TEXT,
    "complianceStatus" TEXT,
    "nextComplianceDate" TIMESTAMP(3),
    "complianceNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessTaxCompliance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessTaxCompliance_tenantId_key" ON "BusinessTaxCompliance"("tenantId");

-- CreateIndex
CREATE INDEX "BusinessTaxCompliance_lutBondNumber_idx" ON "BusinessTaxCompliance"("lutBondNumber");

-- CreateIndex
CREATE INDEX "BusinessTaxCompliance_nextComplianceDate_idx" ON "BusinessTaxCompliance"("nextComplianceDate");

-- CreateIndex
CREATE INDEX "BusinessTaxCompliance_complianceStatus_idx" ON "BusinessTaxCompliance"("complianceStatus");

-- AddForeignKey
ALTER TABLE "BusinessTaxCompliance" ADD CONSTRAINT "BusinessTaxCompliance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
