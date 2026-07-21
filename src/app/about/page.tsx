import AboutPageClient from "@/components/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Lokesh Yadav — a full-stack developer working at the seam between design and engineering.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
