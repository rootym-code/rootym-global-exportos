"use client";

import { useState } from "react";

import type { InquiryFormData } from "@/types/inquiry";

import ProgressBar from "./ProgressBar";
import NavigationButtons from "./NavigationButtons";

import ProductStep from "./steps/ProductStep";
import CountryStep from "./steps/CountryStep";
import QuantityStep from "./steps/QuantityStep";
import PackagingStep from "./steps/PackagingStep";
import CompanyStep from "./steps/CompanyStep";
import IncotermsStep from "./steps/IncotermsStep";
import RequirementsStep from "./steps/RequirementsStep";
import ReviewStep from "./steps/ReviewStep";

const steps = [
  "Product",
  "Country",
  "Quantity",
  "Packaging",
  "Company",
  "Shipping Terms",
  "Requirements",
  "Review",
];

export default function InquiryWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<InquiryFormData>({
    // Step 1 - Product
    product: "",

    // Step 2 - Destination
    country: "",

    // Step 3 - Quantity
    quantity: "",
    quantityUnit: "MT",

    // Step 4 - Packaging
    packaging: "",
    packagingInstructions: "",

    // Step 5 - Buyer Information
    companyName: "",
    buyerType: "",

    contactPerson: "",
    designation: "",

    email: "",
    phone: "",
    website: "",

    // Step 6 - Preferred Shipping Terms (Incoterms)
    preferredIncoterm: "",
    namedPlace: "",

    // Step 7 - Additional Requirements
    requirements: "",
  });

  function updateFormData<K extends keyof InquiryFormData>(
    field: K,
    value: InquiryFormData[K]
  ) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function nextStep() {
    setCurrentStep((prev) =>
      Math.min(prev + 1, steps.length - 1)
    );
  }

  function previousStep() {
    setCurrentStep((prev) =>
      Math.max(prev - 1, 0)
    );
  }

  function renderStep() {
    switch (currentStep) {
      case 0:
        return (
          <ProductStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );

      case 1:
        return (
          <CountryStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );

      case 2:
        return (
          <QuantityStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );

      case 3:
        return (
          <PackagingStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );

      case 4:
        return (
          <CompanyStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );

      case 5:
        return (
          <IncotermsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );

      case 6:
        return (
          <RequirementsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );

      case 7:
        return (
          <ReviewStep
            formData={formData}
          />
        );

      default:
        return (
          <ProductStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
    }
  }

  // Step Validation
  const isNextDisabled =
    (currentStep === 0 && !formData.product) ||
    (currentStep === 1 && !formData.country) ||
    (currentStep === 2 && !formData.quantity) ||
    (currentStep === 3 && !formData.packaging);

  return (
    <div className="mx-auto mt-16 max-w-4xl rounded-3xl bg-white p-10 shadow-xl">
      <ProgressBar
        currentStep={currentStep + 1}
        totalSteps={steps.length}
        title={steps[currentStep]}
      />

      <div className="mt-12">
        {renderStep()}
      </div>

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        onPrevious={previousStep}
        onNext={nextStep}
        isNextDisabled={isNextDisabled}
      />
    </div>
  );
}