/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides Website-scoped navigation services for the
 *          authenticated customer workspace without exposing
 *          globally scoped Admin CMS navigation data.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import { requireWorkspaceAccess } from "../require-workspace-access";

export type WebsiteNavigationStatus =
  | "PREPARING"
  | "READY"
  | "NOT_CONNECTED";

export interface WebsiteNavigationOverview {
  workspace: { id: string; name: string; slug: string };
  owner: { id: string; name: string; email: string };
  subscription: {
    id: string | null;
    status: string | null;
    planName: string | null;
    billingInterval: string | null;
  };
  navigation: {
    status: WebsiteNavigationStatus;
    menuStatus: WebsiteNavigationStatus;
    websiteBindingStatus: WebsiteNavigationStatus;
  };
}

export interface WebsiteNavigationItem {
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
}

export interface WebsiteNavigationAvailablePage {
  id: string;
  title: string;
  slug: string;
  status: string;
  showInMenu: boolean;
  isHomePage: boolean;
}

export interface WebsiteNavigationData {
  website: { id: string; name: string; slug: string };
  menu: {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
  };
  items: WebsiteNavigationItem[];
  availablePages: WebsiteNavigationAvailablePage[];
}

export interface WebsiteNavigationUpdateItem {
  id: string;
  label: string;
  url: string;
  pageId?: string | null;
  parentId?: string | null;
  sortOrder: number;
  openInNewTab?: boolean;
  isVisible?: boolean;
}

const MAIN_NAVIGATION_CODE_PREFIX = "website-main-navigation";

const getMainNavigationCode = (websiteId: string) =>
  `${MAIN_NAVIGATION_CODE_PREFIX}-${websiteId}`;

const getPageUrl = (pageSlug: string) =>
  pageSlug === "home" ? "/" : `/${pageSlug}`;

/**
 * Resolve the Website belonging to the authenticated customer's
 * Tenant. The Website is never accepted from browser input.
 */
async function getAuthenticatedWebsite() {
  const { tenant } = await requireWorkspaceAccess();

  const website = await prisma.website.findUnique({
    where: { tenantId: tenant.id },
    select: { id: true, name: true, slug: true },
  });

  if (!website) {
    throw new Error("Customer Website is not configured.");
  }

  return website;
}

/**
 * Create the Website-owned Main Navigation and its four default
 * page links when it does not already exist.
 */
async function ensureMainNavigation(
  websiteId: string,
  websiteSlug: string
) {
  const code = getMainNavigationCode(websiteId);

  let menu = await prisma.menu.findUnique({
    where: { websiteId },
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
        include: {
          page: {
            select: { id: true, title: true, slug: true },
          },
        },
      },
    },
  });

  if (menu) return menu;

  const defaultPages = await prisma.cmsPage.findMany({
    where: {
      websiteId,
      slug: { in: ["home", "products", "request-quote", "contact"] },
    },
    select: { id: true, title: true, slug: true },
  });

  const pageBySlug = new Map(
    defaultPages.map((page) => [page.slug, page])
  );

  const defaultNavigation = [
    { slug: "home", label: "Home", sortOrder: 0 },
    { slug: "products", label: "Products", sortOrder: 1 },
    { slug: "request-quote", label: "Request Quote", sortOrder: 2 },
    { slug: "contact", label: "Contact", sortOrder: 3 },
  ];

  menu = await prisma.menu.create({
    data: {
      name: "Main Navigation",
      code,
      websiteId,
      isActive: true,
      items: {
        create: defaultNavigation
          .filter((item) => pageBySlug.has(item.slug))
          .map((item) => {
            const page = pageBySlug.get(item.slug)!;
            return {
              label: item.label,
              url: getPageUrl(page.slug),
              pageId: page.id,
              sortOrder: item.sortOrder,
              isVisible: true,
              openInNewTab: false,
            };
          }),
      },
    },
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
        include: {
          page: {
            select: { id: true, title: true, slug: true },
          },
        },
      },
    },
  });

  return menu;
}

/**
 * Returns the Website Navigation & Menus context for the
 * currently authenticated customer workspace.
 */
export async function getWebsiteNavigationOverview(): Promise<WebsiteNavigationOverview> {
  const { user, tenant } = await requireWorkspaceAccess();
  const currentSubscription = tenant.subscriptions[0] ?? null;

  const website = await prisma.website.findUnique({
    where: { tenantId: tenant.id },
    select: { id: true },
  });

  return {
    workspace: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
    },
    owner: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    subscription: {
      id: currentSubscription?.id ?? null,
      status: currentSubscription?.status ?? null,
      planName: currentSubscription?.plan?.name ?? null,
      billingInterval: currentSubscription?.billingInterval ?? null,
    },
    navigation: {
      status: website ? "READY" : "NOT_CONNECTED",
      menuStatus: website ? "READY" : "NOT_CONNECTED",
      websiteBindingStatus: website ? "READY" : "NOT_CONNECTED",
    },
  };
}

/**
 * Returns the authenticated Website's Main Navigation plus all
 * Website-owned CMS pages that are eligible to be added to it.
 */
export async function getWebsiteNavigation(): Promise<WebsiteNavigationData> {
  const website = await getAuthenticatedWebsite();
  const menu = await ensureMainNavigation(website.id, website.slug);

  const navigatedPageIds = new Set(
    menu.items
      .map((item) => item.pageId)
      .filter((id): id is string => Boolean(id))
  );

  const websitePages = await prisma.cmsPage.findMany({
    where: { websiteId: website.id },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      showInMenu: true,
      isHomePage: true,
    },
    orderBy: [
      { isHomePage: "desc" },
      { title: "asc" },
    ],
  });

  const availablePages = websitePages
    .filter((page) => !navigatedPageIds.has(page.id))
    .map((page) => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      status: String(page.status),
      showInMenu: page.showInMenu,
      isHomePage: page.isHomePage,
    }));

  return {
    website,
    menu: {
      id: menu.id,
      name: menu.name,
      code: menu.code,
      isActive: menu.isActive,
    },
    items: menu.items.map((item) => ({
      id: item.id,
      label: item.label,
      url: item.url,
      pageId: item.pageId,
      pageTitle: item.page?.title ?? null,
      pageSlug: item.page?.slug ?? null,
      sortOrder: item.sortOrder,
      parentId: item.parentId,
      openInNewTab: item.openInNewTab,
      isVisible: item.isVisible,
    })),
    availablePages,
  };
}

/**
 * Persists the complete desired Main Navigation state.
 *
 * Existing MenuItems are updated, newly added CMS-page/custom-link
 * items are created, and omitted existing MenuItems are removed from
 * the navigation only. Linked CmsPage records are never deleted.
 */
export async function updateWebsiteNavigation(
  items: WebsiteNavigationUpdateItem[]
): Promise<WebsiteNavigationData> {
  const website = await getAuthenticatedWebsite();
  const menu = await ensureMainNavigation(website.id, website.slug);

  const existingItems = await prisma.menuItem.findMany({
    where: { menuId: menu.id },
    select: { id: true, pageId: true },
  });

  const existingIds = new Set(existingItems.map((item) => item.id));
  const existingPageIds = new Set(
    existingItems
      .map((item) => item.pageId)
      .filter((id): id is string => Boolean(id))
  );

  const seenIds = new Set<string>();
  for (const item of items) {
    if (seenIds.has(item.id)) {
      throw new Error("Navigation contains duplicate item IDs.");
    }
    seenIds.add(item.id);
  }

  const pageIds = items
    .map((item) => item.pageId)
    .filter((id): id is string => Boolean(id));

  if (new Set(pageIds).size !== pageIds.length) {
    throw new Error("A CMS page cannot be added to navigation more than once.");
  }

  const pages =
    pageIds.length > 0
      ? await prisma.cmsPage.findMany({
          where: {
            id: { in: pageIds },
            websiteId: website.id,
          },
          select: { id: true, title: true, slug: true },
        })
      : [];

  const pagesById = new Map(pages.map((page) => [page.id, page]));

  if (pageIds.some((id) => !pagesById.has(id))) {
    throw new Error("Navigation contains a page from another Website.");
  }

  const newItems = items.filter((item) => !existingIds.has(item.id));

  for (const item of newItems) {
    if (item.pageId && existingPageIds.has(item.pageId)) {
      throw new Error("A CMS page is already present in navigation.");
    }
  }

  const parentIds = items
    .map((item) => item.parentId)
    .filter((id): id is string => Boolean(id));

  if (parentIds.some((id) => !existingIds.has(id))) {
    throw new Error("Navigation contains an invalid parent item.");
  }

  const sortOrders = items.map((item) => item.sortOrder);
  if (
    sortOrders.some(
      (value) => !Number.isInteger(value) || value < 0
    )
  ) {
    throw new Error("Navigation contains an invalid sort order.");
  }

  const expectedSortOrders = new Set(items.map((_, index) => index));
  const submittedSortOrders = new Set(sortOrders);

  if (
    expectedSortOrders.size !== submittedSortOrders.size ||
    [...expectedSortOrders].some(
      (value) => !submittedSortOrders.has(value)
    )
  ) {
    throw new Error("Navigation sort order must be sequential.");
  }

  if (items.some((item) => !item.label.trim())) {
    throw new Error("Navigation labels cannot be empty.");
  }

  const submittedIds = new Set(items.map((item) => item.id));
  const removedIds = existingItems
    .map((item) => item.id)
    .filter((id) => !submittedIds.has(id));

  await prisma.$transaction(async (tx) => {
    if (removedIds.length > 0) {
      await tx.menuItem.deleteMany({
        where: {
          menuId: menu.id,
          id: { in: removedIds },
        },
      });
    }

    for (const item of items.filter((entry) => existingIds.has(entry.id))) {
      await tx.menuItem.update({
        where: { id: item.id },
        data: {
          label: item.label.trim(),
          url: item.url.trim(),
          pageId: item.pageId ?? null,
          parentId: item.parentId ?? null,
          sortOrder: item.sortOrder,
          openInNewTab: item.openInNewTab ?? false,
          isVisible: item.isVisible ?? true,
        },
      });
    }

    if (newItems.length > 0) {
      await tx.menuItem.createMany({
        data: newItems.map((item) => ({
          menuId: menu.id,
          label: item.label.trim(),
          url: item.url.trim(),
          pageId: item.pageId ?? null,
          parentId: item.parentId ?? null,
          sortOrder: item.sortOrder,
          openInNewTab: item.openInNewTab ?? false,
          isVisible: item.isVisible ?? true,
        })),
      });
    }
  });

  return getWebsiteNavigation();
}

export default getWebsiteNavigationOverview;
