import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Package,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

import Button from "@/components/ui/Button";
import { products } from "@/data/products";

export default function ProductShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <span className="rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-[#2E7D32]">
          Featured Export Products
        </span>

        <h2 className="mt-6 text-5xl font-bold text-gray-900">
          Fresh From India. Ready For Global Markets.
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
          Carefully sourced agricultural products for importers,
          wholesalers, distributors and supermarkets across the world.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Top Badges */}
            <div className="flex justify-between px-6 pt-6">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-[#2E7D32]">
                ● {product.availability}
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {product.category}
              </span>
            </div>

            {/* Clickable Image */}
            <Link href={`/products/${product.slug}`}>
              <div className="relative h-72 cursor-pointer overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-8 transition duration-500 group-hover:scale-110"
                />
              </div>
            </Link>

            {/* Product Details */}
            <div className="p-8">
              <Link href={`/products/${product.slug}`}>
                <h3 className="cursor-pointer text-2xl font-bold text-gray-900 transition hover:text-[#2E7D32]">
                  {product.name}
                </h3>
              </Link>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#2E7D32]" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Origin
                    </p>
                    <p className="font-semibold text-gray-800">
                      {product.origin}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-[#2E7D32]" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Packaging
                    </p>
                    <p className="font-semibold text-gray-800">
                      {product.packaging}
                    </p>
                  </div>
                </div>
              </div>

              {/* Export Badges */}
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-[#2E7D32]">
                  APEDA
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Export Ready
                </span>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                  Premium Quality
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                <Link href={`/products/${product.slug}`}>
                  <Button
                    variant="secondary"
                    className="w-full"
                  >
                    View Details
                  </Button>
                </Link>

                <Button className="w-full">
                  Request Quote
                </Button>
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between border-t pt-5">
                <div className="flex items-center gap-2 text-sm font-medium text-[#2E7D32]">
                  <BadgeCheck className="h-4 w-4" />
                  Ready for Export
                </div>

                <ArrowRight className="h-5 w-5 text-gray-400 transition duration-300 group-hover:translate-x-1 group-hover:text-[#2E7D32]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}