export type ProjectCategory = "fullstack" | "frontend";

export interface Project {
  name: string;
  link: string;
  mobileImage: string;
  desktopImage: string;
  points: string[];
  category: ProjectCategory;
}
