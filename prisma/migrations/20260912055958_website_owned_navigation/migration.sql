/*
  Warnings:

  - A unique constraint covering the columns `[websiteId]` on the table `Menu` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "websiteId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Menu_websiteId_key" ON "Menu"("websiteId");

-- CreateIndex
CREATE INDEX "Menu_websiteId_idx" ON "Menu"("websiteId");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
