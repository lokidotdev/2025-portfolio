export type ProjectCategory = "fullstack" | "frontend";

export type ProjectPage = "home" | "projects";

export interface Project {
  name: string;
  link: string;
  desktopImage: string;
  points: string[];
  category: ProjectCategory;
  /** Pages this project should appear on. Defaults to all pages ("home" and "projects") when omitted. */
  pages?: ProjectPage[];
}
