"use client";

import React, { useEffect, useRef } from "react";

interface ProximityTextProps {
  text: string;
  className?: string;
  /** px radius within which letters reach max weight */
  maxDistance?: number;
  minWeight?: number;
  maxWeight?: number;
}

const ProximityText = ({
  text,
  className = "",
  maxDistance = 200,
  minWeight = 100,
  maxWeight = 900,
}: ProximityTextProps) => {
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const isHoverRef = useRef(false);
  const rectsRef = useRef<DOMRect[]>([]);

  const cacheRects = () => {
    rectsRef.current = letterRefs.current.map((el) => el.getBoundingClientRect());
  };

  const resetWeights = () => {
    letterRefs.current.forEach((el) => {
      el.style.fontWeight = String(minWeight);
    });
  };

  useEffect(() => {
    // seed a resting weight so letters don't snap on first hover
    resetWeights();

    const handleMouse = (e: MouseEvent) => {
      if (!isHoverRef.current) return;
      const mouseX = e.clientX;
      const range = maxWeight - minWeight;

      rectsRef.current.forEach((rect, i) => {
        const centerX = rect.left + rect.width / 2;
        const distance = Math.abs(mouseX - centerX);
        const proximity = Math.max(0, 1 - distance / maxDistance);
        const weight = Math.round(minWeight + proximity * range);
        const el = letterRefs.current[i];
        if (el) el.style.fontWeight = String(weight);
      });
    };

    window.addEventListener("mousemove", handleMouse);
    // rects shift on resize/scroll — refresh while hovered
    const refresh = () => isHoverRef.current && cacheRects();
    window.addEventListener("resize", refresh);
    window.addEventListener("scroll", refresh, true);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("scroll", refresh, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, maxDistance, minWeight, maxWeight]);

  return (
    <span
      onMouseEnter={() => {
        isHoverRef.current = true;
        cacheRects();
      }}
      onMouseLeave={() => {
        isHoverRef.current = false;
        resetWeights();
      }}
      className={`inline-flex cursor-default ${className}`}
    >
      {text.split("").map((letter, i) => (
        <span
          ref={(el) => {
            if (el) letterRefs.current[i] = el;
          }}
          key={i}
          // 150ms ease-out: fast to react, gentle to settle (timing-under-300ms)
          className="transition-[font-weight] duration-150 ease-out"
          style={{ fontWeight: minWeight }}
        >
          {letter === " " ? " " : letter}
        </span>
      ))}
    </span>
  );
};

export default ProximityText;
