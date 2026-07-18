// components/admin/InquiryTable.tsx

"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { InquiryPriority, InquiryStatus } from "@/lib/generated/prisma";
import InquiryStatusBadge from "./InquiryStatusBadge";

export interface InquiryTableItem {
  id: string;
  inquiryNumber: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string | null;
  country: string;
  product: string;
  status: InquiryStatus;
  priority: InquiryPriority;
  createdAt: string | Date;
}

interface Props {
  inquiries: InquiryTableItem[];
}

function priorityBadge(priority: InquiryPriority) {
  switch (priority) {
    case "URGENT":
      return "bg-red-100 text-red-700";
    case "HIGH":
      return "bg-orange-100 text-orange-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function InquiryTable({
  inquiries,
}: Props) {
  if (!inquiries.length) {
    return (
      <div className="rounded-lg border bg-white p-12 text-center">
        <h3 className="text-lg font-semibold">
          No inquiries found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Try changing the search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">
                Inquiry #
              </th>

              <th className="px-5 py-3 text-left font-semibold">
                Company
              </th>

              <th className="px-5 py-3 text-left font-semibold">
                Contact
              </th>

              <th className="px-5 py-3 text-left font-semibold">
                Product
              </th>

              <th className="px-5 py-3 text-left font-semibold">
                Country
              </th>

              <th className="px-5 py-3 text-left font-semibold">
                Status
              </th>

              <th className="px-5 py-3 text-left font-semibold">
                Priority
              </th>

              <th className="px-5 py-3 text-left font-semibold">
                Date
              </th>

              <th className="px-5 py-3 text-center font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {inquiries.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-5 py-4 font-medium">
                  {item.inquiryNumber}
                </td>

                <td className="px-5 py-4">
                  <div className="font-medium">
                    {item.companyName}
                  </div>

                  <div className="text-xs text-gray-500">
                    {item.email}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div>{item.contactPerson}</div>

                  {item.phone && (
                    <div className="text-xs text-gray-500">
                      {item.phone}
                    </div>
                  )}
                </td>

                <td className="px-5 py-4">
                  {item.product}
                </td>

                <td className="px-5 py-4">
                  {item.country}
                </td>

                <td className="px-5 py-4">
                  <InquiryStatusBadge
                    status={item.status}
                  />
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityBadge(
                      item.priority
                    )}`}
                  >
                    {item.priority}
                  </span>
                </td>

                <td className="px-5 py-4">
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="px-5 py-4 text-center">
                  <Link
                    href={`/admin/inquiries/${item.id}`}
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    <Eye size={16} />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}