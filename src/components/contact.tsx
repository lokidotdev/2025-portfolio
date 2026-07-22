"use client";

import { motion } from "framer-motion";
import { useGlobalContext } from "@/context/globalContext";
import ProximityText from "./ui/ProximityText";
import ContactForm from "./ContactForm";
import { socialLinks } from "@/constants/socialLinks";
import { themeTokens } from "@/lib/theme";

export default function Contact() {
  const { darkTheme } = useGlobalContext();

  const { text, subtle, border } = themeTokens(darkTheme);

  return (
    <div
      id="contact"
      className={`${
        darkTheme ? "dark-theme-bg" : "light-theme-bg"
      } ${text} w-full`}
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 md:px-16 md:py-32">
        {/* Header */}
        <div className="mb-12 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className={`mb-3 text-sm md:mb-6 md:text-lg ${subtle}`}
          >
            // Let&apos;s build something together
          </motion.p>

          <h1 className="hero-heading w-full italic text-5xl font-thin tracking-[-0.04em] leading-[100%] md:text-[8vw]">
            <ProximityText
              text="GET IN TOUCH"
              maxDistance={200}
              minWeight={100}
              maxWeight={700}
            />
          </h1>
        </div>

        {/* Framed container */}
        <div className={`relative md:border-x ${border} md:px-20 md:py-24`}>
          <div className="hidden md:block border-y absolute h-full w-8 left-0 top-0 md:w-16"></div>
          <div className="hidden md:block border-y absolute h-full w-8 right-0 top-0 md:w-16"></div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-24">
            {/* Left — Form */}
            <div>
              <p className={`mb-8 text-sm md:mb-10 md:text-lg ${subtle}`}>
                // Message me directly
              </p>

              <ContactForm />
            </div>

            {/* Right — Social links */}
            <div className="flex w-full min-w-0 flex-col items-start gap-8 md:items-end md:gap-10 md:text-right">
              <p className={`text-sm md:text-lg ${subtle}`}>// Social Links</p>

              {socialLinks.map((link) => (
                <div
                  key={link.hint}
                  className="flex w-full min-w-0 flex-col gap-1 md:items-end"
                >
                  <span className={`text-xs md:text-sm ${subtle}`}>{link.hint}</span>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-base text-(--color-design) transition-opacity hover:opacity-70 md:text-xl"
                  >
                    {link.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
