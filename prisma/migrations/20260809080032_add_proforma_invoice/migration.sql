-- CreateEnum
CREATE TYPE "ProformaInvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAYMENT_PENDING', 'PARTIALLY_PAID', 'PAID', 'CANCELLED');

-- AlterEnum
ALTER TYPE "NumberSequenceType" ADD VALUE 'PROFORMA_INVOICE';

-- CreateTable
CREATE TABLE "ProformaInvoice" (
    "id" TEXT NOT NULL,
    "piNumber" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentDueDate" TIMESTAMP(3),
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "subtotal" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "freight" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "insurance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "grandTotal" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "paymentTerms" TEXT,
    "incoterms" TEXT,
    "notes" TEXT,
    "status" "ProformaInvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProformaInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProformaInvoiceItem" (
    "id" TEXT NOT NULL,
    "proformaInvoiceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(18,3) NOT NULL,
    "unit" TEXT NOT NULL,
    "unitPrice" DECIMAL(18,2) NOT NULL,
    "lineTotal" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProformaInvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProformaInvoice_piNumber_key" ON "ProformaInvoice"("piNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ProformaInvoice_quoteId_key" ON "ProformaInvoice"("quoteId");

-- CreateIndex
CREATE INDEX "ProformaInvoice_quoteId_idx" ON "ProformaInvoice"("quoteId");

-- CreateIndex
CREATE INDEX "ProformaInvoice_status_idx" ON "ProformaInvoice"("status");

-- CreateIndex
CREATE INDEX "ProformaInvoice_companyName_idx" ON "ProformaInvoice"("companyName");

-- CreateIndex
CREATE INDEX "ProformaInvoice_country_idx" ON "ProformaInvoice"("country");

-- CreateIndex
CREATE INDEX "ProformaInvoice_issueDate_idx" ON "ProformaInvoice"("issueDate");

-- CreateIndex
CREATE INDEX "ProformaInvoiceItem_proformaInvoiceId_idx" ON "ProformaInvoiceItem"("proformaInvoiceId");

-- CreateIndex
CREATE INDEX "ProformaInvoiceItem_productId_idx" ON "ProformaInvoiceItem"("productId");

-- AddForeignKey
ALTER TABLE "ProformaInvoice" ADD CONSTRAINT "ProformaInvoice_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoiceItem" ADD CONSTRAINT "ProformaInvoiceItem_proformaInvoiceId_fkey" FOREIGN KEY ("proformaInvoiceId") REFERENCES "ProformaInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoiceItem" ADD CONSTRAINT "ProformaInvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
