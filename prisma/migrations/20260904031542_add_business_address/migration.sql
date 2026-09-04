-- CreateTable
CREATE TABLE "BusinessAddress" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessAddress_tenantId_key" ON "BusinessAddress"("tenantId");

-- CreateIndex
CREATE INDEX "BusinessAddress_country_idx" ON "BusinessAddress"("country");

-- CreateIndex
CREATE INDEX "BusinessAddress_state_idx" ON "BusinessAddress"("state");

-- CreateIndex
CREATE INDEX "BusinessAddress_city_idx" ON "BusinessAddress"("city");

-- AddForeignKey
ALTER TABLE "BusinessAddress" ADD CONSTRAINT "BusinessAddress_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
