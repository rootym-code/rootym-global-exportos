/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Public Website Navigation API
 * Feature     : Tenant Website Navigation
 * Purpose     : Returns only the published, Website-owned Main
 *               Navigation for the requested public Website.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CmsPageStatus } from "@/lib/generated/prisma";

const DEFAULT_NAVIGATION = [
  {
    id: "default-home",
    label: "Home",
    url: "/",
    pageId: null,
    parentId: null,
    sortOrder: 0,
    openInNewTab: false,
    isVisible: true,
  },
  {
    id: "default-products",
    label: "Products",
    url: "/products",
    pageId: null,
    parentId: null,
    sortOrder: 1,
    openInNewTab: false,
    isVisible: true,
  },
  {
    id: "default-request-quote",
    label: "Request Quote",
    url: "/request-quote",
    pageId: null,
    parentId: null,
    sortOrder: 2,
    openInNewTab: false,
    isVisible: true,
  },
  {
    id: "default-contact",
    label: "Contact",
    url: "/contact",
    pageId: null,
    parentId: null,
    sortOrder: 3,
    openInNewTab: false,
    isVisible: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    const websiteSlug = request.nextUrl.searchParams.get("websiteSlug");

    if (!websiteSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Website slug is required.",
          code: "WEBSITE_SLUG_REQUIRED",
        },
        { status: 400 }
      );
    }

    const website = await prisma.website.findUnique({
      where: {
        slug: websiteSlug,
      },
      select: {
        id: true,
        slug: true,
        isActive: true,
      },
    });

    if (!website || !website.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Website not found.",
          code: "WEBSITE_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    const menu = await prisma.menu.findUnique({
      where: {
        websiteId: website.id,
      },
      select: {
        id: true,
        name: true,
        code: true,
        isActive: true,
        items: {
          where: {
            isVisible: true,
          },
          orderBy: [
            {
              sortOrder: "asc",
            },
            {
              createdAt: "asc",
            },
          ],
          select: {
            id: true,
            label: true,
            url: true,
            pageId: true,
            parentId: true,
            sortOrder: true,
            openInNewTab: true,
            isVisible: true,
            page: {
              select: {
                slug: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!menu || !menu.isActive) {
      return NextResponse.json({
        success: true,
        data: {
          website: {
            id: website.id,
            slug: website.slug,
          },
          menu: {
            id: null,
            name: "Main Navigation",
            code: "website-main-navigation",
          },
          items: DEFAULT_NAVIGATION,
        },
      });
    }

    const items = menu.items
      .filter((item) => {
        if (!item.pageId) return true;
        return item.page?.status === CmsPageStatus.PUBLISHED;
      })
      .map((item) => ({
        id: item.id,
        label: item.label,
        url:
          item.page?.slug === "home"
            ? "/"
            : item.url,
        pageId: item.pageId,
        parentId: item.parentId,
        sortOrder: item.sortOrder,
        openInNewTab: item.openInNewTab,
        isVisible: item.isVisible,
      }));

    return NextResponse.json({
      success: true,
      data: {
        website: {
          id: website.id,
          slug: website.slug,
        },
        menu: {
          id: menu.id,
          name: menu.name,
          code: menu.code,
        },
        items,
      },
    });
  } catch (error) {
    console.error("[Public Website Navigation] GET failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load Website navigation.",
        code: "WEBSITE_NAVIGATION_ERROR",
      },
      { status: 500 }
    );
  }
}
