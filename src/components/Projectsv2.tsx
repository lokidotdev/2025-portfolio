"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { getProjectsForPage } from "@/constants/projectData";
import type { Project } from "@/types/project";
import { useGlobalContext } from "@/context/globalContext";
import { themeTokens } from "@/lib/theme";
import SectionHeading from "./ui/SectionHeading";

// The last point of every project is "Tech - a, b, c"; split it out so the
// card can render the stack as tags instead of a sentence.
const TECH_PREFIX = /^tech\s*-\s*/i;

function splitPoints(points: string[]) {
  const techPoint = points.find((p) => TECH_PREFIX.test(p));
  const tech = techPoint
    ? techPoint
        .replace(TECH_PREFIX, "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const summary = points.find((p) => !TECH_PREFIX.test(p)) ?? "";
  return { summary, tech };
}

const MAX_TAGS = 4;

// Red corner brackets that frame the card on hover — each slides out from
// slightly inside its corner while fading in. Touch screens have no hover, so
// on mobile they frame whichever card sits at the middle of the viewport.
const CORNERS = [
  "top-0 left-0 border-t-2 border-l-2 group-hover:-translate-x-2 group-hover:-translate-y-2 max-md:group-data-active:-translate-x-2 max-md:group-data-active:-translate-y-2",
  "top-0 right-0 border-t-2 border-r-2 group-hover:translate-x-2 group-hover:-translate-y-2 max-md:group-data-active:translate-x-2 max-md:group-data-active:-translate-y-2",
  "bottom-0 left-0 border-b-2 border-l-2 group-hover:-translate-x-2 group-hover:translate-y-2 max-md:group-data-active:-translate-x-2 max-md:group-data-active:translate-y-2",
  "bottom-0 right-0 border-b-2 border-r-2 group-hover:translate-x-2 group-hover:translate-y-2 max-md:group-data-active:translate-x-2 max-md:group-data-active:translate-y-2",
];

const HoverCorners = ({ darkTheme }: { darkTheme: boolean }) => (
  <span
    aria-hidden
    className="pointer-events-none absolute inset-x-0 top-8 bottom-7 md:top-12 md:bottom-10"
  >
    {/* Faint tint filling the bracket frame — always on for mobile */}
    <span
      className={`absolute -inset-2 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:opacity-100 ${
        darkTheme ? "bg-on-dark/5" : "bg-ink/5"
      }`}
    />
    {CORNERS.map((pos) => (
      <span
        key={pos}
        className={`absolute size-4 border-(--color-brand) opacity-0 transition-[opacity,translate] duration-300 ease-out group-hover:opacity-100 max-md:group-data-active:opacity-100 md:size-5 ${pos}`}
      />
    ))}
  </span>
);

const Card = ({
  project,
  index,
  darkTheme,
  featured,
  inLastRow,
  active,
  cardRef,
}: {
  project: Project;
  index: number;
  darkTheme: boolean;
  featured: boolean;
  inLastRow: boolean;
  active: boolean;
  cardRef: (el: HTMLAnchorElement | null) => void;
}) => {
  const { subtle, faint, border, placeholder } = themeTokens(darkTheme);
  const { summary, tech } = splitPoints(project.points);
  const extraTags = tech.length - MAX_TAGS;

  return (
    <m.a
      ref={cardRef}
      data-active={active || undefined}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: featured ? 0 : (index % 2) * 0.1 }}
      className={`group relative isolate grid grid-cols-1 gap-6 border-b ${border} last:border-b-0 py-8 md:py-12 ${
        inLastRow ? "md:border-b-0" : ""
      } ${
        featured ? "md:col-span-2 md:grid-cols-[3fr_2fr] md:gap-16" : ""
      }`}
    >
      <HoverCorners darkTheme={darkTheme} />

      {/* Image */}
      <div
        className={`relative aspect-video w-full overflow-hidden ${placeholder}`}
      >
        <Image
          src={`/${project.desktopImage}`}
          alt={project.name}
          fill
          sizes={
            featured
              ? "(max-width: 768px) 100vw, 60vw"
              : "(max-width: 768px) 100vw, 40vw"
          }
          priority={featured}
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {project.badge && (
          // Corner ribbon: a band rotated 45° across the top-left corner whose
          // ends run off the image and get clipped by its overflow-hidden.
          <span className="absolute -left-14 top-[34px] z-10 flex w-52 -rotate-45 items-center justify-center gap-2 overflow-hidden bg-ink/90 py-1.5 text-xs font-semibold tracking-[0.02em] text-on-dark shadow-lg backdrop-blur-sm md:-left-16 md:top-12 md:w-64 md:py-2 md:text-sm">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 animate-shine bg-linear-to-r from-transparent via-white/25 to-transparent motion-reduce:hidden"
            />
            {/* Swap the "+" glyph for an icon — the text one reads too small */}
            <span className="flex items-center">
              {project.badge.split("+").map((part, i) => (
                <span key={i} className="flex items-center">
                  {i > 0 && (
                    <Plus
                      strokeWidth={3}
                      className="-ml-0.5 mr-1 size-2.5 md:size-3"
                    />
                  )}
                  {part}
                </span>
              ))}
            </span>
          </span>
        )}
      </div>

      {/* Details */}
      <div
        className={`flex flex-col gap-3 md:gap-4 ${
          featured ? "md:justify-between md:gap-6" : ""
        }`}
      >
        <div className="flex flex-col gap-3 md:gap-4">
          <h3 className="flex items-center gap-2 text-xl font-medium leading-[110%] tracking-[-0.02em] transition-colors group-hover:text-(--color-design) md:text-3xl">
            {project.name}
            <ArrowUpRight
              size={20}
              strokeWidth={1.5}
              className="shrink-0 -translate-x-1 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            />
          </h3>

          <p
            className={`text-sm font-light leading-[140%] md:text-base ${subtle} ${
              featured ? "line-clamp-4" : "line-clamp-2"
            }`}
          >
            {summary}
          </p>
        </div>

        {tech.length > 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {tech.slice(0, MAX_TAGS).map((t, i, shown) => (
              // Keep the "+N" glued to the last tag so it never wraps alone.
              <span key={t} className="whitespace-nowrap text-xs md:text-sm">
                <span className={subtle}>[ {t} ]</span>
                {i === shown.length - 1 && extraTags > 0 && (
                  <span className={`ml-5 ${faint}`}>+{extraTags}</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </m.a>
  );
};

export default function Projectsv2() {
  const { darkTheme } = useGlobalContext();
  const { text, subtle, border } = themeTokens(darkTheme);
  const projects = getProjectsForPage("home");
  // Featured card fills row 1; the rest pair up, so the last row on desktop
  // holds two cards when the remaining count is even.
  const lastRowStart =
    projects.length > 1 && (projects.length - 1) % 2 === 0
      ? projects.length - 2
      : projects.length - 1;

  // Mobile only: track the card nearest the viewport's vertical center so it
  // can show the hover brackets while scrolling.
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!mq.matches) return setActiveIndex(-1);
      const mid = window.innerHeight / 2;
      let best = -1;
      let bestDist = Infinity;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveIndex(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="projects"
      className={`${
        darkTheme ? "dark-theme-bg" : "light-theme-bg"
      } ${text} relative w-full`}
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-16 md:py-32">
        {/* Header */}
        <SectionHeading
          title="Projects"
          tagline="Some selected work"
          subtle={subtle}
          variant="section"
          className="mb-10 md:mb-24"
        />

        {/* Grid */}
        {/* Single divider under the last row instead of one per card */}
        <div
          className={`grid grid-cols-1 border-b ${border} md:grid-cols-2 md:gap-x-16`}
        >
          {projects.map((project, index) => (
            <Card
              key={project.name}
              project={project}
              index={index}
              darkTheme={darkTheme}
              featured={index === 0}
              inLastRow={index >= lastRowStart}
              active={index === activeIndex}
              cardRef={(el) => {
                cardRefs.current[index] = el;
              }}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between gap-4 text-base md:mt-12 md:text-2xl">
          <span className={`text-xs md:text-sm ${subtle}`}>
            Client work, personal builds & playground
          </span>
          <Link
            href="/projects"
            className="whitespace-nowrap leading-[110%] tracking-tight text-(--color-design) transition-opacity hover:opacity-70"
          >
            [ VIEW ALL ]
          </Link>
        </div>
      </div>
    </section>
  );
}
