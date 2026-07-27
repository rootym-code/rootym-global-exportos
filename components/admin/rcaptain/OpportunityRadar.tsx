const radar = [
    {
      title: "🔥 Ready to Close",
      value: "3 Buyers",
      description: "High probability opportunities ready for final negotiation.",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "⚠ Going Cold",
      value: "2 Buyers",
      description: "No response received in the last 10 days.",
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "💰 Highest Revenue",
      value: "USD 34,000",
      description: "Potential revenue from today's top opportunities.",
      color: "from-violet-500 to-purple-600",
    },
  ];
  
  export default function OpportunityRadar() {
    return (
      <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
  
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Opportunity Radar
          </p>
  
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Sales Intelligence
          </h2>
  
          <p className="mt-2 text-gray-500">
            Focus your time where it matters the most.
          </p>
        </div>
  
        <div className="grid gap-6 lg:grid-cols-3">
  
          {radar.map((item) => (
            <div
              key={item.title}
              className={`rounded-3xl bg-gradient-to-br ${item.color} p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
            >
              <div className="flex h-full flex-col justify-between">
  
                <div>
                  <p className="text-sm font-medium opacity-90">
                    {item.title}
                  </p>
  
                  <h3 className="mt-4 text-4xl font-bold">
                    {item.value}
                  </h3>
                </div>
  
                <p className="mt-8 text-sm leading-6 opacity-90">
                  {item.description}
                </p>
  
              </div>
            </div>
          ))}
  
        </div>
  
      </section>
    );
  }