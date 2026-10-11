export interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  /** "YYYY-MM", or "YYYY" when only the year is known. */
  start: string;
  /** Same format as `start`; omit while the role is ongoing. */
  end?: string;
}

/** Newest first. Shared by the home Experience section and the About page. */
export const experiences: ExperienceItem[] = [
  { id: 5, role: "Software Developer", company: "BenGait Labs", start: "2026-04" },
  {
    id: 4,
    role: "Software Development Engineer 1",
    company: "Quanto Consulting",
    start: "2025-07",
    end: "2025-09",
  },
  {
    id: 1,
    role: "Interactive Full Stack Developer",
    company: "Marqueascendia",
    start: "2024-09",
    end: "2025-06",
  },
  { id: 3, role: "Freelance Web Developer", company: "Self-Employed", start: "2023" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function parseDate(value: string) {
  const [year, month] = value.split("-").map(Number);
  return { year, month: month ? month - 1 : undefined };
}

export function formatDate(value: string) {
  const { year, month } = parseDate(value);
  return month === undefined ? `${year}` : `${MONTHS[month]} ${year}`;
}

/** Inclusive month count, so Jul–Sep reads as 3 mos, not 2. */
export function formatDuration(start: string, end: string | undefined, now: Date) {
  const s = parseDate(start);
  const e = end ? parseDate(end) : { year: now.getFullYear(), month: now.getMonth() };
  const total = (e.year - s.year) * 12 + ((e.month ?? 11) - (s.month ?? 0)) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;

  // A year-only start can't be precise to the month, so round down and say so.
  if (s.month === undefined) return `${years}+ yr${years === 1 ? "" : "s"}`;

  const parts = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  return parts.join(" ");
}

/** Earliest start year across all roles. */
export const buildingSince = Math.min(...experiences.map((e) => parseDate(e.start).year));
