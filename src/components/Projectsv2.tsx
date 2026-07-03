"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { getProjectsForPage } from "../constants/projectData";
import { useState } from "react";
import { useGlobalContext } from "@/context/globalContext";
import { gsap } from "gsap";
import useWindow from "../hooks/useWindow";
import ProjectCard from "./ProjectCard";
import { ProjectDialog } from "./ProjectDialog";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Projectsv2() {
  const projectsList = getProjectsForPage("home");
  const { isMobile } = useWindow();
  const { darkTheme } = useGlobalContext();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeProject, setActiveProject] = useState(null);
  const [open, setOpen] = useState(false);
  const projectSectionRef = useRef(null);

  const handleOpenProject = (project) => {
    setActiveProject(project);
    setOpen(true);
  };

  const handleCloseProject = (openState) => {
    if (!openState) {
      setActiveProject(null);
      setOpen(false);
    }
  };

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

  const handleScroll = () => {
    const projectsEl = document.querySelector("#projects") as HTMLElement | null;
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
        className={` ${darkTheme
          ? "dark-theme-bg dark-theme-text"
          : "light-theme-bg light-theme-text"
          } projects overflow-hidden flex md:flex-col md:justify-center items-center z-50 relative`}
      >
        <div
          className={`work-project h-dvh w-screen flex flex-col justify-center items-center shrink-0 z-10`}
        >

          <div className="relative w-fit h-fit text-center text-[50px] md:text-[130px] font-bold tracking-[5%] leading-[70%] px-[10px]">
            <div className="absolute  leading-normal text-[6px] md:text-xs text-(--color-design) font-semibold right-[98%] top-[5%] flex flex-col items-end">
              <span>SOME</span> <span>SELECTED</span>
            </div>
            PROJECTS
            <div className="text-center absolute leading-normal text-[5px] md:text-xs font-normal px-3 top-[120%] left-1/2 -translate-x-1/2">
              CUSTOMER PROJECTS , PERSONAL PROJECTS <br />
              SOME RESEARCH AND PLAYGROUND.
            </div>
            <div className="absolute  leading-normal text-[5px] text-left md:text-xs text-(--color-design) font-semibold left-[98%] top-[5%]">
              WEB <br />
              DEVELOPMENT
            </div>
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
              handleOpenProject={handleOpenProject}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>

      <ProjectDialog
        project={activeProject}
        open={open}
        onOpenChange={handleCloseProject}
      />
    </>
  );
}

export default Projectsv2;
