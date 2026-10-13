export type Service = {
  id: string;
  /** Sent to /api/service-request as-is — keep stable. */
  title: string;
  /** The outcome, in one line. */
  outcome: string;
  /** What the client actually gets. */
  deliverables: string[];
  stack: string[];
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
    stack: [
      "React",
      "Next.js",
      "TanStack Start",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "shadcn/ui",
      "GSAP",
      "Motion",
      "Three.js",
      "React Three Fiber",
      "GLSL Shaders",
      "Phaser",
      "Zustand",
      "Vite",
      "Bootstrap",
      "HTML",
      "CSS",
    ],
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
    stack: [
      "Node.js",
      "Express",
      "Bun",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "Zod",
      "REST APIs",
      "WebSockets",
      "Razorpay",
      "Resend",
      "OpenAI",
    ],
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
    stack: [
      "Next.js",
      "TanStack Start",
      "React",
      "Node.js",
      "Express",
      "Bun",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "Tailwind CSS",
      "shadcn/ui",
      "Docker",
      "Coolify",
      "Cloudflare Workers",
    ],
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
    stack: [
      "Figma",
      "Design systems",
      "Wireframing",
      "Prototyping",
      "Tailwind CSS",
      "shadcn/ui",
      "Motion",
    ],
  },
];
