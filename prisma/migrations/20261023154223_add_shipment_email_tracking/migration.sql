-- AlterTable
ALTER TABLE "StoreOrder" ADD COLUMN     "shipmentEmailError" TEXT,
ADD COLUMN     "shipmentEmailSentAt" TIMESTAMP(3);
