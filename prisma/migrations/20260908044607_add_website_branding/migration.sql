-- CreateTable
CREATE TABLE "WebsiteBranding" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "logoMediaId" TEXT,
    "faviconMediaId" TEXT,
    "ogImageMediaId" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "accentColor" TEXT,
    "fontFamily" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteBranding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteBranding_websiteId_key" ON "WebsiteBranding"("websiteId");

-- CreateIndex
CREATE INDEX "WebsiteBranding_logoMediaId_idx" ON "WebsiteBranding"("logoMediaId");

-- CreateIndex
CREATE INDEX "WebsiteBranding_faviconMediaId_idx" ON "WebsiteBranding"("faviconMediaId");

-- CreateIndex
CREATE INDEX "WebsiteBranding_ogImageMediaId_idx" ON "WebsiteBranding"("ogImageMediaId");

-- AddForeignKey
ALTER TABLE "WebsiteBranding" ADD CONSTRAINT "WebsiteBranding_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteBranding" ADD CONSTRAINT "WebsiteBranding_logoMediaId_fkey" FOREIGN KEY ("logoMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteBranding" ADD CONSTRAINT "WebsiteBranding_faviconMediaId_fkey" FOREIGN KEY ("faviconMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteBranding" ADD CONSTRAINT "WebsiteBranding_ogImageMediaId_fkey" FOREIGN KEY ("ogImageMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
