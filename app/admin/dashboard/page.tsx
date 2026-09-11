/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the platform-level Admin Dashboard with
 *          R-CAPTAIN operational intelligence and a collapsible
 *          roadmap of planned ExportOS administration modules.
 * ============================================================
 */

import AIProductivityScore from "@/components/admin/dashboard/AIProductivityScore";

import MorningBrief from "@/components/admin/rcaptain/MorningBrief";
import PriorityQueue from "@/components/admin/rcaptain/PriorityQueue";
import OpportunityRadar from "@/components/admin/rcaptain/OpportunityRadar";
import TodaysMission from "@/components/admin/rcaptain/TodaysMission";
import FloatingCaptain from "@/components/admin/rcaptain/FloatingCaptain";

import { getDashboardData } from "@/lib/services/dashboard/dashboard.service";

export default async function AdminDashboardPage() {
  const dashboardData = await getDashboardData();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* ======================================================
            ACTIVE PLATFORM MODULE
            ====================================================== */}

        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-800">
            Active
          </span>

          <span className="text-sm font-medium text-slate-500">
            ExportOS Platform Operations
          </span>
        </div>

        {/* Page Header */}
        <MorningBrief
          data={dashboardData.rCaptain.morningBrief}
        />

        {/* Top Section */}
        <div className="mt-8 grid gap-8 xl:grid-cols-3">

          {/* Priority Queue */}
          <div className="xl:col-span-2">
            <PriorityQueue
              opportunities={dashboardData.rCaptain.priorityQueue}
            />
          </div>

          {/* Today's Mission */}
          <div>
            <TodaysMission
              missions={[
                {
                  title: "Calls",
                  completed:
                    dashboardData.rCaptain.todaysMission.calls.completed,
                  total:
                    dashboardData.rCaptain.todaysMission.calls.total,
                  icon: "📞",
                  color: "bg-blue-500",
                },
                {
                  title: "WhatsApp",
                  completed:
                    dashboardData.rCaptain.todaysMission.whatsapp.completed,
                  total:
                    dashboardData.rCaptain.todaysMission.whatsapp.total,
                  icon: "💬",
                  color: "bg-green-500",
                },
                {
                  title: "Quotations",
                  completed:
                    dashboardData.rCaptain.todaysMission.quotations.completed,
                  total:
                    dashboardData.rCaptain.todaysMission.quotations.total,
                  icon: "📄",
                  color: "bg-purple-500",
                },
                {
                  title: "Meetings",
                  completed:
                    dashboardData.rCaptain.todaysMission.meetings.completed,
                  total:
                    dashboardData.rCaptain.todaysMission.meetings.total,
                  icon: "🤝",
                  color: "bg-orange-500",
                },
              ]}
            />
          </div>

        </div>

        {/* AI Productivity Score */}
        <div className="mt-8">
          <AIProductivityScore
            data={dashboardData.rCaptain.productivity}
          />
        </div>

        {/* Opportunity Radar */}
        <div className="mt-8">
          <OpportunityRadar
            radar={[
              {
                title: "🔥 Ready to Close",
                value: `${dashboardData.rCaptain.opportunityRadar.readyToClose} Buyers`,
                insight:
                  "Buyers currently in negotiation are showing the strongest buying intent.",
                recommendation:
                  "Prioritize negotiations today.",
                color: "from-green-500 to-emerald-600",
              },
              {
                title: "⚠ Going Cold",
                value: `${dashboardData.rCaptain.opportunityRadar.goingCold} Buyers`,
                insight:
                  "These buyers require immediate follow-up to prevent losing momentum.",
                recommendation:
                  "Contact them today via WhatsApp or call.",
                color: "from-amber-500 to-orange-500",
              },
              {
                title: "💰 Highest Revenue",
                value:
                  dashboardData.rCaptain.opportunityRadar.highestRevenue,
                insight:
                  "Largest potential opportunity identified by R-CAPTAIN.",
                recommendation:
                  "Focus on the highest-value buyer first.",
                color: "from-violet-500 to-purple-600",
              },
            ]}
          />
        </div>

        {/* ======================================================
            EXPORTOS PLATFORM ADMINISTRATION ROADMAP
            ====================================================== */}

        <section className="mt-12 rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                    Planned
                  </span>

                  <span className="text-sm font-medium text-slate-500">
                    Platform Administration Roadmap
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                  ExportOS Admin Scope
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  These are platform-level administration capabilities
                  intended for ROOTYM ExportOS operators. They are
                  separate from the Customer Workspace and will manage
                  multiple customer tenants.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-200">

            {/* Customer & Tenant Management */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 sm:px-8">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Customer & Tenant Management
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage customers, tenants, memberships and account
                    lifecycle.
                  </p>
                </div>

                <span className="ml-4 text-xl text-slate-400 transition group-open:rotate-180">
                  ▼
                </span>
              </summary>

              <div className="bg-slate-50 px-6 pb-6 sm:px-8">
                <div className="grid gap-3 pt-2 md:grid-cols-2">
                  {[
                    "Customer directory",
                    "Tenant creation and provisioning",
                    "Tenant activation / suspension",
                    "Customer membership overview",
                    "Customer account status",
                    "Tenant Website status",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </details>

            {/* Billing & Subscriptions */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 sm:px-8">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Billing & Subscriptions
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage plans, subscriptions, renewals and customer
                    billing status.
                  </p>
                </div>

                <span className="ml-4 text-xl text-slate-400 transition group-open:rotate-180">
                  ▼
                </span>
              </summary>

              <div className="bg-slate-50 px-6 pb-6 sm:px-8">
                <div className="grid gap-3 pt-2 md:grid-cols-2">
                  {[
                    "Subscription plans",
                    "Tenant subscription status",
                    "Trial periods",
                    "Plan changes",
                    "Renewal status",
                    "Billing history",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </details>

            {/* Payments */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 sm:px-8">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Payments
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Monitor payment activity and customer payment health.
                  </p>
                </div>

                <span className="ml-4 text-xl text-slate-400 transition group-open:rotate-180">
                  ▼
                </span>
              </summary>

              <div className="bg-slate-50 px-6 pb-6 sm:px-8">
                <div className="grid gap-3 pt-2 md:grid-cols-2">
                  {[
                    "Payment transactions",
                    "Payment status",
                    "Successful payments",
                    "Failed payments",
                    "Refunds",
                    "Outstanding balances",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </details>

            {/* Tenant Websites */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 sm:px-8">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tenant Websites
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Platform-level visibility and administration of
                    customer websites.
                  </p>
                </div>

                <span className="ml-4 text-xl text-slate-400 transition group-open:rotate-180">
                  ▼
                </span>
              </summary>

              <div className="bg-slate-50 px-6 pb-6 sm:px-8">
                <div className="grid gap-3 pt-2 md:grid-cols-2">
                  {[
                    "Website provisioning",
                    "Website activation",
                    "Website status",
                    "CMS administration",
                    "Website configuration",
                    "Tenant website health",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </details>

            {/* Customer Business Operations */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 sm:px-8">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Customer Business Operations
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Platform oversight of tenant business activity.
                  </p>
                </div>

                <span className="ml-4 text-xl text-slate-400 transition group-open:rotate-180">
                  ▼
                </span>
              </summary>

              <div className="bg-slate-50 px-6 pb-6 sm:px-8">
                <div className="grid gap-3 pt-2 md:grid-cols-2">
                  {[
                    "Tenant products",
                    "Tenant inquiries",
                    "Buyer activity",
                    "Quotes",
                    "Proforma invoices",
                    "Follow-up activity",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </details>

            {/* Integrations */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 sm:px-8">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Platform Integrations
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage platform-level integrations and service
                    connectivity.
                  </p>
                </div>

                <span className="ml-4 text-xl text-slate-400 transition group-open:rotate-180">
                  ▼
                </span>
              </summary>

              <div className="bg-slate-50 px-6 pb-6 sm:px-8">
                <div className="grid gap-3 pt-2 md:grid-cols-2">
                  {[
                    "Google integrations",
                    "WhatsApp integrations",
                    "Payment providers",
                    "Email services",
                    "Webhook monitoring",
                    "Integration health",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </details>

            {/* System Administration */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 sm:px-8">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    System Administration
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Platform-wide controls for ExportOS operators.
                  </p>
                </div>

                <span className="ml-4 text-xl text-slate-400 transition group-open:rotate-180">
                  ▼
                </span>
              </summary>

              <div className="bg-slate-50 px-6 pb-6 sm:px-8">
                <div className="grid gap-3 pt-2 md:grid-cols-2">
                  {[
                    "Admin accounts",
                    "Roles and permissions",
                    "Audit logs",
                    "Platform settings",
                    "System health",
                    "Operational monitoring",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </details>

          </div>
        </section>

      </div>

      {/* Floating AI Assistant */}
      <FloatingCaptain
        data={dashboardData.rCaptain}
      />
    </main>
  );
}