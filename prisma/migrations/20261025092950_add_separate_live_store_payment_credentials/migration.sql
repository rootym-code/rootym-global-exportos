-- AlterTable
ALTER TABLE "StorePaymentConfiguration" ADD COLUMN     "liveEncryptedKeySecret" TEXT,
ADD COLUMN     "liveEncryptedWebhookSecret" TEXT,
ADD COLUMN     "livePaymentsEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "livePublicKeyId" TEXT,
ADD COLUMN     "liveVerifiedAt" TIMESTAMP(3);
