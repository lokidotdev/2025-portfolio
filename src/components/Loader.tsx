"use client";

import React, { useRef, useEffect, useState } from "react";

interface LoaderProps {
  onComplete?: () => void;
}

// Hydration usually happens after `load`, with no images in the DOM yet, so the
// real progress signal is often already 100 on the first frame. Pace the number
// so the loader is actually seen instead of unmounting instantly.
const MIN_VISIBLE_MS = 1400;

const Loader = ({ onComplete }: LoaderProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef(0);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [initialAdjustment, setInitialAdjustment] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      setInitialAdjustment(textRef.current.offsetWidth);
    }
  }, []);

  // Percentage reflects real asset loading only — no timers, no fake pacing.
  useEffect(() => {
    let mounted = true;

    // Lazy images below the fold never fire `load` while the loader covers the
    // page, so waiting on them would pin the counter forever. Only images the
    // browser is actually fetching now count toward progress.
    const imgs = Array.from(document.images).filter(
      (img) => img.complete || img.loading !== "lazy"
    );
    const total = imgs.length;
    let loaded = 0;
    let windowLoaded = false;

    const update = () => {
      if (!mounted) return;
      // images account for up to 90%, the window 'load' event covers the last 10%
      const imgProgress = total > 0 ? (loaded / total) * 90 : 90;
      const next = Math.min(100, Math.round(imgProgress + (windowLoaded ? 10 : 0)));
      targetRef.current = Math.max(targetRef.current, next);
    };

    // The rendered number chases the real target but can never outrun the
    // minimum-visible ramp, so a already-loaded page still plays 0 -> 100.
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      if (!mounted) return;
      const ceiling = ((now - start) / MIN_VISIBLE_MS) * 100;
      const next = Math.min(targetRef.current, Math.round(ceiling));
      setLoadingPercentage((prev) => Math.max(prev, next));
      if (next < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onAsset = () => {
      loaded += 1;
      update();
    };

    imgs.forEach((img) => {
      if (img.complete) {
        onAsset();
      } else {
        img.addEventListener("load", onAsset);
        img.addEventListener("error", onAsset);
      }
    });

    const finish = () => {
      windowLoaded = true;
      update();
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
    }

    update();

    // Last resort: a stalled or blocked request must never trap the visitor
    // behind the loader.
    const bailout = window.setTimeout(() => {
      if (!mounted) return;
      windowLoaded = true;
      loaded = total;
      update();
    }, 5000);

    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      window.clearTimeout(bailout);
      imgs.forEach((img) => {
        img.removeEventListener("load", onAsset);
        img.removeEventListener("error", onAsset);
      });
      window.removeEventListener("load", finish);
    };
  }, []);

  // fire completion once we reach 100 (kept out of render/updater)
  useEffect(() => {
    if (loadingPercentage >= 100) {
      onComplete?.();
    }
  }, [loadingPercentage, onComplete]);

  const textAdjustment = initialAdjustment * (1 - loadingPercentage / 100);

  return (
    <div className="loading-page w-full h-dvh overflow-hidden relative z-10">
      <div className="bg-ink h-full w-full z-[10]"></div>

      {/* The wipe is exactly as wide as the container, so a percentage
          translate resolves against the container just like `right` did —
          but on the compositor instead of triggering layout every frame. */}
      <div
        style={{ transform: `translateX(-${100 - loadingPercentage}%)` }}
        className="bg-surface-raised h-full w-full absolute z-[30] top-0 right-0 overflow-hidden transition-transform ease-out"
      >
        <div
          style={{ transform: `translateX(${textAdjustment}px)` }}
          className="text-ink z-[40] bottom-0 right-0 absolute text-[100px] px-5 inner-text"
        >
          {loadingPercentage}
        </div>
      </div>

      {/* Same full-width geometry, so the outer number tracks the wipe edge. */}
      <div
        style={{ transform: `translateX(-${100 - loadingPercentage}%)` }}
        className="pointer-events-none absolute inset-0 z-[20] transition-transform ease-out"
      >
        <div
          ref={textRef}
          style={{ transform: `translateX(${textAdjustment}px)` }}
          className="text-on-dark bottom-0 right-0 absolute text-[100px] px-5 outer-text"
        >
          {loadingPercentage}
        </div>
      </div>
    </div>
  );
};

export default Loader;
