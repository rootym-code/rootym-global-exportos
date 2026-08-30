/*
  Warnings:

  - A unique constraint covering the columns `[razorpayPlanId]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razorpaySubscriptionId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('MONTHLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('TRIAL', 'PAID');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "BillingWebhookStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'FAILED');

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "billingInterval" "BillingInterval" NOT NULL DEFAULT 'MONTHLY',
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "razorpayPlanId" TEXT,
ADD COLUMN     "type" "PlanType" NOT NULL DEFAULT 'PAID';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "amount" INTEGER,
ADD COLUMN     "billingInterval" "BillingInterval",
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "razorpayCustomerId" TEXT,
ADD COLUMN     "razorpaySubscriptionId" TEXT;

-- CreateTable
CREATE TABLE "BillingCustomer" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'RAZORPAY',
    "providerCustomerId" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'RAZORPAY',
    "providerPaymentId" TEXT NOT NULL,
    "providerOrderId" TEXT,
    "providerInvoiceId" TEXT,
    "providerSubscriptionId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "paidAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureCode" TEXT,
    "failureReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingWebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'RAZORPAY',
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "status" "BillingWebhookStatus" NOT NULL DEFAULT 'RECEIVED',
    "payload" JSONB NOT NULL,
    "processedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingCustomer_tenantId_key" ON "BillingCustomer"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "BillingCustomer_providerCustomerId_key" ON "BillingCustomer"("providerCustomerId");

-- CreateIndex
CREATE INDEX "BillingCustomer_provider_idx" ON "BillingCustomer"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_providerPaymentId_key" ON "Payment"("providerPaymentId");

-- CreateIndex
CREATE INDEX "Payment_tenantId_idx" ON "Payment"("tenantId");

-- CreateIndex
CREATE INDEX "Payment_subscriptionId_idx" ON "Payment"("subscriptionId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_providerOrderId_idx" ON "Payment"("providerOrderId");

-- CreateIndex
CREATE INDEX "Payment_providerInvoiceId_idx" ON "Payment"("providerInvoiceId");

-- CreateIndex
CREATE INDEX "Payment_providerSubscriptionId_idx" ON "Payment"("providerSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "BillingWebhookEvent_eventId_key" ON "BillingWebhookEvent"("eventId");

-- CreateIndex
CREATE INDEX "BillingWebhookEvent_provider_idx" ON "BillingWebhookEvent"("provider");

-- CreateIndex
CREATE INDEX "BillingWebhookEvent_eventType_idx" ON "BillingWebhookEvent"("eventType");

-- CreateIndex
CREATE INDEX "BillingWebhookEvent_status_idx" ON "BillingWebhookEvent"("status");

-- CreateIndex
CREATE INDEX "BillingWebhookEvent_createdAt_idx" ON "BillingWebhookEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_razorpayPlanId_key" ON "Plan"("razorpayPlanId");

-- CreateIndex
CREATE INDEX "Plan_type_idx" ON "Plan"("type");

-- CreateIndex
CREATE INDEX "Plan_billingInterval_idx" ON "Plan"("billingInterval");

-- CreateIndex
CREATE INDEX "Plan_currency_idx" ON "Plan"("currency");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_razorpaySubscriptionId_key" ON "Subscription"("razorpaySubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_razorpayCustomerId_idx" ON "Subscription"("razorpayCustomerId");

-- AddForeignKey
ALTER TABLE "BillingCustomer" ADD CONSTRAINT "BillingCustomer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
