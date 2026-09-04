-- CreateTable
CREATE TABLE "BusinessContactCommunication" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "primaryEmail" TEXT,
    "alternateEmail1" TEXT,
    "alternateEmail2" TEXT,
    "salesEmail" TEXT,
    "infoEmail" TEXT,
    "primaryPhone" TEXT,
    "alternatePhone" TEXT,
    "whatsapp" TEXT,
    "linkedinUrl" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,
    "googleBusinessUrl" TEXT,
    "xTwitterUrl" TEXT,
    "pinterestUrl" TEXT,
    "otherSocialUrls" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessContactCommunication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessContactCommunication_tenantId_key" ON "BusinessContactCommunication"("tenantId");

-- CreateIndex
CREATE INDEX "BusinessContactCommunication_primaryEmail_idx" ON "BusinessContactCommunication"("primaryEmail");

-- CreateIndex
CREATE INDEX "BusinessContactCommunication_primaryPhone_idx" ON "BusinessContactCommunication"("primaryPhone");

-- CreateIndex
CREATE INDEX "BusinessContactCommunication_whatsapp_idx" ON "BusinessContactCommunication"("whatsapp");

-- AddForeignKey
ALTER TABLE "BusinessContactCommunication" ADD CONSTRAINT "BusinessContactCommunication_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
