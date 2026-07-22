"use client";

import { useEffect, type ReactNode } from "react";
import { LazyMotion, domMax } from "motion/react";
import { Toaster } from "react-hot-toast";
import { GlobalContextProvider } from "@/context/globalContext";
import HeroNavbar from "@/components/HeroNavbar";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any = null;
    let ticker: ((time: number) => void) | null = null;
    let scrollTriggerUpdate: (() => void) | undefined;

    const init = async () => {
      const [{ default: Lenis }, gsap, { ScrollTrigger }] = await Promise.all([
        import("@studio-freight/lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      gsap.default.registerPlugin(ScrollTrigger);

      lenis = new Lenis();
      scrollTriggerUpdate = () => ScrollTrigger.update();
      lenis.on("scroll", scrollTriggerUpdate);

      ticker = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.default.ticker.add(ticker);
      gsap.default.ticker.lagSmoothing(0);
    };

    void init();

    return () => {
      void import("gsap").then((gsap) => {
        if (ticker) gsap.default.ticker.remove(ticker);
      });
      if (lenis && scrollTriggerUpdate) {
        lenis.off("scroll", scrollTriggerUpdate);
        lenis.destroy();
      }
    };
  }, []);

  return (
    <GlobalContextProvider>
      {/* domMax rather than domAnimation: the tree uses `layout` projection. */}
      <LazyMotion features={domMax}>
        <HeroNavbar />
        {children}
        <Toaster />
      </LazyMotion>
    </GlobalContextProvider>
  );
}
