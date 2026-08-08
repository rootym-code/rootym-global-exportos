import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductsHero from "@/components/products/ProductsHero";
import ProductPortfolio from "@/components/products/ProductPortfolio";
import BuyerConfidence from "@/components/products/BuyerConfidence";
import ExportJourney from "@/components/products/ExportJourney";
import AIFuture from "@/components/products/AIFuture";
import ProductsCTA from "@/components/products/ProductsCTA";

import {
  ArrowRight,
  BadgeCheck,
  Globe2,
  Package,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ProductStatus } from "@/lib/generated/prisma";
import { listProducts } from "@/lib/services/product.service";

export const metadata = {
  title: "Products | ROOTYM Global Export Platform",
  description:
    "Discover premium Indian agricultural products sourced responsibly and prepared for international markets with ROOTYM.",
};



function getProductImageUrl(fileUrl?: string | null) {
  if (!fileUrl) {
    return "/images/products/placeholder.png";
  }

  return fileUrl;
}




export default async function ProductsPage() {
  const { items: products } = await listProducts({
    status: ProductStatus.PUBLISHED,
    page: 1,
    pageSize: 100,
  });
    return (
        <>
          <Navbar />
      
          <main className="overflow-x-hidden bg-white">
          <ProductsHero />

          <ProductPortfolio products={products} />

          <BuyerConfidence />

          <ExportJourney />
          <AIFuture />

          <ProductsCTA />

      </main>

<Footer />
</>
);
}

/* -------------------------------------------------------------------------- */
/* Helper Components */
/* -------------------------------------------------------------------------- */

function TrustCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
      <div className="flex justify-center text-[#2E7D32]">
        {icon}
      </div>

      <h3 className="mt-4 text-center font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-1 text-center text-sm text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="inline-flex rounded-2xl bg-green-100 p-4 text-[#2E7D32]">
        {icon}
      </div>

      <h3 className="mt-6 text-2xl font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-gray-600">
        {description}
      </p>
    </div>
  );
}

function JourneyStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-green-100 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 font-bold text-[#2E7D32]">
        {number}
      </div>

      <h3 className="mt-5 font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
}

function AIBox({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
      <h3 className="text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-green-100">
        {description}
      </p>
    </div>
  );
}


 
