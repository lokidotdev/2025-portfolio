"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getFrequency, getTranslateX } from "../lib/helper";

const ProjectCard = ({
  data,
  index,
  darkTheme,
  scrollProgress,
  isMobile,
}) => {

  return (
    <div key={index} className={` w-full flex justify-center `}>
      <div
        style={{
          transform: `${isMobile ? "translateY" : "translateX"
            }(${getTranslateX(isMobile, index, scrollProgress)}px)`,
        }}
        className="h-[300px] md:h-[600px] w-full overflow-hidden flex items-center justify-center"
      >
        <Link
          href={data.link}
          target="_blank"
          rel="noopener noreferrer"
          className="h-[300px] w-[400px] md:h-[600px] md:w-[800px] relative flex items-center md:justify-start   overflow-visible hover:cursor-pointer group "
        >
          {/* sq edges  */}

          {/* <div className={`absolute ${getFrequency(index, scrollProgress) < 0 ? 'left-0' : 'right-0'} w-1/6 h-2 bg-brand -bottom-2`}></div>
          <div className={`absolute ${getFrequency(index, scrollProgress) < 0 ? '-left-2' : '-right-2'} w-2 h-1/6 bg-brand bottom-0`}></div> */}
          <div
            className={`h-[300px] w-[400px] md:h-[600px] md:w-[50%] overflow-hidden relative project-card-${index + 1
              }
            ${darkTheme ? "opacity-80" : "opacity-100"}
            transition-shadow duration-500 ease-out 
            `}
          >
            {/* description  */}
            <div className="absolute top-0 left-0 w-full h-full z-20 flex items-end justify-center">
              <div
                className={`bg-linear-to-b from-transparent to-45% to-ink
                w-full flex flex-col gap-2 md:gap-3 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 opacity-0 transition-[opacity,transform] duration-500 ease-out p-5 md:p-8`}
              >
                {/* <div className="text-(--color-design) text-[8px] md:text-xs font-semibold tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  [ SELECTED WORK ]
                </div> */}
                <div
                  className={`hero-heading text-on-dark text-xl md:text-3xl italic font-thin tracking-[-0.03em] leading-[100%]`}
                >
                  {data.name}
                </div>
                <div className={`text-on-dark/70 text-xs md:text-base font-light tracking-tight space-y-1.5 md:space-y-2`}>
                  {data.points.map((point, i) => (
                    <div
                      key={point}
                      className={`
                      ${i === data.points.length - 1
                          ? "text-(--color-design) w-fit tracking-[0.05em] uppercase text-[10px] md:text-sm"
                          : ""
                        }
                      `}
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Image
              src={`/${data.desktopImage}`}
              alt={data.name}
              width={800}
              height={600}
              sizes="(max-width: 768px) 400px, 800px"
              priority={index === 0}
              className={`h-[300px] md:h-[600px] object-cover z-10 absolute w-[400px] md:w-[800px] scale-150 transition-transform duration-700 ease-out group-hover:scale-[1.6] project-img-${index + 1
                }`}
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
