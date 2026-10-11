import { projectsList } from "@/constants/projectData";

export type Service = {
  id: string;
  /** Sent to /api/service-request as-is — keep stable. */
  title: string;
  /** The outcome, in one line. */
  outcome: string;
  /** What the client actually gets. */
  deliverables: string[];
  stack: string[];
  /** Project names from projectData, shown as proof. */
  proof: string[];
};

export const services: Service[] = [
  {
    id: "frontend-development",
    title: "Frontend Development",
    outcome: "Pixel-accurate, accessible interfaces in React & Next.js.",
    deliverables: [
      "Responsive UI built from your designs",
      "Motion, scroll and 3D interactions",
      "Performance and accessibility tuning",
    ],
    stack: ["React", "Next.js", "TypeScript", "GSAP", "Three.js"],
    proof: ["FOTF", "Galaxy Generator"],
  },
  {
    id: "backend-development",
    title: "Backend Development",
    outcome: "APIs, databases and server logic that hold up under real use.",
    deliverables: [
      "REST APIs with auth and validation",
      "Database schema and migrations",
      "Real-time features and admin tooling",
    ],
    stack: ["Node.js", "Express", "PostgreSQL", "Prisma", "Redis"],
    proof: ["Highway z"],
  },
  {
    id: "fullstack-development",
    title: "Fullstack Development",
    outcome: "A complete product, from database to deployed UI.",
    deliverables: [
      "Ecommerce, dashboards and custom CMS",
      "End-to-end features, one owner",
      "Deployment with Docker or Cloudflare",
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Docker"],
    proof: ["Excellent Printing Press", "DesignEng"],
  },
  {
    id: "ui-ux-design",
    title: "UI / UX Design",
    outcome: "Interfaces designed in Figma, ready to build.",
    deliverables: [
      "User flows and wireframes",
      "High-fidelity screens and prototypes",
      "Reusable components and styles",
    ],
    stack: ["Figma", "Design systems", "Prototyping"],
    proof: ["Zero1 studio", "PixelflowUI"],
  },
];

/** Resolve proof names to live links, skipping any project that was removed. */
export function proofLinks(service: Service) {
  return service.proof.flatMap((name) => {
    const project = projectsList.find((p) => p.name === name);
    return project ? [{ name: project.name, href: project.link }] : [];
  });
}
