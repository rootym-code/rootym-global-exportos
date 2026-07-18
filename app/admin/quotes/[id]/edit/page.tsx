/**
 * ============================================================
 * ROOTYM Admin
 * File: app/admin/quotes/[id]/edit/page.tsx
 * Sprint 8.1
 * ============================================================
 */

import QuoteEditorPage from "@/components/admin/quotes/editor/QuoteEditorPage";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditQuotePage({
  params,
}: PageProps) {
  const { id } = await params;

  return <QuoteEditorPage quoteId={id} />;
}