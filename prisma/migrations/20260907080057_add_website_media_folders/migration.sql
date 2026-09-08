-- CreateTable
CREATE TABLE "MediaFolder" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaFolder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MediaFolder_websiteId_idx" ON "MediaFolder"("websiteId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaFolder_websiteId_path_key" ON "MediaFolder"("websiteId", "path");

-- AddForeignKey
ALTER TABLE "MediaFolder" ADD CONSTRAINT "MediaFolder_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
