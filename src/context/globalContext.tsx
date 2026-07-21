"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export interface GlobalContextValue {
  darkTheme: boolean;
  setDarkTheme: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const GlobalContext = createContext<GlobalContextValue | null>(null);

export function useGlobalContext(): GlobalContextValue {
  const ctx = useContext(GlobalContext);
  if (!ctx) {
    throw new Error("useGlobalContext must be used within GlobalContextProvider");
  }
  return ctx;
}

const LOADER_SEEN_KEY = "loaderSeen";

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [darkTheme, setDarkTheme] = useState(false);
  // Only show the loader once per session — a full reload of "/" should not replay it.
  const [isLoading, setIsLoadingState] = useState(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem(LOADER_SEEN_KEY);
  });

  const setIsLoading: Dispatch<SetStateAction<boolean>> = (value) => {
    setIsLoadingState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      if (!next) sessionStorage.setItem(LOADER_SEEN_KEY, "1");
      return next;
    });
  };

  return (
    <GlobalContext.Provider
      value={{ darkTheme, setDarkTheme, isLoading, setIsLoading }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
