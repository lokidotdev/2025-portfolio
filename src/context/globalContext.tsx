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
}

export const GlobalContext = createContext<GlobalContextValue | null>(null);

export function useGlobalContext(): GlobalContextValue {
  const ctx = useContext(GlobalContext);
  if (!ctx) {
    throw new Error("useGlobalContext must be used within GlobalContextProvider");
  }
  return ctx;
}

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

  const value = useMemo(
    () => ({ darkTheme, setDarkTheme }),
    [darkTheme]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
