import { BarChart3, Globe2, MessageSquare, Package } from "lucide-react";

import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const stats = [
  {
    title: "Total Inquiries",
    value: "0",
    icon: MessageSquare,
  },
  {
    title: "Today's Inquiries",
    value: "0",
    icon: BarChart3,
  },
  {
    title: "Products",
    value: "0",
    icon: Package,
  },
  {
    title: "Countries",
    value: "0",
    icon: Globe2,
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              ROOTYM Admin Dashboard
            </h1>

            <p className="mt-2 text-slate-600">
              Welcome to the ROOTYM Global Export Platform administration panel.
            </p>
          </div>

          <Button variant="primary">
            New Inquiry
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {item.title}
                    </p>

                    <h2 className="mt-2 text-4xl font-bold text-slate-900">
                      {item.value}
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-green-100 p-4">
                    <Icon className="h-7 w-7 text-green-700" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Inquiries */}
        <Card
          hover={false}
          className="mt-10 p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Recent Inquiries
            </h2>

            <Button variant="outline">
              View All
            </Button>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 py-20 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-slate-400" />

            <h3 className="text-xl font-semibold text-slate-700">
              No inquiries yet
            </h3>

            <p className="mt-2 text-slate-500">
              Customer inquiries will appear here once they are submitted.
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}