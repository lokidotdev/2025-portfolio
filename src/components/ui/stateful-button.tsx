"use client";

import { cn } from "@/lib/utils";
import { m, useAnimate } from "motion/react";
import { useEffect } from "react";

export type ButtonStatus = "idle" | "loading" | "success";

type StatefulButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> & {
  status?: ButtonStatus;
};

export function StatefulButton({
  className,
  children,
  status = "idle",
  disabled,
  ...props
}: StatefulButtonProps) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    // scale/opacity composite on the GPU; `display` still removes the icon
    // from layout, and the parent's `layout` prop FLIPs the width change.
    if (status === "loading") {
      animate(".loader", { scale: 1, opacity: 1, display: "block" }, { duration: 0.2 });
    } else {
      animate(".loader", { scale: 0.6, opacity: 0, display: "none" }, { duration: 0.2 });
    }

    if (status === "success") {
      animate(".check", { scale: 1, opacity: 1, display: "block" }, { duration: 0.2 });
    } else {
      animate(".check", { scale: 0.6, opacity: 0, display: "none" }, { duration: 0.2 });
    }
  }, [status, animate]);

  return (
    <m.button
      ref={scope}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      disabled={disabled ?? status !== "idle"}
      className={cn(
        "flex min-w-30 cursor-pointer items-center justify-center gap-2 py-3 tracking-wide ring-offset-2 transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      <m.div layout className="flex items-center gap-2">
        <Loader />
        <Check />
        <m.span layout>{children}</m.span>
      </m.div>
    </m.button>
  );
}

const Loader = () => (
  <m.svg
    animate={{ rotate: [0, 360] }}
    initial={{ scale: 0.6, opacity: 0, display: "none" }}
    style={{ display: "none" }}
    transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="loader"
  >
    <path d="M12 3a9 9 0 1 0 9 9" />
  </m.svg>
);

const Check = () => (
  <m.svg
    initial={{ scale: 0.6, opacity: 0, display: "none" }}
    style={{ display: "none" }}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="check"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 12l5 5l10 -10" />
  </m.svg>
);
