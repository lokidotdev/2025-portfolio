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

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [darkTheme, setDarkTheme] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <GlobalContext.Provider
      value={{ darkTheme, setDarkTheme, isLoading, setIsLoading }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
