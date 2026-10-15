import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import StoreSettingsForm from "@/app/app/workspace/website/store-settings/StoreSettingsForm";

export default async function StoreSettingsPage() {
  const { membership } = await requireWorkspaceAccess();

  const canEdit =
    membership.role === "OWNER" || membership.role === "ADMIN";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8">
          <Link
            href="/app/workspace/website/settings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Website Settings
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
              <ShoppingBag className="h-6 w-6 text-emerald-700" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Customer Workspace
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                Online Store
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Configure your online store, payment credentials and
            checkout preferences. Existing enquiry and quotation
            workflows remain available.
          </p>
        </header>

        <StoreSettingsForm canEdit={canEdit} />
      </div>
    </main>
  );
}