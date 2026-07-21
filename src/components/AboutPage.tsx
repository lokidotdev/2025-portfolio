"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useGlobalContext } from "@/context/globalContext";
import ProximityText from "./ui/ProximityText";
import MagneticButton from "./ui/MagneticButton";
import HeroNavbar from "./HeroNavbar";

const INTRO =
  "I'm Lokesh — a full-stack developer who lives at the seam between design and engineering. I build fast, interactive, and visually polished web experiences, sweating the details most people scroll right past.";

const stack: { label: string; items: string[] }[] = [
  {
    label: "// LANGUAGES",
    items: ["JavaScript", "TypeScript"],
  },
  {
    label: "// FRONTEND",
    items: [
      "React",
      "Next.js",
      "TanStack Start",
      "Three.js",
      "GSAP",
      "Framer Motion",
      "Bootstrap",
      "Tailwind CSS",
      "HTML",
      "CSS",
      "Redux",
      "Zustand",
    ],
  },
  {
    label: "// BACKEND",
    items: [
      "Node.js",
      "Express.js",
      "WebSockets",
      "Redis",
      "Prisma",
      "REST APIs",
      "MongoDB",
      "PostgreSQL",
    ],
  },
  {
    label: "// DEVOPS & TOOLS",
    items: ["Docker", "Bun", "GitHub Actions", "Git/GitHub", "Vercel", "AWS EC2"],
  },
  {
    label: "// DESIGN",
    items: ["Figma"],
  },
];

const principles: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Details make the product",
    body: "The gap between good and great hides in easing curves, optical alignment, and the pixels nobody names but everybody feels.",
  },
  {
    n: "02",
    title: "Ship, then refine",
    body: "I'd rather have something real in front of people early and iterate than polish in a vacuum.",
  },
  {
    n: "03",
    title: "Design and code are one craft",
    body: "I move fluidly between Figma and the editor, so intent survives all the way to production.",
  },
];

const STACK_PREVIEW_COUNT = 4;

export default function AboutPage() {
  const { darkTheme } = useGlobalContext();
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

  const toggleGroup = (index: number) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

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

      <div className="mx-auto w-full max-w-400 px-6 py-24 md:px-16 md:py-32">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`mb-6 text-lg ${subtle}`}
          >
            // The person behind the pixels
          </motion.p>

          <h1 className="hero-heading w-full italic text-6xl font-thin tracking-[-0.04em] leading-[100%] md:text-[8vw]">
            <ProximityText
              text="ABOUT ME"
              maxDistance={200}
              minWeight={100}
              maxWeight={700}
            />
          </h1>
        </div>

        {/* Intro — portrait + copy */}
        <div className={`grid grid-cols-1 gap-10 border-t ${border} pt-12 md:grid-cols-[1fr_2fr] md:gap-16`}>
          <motion.img
            src="/images/portfolio-sq.png"
            alt="Lokesh Yadav"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-40 w-40 shrink-0 object-contain md:h-72 md:w-72"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <p className="max-w-2xl text-xl font-light leading-[135%] tracking-tight md:text-3xl">
              {INTRO}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-base md:text-2xl">
              <MagneticButton strength={0.4}>
                <span className="cursor-pointer leading-[110%] tracking-tight text-(--color-design)">
                  [ AVAILABLE FOR WORK ]
                </span>
              </MagneticButton>

              <a
                href="/connect"
                className="inline-flex items-center gap-1 leading-[110%] tracking-tight transition-colors hover:text-(--color-design)"
              >
                [ GET IN TOUCH ]
                <ArrowUpRight size={20} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Stack */}
        <div className="mt-24 md:mt-32">
          <p className={`mb-10 text-lg ${subtle}`}>// Toolbox</p>
          <div className={`grid grid-cols-1 gap-px border-t ${border} md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`}>
            {stack.map((group, index) => {
              const hasOverflow = group.items.length > STACK_PREVIEW_COUNT;
              const expanded = expandedGroups.has(index);
              const previewItems = group.items.slice(0, STACK_PREVIEW_COUNT);
              const extraItems = group.items.slice(STACK_PREVIEW_COUNT);

              return (
                <motion.div
                  key={group.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`flex flex-col gap-5 border-t ${border} py-10 md:border-t-0 md:pr-10`}
                >
                  <span className="text-sm tracking-wide text-(--color-design)">
                    {group.label}
                  </span>
                  <ul className="flex flex-col gap-2 text-2xl font-thin leading-[120%] tracking-[-0.02em] md:text-3xl">
                    {previewItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}

                    {/* Desktop: extras always visible, no truncation */}
                    {hasOverflow && (
                      <>
                        {extraItems.map((item) => (
                          <li key={item} className="hidden md:block">
                            {item}
                          </li>
                        ))}
                      </>
                    )}
                  </ul>

                  {/* Mobile: animated show-more */}
                  {hasOverflow && (
                    <div className="md:hidden">
                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.ul
                            key="extra"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="flex flex-col gap-2 overflow-hidden text-2xl font-thin leading-[120%] tracking-[-0.02em]"
                          >
                            {extraItems.map((item) => (
                              <li key={item} className="pt-2 first:pt-0">
                                {item}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>

                      <button
                        type="button"
                        onClick={() => toggleGroup(index)}
                        className={`mt-4 flex items-center gap-2 text-sm tracking-wide ${subtle} transition-colors hover:text-(--color-design)`}
                      >
                        {expanded ? "show less" : "show more"}
                        <motion.span
                          animate={{ rotate: expanded ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex"
                        >
                          <ChevronDown size={14} />
                        </motion.span>
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Principles */}
        <div className="mt-24 md:mt-32">
          <p className={`mb-10 text-lg ${subtle}`}>// How I work</p>
          <div className={`border-b ${border}`}>
            {principles.map((p, index) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className={`grid grid-cols-1 gap-6 border-t ${border} py-12 md:grid-cols-[1fr_2fr] md:gap-16`}
              >
                <div className="flex items-start gap-4">
                  <span className={`text-sm ${subtle}`}>{p.n}</span>
                  <span className="text-2xl font-thin leading-[110%] tracking-[-0.02em] md:text-3xl">
                    {p.title}
                  </span>
                </div>
                <p className={`max-w-2xl leading-[150%] ${subtle}`}>{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
