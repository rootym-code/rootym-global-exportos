-- CreateEnum
CREATE TYPE "BillingTaxType" AS ENUM ('NONE', 'CGST_SGST', 'IGST');

-- CreateEnum
CREATE TYPE "BillingInvoiceStatus" AS ENUM ('PENDING', 'GENERATED', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "BillingInvoice" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "planChangeId" TEXT,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerMobile" TEXT NOT NULL,
    "billingAddressLine1" TEXT NOT NULL,
    "billingAddressLine2" TEXT,
    "billingCity" TEXT,
    "billingState" TEXT NOT NULL,
    "billingPostalCode" TEXT,
    "billingCountry" TEXT NOT NULL,
    "customerGstin" TEXT,
    "taxType" "BillingTaxType" NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL,
    "taxableAmount" DECIMAL(18,2) NOT NULL,
    "cgstRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "cgstAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "sgstRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "sgstAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "igstRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "igstAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalTaxAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(18,2) NOT NULL,
    "status" "BillingInvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "pdfPath" TEXT,
    "generatedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "emailAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastEmailError" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'RAZORPAY',
    "providerPaymentId" TEXT NOT NULL,
    "providerSubscriptionId" TEXT,
    "providerInvoiceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingInvoiceItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(18,3) NOT NULL DEFAULT 1,
    "unit" TEXT NOT NULL DEFAULT 'subscription',
    "unitPrice" DECIMAL(18,2) NOT NULL,
    "taxableAmount" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingInvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingTaxConfiguration" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "gstEnabled" BOOLEAN NOT NULL DEFAULT true,
    "cgstRate" DECIMAL(5,2) NOT NULL DEFAULT 9,
    "sgstRate" DECIMAL(5,2) NOT NULL DEFAULT 9,
    "igstRate" DECIMAL(5,2) NOT NULL DEFAULT 18,
    "legalName" TEXT,
    "gstin" TEXT,
    "registeredAddressLine1" TEXT,
    "registeredAddressLine2" TEXT,
    "registeredCity" TEXT,
    "registeredState" TEXT,
    "registeredPostalCode" TEXT,
    "registeredCountry" TEXT,
    "invoicePrefix" TEXT NOT NULL DEFAULT 'ROOTYM',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingTaxConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingInvoice_paymentId_key" ON "BillingInvoice"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "BillingInvoice_invoiceNumber_key" ON "BillingInvoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "BillingInvoice_tenantId_idx" ON "BillingInvoice"("tenantId");

-- CreateIndex
CREATE INDEX "BillingInvoice_subscriptionId_idx" ON "BillingInvoice"("subscriptionId");

-- CreateIndex
CREATE INDEX "BillingInvoice_planChangeId_idx" ON "BillingInvoice"("planChangeId");

-- CreateIndex
CREATE INDEX "BillingInvoice_status_idx" ON "BillingInvoice"("status");

-- CreateIndex
CREATE INDEX "BillingInvoice_invoiceDate_idx" ON "BillingInvoice"("invoiceDate");

-- CreateIndex
CREATE INDEX "BillingInvoice_providerPaymentId_idx" ON "BillingInvoice"("providerPaymentId");

-- CreateIndex
CREATE INDEX "BillingInvoice_providerSubscriptionId_idx" ON "BillingInvoice"("providerSubscriptionId");

-- CreateIndex
CREATE INDEX "BillingInvoiceItem_invoiceId_idx" ON "BillingInvoiceItem"("invoiceId");

-- CreateIndex
CREATE INDEX "BillingTaxConfiguration_effectiveFrom_idx" ON "BillingTaxConfiguration"("effectiveFrom");

-- CreateIndex
CREATE INDEX "BillingTaxConfiguration_effectiveTo_idx" ON "BillingTaxConfiguration"("effectiveTo");

-- CreateIndex
CREATE INDEX "BillingTaxConfiguration_isActive_idx" ON "BillingTaxConfiguration"("isActive");

-- AddForeignKey
ALTER TABLE "BillingInvoice" ADD CONSTRAINT "BillingInvoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingInvoice" ADD CONSTRAINT "BillingInvoice_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingInvoice" ADD CONSTRAINT "BillingInvoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingInvoice" ADD CONSTRAINT "BillingInvoice_planChangeId_fkey" FOREIGN KEY ("planChangeId") REFERENCES "SubscriptionPlanChange"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingInvoiceItem" ADD CONSTRAINT "BillingInvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "BillingInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
