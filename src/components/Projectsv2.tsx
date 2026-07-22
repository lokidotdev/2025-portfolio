"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { getProjectsForPage } from "../constants/projectData";
import { useState } from "react";
import { useGlobalContext } from "@/context/globalContext";
import { gsap } from "gsap";
import useWindow from "../hooks/useWindow";
import ProjectCard from "./ProjectCard";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProximityText from "./ui/ProximityText";

gsap.registerPlugin(ScrollTrigger);

function Projectsv2() {
  const projectsList = getProjectsForPage("home");
  const { isMobile } = useWindow();
  const { darkTheme } = useGlobalContext();
  const [scrollProgress, setScrollProgress] = useState(0);
  const projectSectionRef = useRef(null);

  useEffect(() => {
    const section = document.querySelector(".skills-section");
    if (!section) return;

    const ro = new ResizeObserver((event) => {
      ScrollTrigger.refresh();
    });

    ro.observe(section);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobile) {
        const container = projectSectionRef.current;
        const leftScroll =
          container.getBoundingClientRect().right -
          container.getBoundingClientRect().left;

        gsap.to(".work-project", {
          opacity: 0,
          scrollTrigger: {
            trigger: ".work-project",
            start: "top top",
            end: `+=${window.innerHeight}`,
            scrub: 1,
          },
        });

        const horizontalTween = gsap.to(".projects-container", {
          x: -(leftScroll + window.innerWidth / 4),
          ease: "none",
          scrollTrigger: {
            trigger: "#projects",
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => "+=" + leftScroll,
            invalidateOnRefresh: true,
          },
        });

        projectsList.forEach((_, i) => {
          const cardSelector = `.project-card-${i + 1}`;
          const imgSelector = `.project-img-${i + 1}`;

          gsap.to(cardSelector, {
            width: "100%",
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardSelector,
              containerAnimation: horizontalTween,
              start: "left 100%",
              end: "center left",
              scrub: 1,
            },
          });

          gsap.to(imgSelector, {
            scale: 1,
            scrollTrigger: {
              trigger: cardSelector,
              containerAnimation: horizontalTween,
              start: "left 100%",
              end: "center center",
              scrub: 1,
            },
          });
        });
      } else {
        gsap.to(".work-project", {
          opacity: 0,
          scrollTrigger: {
            trigger: ".work-project",
            start: "top top",
            end: `+=${window.innerHeight}`,
            pin: true,
            pinSpacing: false,
            scrub: 1,
          },
        });

        projectsList.forEach((_, i) => {
          gsap.to(`.project-card-${i + 1}`, {
            width: "100%",
            scrollTrigger: {
              trigger: `.project-card-${i + 1}`,
              start: "top bottom",
              end: "top top",
              scrub: 1,
            },
          });

          gsap.to(`.project-img-${i + 1}`, {
            scale: 1,
            scrollTrigger: {
              trigger: `.project-card-${i + 1}`,
              start: "top bottom",
              end: "center center",
              scrub: 1,
            },
          });
        });
      }
    });

    return () => ctx.revert();
  }, [isMobile, projectSectionRef]);

  useLayoutEffect(() => {
    gsap.fromTo(
      ".project-text",
      {
        letterSpacing: "100%",
      },
      {
        letterSpacing: "5%",
        scrollTrigger: {
          trigger: ".project-text",
          start: "top bottom",
          end: `top center`,
          scrub: 1,
        },
      },
    );
    gsap.fromTo(
      ".project-top-text",
      {
        y: "100%",
      },
      {
        y: "0%",
        scrollTrigger: {
          trigger: ".project-text",
          start: "top center",
          end: `center center`,
          scrub: 1,
        },
      },
    );
    gsap.fromTo(
      ".project-bottom-text",
      {
        x: "100%",
      },
      {
        x: "0%",
        scrollTrigger: {
          trigger: ".project-text",
          start: "top center",
          end: `center center`,
          scrub: 1,
        },
      },
    );
  }, []);

  const handleScroll = () => {
    const projectsEl = document.querySelector(
      "#projects",
    ) as HTMLElement | null;
    if (projectsEl) {
      const scrollOffset = projectsEl.offsetTop - window.innerHeight;
      setScrollProgress(Math.max(1, window.scrollY - scrollOffset));
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        id="projects"
        className={` ${
          darkTheme
            ? "dark-theme-bg dark-theme-text"
            : "light-theme-bg light-theme-text"
        } projects overflow-hidden flex md:flex-col md:justify-center items-center z-50 relative`}
      >
        <div
          className={`work-project h-dvh w-screen flex flex-col justify-center items-center shrink-0 z-10`}
        >
          <div className="relative  w-fit h-fit text-center text-5xl md:text-[8vw] leading-[70%] px-[10px] font-light">
            <div className="absolute overflow-y-hidden leading-tight text-[6px] md:text-[10px] text-(--color-design) left-[6%] bottom-[110%] flex flex-col text-left font-normal">
              <div className="project-top-text flex flex-col">
                <span>SOME</span> <span>SELECTED</span>
              </div>
            </div>
            <div className="project-text font-thin italic tracking-[-8%] ">
              <ProximityText
                text="PROJECTS"
                className="justify-center whitespace-nowrap"
                maxDistance={200}
                minWeight={100}
                maxWeight={700}
              />
            </div>

            <div className="text-right absolute leading-tight text-[6px] md:text-[10px] font-normal top-[120%] right-[2%] overflow-hidden">
              <div className="project-bottom-text">
                CUSTOMER PROJECTS , PERSONAL PROJECTS <br />
                SOME RESEARCH AND PLAYGROUND.
              </div>
            </div>
            {/* <div className="absolute  leading-normal text-[5px] text-left md:text-xs text-(--color-design) left-[98%] top-[5%] font-normal">
              WEB <br />
              DEVELOPMENT
            </div> */}
          </div>
        </div>

        <div
          ref={projectSectionRef}
          className="projects-container flex md:flex-col items-center justify-center min-h-screen z-20 p-12 font-mono"
        >
          {projectsList?.map((data, index) => (
            <ProjectCard
              key={index}
              data={data}
              darkTheme={darkTheme}
              index={index}
              scrollProgress={scrollProgress}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Projectsv2;
