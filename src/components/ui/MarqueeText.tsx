"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  items: string[];
  separator?: string;
  className?: string;
  /** Scroll speed in px per second. */
  speed?: number;
  /** Read before the list by screen readers, e.g. "Tools: ". */
  srLabel?: string;
};

/**
 * One line that truncates with an ellipsis. When it overflows, hovering the
 * line scrolls it as a seamless marquee with faded edges.
 */
export default function MarqueeText({
  items,
  separator = " · ",
  className = "",
  speed = 40,
  srLabel,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [width, setWidth] = useState(0);

  const text = items.join(separator);

  useEffect(() => {
    const box = boxRef.current;
    const span = textRef.current;
    if (!box || !span) return;
    const measure = () => {
      setOverflowing(span.scrollWidth > box.clientWidth + 1);
      setWidth(span.scrollWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [text]);

  const scrolling = overflowing && hovered;
  // gap between the end of one copy and the start of the next
  const gap = "   ·   ";

  return (
    <div
      ref={boxRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden whitespace-nowrap ${className}`}
      style={
        scrolling
          ? {
              maskImage:
                "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            }
          : undefined
      }
    >
      {srLabel && <span className="sr-only">{srLabel}</span>}
      <span
        ref={textRef}
        aria-hidden={scrolling || undefined}
        className={`block truncate ${scrolling ? "invisible" : ""}`}
      >
        {text}
      </span>
      {scrolling && (
        <span
          aria-hidden
          className="absolute left-0 top-0 inline-flex animate-marquee motion-reduce:animate-none"
          style={{ animationDuration: `${Math.max(width / speed, 4)}s` }}
        >
          <span>
            {text}
            {gap}
          </span>
          <span>
            {text}
            {gap}
          </span>
        </span>
      )}
    </div>
  );
}
