/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Consolidates related Business Settings into a single
 *          searchable, sectioned workspace while preserving the
 *          existing tenant-scoped forms, services and permissions.
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  FileCheck2,
  Globe2,
  Mail,
  MapPin,
  ShieldCheck,
  UsersRound,
  WalletCards,
  SlidersHorizontal,
} from "lucide-react";

import BusinessSettingsShell from "./BusinessSettingsShell";

import BusinessAddressForm from "./address/BusinessAddressForm";
import BusinessContactCommunicationForm from "./contact-communication/BusinessContactCommunicationForm";
import BusinessExportCredentialsForm from "./export-credentials/BusinessExportCredentialsForm";
import BusinessFinancialSettingsForm from "./financial-settings/BusinessFinancialSettingsForm";
import BusinessOperatingPreferencesForm from "./operating-preferences/BusinessOperatingPreferencesForm";
import BusinessProfileForm from "./profile/BusinessProfileForm";
import BusinessTaxComplianceForm from "./tax-compliance/BusinessTaxComplianceForm";
import TeamAccessInviteForm from "./team-access/TeamAccessInviteForm";
import TeamAccessMemberActions from "./team-access/TeamAccessMemberActions";

import getBusinessAddress from "@/app/lib/workspace/business/business-address.service";
import { getBusinessContactCommunication } from "@/app/lib/workspace/business/business-contact-communication.service";
import { getBusinessExportCredentials } from "@/app/lib/workspace/business/business-export-credentials.service";
import { getBusinessFinancialSettings } from "@/app/lib/workspace/business/business-financial-settings.service";
import { getBusinessOperatingPreferences } from "@/app/lib/workspace/business/business-operating-preferences.service";
import { getBusinessProfile } from "@/app/lib/workspace/business/business-profile.service";
import { getBusinessTaxCompliance } from "@/app/lib/workspace/business/business-tax-compliance.service";
import { getTeamAccess } from "@/app/lib/workspace/business/team-access.service";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

export const dynamic = "force-dynamic";

function getRoleLabel(role: string) {
  switch (role) {
    case "OWNER":
      return "Owner";
    case "ADMIN":
      return "Administrator";
    case "MEMBER":
      return "Member";
    default:
      return role;
  }
}

function getRoleDescription(role: string) {
  switch (role) {
    case "OWNER":
      return "Full workspace ownership and administrative access.";
    case "ADMIN":
      return "Administrative access to the workspace.";
    case "MEMBER":
      return "Standard workspace member access.";
    default:
      return "Workspace membership access.";
  }
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Not configured";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not configured";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function dateInput(value: Date | string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
}

export default async function BusinessConfigurationPage() {
  const { tenant, membership } = await requireWorkspaceAccess();

  // Keep these tenant-scoped reads sequentially. The project has a small
  // Prisma connection pool, so parallelizing eight service reads here
  // would unnecessarily increase connection pressure.
  const businessProfile = await getBusinessProfile();
  const businessAddress = await getBusinessAddress();
  const contactCommunication = await getBusinessContactCommunication();
  const exportCredentials = await getBusinessExportCredentials();
  const financialSettings = await getBusinessFinancialSettings();
  const operatingPreferences = await getBusinessOperatingPreferences();
  const taxCompliance = await getBusinessTaxCompliance();
  const teamAccess = await getTeamAccess();

  const canEdit =
    membership.role === "OWNER" || membership.role === "ADMIN";

  const profileInitialData = businessProfile
    ? {
        businessName: businessProfile.businessName,
        legalName: businessProfile.legalName ?? "",
        businessType: businessProfile.businessType ?? "",
        email: businessProfile.email ?? "",
        phone: businessProfile.phone ?? "",
        country: businessProfile.country ?? "",
        website: businessProfile.website ?? "",
        description: businessProfile.description ?? "",
      }
    : null;

  const addressInitialData = {
    addressLine1: businessAddress?.addressLine1 ?? "",
    addressLine2: businessAddress?.addressLine2 ?? "",
    city: businessAddress?.city ?? "",
    state: businessAddress?.state ?? "",
    postalCode: businessAddress?.postalCode ?? "",
    country: businessAddress?.country ?? "",
  };

  const contactInitialData = {
    primaryEmail: contactCommunication?.primaryEmail ?? "",
    alternateEmail1: contactCommunication?.alternateEmail1 ?? "",
    alternateEmail2: contactCommunication?.alternateEmail2 ?? "",
    salesEmail: contactCommunication?.salesEmail ?? "",
    infoEmail: contactCommunication?.infoEmail ?? "",
    primaryPhone: contactCommunication?.primaryPhone ?? "",
    alternatePhone: contactCommunication?.alternatePhone ?? "",
    whatsapp: contactCommunication?.whatsapp ?? "",
    linkedinUrl: contactCommunication?.linkedinUrl ?? "",
    facebookUrl: contactCommunication?.facebookUrl ?? "",
    instagramUrl: contactCommunication?.instagramUrl ?? "",
    youtubeUrl: contactCommunication?.youtubeUrl ?? "",
    googleBusinessUrl: contactCommunication?.googleBusinessUrl ?? "",
    xTwitterUrl: contactCommunication?.xTwitterUrl ?? "",
    pinterestUrl: contactCommunication?.pinterestUrl ?? "",
    otherSocialUrls: contactCommunication?.otherSocialUrls ?? "",
  };

  const exportInitialData = {
    iecNumber: exportCredentials?.iecNumber ?? "",
    iecStatus: exportCredentials?.iecStatus ?? "",
    iecIssueDate: dateInput(exportCredentials?.iecIssueDate),
    dgftProfileUrl: exportCredentials?.dgftProfileUrl ?? "",
    gstin: exportCredentials?.gstin ?? "",
    gstStatus: exportCredentials?.gstStatus ?? "",
    gstRegistrationDate: dateInput(exportCredentials?.gstRegistrationDate),
    udyamNumber: exportCredentials?.udyamNumber ?? "",
    udyamStatus: exportCredentials?.udyamStatus ?? "",
    udyamRegistrationDate: dateInput(exportCredentials?.udyamRegistrationDate),
    adCode: exportCredentials?.adCode ?? "",
    adCodeStatus: exportCredentials?.adCodeStatus ?? "",
    adCodeBankName: exportCredentials?.adCodeBankName ?? "",
    icegateRegistrationId: exportCredentials?.icegateRegistrationId ?? "",
    icegateStatus: exportCredentials?.icegateStatus ?? "",
    rcmcNumber: exportCredentials?.rcmcNumber ?? "",
    rcmcIssuingAuthority: exportCredentials?.rcmcIssuingAuthority ?? "",
    rcmcStatus: exportCredentials?.rcmcStatus ?? "",
    rcmcIssueDate: dateInput(exportCredentials?.rcmcIssueDate),
    rcmcExpiryDate: dateInput(exportCredentials?.rcmcExpiryDate),
    otherLicense1Name: exportCredentials?.otherLicense1Name ?? "",
    otherLicense1Number: exportCredentials?.otherLicense1Number ?? "",
    otherLicense1Status: exportCredentials?.otherLicense1Status ?? "",
    otherLicense1ExpiryDate: dateInput(exportCredentials?.otherLicense1ExpiryDate),
    otherLicense2Name: exportCredentials?.otherLicense2Name ?? "",
    otherLicense2Number: exportCredentials?.otherLicense2Number ?? "",
    otherLicense2Status: exportCredentials?.otherLicense2Status ?? "",
    otherLicense2ExpiryDate: dateInput(exportCredentials?.otherLicense2ExpiryDate),
    otherLicense3Name: exportCredentials?.otherLicense3Name ?? "",
    otherLicense3Number: exportCredentials?.otherLicense3Number ?? "",
    otherLicense3Status: exportCredentials?.otherLicense3Status ?? "",
    otherLicense3ExpiryDate: dateInput(exportCredentials?.otherLicense3ExpiryDate),
    notes: exportCredentials?.notes ?? "",
  };

  const financialInitialData = financialSettings
    ? {
        baseCurrency: financialSettings.baseCurrency ?? "",
        defaultInvoiceCurrency:
          financialSettings.defaultInvoiceCurrency ?? "",
        currencyNotes: financialSettings.currencyNotes ?? "",
        defaultPaymentTermsDays:
          financialSettings.defaultPaymentTermsDays ?? undefined,
        defaultPaymentMethod:
          financialSettings.defaultPaymentMethod ?? "",
        paymentTermsNotes:
          financialSettings.paymentTermsNotes ?? "",
        beneficiaryName: financialSettings.beneficiaryName ?? "",
        bankName: financialSettings.bankName ?? "",
        branchName: financialSettings.branchName ?? "",
        accountNumber: financialSettings.accountNumber ?? "",
        accountCurrency: financialSettings.accountCurrency ?? "",
        ifscCode: financialSettings.ifscCode ?? "",
        swiftBic: financialSettings.swiftBic ?? "",
        iban: financialSettings.iban ?? "",
        bankAddress: financialSettings.bankAddress ?? "",
        bankCountry: financialSettings.bankCountry ?? "",
        remittanceBankName:
          financialSettings.remittanceBankName ?? "",
        remittanceBankSwiftBic:
          financialSettings.remittanceBankSwiftBic ?? "",
        correspondentBankName:
          financialSettings.correspondentBankName ?? "",
        correspondentBankSwiftBic:
          financialSettings.correspondentBankSwiftBic ?? "",
        intermediaryBankName:
          financialSettings.intermediaryBankName ?? "",
        intermediaryBankSwiftBic:
          financialSettings.intermediaryBankSwiftBic ?? "",
        foreignBankAccountNumber:
          financialSettings.foreignBankAccountNumber ?? "",
        foreignBankIban:
          financialSettings.foreignBankIban ?? "",
        routingOrSortCode:
          financialSettings.routingOrSortCode ?? "",
        remittanceCurrency:
          financialSettings.remittanceCurrency ?? "",
        rbiPurposeCode:
          financialSettings.rbiPurposeCode ?? "",
        foreignRemittanceInstructions:
          financialSettings.foreignRemittanceInstructions ?? "",
        remittanceReferenceInstructions:
          financialSettings.remittanceReferenceInstructions ?? "",
        bankChargesArrangement:
          financialSettings.bankChargesArrangement ?? "",
        foreignRemittanceNotes:
          financialSettings.foreignRemittanceNotes ?? "",
      }
    : null;

  const operatingInitialData = operatingPreferences
    ? {
        defaultOrderProcessingPriority:
          operatingPreferences.defaultOrderProcessingPriority ?? "",
        defaultShipmentMode:
          operatingPreferences.defaultShipmentMode ?? "",
        defaultIncoterm:
          operatingPreferences.defaultIncoterm ?? "",
        defaultPortOfLoading:
          operatingPreferences.defaultPortOfLoading ?? "",
        defaultDestinationHandling:
          operatingPreferences.defaultDestinationHandling ?? "",
        allowPartialShipment:
          operatingPreferences.allowPartialShipment ?? false,
        allowSplitShipment:
          operatingPreferences.allowSplitShipment ?? false,
        defaultDocumentLanguage:
          operatingPreferences.defaultDocumentLanguage ?? "",
        documentNumberingPreference:
          operatingPreferences.documentNumberingPreference ?? "",
        invoiceNumberPrefix:
          operatingPreferences.invoiceNumberPrefix ?? "",
        quoteNumberPrefix:
          operatingPreferences.quoteNumberPrefix ?? "",
        packingListNumberPrefix:
          operatingPreferences.packingListNumberPrefix ?? "",
        shippingDocumentNumberPrefix:
          operatingPreferences.shippingDocumentNumberPrefix ?? "",
        documentNotes:
          operatingPreferences.documentNotes ?? "",
        defaultTransportMode:
          operatingPreferences.defaultTransportMode ?? "",
        defaultShipmentType:
          operatingPreferences.defaultShipmentType ?? "",
        defaultPackageUnit:
          operatingPreferences.defaultPackageUnit ?? "",
        defaultWeightUnit:
          operatingPreferences.defaultWeightUnit ?? "",
        defaultDimensionUnit:
          operatingPreferences.defaultDimensionUnit ?? "",
        shipmentHandlingInstructions:
          operatingPreferences.shipmentHandlingInstructions ?? "",
        defaultCustomerCommunicationChannel:
          operatingPreferences.defaultCustomerCommunicationChannel ?? "",
        internalApprovalRequired:
          operatingPreferences.internalApprovalRequired ?? false,
        orderApprovalRequired:
          operatingPreferences.orderApprovalRequired ?? false,
        shipmentApprovalRequired:
          operatingPreferences.shipmentApprovalRequired ?? false,
        documentApprovalRequired:
          operatingPreferences.documentApprovalRequired ?? false,
        workflowNotes:
          operatingPreferences.workflowNotes ?? "",
        businessWorkingDays:
          operatingPreferences.businessWorkingDays ?? "",
        businessTimezone:
          operatingPreferences.businessTimezone ?? "",
        defaultDateFormat:
          operatingPreferences.defaultDateFormat ?? "",
        defaultNumberFormat:
          operatingPreferences.defaultNumberFormat ?? "",
        operationalNotes:
          operatingPreferences.operationalNotes ?? "",
      }
    : null;

  const taxInitialData = taxCompliance
    ? {
        gstRegistrationType: taxCompliance.gstRegistrationType ?? "",
        gstExportTreatment: taxCompliance.gstExportTreatment ?? "",
        defaultTaxRate:
          taxCompliance.defaultTaxRate === null ||
          taxCompliance.defaultTaxRate === undefined
            ? undefined
            : Number(taxCompliance.defaultTaxRate),
        taxNotes: taxCompliance.taxNotes ?? "",
        lutBondStatus: taxCompliance.lutBondStatus ?? "",
        lutBondNumber: taxCompliance.lutBondNumber ?? "",
        lutBondFinancialYear:
          taxCompliance.lutBondFinancialYear ?? "",
        lutBondIssueDate: dateInput(taxCompliance.lutBondIssueDate),
        lutBondExpiryDate: dateInput(taxCompliance.lutBondExpiryDate),
        tdsApplicable: taxCompliance.tdsApplicable,
        tdsNotes: taxCompliance.tdsNotes ?? "",
        tcsApplicable: taxCompliance.tcsApplicable,
        tcsNotes: taxCompliance.tcsNotes ?? "",
        complianceStatus:
          taxCompliance.complianceStatus ?? "",
        nextComplianceDate:
          dateInput(taxCompliance.nextComplianceDate),
        complianceNotes:
          taxCompliance.complianceNotes ?? "",
      }
    : null;

  const activeMembers = teamAccess.members.filter(
    (member) => member.isActive
  );

  const canManageAccess =
    membership.role === "OWNER" || membership.role === "ADMIN";

  return (
    <BusinessSettingsShell>
      <header className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950">
              <Building2 className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                ROOTYM
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                Business Settings
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {tenant.name}
              </p>
            </div>
          </div>

          <Link
            href="/app/workspace"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Workspace Home
          </Link>
        </div>
      </header>

      <section
        id="identity"
        className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <SectionHeader
          icon={<Building2 className="h-5 w-5 text-white" />}
          eyebrow="Company & Identity"
          title="Business identity and address"
          description="Keep your core company profile and primary business location together."
        />

        <div className="space-y-8 p-6 sm:p-8">
          <div>
            <SubHeader
              icon={<Building2 className="h-4 w-4 text-slate-700" />}
              title="Business Profile"
              description="Core business identity used across ROOTYM."
            />
            <BusinessProfileForm
              initialData={profileInitialData}
              canEdit={canEdit}
            />
          </div>

          <div className="border-t border-slate-200 pt-8">
            <SubHeader
              icon={<MapPin className="h-4 w-4 text-slate-700" />}
              title="Primary Business Address"
              description="Registered or primary operating address for the business."
            />
            <BusinessAddressForm
              initialData={addressInitialData}
              canEdit={canEdit}
            />
          </div>

        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <SectionHeader
          icon={<UsersRound className="h-5 w-5 text-white" />}
          eyebrow="Contact & Online Presence"
          title="Contact, communication and social channels"
          description="Manage business email addresses, phone numbers, WhatsApp and online presence in one place."
        />

        <div className="p-6 sm:p-8">
          <BusinessContactCommunicationForm
            initialData={contactInitialData}
            canEdit={canEdit}
          />
        </div>
      </section>

      <section
        id="compliance"
        className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <SectionHeader
          icon={<FileCheck2 className="h-5 w-5 text-white" />}
          eyebrow="Export & Compliance"
          title="Export credentials and tax compliance"
          description="Keep export registrations and tax/compliance configuration together so regulatory settings are easier to find."
        />

        <div className="space-y-8 p-6 sm:p-8">
          <div>
            <SubHeader
              icon={<Globe2 className="h-4 w-4 text-slate-700" />}
              title="Export Credentials"
              description="IEC, DGFT, GST registration, Udyam, AD Code, ICEGATE, RCMC and other registrations."
            />
            <BusinessExportCredentialsForm
              initialData={exportInitialData}
              canEdit={canEdit}
            />
          </div>

          <div className="border-t border-slate-200 pt-8">
            <SubHeader
              icon={<ShieldCheck className="h-4 w-4 text-slate-700" />}
              title="Tax & Compliance"
              description="GST treatment, LUT, TDS/TCS and compliance tracking."
            />
            <BusinessTaxComplianceForm
              initialData={taxInitialData}
              canEdit={canEdit}
            />
          </div>
        </div>
      </section>

      <section
        id="finance"
        className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <SectionHeader
          icon={<WalletCards className="h-5 w-5 text-white" />}
          eyebrow="Finance & Payments"
          title="Currency, payment and banking"
          description="Keep commercial payment defaults, beneficiary details and foreign remittance settings together."
        />

        <div className="p-6 sm:p-8">
          <BusinessFinancialSettingsForm
            initialData={financialInitialData}
            canEdit={canEdit}
          />
        </div>
      </section>

      <section
        id="operations"
        className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <SectionHeader
          icon={<SlidersHorizontal className="h-5 w-5 text-white" />}
          eyebrow="Operations & Documents"
          title="Operational defaults and workflows"
          description="Manage order, shipment, document, communication and working preferences from one place."
        />

        <div className="p-6 sm:p-8">
          <BusinessOperatingPreferencesForm
            initialData={operatingInitialData}
            canEdit={canEdit}
          />
        </div>
      </section>

      <section
        id="access"
        className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <SectionHeader
          icon={<ShieldCheck className="h-5 w-5 text-white" />}
          eyebrow="Team & Access"
          title="Workspace members and permissions"
          description="Invite users, review membership roles and manage authorized workspace access."
        />

        <div className="space-y-8 p-6 sm:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard
              label="Total Members"
              value={String(teamAccess.members.length)}
            />
            <InfoCard
              label="Active Members"
              value={String(activeMembers.length)}
            />
            <InfoCard
              label="Your Role"
              value={getRoleLabel(membership.role)}
            />
          </div>

          {canManageAccess ? (
            <div className="border-t border-slate-200 pt-8">
              <SubHeader
                icon={<Mail className="h-4 w-4 text-slate-700" />}
                title="Invite a Team Member"
                description="Create a tenant-scoped workspace invitation."
              />
              <TeamAccessInviteForm />
            </div>
          ) : null}

          <div className="border-t border-slate-200 pt-8">
            <SubHeader
              icon={<UsersRound className="h-4 w-4 text-slate-700" />}
              title="Workspace Members"
              description="Users currently associated with this workspace."
            />

            {teamAccess.members.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center">
                <UsersRound className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-4 text-sm font-semibold text-slate-900">
                  No workspace members found
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  There are currently no membership records for this workspace.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="divide-y divide-slate-200">
                  {teamAccess.members.map((member) => (
                    <div
                      key={member.membershipId}
                      className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UsersRound className="h-5 w-5 text-slate-500" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {member.name}
                            </p>

                            <span
                              className={
                                member.isActive
                                  ? "rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
                                  : "rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500"
                              }
                            >
                              {member.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                          {getRoleLabel(member.role)}
                        </span>

                        <p className="max-w-xs text-xs text-slate-400 md:text-right">
                          {getRoleDescription(member.role)}
                        </p>

                        <TeamAccessMemberActions
                          membershipId={member.membershipId}
                          userId={member.userId}
                          name={member.name}
                          email={member.email}
                          role={member.role}
                          currentUserId={membership.userId}
                          currentUserRole={membership.role}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-medium text-slate-700">
          ROOTYM Business Settings
        </span>
        <span>
          Tenant: {tenant.name} · Created {formatDate(tenant.createdAt)}
        </span>
      </footer>
    </BusinessSettingsShell>
  );
}

function SectionHeader({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-slate-200 bg-slate-950 p-6 text-white sm:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight">
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function SubHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        {icon}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-950">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-slate-900">
        {value || "Not configured"}
      </p>
    </div>
  );
}
