"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useGlobalContext } from "@/context/globalContext";
import { Loader2Icon } from "lucide-react";
import ProximityText from "./ui/ProximityText";

const socialLinks = [
  {
    hint: "Drop me an email",
    label: "lokeshyadv8177@gmail.com",
    href: "mailto:lokeshyadv8177@gmail.com",
  },
  {
    hint: "Follow on X",
    label: "https://x.com/lokidotdev",
    href: "https://www.x.com/lokidotdev/",
  },
  {
    hint: "For devs",
    label: "https://github.com/lokidotdev",
    href: "https://github.com/lokidotdev",
  },
];

export default function Contact() {
  const { darkTheme } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleData(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.name || !formData.email || !formData.message) {
        toast.error("please fill all fields");
        return;
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/message`,
        formData
      );
      toast.success("message sent successfully");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("some error occured");
    } finally {
      setLoading(false);
    }
  }

  const text = darkTheme ? "text-white" : "text-[#212529]";
  const subtle = darkTheme ? "text-white/60" : "text-[#212529]/60";
  const line = darkTheme ? "bg-white/25" : "bg-[#212529]/25";

  return (
    <div
      id="contact"
      className={`${
        darkTheme ? "dark-theme-bg" : "light-theme-bg"
      } ${text} w-full`}
    >
      <div className="mx-auto w-full max-w-400 px-6 py-24 md:px-16 md:py-32">
        {/* Framed container */}
        <div
          className={`relative border-x ${
            darkTheme ? "border-white/15" : "border-[#212529]/15"
          } px-6 py-16 md:px-20 md:py-24`}
        >

          <div className="border-y absolute h-full w-16 left-0 top-0"></div>
          <div className="border-y absolute h-full w-16 right-0 top-0"></div>

          <h1 className="hero-heading mb-16 w-full text-6xl font-thin leading-[100%] tracking-[-0.04em] md:mb-24 md:text-[8vw]">
            <ProximityText
              text="Get in touch"
              maxDistance={200}
              minWeight={100}
              maxWeight={700}
            />
          </h1>

          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24">


            {/* Left — Form */}
            <div>
              <p className={`mb-10 text-lg ${subtle}`}>// Message me directly</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className={`text-sm ${subtle}`}>
                    [ Name ]
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleData}
                    className={`w-full border-b bg-transparent pb-2 outline-none transition-colors ${
                      darkTheme ? "border-white/30" : "border-[#212529]/30"
                    } focus:border-(--color-design)`}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className={`text-sm ${subtle}`}>
                    [ Email ]
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleData}
                    className={`w-full border-b bg-transparent pb-2 outline-none transition-colors ${
                      darkTheme ? "border-white/30" : "border-[#212529]/30"
                    } focus:border-(--color-design)`}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className={`text-sm ${subtle}`}>
                    [ Message ]
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleData}
                    className={`w-full resize-none border bg-transparent p-3 outline-none transition-colors ${
                      darkTheme ? "border-white/30" : "border-[#212529]/30"
                    } focus:border-(--color-design)`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full max-w-xs items-center justify-center bg-(--color-design) py-3 tracking-wide text-black transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2Icon className="animate-spin" size={20} />
                  ) : (
                    "submit"
                  )}
                </button>
              </form>
            </div>

            {/* Right — Social links */}
            <div className="flex flex-col items-start gap-10 md:items-end md:text-right">
              <p className={`text-lg ${subtle}`}>// Social Links</p>

              {socialLinks.map((link) => (
                <div
                  key={link.hint}
                  className="flex flex-col gap-1 md:items-end"
                >
                  <span className={`text-sm ${subtle}`}>{link.hint}</span>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-(--color-design) transition-opacity hover:opacity-70"
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
