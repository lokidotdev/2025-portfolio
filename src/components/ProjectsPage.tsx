"use client";

import { useId, useMemo, useState, useSyncExternalStore } from "react";
import { AnimatePresence, MotionConfig, m } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { getProjectsForPage } from "@/constants/projectData";
import type { Project, ProjectCategory } from "@/types/project";
import { useGlobalContext } from "@/context/globalContext";
import { themeTokens, type ThemeTokens } from "@/lib/theme";
import { siteConfig } from "@/lib/site";
import SectionHeading from "./ui/SectionHeading";
import {
  HoverCorners,
  MetaLine,
  NewTabHint,
  Ribbon,
  focusRing,
  splitPoints,
} from "./projects/shared";

type Filter = "all" | ProjectCategory;

// Each filter says what it holds, so "100% AI Slop" reads as a label and not a joke
// the visitor has to decode.
const tabs: { label: string; value: Filter; description: string }[] = [
  {
    label: "All",
    value: "all",
    description: "Showing everything. Filter by the kind of work you're hiring for.",
  },
  {
    label: "Frontend",
    value: "frontend",
    description: "Interfaces, motion and 3D on the web.",
  },
  {
    label: "Fullstack",
    value: "fullstack",
    description: "Products with a backend: accounts, payments, real-time play and data.",
  },
  {
    label: "100% AI Slop",
    value: "aiSlop",
    description: "Built mostly by prompting AI. Shipped and playable, and labeled honestly.",
  },
];

const FILTER_PARAM = "type";
const isFilter = (v: string | null): v is Filter => tabs.some((t) => t.value === v);

// Read-only view of ?type= in the address bar; null while prerendering keeps the page static.
const subscribeToUrl = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};
const filterFromUrl = () => new URLSearchParams(window.location.search).get(FILTER_PARAM);

const MAX_TAGS = 5;

const Bracket = ({ side, show }: { side: "left" | "right"; show: boolean }) => (
  <span
    aria-hidden
    className="relative inline-flex h-[1em] w-[0.6em] items-center justify-center align-middle"
  >
    <AnimatePresence>
      {show && (
        <m.span
          layoutId={`tab-bracket-${side}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {side === "left" ? "[" : "]"}
        </m.span>
      )}
    </AnimatePresence>
  </span>
);

const ProjectCard = ({
  project,
  number,
  priority,
  darkTheme,
  tokens,
}: {
  project: Project;
  number: number;
  priority: boolean;
  darkTheme: boolean;
  tokens: ThemeTokens;
}) => {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const { summary, details, tech } = splitPoints(project.points);
  const extraTags = tech.length - MAX_TAGS;

  return (
    <m.li
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
    >
      <article className="group relative isolate flex flex-col gap-5 md:gap-6">
        <HoverCorners darkTheme={darkTheme} />

        <div className={`relative aspect-video w-full overflow-hidden ${tokens.placeholder}`}>
          <Image
            src={`/${project.desktopImage}`}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            priority={priority}
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          {project.badge && <Ribbon text={project.badge} />}
        </div>

        <div className="flex flex-col gap-3 md:gap-4">
          <MetaLine project={project} number={number} tokens={tokens} />

          <h2 className="text-xl font-medium leading-[110%] tracking-[-0.02em] transition-colors group-hover:text-(--color-design) md:text-3xl">
            {/* The whole card is the link (stretched ::after); the details toggle sits above it. */}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-solid focus-visible:after:outline-2 focus-visible:after:outline-offset-8 focus-visible:after:outline-(--color-brand)"
            >
              {project.name}
              <NewTabHint />
            </a>
          </h2>

          <p className={`text-sm font-light leading-[150%] md:text-base ${tokens.subtle}`}>
            {summary}
          </p>

          {tech.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1" aria-label="Tech stack">
              {tech.slice(0, MAX_TAGS).map((t, i, shown) => (
                // Keep the "+N" glued to the last tag so it never wraps alone.
                <li key={t} className="whitespace-nowrap text-xs md:text-sm">
                  <span className={tokens.subtle}>[ {t} ]</span>
                  {i === shown.length - 1 && extraTags > 0 && (
                    <span className={`ml-4 ${tokens.faint}`}>+{extraTags} more</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {details.length > 0 && (
            <div className="relative z-10">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={detailsId}
                onClick={() => setOpen((o) => !o)}
                className={`-ml-1 inline-flex min-h-11 items-center gap-1.5 px-1 text-xs tracking-wide transition-colors hover:text-(--color-design) md:min-h-8 md:text-sm ${tokens.subtle} ${focusRing}`}
              >
                {open ? "Hide details" : `How it's built (${details.length})`}
                <ChevronDown
                  aria-hidden
                  size={14}
                  strokeWidth={1.75}
                  className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <m.ul
                    id={detailsId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-col gap-2 overflow-hidden"
                  >
                    {details.map((point) => (
                      <li
                        key={point}
                        className={`flex gap-3 pt-2 text-sm font-light leading-[150%] md:text-base ${tokens.subtle}`}
                      >
                        <span aria-hidden className="text-(--color-design)">/</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </m.ul>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </article>
    </m.li>
  );
};

export default function ProjectsPageClient() {
  const { darkTheme } = useGlobalContext();
  const tokens = themeTokens(darkTheme);
  // Deep links: /projects?type=fullstack opens pre-filtered, and the URL follows the
  // filter so reloads and shared links keep it.
  const urlFilter = useSyncExternalStore(subscribeToUrl, filterFromUrl, () => null);
  const [chosen, setChosen] = useState<Filter | null>(null);
  const filter: Filter = chosen ?? (isFilter(urlFilter) ? urlFilter : "all");

  const selectFilter = (next: Filter) => {
    setChosen(next);
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete(FILTER_PARAM);
    else url.searchParams.set(FILTER_PARAM, next);
    window.history.replaceState(null, "", url);
  };

  const projects = useMemo(() => getProjectsForPage("projects"), []);
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: projects.length, frontend: 0, fullstack: 0, aiSlop: 0 };
    for (const p of projects) for (const cat of p.categories) c[cat]++;
    return c;
  }, [projects]);

  // Numbers stay tied to a project's place in the full list, so "07" means the same
  // project under every filter.
  const visible = useMemo(
    () =>
      projects
        .map((project, i) => ({ project, number: i + 1 }))
        .filter(({ project }) => filter === "all" || project.categories.includes(filter)),
    [projects, filter]
  );

  const activeTab = tabs.find((t) => t.value === filter) ?? tabs[0];

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`${darkTheme ? "dark-theme-bg" : "light-theme-bg"} ${tokens.text} min-h-screen w-full`}
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 md:px-16 md:py-32">
          <SectionHeading
            title="Projects"
            tagline="Everything I've built and shipped. Each one is live, so try it."
            subtle={tokens.subtle}
            variant="page"
            className="mb-12 md:mb-20"
          />

          {/* Filters */}
          <div className={`mb-12 border-b pb-5 md:mb-20 md:pb-6 ${tokens.border}`}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm md:gap-6 md:text-lg">
              <div role="group" aria-label="Filter projects by type" className="contents">
                {tabs.map((tab) => {
                  const active = filter === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => selectFilter(tab.value)}
                      className={`flex min-h-11 items-center gap-1 tracking-wide transition-colors md:min-h-0 ${focusRing} ${
                        active ? "text-(--color-design)" : `${tokens.subtle} hover:text-(--color-design)`
                      }`}
                    >
                      <Bracket side="left" show={active} />
                      {tab.label}
                      <sup className={`ml-0.5 text-[10px] tabular-nums md:text-xs ${active ? "" : tokens.faint}`}>
                        {counts[tab.value]}
                      </sup>
                      <Bracket side="right" show={active} />
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1 text-xs sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 md:text-sm">
              <p className={tokens.subtle}>{activeTab.description}</p>
              <p aria-live="polite" className={`shrink-0 tabular-nums ${tokens.faint}`}>
                {filter === "all"
                  ? `${projects.length} projects`
                  : `${visible.length} of ${projects.length} projects`}
              </p>
            </div>
          </div>

          {/* Grid */}
          {visible.length > 0 ? (
            <ul className="grid grid-cols-1 gap-x-16 gap-y-16 md:grid-cols-2 md:gap-y-24">
              <AnimatePresence mode="popLayout">
                {visible.map(({ project, number }, i) => (
                  <ProjectCard
                    key={project.name}
                    project={project}
                    number={number}
                    priority={i < 2}
                    darkTheme={darkTheme}
                    tokens={tokens}
                  />
                ))}
              </AnimatePresence>
            </ul>
          ) : (
            <div className="flex flex-col items-start gap-4 py-16">
              <p className="text-lg md:text-2xl">Nothing under {activeTab.label} yet.</p>
              <button
                type="button"
                onClick={() => selectFilter("all")}
                className={`inline-flex min-h-11 items-center gap-2 text-sm text-(--color-design) md:text-base ${focusRing}`}
              >
                Show all {projects.length} projects
                <ArrowRight aria-hidden size={16} strokeWidth={1.5} />
              </button>
            </div>
          )}

          {/* Next step once they've seen the work */}
          <div
            className={`mt-24 flex flex-col gap-6 border-t pt-12 md:mt-32 md:flex-row md:items-end md:justify-between md:pt-16 ${tokens.border}`}
          >
            <div className="flex flex-col gap-2">
              <p className="text-2xl font-medium tracking-[-0.02em] md:text-4xl">
                Have a project in mind?
              </p>
              <p className={`text-sm md:text-base ${tokens.subtle}`}>
                Tell me what you&apos;re building and I&apos;ll tell you how I&apos;d approach it.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/connect"
                className={`inline-flex min-h-11 items-center text-sm transition-colors hover:text-(--color-design) md:text-base ${tokens.subtle} ${focusRing}`}
              >
                Send a message instead
              </Link>
              <a
                href={siteConfig.booking}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex min-h-12 items-center gap-3 bg-(--color-brand-deep) px-6 py-3 text-sm font-medium text-on-dark transition hover:brightness-90 md:text-base ${focusRing}`}
              >
                Book a call
                <ArrowUpRight
                  aria-hidden
                  size={18}
                  strokeWidth={1.75}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
                <NewTabHint />
              </a>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
