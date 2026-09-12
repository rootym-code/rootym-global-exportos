/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the customer Website Navigation editor.
 *          Navigation is loaded and persisted through the
 *          Website-scoped Workspace Navigation API.
 * ============================================================
 */

"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  LayoutDashboard,
  Link2,
  Loader2,
  Menu,
  Monitor,
  Pencil,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
  Undo2,
} from "lucide-react";
import { DragEvent, FormEvent, useEffect, useMemo, useState } from "react";

type NavigationItem = {
  id: string;
  label: string;
  url: string;
  pageId: string | null;
  pageTitle: string | null;
  pageSlug: string | null;
  sortOrder: number;
  parentId: string | null;
  openInNewTab: boolean;
  isVisible: boolean;
};

type AvailablePage = {
  id: string;
  title: string;
  slug: string;
  status: string;
  showInMenu: boolean;
  isHomePage: boolean;
};

type NavigationData = {
  website: {
    id: string;
    name: string;
    slug: string;
  };
  menu: {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
  };
  items: NavigationItem[];
  availablePages: AvailablePage[];
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  data?: NavigationData;
};

type DraftItem = NavigationItem & {
  isNew?: boolean;
};

type EditorState = {
  mode: "page" | "link";
  itemId: string | null;
  label: string;
  url: string;
  pageId: string;
  isVisible: boolean;
  openInNewTab: boolean;
};

function statusLabel(status: string) {
  if (status === "READY") return "Connected";
  if (status === "NOT_CONNECTED") return "Not connected";
  return "Preparing";
}

function createClientId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function sortItems(items: DraftItem[]) {
  return [...items].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }

    return a.label.localeCompare(b.label);
  });
}

function normalizeItems(items: DraftItem[]) {
  return items.map((item, index) => ({
    id: item.id,
    label: item.label.trim(),
    url: item.url.trim() || "/",
    pageId: item.pageId || null,
    parentId: item.parentId || null,
    sortOrder: index,
    openInNewTab: Boolean(item.openInNewTab),
    isVisible: Boolean(item.isVisible),
  }));
}

function pageUrl(slug: string) {
  if (slug === "home") return "/";
  return `/${slug.replace(/^\/+/, "")}`;
}

function getEditorDefaults(): EditorState {
  return {
    mode: "page",
    itemId: null,
    label: "",
    url: "/",
    pageId: "",
    isVisible: true,
    openInNewTab: false,
  };
}

export default function WebsiteNavigationPage() {
  const [data, setData] = useState<NavigationData | null>(null);
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const [savedItems, setSavedItems] = useState<DraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState>(getEditorDefaults());
  const [editorOpen, setEditorOpen] = useState(false);

  const dirty = useMemo(() => {
    return JSON.stringify(normalizeItems(draftItems)) !==
      JSON.stringify(normalizeItems(savedItems));
  }, [draftItems, savedItems]);

  const visibleItems = useMemo(
    () => draftItems.filter((item) => item.isVisible),
    [draftItems]
  );

  const rootItems = useMemo(
    () => draftItems.filter((item) => !item.parentId),
    [draftItems]
  );

  async function loadNavigation() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/app/api/workspace/website/navigation", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success || !result.data) {
        throw new Error(
          result.message || "Unable to load Website navigation."
        );
      }

      const loaded = sortItems(result.data.items);
      setData(result.data);
      setDraftItems(loaded);
      setSavedItems(loaded);
      setNotice("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load Website navigation."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadNavigation();
  }, []);

  function openAddPage() {
    setEditor({
      ...getEditorDefaults(),
      mode: "page",
    });
    setEditorOpen(true);
    setError("");
    setNotice("");
  }

  function openAddLink() {
    setEditor({
      ...getEditorDefaults(),
      mode: "link",
      url: "https://",
    });
    setEditorOpen(true);
    setError("");
    setNotice("");
  }

  function openEdit(item: DraftItem) {
    setEditor({
      mode: item.pageId ? "page" : "link",
      itemId: item.id,
      label: item.label,
      url: item.url,
      pageId: item.pageId ?? "",
      isVisible: item.isVisible,
      openInNewTab: item.openInNewTab,
    });
    setEditorOpen(true);
    setError("");
    setNotice("");
  }

  function closeEditor() {
    setEditorOpen(false);
    setEditor(getEditorDefaults());
  }

  function handlePageChange(pageId: string) {
    const page = data?.availablePages.find((candidate) => candidate.id === pageId);

    setEditor((current) => ({
      ...current,
      pageId,
      label: page && !current.itemId ? page.title : current.label,
      url: page ? pageUrl(page.slug) : current.url,
    }));
  }

  function saveEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const label = editor.label.trim();

    if (!label) {
      setError("Navigation label is required.");
      return;
    }

    if (editor.mode === "page" && !editor.pageId) {
      setError("Select a Website page.");
      return;
    }

    if (editor.mode === "link" && !editor.url.trim()) {
      setError("Link URL is required.");
      return;
    }

    if (editor.mode === "link" && editor.url.trim() === "https://") {
      setError("Enter a complete link URL.");
      return;
    }

    if (editor.itemId) {
      setDraftItems((current) =>
        current.map((item) => {
          if (item.id !== editor.itemId) return item;

          const selectedPage = data?.availablePages.find(
            (page) => page.id === editor.pageId
          );

          return {
            ...item,
            label,
            url: editor.url.trim() || "/",
            pageId: editor.mode === "page" ? editor.pageId : null,
            pageTitle:
              editor.mode === "page"
                ? selectedPage?.title ?? item.pageTitle
                : null,
            pageSlug:
              editor.mode === "page"
                ? selectedPage?.slug ?? item.pageSlug
                : null,
            isVisible: editor.isVisible,
            openInNewTab: editor.openInNewTab,
          };
        })
      );
    } else {
      const selectedPage = data?.availablePages.find(
        (page) => page.id === editor.pageId
      );

      const newItem: DraftItem = {
        id: createClientId(editor.mode === "page" ? "page" : "link"),
        label,
        url: editor.url.trim() || "/",
        pageId: editor.mode === "page" ? editor.pageId : null,
        pageTitle: editor.mode === "page" ? selectedPage?.title ?? null : null,
        pageSlug: editor.mode === "page" ? selectedPage?.slug ?? null : null,
        sortOrder: draftItems.length,
        parentId: null,
        openInNewTab: editor.openInNewTab,
        isVisible: editor.isVisible,
        isNew: true,
      };

      setDraftItems((current) => [...current, newItem]);
    }

    closeEditor();
    setNotice("Navigation changes are ready to save.");
    setError("");
  }

  function removeItem(id: string) {
    const item = draftItems.find((candidate) => candidate.id === id);
    if (!item) return;

    const confirmed = window.confirm(
      `Remove "${item.label}" from the navigation? The Website page itself will not be deleted.`
    );

    if (!confirmed) return;

    setDraftItems((current) =>
      current
        .filter((candidate) => candidate.id !== id)
        .map((candidate) =>
          candidate.parentId === id
            ? { ...candidate, parentId: null }
            : candidate
        )
    );

    setNotice(`"${item.label}" was removed from navigation.`);
    setError("");
  }

  function moveItem(id: string, direction: -1 | 1) {
    setDraftItems((current) => {
      const ordered = sortItems(current);
      const index = ordered.findIndex((item) => item.id === id);

      if (index < 0) return current;

      const target = index + direction;
      if (target < 0 || target >= ordered.length) return current;

      const next = [...ordered];
      [next[index], next[target]] = [next[target], next[index]];

      return next.map((item, itemIndex) => ({
        ...item,
        sortOrder: itemIndex,
      }));
    });

    setNotice("Navigation order changed. Save Navigation to publish it.");
    setError("");
  }

  function moveItemToIndex(id: string, targetIndex: number) {
    setDraftItems((current) => {
      const ordered = sortItems(current);
      const fromIndex = ordered.findIndex((item) => item.id === id);

      if (fromIndex < 0 || targetIndex < 0 || targetIndex >= ordered.length) {
        return current;
      }

      const next = [...ordered];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(targetIndex, 0, moved);

      return next.map((item, index) => ({
        ...item,
        sortOrder: index,
      }));
    });
  }

  function handleDragStart(event: DragEvent<HTMLDivElement>, id: string) {
    setDraggedId(id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
    targetId: string
  ) {
    event.preventDefault();

    const sourceId =
      draggedId || event.dataTransfer.getData("text/plain") || null;

    setDraggedId(null);

    if (!sourceId || sourceId === targetId) return;

    const ordered = sortItems(draftItems);
    const targetIndex = ordered.findIndex((item) => item.id === targetId);

    if (targetIndex < 0) return;

    moveItemToIndex(sourceId, targetIndex);
    setNotice("Navigation order changed. Save Navigation to publish it.");
    setError("");
  }

  function handleDragEnd() {
    setDraggedId(null);
  }

  function updateVisibility(id: string, visible: boolean) {
    setDraftItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, isVisible: visible } : item
      )
    );

    setNotice("Visibility changed. Save Navigation to publish it.");
    setError("");
  }

  function discardChanges() {
    if (!dirty) return;

    setDraftItems(savedItems.map((item) => ({ ...item })));
    setNotice("Unsaved navigation changes were discarded.");
    setError("");
    closeEditor();
  }

  async function saveNavigation() {
    if (!dirty || saving) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const items = normalizeItems(sortItems(draftItems));

      const response = await fetch("/app/api/workspace/website/navigation", {
        method: "PUT",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success || !result.data) {
        throw new Error(
          result.message || "Unable to save Website navigation."
        );
      }

      const saved = sortItems(result.data.items);
      setData(result.data);
      setDraftItems(saved);
      setSavedItems(saved);
      setNotice("Navigation saved successfully.");
      closeEditor();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save Website navigation."
      );
    } finally {
      setSaving(false);
    }
  }

  function previewHref(item: NavigationItem) {
    return item.url || "/";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <div className="mx-auto flex min-h-[70vh] max-w-[1500px] items-center justify-center px-5">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            <span className="text-sm font-semibold text-slate-700">
              Loading Website navigation...
            </span>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <div className="mx-auto max-w-[900px] px-5 py-10">
          <section className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-red-50 p-3">
                <ShieldCheck className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Navigation unavailable</h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {error || "The Website navigation could not be loaded."}
                </p>
                <button
                  type="button"
                  onClick={() => void loadNavigation()}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Try again
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const navigationStatus =
    data.items.length > 0 ? "READY" : "NOT_CONNECTED";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-[1500px] px-5 py-6 lg:px-8 lg:py-8">
        <header className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950">
              <Menu className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                Website & Marketing
              </p>
              <h1 className="text-xl font-bold tracking-tight">
                Navigation & Menus
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/app/workspace/website"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Website & Marketing
            </Link>
            <Link
              href="/app/workspace"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <LayoutDashboard className="h-4 w-4" />
              Workspace
            </Link>
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </header>

        <section className="mb-6 rounded-3xl bg-slate-950 p-6 text-white shadow-sm lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                <Menu className="h-4 w-4" />
                Navigation Editor
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Build your website navigation
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Organize the customer-facing navigation for{" "}
                <span className="font-semibold text-white">
                  {data.website.name}
                </span>
                . Add Website pages or links, change their order, and control
                what visitors see.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold ring-1 ring-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Customer Workspace
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/20">
                <Check className="h-4 w-4" />
                {statusLabel(navigationStatus)}
              </span>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <div>
              <span className="font-semibold">Navigation error:</span>{" "}
              {error}
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              className="font-bold text-red-600 hover:text-red-800"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {notice && (
          <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <Check className="h-4 w-4 shrink-0" />
            {notice}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
          <section className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                    Main Navigation
                  </p>
                  <h3 className="mt-1 text-xl font-bold">Menu items</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Drag items to reorder them, or use the arrow controls.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!dirty || saving}
                    onClick={discardChanges}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Undo2 className="h-4 w-4" />
                    Discard
                  </button>
                  <button
                    type="button"
                    disabled={!dirty || saving}
                    onClick={() => void saveNavigation()}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {saving ? "Saving..." : "Save Navigation"}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <span className="font-semibold">Default navigation:</span>{" "}
                Home, Products, Request Quote and Contact. Additional
                customer-created pages appear here only when you add them.
              </div>

              {draftItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <Menu className="mx-auto h-8 w-8 text-slate-300" />
                  <h4 className="mt-3 font-bold text-slate-800">
                    No navigation items
                  </h4>
                  <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
                    Add a Website page or a custom link to start building the
                    customer-facing navigation.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortItems(draftItems).map((item, index, orderedItems) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(event) =>
                        handleDragStart(event, item.id)
                      }
                      onDragOver={handleDragOver}
                      onDrop={(event) => handleDrop(event, item.id)}
                      onDragEnd={handleDragEnd}
                      className={`group flex items-center gap-3 rounded-2xl border bg-white p-3 shadow-sm transition ${
                        draggedId === item.id
                          ? "border-emerald-400 opacity-50"
                          : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                      }`}
                    >
                      <button
                        type="button"
                        draggable={false}
                        aria-label={`Drag ${item.label}`}
                        title="Drag to reorder"
                        className="flex h-10 w-8 cursor-grab items-center justify-center rounded-lg text-slate-300 hover:bg-slate-50 hover:text-slate-500 active:cursor-grabbing"
                      >
                        <GripVertical className="h-5 w-5" />
                      </button>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        {item.pageId ? (
                          <Menu className="h-5 w-5 text-slate-600" />
                        ) : (
                          <Link2 className="h-5 w-5 text-slate-600" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-900">
                            {item.label}
                          </p>
                          {item.pageId && item.pageSlug && (
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                              Page
                            </span>
                          )}
                          {!item.pageId && (
                            <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600">
                              Link
                            </span>
                          )}
                          {item.isNew && (
                            <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                              Unsaved
                            </span>
                          )}
                        </div>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {item.pageTitle
                            ? `${item.pageTitle} · ${item.url}`
                            : item.url}
                        </p>
                      </div>

                      <div className="hidden items-center gap-1 sm:flex">
                        <button
                          type="button"
                          onClick={() => moveItem(item.id, -1)}
                          disabled={index === 0}
                          aria-label={`Move ${item.label} up`}
                          title="Move up"
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-25"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(item.id, 1)}
                          disabled={index === orderedItems.length - 1}
                          aria-label={`Move ${item.label} down`}
                          title="Move down"
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-25"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          updateVisibility(item.id, !item.isVisible)
                        }
                        aria-label={
                          item.isVisible
                            ? `Hide ${item.label}`
                            : `Show ${item.label}`
                        }
                        title={
                          item.isVisible
                            ? "Hide from navigation"
                            : "Show in navigation"
                        }
                        className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold sm:inline-flex ${
                          item.isVisible
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {item.isVisible ? (
                          <>
                            <Eye className="h-3.5 w-3.5" />
                            Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            Hidden
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        aria-label={`Edit ${item.label}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.label}`}
                        title="Remove from navigation"
                        className="rounded-xl border border-transparent p-2 text-slate-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={openAddPage}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Page
                </button>
                <button
                  type="button"
                  onClick={openAddLink}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  Add Link
                </button>
              </div>

              {editorOpen && (
                <form
                  onSubmit={saveEditor}
                  className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                        {editor.itemId ? "Edit navigation item" : "Add navigation item"}
                      </p>
                      <h4 className="mt-1 text-lg font-bold text-slate-900">
                        {editor.mode === "page"
                          ? "Website page"
                          : "Custom link"}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={closeEditor}
                      className="self-end rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-white hover:text-slate-800 sm:self-auto"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Type
                      </span>
                      <select
                        value={editor.mode}
                        onChange={(event) => {
                          const mode = event.target.value as "page" | "link";
                          setEditor((current) => ({
                            ...current,
                            mode,
                            pageId: mode === "page" ? current.pageId : "",
                            url:
                              mode === "link"
                                ? current.url.startsWith("http")
                                  ? current.url
                                  : "https://"
                                : current.url,
                          }));
                        }}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="page">Website Page</option>
                        <option value="link">Custom Link</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Navigation label
                      </span>
                      <input
                        value={editor.label}
                        onChange={(event) =>
                          setEditor((current) => ({
                            ...current,
                            label: event.target.value,
                          }))
                        }
                        placeholder="e.g. About Us"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      />
                    </label>

                    {editor.mode === "page" ? (
                      <>
                        <label className="block">
                          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                            Website page
                          </span>
                          <select
                            value={editor.pageId}
                            onChange={(event) =>
                              handlePageChange(event.target.value)
                            }
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                          >
                            <option value="">Select a Website page</option>
                            {editor.itemId &&
                              draftItems
                                .find((item) => item.id === editor.itemId)
                                ?.pageId &&
                              (() => {
                                const currentItem = draftItems.find(
                                  (item) => item.id === editor.itemId
                                );
                                const currentPageId = currentItem?.pageId;
                                if (!currentPageId) return null;

                                const exists = data.availablePages.some(
                                  (page) => page.id === currentPageId
                                );

                                if (exists) return null;

                                return (
                                  <option value={currentPageId}>
                                    {currentItem?.pageTitle ||
                                      currentItem?.pageSlug ||
                                      "Current Website page"}
                                  </option>
                                );
                              })()}
                            {data.availablePages.map((page) => (
                              <option key={page.id} value={page.id}>
                                {page.title}
                                {page.isHomePage ? " · Home" : ""}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                            Internal path
                          </span>
                          <input
                            value={editor.url}
                            onChange={(event) =>
                              setEditor((current) => ({
                                ...current,
                                url: event.target.value,
                              }))
                            }
                            placeholder="/about-us"
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                          />
                        </label>
                      </>
                    ) : (
                      <label className="block md:col-span-2">
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Link URL
                        </span>
                        <input
                          value={editor.url}
                          onChange={(event) =>
                            setEditor((current) => ({
                              ...current,
                              url: event.target.value,
                            }))
                          }
                          placeholder="https://example.com"
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                        />
                      </label>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-5">
                    <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={editor.isVisible}
                        onChange={(event) =>
                          setEditor((current) => ({
                            ...current,
                            isVisible: event.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Visible in navigation
                    </label>

                    <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={editor.openInNewTab}
                        onChange={(event) =>
                          setEditor((current) => ({
                            ...current,
                            openInNewTab: event.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      Open in new tab
                    </label>
                  </div>

                  <div className="mt-5 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeEditor}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      <Check className="h-4 w-4" />
                      {editor.itemId ? "Update Item" : "Add Item"}
                    </button>
                  </div>
                </form>
              )}

              <p className="mt-4 text-center text-xs text-slate-400">
                Changes are local until you select{" "}
                <span className="font-semibold">Save Navigation</span>.
              </p>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                    Live Preview
                  </p>
                  <h3 className="mt-1 font-bold">Website header</h3>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  <Monitor className="h-4 w-4 text-slate-600" />
                </div>
              </div>

              <div className="bg-slate-100 p-4">
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black tracking-tight text-slate-950">
                        {data.website.name}
                      </p>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">
                        Customer Website
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-400"
                      aria-label="Preview menu"
                    >
                      <Menu className="h-4 w-4" />
                    </button>
                  </div>

                  <nav className="flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-4">
                    {visibleItems.length === 0 ? (
                      <span className="text-xs font-medium text-slate-400">
                        No visible navigation items
                      </span>
                    ) : (
                      visibleItems.map((item, index) => (
                        <a
                          key={item.id}
                          href={previewHref(item)}
                          target={item.openInNewTab ? "_blank" : undefined}
                          rel={
                            item.openInNewTab
                              ? "noreferrer"
                              : undefined
                          }
                          onClick={(event) => event.preventDefault()}
                          className={`text-xs font-semibold ${
                            index === 0
                              ? "text-emerald-600"
                              : "text-slate-600"
                          } hover:text-emerald-600`}
                        >
                          {item.label}
                        </a>
                      ))
                    )}
                  </nav>

                  <div className="border-t border-slate-100 bg-slate-50 px-4 py-10">
                    <div className="mx-auto max-w-[220px] text-center">
                      <div className="mx-auto h-2 w-24 rounded bg-slate-200" />
                      <div className="mx-auto mt-3 h-2 w-40 rounded bg-slate-200" />
                      <div className="mx-auto mt-2 h-2 w-32 rounded bg-slate-200" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                Website Context
              </p>
              <h3 className="mt-2 text-lg font-bold">{data.website.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{data.website.slug}</p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Navigation</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {statusLabel(navigationStatus)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Menu</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {statusLabel(data.menu.isActive ? "READY" : "NOT_CONNECTED")}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Website binding
                  </span>
                  <span className="text-sm font-semibold text-emerald-700">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Visible items
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {visibleItems.length}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                Website Pages
              </p>
              <h3 className="mt-2 text-lg font-bold">
                Available to add
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Only CMS pages belonging to this customer Website are offered
                here.
              </p>

              <div className="mt-4 space-y-2">
                {data.availablePages.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    All Website pages are already represented in navigation.
                  </div>
                ) : (
                  data.availablePages.slice(0, 6).map((page) => (
                    <div
                      key={page.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {page.title}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          /{page.slug}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditor({
                            mode: "page",
                            itemId: null,
                            label: page.title,
                            url: pageUrl(page.slug),
                            pageId: page.id,
                            isVisible: true,
                            openInNewTab: false,
                          });
                          setEditorOpen(true);
                          setError("");
                          setNotice("");
                        }}
                        className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        Add
                      </button>
                    </div>
                  ))
                )}
              </div>

              {data.availablePages.length > 6 && (
                <p className="mt-3 text-center text-xs text-slate-400">
                  +{data.availablePages.length - 6} more Website pages available
                  through Add Page.
                </p>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold">Customer website only</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Navigation is loaded and saved through the authenticated
                    Website Workspace API. ROOTYM Admin navigation is never
                    copied into this customer Website.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <footer className="mt-8 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              <span className="font-semibold text-slate-700">
                ROOTYM Navigation & Menus
              </span>{" "}
              · {data.website.name}
            </span>
            <Link
              href="/app/workspace/website"
              className="inline-flex items-center gap-1.5 font-semibold hover:text-slate-900"
            >
              Website & Marketing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
