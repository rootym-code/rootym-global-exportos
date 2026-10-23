-- AlterTable
ALTER TABLE "StoreOrder" ADD COLUMN     "courierName" TEXT,
ADD COLUMN     "shippedAt" TIMESTAMP(3),
ADD COLUMN     "trackingNumber" TEXT,
ADD COLUMN     "trackingUrl" TEXT;
