-- CreateTable
CREATE TABLE "BusinessFinancialSettings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "baseCurrency" TEXT,
    "defaultInvoiceCurrency" TEXT,
    "currencyNotes" TEXT,
    "defaultPaymentTermsDays" INTEGER,
    "defaultPaymentMethod" TEXT,
    "paymentTermsNotes" TEXT,
    "beneficiaryName" TEXT,
    "bankName" TEXT,
    "branchName" TEXT,
    "accountNumber" TEXT,
    "accountCurrency" TEXT,
    "ifscCode" TEXT,
    "swiftBic" TEXT,
    "iban" TEXT,
    "bankAddress" TEXT,
    "bankCountry" TEXT,
    "remittanceBankName" TEXT,
    "remittanceBankSwiftBic" TEXT,
    "correspondentBankName" TEXT,
    "correspondentBankSwiftBic" TEXT,
    "intermediaryBankName" TEXT,
    "intermediaryBankSwiftBic" TEXT,
    "foreignBankAccountNumber" TEXT,
    "foreignBankIban" TEXT,
    "routingOrSortCode" TEXT,
    "remittanceCurrency" TEXT,
    "rbiPurposeCode" TEXT,
    "foreignRemittanceInstructions" TEXT,
    "remittanceReferenceInstructions" TEXT,
    "bankChargesArrangement" TEXT,
    "foreignRemittanceNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessFinancialSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessFinancialSettings_tenantId_key" ON "BusinessFinancialSettings"("tenantId");

-- CreateIndex
CREATE INDEX "BusinessFinancialSettings_baseCurrency_idx" ON "BusinessFinancialSettings"("baseCurrency");

-- CreateIndex
CREATE INDEX "BusinessFinancialSettings_defaultInvoiceCurrency_idx" ON "BusinessFinancialSettings"("defaultInvoiceCurrency");

-- CreateIndex
CREATE INDEX "BusinessFinancialSettings_bankName_idx" ON "BusinessFinancialSettings"("bankName");

-- CreateIndex
CREATE INDEX "BusinessFinancialSettings_swiftBic_idx" ON "BusinessFinancialSettings"("swiftBic");

-- CreateIndex
CREATE INDEX "BusinessFinancialSettings_remittanceCurrency_idx" ON "BusinessFinancialSettings"("remittanceCurrency");

-- CreateIndex
CREATE INDEX "BusinessFinancialSettings_rbiPurposeCode_idx" ON "BusinessFinancialSettings"("rbiPurposeCode");

-- AddForeignKey
ALTER TABLE "BusinessFinancialSettings" ADD CONSTRAINT "BusinessFinancialSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
