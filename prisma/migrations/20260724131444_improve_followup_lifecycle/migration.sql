/*
  Warnings:

  - The values [NO_ANSWER,BUSY,FOLLOWUP_REQUIRED] on the enum `FollowUpResult` will be removed. If these variants are still used in the database, this will fail.
  - The values [MISSED,CANCELLED] on the enum `FollowUpStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FollowUpResult_new" AS ENUM ('BUYER_RESPONDED', 'NO_RESPONSE', 'CALL_BACK_LATER', 'QUOTE_SENT', 'MEETING_DONE', 'DEAL_CLOSED', 'NOT_INTERESTED', 'WRONG_NUMBER');
ALTER TABLE "FollowUp" ALTER COLUMN "result" TYPE "FollowUpResult_new" USING ("result"::text::"FollowUpResult_new");
ALTER TYPE "FollowUpResult" RENAME TO "FollowUpResult_old";
ALTER TYPE "FollowUpResult_new" RENAME TO "FollowUpResult";
DROP TYPE "public"."FollowUpResult_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "FollowUpStatus_new" AS ENUM ('PENDING', 'COMPLETED', 'RESCHEDULED', 'CLOSED');
ALTER TABLE "public"."FollowUp" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "FollowUp" ALTER COLUMN "status" TYPE "FollowUpStatus_new" USING ("status"::text::"FollowUpStatus_new");
ALTER TYPE "FollowUpStatus" RENAME TO "FollowUpStatus_old";
ALTER TYPE "FollowUpStatus_new" RENAME TO "FollowUpStatus";
DROP TYPE "public"."FollowUpStatus_old";
ALTER TABLE "FollowUp" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
