"use client";

import type { InquiryStepProps } from "@/types/inquiry";

const packagingExamples = [
  "25 KG Mesh Bag",
  "10 KG Mesh Bag",
  "25 KG PP Bag",
  "4 KG Export Carton",
  "Retail Pouch",
  "Customized Packaging",
];

export default function PackagingStep({
  formData,
  updateFormData,
}: InquiryStepProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900">
        Packaging Requirements
      </h2>

      <p className="mt-3 text-lg text-gray-600">
        Tell us your preferred packaging. If you are unsure, provide your best
        estimate and our export team will recommend suitable options.
      </p>

      {/* Packaging Type */}

      <div className="mt-10">
        <label
          htmlFor="packaging"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Packaging Type <span className="text-red-500">*</span>
        </label>

        <input
          id="packaging"
          type="text"
          placeholder="Example: 25 KG Mesh Bag"
          value={formData.packaging}
          onChange={(e) =>
            updateFormData("packaging", e.target.value)
          }
          className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg outline-none transition-all duration-200 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]"
        />
      </div>

      {/* Packaging Instructions */}

      <div className="mt-8">
        <label
          htmlFor="packagingInstructions"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Packaging Instructions (Optional)
        </label>

        <textarea
          id="packagingInstructions"
          rows={5}
          placeholder="Example:
• Buyer's private label
• English language printing
• GS1 barcode
• Wooden pallets
• Shrink wrapping"
          className="w-full rounded-2xl border border-gray-300 px-5 py-4 leading-7 outline-none transition-all duration-200 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]"
        />
      </div>

      {/* Examples */}

      <div className="mt-10 rounded-2xl border border-green-100 bg-green-50 p-6">
        <h3 className="font-semibold text-[#2E7D32]">
          Common Packaging Examples
        </h3>

        <div className="mt-4 flex flex-wrap gap-3">
          {packagingExamples.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                updateFormData("packaging", item)
              }
              className="rounded-full border border-green-200 bg-white px-4 py-2 text-sm transition hover:border-[#2E7D32] hover:bg-green-100"
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm leading-6 text-gray-600">
          These are examples only. You may enter any packaging specification
          required by your company or destination market.
        </p>
      </div>
    </div>
  );
}