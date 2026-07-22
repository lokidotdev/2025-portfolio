"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  /** begin typing when this flips true */
  start?: boolean;
  /** ms between characters (kept snappy so long copy still lands fast) */
  speed?: number;
  /** ms to wait before the first character */
  startDelay?: number;
  className?: string;
  onDone?: () => void;
}

const Typewriter = ({
  text,
  start = true,
  speed = 22,
  startDelay = 250,
  className = "",
  onDone,
}: TypewriterProps) => {
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!start) return;

    let raf = 0;
    let timer: ReturnType<typeof setTimeout>;
    let last = 0;
    let i = 0;

    const tick = (now: number) => {
      if (!last) last = now;
      // pace by elapsed time rather than a fixed interval — smoother, and
      // resilient if the tab throttles rAF
      if (now - last >= speed) {
        i += 1;
        last = now;
        setCount(i);
        if (i >= text.length) {
          if (!doneRef.current) {
            doneRef.current = true;
            onDone?.();
          }
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    timer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, startDelay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, text, speed, startDelay]);

  const done = count >= text.length;

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{text.slice(0, count)}</span>
      <span
        aria-hidden
        // caret: solid while typing, gentle blink once settled
        className={`inline-block w-[0.06em] translate-y-[0.08em] self-stretch bg-current align-baseline ${
          done ? "typewriter-caret-blink" : ""
        }`}
        style={{ height: "1em", marginLeft: "0.06em" }}
      />
    </span>
  );
};

export default Typewriter;
