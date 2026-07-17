"use client";

import type { InquiryFormData } from "@/types/inquiry";

interface ReviewStepProps {
  formData: InquiryFormData;
}

function displayValue(value: string) {
  return value.trim() || "Not Provided";
}

export default function ReviewStep({
  formData,
}: ReviewStepProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900">
        Review &amp; Submit Inquiry
      </h2>

      <p className="mt-4 text-lg text-gray-600">
        Please review your export inquiry carefully before submitting it to the
        ROOTYM export team.
      </p>

      {/* Product Details */}

      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">
          Product Details
        </h3>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ReviewItem
            label="Product"
            value={displayValue(formData.product)}
          />

          <ReviewItem
            label="Destination Country"
            value={displayValue(formData.country)}
          />

          <ReviewItem
            label="Quantity"
            value={
              formData.quantity
                ? `${formData.quantity} ${formData.quantityUnit}`
                : "Not Provided"
            }
          />

          <ReviewItem
            label="Packaging"
            value={displayValue(formData.packaging)}
          />

          <ReviewItem
            label="Packaging Instructions"
            value={displayValue(formData.packagingInstructions)}
          />
        </div>
      </div>

      {/* Buyer Information */}

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">
          Buyer Information
        </h3>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ReviewItem
            label="Company Name"
            value={displayValue(formData.companyName)}
          />

          <ReviewItem
            label="Buyer Type"
            value={displayValue(formData.buyerType)}
          />

          <ReviewItem
            label="Contact Person"
            value={displayValue(formData.contactPerson)}
          />

          <ReviewItem
            label="Designation"
            value={displayValue(formData.designation)}
          />

          <ReviewItem
            label="Business Email"
            value={displayValue(formData.email)}
          />

          <ReviewItem
            label="Phone / WhatsApp"
            value={displayValue(formData.phone)}
          />

          <ReviewItem
            label="Website"
            value={displayValue(formData.website)}
          />
        </div>
      </div>

      {/* Delivery Terms */}

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">
          Preferred Delivery Terms
        </h3>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ReviewItem
            label="Preferred Incoterm"
            value={
              formData.preferredIncoterm === "Not Sure"
                ? "Not Sure (ROOTYM team will recommend)"
                : displayValue(formData.preferredIncoterm)
            }
          />

          {formData.preferredIncoterm !== "Not Sure" && (
            <ReviewItem
              label="Named Port / Place"
              value={displayValue(formData.namedPlace)}
            />
          )}
        </div>
      </div>

      {/* Additional Requirements */}

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">
          Additional Requirements
        </h3>

        <div className="mt-5 rounded-xl bg-gray-50 p-4">
          <p className="whitespace-pre-wrap leading-7 text-gray-700">
            {formData.requirements.trim()
              ? formData.requirements
              : "Not Provided"}
          </p>
        </div>
      </div>

      {/* Submission Notice */}

      <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-6">
        <h3 className="text-xl font-semibold text-[#2E7D32]">
          Almost Done!
        </h3>

        <p className="mt-3 leading-7 text-gray-700">
          Please review all information carefully. After you submit your
          inquiry, the ROOTYM export team will evaluate your requirements and
          contact you with a quotation or request additional information if
          needed.
        </p>
      </div>
    </div>
  );
}

interface ReviewItemProps {
  label: string;
  value: string;
}

function ReviewItem({
  label,
  value,
}: ReviewItemProps) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-base font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}