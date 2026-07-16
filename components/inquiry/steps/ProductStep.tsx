"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

import { products } from "@/data/products";
import type { InquiryStepProps } from "@/types/inquiry";

export default function ProductStep({
  formData,
  updateFormData,
}: InquiryStepProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900">
        Which product would you like to import?
      </h2>

      <p className="mt-3 text-lg text-gray-600">
        Select the product you are interested in.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => {
          const selected = formData.product === product.slug;

          return (
            <button
              key={product.id}
              type="button"
              onClick={() =>
                updateFormData("product", product.slug)
              }
              className={`group overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                selected
                  ? "border-[#2E7D32] ring-2 ring-[#2E7D32]"
                  : "border-gray-200 hover:border-[#2E7D32]"
              }`}
            >
              <div className="relative h-56 bg-gradient-to-br from-green-50 via-white to-green-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-6 transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {product.name}
                  </h3>

                  <CheckCircle2
                    className={`h-6 w-6 ${
                      selected
                        ? "text-[#2E7D32]"
                        : "text-gray-300"
                    }`}
                  />
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                  {product.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-[#2E7D32]">
                    {product.category}
                  </span>

                  <span className="text-sm font-medium text-gray-500">
                    {product.origin}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}