"use client";

import { Suspense } from "react";
import { AnimatePresence, motion } from "motion/react";
import Portfolio from "@/components/portfolio";
import Contact from "@/components/contact";
import SnowflakeCursor from "@/components/ui/SnowflakeCursor";
import Section3 from "@/components/Section3";
import Projectsv2 from "@/components/Projectsv2";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/Experience";
import Loader from "@/components/Loader";
import { useGlobalContext } from "@/context/globalContext";
import "@/css/home.css";

export default function HomePage() {
  const { isLoading, setIsLoading } = useGlobalContext();

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-300"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
          >
            <Loader onComplete={() => setIsLoading(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content mounts behind the loader so its images actually load and
          are tracked; it stays hidden until the loader lifts, so the first
          section's entry animations play once the loader is gone. */}
      <div key={isLoading ? "loading" : "loaded"} className={isLoading ? "invisible" : "visible"}>
        <Suspense fallback={null}>
          <SnowflakeCursor />
          <Portfolio />
          <Section3 />
          <Projectsv2 />
          <ExperienceSection />
          {/* <SkillsSection /> */}
          <Contact />
        </Suspense>
      </div>
    </>
  );
}
