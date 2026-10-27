-- CreateTable
CREATE TABLE "InquiryRequestedProduct" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" TEXT,
    "unit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InquiryRequestedProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InquiryRequestedProduct_productId_idx" ON "InquiryRequestedProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "InquiryRequestedProduct_inquiryId_productId_key" ON "InquiryRequestedProduct"("inquiryId", "productId");

-- AddForeignKey
ALTER TABLE "InquiryRequestedProduct" ADD CONSTRAINT "InquiryRequestedProduct_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryRequestedProduct" ADD CONSTRAINT "InquiryRequestedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
