import { InquiryStatus } from "@/lib/generated/prisma";

interface Props {
  status: InquiryStatus;
}

const statusConfig: Record<
  InquiryStatus,
  {
    label: string;
    className: string;
  }
> = {
  NEW: {
    label: "New",
    className:
      "bg-blue-100 text-blue-700 border-blue-200",
  },

  CONTACTED: {
    label: "Contacted",
    className:
      "bg-indigo-100 text-indigo-700 border-indigo-200",
  },

  QUOTATION_SENT: {
    label: "Quotation Sent",
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-200",
  },

  NEGOTIATION: {
    label: "Negotiation",
    className:
      "bg-orange-100 text-orange-800 border-orange-200",
  },

  CONFIRMED: {
    label: "Confirmed",
    className:
      "bg-green-100 text-green-700 border-green-200",
  },

  REJECTED: {
    label: "Rejected",
    className:
      "bg-red-100 text-red-700 border-red-200",
  },
};

export default function InquiryStatusBadge({
  status,
}: Props) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}