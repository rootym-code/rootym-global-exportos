/*
  Warnings:

  - Made the column `websiteId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "websiteId" SET NOT NULL;
