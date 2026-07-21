"use client";

import { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getProjectsForPage } from "@/constants/projectData";
import type { Project, ProjectCategory } from "@/types/project";
import { useGlobalContext } from "@/context/globalContext";
import HeroNavbar from "./HeroNavbar";
import ProximityText from "./ui/ProximityText";

type Filter = "all" | ProjectCategory;

const tabs: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Frontend", value: "frontend" },
  { label: "Fullstack", value: "fullstack" },
];

const Row = ({
  project,
  index,
  darkTheme,
  onHoverStart,
  onHoverEnd,
  onMove,
}: {
  project: Project;
  index: number;
  darkTheme: boolean;
  onHoverStart: (project: Project) => void;
  onHoverEnd: () => void;
  onMove: (x: number, y: number) => void;
}) => {
  const subtle = darkTheme ? "text-white/60" : "text-[#212529]/60";
  const border = darkTheme ? "border-white/15" : "border-[#212529]/15";

  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.15, ease: "easeIn" } }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 40,
        delay: index * 0.03,
      }}
      onMouseEnter={() => onHoverStart(project)}
      onMouseLeave={onHoverEnd}
      onMouseMove={(e) => onMove(e.clientX, e.clientY)}
      className={`group grid grid-cols-1 gap-8 border-t ${border} py-12 md:grid-cols-[1fr_2fr] md:gap-16`}
    >
      {/* Left — name + category */}
      <div className="flex flex-col gap-3">
        <span className="flex items-center gap-2 text-2xl font-thin leading-[110%] tracking-[-0.02em] transition-colors group-hover:text-(--color-design) md:text-3xl">
          {project.name}
          <ArrowUpRight
            size={20}
            strokeWidth={1.5}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          />
        </span>
        <span className={`text-sm ${subtle}`}>[ {project.category} ]</span>
      </div>

      {/* Right — points */}
      <ul className="flex flex-col gap-2">
        {project.points.map((point, idx) => (
          <li key={idx} className={`flex gap-3 leading-[140%] ${subtle}`}>
            <span className="text-(--color-design)">/</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </motion.a>
  );
};

export default function ProjectsPageClient() {
  const { darkTheme } = useGlobalContext();
  const [filter, setFilter] = useState<Filter>("all");
  const [hovered, setHovered] = useState<Project | null>(null);

  // Raw cursor position, smoothed with a spring so the image trails the cursor.
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { stiffness: 260, damping: 30, mass: 0.5 };
  const imageX = useSpring(cursorX, springConfig);
  const imageY = useSpring(cursorY, springConfig);

  const handleMove = (x: number, y: number) => {
    cursorX.set(x);
    cursorY.set(y);
  };

  const projects = useMemo(() => getProjectsForPage("projects"), []);
  const filtered = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.category === filter),
    [projects, filter]
  );

  const text = darkTheme ? "text-white" : "text-[#212529]";
  const subtle = darkTheme ? "text-white/60" : "text-[#212529]/60";
  const border = darkTheme ? "border-white/15" : "border-[#212529]/15";

  return (
    <div
      className={`${
        darkTheme ? "dark-theme-bg" : "light-theme-bg"
      } ${text} min-h-screen w-full`}
    >
      <HeroNavbar />

      {/* Cursor-following project preview */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key={hovered.name}
            style={{
              left: imageX,
              top: imageY,
              x: "-50%",
              y: "-50%",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-none fixed z-50 hidden aspect-video w-[24rem] overflow-hidden rounded-xl shadow-2xl md:block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/${hovered.desktopImage}`}
              alt={hovered.name}
              className="h-full w-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto w-full max-w-400 px-6 py-24 md:px-16 md:py-32">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`mb-6 text-lg ${subtle}`}
          >
            // Selected work
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hero-heading w-full text-6xl font-thin italic leading-[100%] tracking-[-0.04em] md:text-[8vw]"
          >
            <ProximityText
              text="Projects"
              maxDistance={200}
              minWeight={100}
              maxWeight={700}
            />
          </motion.h1>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex flex-wrap items-center gap-6 text-lg">
          {tabs.map((tab) => {
            const active = filter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex items-center gap-1 tracking-wide transition-colors ${
                  active
                    ? "text-(--color-design)"
                    : `${subtle} hover:text-(--color-design)`
                }`}
              >
                <span className="relative inline-flex h-[1em] w-[0.6em] items-center justify-center align-middle">
                  <AnimatePresence>
                    {active && (
                      <motion.span
                        layoutId="tab-bracket-left"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        [
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                {tab.label}
                <span className="relative inline-flex h-[1em] w-[0.6em] items-center justify-center align-middle">
                  <AnimatePresence>
                    {active && (
                      <motion.span
                        layoutId="tab-bracket-right"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        ]
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>
            );
          })}
          <span className={`ml-auto text-sm ${subtle}`}>
            {filtered.length.toString().padStart(2, "0")} projects
          </span>
        </div>

        {/* List */}
        <motion.div layout className={`border-b ${border}`}>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <Row
                key={project.name}
                project={project}
                index={index}
                darkTheme={darkTheme}
                onHoverStart={setHovered}
                onHoverEnd={() => setHovered(null)}
                onMove={handleMove}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
