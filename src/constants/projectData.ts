import type { Project, ProjectPage } from "@/types/project";

export function getProjectsForPage(page: ProjectPage): Project[] {
  return projectsList.filter((p) => !p.pages || p.pages.includes(page));
}

export const projectsList: Project[] = [
  {
    name: "FOTF",
    link: "https://fotf-frontend.vercel.app",
    desktopImage: "images/fotf.png",
    points: [
      "Developed a fully responsive animated website with smooth transitions and micro-interactions.",
      "Implemented optimized animations using GSAP for a seamless user experience.",
      "Ensured cross-browser compatibility and mobile-friendly design.",
      "Tech - React.js, GSAP, Bootstrap, HTML, CSS",
    ],
    category: "frontend",
    pages: ["home", "projects"],
  },
  {
    name: "Muse Ink",
    link: "https://museink.zero1studio.xyz/",
    desktopImage: "images/museink.png",
    points: [
      "Built a client-facing animated website for a creative studio with custom scroll-triggered animations.",
      "Crafted pixel-perfect UI with GSAP ScrollTrigger for immersive, storytelling-driven sections.",
      "Delivered a production-ready site optimized for performance and cross-device responsiveness.",
      "Tech - Next.js, GSAP, Tailwindcss, CSS, HTML",
    ],
    category: "frontend",
    pages: ["home", "projects"],
  },
  {
    name: "Montreal",
    link: "https://montreal-clone.vercel.app/",
    desktopImage: "images/montreal.png",
    points: [
      "Recreated the award-winning Montreal agency website as a pixel-perfect clone to study high-end motion design.",
      "Reproduced the signature smooth scrolling and scroll-triggered reveal animations for an immersive experience.",
      "Matched the original's typography, layout, and micro-interactions with a focus on performance and responsiveness.",
      "Tech - Next.js, Motion, Tailwindcss, CSS, HTML",
    ],
    category: "frontend",
    pages: ["home", "projects"],
  },
  {
    name: "Excellent Printing Press",
    link: "https://excellentpp.com/",
    desktopImage: "images/excellentpp.png",
    points: [
      "Built a full-stack ecommerce platform for a UAE printing & packaging company, covering gifts, merchandise, and food-service product lines.",
      "Built a canvas-based live 3D product previewer with Three.js and React Three Fiber, letting customers see custom box designs update in real time.",
      "Developed a custom CMS and admin dashboard for managing products, categories, and orders without touching code.",
      "Tech - Next.js, Three.js, React Three Fiber, Tailwindcss, Coolify, Node.js, postgresql, Prisma, ShadcnUI, express.js, Docker, Typescript",
    ],
    category: "fullstack",
    pages: ["projects"],
  },
  {
    name: "Homie",
    link: "https://homie.zero1studio.xyz",
    desktopImage: "images/homie.png",
    points: [
      "Concept animated landing page for a real estate platform, built as a mockup project.",
      "Implemented smooth page transitions and scroll-based reveal animations for an engaging browsing experience.",
      "Showcases motion design principles and modern UI patterns with a clean, minimal aesthetic.",
      "Tech - Next.js, Motion, Tailwindcss",
    ],
    category: "frontend",
    pages: ["home", "projects"],
  },
  {
    name: "Galaxy Generator",
    link: "https://galaxy-generator-eta.vercel.app/",
    desktopImage: "images/galaxy.png",
    points: [
      "A dynamic 3D galaxy generator built with Three.js using millions of particles.",
      "Customizable parameters — adjust galaxy radius, spin, branches, and color gradients in real time.",
      "Interactive camera controls and GPU-optimized rendering for smooth animations and exploration.",
      "Tech - Three.js, React.js, Vite",
    ],
    category: "frontend",
    pages: ["home", "projects"],
  },
  {
    name: "Zero1 studio",
    link: "https://zero1studio.xyz/",
    desktopImage: "images/zero1.png",
    points: [
      "Designed and developed the official website for Zero1 Studio, a creative development studio.",
      "Built with a focus on bold visuals, smooth animations, and a strong brand identity.",
      "Fully responsive with optimized performance and polished micro-interactions throughout.",
      "Tech - Next.js, GSAP, Tailwind CSS",
    ],
    category: "frontend",
    pages: ["home", "projects"],
  },
  {
    name: "Promptography",
    link: "https://promptography.zero1studio.xyz/",
    desktopImage: "images/promptboard.png",
    points: [
      "Discover and share AI prompts with vector search, Redis caching, and database replicas for performance",
      "AI-powered image regeneration from prompts using generative AI",
      "Flexible credit-based subscriptions with Razorpay and transparent pricing",
      "Tech - Next.js, PostgreSQL, Express.js, Node.js, JavaScript, Tailwind CSS, ShadCN UI, Razorpay, REST APIs, Resend, OpenAI, Redis, Prisma",
    ],
    category: "fullstack",
    pages: ["home", "projects"],
  },
  {
    name: "ChessBlitz",
    link: "https://chessblitz.lok1.dev/",
    desktopImage: "images/chess.png",
    points: [
      "Real-time multiplayer chess with random matchmaking, friend games, and live spectating",
      "Async, event-driven backend with WebSockets and Redis for concurrent gameplay",
      "Tech - React.js, Express.js, Node.js, TypeScript, Tailwind CSS, WebSockets, Redis, PostgreSQL, Prisma",
    ],
    category: "fullstack",
    pages: ["home", "projects"],
  },
  {
    name: "OpenBG",
    link: "https://openbg.lok1.dev/",
    desktopImage: "images/openbg.png",
    points: [
      "A free and open source tool to remove backgrounds from images.",
      "Runs background removal entirely in the browser, so images never leave the user's device.",
      "Clean, minimal interface with instant preview and one-click download.",
      "Tech - Next.js, TypeScript, Tailwind CSS",
    ],
    category: "frontend",
    pages: ["projects"],
  },
  {
    name: "PixelflowUI",
    link: "https://pixelflowui.lok1.dev/",
    desktopImage: "images/pixelflowui.png",
    points: [
      "A collection of responsive animated UI components for web applications.",
      "Open source project.",
      "Tech - Next.js, Framer Motion, GSAP, ShadCN UI, JavaScript, Tailwind CSS",
    ],
    category: "frontend",
    pages: ["home", "projects"],
  },
];
