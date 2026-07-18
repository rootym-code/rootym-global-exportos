"use client";

import { useState } from "react";
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

export default function ExportInquiryForm() {
  const [form, setForm] = useState<InquiryFormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    const message = `Packaging: ${form.packaging || "-"}

Destination Port: ${form.destinationPort || "-"}

Incoterm: ${form.incoterm || "-"}

Expected Purchase Date: ${form.purchaseDate || "-"}

Additional Requirements:
${form.requirements || "-"}`;

    try {
      const response = await fetch("/api/inquiry", {
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
      });

      const data: { message?: string } = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit your export inquiry."
        );
      }

      setSuccessMessage(
        "Thank you! Your export inquiry has been submitted successfully. Our export team will contact you shortly."
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
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
      <div className="mb-8">
        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-[#2E7D32]">
          Export Inquiry
        </span>

        <h2 className="mt-5 text-3xl font-bold text-gray-900">
          Request a Quotation
        </h2>

        <p className="mt-3 text-gray-600">
          Complete the form below and our export team will contact you with
          pricing, packaging options and shipment details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Information */}

        <div>
          <h3 className="mb-4 text-xl font-semibold">
            Company Information
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Company Name"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
            />

            <Input
              label="Contact Person"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Phone / WhatsApp"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <Input
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Product */}

        <div>
          <h3 className="mb-4 text-xl font-semibold">
            Product Requirement
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Product"
              name="product"
              value={form.product}
              onChange={handleChange}
              required
            />

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
              placeholder="5kg Cartons"
              value={form.packaging}
              onChange={handleChange}
            />

            <Input
              label="Destination Port"
              name="destinationPort"
              placeholder="Dubai Port"
              value={form.destinationPort}
              onChange={handleChange}
            />

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Incoterm
              </label>

              <select
                name="incoterm"
                value={form.incoterm}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2E7D32]"
              >
                <option>FOB</option>
                <option>CIF</option>
                <option>EXW</option>
                <option>CFR</option>
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
        </div>

        {/* Requirements */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Additional Requirements
          </label>

          <textarea
            rows={6}
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder="Please describe your quality requirements, destination country regulations, packaging preferences or any additional information."
            className="w-full rounded-2xl border border-gray-300 px-4 py-4 outline-none transition focus:border-[#2E7D32]"
          />
        </div>

        {successMessage && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Submitting Export Inquiry..."
            : "Submit Export Inquiry"}
        </Button>
      </form>
    </section>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2E7D32]"
      />
    </div>
  );
}