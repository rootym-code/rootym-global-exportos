"use client";

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

      <p className="mt-4 text-gray-600">
        Country selection will be implemented in the next sprint.
      </p>
    </div>
  );
}