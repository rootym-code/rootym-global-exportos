/**
 * ============================================================
 * ROOTYM Customer Workspace Navigation
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the persistent, collapsible Customer Workspace
 *          navigation with the enabled R-CAPTAIN Insights destination.
 * ============================================================
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  Globe2,
  Home,
  LayoutDashboard,
  Link2,
  Menu,
  MessageCircle,
  Package,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { ComponentType } from "react";

type NavItem = {
  label: string;
  href?: string;
  icon?: ComponentType<{ className?: string }>;
  disabled?: boolean;
  children?: NavItem[];
};

type NavGroup = {
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
};

const navGroups: NavGroup[] = [
  {
    label: "BUSINESS",
    defaultOpen: true,
    items: [
      {
        label: "Products",
        icon: Package,
        href: "/app/workspace/products",
      },
      {
        label: "Inquiries",
        icon: Search,
        href: "/app/workspace/inquiries",
      },
      { label: "FollowUps", icon: Link2, href: "/app/workspace/followups" },
    ],
  },
  {
    label: "WEBSITE",
    defaultOpen: true,
    items: [
      {
        label: "Overview",
        href: "/app/workspace/website/overview",
        icon: LayoutDashboard,
      },

{
  label: "Pages & Content",
  icon: Menu,
  children: [
    {
      label: "All Pages",
      href: "/app/workspace/website/pages/all",
    },
    {
      label: "Create Page",
      href: "/app/workspace/website/pages/create",
    },
    {
      label: "Page Editor",
      disabled: true,
    },
  ],
},


      {
        label: "Media Library",
        href: "/app/workspace/website/media",
        icon: Package,
      },
      {
        label: "Navigation & Menus",
        href: "/app/workspace/website/navigation",
        icon: Menu,
      },
      {
        label: "Analytics & Integrations",
        href: "/app/workspace/website/analytics",
        icon: BarChart3,
      },
      {
        label: "Website Settings",
        href: "/app/workspace/website/settings",
        icon: Settings,
      },
    ],
  },
  {
    label: "INTEGRATIONS",
    defaultOpen: true,
    items: [
      { label: "Google", disabled: true },
      { label: "WhatsApp", href: "/app/workspace/integrations/whatsapp", icon: MessageCircle },
    ],
  },
  {
    label: "SETTINGS",
    defaultOpen: true,
    items: [
      {
        label: "Business",
        href: "/app/workspace/business",
        icon: Building2,
      },
      {
        label: "Website",
        href: "/app/workspace/website/settings",
        icon: Globe2,
      },
      {
        label: "Domain & Deployment",
        href: "/app/workspace/deployment",
        icon: Globe2,
      },
      {
        label: "Billing & Subscription",
        href: "/app/billing",
        icon: CreditCard,
      },
      { label: "Account", icon: Users, disabled: true },
      {
        label: "Team & Access",
        href: "/app/workspace/business/team-access",
        icon: Users,
      },
      {
        label: "Support Center",
        href: "/app/workspace/support",
        icon: Settings,
      },
    ],
  },
];

function isActive(pathname: string, href?: string) {
  if (!href) return false;

  if (href === "/app/billing") {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function itemMatchesSearch(
  item: NavItem,
  query: string
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  if (item.label.toLowerCase().includes(normalized)) return true;

  return Boolean(
    item.children?.some((child) => itemMatchesSearch(child, normalized))
  );
}

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(
      navGroups.map((group) => [group.label, group.defaultOpen ?? true])
    )
  );
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "Pages & Content": true,
  });

  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return navGroups;

    return navGroups
      .map((group) => ({
        ...group,
        items: group.items
          .filter((item) => itemMatchesSearch(item, query))
          .map((item) => ({
            ...item,
            children: item.children?.filter((child) =>
              itemMatchesSearch(child, query)
            ),
          })),
      }))
      .filter(
        (group) =>
          group.label.toLowerCase().includes(query) || group.items.length > 0
      );
  }, [searchQuery]);

  const toggleGroup = (label: string) => {
    setOpenGroups((current) => ({
      ...current,
      [label]: !current[label],
    }));
  };

  const toggleItem = (label: string) => {
    setOpenItems((current) => ({
      ...current,
      [label]: !current[label],
    }));
  };

  const handleNavigation = () => {
    setMobileOpen(false);
  };

  const navigation = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
        <Link
          href="/app/workspace"
          onClick={handleNavigation}
          className="min-w-0"
        >
          {collapsed ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
              R
            </div>
          ) : (
            <>
              <div className="truncate text-lg font-bold tracking-tight text-slate-950">
                ROOTYM
              </div>
              <div className="truncate text-xs font-medium text-slate-500">
                Customer Workspace
              </div>
            </>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={
            collapsed
              ? "Expand workspace navigation"
              : "Collapse workspace navigation"
          }
          className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {!collapsed && (
        <div className="border-b border-slate-100 px-3 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search workspace..."
              aria-label="Search workspace"
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear workspace search"
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <Link
          href="/app/workspace"
          onClick={handleNavigation}
          className={[
            "mb-1 flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition",
            pathname === "/app/workspace"
              ? "bg-slate-950 text-white"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
            collapsed ? "justify-center" : "gap-2",
          ].join(" ")}
          title={collapsed ? "Home" : undefined}
        >
          <Home className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Home</span>}
        </Link>

        <div className="mb-5">
          <Link
            href="/app/workspace/insights"
            onClick={handleNavigation}
            className={[
              "flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition",
              isActive(pathname, "/app/workspace/insights")
                ? "bg-slate-950 text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              collapsed ? "justify-center" : "gap-2",
            ].join(" ")}
            title={collapsed ? "R-CAPTAIN Insights" : undefined}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="flex-1">R-CAPTAIN INSIGHTS</span>}
          </Link>
        </div>

        {!collapsed ? (
          filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <div key={group.label} className="mb-4">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className="flex w-full items-center justify-between px-3 py-2 text-[11px] font-bold tracking-[0.14em] text-slate-400 transition hover:text-slate-700"
                  aria-expanded={openGroups[group.label]}
                >
                  <span>{group.label}</span>
                  {openGroups[group.label] ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>

                {openGroups[group.label] && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const hasChildren = Boolean(item.children?.length);
                      const itemActive = isActive(pathname, item.href);
                      const childActive = Boolean(
                        item.children?.some((child) =>
                          isActive(pathname, child.href)
                        )
                      );

                      if (hasChildren) {
                        return (
                          <div key={item.label}>
                            <button
                              type="button"
                              onClick={() => toggleItem(item.label)}
                              className={[
                                "flex w-full items-center rounded-lg px-3 py-2 text-sm transition",
                                childActive
                                  ? "font-semibold text-slate-950"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                              ].join(" ")}
                              aria-expanded={openItems[item.label]}
                            >
                              {item.icon && (
                                <item.icon className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
                              )}
                              <span className="flex-1 text-left">{item.label}</span>
                              {openItems[item.label] ? (
                                <ChevronDown className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronRight className="h-3.5 w-3.5" />
                              )}
                            </button>

                            {openItems[item.label] && (
                              <div className="ml-6 border-l border-slate-200 pl-2">
                                {item.children?.map((child) =>
                                  child.disabled ? (
                                    <div
                                      key={child.label}
                                      className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-400"
                                      title="This workspace destination is not a standalone route"
                                    >
                                      <span className="truncate">{child.label}</span>
                                      <span className="ml-auto pl-2 text-[9px] uppercase tracking-wide text-slate-300">
                                        In editor
                                      </span>
                                    </div>
                                  ) : (
                                    <Link
                                      key={child.label}
                                      href={child.href!}
                                      onClick={handleNavigation}
                                      className={[
                                        "block rounded-lg px-3 py-2 text-sm transition",
                                        isActive(pathname, child.href)
                                          ? "bg-slate-100 font-semibold text-slate-950"
                                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                                      ].join(" ")}
                                    >
                                      {child.label}
                                    </Link>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }

                      if (item.disabled) {
                        return (
                          <div
                            key={item.label}
                            className="flex cursor-default items-center rounded-lg px-3 py-2 text-sm text-slate-400"
                            title="This workspace module is being prepared"
                          >
                            {item.icon && (
                              <item.icon className="mr-2 h-4 w-4 shrink-0 text-slate-300" />
                            )}
                            <span className="truncate">{item.label}</span>
                            <span className="ml-auto pl-2 text-[9px] font-medium uppercase tracking-wide text-slate-300">
                              Preparing
                            </span>
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={item.label}
                          href={item.href!}
                          onClick={handleNavigation}
                          className={[
                            "flex items-center rounded-lg px-3 py-2 text-sm transition",
                            itemActive
                              ? "bg-slate-100 font-semibold text-slate-950"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                          ].join(" ")}
                        >
                          {item.icon && (
                            <item.icon className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
                          )}
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-lg px-3 py-5 text-center text-xs text-slate-400">
              No workspace items found.
            </div>
          )
        ) : (
          <div className="space-y-2">
            {navGroups.map((group) => (
              <button
                key={group.label}
                type="button"
                onClick={() => {
                  setCollapsed(false);
                  setOpenGroups((current) => ({
                    ...current,
                    [group.label]: true,
                  }));
                }}
                title={group.label}
                className="flex h-9 w-full items-center justify-center rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-950"
              >
                {group.label.charAt(0)}
              </button>
            ))}
          </div>
        )}
      </nav>

    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div
        className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:block"
        style={{ width: collapsed ? 76 : 260 }}
      >
        {navigation}
      </div>

      <div className="md:hidden">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
          <Link href="/app/workspace" className="text-sm font-bold tracking-tight">
            ROOTYM
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open workspace navigation"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600"
          >
            <Menu className="h-4 w-4" />
          </button>
        </header>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <button
              type="button"
              aria-label="Close workspace navigation"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-slate-950/30"
            />
            <aside className="relative z-10 h-full w-[290px] shadow-xl">
              {navigation}
            </aside>
          </div>
        )}
      </div>

      <main className="min-w-0">
        <div
          className="min-h-screen"
          style={{
            marginLeft: "var(--workspace-sidebar-offset, 0px)",
          }}
        >
          {children}
        </div>
      </main>

      <style jsx global>{`
        @media (min-width: 768px) {
          :root {
            --workspace-sidebar-offset: ${collapsed ? "76px" : "260px"};
          }
        }

        @media (max-width: 767px) {
          :root {
            --workspace-sidebar-offset: 0px;
          }
        }
      `}</style>
    </div>
  );
}