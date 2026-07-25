-- AlterTable
ALTER TABLE "FollowUp" ADD COLUMN     "parentFollowUpId" TEXT;

-- CreateIndex
CREATE INDEX "FollowUp_parentFollowUpId_idx" ON "FollowUp"("parentFollowUpId");

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_parentFollowUpId_fkey" FOREIGN KEY ("parentFollowUpId") REFERENCES "FollowUp"("id") ON DELETE SET NULL ON UPDATE CASCADE;
