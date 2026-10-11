"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MotionConfig, m } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context/globalContext";
import SectionHeading from "./ui/SectionHeading";
import { focusRing, hostOf } from "./projects/shared";
import { themeTokens } from "@/lib/theme";
import { siteConfig } from "@/lib/site";
import { socialLinks } from "@/constants/socialLinks";
import { projectsList } from "@/constants/projectData";
import { buildingSince, experiences, formatDate } from "@/constants/experience";

/** Flip to false when not taking work — the chip and its note follow. */
const OPEN_TO_WORK = true;

const current = experiences.filter((e) => !e.end);
const dayJob = current.find((e) => e.company !== "Self-Employed") ?? current[0];
const freelancing = current.some((e) => e.company === "Self-Employed");

const recentBuildNames = ["DesignEng", "Highway z", "Portfolio 2026"];
const selectedWork = recentBuildNames
  .map((name) => projectsList.find((p) => p.name === name))
  .filter((p): p is (typeof projectsList)[number] => !!p);

/** Grouped by what each tool is for, so a "do you know X?" scan lands in one row. */
const stack: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["TypeScript", "JavaScript", "HTML", "CSS"] },
  { label: "Frontend", items: ["React", "Next.js", "TanStack Start"] },
  { label: "Styling", items: ["Tailwind CSS", "Bootstrap"] },
  { label: "State", items: ["Redux", "Zustand"] },
  { label: "Motion & 3D", items: ["GSAP", "Framer Motion", "Three.js"] },
  { label: "Backend", items: ["Node.js", "Bun", "Express.js", "REST APIs", "WebSockets"] },
  { label: "Databases", items: ["PostgreSQL", "MongoDB", "Redis", "Prisma"] },
  { label: "DevOps", items: ["Docker", "GitHub Actions", "Vercel", "Cloudflare"] },
  { label: "Tools", items: ["Git/GitHub", "Figma"] },
];

const principles: { title: string; body: string }[] = [
  {
    title: "Details make the product",
    body: "The gap between good and great hides in easing curves, optical alignment, and the pixels nobody names but everybody feels.",
  },
  {
    title: "Ship, then refine",
    body: "Something real in front of people early beats polish in a vacuum. I iterate from there.",
  },
  {
    title: "Design and code are one craft",
    body: "I move between Figma and the editor, so the intent survives all the way to production.",
  },
];

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45 },
} as const;

/** `[ LABEL → ]` — the site's link-button. Accent on the brackets, label in body colour for contrast. */
function BracketLink({
  href,
  label,
  accent,
  external = false,
  quiet = false,
}: {
  href: string;
  label: string;
  accent: string;
  external?: boolean;
  /** Secondary weight: dimmed until hover. */
  quiet?: boolean;
}) {
  const Arrow = external ? ArrowUpRight : ArrowRight;
  const className = `group inline-flex min-h-11 items-center gap-1 tracking-tight transition-opacity ${
    quiet ? "opacity-80 hover:opacity-100" : ""
  } ${focusRing}`;
  const content = (
    <>
      <span aria-hidden className={accent}>
        [
      </span>
      <span className="underline-offset-4 group-hover:underline">{label}</span>
      <Arrow
        aria-hidden
        size={18}
        strokeWidth={1.5}
        className={`${accent} transition-transform duration-300 ${
          external
            ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            : "group-hover:translate-x-0.5"
        }`}
      />
      <span aria-hidden className={accent}>
        ]
      </span>
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

/** Small inline link with a trailing arrow, for "more of this" exits under a section. */
function MoreLink({ href, children, external = false }: { href: string; children: ReactNode; external?: boolean }) {
  const Arrow = external ? ArrowUpRight : ArrowRight;
  const body = (
    <>
      <span className="underline-offset-4 group-hover:underline">{children}</span>
      <Arrow aria-hidden size={16} strokeWidth={1.75} className="text-(--color-brand) transition-transform duration-300 group-hover:translate-x-0.5" />
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );
  const className = `group inline-flex min-h-11 items-center gap-1.5 text-sm md:text-base ${focusRing}`;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <Link href={href} className={className}>
      {body}
    </Link>
  );
}

function Availability({ muted, darkTheme }: { muted: string; darkTheme: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      {/* Status chip: dot + words, never colour alone */}
      <span className="inline-flex w-fit items-center gap-2 text-sm">
        <span className="relative flex size-2" aria-hidden>
          {OPEN_TO_WORK && (
            <span className="absolute inset-0 animate-ping rounded-full bg-(--color-brand) opacity-60 motion-reduce:animate-none" />
          )}
          <span
            className={`relative size-2 rounded-full ${
              OPEN_TO_WORK ? "bg-(--color-brand)" : darkTheme ? "bg-on-dark/40" : "bg-ink/40"
            }`}
          />
        </span>
        {OPEN_TO_WORK ? "Open to new work" : "Not taking new work right now"}
      </span>
      <span className={`text-sm ${muted}`}>
        {OPEN_TO_WORK ? "Full-time roles and freelance builds" : "Still happy to chat, say hi"}
      </span>
    </div>
  );
}

function CopyEmail({ muted }: { muted: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      toast.success("Email copied");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy. Select the address to copy it instead.");
    }
  };

  const Icon = copied ? Check : Copy;
  return (
    <div className="flex min-w-0 items-center gap-1">
      <a
        href={`mailto:${siteConfig.email}`}
        className={`min-w-0 truncate text-sm underline-offset-4 hover:underline ${muted} ${focusRing}`}
      >
        {siteConfig.email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email address copied" : "Copy email address"}
        title={copied ? "Copied" : "Copy email address"}
        className={`grid size-11 shrink-0 place-items-center rounded-sm transition-opacity hover:opacity-100 ${
          copied ? "opacity-100" : "opacity-70"
        } ${focusRing}`}
      >
        <Icon aria-hidden size={16} strokeWidth={1.75} className={copied ? "text-(--color-brand)" : ""} />
      </button>
    </div>
  );
}

function Section({
  id,
  label,
  children,
  footer,
}: {
  id: string;
  label: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <m.section {...reveal} aria-labelledby={id} className="flex flex-col">
      <h2 id={id} className="mb-6 text-sm md:mb-8 md:text-lg">
        {`// ${label}`}
      </h2>
      {children}
      {footer && <div className="mt-4 flex justify-end md:mt-6">{footer}</div>}
    </m.section>
  );
}

export default function AboutPage() {
  const { darkTheme } = useGlobalContext();
  const { text, border } = themeTokens(darkTheme);
  // The shared subtle/faint tokens are tuned for large type; body-size text on
  // this page uses a slightly stronger step so it clears 4.5:1 on both themes.
  const muted = darkTheme ? "text-on-dark/65" : "text-ink/75";
  const accent = darkTheme ? "text-(--color-design)" : "text-brand-deep";

  const glance: { value: string; label: string }[] = [
    { value: `${buildingSince}`, label: "Building for the web since" },
    { value: dayJob.company, label: "Currently at" },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className={`${darkTheme ? "dark-theme-bg" : "light-theme-bg"} ${text} min-h-screen w-full`}>
        <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 md:px-16 md:py-32">
          <SectionHeading
            title="ABOUT ME"
            tagline="Who you'd be working with"
            subtle={muted}
            variant="page"
            className="mb-12 md:mb-20"
          />

          <div
            className={`grid grid-cols-1 gap-14 border-t ${border} pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16 md:pt-12`}
          >
            {/* Profile — who, can I hire them, how do I reach them. Sticky so the
                next step stays in reach while the story scrolls. */}
            <m.aside
              aria-label="Profile"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col gap-6 md:sticky md:top-28 md:self-start"
            >
              <Image
                src="/images/portfolio-sq.webp"
                alt="Portrait of Lokesh Yadav"
                width={716}
                height={716}
                sizes="(min-width: 768px) 320px, 160px"
                loading="eager"
                fetchPriority="high"
                className="aspect-square w-32 object-cover sm:w-40 md:w-full md:max-w-xs"
              />

              <div className="flex flex-col gap-1">
                <p className="text-2xl font-medium leading-[115%] tracking-[-0.02em] md:text-3xl">
                  {siteConfig.name}
                </p>
                <p className={`text-base ${muted}`}>Design engineer</p>
              </div>

              <Availability muted={muted} darkTheme={darkTheme} />

              <div className={`flex flex-col gap-2 border-t ${border} pt-4 md:pt-6`}>
                {/* One action here: "Book a call" is already in the navbar, and on
                    mobile the page closes with this same CTA instead. */}
                <div className="hidden text-lg md:block">
                  <BracketLink href="/connect" label="GET IN TOUCH" accent={accent} />
                </div>
                <CopyEmail muted={muted} />
              </div>

              <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm" aria-label="Profiles">
                {socialLinks.map((s) => (
                  <li key={s.platform}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group inline-flex min-h-11 items-center gap-1 ${focusRing}`}
                    >
                      <span className="underline-offset-4 group-hover:underline">{s.platform}</span>
                      <ArrowUpRight aria-hidden size={14} strokeWidth={1.75} className={muted} />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </m.aside>

            <div className="flex min-w-0 flex-col gap-16 md:gap-24">
              {/* Intro — the short version, then the facts a skimmer is looking for */}
              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col gap-10"
              >
                <div className="flex max-w-2xl flex-col gap-5">
                  <p className="text-2xl font-light leading-[125%] tracking-[-0.02em] md:text-4xl">
                    I&apos;m Lokesh, a design engineer who lives at the seam between design and engineering.
                  </p>
                  <p className={`text-base leading-[155%] md:text-lg ${muted}`}>
                    I build fast, interactive web products and sweat the details most people scroll right past.
                    Day to day I&apos;m a {dayJob.role} at {dayJob.company}
                    {freelancing ? ", and I still take on freelance builds on the side." : "."}
                  </p>
                </div>

                <dl className={`grid grid-cols-1 border-t ${border} sm:grid-cols-2`}>
                  {glance.map((g) => (
                    <div key={g.label} className={`flex flex-col-reverse gap-1 border-b ${border} py-5 sm:pr-6`}>
                      <dt className={`text-sm ${muted}`}>{g.label}</dt>
                      <dd className="text-2xl font-light tabular-nums tracking-[-0.02em] md:text-3xl">{g.value}</dd>
                    </div>
                  ))}
                </dl>
              </m.div>

              <Section
                id="about-path"
                label="Path so far"
                footer={
                  <MoreLink href={siteConfig.linkedin} external>
                    Full history on LinkedIn
                  </MoreLink>
                }
              >
                <ol className={`border-t ${border}`}>
                  {experiences.map((e) => (
                    <li
                      key={e.id}
                      className={`grid grid-cols-1 gap-1 border-b ${border} py-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6`}
                    >
                      <p className={`text-sm tabular-nums ${muted} sm:pt-1`}>
                        {formatDate(e.start)} – {e.end ? formatDate(e.end) : "Present"}
                      </p>
                      <div className="flex flex-col gap-1">
                        <h3 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg font-medium leading-[125%] md:text-xl">
                          {e.company}
                          {!e.end && (
                            <span className="inline-flex items-center gap-1.5 border border-(--color-brand) px-2 py-0.5 text-xs font-normal">
                              <span aria-hidden className="size-1.5 rounded-full bg-(--color-brand)" />
                              Current
                            </span>
                          )}
                        </h3>
                        <p className={`text-sm md:text-base ${muted}`}>{e.role}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Section>

              <Section
                id="about-work"
                label="Recent builds"
                footer={<MoreLink href="/projects">All {projectsList.length} projects</MoreLink>}
              >
                <ul className={`border-t ${border}`}>
                  {selectedWork.map((p) => (
                    <li key={p.name} className={`border-b ${border}`}>
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex items-center justify-between gap-6 py-5 ${focusRing}`}
                      >
                        <span className="flex min-w-0 flex-col gap-1">
                          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg font-medium leading-[125%] md:text-xl">
                            <span className="underline-offset-4 group-hover:underline">{p.name}</span>
                            {p.badge && (
                              <span className={`border ${border} px-2 py-0.5 text-xs font-normal`}>{p.badge}</span>
                            )}
                          </span>
                          <span className={`truncate text-sm ${muted}`}>{hostOf(p.link)}</span>
                        </span>
                        <ArrowUpRight
                          aria-hidden
                          size={20}
                          strokeWidth={1.5}
                          className={`shrink-0 ${accent} transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
                        />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section id="about-toolbox" label="Toolbox">
                <div className={`border-t ${border}`}>
                  {stack.map((group) => (
                    <div
                      key={group.label}
                      className={`grid grid-cols-1 gap-3 border-b ${border} py-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6`}
                    >
                      {/* Same height as a chip, so the label centres on the first chip row */}
                      <h3 className="flex items-center gap-2 whitespace-nowrap text-sm uppercase tracking-wide sm:h-8">
                        {group.label}
                        <span className={`text-xs tabular-nums ${muted}`}>({group.items.length})</span>
                      </h3>
                      <ul className="flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <li key={item} className={`inline-flex h-8 items-center border ${border} px-3 text-sm font-light leading-none`}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="about-principles" label="How I work">
                <ol className={`border-t ${border}`}>
                  {principles.map((p, i) => (
                    <li
                      key={p.title}
                      className={`grid grid-cols-1 gap-2 border-b ${border} py-6 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6`}
                    >
                      <span aria-hidden className={`text-sm tabular-nums ${muted} sm:pt-1.5`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex max-w-xl flex-col gap-2">
                        <h3 className="text-xl font-light leading-[120%] tracking-[-0.02em] md:text-2xl">{p.title}</h3>
                        <p className={`text-base leading-[155%] ${muted}`}>{p.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Section>

              {/* On desktop the sticky profile already holds the next step; on
                  mobile it has scrolled away, so end the page with it. */}
              <m.section {...reveal} aria-labelledby="about-next" className="flex flex-col gap-5 md:hidden">
                <h2 id="about-next" className="text-3xl font-thin italic leading-[105%] tracking-[-0.03em]">
                  Got something worth building?
                </h2>
                <p className={`text-base ${muted}`}>Tell me about it, or grab a slot on my calendar.</p>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-1 text-lg">
                  <BracketLink href="/connect" label="GET IN TOUCH" accent={accent} />
                  <BracketLink href={siteConfig.booking} label="BOOK A CALL" accent={accent} external quiet />
                </div>
              </m.section>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
