"use client";

import { useState } from "react";

import ProgressBar from "./ProgressBar";
import NavigationButtons from "./NavigationButtons";

import ProductStep from "./steps/ProductStep";
import CountryStep from "./steps/CountryStep";
import QuantityStep from "./steps/QuantityStep";
import PackagingStep from "./steps/PackagingStep";
import CompanyStep from "./steps/CompanyStep";
import RequirementsStep from "./steps/RequirementsStep";
import ReviewStep from "./steps/ReviewStep";
import type { InquiryFormData } from "@/types/inquiry";

const steps = [
  "Product",
  "Country",
  "Quantity",
  "Packaging",
  "Company",
  "Requirements",
  "Review",
];



export default function InquiryWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<InquiryFormData>({
    product: "",
    country: "",
    quantity: "",
    packaging: "",
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    requirements: "",
  });

  function updateFormData(
    field: keyof InquiryFormData,
    value: string
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
          <RequirementsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );

      case 6:
        return <ReviewStep formData={formData} />;

      default:
        return (
          <ProductStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-4xl rounded-3xl bg-white p-10 shadow-xl">
      <ProgressBar
        currentStep={currentStep + 1}
        totalSteps={steps.length}
        title={steps[currentStep]}
      />

      <div className="mt-12">{renderStep()}</div>

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        onPrevious={previousStep}
        onNext={nextStep}
      />
    </div>
  );
}