"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useGlobalContext } from "@/context/globalContext";
import SectionHeading from "./ui/SectionHeading";
import ContactForm from "./ContactForm";
import { socialLinks } from "@/constants/socialLinks";
import { siteConfig } from "@/lib/site";
import { themeTokens } from "@/lib/theme";
import { NewTabHint, focusRing } from "./projects/shared";

type CopyState = "idle" | "copied" | "failed";

// mailto: silently does nothing for people without a mail app, so the address
// is also one click from the clipboard.
function CopyEmail({ subtle }: { subtle: string }) {
  const [state, setState] = useState<CopyState>("idle");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setState("copied");
    } catch {
      setState("failed");
    }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setState("idle"), 2500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={state === "idle" ? "Copy email address" : undefined}
      className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 px-2 text-xs md:text-sm ${
        state === "idle" ? subtle : ""
      } ${focusRing}`}
    >
      {state === "copied" ? (
        <Check aria-hidden size={14} className="text-(--color-brand)" />
      ) : (
        <Copy aria-hidden size={14} />
      )}
      <span aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Couldn't copy, select it instead" : "Copy"}
      </span>
    </button>
  );
}

export default function Contact({
  variant = "section",
}: {
  variant?: "page" | "section";
}) {
  const { darkTheme } = useGlobalContext();
  const { text, subtle, faint, border } = themeTokens(darkTheme);
  const [user, domain] = siteConfig.email.split("@");

  return (
    <section
      id="contact"
      className={`${darkTheme ? "dark-theme-bg" : "light-theme-bg"} ${text} w-full`}
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 md:px-16 md:py-32">
        <SectionHeading
          title="Connect"
          tagline="Hiring, or have a project? Pick the easiest way to reach me"
          subtle={subtle}
          variant={variant}
          className="mb-12 md:mb-24"
        />

        {/* Framed container, shared with Services */}
        <div className={`relative md:border-x ${border} md:px-16 md:py-16 lg:px-20`}>
          <div className="absolute left-0 top-0 hidden h-full w-8 border-y md:block md:w-16" />
          <div className="absolute right-0 top-0 hidden h-full w-8 border-y md:block md:w-16" />

          <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-x-16 lg:gap-x-24">
            {/* Left: direct routes, quickest first */}
            <div className="flex min-w-0 flex-col gap-10 md:col-span-5">
              <h3 className={`text-sm md:text-lg ${subtle}`}>{"// Talk directly"}</h3>

              {/* A call: secondary to the form's Send, so outlined rather than filled */}
              <a
                href={siteConfig.booking}
                target="_blank"
                rel="noopener noreferrer"
                className={`group -mt-4 flex items-center justify-between gap-4 border border-(--color-brand) px-5 py-4 transition-colors md:px-6 md:py-5 ${
                  darkTheme ? "hover:bg-on-dark/5" : "hover:bg-ink/5"
                } ${focusRing}`}
              >
                <span className="flex flex-col gap-1">
                  <span className="text-lg font-semibold leading-tight md:text-xl">Book a call</span>
                  <span className={`text-xs md:text-sm ${subtle}`}>Pick a time on cal.com</span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  size={22}
                  strokeWidth={1.75}
                  className="shrink-0 text-(--color-brand) transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
                <NewTabHint />
              </a>

              <div className="flex flex-col gap-1">
                <span className={`text-xs md:text-sm ${faint}`}>Email</span>
                <div className="flex min-w-0 items-center justify-between gap-2">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className={`min-w-0 text-base underline decoration-(--color-brand) decoration-1 underline-offset-4 md:text-lg lg:text-xl ${focusRing}`}
                  >
                    {/* Only let the address wrap after the "@" */}
                    {user}@<wbr />
                    {domain}
                  </a>
                  <CopyEmail subtle={subtle} />
                </div>
              </div>

              <div className="flex flex-col">
                <span className={`mb-1 text-xs md:text-sm ${faint}`}>Elsewhere</span>
                <ul className={`border-t ${border}`}>
                  {socialLinks.map((link) => (
                    <li key={link.platform} className={`border-b ${border}`}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex min-h-12 items-center justify-between gap-4 py-3 ${focusRing}`}
                      >
                        <span className="text-base md:text-lg">{link.platform}</span>
                        <span className={`flex items-center gap-1 text-sm ${subtle}`}>
                          {link.handle}
                          <ArrowUpRight
                            aria-hidden
                            size={14}
                            strokeWidth={1.75}
                            className="text-(--color-brand) transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </span>
                        <NewTabHint />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: the form */}
            <div className="min-w-0 md:col-span-7">
              <h3 className={`mb-6 text-sm md:text-lg ${subtle}`}>{"// Or leave a message"}</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
