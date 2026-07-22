"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useGlobalContext } from "@/context/globalContext";

function Section3() {
  gsap.registerPlugin(ScrollTrigger);
  const { darkTheme } = useGlobalContext();

  useGSAP(() => {
    gsap.to(".word-text, .inner-circle, .middle-circle, .outer-circle", {
      rotation: 0,
      scrollTrigger: {
        trigger: ".word",
        start: "top top",
        end: `+=${window.innerHeight}`,
        scrub: 1,
      },
    });

    gsap.to(".word", {
      scrollTrigger: {
        trigger: ".word",
        start: "top top",
        end: `+=${window.innerHeight}`,
        pin: true,
        scrub: 1,
      },
    });
  }, []);

  return (
    <>
      <div
        className={` font-mono ${darkTheme ? "dark-theme-bg" : "light-theme-bg"
          } word h-dvh z-[100] text-[100px] md:text-[210px] font-bold leading-[120%] md:leading-[230px] whitespace-normal md:whitespace-nowrap overflow-hidden flex justify-center items-center text-center`}
      >
        <div
          className={`${darkTheme
            ? "dark-theme-bg dark-theme-text"
            : "light-theme-bg light-theme-text"
            } word-text rotate-10 z-[100] flex flex-col justify-center items-center text-center`}
        >
          <div>
            <span className="text-(--color-design)">Build</span> clean.
          </div>
          <div>
            Ship <span className="">fast.</span>
          </div>
        </div>
        <div
          className={`${darkTheme
            ? "dark-theme-bg-light dark-theme-text"
            : "light-theme-bg-light light-theme-text"
            } outer-circle rounded-full border-2 border-on-dark overflow-hidden w-[100vw] h-[100vw] md:w-[45vw] md:h-[45vw] z-[120] -rotate-10 flex flex-col justify-center items-center absolute text-center`}
        >
          <div className="">
            <span className="text-(--color-design)">Build</span> clean.
          </div>
          <div>
            Ship <span className="">fast.</span>
          </div>
        </div>
        <div
          className={`${darkTheme
            ? "dark-theme-bg dark-theme-text"
            : "light-theme-bg light-theme-text"
            } middle-circle rounded-full border-2 border-on-dark overflow-hidden w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] z-[140] rotate-10 flex flex-col justify-center items-center absolute text-center`}
        >
          <div className="">
            <span className="text-(--color-design)">Build</span> clean.
          </div>
          <div>
            Ship <span className="">fast.</span>
          </div>
        </div>
        <div
          className={`${darkTheme
            ? "dark-theme-bg-light dark-theme-text"
            : "light-theme-bg-light light-theme-text"
            } inner-circle rounded-full border-2 border-on-dark overflow-hidden w-[30vw] h-[30vw] md:w-[15vw] md:h-[15vw] z-[150] -rotate-10 flex flex-col justify-center items-center absolute text-center`}
        >
          <div>
            <span className="text-(--color-design)">Build</span> clean.
          </div>
          <div>
            Ship <span className="">fast.</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Section3;
