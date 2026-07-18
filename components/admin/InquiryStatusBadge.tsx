"use client";

import { InquiryStatus } from "@/lib/generated/prisma";

interface Props {
  status: InquiryStatus;
}

const styles: Record<InquiryStatus, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-cyan-100 text-cyan-700",
  QUOTATION_SENT: "bg-yellow-100 text-yellow-700",
  NEGOTIATION: "bg-orange-100 text-orange-700",
  CONFIRMED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function InquiryStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}