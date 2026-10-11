"use client";

import { MotionConfig, m } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useGlobalContext } from "@/context/globalContext";
import SectionHeading from "./ui/SectionHeading";
import { themeTokens } from "@/lib/theme";
import { siteConfig } from "@/lib/site";
import { focusRing } from "./projects/shared";
import {
  buildingSince,
  experiences,
  formatDate,
  formatDuration,
  type ExperienceItem,
} from "@/constants/experience";


const Row = ({
  item,
  index,
  now,
  darkTheme,
}: {
  item: ExperienceItem;
  index: number;
  now: Date;
  darkTheme: boolean;
}) => {
  const { subtle, faint, border } = themeTokens(darkTheme);
  const current = !item.end;

  // Rows are information, not links — no hover state that suggests otherwise.
  return (
    <m.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`border-b ${border}`}
    >
      <div className="grid grid-cols-1 gap-y-2 py-7 md:grid-cols-12 md:items-baseline md:gap-x-8 md:py-10">
        {/* When: the dates, then how long */}
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs tabular-nums md:col-span-3 md:flex-col md:text-base">
          <span className={subtle}>
            {formatDate(item.start)} – {current ? "Present" : formatDate(item.end!)}
          </span>
          <span className={`text-xs md:text-sm ${faint}`}>
            {formatDuration(item.start, item.end, now)}
          </span>
        </p>

        <h3 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-2xl font-medium leading-[110%] tracking-[-0.02em] md:col-span-5 md:text-4xl">
          {item.company}
          {/* Status chip: dot + word, never colour alone */}
          {current && (
            <span className="inline-flex items-center gap-1.5 border border-(--color-brand) px-2 py-0.5 text-xs font-normal tracking-normal">
              <span className="relative flex size-1.5" aria-hidden>
                <span className="absolute inset-0 animate-ping rounded-full bg-(--color-brand) opacity-60 motion-reduce:animate-none" />
                <span className="relative size-1.5 rounded-full bg-(--color-brand)" />
              </span>
              Current
            </span>
          )}
        </h3>

        <p className={`text-balance text-sm font-light md:col-span-4 md:text-right md:text-lg ${subtle}`}>
          {item.role}
        </p>
      </div>
    </m.li>
  );
};

export default function ExperienceSection() {
  const { darkTheme } = useGlobalContext();
  const { text, subtle, faint, border } = themeTokens(darkTheme);
  const now = new Date();
  const currentCount = experiences.filter((e) => !e.end).length;

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="experience"
        className={`${darkTheme ? "dark-theme-bg" : "light-theme-bg"} ${text} w-full`}
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-16 md:py-32">
          <SectionHeading
            title="Experience"
            tagline="Where I've worked"
            subtle={subtle}
            variant="section"
            className="mb-12 md:mb-24"
          />

          {/* The summary a skimmer would otherwise have to work out from the list */}
          <p className={`mb-4 text-xs md:mb-6 md:text-sm ${faint}`}>
            Building for the web since {buildingSince}
            <span aria-hidden className="mx-2">/</span>
            {experiences.length} roles, {currentCount} ongoing
          </p>

          <ol className={`border-t ${border}`}>
            {experiences.map((item, index) => (
              <Row key={item.id} item={item} index={index} now={now} darkTheme={darkTheme} />
            ))}
          </ol>

          {/* A way onward instead of a dead end */}
          <div className="mt-8 flex justify-end md:mt-12">
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex min-h-11 items-center gap-1.5 text-sm md:text-base ${focusRing}`}
            >
              <span className="underline-offset-4 group-hover:underline">See full history on LinkedIn</span>
              <ArrowUpRight
                aria-hidden
                size={16}
                strokeWidth={1.75}
                className="text-(--color-brand) transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
