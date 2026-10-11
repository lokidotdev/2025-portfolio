import { ArrowUpRight, Plus } from "lucide-react";
import { categoryLabels } from "@/constants/projectData";
import type { Project } from "@/types/project";
import type { ThemeTokens } from "@/lib/theme";

// The last point of every project is "Tech - a, b, c"; split it out so the
// card can render the stack as tags instead of a sentence.
const TECH_PREFIX = /^tech\s*-\s*/i;

export function splitPoints(points: string[]) {
  const techPoint = points.find((p) => TECH_PREFIX.test(p));
  const tech = techPoint
    ? techPoint
        .replace(TECH_PREFIX, "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const prose = points.filter((p) => !TECH_PREFIX.test(p));
  return { summary: prose[0] ?? "", details: prose.slice(1), tech };
}

export function hostOf(link: string) {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return link;
  }
}

export const pad =(n: number) => n.toString().padStart(2, "0");

export const categoryList = (project: Project) =>
  project.categories.map((c) => categoryLabels[c]).join(", ");

export const focusRing =
  "outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-brand)";

// Red corner brackets that frame a card on hover / keyboard focus — each
// slides out from slightly inside its corner while fading in.
const CORNERS = [
  "top-0 left-0 border-t-2 border-l-2 group-hover:-translate-x-2 group-hover:-translate-y-2",
  "top-0 right-0 border-t-2 border-r-2 group-hover:translate-x-2 group-hover:-translate-y-2",
  "bottom-0 left-0 border-b-2 border-l-2 group-hover:-translate-x-2 group-hover:translate-y-2",
  "bottom-0 right-0 border-b-2 border-r-2 group-hover:translate-x-2 group-hover:translate-y-2",
];

export const HoverCorners = ({ darkTheme }: { darkTheme: boolean }) => (
  <span aria-hidden className="pointer-events-none absolute -inset-3 hidden md:block md:-inset-5">
    <span
      className={`absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
        darkTheme ? "bg-on-dark/5" : "bg-ink/5"
      }`}
    />
    {CORNERS.map((pos) => (
      <span
        key={pos}
        className={`absolute size-5 border-(--color-brand) opacity-0 transition-[opacity,translate] duration-300 ease-out group-hover:opacity-100 ${pos}`}
      />
    ))}
  </span>
);

// Corner ribbon: a band rotated 45° across the top-left corner whose ends run
// off the image and get clipped by its overflow-hidden.
export const Ribbon = ({ text }: { text: string }) => (
  <span className="absolute -left-14 top-[34px] z-10 flex w-52 -rotate-45 items-center justify-center gap-2 overflow-hidden bg-ink/90 py-1.5 text-xs font-semibold tracking-[0.02em] text-on-dark shadow-lg backdrop-blur-sm md:-left-16 md:top-12 md:w-64 md:py-2 md:text-sm">
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-1/2 animate-shine bg-linear-to-r from-transparent via-white/25 to-transparent motion-reduce:hidden"
    />
    {/* Swap the "+" glyph for an icon — the text one reads too small */}
    <span className="flex items-center">
      {text.split("+").map((part, i) => (
        <span key={i} className="flex items-center">
          {i > 0 && <Plus strokeWidth={3} className="-ml-0.5 mr-1 size-2.5 md:size-3" />}
          {part}
        </span>
      ))}
    </span>
  </span>
);

/** "02 — fullstack, frontend" on the left, "designeng.tools ↗" on the right. */
export const MetaLine = ({
  project,
  number,
  tokens,
}: {
  project: Project;
  number: number;
  tokens: ThemeTokens;
}) => (
  <div className="flex items-center justify-between gap-4 text-xs md:text-sm">
    <span className={tokens.subtle}>
      <span className="tabular-nums">{pad(number)}</span>
      <span className={`mx-2 ${tokens.faint}`}>/</span>
      {categoryList(project)}
    </span>
    <span
      className={`flex min-w-0 items-center gap-1 ${tokens.subtle} transition-colors group-hover:text-(--color-design)`}
    >
      <span className="truncate">{hostOf(project.link)}</span>
      <ArrowUpRight
        aria-hidden
        size={14}
        strokeWidth={1.75}
        className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </span>
  </div>
);

export const NewTabHint = () => <span className="sr-only"> (opens in a new tab)</span>;
