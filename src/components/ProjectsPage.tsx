"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { projectsList } from "@/constants/projectData";
import type { ProjectCategory } from "@/types/project";
import { useGlobalContext } from "@/context/globalContext";
import { Sun, Moon, ArrowUpRight, ArrowLeft } from "lucide-react";

type TabValue = ProjectCategory | "all";

const TABS: { label: string; value: TabValue }[] = [
  { label: "All", value: "all" },
  { label: "Full-stack", value: "fullstack" },
  { label: "Frontend", value: "frontend" },
];

export default function ProjectsPageClient() {
  const { darkTheme, setDarkTheme } = useGlobalContext();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  useEffect(() => {
    const cached = localStorage.getItem("darkTheme");
    if (cached) setDarkTheme(JSON.parse(cached));
    setMounted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkTheme", JSON.stringify(darkTheme));
  }, [darkTheme]);

  const bg = darkTheme ? "#212529" : "#f5f5f5";
  const text = darkTheme ? "whitesmoke" : "#212529";
  const cardBg = darkTheme ? "#2c3035" : "#ffffff";
  const border = darkTheme ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const mutedText = darkTheme ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";

  const filteredProjects =
    activeTab === "all"
      ? projectsList
      : projectsList.filter((p) => p.category === activeTab);

  if (!mounted) return null;

  return (
    <div
      style={{ backgroundColor: bg, color: text, minHeight: "100vh" }}
      className="transition-colors duration-300"
    >

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-6 md:pt-25 pb-8 flex flex-col justify-center items-center">
        {/* <p style={{ color: "var(--color-design)" }} className="text-xs font-semibold tracking-[0.2em] uppercase mb-4">
          Selected Work
        </p> */}
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-center">
          Projects
        </h1>
        <p style={{ color: mutedText }} className="mt-4 text-[8px] md:text-xs leading-relaxed text-center max-w-xl">
          Client work, personal builds, and experimental playgrounds — spanning full-stack apps, real-time systems, and creative UIs.
        </p>
      </section>

      {/* Tabs */}
      <div className="mx-auto px-6 mb-8 max-w-fit">
        <div
          style={{
            backgroundColor: darkTheme ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            border: `1px solid ${border}`,
          }}
          className="inline-flex rounded-full p-1 gap-1"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300"
                style={{ color: isActive ? "#fff" : mutedText }}
              >
                {isActive && (
                  <motion.span
                    layoutId="projects-tab-pill"
                    style={{ backgroundColor: "var(--color-design)" }}
                    className="absolute inset-0 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredProjects.map((project, i) => (
            <a
              key={i}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${border}`,
              }}
              className="group rounded-2xl overflow-hidden flex flex-col hover:scale-[1.015] transition-transform duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-black">
                <img
                  src={`/${project.desktopImage}`}
                  alt={project.name}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                <div
                  style={{ backgroundColor: "var(--color-design)" }}
                  className="absolute top-3 right-3 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <ArrowUpRight size={14} color="white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-3">
                <h2 className="text-base font-bold">{project.name}</h2>

                {/* Description points (skip last tech line, render it separately) */}
                <p style={{ color: mutedText }} className="text-xs leading-relaxed line-clamp-3">
                  {project.points.slice(0, -1).join(" ")}
                </p>

                {/* Tech badge */}
                <div
                  style={{
                    backgroundColor: darkTheme ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                    color: mutedText,
                  }}
                  className="mt-auto rounded-md px-2.5 py-1.5 text-[10px] leading-snug"
                >
                  {project.points[project.points.length - 1].replace(/^Tech\s*[-–]\s*/i, "")}
                </div>
              </div>
            </a>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        style={{ borderTop: `1px solid ${border}`, color: mutedText }}
        className="max-w-6xl mx-auto px-6 py-8 text-xs flex items-center justify-between"
      >
        <span>Lokesh Yadav</span>
        <Link href="/" className="hover:text-(--color-design) transition-colors">
          ← Back to portfolio
        </Link>
      </footer>
    </div>
  );
}
