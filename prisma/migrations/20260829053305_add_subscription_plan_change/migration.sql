-- CreateEnum
CREATE TYPE "PlanChangeStatus" AS ENUM ('PAYMENT_PENDING', 'PAYMENT_CONFIRMED', 'PAYMENT_FAILED', 'APPLIED');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "planChangeId" TEXT;

-- CreateTable
CREATE TABLE "SubscriptionPlanChange" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "fromPlanId" TEXT NOT NULL,
    "toPlanId" TEXT NOT NULL,
    "effectiveAt" TIMESTAMP(3) NOT NULL,
    "status" "PlanChangeStatus" NOT NULL DEFAULT 'PAYMENT_PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPlanChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubscriptionPlanChange_tenantId_idx" ON "SubscriptionPlanChange"("tenantId");

-- CreateIndex
CREATE INDEX "SubscriptionPlanChange_subscriptionId_idx" ON "SubscriptionPlanChange"("subscriptionId");

-- CreateIndex
CREATE INDEX "SubscriptionPlanChange_fromPlanId_idx" ON "SubscriptionPlanChange"("fromPlanId");

-- CreateIndex
CREATE INDEX "SubscriptionPlanChange_toPlanId_idx" ON "SubscriptionPlanChange"("toPlanId");

-- CreateIndex
CREATE INDEX "SubscriptionPlanChange_effectiveAt_idx" ON "SubscriptionPlanChange"("effectiveAt");

-- CreateIndex
CREATE INDEX "SubscriptionPlanChange_status_idx" ON "SubscriptionPlanChange"("status");

-- CreateIndex
CREATE INDEX "Payment_planChangeId_idx" ON "Payment"("planChangeId");

-- AddForeignKey
ALTER TABLE "SubscriptionPlanChange" ADD CONSTRAINT "SubscriptionPlanChange_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPlanChange" ADD CONSTRAINT "SubscriptionPlanChange_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPlanChange" ADD CONSTRAINT "SubscriptionPlanChange_fromPlanId_fkey" FOREIGN KEY ("fromPlanId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPlanChange" ADD CONSTRAINT "SubscriptionPlanChange_toPlanId_fkey" FOREIGN KEY ("toPlanId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_planChangeId_fkey" FOREIGN KEY ("planChangeId") REFERENCES "SubscriptionPlanChange"("id") ON DELETE SET NULL ON UPDATE CASCADE;
