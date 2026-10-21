-- CreateEnum
CREATE TYPE "StoreOrderCreationStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'CREATED', 'UNKNOWN');

-- AlterTable
ALTER TABLE "StoreOrder" ADD COLUMN     "providerOrderCreationStartedAt" TIMESTAMP(3),
ADD COLUMN     "providerOrderCreationStatus" "StoreOrderCreationStatus" NOT NULL DEFAULT 'NOT_STARTED';
