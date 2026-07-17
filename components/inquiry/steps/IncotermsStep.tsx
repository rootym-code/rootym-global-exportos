"use client";

import type { Incoterm, InquiryStepProps } from "@/types/inquiry";

const incoterms: {
  value: Incoterm;
  title: string;
  description: string;
}[] = [
  {
    value: "FOB",
    title: "FOB",
    description: "Free On Board",
  },
  {
    value: "CIF",
    title: "CIF",
    description: "Cost, Insurance & Freight",
  },
  {
    value: "CFR",
    title: "CFR",
    description: "Cost & Freight",
  },
  {
    value: "EXW",
    title: "EXW",
    description: "Ex Works",
  },
  {
    value: "FCA",
    title: "FCA",
    description: "Free Carrier",
  },
  {
    value: "CPT",
    title: "CPT",
    description: "Carriage Paid To",
  },
  {
    value: "CIP",
    title: "CIP",
    description: "Carriage & Insurance Paid To",
  },
  {
    value: "DAP",
    title: "DAP",
    description: "Delivered At Place",
  },
  {
    value: "DPU",
    title: "DPU",
    description: "Delivered at Place Unloaded",
  },
  {
    value: "DDP",
    title: "DDP",
    description: "Delivered Duty Paid",
  },
  {
    value: "Not Sure",
    title: "Not Sure",
    description: "Our export team will recommend the best shipping terms.",
  },
];

export default function IncotermsStep({
  formData,
  updateFormData,
}: InquiryStepProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900">
      Preferred Delivery Terms (Incoterms® 2020)
      </h2>

      <p className="mt-3 text-lg text-gray-600">
        Select your preferred Incoterm for this shipment. If you&apos;re unsure,
        choose <strong>Not Sure</strong> and our export team will guide you.
      </p>

      <div className="mt-10 grid gap-4">
        {incoterms.map((item) => (
          <label
            key={item.value}
            className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
              formData.preferredIncoterm === item.value
                ? "border-[#2E7D32] bg-green-50"
                : "border-gray-300 hover:border-[#2E7D32]"
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="radio"
                name="incoterm"
                value={item.value}
                checked={formData.preferredIncoterm === item.value}
                onChange={() =>
                  updateFormData("preferredIncoterm", item.value)
                }
                className="mt-1"
              />

              <div>
                <h3 className="font-semibold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            </div>
          </label>
        ))}
      </div>

      {formData.preferredIncoterm &&
        formData.preferredIncoterm !== "Not Sure" && (
          <div className="mt-10">
            <label
              htmlFor="namedPlace"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Named Port / Place
            </label>

            <input
              id="namedPlace"
              type="text"
              placeholder="Example: Nhava Sheva Port, India"
              value={formData.namedPlace}
              onChange={(e) =>
                updateFormData("namedPlace", e.target.value)
              }
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 outline-none transition-all duration-200 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]"
            />

            <p className="mt-2 text-sm text-gray-500">
              Examples: Mundra Port, Jebel Ali Port, Hamburg Port, Delhi ICD,
              Berlin Warehouse.
            </p>
          </div>
        )}

      <div className="mt-10 rounded-2xl border border-green-100 bg-green-50 p-5">
        <h3 className="font-semibold text-[#2E7D32]">
          What are Incoterms?
        </h3>

        <p className="mt-2 leading-7 text-gray-700">
          Incoterms® 2020 are internationally recognized trade rules published
          by the International Chamber of Commerce (ICC). They define the
          responsibilities of buyers and sellers for shipping, insurance, risk,
          and delivery of goods.
        </p>

        <p className="mt-4 leading-7 text-gray-700">
        If you&apos;re not familiar with these terms, simply select{" "}
          <strong>Not Sure</strong>. We&apos;ll recommend the most suitable shipping option based on your destination and purchasing requirements.
        </p>
      </div>
    </div>
  );
}