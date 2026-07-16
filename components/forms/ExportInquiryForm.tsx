"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ExportInquiryForm() {
  const [form, setForm] = useState({
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
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log(form);

    alert(
      "Thank you! Your export inquiry has been captured. Backend integration will be added in a later sprint."
    );
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
            />

            <Input
              label="Contact Person"
              name="contact"
              value={form.contact}
              onChange={handleChange}
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <Input
              label="Phone / WhatsApp"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <Input
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
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
            />

            <Input
              label="Required Quantity"
              name="quantity"
              placeholder="Example: 25 MT"
              value={form.quantity}
              onChange={handleChange}
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

        <Button className="w-full">
          Submit Export Inquiry
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