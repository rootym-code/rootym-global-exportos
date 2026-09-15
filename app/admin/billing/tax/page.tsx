/**
 * Author: Prem Singh
 * Purpose: Provides the Admin interface for ROOTYM GST and invoice configuration.
 */

"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  Building2,
  FileText,
  Info,
  ReceiptIndianRupee,
  Save,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type TaxConfiguration = {
  id: string;
  name: string;
  isActive: boolean;
  gstEnabled: boolean;
  registeredState: string;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  effectiveFrom: string;
  legalName: string;
  gstin: string | null;
  registeredAddressLine1: string | null;
  registeredAddressLine2: string | null;
  registeredCity: string | null;
  registeredPostalCode: string | null;
  registeredCountry: string;
  invoicePrefix: string;
};

export default function AdminTaxConfigurationPage() {
  const [configurationName, setConfigurationName] =
    useState("ROOTYM GST Standard");
  const [gstEnabled, setGstEnabled] = useState(true);
  const [legalName, setLegalName] = useState("");
  const [gstin, setGstin] = useState("");
  const [registeredState, setRegisteredState] = useState("Maharashtra");
  const [cgstRate, setCgstRate] = useState("9");
  const [sgstRate, setSgstRate] = useState("9");
  const [igstRate, setIgstRate] = useState("18");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [invoicePrefix, setInvoicePrefix] = useState("ROOTYM");
  const [effectiveFrom, setEffectiveFrom] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadConfiguration() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/admin/billing/tax", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as {
          configuration?: TaxConfiguration | null;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error || "Unable to load tax configuration.");
        }

        if (cancelled) return;

        const configuration = data.configuration;

        if (!configuration) {
          setEffectiveFrom(new Date().toISOString().slice(0, 10));
          return;
        }

        setConfigurationName(configuration.name);
        setGstEnabled(configuration.gstEnabled);
        setLegalName(configuration.legalName);
        setGstin(configuration.gstin ?? "");
        setRegisteredState(configuration.registeredState);
        setCgstRate(String(configuration.cgstRate));
        setSgstRate(String(configuration.sgstRate));
        setIgstRate(String(configuration.igstRate));
        setAddressLine1(configuration.registeredAddressLine1 ?? "");
        setAddressLine2(configuration.registeredAddressLine2 ?? "");
        setCity(configuration.registeredCity ?? "");
        setPostalCode(configuration.registeredPostalCode ?? "");
        setCountry(configuration.registeredCountry);
        setInvoicePrefix(configuration.invoicePrefix);
        setEffectiveFrom(configuration.effectiveFrom.slice(0, 10));
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load tax configuration."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadConfiguration();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/billing/tax", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: configurationName,
          isActive: true,
          gstEnabled,
          registeredState,
          cgstRate: Number(cgstRate),
          sgstRate: Number(sgstRate),
          igstRate: Number(igstRate),
          effectiveFrom,
          legalName,
          gstin,
          registeredAddressLine1: addressLine1,
          registeredAddressLine2: addressLine2,
          registeredCity: city,
          registeredPostalCode: postalCode,
          registeredCountry: country,
          invoicePrefix,
        }),
      });

      const data = (await response.json()) as {
        configuration?: TaxConfiguration;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Unable to save tax configuration.");
      }

      const configuration = data.configuration;

      if (configuration) {
        setConfigurationName(configuration.name);
        setGstEnabled(configuration.gstEnabled);
        setLegalName(configuration.legalName);
        setGstin(configuration.gstin ?? "");
        setRegisteredState(configuration.registeredState);
        setCgstRate(String(configuration.cgstRate));
        setSgstRate(String(configuration.sgstRate));
        setIgstRate(String(configuration.igstRate));
        setAddressLine1(configuration.registeredAddressLine1 ?? "");
        setAddressLine2(configuration.registeredAddressLine2 ?? "");
        setCity(configuration.registeredCity ?? "");
        setPostalCode(configuration.registeredPostalCode ?? "");
        setCountry(configuration.registeredCountry);
        setInvoicePrefix(configuration.invoicePrefix);
        setEffectiveFrom(configuration.effectiveFrom.slice(0, 10));
      }

      setMessage("Tax & GST configuration saved successfully.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save tax configuration."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Tax & GST Configuration
        </h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Configure the ROOTYM tax settings used when generating GST invoices
          for SaaS customers.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
          <div className="text-sm leading-6 text-blue-900">
            <p className="font-semibold">Automatic tax treatment</p>
            <p>
              Customer billing state will determine the tax treatment. A
              Maharashtra customer uses CGST + SGST, while a customer outside
              Maharashtra uses IGST. The configured rates are captured on the
              invoice when it is generated.
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div
          role="status"
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"
        >
          Loading current tax configuration...
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-green-100 p-3">
              <ReceiptIndianRupee className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                GST Settings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Control whether GST is applied and configure the applicable
                tax rates.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
              <input
                type="checkbox"
                checked={gstEnabled}
                onChange={(event) => setGstEnabled(event.target.checked)}
                className="h-5 w-5 rounded border-slate-300"
              />
              <span>
                <span className="block font-medium text-slate-900">
                  GST Enabled
                </span>
                <span className="text-sm text-slate-500">
                  Apply configured GST to ROOTYM customer invoices.
                </span>
              </span>
            </label>

            <Field
              label="ROOTYM Registered State"
              value={registeredState}
              onChange={setRegisteredState}
              placeholder="Maharashtra"
            />

            <Field
              label="CGST Rate (%)"
              value={cgstRate}
              onChange={setCgstRate}
              type="number"
              step="0.01"
              min="0"
            />

            <Field
              label="SGST Rate (%)"
              value={sgstRate}
              onChange={setSgstRate}
              type="number"
              step="0.01"
              min="0"
            />

            <Field
              label="IGST Rate (%)"
              value={igstRate}
              onChange={setIgstRate}
              type="number"
              step="0.01"
              min="0"
            />

            <Field
              label="Effective From"
              value={effectiveFrom}
              onChange={setEffectiveFrom}
              type="date"
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-green-100 p-3">
              <Building2 className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                ROOTYM Legal & GST Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                These details are intended to appear on ROOTYM GST invoices.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Field
              label="Legal Business Name"
              value={legalName}
              onChange={setLegalName}
              placeholder="ROOTYM Agro Harvest Pvt. Ltd."
            />

            <Field
              label="GSTIN"
              value={gstin}
              onChange={setGstin}
              placeholder="Enter ROOTYM GSTIN"
            />

            <Field
              label="Address Line 1"
              value={addressLine1}
              onChange={setAddressLine1}
              placeholder="Registered office address"
            />

            <Field
              label="Address Line 2"
              value={addressLine2}
              onChange={setAddressLine2}
              placeholder="Optional"
            />

            <Field
              label="City"
              value={city}
              onChange={setCity}
              placeholder="Pune"
            />

            <Field
              label="Postal Code"
              value={postalCode}
              onChange={setPostalCode}
              placeholder="411001"
            />

            <Field
              label="Country"
              value={country}
              onChange={setCountry}
              placeholder="India"
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-green-100 p-3">
              <FileText className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Invoice Configuration
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Configure the invoice numbering prefix. Invoice numbering
                remains server-controlled.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Field
              label="Configuration Name"
              value={configurationName}
              onChange={setConfigurationName}
              placeholder="ROOTYM GST Standard"
            />

            <Field
              label="Invoice Prefix"
              value={invoicePrefix}
              onChange={setInvoicePrefix}
              placeholder="ROOTYM"
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={saving || loading}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  step,
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date";
  placeholder?: string;
  step?: string;
  min?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        step={step}
        min={min}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
      />
    </label>
  );
}
