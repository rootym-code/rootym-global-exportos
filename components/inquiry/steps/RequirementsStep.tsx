"use client";

import type { InquiryStepProps } from "@/types/inquiry";

const suggestions = [
  "Private Label / OEM Packaging",
  "Product Samples Required",
  "Preferred Delivery Schedule",
  "Quality Inspection",
  "Specific Certifications (FSSAI, APEDA, HACCP, ISO, etc.)",
  "Payment Terms",
];

export default function RequirementsStep({
  formData,
  updateFormData,
}: InquiryStepProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900">
        Additional Requirements
      </h2>

      <p className="mt-3 text-lg text-gray-600">
        Share any additional information that will help us prepare the most
        suitable quotation for your export inquiry.
      </p>

      {/* Additional Requirements */}

      <div className="mt-10">
        <label
          htmlFor="requirements"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Additional Requirements
        </label>

        <textarea
          id="requirements"
          rows={8}
          placeholder="Example: We require private label packaging, SGS inspection before shipment, delivery within 30 days, and CIF pricing to Hamburg Port."
          value={formData.requirements}
          onChange={(e) =>
            updateFormData("requirements", e.target.value)
          }
          className="w-full rounded-2xl border border-gray-300 px-5 py-4 leading-7 outline-none transition-all duration-200 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]"
        />
      </div>

      {/* Suggestions */}

      <div className="mt-10">
        <p className="mb-4 text-sm font-semibold text-gray-700">
          Common Requirements
        </p>

        <div className="flex flex-wrap gap-3">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                const current = formData.requirements.trim();

                if (current.includes(item)) return;

                const updated =
                  current.length > 0
                    ? `${current}\n• ${item}`
                    : `• ${item}`;

                updateFormData("requirements", updated);
              }}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm transition-all duration-200 hover:border-[#2E7D32] hover:bg-green-50"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Information Card */}

      <div className="mt-10 rounded-2xl border border-green-100 bg-green-50 p-5">
        <h3 className="font-semibold text-[#2E7D32]">
          Helpful Tip
        </h3>

        <p className="mt-2 leading-7 text-gray-700">
          The more information you provide, the more accurate our quotation
          will be. You can mention packaging preferences, inspection
          requirements, certifications, shipping preferences, payment terms,
          branding requirements, or any special instructions related to your
          order.
        </p>
      </div>
    </div>
  );
}