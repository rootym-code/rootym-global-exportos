-- CreateTable
CREATE TABLE "WebsiteConfiguration" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "websiteTitle" TEXT,
    "tagline" TEXT,
    "websiteDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteConfiguration_websiteId_key" ON "WebsiteConfiguration"("websiteId");

-- AddForeignKey
ALTER TABLE "WebsiteConfiguration" ADD CONSTRAINT "WebsiteConfiguration_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
