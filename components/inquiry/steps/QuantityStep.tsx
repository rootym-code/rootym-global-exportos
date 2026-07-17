"use client";

import type { InquiryStepProps } from "@/types/inquiry";

const units = ["KG", "MT", "Container"] as const;

const quickQuantities = [
  "1",
  "5",
  "10",
  "20",
  "25",
  "50",
];

export default function QuantityStep({
  formData,
  updateFormData,
}: InquiryStepProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900">
        How much quantity do you need?
      </h2>

      <p className="mt-3 text-lg text-gray-600">
        Enter your estimated order quantity.
      </p>

      {/* Quantity */}

      <div className="mt-10">
        <label
          htmlFor="quantity"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Quantity
        </label>

        <input
          id="quantity"
          type="number"
          min="1"
          inputMode="numeric"
          placeholder="Enter quantity"
          value={formData.quantity}
          onChange={(e) =>
            updateFormData("quantity", e.target.value)
          }
          className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg outline-none transition-all duration-200 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]"
        />

        <p className="mt-2 text-sm text-gray-500">
          Example: 25 MT or 500 KG
        </p>
      </div>

      {/* Unit */}

      <div className="mt-8">
        <label className="mb-4 block text-sm font-semibold text-gray-700">
          Unit
        </label>

        <div className="grid grid-cols-3 gap-4">
          {units.map((unit) => {
            const selected = formData.quantityUnit === unit;

            return (
              <button
                key={unit}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  updateFormData("quantityUnit", unit)
                }
                className={`rounded-2xl border px-4 py-4 font-semibold transition-all duration-200 ${
                  selected
                    ? "border-[#2E7D32] bg-green-50 text-[#2E7D32] shadow-md"
                    : "border-gray-300 hover:border-[#2E7D32] hover:bg-green-50"
                }`}
              >
                {unit}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Selection */}

      <div className="mt-10">
        <p className="mb-4 text-sm font-semibold text-gray-700">
          Quick Selection
        </p>

        <div className="flex flex-wrap gap-3">
          {quickQuantities.map((value) => {
            const selected = formData.quantity === value;

            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  updateFormData("quantity", value)
                }
                className={`rounded-full border px-5 py-2 transition-all duration-200 ${
                  selected
                    ? "border-[#2E7D32] bg-[#2E7D32] text-white"
                    : "border-gray-300 hover:border-[#2E7D32] hover:bg-green-50"
                }`}
              >
                {value} {formData.quantityUnit}
              </button>
            );
          })}
        </div>
      </div>

      {/* Information */}

      <div className="mt-10 rounded-2xl border border-green-100 bg-green-50 p-5">
        <h3 className="font-semibold text-[#2E7D32]">
          Helpful Tip
        </h3>

        <p className="mt-2 leading-7 text-gray-700">
          If you&apos;re unsure about the exact quantity,
          provide an approximate requirement. Our export
          team will help determine the most suitable
          shipment size, packaging and logistics for your
          destination.
        </p>
      </div>
    </div>
  );
}