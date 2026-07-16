import { Globe2, ArrowRight } from "lucide-react";

import Card from "@/components/ui/Card";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";

import { globalMarkets } from "@/data/globalMarkets";

export default function GlobalMarkets() {
  return (
    <SectionContainer className="bg-gradient-to-b from-gray-50 to-white">
      <SectionHeading
        badge="Global Markets"
        title="Serving International Buyers Across Key Markets"
        description="ROOTYM focuses on supplying premium Indian agricultural products to importers, distributors, wholesalers and retail chains across strategically selected global markets."
      />

      <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {globalMarkets.map((market) => (
          <Card
            key={market.country}
            className="group p-8"
          >
            <div className="flex items-center justify-between">
              <span className="text-5xl">
                {market.flag}
              </span>

              <Globe2 className="h-8 w-8 text-[#2E7D32]" />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-gray-900">
              {market.country}
            </h3>

            <div className="mt-6 flex flex-wrap gap-2">
              {market.products.map((product) => (
                <span
                  key={product}
                  className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-[#2E7D32]"
                >
                  {product}
                </span>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t pt-5">
              <span className="text-sm font-medium text-gray-600">
                Market Focus
              </span>

              <ArrowRight className="h-5 w-5 text-[#2E7D32] transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-20 rounded-3xl bg-[#2E7D32] px-8 py-12 text-center text-white shadow-xl">
        <h3 className="text-3xl font-bold">
          Expanding Global Partnerships
        </h3>

        <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-green-100">
          We are continuously expanding our international network and welcome
          inquiries from importers, distributors and food businesses looking
          for a reliable sourcing partner in India.
        </p>
      </div>
    </SectionContainer>
  );
}