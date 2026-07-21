"use client";

import { motion } from "framer-motion";
import { useGlobalContext } from "@/context/globalContext";

interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string[];
  skills: string[];
}

// --- Mock Data ---
const experiences: ExperienceItem[] = [
  {
    id: 2,
    role: "Software Development Engineer 1",
    company: "Quanto Consulting",
    period: "Jul 2025 - Sep 2025",
    description: [
      "Developed scalable backend services using Node.js and Express, handling API requests, business logic, and database interactions",
      "Optimized PostgreSQL queries and database schemas, improving data retrieval performance and reducing API response times",
      "Integrated third-party services and internal APIs to support core application features and improve system interoperability",
      "Participated in code reviews, debugging, and production issue resolution, ensuring code quality and system reliability",
    ],
    skills: [
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "REST APIs",
      "Backend Development",
      "System Design",
    ],
  },
  {
    id: 1,
    role: "Interactive Full Stack Developer",
    company: "Marqueascendia",
    period: "Sep 2024 - Jun 2025",
    description: [
      "Built and optimized full-stack features using React, Next.js, Node.js, and PostgreSQL",
      "Designed responsive, animation-rich interfaces using GSAP and modern UI patterns",
      "Designed and maintained RESTful APIs with validation, authentication, and efficient data flow",
      "Collaborated with designers and stakeholders to translate business requirements into scalable solutions",
    ],
    skills: [
      "React",
      "Next.js",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "GSAP",
      "Tailwind CSS",
      "REST APIs",
      "Framer Motion",
    ],
  },
  {
    id: 3,
    role: "Freelance Web Developer",
    company: "Self-Employed",
    period: "2023 - Present",
    description: [
      "Crafted immersive frontend and storytelling websites for startups, creators, and brands",
      "Built visually rich, high-performance websites focused on narrative flow and user engagement",
      "Emphasized clean UI, smooth animations, and meaningful micro-interactions",
      "Translated ideas and brand stories into interactive web experiences",
      "Delivered polished, production-ready sites with ongoing improvements and refinements",
    ],
    skills: [
      "React",
      "Next.js",
      "Node.js",
      "MongoDB",
      "Tailwind CSS",
      "GSAP",
      "Stripe",
      "REST APIs",
    ],
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
  const subtle = darkTheme ? "text-white/60" : "text-[#212529]/60";
  const border = darkTheme ? "border-white/15" : "border-[#212529]/15";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group grid grid-cols-1 gap-8 border-t ${border} py-12 md:grid-cols-[1fr_2fr] md:gap-16`}
    >
      {/* Left — company + period */}
      <div className="flex flex-col gap-3">
        <span className="text-2xl font-thin leading-[110%] tracking-[-0.02em] md:text-3xl">
          {item.company}
        </span>
        <span className={`text-sm ${subtle}`}>[ {item.period} ]</span>
      </div>

      {/* Right — role + details */}
      <div className="flex flex-col gap-6">
        <h3 className="text-lg transition-colors group-hover:text-(--color-design) md:text-xl">
          {item.role}
        </h3>

        <ul className="flex flex-col gap-2">
          {item.description.map((point, idx) => (
            <li
              key={idx}
              className={`flex gap-3 leading-[140%] ${subtle}`}
            >
              <span className="text-(--color-design)">/</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {item.skills.map((skill) => (
            <span
              key={skill}
              className={`text-sm transition-colors hover:text-(--color-design) ${subtle}`}
            >
              [ {skill} ]
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function ExperienceSection() {
  const { darkTheme } = useGlobalContext();
  const text = darkTheme ? "text-white" : "text-[#212529]";
  const subtle = darkTheme ? "text-white/60" : "text-[#212529]/60";
  const border = darkTheme ? "border-white/15" : "border-[#212529]/15";

  return (
    <section
      id="experience"
      className={`${
        darkTheme ? "dark-theme-bg" : "light-theme-bg"
      } ${text} w-full`}
    >
      <div className="mx-auto w-full max-w-400 px-6 py-24 md:px-16 md:py-32">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`mb-6 text-lg ${subtle}`}
          >
            // Where I&apos;ve worked
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl font-thin italic leading-[100%] tracking-[-0.04em] md:text-[8vw]"
          >
            Experience
          </motion.h2>
        </div>

        {/* List */}
        <div className={`border-b ${border}`}>
          {experiences.map((item, index) => (
            <Row
              key={item.id}
              item={item}
              index={index}
              darkTheme={darkTheme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
