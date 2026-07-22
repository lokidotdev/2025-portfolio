"use client";

import React, { useRef, useEffect, useState } from "react";

interface LoaderProps {
  onComplete?: () => void;
}

const Loader = ({ onComplete }: LoaderProps) => {
  const textRef = useRef<HTMLDivElement>(null);
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

    const imgs = Array.from(document.images);
    const total = imgs.length;
    let loaded = 0;
    let windowLoaded = false;

    const update = () => {
      if (!mounted) return;
      // images account for up to 90%, the window 'load' event covers the last 10%
      const imgProgress = total > 0 ? (loaded / total) * 90 : 90;
      const next = Math.min(100, Math.round(imgProgress + (windowLoaded ? 10 : 0)));
      setLoadingPercentage((prev) => Math.max(prev, next));
    };

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

    return () => {
      mounted = false;
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
    <div className="loading-page w-[100vw] h-[100vh] overflow-hidden relative z-10">
      <div className="bg-ink h-full w-full z-[10]"></div>
      <div
        style={{ right: `${100 - loadingPercentage}%` }}
        className="bg-surface-raised h-full w-full absolute z-[30] top-0 overflow-hidden transition-all ease"
      >
        <div
          style={{ right: `-${textAdjustment}px` }}
          className="text-ink z-[40] bottom-0 absolute text-[100px] px-5 inner-text"
        >
          {loadingPercentage}
        </div>
      </div>
      <div
        ref={textRef}
        style={{
          right: `calc(${100 - loadingPercentage}% - ${textAdjustment}px)`,
        }}
        className="text-on-dark z-[20] bottom-0 absolute text-[100px] transition-all ease px-5 outer-text"
      >
        {loadingPercentage}
      </div>
    </div>
  );
};

export default Loader;
