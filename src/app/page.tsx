import Link from "next/link";
import HomePageClient from "@/components/home-page-client";
import { siteConfig } from "@/lib/site";

/**
 * Server-rendered, crawler-visible content.
 *
 * The visual homepage (`HomePageClient`) is a heavy Three.js / GSAP experience
 * loaded with `ssr: false`, so without this block search engines would receive
 * an empty <body>. This `sr-only` section ships real, semantic HTML in the
 * initial server response — proper headings, a bio, skills and links — so
 * Google can index the page for "Lokesh Yadav" without changing the design.
 */
function SeoContent() {
  return (
    <main className="sr-only" aria-hidden={false}>
      <h1>Lokesh Yadav — Full Stack Engineer (Loki)</h1>
      <p>
        Lokesh Yadav, also known as Loki, is a frontend-focused full stack
        engineer (MERN &amp; PERN) who builds production-ready, real-time, and
        performance-sensitive web applications. He specializes in React,
        Next.js, TypeScript, Node.js, PostgreSQL, Three.js, GSAP, WebSockets,
        and Redis.
      </p>

      <h2>About Lokesh Yadav</h2>
      <p>
        Lokesh Yadav is a software engineer based in India, building modern web
        experiences with a focus on interactive frontends and scalable
        backends. This is the official portfolio of Lokesh Yadav, showcasing his
        projects, experience, and skills.
      </p>

      <h2>Skills &amp; Technologies</h2>
      <ul>
        <li>React &amp; Next.js</li>
        <li>TypeScript &amp; JavaScript</li>
        <li>Node.js &amp; Express.js</li>
        <li>PostgreSQL, MongoDB &amp; Redis</li>
        <li>Three.js, GSAP &amp; Framer Motion</li>
        <li>Tailwind CSS</li>
        <li>WebSockets &amp; real-time systems</li>
        <li>Docker &amp; MERN / PERN stack development</li>
      </ul>

      <h2>Projects</h2>
      <p>
        Explore web projects, client work, and experimental builds by Lokesh
        Yadav on the <Link href="/projects">projects page</Link>.
      </p>

      <h2>Contact Lokesh Yadav</h2>
      <p>
        Get in touch with Lokesh Yadav through the{" "}
        <Link href="/connect">connect page</Link>, or find him online:
      </p>
      <ul>
        <li>
          <a href={siteConfig.github} rel="noopener noreferrer">
            GitHub — lokidotdev
          </a>
        </li>
        <li>
          <a href={siteConfig.linkedin} rel="noopener noreferrer">
            LinkedIn — Lokesh Yadav
          </a>
        </li>
        <li>
          <a href={`mailto:${siteConfig.email}`}>Email Lokesh Yadav</a>
        </li>
      </ul>
    </main>
  );
}

export default function Page() {
  return (
    <>
      <SeoContent />
      <HomePageClient />
    </>
  );
}
