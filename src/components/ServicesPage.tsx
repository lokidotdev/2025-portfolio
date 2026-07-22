"use client";

import { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import { Check } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useGlobalContext } from "@/context/globalContext";
import ProximityText from "./ui/ProximityText";
import { StatefulButton, type ButtonStatus } from "./ui/stateful-button";
import { themeTokens } from "@/lib/theme";

const services: { id: string; title: string; blurb: string }[] = [
  {
    id: "frontend-development",
    title: "Frontend Development",
    blurb: "Pixel-accurate, accessible interfaces in React & Next.js.",
  },
  {
    id: "backend-development",
    title: "Backend Development",
    blurb: "Robust APIs, databases, and server-side logic that scale.",
  },
  {
    id: "fullstack-development",
    title: "Fullstack Development",
    blurb: "End-to-end apps — APIs, databases, and everything between.",
  },
  {
    id: "ui-ux-design",
    title: "UI / UX Design",
    blurb: "Interfaces designed in Figma, built to feel effortless.",
  },
];

export default function ServicesPage() {
  const { darkTheme } = useGlobalContext();
  const [status, setStatus] = useState<ButtonStatus>("idle");
  const [form, setForm] = useState({ name: "", email: "" });
  const [selected, setSelected] = useState<string[]>([]);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const { text, subtle, border, inputBorder } = themeTokens(darkTheme);

  const toggleService = (title: string) => {
    setSelected((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title],
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // an in-flight submit stays interactive across the await; refuse re-entry
    if (status !== "idle") return;

    if (!form.name || !form.email) {
      toast.error("please fill your name and email");
      return;
    }
    if (selected.length === 0) {
      toast.error("please select at least one service");
      return;
    }

    setStatus("loading");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/service-request`,
        { ...form, services: selected },
      );
      toast.success("request sent — I'll be in touch soon");
      setForm({ name: "", email: "" });
      setSelected([]);
      setStatus("success");
      resetTimeoutRef.current = setTimeout(() => setStatus("idle"), 2000);
    } catch {
      toast.error("some error occured");
      setStatus("idle");
    }
  }

  return (
    <div
      className={`${
        darkTheme ? "dark-theme-bg" : "light-theme-bg"
      } ${text} min-h-screen w-full`}
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-16 md:py-32">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`mb-3 text-sm md:mb-6 md:text-lg ${subtle}`}
          >
            // What I can build for you
          </m.p>

          <h1 className="hero-heading w-full italic text-5xl font-thin tracking-[-0.04em] leading-[100%] md:text-[8vw]">
            <ProximityText
              text="SERVICES"
              maxDistance={200}
              minWeight={100}
              maxWeight={700}
            />
          </h1>
        </div>

        {/* Services grid */}
        <div
          className={`grid grid-cols-1 gap-px border-t ${border} md:grid-cols-2`}
        >
          {services.map((s, index) => (
            <m.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className={`flex flex-col gap-4 border-t ${border} py-10 md:pr-10`}
            >
              {/* <span className={`text-xs md:text-sm ${subtle}`}>
                {(index + 1).toString().padStart(2, "0")}
              </span> */}
              <span className="text-xl font-normal leading-[110%] tracking-[-0.02em] md:text-3xl">
                {s.title}
              </span>
              <p className={`text-sm leading-[150%] md:text-base ${subtle}`}>
                {s.blurb}
              </p>
            </m.div>
          ))}
        </div>

        {/* Request form */}
        <div className="mt-24 md:mt-32">
          <div className={`relative md:border-x ${border} md:px-20 md:py-24`}>
            <div className="hidden md:block border-y absolute h-full w-8 left-0 top-0 md:w-16"></div>
            <div className="hidden md:block border-y absolute h-full w-8 right-0 top-0 md:w-16"></div>

            <h2 className="mb-4 text-4xl font-thin italic leading-[100%] tracking-[-0.04em] md:text-6xl">
              <ProximityText
                text="Start a project"
                maxDistance={150}
                minWeight={100}
                maxWeight={700}
              />
            </h2>
            <p className={`mb-10 text-sm md:mb-16 md:text-lg ${subtle}`}>
              // what do you need
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-12">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className={`text-xs md:text-sm ${subtle}`}
                  >
                    [ Name ]
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className={`w-full border-b bg-transparent pb-2 text-base outline-none transition-colors md:text-lg ${inputBorder} focus:border-(--color-design)`}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className={`text-xs md:text-sm ${subtle}`}
                  >
                    [ Email ]
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className={`w-full border-b bg-transparent pb-2 text-base outline-none transition-colors md:text-lg ${inputBorder} focus:border-(--color-design)`}
                  />
                </div>
              </div>

              {/* Services checkboxes */}
              <div className="flex flex-col gap-5">
                <span className={`text-xs md:text-sm ${subtle}`}>
                  [ Services ] — select all that apply
                </span>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {services.map((s) => {
                    const active = selected.includes(s.title);
                    return (
                      <label
                        key={s.id}
                        className={`group flex cursor-pointer items-center gap-4 border p-4 transition-colors ${
                          active
                            ? "border-(--color-design)"
                            : `${inputBorder} hover:border-(--color-design)`
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="services"
                          value={s.title}
                          checked={active}
                          onChange={() => toggleService(s.title)}
                          className="sr-only"
                        />
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
                            active
                              ? "border-(--color-design) bg-(--color-design)"
                              : inputBorder
                          }`}
                        >
                          {active && (
                            <Check
                              size={14}
                              strokeWidth={3}
                              className="text-ink"
                            />
                          )}
                        </span>
                        <span
                          className={`text-base leading-[120%] tracking-tight transition-colors md:text-lg ${
                            active ? "text-(--color-design)" : ""
                          }`}
                        >
                          {s.title}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <StatefulButton
                type="submit"
                status={status}
                className="w-full font-semibold max-w-xs bg-brand-soft text-ink hover:opacity-90"
              >
                {status === "success" ? "request sent" : "send request"}
              </StatefulButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
