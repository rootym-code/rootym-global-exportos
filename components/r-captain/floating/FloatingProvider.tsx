"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import FloatingButton from "./FloatingButton";
import FloatingPanel from "./FloatingPanel";
import WelcomeBubble from "./WelcomeBubble";

interface FloatingContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const FloatingContext = createContext<FloatingContextValue | null>(null);

interface FloatingProviderProps {
  children: ReactNode;
}

export default function FloatingProvider({
  children,
}: FloatingProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((previous) => !previous);
  }, []);

  const value = useMemo<FloatingContextValue>(
    () => ({
      isOpen,
      open,
      close,
      toggle,
    }),
    [isOpen, open, close, toggle]
  );

  return (
    <FloatingContext.Provider value={value}>
      {children}

      <WelcomeBubble />

      <FloatingButton />

      <FloatingPanel />
    </FloatingContext.Provider>
  );
}

export function useFloating() {
  const context = useContext(FloatingContext);

  if (!context) {
    throw new Error(
      "useFloating must be used within a FloatingProvider."
    );
  }

  return context;
}

 