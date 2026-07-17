"use client";

import type { BuyerType, InquiryStepProps } from "@/types/inquiry";

const buyerTypes: BuyerType[] = [
  "Importer",
  "Distributor",
  "Wholesaler",
  "Retail Chain",
  "Food Processor",
  "Trader",
  "Others",
];

export default function CompanyStep({
  formData,
  updateFormData,
}: InquiryStepProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900">
        Buyer Information
      </h2>

      <p className="mt-3 text-lg text-gray-600">
        Please provide your company and contact details so our export team can
        prepare the most suitable quotation.
      </p>

      {/* Company Information */}

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-900">
          Company Information
        </h3>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="companyName"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Company Name <span className="text-red-500">*</span>
            </label>

            <input
              id="companyName"
              type="text"
              placeholder="ABC Imports Ltd."
              value={formData.companyName}
              onChange={(e) =>
                updateFormData("companyName", e.target.value)
              }
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div>
            <label
              htmlFor="buyerType"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Buyer Type <span className="text-red-500">*</span>
            </label>

            <select
              id="buyerType"
              value={formData.buyerType}
              onChange={(e) =>
                updateFormData(
                  "buyerType",
                  e.target.value as BuyerType
                )
              }
              className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]"
            >
              <option value="">Select Buyer Type</option>

              {buyerTypes.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}

      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-900">
          Contact Information
        </h3>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="contactPerson"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Contact Person <span className="text-red-500">*</span>
            </label>

            <input
              id="contactPerson"
              type="text"
              placeholder="John Smith"
              value={formData.contactPerson}
              onChange={(e) =>
                updateFormData("contactPerson", e.target.value)
              }
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div>
            <label
              htmlFor="designation"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Designation
            </label>

            <input
              id="designation"
              type="text"
              placeholder="Procurement Manager"
              value={formData.designation}
              onChange={(e) =>
                updateFormData("designation", e.target.value)
              }
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Business Email <span className="text-red-500">*</span>
            </label>

            <input
              id="email"
              type="email"
              placeholder="john@company.com"
              value={formData.email}
              onChange={(e) =>
                updateFormData("email", e.target.value)
              }
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Mobile / WhatsApp <span className="text-red-500">*</span>
            </label>

            <input
              id="phone"
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) =>
                updateFormData("phone", e.target.value)
              }
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="website"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Company Website
            </label>

            <input
              id="website"
              type="url"
              placeholder="https://www.company.com"
              value={formData.website}
              onChange={(e) =>
                updateFormData("website", e.target.value)
              }
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>
        </div>
      </div>

      {/* Information Card */}

      <div className="mt-10 rounded-2xl border border-green-100 bg-green-50 p-5">
        <h3 className="font-semibold text-[#2E7D32]">
          Why do we need this information?
        </h3>

        <p className="mt-2 leading-7 text-gray-700">
          Your company details help us prepare an accurate export quotation,
          recommend suitable packaging and shipping options, and ensure our
          export team can contact you with the best commercial offer.
        </p>
      </div>
    </div>
  );
}