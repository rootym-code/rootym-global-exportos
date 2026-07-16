import Button from "@/components/ui/Button";
import TrustBadge from "./TrustBadge";
import StatCard from "./StatCard";
import GlobalExportPanel from "./GlobalExportPanel";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-32 pb-24">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        {/* LEFT */}
        <div>
          <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-[#2E7D32]">
            Trusted Indian Export Partner
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 lg:text-7xl">
            Source Premium Indian Agricultural Products with Confidence
          </h1>

          <p className="mt-8 text-lg leading-8 text-gray-600 lg:text-xl">
            ROOTYM partners with importers, distributors, supermarkets and food
            processors worldwide to source premium fruits, vegetables, grains,
            spices and value-added food products from India with reliable
            sourcing, export documentation support and dependable global
            logistics.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button>Request a Quote</Button>

            <Button variant="secondary">
              Browse Export Products
            </Button>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <TrustBadge text="APEDA Registered Exporter" />
            <TrustBadge text="Export Documentation Support" />
            <TrustBadge text="Global Logistics Assistance" />
            <TrustBadge text="Quality Assured Supply" />
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <GlobalExportPanel />
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard value="25+" label="Export Products" />
        <StatCard value="18+" label="Target Countries" />
        <StatCard value="99.9%" label="On-Time Delivery" />
        <StatCard value="24/7" label="Buyer Support" />
      </div>
    </section>
  );
}