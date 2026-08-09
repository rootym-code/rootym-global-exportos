/**
 * ============================================================
 * ROOTYM Admin
 * File: app/admin/proforma-invoices/[id]/page.tsx
 * Sprint 8.1
 * ============================================================
 */

import ProformaInvoiceDetailsPage from "@/components/admin/proforma-invoices/details/ProformaInvoiceDetailsPage";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProformaInvoicePage({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <ProformaInvoiceDetailsPage
      proformaInvoiceId={id}
    />
  );
}