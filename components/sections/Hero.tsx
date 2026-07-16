import Button from "@/components/ui/Button";
import TrustBadge from "./TrustBadge";
import StatCard from "./StatCard";

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
          <div className="rounded-3xl border border-dashed border-green-300 bg-gradient-to-br from-green-50 to-white p-10 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Global Export Intelligence
            </h2>

            <p className="mt-3 text-gray-600">
              Connecting trusted Indian agricultural suppliers with global
              importers through quality, compliance and dependable logistics.
            </p>

            <div className="mt-10 grid gap-5">
              <DashboardItem icon="🌍" title="18+ Countries Served" />
              <DashboardItem icon="📦" title="25+ Export Products" />
              <DashboardItem icon="🚢" title="99.9% On-Time Shipment" />
              <DashboardItem icon="⭐" title="APEDA Registered Exporter" />
            </div>

            <div className="mt-8 rounded-2xl bg-white p-6 shadow">
              <p className="font-semibold text-[#2E7D32]">
                Interactive Experience
              </p>

              <ul className="mt-4 space-y-2 text-gray-600">
                <li>✓ 3D Product Showcase</li>
                <li>✓ Interactive World Map</li>
                <li>✓ Live Export Routes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard value="25+" label="Export Products" />
        <StatCard value="18+" label="Target Countries" />
        <StatCard value="99.9%" label="On-Time Delivery" />
        <StatCard value="24/7" label="Buyer Support" />
      </div>
    </section>
  );
}

function DashboardItem({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) {
  return (
    <div className="flex items-center rounded-2xl bg-white p-5 shadow-sm">
      <span className="mr-4 text-3xl">{icon}</span>
      <span className="text-lg font-semibold text-gray-800">{title}</span>
    </div>
  );
}