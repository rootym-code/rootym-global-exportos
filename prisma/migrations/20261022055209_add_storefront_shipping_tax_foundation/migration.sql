-- CreateEnum
CREATE TYPE "StoreShippingPricingType" AS ENUM ('FLAT_RATE', 'WEIGHT_BASED');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "storeGstRate" DECIMAL(5,2);

-- AlterTable
ALTER TABLE "StoreOrder" ADD COLUMN     "cgstAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "cgstRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "igstAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "igstRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "sgstAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "sgstRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "shippingRuleId" TEXT,
ADD COLUMN     "shippingRuleName" TEXT,
ADD COLUMN     "taxType" "BillingTaxType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "taxableAmount" DECIMAL(18,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "StoreOrderItem" ADD COLUMN     "cgstAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "cgstRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "igstAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "igstRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "sgstAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "sgstRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "taxableAmount" DECIMAL(18,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "StoreSettings" ADD COLUMN     "shippingEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taxEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "StoreShippingRule" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneName" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'IN',
    "stateCode" TEXT,
    "postalCode" TEXT,
    "postalCodePrefix" TEXT,
    "pricingType" "StoreShippingPricingType" NOT NULL DEFAULT 'FLAT_RATE',
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "flatRate" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "baseCharge" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "includedWeightKg" DECIMAL(10,3),
    "additionalPerKg" DECIMAL(18,2),
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreShippingRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreTaxProfile" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "legalName" TEXT,
    "gstin" TEXT,
    "registeredState" TEXT,
    "registeredStateCode" TEXT,
    "registeredAddressLine1" TEXT,
    "registeredAddressLine2" TEXT,
    "registeredCity" TEXT,
    "registeredPostalCode" TEXT,
    "registeredCountry" TEXT NOT NULL DEFAULT 'IN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreTaxProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoreShippingRule_websiteId_isActive_idx" ON "StoreShippingRule"("websiteId", "isActive");

-- CreateIndex
CREATE INDEX "StoreShippingRule_websiteId_countryCode_stateCode_idx" ON "StoreShippingRule"("websiteId", "countryCode", "stateCode");

-- CreateIndex
CREATE INDEX "StoreShippingRule_websiteId_postalCode_idx" ON "StoreShippingRule"("websiteId", "postalCode");

-- CreateIndex
CREATE INDEX "StoreShippingRule_websiteId_postalCodePrefix_idx" ON "StoreShippingRule"("websiteId", "postalCodePrefix");

-- CreateIndex
CREATE UNIQUE INDEX "StoreTaxProfile_websiteId_key" ON "StoreTaxProfile"("websiteId");

-- AddForeignKey
ALTER TABLE "StoreShippingRule" ADD CONSTRAINT "StoreShippingRule_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreTaxProfile" ADD CONSTRAINT "StoreTaxProfile_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
