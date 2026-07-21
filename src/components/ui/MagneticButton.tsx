"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  /** how far the element is allowed to drift toward the cursor, in px */
  strength?: number;
}

/**
 * Pulls its content toward the cursor while hovered, then springs back to
 * rest on leave. Spring (not easing) so the return has a natural
 * overshoot-and-settle instead of a mechanical stop.
 */
const MagneticButton = ({
  children,
  className = "",
  strength = 0.4,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 18, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
