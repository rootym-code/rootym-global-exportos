-- CreateTable
CREATE TABLE "BillingCustomerDetails" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "gstRegistered" BOOLEAN NOT NULL DEFAULT false,
    "gstin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingCustomerDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingCustomerDetails_tenantId_key" ON "BillingCustomerDetails"("tenantId");

-- CreateIndex
CREATE INDEX "BillingCustomerDetails_state_idx" ON "BillingCustomerDetails"("state");

-- CreateIndex
CREATE INDEX "BillingCustomerDetails_gstRegistered_idx" ON "BillingCustomerDetails"("gstRegistered");

-- AddForeignKey
ALTER TABLE "BillingCustomerDetails" ADD CONSTRAINT "BillingCustomerDetails_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
