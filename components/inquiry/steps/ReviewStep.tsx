"use client";

import type { InquiryFormData } from "@/types/inquiry";

interface ReviewStepProps {
  formData: InquiryFormData;
}

export default function ReviewStep({
  formData,
}: ReviewStepProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900">
        Review Your Export Inquiry
      </h2>

      <p className="mt-4 text-lg text-gray-600">
        In the final version, this page will display a complete summary of
        your export inquiry before submission.
      </p>

      <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Inquiry Summary
        </h3>

        <div className="mt-6 space-y-3 text-gray-700">
          <p>
            <strong>Product:</strong>{" "}
            {formData.product || "Not selected"}
          </p>

          <p>
            <strong>Destination:</strong>{" "}
            {formData.country || "Not selected"}
          </p>

          <p>
            <strong>Quantity:</strong>{" "}
            {formData.quantity || "Not specified"}
          </p>

          <p>
            <strong>Packaging:</strong>{" "}
            {formData.packaging || "Not specified"}
          </p>

          <p>
            <strong>Company:</strong>{" "}
            {formData.companyName || "Not provided"}
          </p>

          <p>
            <strong>Contact Person:</strong>{" "}
            {formData.contactPerson || "Not provided"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {formData.email || "Not provided"}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {formData.phone || "Not provided"}
          </p>

          <p>
            <strong>Requirements:</strong>{" "}
            {formData.requirements || "None"}
          </p>
        </div>
      </div>
    </div>
  );
}