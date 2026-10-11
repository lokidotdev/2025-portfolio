import WorksPage from "@/components/WorksPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Live web projects by Lokesh Yadav: client sites, full-stack products, and experiments you can open and try.",
};

export default function ProjectsPage() {
  return <WorksPage />;
}
