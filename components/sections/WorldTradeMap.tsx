import { MapPin } from "lucide-react";

const destinations = [
  { name: "UAE", x: 82, y: 36 },
  { name: "Germany", x: 22, y: 28 },
  { name: "United Kingdom", x: 18, y: 20 },
  { name: "USA", x: 4, y: 26 },
  { name: "Sri Lanka", x: 56, y: 58 },
];

export default function WorldTradeMap() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-white to-green-50 p-6">

      <div className="relative h-[360px] overflow-hidden rounded-3xl border border-green-100 bg-white">

        {/* Background Grid */}

        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#2E7D32_1px,transparent_1px),linear-gradient(90deg,#2E7D32_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* India */}

        <div
          className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-[#2E7D32] text-sm font-bold text-white shadow-xl"
          style={{
            left: "52%",
            top: "48%",
            transform: "translate(-50%,-50%)",
          }}
        >
          INDIA
        </div>

        {destinations.map((country) => (
          <div
            key={country.name}
            className="absolute"
            style={{
              left: `${country.x}%`,
              top: `${country.y}%`,
            }}
          >
            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-md">

              <MapPin
                size={14}
                className="text-[#2E7D32]"
              />

              <span className="text-xs font-semibold">
                {country.name}
              </span>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}