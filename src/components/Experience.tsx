"use client";

import { m } from "motion/react";
import { useGlobalContext } from "@/context/globalContext";
import SectionHeading from "./ui/SectionHeading";
import { themeTokens } from "@/lib/theme";

interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  period: string;
}

const experiences: ExperienceItem[] = [
  {
    id: 5,
    role: "Software Developer",
    company: "BenGait Labs",
    period: "Apr 2026 - Present",
  },
  {
    id: 4,
    role: "Software Development Engineer 1",
    company: "Quanto Consulting",
    period: "Jul 2025 - Sep 2025",
  },
  {
    id: 1,
    role: "Interactive Full Stack Developer",
    company: "Marqueascendia",
    period: "Sep 2024 - Jun 2025",
  },
  {
    id: 3,
    role: "Freelance Web Developer",
    company: "Self-Employed",
    period: "2023 - Present",
  },
];

const Row = ({
  item,
  index,
  darkTheme,
}: {
  item: ExperienceItem;
  index: number;
  darkTheme: boolean;
}) => {
  const { subtle, border } = themeTokens(darkTheme);
  const current = item.period.includes("Present");

  return (
    <m.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`group border-b ${border}`}
    >
      <div className="grid grid-cols-1 gap-y-2 py-7 transition-opacity duration-300 group-hover/list:opacity-40 group-hover:opacity-100! md:grid-cols-12 md:items-baseline md:gap-x-8 md:py-10">
        {/* Period */}
        <span
          className={`flex items-center gap-2 whitespace-nowrap text-xs tabular-nums md:col-span-3 md:text-base ${subtle}`}
        >
          {item.period}
          {current && (
            <span className="relative flex size-1.5" aria-hidden>
              <span className="absolute inset-0 animate-ping rounded-full bg-(--color-design) opacity-60 motion-reduce:animate-none" />
              <span className="relative size-1.5 rounded-full bg-(--color-design)" />
            </span>
          )}
        </span>

        {/* Company */}
        <h3 className="text-2xl font-medium leading-[110%] tracking-[-0.02em] transition-colors duration-200 group-hover:text-(--color-design) md:col-span-5 md:text-4xl">
          {item.company}
        </h3>

        {/* Role */}
        <p
          className={`text-sm font-light md:col-span-4 md:text-right md:text-lg ${subtle}`}
        >
          {item.role}
        </p>
      </div>
    </m.li>
  );
};

export default function ExperienceSection() {
  const { darkTheme } = useGlobalContext();
  const { text, subtle, border } = themeTokens(darkTheme);

  return (
    <section
      id="experience"
      className={`${
        darkTheme ? "dark-theme-bg" : "light-theme-bg"
      } ${text} w-full`}
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-16 md:py-32">
        {/* Header */}
        <SectionHeading
          title="Experience"
          tagline="Where I've worked"
          subtle={subtle}
          variant="section"
          className="mb-10 md:mb-24"
        />

        {/* List */}
        <ol className={`group/list border-t ${border}`}>
          {experiences.map((item, index) => (
            <Row
              key={item.id}
              item={item}
              index={index}
              darkTheme={darkTheme}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
