"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/lib/i18n/Link";
import { useTranslation } from "@/lib/i18n/context";
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

function classNames(
  ...classes: (string | boolean | undefined)[]
) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [elevated, setElevated] = useState(false);

  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLocale = e.target.value;
  
    if (!pathname) return;
  
    const segments = pathname.split("/");
  
    if (locales.includes(segments[1] as any)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
  
    const newPath = segments.join("/") || "/";
  
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

        <Link
          href="/"
          aria-label="ROOTYM Home"
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
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2E7D32] to-[#43A047] font-bold text-white shadow-md"
            >
              <span className="select-none text-xl">
                R
              </span>
            </motion.div>

            <motion.span
              whileHover={{ x: 2 }}
              transition={{
                duration: 0.2,
              }}
              className="text-2xl font-extrabold tracking-wider text-[#2E7D32]"
            >
              ROOTYM
            </motion.span>
          </div>

          <span className="ml-10 mt-1 text-xs font-medium leading-tight text-gray-500">
            {t("navbar.platform_title")}
          </span>
        </Link>
                {/* Right Section */}

                <div className="ml-auto flex items-center gap-2 md:gap-4">
          {/* Desktop Navigation */}

          <div className="hidden items-center gap-1 lg:flex xl:gap-2">
            {NAV_ITEMS.map((item, index) => (
              <motion.div
                key={item.href}
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
                <Link
                  href={item.href}
                  className="relative rounded-xl px-3 py-2 text-base font-medium text-gray-700 transition-colors duration-200 hover:text-[#2E7D32] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                >
                  <motion.span
                    whileHover={{ y: -1 }}
                    className="relative z-10"
                  >
                    {t(`navbar.${item.key}`)}
                  </motion.span>

                  <motion.span
                    className="absolute inset-0 rounded-xl bg-[#F1F6F3]"
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
                </Link>
              </motion.div>
            ))}

            {/* Language Switcher */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_ITEMS.length * 0.05, duration: 0.35 }}
              className="ml-2 flex items-center"
            >
              <div className="relative flex items-center rounded-xl bg-gray-50 px-2 py-1.5 transition-colors hover:bg-gray-100">
                <Globe className="h-4 w-4 text-gray-500 mr-1" />
                <select
                  value={locale}
                  onChange={handleLanguageChange}
                  className="appearance-none bg-transparent text-sm font-medium text-gray-700 focus:outline-none pr-4 cursor-pointer"
                  aria-label={t("common.language")}
                >
                  <option value="en">{t("common.english")}</option>
                  <option value="ar">{t("common.arabic")}</option>
                  <option value="si">{t("common.sinhala")}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center px-1 text-gray-500">
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Request Quote Button */}

            <motion.div
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <Link href="/request-quote">
                <Button
                  variant="primary"
                  className="ml-3 px-6 py-2 text-base shadow-sm"
                >
                  {t("navbar.request_quote")}
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Toggle */}

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center rounded-xl p-2 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300 lg:hidden"
            aria-label="Open Menu"
            aria-controls="navbar-mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
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
                  <X className="h-7 w-7 text-[#2E7D32]" />
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
                  <Menu className="h-7 w-7 text-[#2E7D32]" />
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
              onClick={() => setMobileOpen(false)}
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
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-6 w-6 text-[#2E7D32]" />
              </button>

              <Link
                href="/"
                className="mb-8 mt-2 flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2E7D32] to-[#43A047] font-extrabold text-white">
                  R
                </div>

                <span className="text-xl font-extrabold text-[#2E7D32]">
                  ROOTYM
                </span>
              </Link>

              <nav
                className="mt-2 flex flex-col gap-2"
                aria-label="Mobile Menu"
              >
                {NAV_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.href}
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
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-[#F1F6F3] hover:text-[#2E7D32]"
                    >
                      {t(`navbar.${item.key}`)}
                    </Link>
                  </motion.div>
                ))}

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
                    <Globe className="h-5 w-5 text-gray-500 mr-2" />
                    <select
                      value={locale}
                      onChange={handleLanguageChange}
                      className="appearance-none bg-transparent text-base font-medium text-gray-700 focus:outline-none w-full cursor-pointer"
                      aria-label={t("common.language")}
                    >
                      <option value="en">{t("common.english")}</option>
                      <option value="ar">{t("common.arabic")}</option>
                      <option value="si">{t("common.sinhala")}</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center px-1 text-gray-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>

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
                  <Link
                    href="/request-quote"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button
                      variant="primary"
                      className="mt-5 w-full px-6 py-2 text-base"
                    >
                      {t("navbar.request_quote")}
                    </Button>
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.nav>
  );
};

export default Navbar;

 