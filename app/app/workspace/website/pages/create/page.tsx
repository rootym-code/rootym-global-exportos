/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the customer-facing Website Page Editor
 *          route for tenant-owned CMS pages. The editor uses
 *          the customer workspace API rather than platform
 *          admin endpoints.
 * ============================================================
 */

"use client";

import {
  FormEvent,
  ReactNode,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Copy as CopyIcon,
  Loader2,
  Plus,
  Save,
  Send,
  Trash2,
} from "lucide-react";

import { CmsPageStatus } from "@/lib/generated/prisma";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import SectionElementsEditor from "@/components/workspace/website/SectionElementsEditor";
import type { SectionElement } from "@/lib/workspace/website/section-elements";

import type {
  PageLayout,
  PageTemplate,
} from "@/components/admin/cms/pages/types";

type HeroSection = {
  type: "hero";
  sectionTitle?: string;
  sectionDescription?: string;
  heading: string;
  subheading: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  elements?: SectionElement[];
};

type ValuePropositionSection = {
  type: "valueProposition";
  sectionTitle?: string;
  sectionDescription?: string;
  heading: string;
  description: string;
  points: string[];
  elements?: SectionElement[];
};

type ProductSection = {
  type: "product";
  sectionTitle?: string;
  sectionDescription?: string;
  heading: string;
  description: string;
  productName: string;
  origin: string;
  form: string;
  packaging: string;
  moq: string;
  applications: string[];
  elements?: SectionElement[];
};

type ApplicationsSection = {
  type: "applications";
  sectionTitle?: string;
  sectionDescription?: string;
  heading: string;
  description: string;
  items: Array<{
    title: string;
    description: string;
  }>;
  elements?: SectionElement[];
};

type WhyRootymSection = {
  type: "whyRootym";
  sectionTitle?: string;
  sectionDescription?: string;
  heading: string;
  points: Array<{
    title: string;
    description: string;
  }>;
  elements?: SectionElement[];
};

type BuyerFocusSection = {
  type: "buyerFocus";
  sectionTitle?: string;
  sectionDescription?: string;
  heading: string;
  description: string;
  buyerTypes: string[];
  elements?: SectionElement[];
};

type PackagingSection = {
  type: "packaging";
  sectionTitle?: string;
  sectionDescription?: string;
  heading: string;
  description: string;
  options: string[];
  elements?: SectionElement[];
};

type ExportDocumentsSection = {
  type: "exportDocuments";
  sectionTitle?: string;
  sectionDescription?: string;
  heading: string;
  description: string;
  documents: string[];
  elements?: SectionElement[];
};

type CtaSection = {
  type: "cta";
  sectionTitle?: string;
  sectionDescription?: string;
  heading: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  elements?: SectionElement[];
};

type FaqSection = {
  type: "faq";
  sectionTitle?: string;
  sectionDescription?: string;
  heading: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
  elements?: SectionElement[];
};

type LandingPageSection =
  | HeroSection
  | ValuePropositionSection
  | ProductSection
  | ApplicationsSection
  | WhyRootymSection
  | BuyerFocusSection
  | PackagingSection
  | ExportDocumentsSection
  | CtaSection
  | FaqSection;

type StructuredContent = {
  version: 1;
  template: PageTemplate;
  sections: LandingPageSection[];
};

type FormState = {
  languageId: string;
  internalTitle: string;
  title: string;
  slug: string;
  status: CmsPageStatus;
  template: PageTemplate;
  layout: PageLayout;
  isHomePage: boolean;
  showInMenu: boolean;
  excerpt: string;
  content: string;
  structuredContent: StructuredContent;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
};

function createDefaultStructuredContent(
  template: PageTemplate
): StructuredContent {
  return {
    version: 1,
    template,
    sections: [
      {
        type: "hero",
        sectionTitle: "Hero",
        sectionDescription: "Primary headline, supporting message and calls to action.",
        heading: "",
        subheading: "",
        primaryCtaText: "",
        secondaryCtaText: "",
        elements: [],
      },
      {
        type: "valueProposition",
        sectionTitle: "Value Proposition",
        sectionDescription: "Explain why the product is relevant to the target market.",
        heading: "",
        description: "",
        points: [],
        elements: [],
      },
      {
        type: "product",
        sectionTitle: "Product",
        sectionDescription: "Capture the core product specifications buyers need before making an enquiry.",
        heading: "",
        description: "",
        productName: "",
        origin: "",
        form: "",
        packaging: "",
        moq: "",
        applications: [],
        elements: [],
      },
      {
        type: "applications",
        sectionTitle: "Applications",
        sectionDescription: "Show where and how the product is used by commercial buyers.",
        heading: "",
        description: "",
        items: [],
        elements: [],
      },
      {
        type: "whyRootym",
        sectionTitle: "Why ROOTYM",
        sectionDescription: "Build buyer confidence around sourcing, quality and export execution.",
        heading: "",
        points: [],
        elements: [],
      },
      {
        type: "buyerFocus",
        sectionTitle: "Buyer Focus",
        sectionDescription: "Define the buyer profiles and commercial audiences this page targets.",
        heading: "",
        description: "",
        buyerTypes: [],
        elements: [],
      },
      {
        type: "packaging",
        sectionTitle: "Packaging",
        sectionDescription: "Present practical packaging choices for export buyers.",
        heading: "",
        description: "",
        options: [],
        elements: [],
      },
      {
        type: "exportDocuments",
        sectionTitle: "Export Documents",
        sectionDescription: "List the standard export documentation buyers can expect from the business.",
        heading: "",
        description: "",
        documents: [],
        elements: [],
      },
      {
        type: "cta",
        sectionTitle: "CTA",
        sectionDescription: "Close the page with a clear commercial action for the buyer.",
        heading: "",
        description: "",
        primaryCtaText: "",
        secondaryCtaText: "",
        elements: [],
      },
      {
        type: "faq",
        sectionTitle: "FAQ",
        sectionDescription: "Answer the most common buyer questions before they contact the business.",
        heading: "",
        items: [],
        elements: [],
      },
    ],
  };
}

const INITIAL_FORM: FormState = {
  languageId: "lang_en",
  internalTitle: "",
  title: "",
  slug: "",
  status: CmsPageStatus.DRAFT,
  template: "STANDARD",
  layout: "WEBSITE",
  isHomePage: false,
  showInMenu: true,
  excerpt: "",
  content: "",
  structuredContent: {
    version: 1,
    template: "STANDARD",
    sections: [],
  },
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  canonicalUrl: "",
};

const LANGUAGE_OPTIONS = [
  { label: "English", value: "lang_en" },
  { label: "Hindi", value: "lang_hi" },
  { label: "Arabic", value: "lang_ar" },
] as const;

const ROOTYM_SECTION_OPTIONS: Array<{
  type: LandingPageSection["type"];
  number: number;
  title: string;
  description: string;
}> = [
  { type: "hero", number: 1, title: "Hero", description: "Primary headline, supporting message and calls to action." },
  { type: "valueProposition", number: 2, title: "Value Proposition", description: "Explain why the product is relevant to the target market." },
  { type: "product", number: 3, title: "Product", description: "Capture the core product specifications buyers need before making an enquiry." },
  { type: "applications", number: 4, title: "Applications", description: "Show where and how the product is used by commercial buyers." },
  { type: "whyRootym", number: 5, title: "Why Us", description: "Build buyer confidence around sourcing, quality and export execution." },
  { type: "buyerFocus", number: 6, title: "Buyer Focus", description: "Define the buyer profiles and commercial audiences this page targets." },
  { type: "packaging", number: 7, title: "Packaging", description: "Present practical packaging choices for export buyers." },
  { type: "exportDocuments", number: 8, title: "Export Documents", description: "List the standard export documentation buyers can expect from the business." },
  { type: "cta", number: 9, title: "CTA", description: "Close the page with a clear commercial action for the buyer." },
  { type: "faq", number: 10, title: "FAQ", description: "Answer the most common buyer questions before they contact the business." },
];

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getErrorMessage(
  result: unknown,
  fallback: string
) {
  if (!result || typeof result !== "object") {
    return fallback;
  }

  const data = result as {
    message?: unknown;
    error?: unknown;
    details?: unknown;
  };

  if (typeof data.message === "string") {
    return data.message;
  }

  if (typeof data.error === "string") {
    return data.error;
  }

  if (
    data.error &&
    typeof data.error === "object"
  ) {
    const nested = data.error as {
      message?: unknown;
    };

    if (typeof nested.message === "string") {
      return nested.message;
    }
  }

  if (Array.isArray(data.details)) {
    const messages = data.details
      .map((detail) => {
        if (!detail || typeof detail !== "object") {
          return "";
        }

        const item = detail as {
          message?: unknown;
          path?: unknown;
        };

        const message =
          typeof item.message === "string"
            ? item.message
            : "";

        const path = Array.isArray(item.path)
          ? item.path.join(".")
          : "";

        return path ? `${path}: ${message}` : message;
      })
      .filter(Boolean);

    if (messages.length) {
      return messages.join(" | ");
    }
  }

  return fallback;
}

function SectionHeader({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-bold text-[#2E7D32]">
        {number}
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function TextArrayEditor({
  label,
  values,
  placeholder,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  values: string[];
  placeholder: string;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          className="h-9"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {values.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
          No items added yet.
        </p>
      ) : (
        values.map((value, index) => (
          <div
            key={`${label}-${index}`}
            className="flex items-center gap-2"
          >
            <Input
              value={value}
              placeholder={placeholder}
              onChange={(event) =>
                onChange(index, event.target.value)
              }
            />
            <Button
              type="button"
              variant="outline"
              className="h-10 w-10 shrink-0 px-0"
              onClick={() => onRemove(index)}
              aria-label={`Remove ${label} ${index + 1}`}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
}

function ObjectArrayEditor({
  label,
  values,
  firstPlaceholder,
  secondPlaceholder,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  values: Array<{
    title: string;
    description: string;
  }>;
  firstPlaceholder: string;
  secondPlaceholder: string;
  onChange: (
    index: number,
    field: "title" | "description",
    value: string
  ) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          className="h-9"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {values.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
          No items added yet.
        </p>
      ) : (
        values.map((item, index) => (
          <div
            key={`${label}-${index}`}
            className="rounded-xl border border-gray-200 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Item {index + 1}
              </span>
              <Button
                type="button"
                variant="outline"
                className="h-8 w-8 px-0"
                onClick={() => onRemove(index)}
                aria-label={`Remove ${label} ${index + 1}`}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={item.title}
                placeholder={firstPlaceholder}
                onChange={(event) =>
                  onChange(
                    index,
                    "title",
                    event.target.value
                  )
                }
              />

              <Textarea
                value={item.description}
                placeholder={secondPlaceholder}
                rows={3}
                onChange={(event) =>
                  onChange(
                    index,
                    "description",
                    event.target.value
                  )
                }
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function CreateWebsitePage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    hero: true,
    valueProposition: false,
    product: false,
    applications: false,
    whyRootym: false,
    buyerFocus: false,
    packaging: false,
    exportDocuments: false,
    cta: false,
    faq: false,
  });

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugManuallyEdited ? current.slug : createSlug(value),
    }));
  }

  function toggleStructuredSection(type: LandingPageSection["type"]) {
    setForm((current) => {
      const exists = current.structuredContent.sections.some(
        (section) => section.type === type
      );

      if (exists) {
        return {
          ...current,
          structuredContent: {
            ...current.structuredContent,
            sections: current.structuredContent.sections.filter(
              (section) => section.type !== type
            ),
          },
        };
      }

      const defaultSection = createDefaultStructuredContent("STANDARD").sections.find(
        (section) => section.type === type
      );

      if (!defaultSection) {
        return current;
      }

      return {
        ...current,
        structuredContent: {
          ...current.structuredContent,
          sections: [
            ...current.structuredContent.sections,
            defaultSection,
          ],
        },
      };
    });
  }

  function isStructuredSectionSelected(type: LandingPageSection["type"]) {
    return form.structuredContent.sections.some(
      (section) => section.type === type
    );
  }

  function updateSection(
    sectionIndex: number,
    patch: Record<string, unknown>
  ) {
    setForm((current) => ({
      ...current,
      structuredContent: {
        ...current.structuredContent,
        sections: current.structuredContent.sections.map(
          (section, index) =>
            index === sectionIndex
              ? ({ ...section, ...patch } as LandingPageSection)
              : section
        ),
      },
    }));
  }

  function copySection(sectionIndex: number) {
    setForm((current) => {
      const source = current.structuredContent.sections[sectionIndex];

      if (!source) {
        return current;
      }

      const duplicate = JSON.parse(
        JSON.stringify(source)
      ) as LandingPageSection;

      const sections = [...current.structuredContent.sections];
      sections.splice(sectionIndex + 1, 0, duplicate);

      return {
        ...current,
        structuredContent: {
          ...current.structuredContent,
          sections,
        },
      };
    });

    setOpenSections((current) => {
      const next: Record<string, boolean> = {};

      Object.entries(current).forEach(([key, value]) => {
        const index = Number(key);
        if (Number.isNaN(index)) {
          next[key] = value;
          return;
        }
        next[String(index >= sectionIndex + 1 ? index + 1 : index)] = value;
      });

      next[String(sectionIndex + 1)] = true;
      return next;
    });
  }

  function removeSection(sectionIndex: number) {
    setForm((current) => ({
      ...current,
      structuredContent: {
        ...current.structuredContent,
        sections: current.structuredContent.sections.filter(
          (_, index) => index !== sectionIndex
        ),
      },
    }));

    setOpenSections((current) => {
      const next: Record<string, boolean> = {};

      Object.entries(current).forEach(([key, value]) => {
        const index = Number(key);
        if (Number.isNaN(index) || index === sectionIndex) {
          return;
        }
        next[String(index > sectionIndex ? index - 1 : index)] = value;
      });

      return next;
    });
  }

  function moveSection(sectionIndex: number, direction: -1 | 1) {
    setForm((current) => {
      const targetIndex = sectionIndex + direction;

      if (
        sectionIndex < 0 ||
        sectionIndex >= current.structuredContent.sections.length ||
        targetIndex < 0 ||
        targetIndex >= current.structuredContent.sections.length
      ) {
        return current;
      }

      const sections = [...current.structuredContent.sections];
      const [movedSection] = sections.splice(sectionIndex, 1);

      if (!movedSection) {
        return current;
      }

      sections.splice(targetIndex, 0, movedSection);

      return {
        ...current,
        structuredContent: {
          ...current.structuredContent,
          sections,
        },
      };
    });

    setOpenSections((current) => {
      const next: Record<string, boolean> = {};

      Object.entries(current).forEach(([key, value]) => {
        const index = Number(key);
        if (Number.isNaN(index)) {
          return;
        }

        if (index === sectionIndex) {
          next[String(sectionIndex + direction)] = value;
        } else if (direction === 1 && index === sectionIndex + 1) {
          next[String(sectionIndex)] = value;
        } else if (direction === -1 && index === sectionIndex - 1) {
          next[String(sectionIndex)] = value;
        } else {
          next[String(index)] = value;
        }
      });

      return next;
    });
  }

  function updateStringArrayItem(
    sectionIndex: number,
    key: "points" | "applications" | "buyerTypes" | "options" | "documents",
    index: number,
    value: string
  ) {
    const section = form.structuredContent.sections[
      sectionIndex
    ] as unknown as Record<string, unknown> | undefined;
    const values = Array.isArray(section?.[key])
      ? [...(section[key] as string[])]
      : [];
    values[index] = value;
    updateSection(sectionIndex, { [key]: values });
  }

  function addStringArrayItem(
    sectionIndex: number,
    key: "points" | "applications" | "buyerTypes" | "options" | "documents"
  ) {
    const section = form.structuredContent.sections[
      sectionIndex
    ] as unknown as Record<string, unknown> | undefined;
    const values = Array.isArray(section?.[key])
      ? [...(section[key] as string[])]
      : [];
    values.push("");
    updateSection(sectionIndex, { [key]: values });
  }

  function removeStringArrayItem(
    sectionIndex: number,
    key: "points" | "applications" | "buyerTypes" | "options" | "documents",
    index: number
  ) {
    const section = form.structuredContent.sections[
      sectionIndex
    ] as unknown as Record<string, unknown> | undefined;
    const values = Array.isArray(section?.[key])
      ? [...(section[key] as string[])]
      : [];
    values.splice(index, 1);
    updateSection(sectionIndex, { [key]: values });
  }

  function updateObjectArrayItem(
    sectionIndex: number,
    key: "items" | "points",
    index: number,
    field: "title" | "description" | "question" | "answer",
    value: string
  ) {
    const section = form.structuredContent.sections[
      sectionIndex
    ] as unknown as Record<string, unknown> | undefined;
    const values = Array.isArray(section?.[key])
      ? [...(section[key] as Array<Record<string, string>>)]
      : [];
    values[index] = { ...values[index], [field]: value };
    updateSection(sectionIndex, { [key]: values });
  }

  function addObjectArrayItem(
    sectionIndex: number,
    key: "items" | "points"
  ) {
    const section = form.structuredContent.sections[
      sectionIndex
    ] as unknown as Record<string, unknown> | undefined;
    const values = Array.isArray(section?.[key])
      ? [...(section[key] as Array<Record<string, string>>)]
      : [];
    values.push(
      section?.type === "faq"
        ? { question: "", answer: "" }
        : { title: "", description: "" }
    );
    updateSection(sectionIndex, { [key]: values });
  }

  function removeObjectArrayItem(
    sectionIndex: number,
    key: "items" | "points",
    index: number
  ) {
    const section = form.structuredContent.sections[
      sectionIndex
    ] as unknown as Record<string, unknown> | undefined;
    const values = Array.isArray(section?.[key])
      ? [...(section[key] as Array<Record<string, string>>)]
      : [];
    values.splice(index, 1);
    updateSection(sectionIndex, { [key]: values });
  }

  function toggleSection(sectionIndex: number) {
    setOpenSections((current) => ({
      ...current,
      [String(sectionIndex)]: !current[String(sectionIndex)],
    }));
  }

  function renderStructuredSections() {
    return (
      <div className="space-y-4">
        {form.structuredContent.sections.map((section, index) => {
          const sectionIndex = index;

          switch (section.type) {
            case "hero":
              return renderSectionCard(
                section,
                index,
                1,
                "Hero",
                "Primary headline, supporting message and calls to action.",
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Heading</Label>
              <Input
                value={section.heading}
                placeholder="Dehydrated Onion Flakes from India"
                onChange={(event) =>
                  updateSection(index, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Subheading</Label>
              <Textarea
                value={section.subheading}
                placeholder="Premium Indian dehydrated onion flakes for importers, distributors and food manufacturers."
                rows={4}
                onChange={(event) =>
                  updateSection(index, {
                    subheading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Primary CTA</Label>
              <Input
                value={section.primaryCtaText}
                placeholder="Request a Quote"
                onChange={(event) =>
                  updateSection(index, {
                    primaryCtaText:
                      event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA</Label>
              <Input
                value={section.secondaryCtaText}
                placeholder="View Product Details"
                onChange={(event) =>
                  updateSection(index, {
                    secondaryCtaText:
                      event.target.value,
                  })
                }
              />
            </div>
          </div>
              );

            case "valueProposition":
              return renderSectionCard(
                section,
                index,
                2,
                "Value Proposition",
                "Explain why the product is relevant to the target market.",
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={section.heading}
                placeholder="Consistent Indian supply for global buyers"
                onChange={(event) =>
                  updateSection(index, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={section.description}
                rows={4}
                onChange={(event) =>
                  updateSection(index, {
                    description:
                      event.target.value,
                  })
                }
              />
            </div>
            <TextArrayEditor
              label="Key Points"
              values={section.points}
              placeholder="Reliable sourcing and export-ready supply"
              onChange={(index, value) =>
                updateStringArrayItem(
                  sectionIndex,
                  "points",
                  index,
                  value
                )
              }
              onAdd={() =>
                addStringArrayItem(
                  sectionIndex,
                  "points"
                )
              }
              onRemove={(index) =>
                removeStringArrayItem(
                  sectionIndex,
                  "points",
                  index
                )
              }
            />
          </div>
              );

            case "product":
              return renderSectionCard(
                section,
                index,
                3,
                "Product",
                "Capture the core product specifications buyers need before making an enquiry.",
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Heading</Label>
                <Input
                  value={section.heading}
                  placeholder="Premium Dehydrated Onion Flakes"
                  onChange={(event) =>
                    updateSection(index, {
                      heading: event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={section.description}
                  rows={4}
                  onChange={(event) =>
                    updateSection(index, {
                      description:
                        event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  value={section.productName}
                  onChange={(event) =>
                    updateSection(index, {
                      productName:
                        event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Origin</Label>
                <Input
                  value={section.origin}
                  placeholder="Nashik, Maharashtra, India"
                  onChange={(event) =>
                    updateSection(index, {
                      origin: event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Form</Label>
                <Input
                  value={section.form}
                  placeholder="Flakes"
                  onChange={(event) =>
                    updateSection(index, {
                      form: event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Packaging</Label>
                <Input
                  value={section.packaging}
                  placeholder="Bulk export cartons / food-grade bags"
                  onChange={(event) =>
                    updateSection(index, {
                      packaging:
                        event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>MOQ</Label>
                <Input
                  value={section.moq}
                  placeholder="1 MT or buyer requirement"
                  onChange={(event) =>
                    updateSection(index, {
                      moq: event.target.value,
                    })
                  }
                />
              </div>
            </div>

            <TextArrayEditor
              label="Applications"
              values={section.applications}
              placeholder="Food manufacturing"
              onChange={(index, value) =>
                updateStringArrayItem(
                  sectionIndex,
                  "applications",
                  index,
                  value
                )
              }
              onAdd={() =>
                addStringArrayItem(
                  sectionIndex,
                  "applications"
                )
              }
              onRemove={(index) =>
                removeStringArrayItem(
                  sectionIndex,
                  "applications",
                  index
                )
              }
            />
          </div>
              );

            case "applications":
              return renderSectionCard(
                section,
                index,
                4,
                "Applications",
                "Show where and how the product is used by commercial buyers.",
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={section.heading}
                onChange={(event) =>
                  updateSection(index, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={section.description}
                rows={4}
                onChange={(event) =>
                  updateSection(index, {
                    description:
                      event.target.value,
                  })
                }
              />
            </div>
            <ObjectArrayEditor
              label="Application Items"
              values={section.items}
              firstPlaceholder="Food processing"
              secondPlaceholder="Describe the application and buyer use case."
              onChange={(index, field, value) =>
                updateObjectArrayItem(
                  sectionIndex,
                  "items",
                  index,
                  field,
                  value
                )
              }
              onAdd={() =>
                addObjectArrayItem(
                  sectionIndex,
                  "items"
                )
              }
              onRemove={(index) =>
                removeObjectArrayItem(
                  sectionIndex,
                  "items",
                  index
                )
              }
            />
          </div>
              );

            case "whyRootym":
              return renderSectionCard(
                section,
                index,
                5,
                "Why ROOTYM",
                "Build buyer confidence around sourcing, quality and export execution.",
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={section.heading}
                onChange={(event) =>
                  updateSection(index, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <ObjectArrayEditor
              label="Why Us Points"
              values={section.points}
              firstPlaceholder="Quality-focused sourcing"
              secondPlaceholder="Explain the buyer benefit."
              onChange={(index, field, value) =>
                updateObjectArrayItem(
                  sectionIndex,
                  "points",
                  index,
                  field,
                  value
                )
              }
              onAdd={() =>
                addObjectArrayItem(
                  sectionIndex,
                  "points"
                )
              }
              onRemove={(index) =>
                removeObjectArrayItem(
                  sectionIndex,
                  "points",
                  index
                )
              }
            />
          </div>
              );

            case "buyerFocus":
              return renderSectionCard(
                section,
                index,
                6,
                "Buyer Focus",
                "Define the buyer profiles and commercial audiences this page targets.",
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={section.heading}
                onChange={(event) =>
                  updateSection(index, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={section.description}
                rows={4}
                onChange={(event) =>
                  updateSection(index, {
                    description:
                      event.target.value,
                  })
                }
              />
            </div>
            <TextArrayEditor
              label="Buyer Types"
              values={section.buyerTypes}
              placeholder="Food ingredient importer"
              onChange={(index, value) =>
                updateStringArrayItem(
                  sectionIndex,
                  "buyerTypes",
                  index,
                  value
                )
              }
              onAdd={() =>
                addStringArrayItem(
                  sectionIndex,
                  "buyerTypes"
                )
              }
              onRemove={(index) =>
                removeStringArrayItem(
                  sectionIndex,
                  "buyerTypes",
                  index
                )
              }
            />
          </div>
              );

            case "packaging":
              return renderSectionCard(
                section,
                index,
                7,
                "Packaging",
                "Present practical packaging choices for export buyers.",
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={section.heading}
                onChange={(event) =>
                  updateSection(index, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={section.description}
                rows={4}
                onChange={(event) =>
                  updateSection(index, {
                    description:
                      event.target.value,
                  })
                }
              />
            </div>
            <TextArrayEditor
              label="Packaging Options"
              values={section.options}
              placeholder="25 kg food-grade export bag"
              onChange={(index, value) =>
                updateStringArrayItem(
                  sectionIndex,
                  "options",
                  index,
                  value
                )
              }
              onAdd={() =>
                addStringArrayItem(
                  sectionIndex,
                  "options"
                )
              }
              onRemove={(index) =>
                removeStringArrayItem(
                  sectionIndex,
                  "options",
                  index
                )
              }
            />
          </div>
              );

            case "exportDocuments":
              return renderSectionCard(
                section,
                index,
                8,
                "Export Documents",
                "List the standard export documentation buyers can expect from the business.",
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={section.heading}
                onChange={(event) =>
                  updateSection(index, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={section.description}
                rows={4}
                onChange={(event) =>
                  updateSection(index, {
                    description:
                      event.target.value,
                  })
                }
              />
            </div>
            <TextArrayEditor
              label="Documents"
              values={section.documents}
              placeholder="Commercial Invoice"
              onChange={(index, value) =>
                updateStringArrayItem(
                  sectionIndex,
                  "documents",
                  index,
                  value
                )
              }
              onAdd={() =>
                addStringArrayItem(
                  sectionIndex,
                  "documents"
                )
              }
              onRemove={(index) =>
                removeStringArrayItem(
                  sectionIndex,
                  "documents",
                  index
                )
              }
            />
          </div>
              );

            case "cta":
              return renderSectionCard(
                section,
                index,
                9,
                "CTA",
                "Close the page with a clear commercial action for the buyer.",
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Heading</Label>
              <Input
                value={section.heading}
                onChange={(event) =>
                  updateSection(index, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={section.description}
                rows={4}
                onChange={(event) =>
                  updateSection(index, {
                    description: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Primary CTA</Label>
              <Input
                value={section.primaryCtaText}
                placeholder="Request a Quote"
                onChange={(event) =>
                  updateSection(index, {
                    primaryCtaText:
                      event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA</Label>
              <Input
                value={section.secondaryCtaText}
                placeholder="Contact Us"
                onChange={(event) =>
                  updateSection(index, {
                    secondaryCtaText:
                      event.target.value,
                  })
                }
              />
            </div>
          </div>
              );

            case "faq":
              return renderSectionCard(
                section,
                index,
                10,
                "FAQ",
                "Answer the most common buyer questions before they contact the business.",
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={section.heading}
                onChange={(event) =>
                  updateSection(index, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label>Questions & Answers</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    addObjectArrayItem(
                      sectionIndex,
                      "items"
                    )
                  }
                  className="h-9"
                >
                  <Plus className="h-4 w-4" />
                  Add FAQ
                </Button>
              </div>

              {section.items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
                  No FAQs added yet.
                </p>
              ) : (
                section.items.map((item, index) => (
                  <div
                    key={`section-${index}`}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        FAQ {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 w-8 px-0"
                        onClick={() =>
                          removeObjectArrayItem(
                            sectionIndex,
                            "items",
                            index
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Question</Label>
                        <Input
                          value={item.question}
                          onChange={(event) =>
                            updateObjectArrayItem(
                              sectionIndex,
                              "items",
                              index,
                              "question",
                              event.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Answer</Label>
                        <Textarea
                          value={item.answer}
                          rows={4}
                          onChange={(event) =>
                            updateObjectArrayItem(
                              sectionIndex,
                              "items",
                              index,
                              "answer",
                              event.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
              );
            default:
              return null;
          }
        })}
      </div>
    );
  }

  function renderSectionCard(
    section: LandingPageSection,
    sectionIndex: number,
    number: number,
    title: string,
    description: string,
    children: ReactNode
  ) {
    const displayTitle = section.sectionTitle?.trim() || title;
    const displayDescription =
      section.sectionDescription?.trim() || description;
    const isFirst = sectionIndex === 0;
    const isLast =
      sectionIndex === form.structuredContent.sections.length - 1;
    const isOpen = openSections[String(sectionIndex)] ?? true;

    return (
      <Card hover={false} className="overflow-hidden p-0">
        <div className="flex items-start gap-4 p-6">
          <button
            type="button"
            className="flex min-w-0 flex-1 items-start gap-4 text-left"
            onClick={() => toggleSection(sectionIndex)}
          >
            <SectionHeader
              number={sectionIndex + 1}
              title={displayTitle}
              description={displayDescription}
            />
            {isOpen ? (
              <ChevronUp className="h-5 w-5 shrink-0 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
            )}
          </button>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3"
              onClick={() => moveSection(sectionIndex, -1)}
              disabled={isFirst}
              aria-label={`Move ${displayTitle} up`}
            >
              <ChevronUp className="h-4 w-4" />
              Up
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3"
              onClick={() => moveSection(sectionIndex, 1)}
              disabled={isLast}
              aria-label={`Move ${displayTitle} down`}
            >
              <ChevronDown className="h-4 w-4" />
              Down
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3"
              onClick={() => copySection(sectionIndex)}
              aria-label={`Copy ${displayTitle}`}
            >
              <CopyIcon className="h-4 w-4" />
              Copy
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3"
              onClick={() => removeSection(sectionIndex)}
              aria-label={`Remove ${displayTitle}`}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
              Remove
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="border-t border-gray-100 p-6">
            <div className="mb-6 grid gap-5 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Section Header</Label>
                <Input
                  value={section.sectionTitle ?? title}
                  placeholder={title}
                  onChange={(event) =>
                    updateSection(sectionIndex, {
                      sectionTitle: event.target.value,
                    })
                  }
                />
                <p className="text-xs text-gray-500">
                  Rename this section for this page.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Section Description</Label>
                <Textarea
                  value={section.sectionDescription ?? description}
                  placeholder={description}
                  rows={3}
                  onChange={(event) =>
                    updateSection(sectionIndex, {
                      sectionDescription: event.target.value,
                    })
                  }
                />
                <p className="text-xs text-gray-500">
                  Explain what this section is for on this page.
                </p>
              </div>
            </div>

            {children}

            <SectionElementsEditor
              value={section.elements ?? []}
              onChange={(elements) =>
                updateSection(sectionIndex, {
                  elements,
                })
              }
            />
          </div>
        )}
      </Card>
    );
  }

  async function handleSave(publish: boolean) {
    setError("");
    setSuccess("");

    const internalTitle = form.internalTitle.trim();
    const title = form.title.trim();
    const slug = form.slug.trim();

    if (!internalTitle) { setError("Internal page title is required."); return; }
    if (!title) { setError("Page title is required."); return; }
    if (!slug) { setError("Page slug is required."); return; }

    setIsSaving(true);

    try {
      const response = await fetch("/api/workspace/website/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: internalTitle,
          slug,
          status: publish ? CmsPageStatus.PUBLISHED : CmsPageStatus.DRAFT,
          template: "STANDARD",
          layout: form.layout,
          isHomePage: form.isHomePage,
          showInMenu: form.showInMenu,
          ...(form.canonicalUrl.trim() ? { canonicalUrl: form.canonicalUrl.trim() } : {}),
          metaTitle: form.metaTitle.trim(),
          metaDescription: form.metaDescription.trim(),
          metaKeywords: form.metaKeywords.trim(),
          translation: {
            languageId: form.languageId,
            title,
            slug,
            excerpt: form.excerpt.trim(),
            content: form.content,
            structuredContent: form.structuredContent,
            metaTitle: form.metaTitle.trim(),
            metaDescription: form.metaDescription.trim(),
            metaKeywords: form.metaKeywords.trim(),
            isPublished: publish,
          },
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(getErrorMessage(result, "Failed to create website page."));
      }

      setSuccess(publish ? "Website page published successfully." : "Website page saved as draft successfully.");
      setTimeout(() => {
        router.push("/app/workspace/website/pages/all");
        router.refresh();
      }, 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create website page.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void handleSave(false);
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <button type="button" onClick={() => router.push("/app/workspace/website/pages/all")} className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#2E7D32]">
          <ArrowLeft className="h-4 w-4" />
          Back to All Pages
        </button>
        <div className="mb-2 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-[#2E7D32] ring-1 ring-green-100">Customer Website</div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create Website Page</h1>
        <p className="mt-1 text-sm text-gray-500">Create a Standard Page, choose the page language, and select only the sections this page needs.</p>
      </div>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card hover={false} className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">General</h2>
            <p className="mt-1 text-sm text-gray-500">Basic page information, language, presentation and navigation settings.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="internalTitle">Internal Page Title</Label>
              <Input id="internalTitle" value={form.internalTitle} onChange={(event) => updateField("internalTitle", event.target.value)} maxLength={200} required />
              <p className="text-xs text-gray-500">Used internally to identify the page in the CMS.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="languageId">Page Language</Label>
              <Select id="languageId" value={form.languageId} onChange={(event) => updateField("languageId", event.target.value)} options={LANGUAGE_OPTIONS.map((option) => ({ label: option.label, value: option.value }))} />
              <p className="text-xs text-gray-500">Language used for this page translation.</p>
            </div>
            <div className="space-y-2">
              <Label>Page Format</Label>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-sm font-semibold text-emerald-800">ROOTYM Standard Page</p>
                <p className="mt-1 text-xs leading-5 text-emerald-700">The page uses the structured page model. You can choose any combination of sections below.</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="layout">Page Presentation</Label>
              <Select id="layout" value={form.layout} onChange={(event) => updateField("layout", event.target.value as PageLayout)} options={[{ label: "Website Page", value: "WEBSITE" }, { label: "Standalone Landing Page", value: "STANDALONE" }]} />
              <p className="text-xs text-gray-500">Choose whether this page uses the website header and footer or works as a standalone landing page.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input id="title" value={form.title} onChange={(event) => handleTitleChange(event.target.value)} maxLength={200} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input id="slug" value={form.slug} onChange={(event) => { setSlugManuallyEdited(true); updateField("slug", createSlug(event.target.value)); }} maxLength={200} required />
              <p className="text-xs text-gray-500">Public URL preview: <span className="font-medium text-gray-700">{form.slug ? `/${form.slug}` : "/your-page-slug"}</span></p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
              <input id="showInMenu" type="checkbox" checked={form.showInMenu} onChange={(event) => updateField("showInMenu", event.target.checked)} className="h-4 w-4 rounded border-gray-300 accent-[#2E7D32]" />
              <div><Label htmlFor="showInMenu" className="cursor-pointer">Show in Menu</Label><p className="mt-1 text-xs text-gray-500">Controls whether this page is intended to appear in site navigation.</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
              <input id="isHomePage" type="checkbox" checked={form.isHomePage} onChange={(event) => updateField("isHomePage", event.target.checked)} className="h-4 w-4 rounded border-gray-300 accent-[#2E7D32]" />
              <div><Label htmlFor="isHomePage" className="cursor-pointer">Set as Homepage</Label><p className="mt-1 text-xs text-gray-500">Only enable this when this page should become the website homepage.</p></div>
            </div>
          </div>
        </Card>

        <Card hover={false} className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">ROOTYM Standard Page Sections</h2>
            <p className="mt-1 text-sm text-gray-500">Select the sections you need. No section is mandatory. Each selected section can be renamed and its section description can be repurposed for this page.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {ROOTYM_SECTION_OPTIONS.map((option) => {
              const selected = isStructuredSectionSelected(option.type);
              return (
                <label key={option.type} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${selected ? "border-emerald-300 bg-emerald-50/60" : "border-gray-200 bg-white hover:border-emerald-200"}`}>
                  <input type="checkbox" checked={selected} onChange={() => toggleStructuredSection(option.type)} className="mt-1 h-4 w-4 rounded border-gray-300 accent-[#2E7D32]" />
                  <span><span className="block text-sm font-semibold text-gray-900">{option.number}. {option.title}</span><span className="mt-1 block text-xs leading-5 text-gray-500">{option.description}</span></span>
                </label>
              );
            })}
          </div>

          <div className="mt-6">
            {form.structuredContent.sections.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 px-5 py-8 text-center text-sm text-gray-500">Select one or more sections above to build this page.</div>
            ) : (
              renderStructuredSections()
            )}
          </div>
        </Card>

        <Card hover={false} className="p-6">
          <div className="mb-6"><h2 className="text-lg font-semibold text-gray-900">Additional Content</h2><p className="mt-1 text-sm text-gray-500">Optional plain-text content retained for compatibility with existing CMS pages.</p></div>
          <div className="space-y-5">
            <div className="space-y-2"><Label htmlFor="excerpt">Excerpt</Label><Textarea id="excerpt" value={form.excerpt} onChange={(event) => updateField("excerpt", event.target.value)} maxLength={500} rows={4} /></div>
            <div className="space-y-2"><Label htmlFor="content">Page Content</Label><Textarea id="content" value={form.content} onChange={(event) => updateField("content", event.target.value)} rows={10} /></div>
          </div>
        </Card>

        <Card hover={false} className="p-6">
          <div className="mb-6"><h2 className="text-lg font-semibold text-gray-900">SEO</h2><p className="mt-1 text-sm text-gray-500">Search-engine metadata for this page.</p></div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="metaTitle">Meta Title</Label><Input id="metaTitle" value={form.metaTitle} onChange={(event) => updateField("metaTitle", event.target.value)} maxLength={255} /></div>
            <div className="space-y-2"><Label htmlFor="canonicalUrl">Canonical URL</Label><Input id="canonicalUrl" type="url" value={form.canonicalUrl} onChange={(event) => updateField("canonicalUrl", event.target.value)} placeholder="https://export.rootym.com/..." /></div>
            <div className="space-y-2 md:col-span-2"><Label htmlFor="metaDescription">Meta Description</Label><Textarea id="metaDescription" value={form.metaDescription} onChange={(event) => updateField("metaDescription", event.target.value)} maxLength={500} rows={4} /></div>
            <div className="space-y-2 md:col-span-2"><Label htmlFor="metaKeywords">Meta Keywords</Label><Input id="metaKeywords" value={form.metaKeywords} onChange={(event) => updateField("metaKeywords", event.target.value)} maxLength={500} /></div>
          </div>
        </Card>

        <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/app/workspace/website/pages/all")} disabled={isSaving}>Cancel</Button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" variant="outline" disabled={isSaving}>{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Draft</Button>
            <Button type="button" variant="success" disabled={isSaving} onClick={() => void handleSave(true)}>{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Publish</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
