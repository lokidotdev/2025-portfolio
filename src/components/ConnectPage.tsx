"use client";

import { useGlobalContext } from "@/context/globalContext";
import Contact from "./contact";

export default function ConnectPageClient() {
  const { darkTheme } = useGlobalContext();

  return (
    <div
      className={`${
        darkTheme ? "dark-theme-bg" : "light-theme-bg"
      } min-h-screen w-full`}
    >
      <Contact />
    </div>
  );
}
