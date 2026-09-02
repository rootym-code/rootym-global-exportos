-- AlterTable
ALTER TABLE "SubscriptionPlanChange" ADD COLUMN     "razorpayCurrentEnd" TIMESTAMP(3),
ADD COLUMN     "razorpayCurrentStart" TIMESTAMP(3),
ADD COLUMN     "razorpayEndAt" TIMESTAMP(3),
ADD COLUMN     "razorpayStartAt" TIMESTAMP(3);
