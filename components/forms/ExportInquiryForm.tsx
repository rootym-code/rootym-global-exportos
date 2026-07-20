"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FileCheck2,
  Globe2,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

type InquiryFormState = {
  company: string;
  contact: string;
  email: string;
  phone: string;
  country: string;
  product: string;
  quantity: string;
  packaging: string;
  destinationPort: string;
  incoterm: string;
  purchaseDate: string;
  requirements: string;
};

const initialForm: InquiryFormState = {
  company: "",
  contact: "",
  email: "",
  phone: "",
  country: "",
  product: "",
  quantity: "",
  packaging: "",
  destinationPort: "",
  incoterm: "FOB",
  purchaseDate: "",
  requirements: "",
};

const productOptions = [
  "Makhana (Fox Nuts)",
  "Dehydrated Onion Powder",
  "Frozen French Fries",
  "Potato Starch",
  "Non-Basmati Rice",
  "Wheat",
  "Other Agricultural Products",
];

const incotermOptions = [
  "FOB",
  "CIF",
  "CFR",
  "EXW",
];

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    description:
      "Reliable sourcing and quality checks before shipment.",
  },
  {
    icon: FileCheck2,
    title: "Export Documentation",
    description:
      "Professional support for international trade documentation.",
  },
  {
    icon: PackageCheck,
    title: "Flexible Packaging",
    description:
      "Retail, bulk, and customized packaging solutions.",
  },
  {
    icon: Globe2,
    title: "Global Supply",
    description:
      "Export support for international buyers and partners.",
  },
];

export default function ExportInquiryForm() {
  const [form, setForm] =
    useState<InquiryFormState>(initialForm);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    const message = `
Packaging Preference:
${form.packaging || "-"}

Destination Port:
${form.destinationPort || "-"}

Preferred Incoterm:
${form.incoterm || "-"}

Expected Purchase Date:
${form.purchaseDate || "-"}

Additional Requirements:
${form.requirements || "-"}
`;

    try {
      const response = await fetch(
        "/api/inquiry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName: form.company,
            contactPerson: form.contact,
            email: form.email,
            phone: form.phone,
            country: form.country,
            product: form.product,
            quantity: form.quantity,
            unit: "Custom",
            message,
          }),
        }
      );

      const data: {
        message?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to submit export inquiry."
        );
      }

      setSuccessMessage(
        "Thank you! Your export inquiry has been submitted successfully. Our team will contact you shortly."
      );

      setForm(initialForm);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
      <div className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-white p-8">
        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
          Export Inquiry Form
        </span>

        <h2 className="mt-5 text-3xl font-bold text-gray-900">
          Request Your Customized Export Quote
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-gray-600">
          Share your sourcing requirements with ROOTYM. Our export team
          will review your requirements and provide suitable pricing,
          packaging, documentation, and shipment guidance.
        </p>
      </div>

      <div className="grid gap-6 border-b border-gray-100 bg-gray-50 p-8 md:grid-cols-2 lg:grid-cols-4">
        {trustPoints.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <Icon className="h-6 w-6 text-green-700" />

              <h3 className="mt-3 font-semibold text-gray-900">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-10 p-8"
      >
                {/* Company Information */}

                <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-700" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Company Information
              </h3>

              <p className="text-sm text-gray-600">
                Tell us about your organization and primary contact.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Company Name"
              name="company"
              placeholder="ABC Foods Trading LLC"
              value={form.company}
              onChange={handleChange}
              required
            />

            <Input
              label="Contact Person"
              name="contact"
              placeholder="John Smith"
              value={form.contact}
              onChange={handleChange}
              required
            />

            <Input
              label="Business Email"
              type="email"
              name="email"
              placeholder="john@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Phone / WhatsApp"
              name="phone"
              placeholder="+971 50 123 4567"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <Input
              label="Country"
              name="country"
              placeholder="United Arab Emirates"
              value={form.country}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Product Requirements */}

        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <PackageCheck className="h-5 w-5 text-green-700" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Product Requirements
              </h3>

              <p className="text-sm text-gray-600">
                Select the product and quantity you wish to import.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Product
              </label>

              <select
                name="product"
                value={form.product}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-700"
              >
                <option value="">
                  Select Product
                </option>

                {productOptions.map((product) => (
                  <option
                    key={product}
                    value={product}
                  >
                    {product}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Required Quantity"
              name="quantity"
              placeholder="Example: 25 MT"
              value={form.quantity}
              onChange={handleChange}
              required
            />

            <Input
              label="Preferred Packaging"
              name="packaging"
              placeholder="25 kg PP Bags / 250g Retail Pouches"
              value={form.packaging}
              onChange={handleChange}
            />

            <Input
              label="Destination Port"
              name="destinationPort"
              placeholder="Jebel Ali Port, Dubai"
              value={form.destinationPort}
              onChange={handleChange}
            />
          </div>
        </section>
                {/* Shipping & Commercial Terms */}

                <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <Globe2 className="h-5 w-5 text-green-700" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Shipping & Commercial Terms
              </h3>

              <p className="text-sm text-gray-600">
                Help us prepare the most suitable commercial quotation.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Preferred Incoterm
              </label>

              <select
                name="incoterm"
                value={form.incoterm}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-700"
              >
                {incotermOptions.map((term) => (
                  <option
                    key={term}
                    value={term}
                  >
                    {term}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Expected Purchase Date"
              type="date"
              name="purchaseDate"
              value={form.purchaseDate}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Additional Requirements */}

        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <FileCheck2 className="h-5 w-5 text-green-700" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Additional Requirements
              </h3>

              <p className="text-sm text-gray-600">
                Share any information that will help us prepare an accurate
                quotation.
              </p>
            </div>
          </div>

          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Message
          </label>

          <textarea
            rows={8}
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder="Examples:
• Product specifications
• Grade / Quality requirements
• Packaging preferences
• Private Label / OEM requirements
• Destination country regulations
• Payment terms
• Delivery schedule
• Any additional information"
            className="w-full rounded-2xl border border-gray-300 px-4 py-4 leading-7 outline-none transition focus:border-green-700"
          />
        </section>

        {/* Status Messages */}

        {successMessage && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Submit Section */}

        <section className="rounded-3xl border border-green-100 bg-gradient-to-r from-green-50 to-white p-8">
          <h3 className="text-2xl font-bold text-gray-900">
            Before You Submit
          </h3>

          <p className="mt-3 leading-7 text-gray-600">
            Please ensure that your company information, product details,
            destination country, and quantity requirements are accurate. This
            allows our export specialists to prepare a faster and more accurate
            quotation.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-700" />

              <p className="text-sm leading-6 text-gray-700">
                Customized quotation based on your specific requirements.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-700" />

              <p className="text-sm leading-6 text-gray-700">
                Guidance on packaging, documentation, and export process.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-700" />

              <p className="text-sm leading-6 text-gray-700">
                Support for bulk orders, distributors, wholesalers, and private
                label opportunities.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-700" />

              <p className="text-sm leading-6 text-gray-700">
                Professional response from our export team after reviewing your
                enquiry.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="mt-10 w-full py-6 text-base"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting Export Inquiry..."
              : "Submit Export Inquiry"}
          </Button>
        </section>      </form>
    </section>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

function Input({
  label,
  className = "",
  ...props
}: InputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
        {props.required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        {...props}
        className={`w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-green-700 focus:ring-4 focus:ring-green-100 ${className}`}
      />
    </div>
  );
}

// END OF FILE