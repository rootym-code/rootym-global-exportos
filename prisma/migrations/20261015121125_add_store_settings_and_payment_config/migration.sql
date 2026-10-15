-- CreateTable
CREATE TABLE "StoreSettings" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "storeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "cartEnabled" BOOLEAN NOT NULL DEFAULT false,
    "guestCheckoutEnabled" BOOLEAN NOT NULL DEFAULT true,
    "defaultCurrency" TEXT NOT NULL DEFAULT 'INR',
    "shippingMode" TEXT NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorePaymentConfiguration" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'RAZORPAY',
    "environment" TEXT NOT NULL DEFAULT 'TEST',
    "publicKeyId" TEXT,
    "encryptedKeySecret" TEXT,
    "encryptedWebhookSecret" TEXT,
    "paymentsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorePaymentConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoreSettings_websiteId_key" ON "StoreSettings"("websiteId");

-- CreateIndex
CREATE INDEX "StoreSettings_storeEnabled_idx" ON "StoreSettings"("storeEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "StorePaymentConfiguration_websiteId_key" ON "StorePaymentConfiguration"("websiteId");

-- CreateIndex
CREATE INDEX "StorePaymentConfiguration_provider_environment_idx" ON "StorePaymentConfiguration"("provider", "environment");

-- CreateIndex
CREATE INDEX "StorePaymentConfiguration_paymentsEnabled_idx" ON "StorePaymentConfiguration"("paymentsEnabled");

-- AddForeignKey
ALTER TABLE "StoreSettings" ADD CONSTRAINT "StoreSettings_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorePaymentConfiguration" ADD CONSTRAINT "StorePaymentConfiguration_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
