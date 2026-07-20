"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface FloatingContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const FloatingContext =
  createContext<FloatingContextValue | null>(null);

export function FloatingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isOpen,

      open: () => setIsOpen(true),

      close: () => setIsOpen(false),

      toggle: () =>
        setIsOpen((previous) => !previous),
    }),
    [isOpen]
  );

  return (
    <FloatingContext.Provider value={value}>
      {children}
    </FloatingContext.Provider>
  );
}

export function useFloating() {
  const context = useContext(FloatingContext);

  if (!context) {
    throw new Error(
      "useFloating must be used inside FloatingProvider."
    );
  }

  return context;
}

// END OF FILE