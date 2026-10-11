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
import { NewTabHint, categoryList, focusRing, hostOf, pad, splitPoints } from "./projects/shared";

/*
 * Works: an index, not a gallery.
 * Visitors come to judge range first and depth second, so every project fits in one
 * scannable list (number, name, proof, type) and the screenshot + "how it's built"
 * live in a preview beside it. Desktop: hover/focus/click a row to swap the sticky
 * preview, so the list never scrolls away. Mobile: the row expands in place.
 */

type Filter = "all" | ProjectCategory;

// Only the filter whose name doesn't explain itself gets a line.
const filters: { label: string; value: Filter; note?: string }[] = [
  { label: "All", value: "all" },
  { label: "Frontend", value: "frontend" },
  { label: "Fullstack", value: "fullstack" },
  {
    label: "AI Slop",
    value: "aiSlop",
    note: "Built mostly by prompting AI. Shipped, playable, and labeled honestly.",
  },
];

// ?type= keeps the old /projects deep links working.
const FILTER_PARAM = "type";
const isFilter = (v: string | null): v is Filter => filters.some((f) => f.value === v);
const subscribeToUrl = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};
const filterFromUrl = () => new URLSearchParams(window.location.search).get(FILTER_PARAM);

const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

const MAX_TAGS = 6;

// The active filter's [ ] slide between tabs via a shared layoutId.
const Bracket = ({ side, show }: { side: "left" | "right"; show: boolean }) => (
  <span
    aria-hidden
    className="relative inline-flex h-[1em] w-[0.6em] items-center justify-center align-middle"
  >
    <AnimatePresence>
      {show && (
        <m.span
          layoutId={`works-bracket-${side}`}
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

const ProofChip = ({ text, tokens }: { text: string; tokens: ThemeTokens }) => (
  <span
    className={`inline-flex shrink-0 items-center whitespace-nowrap border px-2 py-0.5 text-xs tracking-wide ${tokens.border} ${tokens.subtle}`}
  >
    {text}
  </span>
);

/** Screenshot, summary, stack, build notes and the live link. Shared by the pane and the accordion. */
const ProjectDetail = ({
  project,
  tokens,
  eager,
  showImage = true,
}: {
  project: Project;
  tokens: ThemeTokens;
  eager?: boolean;
  showImage?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const notesId = useId();
  const { summary, details, tech } = splitPoints(project.points);
  const extra = tech.length - MAX_TAGS;

  return (
    <div className="flex flex-col gap-5">
      {showImage && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden
          className={`group/img relative block aspect-video max-h-[40vh] w-full overflow-hidden ${tokens.placeholder}`}
        >
          <Image
            src={`/${project.desktopImage}`}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover/img:scale-[1.02] motion-reduce:transition-none"
          />
        </a>
      )}

      <p className={`text-sm font-light leading-[150%] md:text-base ${tokens.subtle}`}>{summary}</p>

      {tech.length > 0 && (
        <ul className="flex flex-wrap gap-x-3 gap-y-1.5" aria-label="Tech stack">
          {tech.slice(0, MAX_TAGS).map((t, i, shown) => (
            <li key={t} className="whitespace-nowrap text-xs md:text-sm">
              <span className={tokens.subtle}>[ {t} ]</span>
              {i === shown.length - 1 && extra > 0 && (
                <span className={`ml-3 ${tokens.faint}`}>+{extra} more</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {details.length > 0 && (
        <div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={notesId}
            onClick={() => setOpen((o) => !o)}
            className={`-ml-1 inline-flex min-h-11 items-center gap-1.5 px-1 text-xs tracking-wide transition-colors hover:text-(--color-design) md:min-h-8 md:text-sm ${tokens.subtle} ${focusRing}`}
          >
            {open ? "Hide build notes" : `How it's built (${details.length})`}
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
                id={notesId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col gap-2 overflow-hidden"
              >
                {details.map((point) => (
                  <li
                    key={point}
                    className={`flex gap-3 pt-2 text-sm font-light leading-[150%] ${tokens.subtle}`}
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

      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`group/visit inline-flex min-h-11 w-fit items-center gap-2 border-b border-current pb-0.5 text-sm font-medium transition-colors hover:text-(--color-design) md:text-base ${focusRing}`}
      >
        Visit {hostOf(project.link)}
        <ArrowUpRight
          aria-hidden
          size={16}
          strokeWidth={1.75}
          className="transition-transform duration-300 group-hover/visit:-translate-y-0.5 group-hover/visit:translate-x-0.5"
        />
        <NewTabHint />
      </a>
    </div>
  );
};

export default function WorksPage() {
  const { darkTheme } = useGlobalContext();
  const tokens = themeTokens(darkTheme);

  const urlFilter = useSyncExternalStore(subscribeToUrl, filterFromUrl, () => null);
  const [chosen, setChosen] = useState<Filter | null>(null);
  const filter: Filter = chosen ?? (isFilter(urlFilter) ? urlFilter : "all");

  // One "active" project. Desktop: the preview pane falls back to the first visible
  // work, so it's never blank. Mobile: active === the expanded row, null = all closed.
  const [active, setActive] = useState<string | null>(null);

  const projects = useMemo(() => getProjectsForPage("projects"), []);
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: projects.length, frontend: 0, fullstack: 0, aiSlop: 0 };
    for (const p of projects) for (const cat of p.categories) c[cat]++;
    return c;
  }, [projects]);

  // Numbers belong to a project, not to its position in a filtered list.
  const visible = useMemo(
    () =>
      projects
        .map((project, i) => ({ project, number: i + 1 }))
        .filter(({ project }) => filter === "all" || project.categories.includes(filter)),
    [projects, filter]
  );

  const previewed =
    visible.find(({ project }) => project.name === active) ?? visible[0] ?? null;
  const activeFilter = filters.find((f) => f.value === filter) ?? filters[0];

  const selectFilter = (next: Filter) => {
    setChosen(next);
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete(FILTER_PARAM);
    else url.searchParams.set(FILTER_PARAM, next);
    window.history.replaceState(null, "", url);
  };

  const onRowClick = (project: Project) => {
    // Desktop: hover already previews, so a click opens the live site.
    // Mobile: there's no hover, so a tap toggles the row open (the site link is inside).
    if (isDesktop()) window.open(project.link, "_blank", "noopener,noreferrer");
    else setActive((cur) => (cur === project.name ? null : project.name));
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`${darkTheme ? "dark-theme-bg" : "light-theme-bg"} ${tokens.text} min-h-screen w-full`}
      >
        <main className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 md:px-16 md:py-32">
          <SectionHeading
            title="Works"
            tagline="Every project here is live. Open one and try it."
            subtle={tokens.subtle}
            variant="page"
            className="mb-10 md:mb-16"
          />

          {/* Filters + result count */}
          <div className={`mb-2 flex flex-col gap-2 border-b pb-4 ${tokens.border}`}>
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
              <div role="group" aria-label="Filter works by type" className="-ml-2 flex flex-wrap">
                {filters.map((f) => {
                  const on = filter === f.value;
                  return (
                    <button
                      key={f.value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => selectFilter(f.value)}
                      className={`inline-flex min-h-11 items-center gap-1.5 px-2 text-sm tracking-wide transition-colors md:text-base ${focusRing} ${
                        on ? "text-(--color-design)" : `${tokens.subtle} hover:text-(--color-design)`
                      }`}
                    >
                      <Bracket side="left" show={on} />
                      {f.label}
                      <span className={`text-xs tabular-nums ${on ? "" : tokens.faint}`}>
                        {counts[f.value]}
                      </span>
                      <Bracket side="right" show={on} />
                    </button>
                  );
                })}
              </div>
              <p aria-live="polite" className={`text-xs tabular-nums md:text-sm ${tokens.faint}`}>
                {filter === "all"
                  ? `${projects.length} works`
                  : `${visible.length} of ${projects.length} works`}
              </p>
            </div>
            {activeFilter.note && (
              <p className={`text-xs md:text-sm ${tokens.subtle}`}>{activeFilter.note}</p>
            )}
          </div>

          {visible.length === 0 ? (
            <div className="flex flex-col items-start gap-4 py-16">
              <p className="text-lg md:text-2xl">Nothing under {activeFilter.label} yet.</p>
              <button
                type="button"
                onClick={() => selectFilter("all")}
                className={`inline-flex min-h-11 items-center gap-2 text-sm text-(--color-design) md:text-base ${focusRing}`}
              >
                Show all {projects.length} works
                <ArrowRight aria-hidden size={16} strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 md:gap-12 lg:gap-16">
              {/* Index */}
              <ol className="md:col-span-7" aria-label="Works">
                {visible.map(({ project, number }) => {
                  const isActive = previewed?.project.name === project.name;
                  const isOpen = active === project.name;
                  const panelId = `work-${number}`;
                  return (
                    <li key={project.name} className={`border-b ${tokens.border}`}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => onRowClick(project)}
                        onPointerEnter={(e) => e.pointerType === "mouse" && isDesktop() && setActive(project.name)}
                        onFocus={() => isDesktop() && setActive(project.name)}
                        className={`group flex w-full cursor-pointer items-center gap-4 py-4 text-left md:py-5 ${focusRing}`}
                      >
                        <span
                          className={`relative aspect-[16/10] w-20 shrink-0 overflow-hidden md:hidden ${tokens.placeholder}`}
                        >
                          <Image
                            src={`/${project.desktopImage}`}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover object-top"
                          />
                        </span>

                        <span
                          className={`hidden w-8 shrink-0 text-sm tabular-nums md:block ${
                            isActive ? "text-(--color-design)" : tokens.faint
                          }`}
                        >
                          {pad(number)}
                        </span>

                        <span className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:gap-4">
                          <span
                            className={`text-xl font-medium md:truncate leading-[115%] tracking-[-0.02em] transition-[color,translate] duration-300 md:text-3xl ${
                              isActive
                                ? "md:translate-x-1 md:text-(--color-design)"
                                : "group-hover:text-(--color-design)"
                            }`}
                          >
                            {project.name}
                          </span>
                          <span className="flex items-center gap-2">
                            {project.badge && <ProofChip text={project.badge} tokens={tokens} />}
                            <span className={`text-xs md:hidden ${tokens.faint}`}>
                              {categoryList(project)}
                            </span>
                          </span>
                        </span>

                        <ChevronDown
                          aria-hidden
                          size={18}
                          strokeWidth={1.5}
                          className={`shrink-0 transition-transform duration-300 md:hidden ${tokens.subtle} ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Mobile: the row opens in place */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <m.div
                            id={panelId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="overflow-hidden md:hidden"
                          >
                            <div className="pb-8 pt-1">
                              <ProjectDetail project={project} tokens={tokens} />
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ol>

              {/* Desktop: sticky preview of the active row */}
              {previewed && (
                <aside
                  aria-label={`Preview: ${previewed.project.name}`}
                  className="hidden md:col-span-5 md:block"
                >
                  {/* No inner scroll box: its scrollbar flickered as previews of different
                      lengths swapped in. The image height is capped so the pane fits instead. */}
                  <div className="sticky top-24 pt-5">
                    <div className={`mb-4 flex items-baseline justify-between gap-4 text-sm ${tokens.faint}`}>
                      <span className="tabular-nums">
                        {pad(previewed.number)} / {pad(projects.length)}
                      </span>
                      <span>{categoryList(previewed.project)}</span>
                    </div>
                    <AnimatePresence mode="wait" initial={false}>
                      <m.div
                        key={previewed.project.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      >
                        <ProjectDetail
                          project={previewed.project}
                          tokens={tokens}
                          eager={previewed === visible[0]}
                        />
                      </m.div>
                    </AnimatePresence>
                  </div>
                </aside>
              )}
            </div>
          )}

          {/* The one thing to do after seeing the work */}
          <section
            aria-label="Start a project"
            className={`mt-24 flex flex-col gap-6 border-t pt-12 md:mt-32 md:flex-row md:items-end md:justify-between md:pt-16 ${tokens.border}`}
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-medium tracking-[-0.02em] md:text-4xl">
                Have a project in mind?
              </h2>
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
          </section>
        </main>
      </div>
    </MotionConfig>
  );
}
