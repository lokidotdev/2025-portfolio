"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
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
const THEME_KEY = "darkTheme";

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  // Start light so server and first client render agree; the stored preference
  // (or the OS setting) is applied in the effect below, after hydration.
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem(THEME_KEY);
    if (cached !== null) {
      setDarkTheme(cached === "true");
      return;
    }
    setDarkTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, String(darkTheme));
    document.documentElement.classList.toggle("dark", darkTheme);
  }, [darkTheme]);

  // Only show the loader once per session — a full reload of "/" should not replay it.
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem(LOADER_SEEN_KEY);
  });

  // React may replay a state updater, so the "loader already played" write
  // lives here rather than inside the setter.
  useEffect(() => {
    if (!isLoading) sessionStorage.setItem(LOADER_SEEN_KEY, "1");
  }, [isLoading]);

  const value = useMemo(
    () => ({ darkTheme, setDarkTheme, isLoading, setIsLoading }),
    [darkTheme, isLoading]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
