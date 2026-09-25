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
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Archive,
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
        sectionTitle: "Why Us",
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
        sectionDescription: "List the standard export documentation buyers can provide to buyers.",
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
        sectionDescription: "Answer the most common buyer questions before they get in touch.",
        heading: "",
        items: [],
        elements: [],
      },
    ],
  };
}

function normalizeStructuredContent(
  value: unknown,
  template: PageTemplate
): StructuredContent {
  const defaults = createDefaultStructuredContent(template);

  if (!value || typeof value !== "object") {
    return defaults;
  }

  const candidate = value as {
    version?: unknown;
    template?: unknown;
    sections?: unknown;
  };

  if (
    candidate.version !== 1 ||
    !Array.isArray(candidate.sections)
  ) {
    return defaults;
  }

  const existingSections = candidate.sections as LandingPageSection[];

  const normalizedSections = existingSections
    .filter(
      (section) =>
        section &&
        typeof section === "object" &&
        defaults.sections.some(
          (defaultSection) =>
            defaultSection.type === section.type
        )
    )
    .map((section) => {
      const defaultSection = defaults.sections.find(
        (item) => item.type === section.type
      );

      return defaultSection
        ? ({
            ...defaultSection,
            ...section,
            sectionTitle:
              (section as LandingPageSection).sectionTitle ??
              (defaultSection as LandingPageSection).sectionTitle,
            sectionDescription:
              (section as LandingPageSection).sectionDescription ??
              (defaultSection as LandingPageSection).sectionDescription,
          } as LandingPageSection)
        : section;
    });

  return {
    version: 1,
    template:
      candidate.template === "COUNTRY_LANDING"
        ? "COUNTRY_LANDING"
        : template,
    sections: normalizedSections,
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
  structuredContent:
    createDefaultStructuredContent("STANDARD"),
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  canonicalUrl: "",
};

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

export default function EditCmsPage() {
  const router = useRouter();
  const params = useParams();

  const pageId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [form, setForm] =
    useState<FormState>(INITIAL_FORM);

  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(true);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [openSections, setOpenSections] =
    useState<Record<string, boolean>>({
      0: true,
    });

  useEffect(() => {
    if (!pageId) {
      setError("Website page ID is missing.");
      setIsLoading(false);
      return;
    }

    async function loadPage() {
      try {
        setError("");

        const response = await fetch(
          `/api/workspace/website/pages/${pageId}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          throw new Error(
            getErrorMessage(
              result,
              "Failed to load website page."
            )
          );
        }

        const page = result?.data;

        if (!page) {
          throw new Error(
            "Website page data was not returned."
          );
        }

        const defaultTranslation =
          page.translations?.find(
            (translation: {
              language?: {
                isDefault?: boolean;
              };
            }) =>
              translation.language?.isDefault
          ) ?? page.translations?.[0];

        const template: PageTemplate =
          page.template === "COUNTRY_LANDING"
            ? "COUNTRY_LANDING"
            : "STANDARD";

        const structuredContent =
          normalizeStructuredContent(
            defaultTranslation?.structuredContent,
            template
          );

        setForm({
          languageId:
            defaultTranslation?.languageId ??
            "lang_en",
          internalTitle: page.title ?? "",
          title:
            defaultTranslation?.title ??
            page.title ??
            "",
          slug:
            defaultTranslation?.slug ??
            page.slug ??
            "",
          status:
            page.status ??
            CmsPageStatus.DRAFT,
          template,
          layout:
            page.layout === "STANDALONE"
              ? "STANDALONE"
              : "WEBSITE",
          isHomePage:
            page.isHomePage ?? false,
          showInMenu:
            page.showInMenu ?? true,
          excerpt:
            defaultTranslation?.excerpt ??
            "",
          content:
            defaultTranslation?.content ??
            "",
          structuredContent,
          metaTitle:
            defaultTranslation?.metaTitle ??
            page.metaTitle ??
            "",
          metaDescription:
            defaultTranslation?.metaDescription ??
            page.metaDescription ??
            "",
          metaKeywords:
            defaultTranslation?.metaKeywords ??
            page.metaKeywords ??
            "",
          canonicalUrl:
            page.canonicalUrl ??
            "",
        });

        setSlugManuallyEdited(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load website page."
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadPage();
  }, [pageId]);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugManuallyEdited
        ? current.slug
        : createSlug(value),
    }));
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
              ? ({
                  ...section,
                  ...patch,
                } as LandingPageSection)
              : section
        ),
      },
    }));
  }

  function getSectionAtIndex<T>(
    sectionIndex: number
  ): T {
    return form.structuredContent.sections[
      sectionIndex
    ] as T;
  }

  function copySection(sectionIndex: number) {
    setForm((current) => {
      const source = current.structuredContent.sections[
        sectionIndex
      ];

      if (!source) {
        return current;
      }

      const copy = JSON.parse(
        JSON.stringify(source)
      ) as LandingPageSection;

      const sections = [
        ...current.structuredContent.sections,
      ];
      sections.splice(sectionIndex + 1, 0, copy);

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

      (Object.entries(current) as Array<[string, boolean]>).forEach(
        ([key, value]) => {
          const index = Number(key);
          next[index >= sectionIndex + 1 ? index + 1 : index] = value;
        }
      );

      next[sectionIndex + 1] = true;
      return next;
    });
  }

  function moveSection(
    sectionIndex: number,
    direction: -1 | 1
  ) {
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

      const sections = [
        ...current.structuredContent.sections,
      ];
      const [movedSection] = sections.splice(
        sectionIndex,
        1
      );

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
      const next = { ...current };
      const currentValue = next[sectionIndex];
      next[sectionIndex] = next[sectionIndex + direction] ?? false;
      next[sectionIndex + direction] = currentValue ?? false;
      return next;
    });
  }

  function removeSection(sectionIndex: number) {
    setForm((current) => {
      if (current.structuredContent.sections.length <= 1) {
        return current;
      }

      return {
        ...current,
        structuredContent: {
          ...current.structuredContent,
          sections: current.structuredContent.sections.filter(
            (_, index) => index !== sectionIndex
          ),
        },
      };
    });

    if (form.structuredContent.sections.length <= 1) {
      return;
    }

    setOpenSections((current) => {
      const next: Record<string, boolean> = {};
      (Object.entries(current) as Array<[string, boolean]>).forEach(
        ([key, value]) => {
          const index = Number(key);
          if (index < sectionIndex) {
            next[index] = value;
          } else if (index > sectionIndex) {
            next[index - 1] = value;
          }
        }
      );
      return next;
    });
  }

  function updateStringArrayItem(
    sectionIndex: number,
    key:
      | "points"
      | "applications"
      | "buyerTypes"
      | "options"
      | "documents",
    itemIndex: number,
    value: string
  ) {
    const section = getSectionAtIndex<Record<string, unknown>>(
      sectionIndex
    );
    const values = Array.isArray(section?.[key])
      ? [...(section[key] as string[])]
      : [];

    values[itemIndex] = value;
    updateSection(sectionIndex, { [key]: values });
  }

  function addStringArrayItem(
    sectionIndex: number,
    key:
      | "points"
      | "applications"
      | "buyerTypes"
      | "options"
      | "documents"
  ) {
    const section = getSectionAtIndex<Record<string, unknown>>(
      sectionIndex
    );
    const values = Array.isArray(section?.[key])
      ? [...(section[key] as string[])]
      : [];

    values.push("");
    updateSection(sectionIndex, { [key]: values });
  }

  function removeStringArrayItem(
    sectionIndex: number,
    key:
      | "points"
      | "applications"
      | "buyerTypes"
      | "options"
      | "documents",
    itemIndex: number
  ) {
    const section = getSectionAtIndex<Record<string, unknown>>(
      sectionIndex
    );
    const values = Array.isArray(section?.[key])
      ? [...(section[key] as string[])]
      : [];

    values.splice(itemIndex, 1);
    updateSection(sectionIndex, { [key]: values });
  }

  function updateObjectArrayItem(
    sectionIndex: number,
    key: "items" | "points",
    itemIndex: number,
    field: "title" | "description" | "question" | "answer",
    value: string
  ) {
    const section = getSectionAtIndex<Record<string, unknown>>(
      sectionIndex
    );
    const values = Array.isArray(section?.[key])
      ? [...(section[key] as Array<Record<string, string>>)]
      : [];

    values[itemIndex] = {
      ...values[itemIndex],
      [field]: value,
    };

    updateSection(sectionIndex, { [key]: values });
  }

  function addObjectArrayItem(
    sectionIndex: number,
    key: "items" | "points"
  ) {
    const section = getSectionAtIndex<Record<string, unknown>>(
      sectionIndex
    );
    const values = Array.isArray(section?.[key])
      ? [...(section[key] as Array<Record<string, string>>)]
      : [];

    const type = section?.type;
    values.push(
      type === "faq"
        ? { question: "", answer: "" }
        : { title: "", description: "" }
    );

    updateSection(sectionIndex, { [key]: values });
  }

  function removeObjectArrayItem(
    sectionIndex: number,
    key: "items" | "points",
    itemIndex: number
  ) {
    const section = getSectionAtIndex<Record<string, unknown>>(
      sectionIndex
    );
    const values = Array.isArray(section?.[key])
      ? [...(section[key] as Array<Record<string, string>>)]
      : [];

    values.splice(itemIndex, 1);
    updateSection(sectionIndex, { [key]: values });
  }

  function toggleSection(sectionIndex: number) {
    setOpenSections((current) => ({
      ...current,
      [sectionIndex]: !current[sectionIndex],
    }));
  }

  function renderSectionCard(
    sectionIndex: number,
    title: string,
    description: string,
    section: LandingPageSection,
    children: ReactNode
  ) {
    const displayTitle =
      section.sectionTitle?.trim() || title;
    const displayDescription =
      section.sectionDescription?.trim() || description;
    const isFirst = sectionIndex === 0;
    const isLast =
      sectionIndex ===
      form.structuredContent.sections.length - 1;

    return (
      <Card
        hover={false}
        className="overflow-hidden p-0"
      >
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
            {openSections[sectionIndex] ? (
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
            >
              <CopyIcon className="h-4 w-4" />
              Copy
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3"
              onClick={() => removeSection(sectionIndex)}
              disabled={form.structuredContent.sections.length <= 1}
              aria-label={`Remove ${displayTitle}`}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
              Remove
            </Button>
          </div>
        </div>

        {openSections[sectionIndex] && (
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

  function renderSectionContent(
    sectionIndex: number,
    section: LandingPageSection
  ) {
    switch (section.type) {      case "hero": {
        const hero = section as HeroSection;
        return (
<div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Heading</Label>
              <Input
                value={hero.heading}
                placeholder="Dehydrated Onion Flakes from India"
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Subheading</Label>
              <Textarea
                value={hero.subheading}
                placeholder="Premium Indian dehydrated onion flakes for importers, distributors and food manufacturers."
                rows={4}
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    subheading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Primary CTA</Label>
              <Input
                value={hero.primaryCtaText}
                placeholder="Request a Quote"
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    primaryCtaText:
                      event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA</Label>
              <Input
                value={hero.secondaryCtaText}
                placeholder="View Product Details"
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    secondaryCtaText:
                      event.target.value,
                  })
                }
              />
            </div>
          </div>
        );
      }      case "valueProposition": {
        const valueProposition = section as ValuePropositionSection;
        return (
<div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={valueProposition.heading}
                placeholder="Consistent Indian supply for global buyers"
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={valueProposition.description}
                rows={4}
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    description:
                      event.target.value,
                  })
                }
              />
            </div>
            <TextArrayEditor
              label="Key Points"
              values={valueProposition.points}
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
      }      case "product": {
        const product = section as ProductSection;
        return (
<div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Heading</Label>
                <Input
                  value={product.heading}
                  placeholder="Premium Dehydrated Onion Flakes"
                  onChange={(event) =>
                    updateSection(sectionIndex, {
                      heading: event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={product.description}
                  rows={4}
                  onChange={(event) =>
                    updateSection(sectionIndex, {
                      description:
                        event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  value={product.productName}
                  onChange={(event) =>
                    updateSection(sectionIndex, {
                      productName:
                        event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Origin</Label>
                <Input
                  value={product.origin}
                  placeholder="Nashik, Maharashtra, India"
                  onChange={(event) =>
                    updateSection(sectionIndex, {
                      origin: event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Form</Label>
                <Input
                  value={product.form}
                  placeholder="Flakes"
                  onChange={(event) =>
                    updateSection(sectionIndex, {
                      form: event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Packaging</Label>
                <Input
                  value={product.packaging}
                  placeholder="Bulk export cartons / food-grade bags"
                  onChange={(event) =>
                    updateSection(sectionIndex, {
                      packaging:
                        event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>MOQ</Label>
                <Input
                  value={product.moq}
                  placeholder="1 MT or buyer requirement"
                  onChange={(event) =>
                    updateSection(sectionIndex, {
                      moq: event.target.value,
                    })
                  }
                />
              </div>
            </div>

            <TextArrayEditor
              label="Applications"
              values={product.applications}
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
      }      case "applications": {
        const applications = section as ApplicationsSection;
        return (
<div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={applications.heading}
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={applications.description}
                rows={4}
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    description:
                      event.target.value,
                  })
                }
              />
            </div>
            <ObjectArrayEditor
              label="Application Items"
              values={applications.items}
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
      }      case "whyRootym": {
        const whyRootym = section as WhyRootymSection;
        return (
<div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={whyRootym.heading}
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <ObjectArrayEditor
              label="Why Us Points"
              values={whyRootym.points}
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
      }      case "buyerFocus": {
        const buyerFocus = section as BuyerFocusSection;
        return (
<div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={buyerFocus.heading}
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={buyerFocus.description}
                rows={4}
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    description:
                      event.target.value,
                  })
                }
              />
            </div>
            <TextArrayEditor
              label="Buyer Types"
              values={buyerFocus.buyerTypes}
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
      }      case "packaging": {
        const packaging = section as PackagingSection;
        return (
<div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={packaging.heading}
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={packaging.description}
                rows={4}
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    description:
                      event.target.value,
                  })
                }
              />
            </div>
            <TextArrayEditor
              label="Packaging Options"
              values={packaging.options}
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
      }      case "exportDocuments": {
        const exportDocuments = section as ExportDocumentsSection;
        return (
<div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={exportDocuments.heading}
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={exportDocuments.description}
                rows={4}
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    description:
                      event.target.value,
                  })
                }
              />
            </div>
            <TextArrayEditor
              label="Documents"
              values={exportDocuments.documents}
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
      }      case "cta": {
        const cta = section as CtaSection;
        return (
<div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Heading</Label>
              <Input
                value={cta.heading}
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={cta.description}
                rows={4}
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    description: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Primary CTA</Label>
              <Input
                value={cta.primaryCtaText}
                placeholder="Request a Quote"
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    primaryCtaText:
                      event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA</Label>
              <Input
                value={cta.secondaryCtaText}
                placeholder="Contact Us"
                onChange={(event) =>
                  updateSection(sectionIndex, {
                    secondaryCtaText:
                      event.target.value,
                  })
                }
              />
            </div>
          </div>
        );
      }      case "faq": {
        const faq = section as FaqSection;
        return (
<div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={faq.heading}
                onChange={(event) =>
                  updateSection(sectionIndex, {
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

              {faq.items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
                  No FAQs added yet.
                </p>
              ) : (
                faq.items.map((item, index) => (
                  <div
                    key={`faq-${index}`}
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
      }      default:
        return null;
    }
  }

  function renderStructuredSections() {
    return (
      <div className="space-y-4">
        {form.structuredContent.sections.map((section, index) => {
          const metadata = {
            hero: {
              title: "Hero",
              description:
                "Primary headline, supporting message and calls to action.",
            },
            valueProposition: {
              title: "Value Proposition",
              description:
                "Explain why the product is relevant to the target market.",
            },
            product: {
              title: "Product",
              description:
                "Capture the core product specifications buyers need before making an enquiry.",
            },
            applications: {
              title: "Applications",
              description:
                "Show where and how the product is used by commercial buyers.",
            },
            whyRootym: {
              title: "Why Us",
              description:
                "Build buyer confidence around sourcing, quality and export execution.",
            },
            buyerFocus: {
              title: "Buyer Focus",
              description:
                "Define the buyer profiles and commercial audiences this page targets.",
            },
            packaging: {
              title: "Packaging",
              description:
                "Present practical packaging choices for export buyers.",
            },
            exportDocuments: {
              title: "Export Documents",
              description:
                "List the standard export documentation buyers can provide to buyers.",
            },
            cta: {
              title: "CTA",
              description:
                "Close the page with a clear commercial action for the buyer.",
            },
            faq: {
              title: "FAQ",
              description:
                "Answer the most common buyer questions before they get in touch.",
            },
          }[section.type];

          return renderSectionCard(
            index,
            metadata.title,
            metadata.description,
            section,
            renderSectionContent(index, section)
          );
        })}
      </div>
    );
  }

  async function handleSave(
    requestedStatus?: CmsPageStatus
  ) {
    setError("");
    setSuccess("");

    const internalTitle =
      form.internalTitle.trim();
    const title = form.title.trim();
    const slug = form.slug.trim();

    if (!internalTitle) {
      setError(
        "Internal page title is required."
      );
      return;
    }

    if (!title) {
      setError("Page title is required.");
      return;
    }

    if (!slug) {
      setError("Page slug is required.");
      return;
    }

    if (!pageId) {
      setError("Website page ID is missing.");
      return;
    }

    const status =
      requestedStatus ?? form.status;

    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/workspace/website/pages/${pageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: internalTitle,
            slug,
            status,
            template: form.template,
            layout: form.layout,
            isHomePage: form.isHomePage,
            showInMenu: form.showInMenu,
            ...(form.canonicalUrl.trim()
              ? {
                  canonicalUrl:
                    form.canonicalUrl.trim(),
                }
              : {}),
            metaTitle:
              form.metaTitle.trim(),
            metaDescription:
              form.metaDescription.trim(),
            metaKeywords:
              form.metaKeywords.trim(),
            translation: {
              languageId: form.languageId,
              title,
              slug,
              excerpt:
                form.excerpt.trim(),
              content: form.content,
              structuredContent:
                form.structuredContent,
              metaTitle:
                form.metaTitle.trim(),
              metaDescription:
                form.metaDescription.trim(),
              metaKeywords:
                form.metaKeywords.trim(),
              isPublished:
                status ===
                CmsPageStatus.PUBLISHED,
            },
          }),
        }
      );

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            result,
            "Failed to update website page."
          )
        );
      }

      const successMessage =
        status === CmsPageStatus.PUBLISHED
          ? "Website page published successfully."
          : status === CmsPageStatus.ARCHIVED
            ? "Website page archived successfully."
            : "Website page saved as draft successfully.";

      setSuccess(successMessage);

      setTimeout(() => {
        router.push("/app/workspace/website/pages/all");
        router.refresh();
      }, 700);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update website page."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    void handleSave(form.status);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading website page...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <button
          type="button"
          onClick={() =>
            router.push("/app/workspace/website/pages/all")
          }
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#2E7D32]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Pages
        </button>

        <div className="mb-2 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-[#2E7D32] ring-1 ring-green-100">
          Customer Website
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Edit Website Page
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update page structure, content, publishing
          settings and SEO metadata.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <Card
          hover={false}
          className="p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              General
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Basic page information, template,
              presentation and publishing settings.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="internalTitle">
                Internal Page Title
              </Label>
              <Input
                id="internalTitle"
                value={form.internalTitle}
                onChange={(event) =>
                  updateField(
                    "internalTitle",
                    event.target.value
                  )
                }
                maxLength={200}
                required
              />
              <p className="text-xs text-gray-500">
                Used internally to identify the page
                in the CMS.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="languageId">
                Page Language
              </Label>
              <Select
                id="languageId"
                value={form.languageId}
                onChange={(event) =>
                  updateField(
                    "languageId",
                    event.target.value
                  )
                }
                options={[
                  {
                    label: "English",
                    value: "lang_en",
                  },
                  {
                    label: "Hindi",
                    value: "lang_hi",
                  },
                  {
                    label: "Arabic",
                    value: "lang_ar",
                  },
                ]}
              />
              <p className="text-xs text-gray-500">
                Language used for this page translation.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status
              </Label>
              <Select
                id="status"
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target
                      .value as CmsPageStatus
                  )
                }
                options={[
                  {
                    label: "Draft",
                    value: CmsPageStatus.DRAFT,
                  },
                  {
                    label: "Published",
                    value:
                      CmsPageStatus.PUBLISHED,
                  },
                  {
                    label: "Archived",
                    value:
                      CmsPageStatus.ARCHIVED,
                  },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">
                Page Template
              </Label>
              <Select
                id="template"
                value={form.template}
                onChange={(event) => {
                  const template =
                    event.target.value as PageTemplate;
                  updateField("template", template);
                  setForm((current) => ({
                    ...current,
                    template,
                    structuredContent: {
                      ...current.structuredContent,
                      template,
                    },
                  }));
                }}
                options={[
                  {
                    label: "Standard Page",
                    value: "STANDARD",
                  },
                  {
                    label: "Country Landing Page",
                    value: "COUNTRY_LANDING",
                  },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="layout">
                Page Presentation
              </Label>
              <Select
                id="layout"
                value={form.layout}
                onChange={(event) =>
                  updateField(
                    "layout",
                    event.target.value as PageLayout
                  )
                }
                options={[
                  {
                    label: "Website Page",
                    value: "WEBSITE",
                  },
                  {
                    label: "Standalone Landing Page",
                    value: "STANDALONE",
                  },
                ]}
              />
              <p className="text-xs text-gray-500">
                Choose whether this page uses the
                website header and footer or
                works as a standalone landing page.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Page Title
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(event) =>
                  handleTitleChange(
                    event.target.value
                  )
                }
                maxLength={200}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                URL Slug
              </Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(event) => {
                  setSlugManuallyEdited(true);
                  updateField(
                    "slug",
                    createSlug(
                      event.target.value
                    )
                  );
                }}
                maxLength={200}
                required
              />
              <p className="text-xs text-gray-500">
                Public URL preview:{" "}
                <span className="font-medium text-gray-700">
                  {form.slug
                    ? `/${form.slug}`
                    : "/your-page-slug"}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
              <input
                id="showInMenu"
                type="checkbox"
                checked={form.showInMenu}
                onChange={(event) =>
                  updateField(
                    "showInMenu",
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-gray-300 accent-[#2E7D32]"
              />
              <div>
                <Label
                  htmlFor="showInMenu"
                  className="cursor-pointer"
                >
                  Show in Menu
                </Label>
                <p className="mt-1 text-xs text-gray-500">
                  Controls whether this page is intended
                  to appear in site navigation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
              <input
                id="isHomePage"
                type="checkbox"
                checked={form.isHomePage}
                onChange={(event) =>
                  updateField(
                    "isHomePage",
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-gray-300 accent-[#2E7D32]"
              />
              <div>
                <Label
                  htmlFor="isHomePage"
                  className="cursor-pointer"
                >
                  Set as Homepage
                </Label>
                <p className="mt-1 text-xs text-gray-500">
                  Only enable this when this page should
                  become the website homepage.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card
          hover={false}
          className="p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Structured Page Sections
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Build the page from the selected Standard Page
              sections. Only sections saved for the selected language
              are displayed here.
            </p>
          </div>

          <div className="mb-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800">
            The page currently uses the{" "}
            <strong>
              {form.template === "COUNTRY_LANDING"
                ? "Country Landing Page"
                : "Standard Page"}
            </strong>{" "}
            template. Complete the sections below before
            publishing.
          </div>

          {renderStructuredSections()}
        </Card>

        <Card
          hover={false}
          className="p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              SEO
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Search-engine metadata for this page.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">
                Meta Title
              </Label>
              <Input
                id="metaTitle"
                value={form.metaTitle}
                onChange={(event) =>
                  updateField(
                    "metaTitle",
                    event.target.value
                  )
                }
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">
                Canonical URL
              </Label>
              <Input
                id="canonicalUrl"
                type="url"
                value={form.canonicalUrl}
                onChange={(event) =>
                  updateField(
                    "canonicalUrl",
                    event.target.value
                  )
                }
             placeholder="https://export.rootym.com/..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="metaDescription">
                Meta Description
              </Label>
              <Textarea
                id="metaDescription"
                value={form.metaDescription}
                onChange={(event) =>
                  updateField(
                    "metaDescription",
                    event.target.value
                  )
                }
                maxLength={500}
                rows={4}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="metaKeywords">
                Meta Keywords
              </Label>
              <Input
                id="metaKeywords"
                value={form.metaKeywords}
                onChange={(event) =>
                  updateField(
                    "metaKeywords",
                    event.target.value
                  )
                }
                maxLength={500}
              />
            </div>
          </div>
        </Card>

        <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push("/app/workspace/website/pages/all")
            }
            disabled={isSaving}
          >
            Cancel
          </Button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="submit"
              variant="outline"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : form.status ===
                CmsPageStatus.ARCHIVED ? (
                <Archive className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {form.status ===
              CmsPageStatus.ARCHIVED
                ? "Archive"
                : form.status ===
                    CmsPageStatus.PUBLISHED
                  ? "Save Changes"
                  : "Save Draft"}
            </Button>

            <Button
              type="button"
              variant="success"
              disabled={isSaving}
              onClick={() =>
                void handleSave(
                  CmsPageStatus.PUBLISHED
                )
              }
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Publish
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
