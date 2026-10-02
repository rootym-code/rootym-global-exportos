"use client";

import Link from "next/link";

import { useCallback, useEffect, useMemo, useState } from "react";

import {

  Activity,

  AlertTriangle,

  ArrowRight,

  BarChart3,

  CheckCircle2,

  Clock3,

  FileCheck2,

  FileText,

  ImageIcon,

  MessageCircle,

  MessageSquare,

  Package,

  Phone,

  RefreshCw,

  Settings,

  Target,

  TrendingUp,

  Users,

  XCircle,

} from "lucide-react";

import { Button } from "@/components/ui/Button";

import Card from "@/components/ui/Card";

interface InquiryCounts {

  total: number;

  new: number;

  contacted: number;

  quotationSent: number;

  negotiation: number;

  confirmed: number;

  rejected: number;

}

interface RecentInquiry {

  id: string;

  inquiryNumber: string;

  companyName: string;

  contactPerson?: string | null;

  country: string;

  product: string;

  status: string;

  priority?: string | null;

  createdAt: string;

}

interface FollowUpIntelligence {

  overdue: number;

  dueToday: number;

  upcoming: number;

  urgent: number;

  completedToday: number;

  assignedToMe: number;

  recommendations?: Recommendation[];

}

interface Recommendation {

  priority: string;

  title: string;

  description: string;

  action: string;

}

interface MorningBrief {

  greeting: string;

  pendingAttention: number;

  quotationsExpiring: number;

  opportunityValue: string;

}

interface OpportunityRadar {

  readyToClose: number;

  goingCold: number;

  highestRevenue: string;

}

interface MissionItem {

  completed: number;

  total: number;

}

interface TodaysMission {

  calls: MissionItem;

  whatsapp: MissionItem;

  quotations: MissionItem;

  meetings: MissionItem;

}

interface Productivity {

  score: number;

  [key: string]: unknown;

}

interface BusinessHealth {

  [key: string]: unknown;

}

interface Captain {

  [key: string]: unknown;

}

interface PriorityItem {

  id?: string;

  inquiryNumber?: string;

  companyName?: string;

  country?: string;

  product?: string;

  status?: string;

  priority?: string;

  score?: number;

  reason?: string;

  [key: string]: unknown;

}

interface DashboardData {

  dashboard: {

    counts: InquiryCounts;

    followUp: FollowUpIntelligence;

    recentInquiries: RecentInquiry[];

  };

  rCaptain: {

    morningBrief: MorningBrief;

    priorityQueue: PriorityItem[];

    opportunityRadar: OpportunityRadar;

    todaysMission: TodaysMission;

    productivity: Productivity;

    businessHealth: BusinessHealth;

    captain: Captain;

  };

}

interface DashboardApiResponse {

  success: boolean;

  message?: string;

  data?: DashboardData;

  dashboard?: DashboardData["dashboard"];

  rCaptain?: DashboardData["rCaptain"];

}

const quickActions = [

  {

    title: "Inquiries",

    description: "Review buyer enquiries and move active opportunities forward.",

    href: "/admin/inquiries",

    icon: MessageSquare,

  },

  {

    title: "Buyers",

    description: "Review buyer relationships, enquiry history and product interest.",

    href: "/admin/buyers",

    icon: Users,

  },

  {

    title: "Follow-ups",

    description: "Manage calls, WhatsApp, quotations and meetings.",

    href: "/admin/followups",

    icon: Phone,

  },

  {

    title: "Products",

    description: "Manage the export products available to international buyers.",

    href: "/admin/products",

    icon: Package,

  },

  {

    title: "CMS Pages",

    description: "Manage website pages and export-focused content.",

    href: "/admin/cms/pages",

    icon: FileText,

  },

  {

    title: "Media Library",

    description: "Upload and organize product and website assets.",

    href: "/admin/cms/media",

    icon: ImageIcon,

  },

];

function formatDate(value: string) {

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {

    return "—";

  }

  return date.toLocaleDateString("en-IN", {

    day: "2-digit",

    month: "short",

    year: "numeric",

  });

}

function formatStatus(value: string) {

  return value

    .replace(/\\\_/g, " ")

    .toLowerCase()

    .replace(/\b\w/g, (letter) => letter.toUpperCase());

}

function getPriorityClass(priority?: string | null) {

  switch (priority?.toUpperCase()) {

    case "URGENT":

    case "CRITICAL":

      return "bg-red-100 text-red-700";

    case "HIGH":

      return "bg-orange-100 text-orange-700";

    case "MEDIUM":

      return "bg-amber-100 text-amber-700";

    case "LOW":

      return "bg-slate-100 text-slate-600";

    default:

      return "bg-slate-100 text-slate-600";

  }

}

function getStatusClass(status?: string) {

  switch (status?.toUpperCase()) {

    case "NEW":

      return "bg-blue-100 text-blue-700";

    case "CONTACTED":

      return "bg-indigo-100 text-indigo-700";

    case "QUOTATION_SENT":

      return "bg-purple-100 text-purple-700";

    case "NEGOTIATION":

      return "bg-amber-100 text-amber-700";

    case "CONFIRMED":

      return "bg-green-100 text-green-700";

    case "REJECTED":

      return "bg-red-100 text-red-700";

    default:

      return "bg-slate-100 text-slate-600";

  }

}

function getGreeting() {

  const hour = new Date().getHours();

  if (hour < 12) {

    return "Good Morning";

  }

  if (hour < 17) {

    return "Good Afternoon";

  }

  return "Good Evening";

}

function missionPercentage(item: MissionItem) {

  if (!item.total) {

    return 0;

  }

  return Math.min(

    100,

    Math.round((item.completed / item.total) * 100)

  );

}

function extractDashboard(

  response: DashboardApiResponse

): DashboardData | null {

  if (response.data) {

    return response.data;

  }

  if (response.dashboard && response.rCaptain) {

    return {

      dashboard: response.dashboard,

      rCaptain: response.rCaptain,

    };

  }

  return null;

}

export default function AdminDashboardPage() {

  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const tenantId = useMemo(() => {

    if (typeof window === "undefined") {

      return "";

    }

    return (

      new URLSearchParams(window.location.search).get("tenantId")?.trim() ??

      ""

    );

  }, []);

  const loadDashboard = useCallback(

    async (isRefresh = false) => {

      try {

        if (isRefresh) {

          setRefreshing(true);

        } else {

          setLoading(true);

        }

        setError("");

        const params = new URLSearchParams();

        if (tenantId) {

          params.set("tenantId", tenantId);

        }

        const query = params.toString();

        const response = await fetch(

          `/api/admin/dashboard${query ? `?${query}` : ""}`,

          {

            method: "GET",

            cache: "no-store",

          }

        );

        const result =

          (await response.json()) as DashboardApiResponse;

        if (!response.ok || !result.success) {

          throw new Error(

            result.message ?? "Unable to load dashboard data."

          );

        }

        const dashboard = extractDashboard(result);

        if (!dashboard) {

          throw new Error(

            "Dashboard response did not contain valid dashboard data."

          );

        }

        setData(dashboard);

      } catch (err) {

        console.error("Admin dashboard error:", err);

        setError(

          err instanceof Error

            ? err.message

            : "Unable to load dashboard data."

        );

      } finally {

        setLoading(false);

        setRefreshing(false);

      }

    },

    [tenantId]

  );

  useEffect(() => {

    void loadDashboard();

  }, [loadDashboard]);

  const counts = data?.dashboard.counts;

  const morningBrief = data?.rCaptain.morningBrief;

  const opportunityRadar = data?.rCaptain.opportunityRadar;

  const mission = data?.rCaptain.todaysMission;

  const productivity = data?.rCaptain.productivity;

  const followUp = data?.dashboard.followUp;

  const recentInquiries =

    data?.dashboard.recentInquiries ?? [];

  const priorityQueue =

    data?.rCaptain.priorityQueue ?? [];

  const recommendations =

    followUp?.recommendations ?? [];

  const productivityScore =

    typeof productivity?.score === "number"

      ? productivity.score

      : 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                  <Activity className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">ROOTYM Admin Dashboard</h1>
                    {tenantId && <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">Customer Workspace</span>}
                  </div>
                  <p className="mt-1 text-sm text-slate-500 sm:text-base">{getGreeting()}. Your export pipeline, buyer activity and follow-ups at a glance.</p>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button type="button" onClick={() => void loadDashboard(true)} disabled={loading || refreshing} className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
              </button>
              <Link href="/admin/inquiries" className="inline-flex h-10 items-center justify-center rounded-xl bg-green-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800">
                View Inquiries <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>

        {loading && !data && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="animate-pulse"><div className="h-4 w-28 rounded bg-slate-200" /><div className="mt-4 h-9 w-16 rounded bg-slate-200" /><div className="mt-3 h-3 w-36 rounded bg-slate-200" /></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <div className="flex items-start gap-3"><div className="rounded-xl bg-red-100 p-2"><AlertTriangle className="h-5 w-5 text-red-600" /></div><div className="min-w-0 flex-1"><h2 className="font-semibold text-red-800">Dashboard data could not be loaded</h2><p className="mt-1 text-sm text-red-700">{error}</p><button type="button" onClick={() => void loadDashboard(true)} className="mt-3 text-sm font-semibold text-red-800 underline underline-offset-2">Try again</button></div></div>
          </div>
        )}

        {data && (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard title="Total Inquiries" value={counts?.total ?? 0} description={`${counts?.new ?? 0} new enquiries`} icon={MessageSquare} />
              <KpiCard title="Needs Attention" value={morningBrief?.pendingAttention ?? 0} description="New + negotiation opportunities" icon={AlertTriangle} accent="amber" />
              <KpiCard title="Ready to Close" value={opportunityRadar?.readyToClose ?? 0} description="Active negotiations" icon={Target} accent="green" />
              <KpiCard title="Confirmed Deals" value={counts?.confirmed ?? 0} description="Successfully confirmed enquiries" icon={CheckCircle2} accent="green" />
            </section>

            <section className="overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-white to-white shadow-sm">
              <div className="border-b border-green-100 px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-green-700"><Activity className="h-4 w-4" /> R-Captain Morning Brief</div><h2 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">{morningBrief?.greeting ?? getGreeting()}</h2><p className="mt-1 text-sm text-slate-600">Here is what needs attention in your export pipeline today.</p></div>
                  <Link href="/admin/followups" className="inline-flex h-10 items-center justify-center rounded-xl bg-green-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800">Open Follow-up Center <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </div>
              </div>
              <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
                <BriefMetric label="Pending Attention" value={morningBrief?.pendingAttention ?? 0} icon={AlertTriangle} />
                <BriefMetric label="Quotation Pipeline" value={morningBrief?.quotationsExpiring ?? 0} icon={FileCheck2} />
                <BriefMetric label="Opportunity Value" value={morningBrief?.opportunityValue ?? "USD 0"} icon={TrendingUp} />
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-slate-950">Follow-up Intelligence</h2><p className="mt-1 text-sm text-slate-500">Customer engagement requiring attention.</p></div><Link href="/admin/followups" className="shrink-0 text-sm font-semibold text-green-700 hover:text-green-800">View all</Link></div>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <IntelligenceMetric label="Overdue" value={followUp?.overdue ?? 0} icon={AlertTriangle} danger />
                  <IntelligenceMetric label="Due Today" value={followUp?.dueToday ?? 0} icon={Clock3} />
                  <IntelligenceMetric label="Upcoming" value={followUp?.upcoming ?? 0} icon={TrendingUp} />
                  <IntelligenceMetric label="Completed" value={followUp?.completedToday ?? 0} icon={CheckCircle2} success />
                </div>
                {recommendations.length > 0 && <div className="mt-5 space-y-2">{recommendations.slice(0, 3).map((recommendation, index) => <div key={`${recommendation.title}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="flex items-start gap-3"><div className="mt-0.5 rounded-lg bg-white p-2 shadow-sm">{recommendation.priority === "CRITICAL" ? <AlertTriangle className="h-4 w-4 text-red-600" /> : <Activity className="h-4 w-4 text-green-700" />}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold text-slate-900">{recommendation.title}</h3><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getPriorityClass(recommendation.priority)}`}>{formatStatus(recommendation.priority)}</span></div><p className="mt-1 text-xs leading-5 text-slate-600">{recommendation.description}</p></div></div></div>)}</div>}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div><h2 className="text-lg font-bold text-slate-950">Opportunity Radar</h2><p className="mt-1 text-sm text-slate-500">Where the commercial pipeline needs attention.</p></div>
                <div className="mt-5 space-y-3">
                  <RadarRow label="Ready to Close" value={opportunityRadar?.readyToClose ?? 0} description="Negotiations currently active" icon={Target} positive />
                  <RadarRow label="Going Cold" value={opportunityRadar?.goingCold ?? 0} description="Active enquiries without recent follow-up" icon={Clock3} danger={(opportunityRadar?.goingCold ?? 0) > 0} />
                  <RadarRow label="Highest Revenue Opportunity" value={opportunityRadar?.highestRevenue ?? "USD 0"} description="Highest current quoted value" icon={TrendingUp} />
                </div>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-slate-950">Today&apos;s Mission</h2><p className="mt-1 text-sm text-slate-500">Planned customer engagement and commercial activities.</p></div><Phone className="h-5 w-5 text-green-700" /></div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <MissionRow label="Calls" icon={Phone} item={mission?.calls ?? { completed: 0, total: 0 }} />
                  <MissionRow label="WhatsApp" icon={MessageCircle} item={mission?.whatsapp ?? { completed: 0, total: 0 }} />
                  <MissionRow label="Quotations" icon={FileCheck2} item={mission?.quotations ?? { completed: 0, total: 0 }} />
                  <MissionRow label="Meetings" icon={Users} item={mission?.meetings ?? { completed: 0, total: 0 }} />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-slate-950">Productivity</h2><p className="mt-1 text-sm text-slate-500">Today&apos;s execution score.</p></div><BarChart3 className="h-5 w-5 text-green-700" /></div>
                <div className="mt-6 flex items-center gap-5"><div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[10px] border-green-100"><div className="text-center"><div className="text-3xl font-bold text-slate-950">{productivityScore}</div><div className="text-[11px] font-medium text-slate-500">/ 100</div></div></div><p className="text-sm leading-6 text-slate-600">{productivityScore >= 80 ? "Excellent execution today." : productivityScore >= 60 ? "Good progress. Keep the pipeline moving." : productivityScore > 0 ? "There is room to improve today's execution." : "No completed activity recorded yet today."}</p></div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold text-slate-950">Inquiry Pipeline</h2><p className="mt-1 text-sm text-slate-500">Buyer enquiries by commercial stage.</p></div><Link href="/admin/inquiries" className="inline-flex items-center text-sm font-semibold text-green-700 hover:text-green-800">Manage Pipeline <ArrowRight className="ml-1.5 h-4 w-4" /></Link></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"><PipelineCard label="New" value={counts?.new ?? 0} color="blue" /><PipelineCard label="Contacted" value={counts?.contacted ?? 0} color="indigo" /><PipelineCard label="Quotation Sent" value={counts?.quotationSent ?? 0} color="purple" /><PipelineCard label="Negotiation" value={counts?.negotiation ?? 0} color="amber" /><PipelineCard label="Confirmed" value={counts?.confirmed ?? 0} color="green" /><PipelineCard label="Rejected" value={counts?.rejected ?? 0} color="red" /></div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold text-slate-950">Priority Queue</h2><p className="mt-1 text-sm text-slate-500">Active opportunities identified by the intelligence engine.</p></div><Link href="/admin/inquiries" className="inline-flex items-center text-sm font-semibold text-green-700 hover:text-green-800">View Inquiries <ArrowRight className="ml-1.5 h-4 w-4" /></Link></div>
              <div className="mt-5 space-y-2">
                {priorityQueue.length === 0 ? <EmptyState icon={CheckCircle2} title="No active priority items" description="There are currently no open enquiries requiring priority attention." /> : priorityQueue.map((item, index) => <Link key={item.id ?? item.inquiryNumber ?? `${item.companyName}-${index}`} href={item.id ? `/admin/inquiries/${item.id}` : "/admin/inquiries"} className="block rounded-xl border border-slate-200 p-4 transition hover:border-green-300 hover:bg-green-50/30"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div className="flex min-w-0 items-start gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 text-xs font-bold text-green-700">{index + 1}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-slate-900">{item.companyName ?? item.inquiryNumber ?? "Buyer enquiry"}</h3>{item.priority && <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getPriorityClass(item.priority)}`}>{formatStatus(item.priority)}</span>}</div><p className="mt-1 text-sm text-slate-600">{item.product ?? "Product not specified"}{item.country ? ` · ${item.country}` : ""}</p></div></div><div className="flex shrink-0 items-center gap-3 md:pl-4">{item.status && <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(item.status)}`}>{formatStatus(item.status)}</span>}{typeof item.score === "number" && <span className="text-sm font-semibold text-slate-600">Score {item.score}</span>}</div></div></Link>)}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold text-slate-950">Recent Inquiries</h2><p className="mt-1 text-sm text-slate-500">Latest buyer enquiries received by ROOTYM.</p></div><Link href="/admin/inquiries" className="inline-flex items-center text-sm font-semibold text-green-700 hover:text-green-800">View All <ArrowRight className="ml-1.5 h-4 w-4" /></Link></div>
              <div className="mt-5 overflow-x-auto">
                {recentInquiries.length === 0 ? <EmptyState icon={MessageSquare} title="No inquiries yet" description="Customer enquiries will appear here when they are received." /> : <table className="w-full min-w-[760px] text-left"><thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><th className="px-3 py-3 font-semibold">Inquiry</th><th className="px-3 py-3 font-semibold">Buyer</th><th className="px-3 py-3 font-semibold">Product</th><th className="px-3 py-3 font-semibold">Status</th><th className="px-3 py-3 font-semibold">Priority</th><th className="px-3 py-3 font-semibold">Received</th></tr></thead><tbody>{recentInquiries.map((inquiry) => <tr key={inquiry.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50"><td className="px-3 py-3"><Link href={`/admin/inquiries/${inquiry.id}`} className="font-semibold text-green-700 hover:text-green-800">{inquiry.inquiryNumber}</Link></td><td className="px-3 py-3"><div className="font-medium text-slate-900">{inquiry.companyName}</div><div className="mt-0.5 text-xs text-slate-500">{inquiry.contactPerson || inquiry.country}</div></td><td className="px-3 py-3 text-sm text-slate-700">{inquiry.product}</td><td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(inquiry.status)}`}>{formatStatus(inquiry.status)}</span></td><td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityClass(inquiry.priority)}`}>{inquiry.priority ? formatStatus(inquiry.priority) : "Normal"}</span></td><td className="px-3 py-3 text-sm text-slate-500">{formatDate(inquiry.createdAt)}</td></tr>)}</tbody></table>}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div><h2 className="text-lg font-bold text-slate-950">Quick Actions</h2><p className="mt-1 text-sm text-slate-500">Open the operational modules you use most often.</p></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{quickActions.map((action) => { const Icon = action.icon; return <Link key={action.href} href={action.href} className="group rounded-xl border border-slate-200 p-4 transition hover:border-green-300 hover:bg-green-50/40"><div className="flex items-center justify-between gap-3"><div className="rounded-xl bg-green-50 p-2.5"><Icon className="h-5 w-5 text-green-700" /></div><ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-green-700" /></div><h3 className="mt-4 font-semibold text-slate-900">{action.title}</h3><p className="mt-1.5 text-sm leading-5 text-slate-500">{action.description}</p></Link>; })}</div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function KpiCard({

  title,

  value,

  description,

  icon: Icon,

  accent = "green",

}: {

  title: string;

  value: number;

  description: string;

  icon: typeof Activity;

  accent?: "green" | "amber";

}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-sm font-medium text-slate-500">

            {title}

          </p>

          <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">

            {value}

          </p>

          <p className="mt-2 text-xs text-slate-500">

            {description}

          </p>

        </div>

        <div

          className={`rounded-2xl p-3 ${

            accent === "amber"

              ? "bg-amber-100"

              : "bg-green-100"

          }`}

        >

          <Icon

            className={`h-6 w-6 ${

              accent === "amber"

                ? "text-amber-700"

                : "text-green-700"

            }`}

          />

        </div>

      </div>

    </div>

  );

}

function BriefMetric({

  label,

  value,

  icon: Icon,

}: {

  label: string;

  value: number | string;

  icon: typeof Activity;

}) {

  return (

    <div className="rounded-xl border border-slate-200 bg-white p-4">

      <div className="flex items-center gap-3">

        <div className="rounded-lg bg-green-100 p-2">

          <Icon className="h-5 w-5 text-green-700" />

        </div>

        <div>

          <p className="text-xs font-medium text-slate-500">

            {label}

          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">

            {value}

          </p>

        </div>

      </div>

    </div>

  );

}

function IntelligenceMetric({

  label,

  value,

  icon: Icon,

  danger = false,

  success = false,

}: {

  label: string;

  value: number;

  icon: typeof Activity;

  danger?: boolean;

  success?: boolean;

}) {

  return (

    <div

      className={`rounded-xl border p-4 ${

        danger

          ? "border-red-200 bg-red-50"

          : success

            ? "border-green-200 bg-green-50"

            : "border-slate-200 bg-slate-50"

      }`}

    >

      <Icon

        className={`h-5 w-5 ${

          danger

            ? "text-red-600"

            : success

              ? "text-green-600"

              : "text-slate-600"

        }`}

      />

      <p className="mt-3 text-xs font-medium text-slate-500">

        {label}

      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">

        {value}

      </p>

    </div>

  );

}

function RadarRow({

  label,

  value,

  description,

  icon: Icon,

  positive = false,

  danger = false,

}: {

  label: string;

  value: number | string;

  description: string;

  icon: typeof Activity;

  positive?: boolean;

  danger?: boolean;

}) {

  return (

    <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">

      <div

        className={`rounded-xl p-3 ${

          danger

            ? "bg-red-100"

            : positive

              ? "bg-green-100"

              : "bg-slate-100"

        }`}

      >

        <Icon

          className={`h-5 w-5 ${

            danger

              ? "text-red-700"

              : positive

                ? "text-green-700"

                : "text-slate-600"

          }`}

        />

      </div>

      <div className="min-w-0 flex-1">

        <p className="font-semibold text-slate-900">

          {label}

        </p>

        <p className="mt-1 text-xs text-slate-500">

          {description}

        </p>

      </div>

      <div className="shrink-0 text-right text-xl font-bold text-slate-900">

        {value}

      </div>

    </div>

  );

}

function MissionRow({

  label,

  icon: Icon,

  item,

}: {

  label: string;

  icon: typeof Activity;

  item: MissionItem;

}) {

  const percentage = missionPercentage(item);

  return (

    <div className="rounded-xl border border-slate-200 p-4">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-lg bg-green-100 p-2">

            <Icon className="h-5 w-5 text-green-700" />

          </div>

          <span className="font-semibold text-slate-900">

            {label}

          </span>

        </div>

        <span className="text-sm font-semibold text-slate-700">

          {item.completed}/{item.total}

        </span>

      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

        <div

          className="h-full rounded-full bg-green-600 transition-all"

          style={{ width: `${percentage}%` }}

        />

      </div>

      <p className="mt-2 text-xs text-slate-500">

        {percentage}% completed

      </p>

    </div>

  );

}

function PipelineCard({

  label,

  value,

  color,

}: {

  label: string;

  value: number;

  color:

    | "blue"

    | "indigo"

    | "purple"

    | "amber"

    | "green"

    | "red";

}) {

  const classes = {

    blue: "bg-blue-50 border-blue-100 text-blue-700",

    indigo:

      "bg-indigo-50 border-indigo-100 text-indigo-700",

    purple:

      "bg-purple-50 border-purple-100 text-purple-700",

    amber:

      "bg-amber-50 border-amber-100 text-amber-700",

    green:

      "bg-green-50 border-green-100 text-green-700",

    red: "bg-red-50 border-red-100 text-red-700",

  };

  return (

    <div

      className={`rounded-xl border p-4 ${classes[color]}`}

    >

      <p className="text-xs font-semibold">

        {label}

      </p>

      <p className="mt-2 text-3xl font-bold">

        {value}

      </p>

    </div>

  );

}

function EmptyState({

  icon: Icon,

  title,

  description,

}: {

  icon: typeof Activity;

  title: string;

  description: string;

}) {

  return (

    <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">

      <Icon className="mx-auto h-10 w-10 text-slate-400" />

      <h3 className="mt-4 font-semibold text-slate-700">

        {title}

      </h3>

      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">

        {description}

      </p>

    </div>

  );

}
