import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileText,
  Globe2,
  ImageIcon,
  MessageSquare,
  Package,
  Settings,
  Users,
} from "lucide-react";

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

const quickActions = [
  {
    title: "CMS Pages",
    description: "Manage website pages and content.",
    href: "/admin/cms/pages",
    icon: FileText,
  },
  {
    title: "Media Library",
    description: "Upload and organize images and files.",
    href: "/admin/cms/media",
    icon: ImageIcon,
  },
  {
    title: "Products",
    description: "Manage export products.",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Inquiries",
    description: "Review buyer enquiries.",
    href: "/admin/inquiries",
    icon: MessageSquare,
  },
  {
    title: "Buyers",
    description: "Manage buyer information.",
    href: "/admin/buyers",
    icon: Users,
  },
  {
    title: "Settings",
    description: "Configure platform settings.",
    href: "/admin/settings",
    icon: Settings,
  },
];

const recentActivity = [
  {
    title: "Sprint 10.1 Stabilization",
    description: "Admin CMS modules are ready for testing.",
  },
  {
    title: "Media Library",
    description: "Upload and asset management is available.",
  },
  {
    title: "CMS Pages",
    description: "Dynamic page management is enabled.",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-10 px-6 py-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              ROOTYM Admin Dashboard
            </h1>

            <p className="mt-2 max-w-3xl text-slate-600">
              Welcome to the ROOTYM Global Export Platform administration
              portal. Monitor your business, manage content, and oversee
              export operations from a single workspace.
            </p>
          </div>

          <Link href="/admin/inquiries">
            <Button variant="primary">
              View Inquiries
            </Button>
          </Link>
        </div>

        {/* KPI Cards */}
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

        <div className="grid gap-8 xl:grid-cols-3">
                    {/* Quick Actions */}
                    <Card className="xl:col-span-2 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Quick Actions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Frequently used administration modules.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.href}
                    href={action.href}
                  >
                    <Card
                      className="group h-full border border-slate-200 p-5 transition-all hover:border-green-500 hover:shadow-lg"
                      hover={false}
                    >
                      <div className="flex items-start justify-between">
                        <div className="rounded-xl bg-green-100 p-3">
                          <Icon className="h-6 w-6 text-green-700" />
                        </div>

                        <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-green-700" />
                      </div>

                      <h3 className="mt-5 text-lg font-semibold text-slate-900">
                        {action.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {action.description}
                      </p>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card
            hover={false}
            className="p-6"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest platform updates.
              </p>
            </div>

            <div className="space-y-5">
              {recentActivity.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4"
                >
                  <div className="mt-1 h-3 w-3 rounded-full bg-green-600" />

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
                {/* Recent Inquiries */}
                <Card
          hover={false}
          className="p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">
              Recent Inquiries
            </h2>

            <Link href="/admin/inquiries">
              <Button variant="outline">
                View All
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 py-20 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-slate-400" />

            <h3 className="text-xl font-semibold text-slate-700">
              No inquiries yet
            </h3>

            <p className="mt-2 text-slate-500">
              Customer inquiries will automatically appear here after they are
              submitted through the ROOTYM website.
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}

// END OF FILE