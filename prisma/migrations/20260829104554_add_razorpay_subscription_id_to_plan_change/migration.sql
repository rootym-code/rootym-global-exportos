-- AlterTable
ALTER TABLE "SubscriptionPlanChange" ADD COLUMN     "razorpaySubscriptionId" TEXT;

-- CreateIndex
CREATE INDEX "SubscriptionPlanChange_razorpaySubscriptionId_idx" ON "SubscriptionPlanChange"("razorpaySubscriptionId");
