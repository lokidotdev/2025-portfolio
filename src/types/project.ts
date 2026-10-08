export type ProjectCategory = "fullstack" | "frontend" | "aiSlop";

export type ProjectPage = "home" | "projects";

export interface Project {
  name: string;
  link: string;
  desktopImage: string;
  points: string[];
  categories: ProjectCategory[];
  /** Pages this project should appear on. Defaults to all pages ("home" and "projects") when omitted. */
  pages?: ProjectPage[];
  /** Short highlight shown as a banner over the card image, e.g. "20K+ visits". */
  badge?: string;
}
