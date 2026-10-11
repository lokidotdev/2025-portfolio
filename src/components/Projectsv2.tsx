"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionConfig, m } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getProjectsForPage } from "@/constants/projectData";
import type { Project } from "@/types/project";
import { useGlobalContext } from "@/context/globalContext";
import { themeTokens } from "@/lib/theme";
import SectionHeading from "./ui/SectionHeading";
import {
  HoverCorners,
  MetaLine,
  NewTabHint,
  Ribbon,
  categoryList,
  focusRing,
  hostOf,
  pad,
  splitPoints,
} from "./projects/shared";

// The landing page is a triage step for someone deciding whether to reach out:
// one lead project, two supporting cards, then a compact index. Everything
// else (filters, full write-ups) lives on /projects.
const SPOTLIGHT_COUNT = 3;
const MAX_TAGS = 4;

const SpotlightCard = ({
  project,
  number,
  lead,
  darkTheme,
}: {
  project: Project;
  number: number;
  lead: boolean;
  darkTheme: boolean;
}) => {
  const tokens = themeTokens(darkTheme);
  const { summary, tech } = splitPoints(project.points);
  const extraTags = tech.length - MAX_TAGS;

  return (
    <m.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: lead ? 0 : ((number - 2) % 2) * 0.1 }}
      className={`group relative isolate grid grid-cols-1 gap-5 md:gap-6 ${focusRing} ${
        lead ? "md:col-span-2 md:grid-cols-[3fr_2fr] md:items-center md:gap-16" : ""
      }`}
    >
      <HoverCorners darkTheme={darkTheme} />

      {/* Fixed aspect box reserves the space, so nothing jumps while the image loads */}
      <div className={`relative aspect-video w-full overflow-hidden ${tokens.placeholder}`}>
        <Image
          src={`/${project.desktopImage}`}
          alt=""
          fill
          sizes={lead ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 45vw"}
          priority={lead}
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        {project.badge && !project.hideBadgeOnHome && <Ribbon text={project.badge} />}
      </div>

      <div className="flex flex-col gap-3 md:gap-4">
        <MetaLine project={project} number={number} tokens={tokens} />

        <h3
          className={`font-medium leading-[110%] tracking-[-0.02em] ${
            lead ? "text-2xl md:text-4xl" : "text-xl md:text-3xl"
          }`}
        >
          {project.name}
          <NewTabHint />
        </h3>

        <p
          className={`text-sm font-light leading-[150%] md:text-base ${tokens.subtle} ${
            lead ? "line-clamp-4" : "line-clamp-2"
          }`}
        >
          {summary}
        </p>

        {tech.length > 0 && (
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1" aria-label="Built with">
            {tech.slice(0, MAX_TAGS).map((t, i, shown) => (
              // Keep the "+N" glued to the last tag so it never wraps alone.
              <li key={t} className="whitespace-nowrap text-xs md:text-sm">
                <span className={tokens.subtle}>[ {t} ]</span>
                {i === shown.length - 1 && extraTags > 0 && (
                  <span className={`ml-4 ${tokens.faint}`}>
                    +{extraTags}
                    <span className="sr-only"> more</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </m.a>
  );
};

const IndexRow = ({
  project,
  number,
  order,
  darkTheme,
}: {
  project: Project;
  number: number;
  order: number;
  darkTheme: boolean;
}) => {
  const tokens = themeTokens(darkTheme);
  const { summary, tech } = splitPoints(project.points);

  return (
    <li className={`border-t ${tokens.border}`}>
      <m.a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: order * 0.05 }}
        className={`group relative grid grid-cols-[5.5rem_1fr] items-center gap-4 py-5 md:grid-cols-[3rem_8rem_1fr_auto] md:gap-8 md:py-6 ${focusRing}`}
      >
        {/* Row tint on hover, bled past the gutters so text keeps its alignment */}
        <span
          aria-hidden
          className={`pointer-events-none absolute -inset-x-3 inset-y-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:-inset-x-5 ${
            darkTheme ? "bg-on-dark/5" : "bg-ink/5"
          }`}
        />

        <span className={`hidden text-sm tabular-nums md:block ${tokens.faint}`}>{pad(number)}</span>

        <div className={`relative aspect-16/10 w-full overflow-hidden ${tokens.placeholder}`}>
          <Image
            src={`/${project.desktopImage}`}
            alt=""
            fill
            sizes="8rem"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="flex items-center gap-2 text-lg font-medium leading-[115%] tracking-[-0.02em] md:text-2xl">
            <span className="truncate">{project.name}</span>
            {project.badge && !project.hideBadgeOnHome && (
              <span className="hidden shrink-0 border border-(--color-brand) px-1.5 py-0.5 text-xs font-normal tracking-normal md:inline">
                {project.badge}
              </span>
            )}
            <ArrowUpRight
              aria-hidden
              size={18}
              strokeWidth={1.5}
              className="shrink-0 text-(--color-brand) transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:hidden"
            />
            <NewTabHint />
          </h3>
          <p className={`line-clamp-1 text-xs font-light leading-[150%] md:text-sm ${tokens.subtle}`}>
            {summary}
          </p>
          <p className={`text-xs md:hidden ${tokens.faint}`}>
            {categoryList(project)}
            {project.badge && !project.hideBadgeOnHome && ` · ${project.badge}`}
          </p>
        </div>

        {/* Desktop right rail: where it lives + what it's built with */}
        <div className="hidden flex-col items-end gap-1 text-right text-sm md:flex">
          <span
            className={`flex items-center gap-1 transition-colors ${tokens.subtle} ${
              darkTheme ? "group-hover:text-on-dark" : "group-hover:text-ink"
            }`}
          >
            {hostOf(project.link)}
            <ArrowUpRight
              aria-hidden
              size={14}
              strokeWidth={1.75}
              className="text-(--color-brand) transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
          <span className={`whitespace-nowrap text-xs ${tokens.faint}`}>{tech.slice(0, 3).join(" · ")}</span>
        </div>
      </m.a>
    </li>
  );
};

export default function Projectsv2() {
  const { darkTheme } = useGlobalContext();
  const tokens = themeTokens(darkTheme);
  const projects = getProjectsForPage("home");
  const totalCount = getProjectsForPage("projects").length;

  const spotlight = projects.slice(0, SPOTLIGHT_COUNT);
  const rest = projects.slice(SPOTLIGHT_COUNT);

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="projects"
        className={`${darkTheme ? "dark-theme-bg" : "light-theme-bg"} ${tokens.text} relative w-full`}
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-16 md:py-32">
          <SectionHeading
            title="Projects"
            tagline="Live builds you can open and try"
            subtle={tokens.subtle}
            variant="section"
            className="mb-12 md:mb-24"
          />

          {/* Lead + two supporting projects */}
          <div className="grid grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-2 md:gap-y-24">
            {spotlight.map((project, i) => (
              <SpotlightCard
                key={project.name}
                project={project}
                number={i + 1}
                lead={i === 0}
                darkTheme={darkTheme}
              />
            ))}
          </div>

          {/* Compact index for the rest */}
          {rest.length > 0 && (
            <div className="mt-20 md:mt-32">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 md:mb-6">
                <h3 className="text-lg tracking-[-0.02em] md:text-2xl">More builds ({rest.length})</h3>
                <p className={`text-xs md:text-sm ${tokens.subtle}`}>
                  Client work, personal builds &amp; playground · each opens in a new tab
                </p>
              </div>
              <ul className={`border-b ${tokens.border}`}>
                {rest.map((project, i) => (
                  <IndexRow
                    key={project.name}
                    project={project}
                    number={SPOTLIGHT_COUNT + i + 1}
                    order={i}
                    darkTheme={darkTheme}
                  />
                ))}
              </ul>
            </div>
          )}

          {/* One clear next step, and what's on the other side of it */}
          <div className="mt-10 flex flex-col items-center gap-2 md:mt-16">
            <Link
              href="/projects"
              className={`group inline-flex min-h-12 items-center gap-3 border ${tokens.inputBorder} px-6 py-3 text-sm tracking-tight transition-colors hover:border-(--color-brand) md:text-base ${focusRing}`}
            >
              View all {totalCount} projects
              <ArrowRight
                aria-hidden
                size={18}
                strokeWidth={1.5}
                className="text-(--color-brand) transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <p className={`text-xs ${tokens.faint}`}>Filter by frontend, fullstack or AI builds</p>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
