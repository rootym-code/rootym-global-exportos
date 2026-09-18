/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Layout
 * Feature     : Public Navigation
 * Purpose     : Displays the public navigation bar using
 *               CMS-managed company branding.
 * ============================================================
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useCompanySettings } from "@/lib/cms/company-settings";
import { useTranslation } from "@/lib/i18n/context";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/lib/i18n/config";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";

import { Button } from "@/components/ui/Button";

/* -------------------------------------------------------------------------- */
/*                              Navigation Items                              */
/* -------------------------------------------------------------------------- */

const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  {
    key: "certifications",
    href: "/certifications",
  },
  { key: "markets", href: "/markets" },
  { key: "contact", href: "/contact" },
];

interface TenantNavigationItem {
  id: string;
  label: string;
  url: string;
  pageId?: string | null;
  parentId?: string | null;
  sortOrder: number;
  openInNewTab?: boolean;
  isVisible: boolean;
}

const DEFAULT_TENANT_NAVIGATION: TenantNavigationItem[] = [
  {
    id: "default-home",
    label: "Home",
    url: "/",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "default-products",
    label: "Products",
    url: "/products",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: "default-request-quote",
    label: "Request Quote",
    url: "/request-quote",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: "default-contact",
    label: "Contact",
    url: "/contact",
    sortOrder: 3,
    isVisible: true,
  },
];

function classNames(
  ...classes: (string | boolean | undefined)[]
) {
  return classes.filter(Boolean).join(" ");
}

export interface NavbarWebsiteBranding {
  logoMediaUrl?: string | null;
  companyName?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  fontFamily?: string | null;
}

interface NavbarProps {
  websiteSlug?: string | null;
  websiteBranding?: NavbarWebsiteBranding | null;
}

const Navbar = ({
  websiteSlug: providedWebsiteSlug,
  websiteBranding,
}: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const [tenantNavigation, setTenantNavigation] = useState<TenantNavigationItem[]>(
    DEFAULT_TENANT_NAVIGATION
  );

  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  /**
   * ============================================================
   * Tenant Website Route Detection
   * ============================================================
   *
   * Tenant customer pages use:
   * /website/{websiteSlug}/{locale}/...
   *
   * Custom domains are internally rewritten to the same tenant
   * Website route while the browser pathname remains the custom
   * domain path. Therefore an explicitly supplied websiteSlug
   * takes precedence over pathname-based detection.
   *
   * Home, Products, Contact and Request Quote stay inside the tenant Website.
   * Other navigation items continue using their existing
   * global localized routes until tenant-specific routes exist.
   * ============================================================
   */
  const pathnameSegments = pathname
    ?.split("/")
    .filter(Boolean);

  const isTenantWebsite =
    Boolean(providedWebsiteSlug) ||
    pathnameSegments?.[0] === "website";

  const tenantWebsiteSlug =
    providedWebsiteSlug ??
    (pathnameSegments?.[0] === "website"
      ? pathnameSegments?.[1] ?? null
      : null);

  const tenantLocale =
    providedWebsiteSlug
      ? locale
      : pathnameSegments?.[0] === "website"
        ? pathnameSegments?.[2] ?? locale
        : locale;

  /**
   * ============================================================
   * Tenant Website Navigation
   * ============================================================
   *
   * Tenant Websites must never inherit the ROOTYM/global navigation.
   * The public Navbar reads the Website-owned navigation. Until the
   * public navigation endpoint is available, the four platform
   * default items remain as a safe tenant-only fallback.
   * ============================================================
   */
  useEffect(() => {
    if (!tenantWebsiteSlug) {
      setTenantNavigation(DEFAULT_TENANT_NAVIGATION);
      return;
    }

    let cancelled = false;

    const loadTenantNavigation = async () => {
      try {
        const response = await fetch(
          `/app/api/website/navigation?websiteSlug=${encodeURIComponent(
            tenantWebsiteSlug
          )}&locale=${encodeURIComponent(tenantLocale)}`,
          {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`Navigation request failed: ${response.status}`);
        }

        const result = await response.json();

        const items = Array.isArray(result?.data?.items)
          ? result.data.items
          : Array.isArray(result?.items)
            ? result.items
            : [];

        if (cancelled) return;

        const normalized = items
          .filter(
            (item: Partial<TenantNavigationItem>) =>
              item &&
              typeof item.id === "string" &&
              typeof item.label === "string" &&
              typeof item.url === "string" &&
              item.isVisible !== false
          )
          .sort(
            (a: TenantNavigationItem, b: TenantNavigationItem) =>
              a.sortOrder - b.sortOrder
          );

        setTenantNavigation(
          normalized.length > 0
            ? normalized
            : DEFAULT_TENANT_NAVIGATION
        );
      } catch {
        if (!cancelled) {
          setTenantNavigation(DEFAULT_TENANT_NAVIGATION);
        }
      }
    };

    void loadTenantNavigation();

    return () => {
      cancelled = true;
    };
  }, [tenantWebsiteSlug, tenantLocale]);

  const getNavigationHref = (href: string) => {
    if (tenantWebsiteSlug) {
      const normalizedHref = href.trim();

      if (
        normalizedHref.startsWith("http://") ||
        normalizedHref.startsWith("https://") ||
        normalizedHref.startsWith("mailto:") ||
        normalizedHref.startsWith("tel:")
      ) {
        return normalizedHref;
      }

      const tenantPath =
        !normalizedHref || normalizedHref === "/"
          ? ""
          : normalizedHref.startsWith("/")
            ? normalizedHref
            : `/${normalizedHref}`;

      /*
       * Custom-domain requests are internally rewritten by proxy.ts.
       * Keep the browser URL clean when the Navbar is rendered for
       * a custom-domain tenant.
       *
       * Example:
       *   Browser URL:  https://rootym.com/products
       *   Internal:     /website/rootym-agro/en/products
       */
      if (
        providedWebsiteSlug &&
        pathnameSegments?.[0] !== "website"
      ) {
        return tenantPath || "/";
      }

      /*
       * Internal Website Engine routes continue using the existing
       * tenant route structure.
       */
      return `/website/${tenantWebsiteSlug}/${tenantLocale}${tenantPath}`;
    }

    const localizedPath =
      href === "/"
        ? `/${locale}`
        : `/${locale}${href}`;

    return localizedPath;
  };

  /*
   * Company branding is loaded centrally through the shared
   * CMS company-settings hook.
   */
  const {
    companyName: globalCompanyName,
    logo: globalLogo,
  } = useCompanySettings();

  /*
   * Customer Website branding overrides the global company branding
   * only when the public Website explicitly provides branding values.
   */
  const resolvedCompanyName =
    websiteBranding?.companyName?.trim() ||
    globalCompanyName?.trim() ||
    "ROOTYM";

  const resolvedLogo =
    websiteBranding?.logoMediaUrl || globalLogo || null;

  const primaryColor =
    websiteBranding?.primaryColor || "#2E7D32";

  const secondaryColor =
    websiteBranding?.secondaryColor || "#43A047";

  const accentColor =
    websiteBranding?.accentColor || "#F1F6F3";

  const fontFamily =
    websiteBranding?.fontFamily?.trim() || undefined;

  const getNavLabel = (key: string) => {
    const translatedLabel = t(`navbar.${key}`);

    if (key !== "about") {
      return translatedLabel;
    }

    if (/rootym/i.test(translatedLabel)) {
      return translatedLabel.replace(
        /rootym/gi,
        resolvedCompanyName
      );
    }

    return `${translatedLabel} ${resolvedCompanyName}`;
  };

  const getTenantNavigationLabel = (item: TenantNavigationItem) => {
    const normalizedUrl = item.url.trim().toLowerCase();

    if (normalizedUrl === "/") {
      return t("navbar.home");
    }

    if (normalizedUrl === "/products") {
      return t("navbar.products");
    }

    if (normalizedUrl === "/request-quote") {
      return t("navbar.request_quote");
    }

    if (normalizedUrl === "/contact") {
      return t("navbar.contact");
    }

    return item.label;
  };

  const getTenantNavigationHref = (item: TenantNavigationItem) => {
    const href = item.url.trim();

    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return href;
    }

    return getNavigationHref(href);
  };

  const visibleTenantNavigation = tenantNavigation.filter(
    (item) => item.isVisible !== false && !item.parentId
  );

  const tenantRequestQuoteItem = tenantNavigation.find(
    (item) =>
      item.isVisible !== false &&
      item.url.trim().toLowerCase() === "/request-quote"
  );

  const handleLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLocale = e.target.value;

    if (!pathname) return;

    const segments = pathname.split("/");

    if (
      segments[1] === "website" &&
      segments.length >= 4
    ) {
      // /website/{websiteSlug}/{locale}/...
      segments[3] = newLocale;
    } else if (locales.includes(segments[1] as any)) {
      // /{locale}/...
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    const newPath =
      segments.join("/") || "/";

    router.push(newPath);
    router.refresh();
  };

  const menuRef = useRef<HTMLDivElement>(null);

  /* -------------------------------------------------------------------------- */
  /*                               Scroll Shadow                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const handleScroll = () => {
      setElevated(window.scrollY > 4);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                           Close Drawer Outside                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!mobileOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    window.addEventListener(
      "mousedown",
      handleClick
    );

    return () =>
      window.removeEventListener(
        "mousedown",
        handleClick
      );
  }, [mobileOpen]);

  /* -------------------------------------------------------------------------- */
  /*                                Focus Trap                                  */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!mobileOpen) return;

    const focusable =
      menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled])'
      ) ?? [];

    if (focusable.length > 0) {
      focusable[0].focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (!menuRef.current) return;

      const elements = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled])'
        )
      );

      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.key === "Tab") {
        if (
          e.shiftKey &&
          document.activeElement === first
        ) {
          e.preventDefault();
          last.focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === last
        ) {
          e.preventDefault();
          first.focus();
        }
      }

      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onKeyDown
      );
  }, [mobileOpen]);

  return (
    <motion.nav
      id="navbar"
      role="navigation"
      aria-label="Main navigation"
      initial={{
        y: -24,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={
        {
          "--website-primary-color": primaryColor,
          "--website-secondary-color": secondaryColor,
          "--website-accent-color": accentColor,
          ...(fontFamily
            ? { fontFamily }
            : {}),
        } as React.CSSProperties
      }
      className={classNames(
        "sticky top-0 z-40 w-full border-b border-gray-100 backdrop-blur-md transition-all duration-300",
        "h-20",
        elevated
          ? "bg-white/95 shadow-xl"
          : "bg-white/80 shadow-none"
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-stretch justify-between px-6 xl:max-w-[1280px]">
        {/* Brand */}

        <NextLink
          href={getNavigationHref("/")}
          aria-label={`${resolvedCompanyName} Home`}
          className="group flex select-none flex-col justify-center gap-0 focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{
                scale: 1.08,
                rotate: -4,
              }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 18,
              }}
              className={classNames(
                "flex h-8 w-8 items-center justify-center rounded-xl",
                "font-bold text-white shadow-md",
                !resolvedLogo &&
                  "bg-gradient-to-tr from-[var(--website-primary-color)] to-[var(--website-secondary-color)]"
              )}
            >
              {resolvedLogo ? (
                <img
                  src={resolvedLogo}
                  alt={`${resolvedCompanyName} Logo`}
                  className="h-8 w-8 rounded-xl object-contain"
                />
              ) : (
                <span className="select-none text-xl">
                  R
                </span>
              )}
            </motion.div>

            <motion.span
              whileHover={{ x: 2 }}
              transition={{
                duration: 0.2,
              }}
              className="text-2xl font-extrabold tracking-wider text-[var(--website-primary-color)]"
            >
              {resolvedCompanyName}
            </motion.span>
          </div>

          <span className="ml-10 mt-1 text-xs font-medium leading-tight text-gray-500">
            {t("navbar.platform_title")}
          </span>
        </NextLink>

        {/* Right Section */}

        <div className="ml-auto flex items-center gap-2 md:gap-4">
          {/* Desktop Navigation */}

          <div className="hidden items-center gap-1 lg:flex xl:gap-2">
            {(isTenantWebsite ? visibleTenantNavigation : NAV_ITEMS).map(
              (item, index) => {
                const itemKey = "key" in item ? item.key : item.id;
                const itemHref =
                  "href" in item
                    ? getNavigationHref(item.href)
                    : getTenantNavigationHref(item);
                const itemLabel =
                  "href" in item
                    ? getNavLabel(item.key)
                    : getTenantNavigationLabel(item);

                return (
                  <motion.div
                    key={itemHref + itemKey}
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.35,
                    }}
                  >
                    <NextLink
                      href={itemHref}
                      target={
                        "openInNewTab" in item && item.openInNewTab
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        "openInNewTab" in item && item.openInNewTab
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="relative rounded-xl px-3 py-2 text-base font-medium text-gray-700 transition-colors duration-200 hover:text-[var(--website-primary-color)] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                    >
                      <motion.span
                        whileHover={{ y: -1 }}
                        className="relative z-10"
                      >
                        {itemLabel}
                      </motion.span>

                      <motion.span
                        className="absolute inset-0 rounded-xl bg-[var(--website-accent-color)]"
                        initial={{
                          scale: 0.85,
                          opacity: 0,
                        }}
                        whileHover={{
                          scale: 1,
                          opacity: 1,
                        }}
                        transition={{
                          duration: 0.18,
                        }}
                      />
                    </NextLink>
                  </motion.div>
                );
              }
            )}

            {/* Language Switcher */}

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: NAV_ITEMS.length * 0.05,
                duration: 0.35,
              }}
              className="ml-2 flex items-center"
            >
              <div className="relative flex items-center rounded-xl bg-gray-50 px-2 py-1.5 transition-colors hover:bg-gray-100">
                <Globe className="mr-1 h-4 w-4 text-gray-500" />

                <select
                  value={locale}
                  onChange={handleLanguageChange}
                  className="cursor-pointer appearance-none bg-transparent pr-4 text-sm font-medium text-gray-700 focus:outline-none"
                  aria-label={t("common.language")}
                >
                  <option value="en">
                    {t("common.english")}
                  </option>

                  <option value="ar">
                    {t("common.arabic")}
                  </option>

                  <option value="si">
                    {t("common.sinhala")}
                  </option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center px-1 text-gray-500">
                  <svg
                    className="h-3 w-3 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414 1 1 0 11-1.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Request Quote Button */}

            {(!isTenantWebsite || tenantRequestQuoteItem) && (
              <motion.div
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                <NextLink href={getNavigationHref("/request-quote")}>
                  <Button
                    variant="primary"
                    className="ml-3 px-6 py-2 text-base shadow-sm"
                  >
                    {t("navbar.request_quote")}
                  </Button>
                </NextLink>
              </motion.div>
            )}
          </div>

          {/* Mobile Toggle */}

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center rounded-xl p-2 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300 lg:hidden"
            aria-label="Open Menu"
            aria-controls="navbar-mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            type="button"
          >
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{
                    rotate: -90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: 90,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <X className="h-7 w-7 text-[var(--website-primary-color)]" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{
                    rotate: 90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: -90,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <Menu className="h-7 w-7 text-[var(--website-primary-color)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="navbar-mobile-menu"
            role="dialog"
            aria-modal="true"
            ref={menuRef}
            className="fixed inset-0 z-50 flex lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}

            <motion.div
              className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setMobileOpen(false)
              }
            />

            {/* Drawer */}

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 340,
                damping: 32,
              }}
              className="relative flex h-full w-[75vw] min-w-[230px] max-w-xs flex-col bg-white px-6 py-6 shadow-2xl"
            >
              <button
                className="absolute right-3 top-3 rounded-full p-1.5 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                aria-label="Close Menu"
                type="button"
                onClick={() =>
                  setMobileOpen(false)
                }
              >
                <X className="h-6 w-6 text-[var(--website-primary-color)]" />
              </button>

              <NextLink
                href={getNavigationHref("/")}
                className="mb-8 mt-2 flex items-center gap-2"
                onClick={() =>
                  setMobileOpen(false)
                }
              >
                <div
                  className={classNames(
                    "flex h-8 w-8 items-center justify-center rounded-xl",
                    "font-extrabold text-white",
                    !resolvedLogo &&
                      "bg-gradient-to-tr from-[#2E7D32] to-[#43A047]"
                  )}
                >
                  {resolvedLogo ? (
                    <img
                      src={resolvedLogo}
                      alt={`${resolvedCompanyName} Logo`}
                      className="h-8 w-8 rounded-xl object-contain"
                    />
                  ) : (
                    "R"
                  )}
                </div>

                <span className="text-xl font-extrabold text-[var(--website-primary-color)]">
                  {resolvedCompanyName}
                </span>
              </NextLink>

              <nav
                className="mt-2 flex flex-col gap-2"
                aria-label="Mobile Menu"
              >
                {(isTenantWebsite ? visibleTenantNavigation : NAV_ITEMS).map(
                  (item, index) => {
                    const itemKey = "key" in item ? item.key : item.id;
                    const itemHref =
                      "href" in item
                        ? getNavigationHref(item.href)
                        : getTenantNavigationHref(item);
                    const itemLabel =
                      "href" in item
                        ? getNavLabel(item.key)
                        : getTenantNavigationLabel(item);

                    return (
                      <motion.div
                        key={itemHref + itemKey}
                        initial={{
                          opacity: 0,
                          x: -25,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: index * 0.05,
                        }}
                      >
                        <NextLink
                          href={itemHref}
                          target={
                            "openInNewTab" in item && item.openInNewTab
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            "openInNewTab" in item && item.openInNewTab
                              ? "noopener noreferrer"
                              : undefined
                          }
                          onClick={() =>
                            setMobileOpen(false)
                          }
                          className="block rounded-lg px-3 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-[var(--website-accent-color)] hover:text-[var(--website-primary-color)]"
                        >
                          {itemLabel}
                        </NextLink>
                      </motion.div>
                    );
                  }
                )}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.35,
                  }}
                  className="mt-2"
                >
                  <div className="relative flex items-center rounded-xl bg-gray-50 px-3 py-3 transition-colors hover:bg-gray-100">
                    <Globe className="mr-2 h-5 w-5 text-gray-500" />

                    <select
                      value={locale}
                      onChange={handleLanguageChange}
                      className="w-full cursor-pointer appearance-none bg-transparent text-base font-medium text-gray-700 focus:outline-none"
                      aria-label={t("common.language")}
                    >
                      <option value="en">
                        {t("common.english")}
                      </option>

                      <option value="ar">
                        {t("common.arabic")}
                      </option>

                      <option value="si">
                        {t("common.sinhala")}
                      </option>
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center px-1 text-gray-500">
                      <svg
                        className="h-4 w-4 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 01-1.414 1.414L10 10.586 6.707 7.293a1 1 0 01-1.414 1.414L10 14.586l4.707-4.707a1 1 0 010-1.414l-4-4a1 1 0 01-1.414 0l-4 4a1 1 0 010 1.414z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {(!isTenantWebsite || tenantRequestQuoteItem) && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.35,
                    }}
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    <NextLink
                      href={
                        isTenantWebsite && tenantRequestQuoteItem
                          ? getTenantNavigationHref(tenantRequestQuoteItem)
                          : getNavigationHref("/request-quote")
                      }
                      onClick={() =>
                        setMobileOpen(false)
                      }
                    >
                      <Button
                        variant="primary"
                        className="mt-5 w-full px-6 py-2 text-base"
                      >
                        {t("navbar.request_quote")}
                      </Button>
                    </NextLink>
                  </motion.div>
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;