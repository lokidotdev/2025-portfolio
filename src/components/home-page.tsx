"use client";

import { Suspense } from "react";
import { AnimatePresence, motion } from "motion/react";
import Projectsv2 from "@/components/Projectsv2";
import Loader from "@/components/Loader";
import { useGlobalContext } from "@/context/globalContext";
import "@/css/home.css";
import HeroSection from "./HeroSection";
import ExperienceSection from "./Experience";
import SkillsSection from "./Skills";
import Contact from "./contact";

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

      <div key={isLoading ? "loading" : "loaded"} className={isLoading ? "invisible" : "visible"}>
        <Suspense fallback={null}>
          <HeroSection/>
          <Projectsv2 />
          <ExperienceSection/>
          <Contact/>
        </Suspense>
      </div>
    </>
  );
}
