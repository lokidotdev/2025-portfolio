"use client";

import { ArrowUpRight } from "lucide-react";

const navLinks = [
  { label: "About Me", href: "/about" },
  { label: "Works", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Connect", href: "/connect" },
];

const HeroNavbar = () => {
  return (
    <header className="w-screen h-fit z-100 fixed top-0 bg-[#f5f5f5]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 items-center p-4 md:grid-cols-3 md:px-16">
        <a href="/" className="text-[15px]">Lokesh</a>

        <nav className="col-start-2 hidden items-center justify-self-center gap-9 text-[15px] md:flex">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group whitespace-nowrap  mix-blend-darken"
            >
              <span className="transition-all group-hover:font-black group-hover:text-red-600">
                {"{"}
              </span>
              {` ${item.label} `}
              <span className="transition-all group-hover:font-black group-hover:text-red-600 ">
                {"}"}
              </span>
            </a>
          ))}
        </nav>

        <a
          href="https://cal.com/zero1studio"
          target="_blank"
          className="glow-reveal-btn justify-self-end text-[15px]"
        >
          <ArrowUpRight className="reveal-arrow text-red-600" size={16} strokeWidth={1.75} />
          <span className="text-mask">
            <span className="actual-text">Book a Call</span>
            <span aria-hidden="true" className="hover-layer">
              Book a Call
            </span>
          </span>
        </a>
      </div>
    </header>
  );
};

export default HeroNavbar;
