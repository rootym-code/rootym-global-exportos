const opportunities = [
    {
      id: 1,
      buyer: "ABC Foods",
      country: "🇱🇰 Sri Lanka",
      product: "Onion Powder",
      stage: "Negotiation",
      revenue: "USD 18,000",
      action: "Call Now",
      reason: "Buyer requested revised pricing.",
      priority: "★★★★★",
    },
    {
      id: 2,
      buyer: "Dubai Fresh",
      country: "🇦🇪 UAE",
      product: "Frozen French Fries",
      stage: "Sample Sent",
      revenue: "USD 12,500",
      action: "Send WhatsApp",
      reason: "Confirm sample delivery.",
      priority: "★★★★☆",
    },
    {
      id: 3,
      buyer: "London Imports",
      country: "🇬🇧 United Kingdom",
      product: "Makhana",
      stage: "Quotation Sent",
      revenue: "USD 8,500",
      action: "Send Revised Quote",
      reason: "Quotation expires tomorrow.",
      priority: "★★★★☆",
    },
  ];
  
  export default function PriorityQueue() {
    return (
      <section className="rounded-3xl bg-white p-8 shadow-xl border border-gray-100">
  
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              AI Priority Queue
            </p>
  
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Next Best Actions
            </h2>
          </div>
  
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            Top 3 Opportunities
          </span>
        </div>
  
        <div className="mt-8 space-y-6">
  
          {opportunities.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
  
                <div className="space-y-2">
  
                  <div className="text-lg font-bold text-amber-500">
                    {item.priority}
                  </div>
  
                  <h3 className="text-2xl font-bold text-gray-900">
                    {item.buyer}
                  </h3>
  
                  <p className="text-gray-600">
                    {item.country}
                  </p>
  
                  <p className="text-gray-600">
                    {item.product}
                  </p>
  
                </div>
  
                <div className="space-y-2">
  
                  <p className="text-sm text-gray-500">
                    Sales Stage
                  </p>
  
                  <div className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                    {item.stage}
                  </div>
  
                  <p className="pt-3 text-sm text-gray-500">
                    AI Recommendation
                  </p>
  
                  <p className="font-semibold text-gray-900">
                    {item.reason}
                  </p>
  
                </div>
  
                <div className="text-center">
  
                  <p className="text-sm text-gray-500">
                    Expected Revenue
                  </p>
  
                  <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                    {item.revenue}
                  </h3>
  
                  <button className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700">
                    {item.action}
                  </button>
  
                </div>
  
              </div>
            </div>
          ))}
  
        </div>
  
      </section>
    );
  }