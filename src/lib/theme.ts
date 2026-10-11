/**
 * Theme-aware class tokens.
 *
 * All raw color values live in `src/app/globals.css` (`@theme` block). This
 * module is the single place that decides which token a given role resolves to
 * for the light/dark toggle, so components never inline colors themselves.
 */

export type ThemeTokens = {
  /** Primary body/heading text */
  text: string;
  /** De-emphasised text (captions, meta) */
  subtle: string;
  /** Even quieter text (timestamps, counters) */
  faint: string;
  /** Hairline dividers and card outlines */
  border: string;
  /** Form control outlines */
  inputBorder: string;
  /** Page/panel background */
  bg: string;
  /** Raised panel background (cards, popovers) */
  bgRaised: string;
  /** Low-contrast fill for skeletons and placeholders */
  placeholder: string;
};

// Opacity steps are the lowest that clear WCAG AA on each theme's background:
// subtle/faint ≥ 4.5:1 for text, inputBorder ≥ 3:1 for control outlines.
const dark: ThemeTokens = {
  text: "text-on-dark",
  subtle: "text-on-dark/60",
  faint: "text-on-dark/50",
  border: "border-on-dark/15",
  inputBorder: "border-on-dark/40",
  bg: "bg-ink",
  bgRaised: "bg-surface-inverse",
  placeholder: "bg-on-dark/10",
};

const light: ThemeTokens = {
  text: "text-ink",
  subtle: "text-ink/70",
  faint: "text-ink/65",
  border: "border-ink/15",
  inputBorder: "border-ink/50",
  bg: "bg-surface",
  bgRaised: "bg-surface-raised",
  placeholder: "bg-ink/10",
};

export function themeTokens(darkTheme: boolean): ThemeTokens {
  return darkTheme ? dark : light;
}

/**
 * Resolved color value for consumers that need a real color string rather than
 * a class (three.js materials, canvas, inline style). Reads the token straight
 * off the stylesheet so `globals.css` stays the only place values are written.
 * Client-side only — returns "" during SSR, which those consumers treat as
 * "inherit"/default until hydration.
 */
export function themeColor(token: ColorToken): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${token}`)
    .trim();
}

export type ColorToken =
  | "ink"
  | "ink-light"
  | "surface"
  | "surface-raised"
  | "surface-inverse"
  | "on-dark"
  | "wire-dark"
  | "brand"
  | "brand-soft"
  | "brand-deep"
  | "danger";
