-- CreateTable
CREATE TABLE "BusinessOperatingPreferences" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "defaultOrderProcessingPriority" TEXT,
    "defaultShipmentMode" TEXT,
    "defaultIncoterm" TEXT,
    "defaultPortOfLoading" TEXT,
    "defaultDestinationHandling" TEXT,
    "allowPartialShipment" BOOLEAN NOT NULL DEFAULT false,
    "allowSplitShipment" BOOLEAN NOT NULL DEFAULT false,
    "defaultDocumentLanguage" TEXT,
    "documentNumberingPreference" TEXT,
    "invoiceNumberPrefix" TEXT,
    "quoteNumberPrefix" TEXT,
    "packingListNumberPrefix" TEXT,
    "shippingDocumentNumberPrefix" TEXT,
    "documentNotes" TEXT,
    "defaultTransportMode" TEXT,
    "defaultShipmentType" TEXT,
    "defaultPackageUnit" TEXT,
    "defaultWeightUnit" TEXT,
    "defaultDimensionUnit" TEXT,
    "shipmentHandlingInstructions" TEXT,
    "defaultCustomerCommunicationChannel" TEXT,
    "internalApprovalRequired" BOOLEAN NOT NULL DEFAULT false,
    "orderApprovalRequired" BOOLEAN NOT NULL DEFAULT false,
    "shipmentApprovalRequired" BOOLEAN NOT NULL DEFAULT false,
    "documentApprovalRequired" BOOLEAN NOT NULL DEFAULT false,
    "workflowNotes" TEXT,
    "businessWorkingDays" TEXT,
    "businessTimezone" TEXT,
    "defaultDateFormat" TEXT,
    "defaultNumberFormat" TEXT,
    "operationalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessOperatingPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessOperatingPreferences_tenantId_key" ON "BusinessOperatingPreferences"("tenantId");

-- CreateIndex
CREATE INDEX "BusinessOperatingPreferences_defaultShipmentMode_idx" ON "BusinessOperatingPreferences"("defaultShipmentMode");

-- CreateIndex
CREATE INDEX "BusinessOperatingPreferences_defaultIncoterm_idx" ON "BusinessOperatingPreferences"("defaultIncoterm");

-- CreateIndex
CREATE INDEX "BusinessOperatingPreferences_defaultTransportMode_idx" ON "BusinessOperatingPreferences"("defaultTransportMode");

-- CreateIndex
CREATE INDEX "BusinessOperatingPreferences_businessTimezone_idx" ON "BusinessOperatingPreferences"("businessTimezone");

-- AddForeignKey
ALTER TABLE "BusinessOperatingPreferences" ADD CONSTRAINT "BusinessOperatingPreferences_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
