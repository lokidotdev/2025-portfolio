"use client";

import { m } from "motion/react";
import ProximityText from "./ProximityText";

type Props = {
  title: string;
  tagline: string;
  subtle: string;
  /**
   * "page"    — top of a standalone route: <h1>, left-aligned, tagline inline.
   * "section" — a block on the landing page: <h2>, centered, tagline under the right edge.
   */
  variant: "page" | "section";
  className?: string;
};

const headingClass =
  "hero-heading text-5xl font-thin italic leading-[100%] tracking-[-0.04em] md:text-[8vw]";

export default function SectionHeading({ title, tagline, subtle, variant, className = "" }: Props) {
  const isPage = variant === "page";
  const Heading = isPage ? m.h1 : m.h2;
  // Page headers are above the fold, so animate on mount; sections reveal on scroll.
  const reveal = isPage
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

  return (
    <div
      className={`${
        isPage
          ? "flex flex-wrap items-baseline gap-x-4 gap-y-2 md:gap-x-8"
          : "md:relative md:mx-auto md:w-fit md:text-center"
      } ${className}`}
    >
      <Heading
        initial={{ opacity: 0, y: 20 }}
        {...reveal}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={headingClass}
      >
        <ProximityText text={title} maxDistance={200} minWeight={100} maxWeight={700} />
      </Heading>
      <m.p
        initial={{ opacity: 0, y: 20 }}
        {...reveal}
        transition={{ duration: 0.5 }}
        className={`text-sm md:text-lg ${subtle} ${
          isPage ? "" : "mt-2 md:absolute md:right-0 md:top-full md:mt-0 md:whitespace-nowrap"
        }`}
      >
        {`// ${tagline}`}
      </m.p>
    </div>
  );
}
