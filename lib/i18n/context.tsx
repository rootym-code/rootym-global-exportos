"use client";

import React, { createContext, useContext, ReactNode } from "react";
import type { Locale } from "./config";

interface TranslationContextProps {
  locale: Locale;
  direction: "ltr" | "rtl";
  dictionary: any;
}

const TranslationContext = createContext<TranslationContextProps | null>(null);

export function TranslationProvider({
  children,
  locale,
  direction,
  dictionary,
}: {
  children: ReactNode;
  locale: Locale;
  direction: "ltr" | "rtl";
  dictionary: any;
}) {
  return (
    <TranslationContext.Provider value={{ locale, direction, dictionary }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }

  // t helper
  const t = (key: string) => {
    const keys = key.split(".");
    let value = context.dictionary;
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    return typeof value === "string" ? value : key;
  };

  return {
    t,
    locale: context.locale,
    direction: context.direction,
  };
}
