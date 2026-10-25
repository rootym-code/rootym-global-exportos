-- CreateEnum
CREATE TYPE "StorePaymentEnvironment" AS ENUM ('TEST', 'LIVE');

-- AlterTable
ALTER TABLE "StoreOrder" ADD COLUMN     "providerEnvironment" "StorePaymentEnvironment" NOT NULL DEFAULT 'TEST';
