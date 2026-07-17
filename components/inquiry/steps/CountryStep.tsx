"use client";

import { CheckCircle2 } from "lucide-react";

import { countries } from "@/data/countries";
import type { InquiryStepProps } from "@/types/inquiry";

export default function CountryStep({
  formData,
  updateFormData,
}: InquiryStepProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900">
        Select Destination Country
      </h2>

      <p className="mt-3 text-lg text-gray-600">
        Choose the country where you would like your shipment to be delivered.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {countries.map((country) => {
          const selected = formData.country === country.name;

          return (
            <button
              key={country.id}
              type="button"
              onClick={() =>
                updateFormData("country", country.name)
              }
              className={`group rounded-3xl border bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                selected
                  ? "border-[#2E7D32] ring-2 ring-[#2E7D32]"
                  : "border-gray-200 hover:border-[#2E7D32]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="text-4xl">
                  {country.flag}
                </div>

                <CheckCircle2
                  className={`h-6 w-6 ${
                    selected
                      ? "text-[#2E7D32]"
                      : "text-gray-300"
                  }`}
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                {country.name}
              </h3>

              {country.focusMarket && (
                <span className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-[#2E7D32]">
                  Focus Market
                </span>
              )}

              <div className="mt-5">
                <p className="text-sm font-medium text-gray-500">
                  Popular Ports
                </p>

                <p className="mt-1 text-gray-700">
                  {country.popularPorts.length > 0
                    ? country.popularPorts.join(" • ")
                    : "Specify during inquiry"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}