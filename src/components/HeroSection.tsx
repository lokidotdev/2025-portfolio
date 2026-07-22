"use client";

import Link from "next/link";
import { Github, Mail, X } from "lucide-react";
import { useGlobalContext } from "@/context/globalContext";
import { themeTokens } from "@/lib/theme";
import ProximityText from "./ui/ProximityText";
import Typewriter from "./ui/Typewriter";
import MagneticButton from "./ui/MagneticButton";
import SocialHoverCard from "./SocialHoverCard";
import { motion } from "motion/react";

type Platform = "github" | "twitter";

const socialLinks: {
  icon: React.ReactNode;
  href: string;
  label: string;
  platform?: Platform;
}[] = [
  {
    icon: <Github size={22} strokeWidth={1.5} />,
    href: "https://github.com/lokidotdev",
    label: "Github",
    platform: "github",
  },
  {
    icon: <X size={20} strokeWidth={1.5} />,
    href: "https://www.x.com/lokidotdev/",
    label: "X",
    platform: "twitter",
  },
  {
    icon: <Mail size={22} strokeWidth={1.5} />,
    href: "mailto:lokeshyadv8177@gmail.com",
    label: "Email",
  },
];

const DESC =
  "Full-stack web developer building fast, interactive, and visually polished web experiences with modern technologies.";

const HeroSection = () => {
  const { isLoading, darkTheme } = useGlobalContext();
  const { text, bg } = themeTokens(darkTheme);

  return (
    <div
      className={`${bg} ${text} transition-colors flex min-h-screen w-full flex-col max-h-[678px] md:max-h-[1036px]`}
    >
      <main className="mx-auto p-4 md:p-20 flex w-full max-w-7xl flex-1 flex-col justify-center items-center gap-12 md:gap-20">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9, backdropFilter: "blur(2px)" }}
          animate={
            !isLoading && {
              opacity: 1,
              scale: 1,
              backdropFilter: "blur(0px)",
            }
          }
          className="hidden md:block hero-heading w-full text-center italic md:text-[8vw] font-thin tracking-[-8%] leading-[100%]"
        >
          <ProximityText
            text="DESiGN ENGiNEER"
            className="justify-center"
            maxDistance={200}
            minWeight={100}
            maxWeight={700}
          />
        </motion.h1>

        <div className="flex flex-col gap-4 md:hidden items-center justify-start w-full">
          <div className="flex gap-4 items-center w-full">
            <motion.img
              initial={{ opacity: 0, scale: 0.9, backdropFilter: "blur(2px)" }}
              animate={
                !isLoading && {
                  opacity: 1,
                  scale: 1,
                  backdropFilter: "blur(0px)",
                }
              }
              src="/images/portfolio-sq.png"
              alt="Lokesh Yadav"
              className="h-20 w-20 md:h-60 md:w-60 shrink-0 object-contain "
            />
            <h1 className="hero-heading w-full text-left italic text-5xl font-thin tracking-[-8%] leading-[100%]">
              DESiGN <br /> ENGiNEER
            </h1>
          </div>
          <p className=" desc leading-[110%] tracking-tight min-h-[3.6em] font-light pr-3">
            {/* type the intro in once the loader clears */}
            <Typewriter
              text={DESC}
              start={!isLoading}
              speed={18}
              startDelay={300}
            />
          </p>
        </div>

        <div className=" flex w-full mx-auto max-w-2xl items-center gap-4 md:justify-center md:gap-14">
          <motion.img
            initial={{ opacity: 0, scale: 0.9, backdropFilter: "blur(2px)" }}
            animate={
              !isLoading && {
                opacity: 1,
                scale: 1,
                backdropFilter: "blur(0px)",
              }
            }
            src="/images/portfolio-sq.png"
            alt="Lokesh Yadav"
            className="h-10 w-10 md:h-60 md:w-60 shrink-0 object-contain hidden md:block"
          />

          <div className="flex flex-col gap-8 md:justify-between md:text-left text-xs md:text-xl self-stretch font-light md:font-normal flex-1 min-w-0">
            <p className=" desc leading-[110%] tracking-tight min-h-[3.6em] hidden md:block w-full text-left">
              {/* type the intro in once the loader clears */}
              <Typewriter
                text={DESC}
                start={!isLoading}
                speed={18}
                startDelay={300}
              />
            </p>

            <ul className="flex flex-col gap-1.5 text-sm md:text-lg leading-[110%] tracking-tight overflow-hidden">
              <li>
                //{" "}
                <motion.span
                  className="inline-block"
                  initial={{
                    x: "-100%",
                    opacity: 0,
                  }}
                  animate={
                    !isLoading && {
                      x: "0%",
                      opacity: 1,
                    }
                  }
                >
                  FRONTEND
                </motion.span>
              </li>
              <li>
                //{" "}
                <motion.span
                  className="inline-block"
                  initial={{
                    x: "-100%",
                    opacity: 0,
                  }}
                  animate={
                    !isLoading && {
                      x: "0%",
                      opacity: 1,
                    }
                  }
                >
                  BACKEND
                </motion.span>
              </li>
              <li>
                //{" "}
                <motion.span
                  className="inline-block"
                  initial={{
                    x: "-100%",
                    opacity: 0,
                  }}
                  animate={
                    !isLoading && {
                      x: "0%",
                      opacity: 1,
                    }
                  }
                >
                  DESIGN
                </motion.span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-20 w-full md:w-fit text-base md:text-2xl font-light md:font-normal">
          <MagneticButton strength={0.4}>
            <a
            href="/connect"
            className="leading-[110%] tracking-tight text-(--color-design) text-left cursor-pointer whitespace-nowrap overflow-hidden">
              [{" "}
              <motion.span
                initial={{
                  width: "0%",
                  opacity: 0,
                }}
                animate={
                  !isLoading && {
                    width: "auto",
                    opacity: 1,
                  }
                }
                transition={
                  !isLoading && {
                    delay: 0.2,
                  }
                }
                className="inline-block"
              >
                AVAILABLE FOR WORK
              </motion.span>{" "}
              ]
            </a>
          </MagneticButton>

          <div className="hidden md:flex items-center gap-6">
            {socialLinks.map((link) => {
              const anchor = (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="inline-flex transition-transform duration-200 ease-out hover:scale-110 hover:text-(--color-design) active:scale-95"
                >
                  <motion.span
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      backdropFilter: "blur(2px)",
                    }}
                    animate={
                      !isLoading && {
                        opacity: 1,
                        scale: 1,
                        backdropFilter: "blur(0px)",
                      }
                    }
                    className="span"
                  >
                    {link.icon}
                  </motion.span>
                </Link>
              );

              return link.platform ? (
                <SocialHoverCard
                  key={link.label}
                  platform={link.platform}
                  darkTheme={darkTheme}
                >
                  {anchor}
                </SocialHoverCard>
              ) : (
                anchor
              );
            })}
          </div>

          <button
            onClick={() => {
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="leading-[110%] transition-colors duration-200 ease-out hover:text-(--color-design) whitespace-nowrap overflow-hidden text-left md:text-right"
          >
            [{" "}
            <motion.span
              initial={{
                width: "0%",
                opacity: 0,
              }}
              animate={
                !isLoading && {
                  width: "auto",
                  opacity: 1,
                }
              }
              transition={
                !isLoading && {
                  delay: 0.2,
                }
              }
              className="inline-block "
            >
              RECENT PROJECTS
            </motion.span>{" "}
            ]
          </button>
        </div>

        <div className="md:hidden flex gap-4 w-full">
          {socialLinks.map((link) => {
            const anchor = (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="inline-flex transition-transform duration-200 ease-out hover:scale-110 hover:text-(--color-design) active:scale-95"
              >
                {link.icon}
              </Link>
            );

            return link.platform ? (
              <SocialHoverCard
                key={link.label}
                platform={link.platform}
                darkTheme={darkTheme}
              >
                {anchor}
              </SocialHoverCard>
            ) : (
              anchor
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default HeroSection;
