import ServicesPageClient from "@/components/ServicesPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Services offered by Lokesh Yadav — frontend, fullstack, UI/UX design, motion, and design systems. Request a project.",
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
