import prisma from "@/lib/prisma";
import { generateInquiryNumber } from "@/lib/utils/inquiry-number";
import type { InquiryInput } from "@/lib/validations/inquiry";

export interface CreateInquiryMetadata {
  ipAddress?: string;
  userAgent?: string;
}

export async function createInquiry(
  data: InquiryInput,
  metadata: CreateInquiryMetadata
) {
  return await prisma.$transaction(async (tx) => {
    // Temporary unique value required by the schema
    const placeholderInquiryNumber = crypto.randomUUID();

    const inquiry = await tx.inquiry.create({
      data: {
        inquiryNumber: placeholderInquiryNumber,

        companyName: data.companyName,
        contactPerson: data.contactPerson,

        email: data.email,
        phone: data.phone || null,

        country: data.country,

        product: data.product,
        quantity: data.quantity || null,
        unit: data.unit || null,

        message: data.message,

        ipAddress: metadata.ipAddress ?? null,
        userAgent: metadata.userAgent ?? null,
      },
    });

    const inquiryNumber = generateInquiryNumber(inquiry.id);

    return await tx.inquiry.update({
      where: {
        id: inquiry.id,
      },
      data: {
        inquiryNumber,
      },
    });
  });
}