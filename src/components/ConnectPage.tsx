"use client";

import { useEffect } from "react";
import { useGlobalContext } from "@/context/globalContext";
import Contact from "@/components/contact";
import Link from "next/link";
import { ArrowLeft, Sun, Moon } from "lucide-react";

export default function ConnectPageClient() {
  const { darkTheme, setDarkTheme } = useGlobalContext();

  useEffect(() => {
    const cached = localStorage.getItem("darkTheme");
    if (cached) setDarkTheme(JSON.parse(cached));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkTheme", JSON.stringify(darkTheme));
  }, [darkTheme]);

  const border = darkTheme ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  return (
    <div className={`${darkTheme ? "dark-theme-bg" : "light-theme-bg"} min-h-screen`}>


      <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 56px)" }}>
        <Contact />
      </div>
    </div>
  );
}
