import {
    Globe,
    Package,
    Ship,
    BadgeCheck,
    MapPin,
  } from "lucide-react";
  
  export default function GlobalExportPanel() {
    const countries = [
      { name: "UAE", flag: "🇦🇪" },
      { name: "United Kingdom", flag: "🇬🇧" },
      { name: "Germany", flag: "🇩🇪" },
      { name: "USA", flag: "🇺🇸" },
      { name: "Sri Lanka", flag: "🇱🇰" },
    ];
  
    return (
      <div className="rounded-[32px] border border-green-100 bg-gradient-to-br from-white via-green-50 to-white p-8 shadow-2xl">
  
        <div className="flex items-center gap-3">
          <Globe className="h-8 w-8 text-[#2E7D32]" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32]">
              Global Export Network
            </p>
  
            <h2 className="text-2xl font-bold text-gray-900">
              Connecting India to the World
            </h2>
          </div>
        </div>
  
        <div className="mt-8 rounded-3xl border border-dashed border-green-200 bg-white p-6">
  
          <div className="flex items-center justify-center">
  
            <div className="rounded-full bg-[#2E7D32] px-6 py-3 text-lg font-bold text-white">
              INDIA
            </div>
  
          </div>
  
          <div className="mt-8 space-y-4">
  
            {countries.map((country) => (
              <div
                key={country.name}
                className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3 transition hover:bg-green-100"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#2E7D32]" />
  
                  <span className="text-lg">
                    {country.flag}
                  </span>
  
                  <span className="font-medium">
                    {country.name}
                  </span>
                </div>
  
                <div className="h-[2px] w-20 bg-[#2E7D32]" />
              </div>
            ))}
  
          </div>
        </div>
  
        <div className="mt-8 grid grid-cols-2 gap-4">
  
          <Metric
            icon={<Package className="h-5 w-5" />}
            value="25+"
            label="Export Products"
          />
  
          <Metric
            icon={<Globe className="h-5 w-5" />}
            value="18+"
            label="Countries"
          />
  
          <Metric
            icon={<Ship className="h-5 w-5" />}
            value="99.9%"
            label="Shipment Reliability"
          />
  
          <Metric
            icon={<BadgeCheck className="h-5 w-5" />}
            value="24×7"
            label="Buyer Support"
          />
  
        </div>
  
        <div className="mt-8 rounded-2xl bg-white p-6 shadow">
  
          <p className="font-semibold text-[#2E7D32]">
            Certifications
          </p>
  
          <div className="mt-4 flex flex-wrap gap-3">
  
            <Badge text="APEDA Registered" />
  
            <Badge text="IEC Holder" />
  
            <Badge text="FSSAI Licensed" />
  
          </div>
  
        </div>
      </div>
    );
  }
  
  function Metric({
    icon,
    value,
    label,
  }: {
    icon: React.ReactNode;
    value: string;
    label: string;
  }) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow transition hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center gap-2 text-[#2E7D32]">
          {icon}
        </div>
  
        <div className="mt-3 text-3xl font-bold">
          {value}
        </div>
  
        <div className="text-sm text-gray-500">
          {label}
        </div>
      </div>
    );
  }
  
  function Badge({ text }: { text: string }) {
    return (
      <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-[#2E7D32]">
        {text}
      </span>
    );
  }