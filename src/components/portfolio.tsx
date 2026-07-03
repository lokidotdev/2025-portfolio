"use client";

import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/globalContext";
import { AnimatePresence, motion } from "motion/react";
import { Github, Linkedin, Mail, Play, X } from "lucide-react";
import Link from "next/link";
import useWindow from "../hooks/useWindow";
import SocialHoverCard from "./SocialHoverCard";

const socialLinks = [
  {
    icon: <Github size={28} strokeWidth={1.5} />,
    link: "https://github.com/lokidotdev",
    label: "Github",
    platform: "github" as const,
  },
  {
    icon: <Linkedin size={28} strokeWidth={1.5} />,
    link: "https://www.linkedin.com/in/yadav-lokesh/",
    label: "LinkedIn",
    platform: "linkedin" as const,
  },
  {
    icon: <X size={28} strokeWidth={1.5} />,
    link: "https://www.x.com/lokidotdev/",
    label: "X",
    platform: "twitter" as const,
  },
  {
    icon: <Mail size={28} strokeWidth={1.5} />,
    link: "mailto:lokeshyadv8177@gmail.com",
    label: "Email",
    platform: null,
  },
];

const conatinerVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.5,
    },
  },
};

const descVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut" as const,
    },
  },
};

const Portfolio = () => {
  const { darkTheme } = useGlobalContext();
  const { isMobile } = useWindow();
  const [title, setTitle] = useState("Design");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (count % 3 === 0) {
        setTitle("Frontend");
      } else if (count % 3 === 1) {
        setTitle("Full Stack");
      } else {
        setTitle("Design");
      }
      setCount((prev) => prev + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [count]);

  return (
    <>
      <div
        className={`portfolio-main w-screen overflow-x-hidden transition-all duration-500 ease-in-out font-mono leading-tight tracking-[-3%] ${darkTheme ? "dark-theme-bg" : "light-theme-bg"
          } `}
      >
        <section className="portfolio min-h-screen md:h-screen transition-all duration-500 ease-in-out w-full md:w-screen flex relative">
          <div className="portfolio-section w-full md:w-screen transition-all duration-500 ease-in-out flex flex-col-reverse gap-10 md:gap-0 md:flex-row justify-center md:justify-around items-center">
            <div className="relative flex flex-col w-full md:w-auto items-center md:items-start">
              <motion.div
                initial={isMobile ? {
                  opacity: 0,
                  filter: "blur(5px)",
                  x: 0,
                  y: "10%",
                  scale: 1.1,
                } : {
                  opacity: 0,
                  filter: "blur(5px)",
                  x: "-10%",
                  y: 0,
                  scale: 1.1,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  filter: "blur(0px)",
                  scale: 1,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="portfolio-desc flex flex-col cursor-pointer px-6 md:px-0 w-full items-center md:items-start whitespace-nowrap"
              >
                <div
                  className={`${darkTheme
                    ? "[-webkit-text-stroke:0.4px_white] md:[-webkit-text-stroke:1px_white]"
                    : "[-webkit-text-stroke:0.4px_#212529] md:[-webkit-text-stroke:1px_#212529]"
                    } desc-1 uppercase relative text-transparent text-[32px] md:text-[50px] lg:text-[70px] font-bold transition-all duration-500 ease-in-out before:content-[attr(data-text)] before:w-0 before:absolute before:overflow-hidden before:transition-all before:duration-300 before:ease-out before:z-10 before:whitespace-nowrap hover:before:w-full hover:before:transition-all hover:before:duration-500 hover:before:ease-linear ${darkTheme ? "before:text-white" : "before:text-[#212529]"
                    }`}
                  id="portfolio-desc"
                  data-text="Hi i'm Lokesh"
                >
                  Hi i'm
                  Lokesh
                </div>
                <div
                  className={`${darkTheme
                    ? "[-webkit-text-stroke:0.4px_white] md:[-webkit-text-stroke:1px_white]"
                    : "[-webkit-text-stroke:0.4px_#212529] md:[-webkit-text-stroke:1px_#212529]"
                    } desc-2 uppercase relative text-transparent text-[32px] md:text-[50px] lg:text-[70px] font-bold transition-all duration-500 ease-in-out before:content-[attr(data-text)] before:w-0 before:absolute before:overflow-hidden before:transition-all before:duration-300 before:ease-out before:z-10 before:whitespace-nowrap hover:before:w-full hover:before:transition-all hover:before:duration-500 hover:before:ease-linear ${darkTheme ? "before:text-white" : "before:text-(--title-color)"
                    }`}
                  id="portfolio-desc"
                  data-text={`A ${title}`}
                  style={
                    {
                      "--title-color":
                        title === "Design"
                          ? "var(--color-design)"
                          : title === "Frontend"
                            ? "var(--color-frontend)"
                            : "var(--color-fullstack)",
                      "--title-shadow":
                        title === "Design"
                          ? "var(--shadow-design)"
                          : title === "Frontend"
                            ? "var(--shadow-frontend)"
                            : "var(--shadow-fullstack)",
                    } as React.CSSProperties
                  }
                >
                  A <AnimatePresence mode="wait"><motion.span
                    key={title}
                    initial={{ filter: "blur(4px)", opacity: 0 }}
                    animate={{ filter: "blur(0px)", opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    exit={{ filter: "blur(4px)", opacity: 0 }}
                    className="inline-block text-(--title-color) [text-shadow:0_2px_12px_var(--title-shadow)] [-webkit-text-stroke:0.4px_var(--title-color)] md:[-webkit-text-stroke:1px_var(--title-color)] before:z-20 before:text-(--title-color)">{title}</motion.span>
                  </AnimatePresence> </div>
                <div
                  className={`${darkTheme
                    ? "[-webkit-text-stroke:0.4px_white] md:[-webkit-text-stroke:1px_white]"
                    : "[-webkit-text-stroke:0.4px_#212529] md:[-webkit-text-stroke:1px_#212529]"
                    } desc-3 uppercase relative text-transparent text-[32px] md:text-[50px] lg:text-[70px] font-bold transition-all duration-500 ease-in-out before:content-[attr(data-text)] before:w-0 before:absolute before:overflow-hidden before:transition-all before:duration-300 before:ease-out before:z-10 before:whitespace-nowrap hover:before:w-full hover:before:transition-all hover:before:duration-500 hover:before:ease-linear ${darkTheme ? "before:text-white" : "before:text-[#212529]"
                    }`}
                  id="portfolio-desc"
                  data-text="Engineer."
                >
                  Engineer.
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-8 flex flex-col gap-6 max-w-fit md:absolute top-full"
              >
                {/* Buttons */}
                <div className="flex gap-4 flex-col md:flex-row">
                  <button
                    onClick={() => {
                      window.scrollTo({
                        top: document.getElementById("projects").offsetTop,
                        behavior: "smooth",
                      });
                    }}
                    className={`px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${darkTheme
                      ? "light-theme-shadow light-theme-bg text-black"
                      : "dark-theme-shadow dark-theme-bg text-white"
                      }`}
                  >
                    View Projects
                  </button>
                  <button
                    onClick={() => {
                      window.scrollTo({
                        top: document.getElementById("contact").offsetTop,
                        behavior: "smooth",
                      });
                    }}
                    className={`px-8 py-3 rounded-full font-semibold transition-all hover:bg-opacity-10 ${darkTheme
                      ? "dark-theme-shadow dark-theme-bg text-white"
                      : "light-theme-shadow light-theme-bg text-black"
                      }`}
                  >
                    Contact Me
                  </button>
                </div>

                <motion.div
                  variants={conatinerVariants}
                  initial="hidden"
                  animate="show"
                  className="flex gap-6 items-center mt-2 ms-6 justify-center md:justify-start"
                >
                  {socialLinks.map((link, index) => {
                    const anchor = (
                      <Link
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`transition-transform hover:scale-110 ${darkTheme
                          ? "text-gray-400 hover:text-(--color-design)"
                          : "text-gray-600 hover:text-(--color-design)"
                          }`}
                        aria-label={link.label}
                      >
                        {link.icon}
                      </Link>
                    );

                    return (
                      <motion.div
                        variants={descVariants}
                        key={index}
                        className="flex items-center"
                      >
                        {link.platform && !isMobile ? (
                          <SocialHoverCard
                            platform={link.platform}
                            darkTheme={darkTheme}
                          >
                            {anchor}
                          </SocialHoverCard>
                        ) : (
                          anchor
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              initial={isMobile ? {
                opacity: 0,
                filter: "blur(5px)",
                x: 0,
                y: "10%",
                scale: 1.1,
              } : {
                opacity: 0,
                filter: "blur(5px)",
                x: "10%",
                y: 0,
                scale: 1.1,
              }}
              animate={{
                opacity: 1,
                x: 0,
                y: 0,
                filter: "blur(0px)",
                scale: 1,
              }}
              transition={{
                duration: 0.5,
              }}
              className="pe-2 flex justify-center items-center relative"
            >
              <img
                className={`${darkTheme ? "dark-theme-border" : "light-theme-border"
                  } md:w-[400px] sm:w-[300px] w-[250px] rounded-full transition-all duration-500 ease-in-out`}
                src={isMobile ? "images/portfolio-sq.png" : "images/portfolio.jpg"}
                alt=""
              />
            </motion.div>
          </div>

          {/* <div className="absolute bottom-10 left-0 w-full z-10 flex justify-center items-center">
            <div className=" w-full max-w-7xl rounded-[20px] flex justify-between items-center ">
              <div>Local time : 10:00 AM</div>
              <div className="p-3 flex items-center gap-3">
                <div className="flex flex-col justify-center items-center h-full gap-3">
                  <div className="flex justify-between items-center w-full">
                    <button className=" text-black px-4 py-2 rounded-md">
                      <Play size={20} />
                    </button>
                    <p>name</p>
                  </div>
                  <div className="w-[200px] h-1 rounded-full bg-gray-500"></div>
                </div>
                <div className="h-20 w-20 rounded-md bg-gray-500"></div>
              </div>
            </div>
          </div> */}
        </section>
      </div>
    </>
  );
};

export default Portfolio;
