/**
 * ============================================================
 * ROOTYM Admin
 * File: app/admin/quotes/[id]/page.tsx
 * Sprint 8.1
 * ============================================================
 */

import QuoteDetailsPage from "@/components/admin/quotes/details/QuoteDetailsPage";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuoteDetailsRoute({
  params,
}: PageProps) {
  const { id } = await params;

  return <QuoteDetailsPage quoteId={id} />;
}