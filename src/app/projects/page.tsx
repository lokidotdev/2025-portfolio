import ProjectsPageClient from "@/components/ProjectsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of web projects — client work, personal builds, and experimental playgrounds by Lokesh Yadav.",
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
