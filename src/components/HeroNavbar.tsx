"use client";

import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useGlobalContext } from "@/context/globalContext";
import { themeTokens } from "@/lib/theme";

const navLinks = [
  { label: "About Me", href: "/about" },
  { label: "Works", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Connect", href: "/connect" },
];

const HeroNavbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { darkTheme, setDarkTheme } = useGlobalContext();
  const { text, bg, border } = themeTokens(darkTheme);

  // close the mobile menu whenever we land on a new route
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`w-full h-fit z-100 fixed top-0 left-0 transition-colors ${bg} ${text}`}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 items-center p-4 md:grid-cols-3 md:px-16">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="relative h-5 w-5 justify-self-start md:hidden"
        >
          <AnimatePresence initial={false} mode="wait">
            <m.span
              key={isOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0"
            >
              {isOpen ? (
                <X size={20} strokeWidth={1.75} />
              ) : (
                <Menu size={20} strokeWidth={1.75} />
              )}
            </m.span>
          </AnimatePresence>
        </button>

        <div className="hidden gap-4 md:flex items-center">
          <button
            type="button"
            onClick={() => setDarkTheme((prev) => !prev)}
            aria-label={
              darkTheme ? "Switch to light theme" : "Switch to dark theme"
            }
            aria-pressed={darkTheme}
            title={darkTheme ? "Light mode" : "Dark mode"}
            className="relative h-5 w-5 cursor-pointer hover:text-brand"
          >
            <AnimatePresence initial={false} mode="wait">
              <m.span
                key={darkTheme ? "sun" : "moon"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0"
              >
                {darkTheme ? (
                  <Sun size={20} strokeWidth={1.75} />
                ) : (
                  <Moon size={20} strokeWidth={1.75} />
                )}
              </m.span>
            </AnimatePresence>
          </button>
          <Link href="/" className="text-[15px]">
            Lokesh
          </Link>
        </div>

        <nav className="col-start-2 hidden items-center justify-self-center gap-9 text-[15px] md:flex">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group whitespace-nowrap ${
                  darkTheme ? "" : "mix-blend-darken"
                }`}
              >
                <span className="transition-colors group-hover:font-black group-hover:text-brand">
                  {"{"}
                </span>
                <span className={isActive ? "text-brand" : ""}>
                  {` ${item.label} `}
                </span>
                <span className="transition-colors group-hover:font-black group-hover:text-brand ">
                  {"}"}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 justify-self-end">
          <a
            href="https://cal.com/zero1studio"
            target="_blank"
            className="glow-reveal-btn text-[15px]"
          >
            <ArrowUpRight
              className="reveal-arrow text-brand"
              size={16}
              strokeWidth={1.75}
            />
            <span className="text-mask">
              <span className="actual-text">Book a Call</span>
              <span aria-hidden="true" className="hover-layer">
                Book a Call
              </span>
            </span>
          </a>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.nav
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={`overflow-hidden border-t ${border} text-[15px] md:hidden`}
          >
            <div className="flex flex-col gap-4 px-4 pb-6 pt-4">
              <m.a
                href={"/"}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={pathname === "/" ? "text-brand" : ""}
              >
                {`{ Home }`}
              </m.a>
              {navLinks.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <m.a
                    key={item.label}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, delay: 0.08 + index * 0.05 }}
                    className={isActive ? "text-brand" : ""}
                  >
                    {`{ ${item.label} }`}
                  </m.a>
                );
              })}
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default HeroNavbar;
