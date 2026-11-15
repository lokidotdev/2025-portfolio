"use client";

import Projectsv2 from "@/components/Projectsv2";
import "@/css/home.css";
import HeroSection from "./HeroSection";
import ExperienceSection from "./Experience";
import Contact from "./contact";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Projectsv2 />
      <ExperienceSection />
      <Contact />
    </>
  );
}
