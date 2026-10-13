"use client";

import { useState } from "react";
import { m } from "motion/react";
import { ArrowDown, ArrowUpRight, Check, Plus } from "lucide-react";
import axios from "axios";
import { useGlobalContext } from "@/context/globalContext";
import ProximityText from "./ui/ProximityText";
import SectionHeading from "./ui/SectionHeading";
import MarqueeText from "./ui/MarqueeText";
import { StatefulButton, type ButtonStatus } from "./ui/stateful-button";
import { themeTokens } from "@/lib/theme";
import { siteConfig } from "@/lib/site";
import { contactSchema } from "@/lib/validations";
import { services } from "@/constants/services";

const focusRing =
  "outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-brand)";

const NewTabHint = () => <span className="sr-only"> (opens in a new tab)</span>;

const requestSchema = contactSchema.pick({ name: true, email: true });
type Field = "name" | "email" | "services";

const nextSteps = [
  "I read your request and reply by email",
  "We talk it through on a short call",
  "You get a scope and a quote, no commitment",
];

export default function ServicesPage() {
  const { darkTheme } = useGlobalContext();
  const { text, subtle, faint, border, inputBorder } = themeTokens(darkTheme);

  const [status, setStatus] = useState<ButtonStatus>("idle");
  const [form, setForm] = useState({ name: "", email: "" });
  const [selected, setSelected] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sendFailed, setSendFailed] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const toggleService = (title: string) => {
    setSelected((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title],
    );
    setErrors((prev) => ({ ...prev, services: undefined }));
  };

  function fieldError(field: "name" | "email", value: string) {
    const result = requestSchema.shape[field].safeParse(value);
    return result.success ? undefined : result.error.issues[0]?.message;
  }

  // Validate when the user leaves a field, not while they're typing.
  function handleBlur(field: "name" | "email") {
    if (!form[field]) return;
    setErrors((prev) => ({ ...prev, [field]: fieldError(field, form[field]) }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // an in-flight submit stays interactive across the await; refuse re-entry
    if (status !== "idle") return;

    const next: Partial<Record<Field, string>> = {
      name: fieldError("name", form.name),
      email: fieldError("email", form.email),
      services:
        selected.length === 0 ? "pick at least one service" : undefined,
    };
    setErrors(next);
    const firstInvalid = (["name", "email", "services"] as const).find(
      (f) => next[f],
    );
    if (firstInvalid) {
      document
        .getElementById(firstInvalid === "services" ? "service-frontend-development" : firstInvalid)
        ?.focus();
      return;
    }

    setSendFailed(false);
    setStatus("loading");
    try {
      const data = requestSchema.parse(form);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/service-request`,
        { ...data, services: selected },
      );
      setSentTo(data.email);
      setForm({ name: "", email: "" });
      setSelected([]);
      setStatus("idle");
    } catch {
      // Keep everything they typed and give them another way through.
      setSendFailed(true);
      setStatus("idle");
    }
  }

  const inputClass = (field: Field) =>
    `w-full border-b bg-transparent pb-2 text-base outline-none transition-colors md:text-lg ${
      errors[field] ? "border-danger" : inputBorder
    } focus:border-(--color-design)`;

  return (
    <div
      className={`${
        darkTheme ? "dark-theme-bg" : "light-theme-bg"
      } ${text} min-h-screen w-full`}
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 md:px-16 md:py-32">
        {/* Header — what this page is for, and the two ways to start */}
        <SectionHeading
          title="SERVICES"
          tagline="What I can build for you"
          subtle={subtle}
          variant="page"
          className="mb-6 md:mb-8"
        />
        <p className={`mb-10 max-w-2xl text-base leading-[150%] md:mb-14 md:text-xl ${subtle}`}>
          Frontend, backend and design work for products that need to look sharp
          and hold up in production. Pick what you need and send a request, or
          book a call to talk it through.
        </p>
        <div className="mb-16 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 md:mb-24">
          <a
            href="#request"
            className={`inline-flex min-h-12 items-center justify-center gap-2 bg-brand-soft px-6 font-semibold text-ink transition-opacity hover:opacity-90 ${focusRing}`}
          >
            Start a project
            <ArrowDown aria-hidden size={18} strokeWidth={2} />
          </a>
          <a
            href={siteConfig.booking}
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex min-h-12 items-center justify-center gap-2 border border-(--color-brand) px-6 transition-colors ${
              darkTheme ? "hover:bg-on-dark/5" : "hover:bg-ink/5"
            } ${focusRing}`}
          >
            Book a call
            <ArrowUpRight
              aria-hidden
              size={18}
              strokeWidth={1.75}
              className="text-(--color-design) transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
            <NewTabHint />
          </a>
        </div>

        {/* Services — each one: outcome, what you get, add to request */}
        <ul className={`grid grid-cols-1 border-t ${border} md:grid-cols-2`}>
          {services.map((s, index) => {
            const added = selected.includes(s.title);
            return (
              <m.li
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className={`flex flex-col gap-6 border-b ${border} py-10 md:py-12 ${
                  index % 2 === 0 ? `md:border-r md:pr-12` : "md:pl-12"
                }`}
              >
                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl font-normal leading-[110%] tracking-[-0.02em] md:text-3xl">
                    {s.title}
                  </h2>
                  <p className={`text-base leading-[150%] md:text-lg ${subtle}`}>
                    {s.outcome}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className={`text-xs md:text-sm ${subtle}`}>[ You get ]</span>
                  <ul className="flex flex-col gap-1.5">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm md:text-base">
                        <Check
                          aria-hidden
                          size={16}
                          strokeWidth={2}
                          className="mt-1 shrink-0 text-(--color-design)"
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <MarqueeText
                  items={s.stack}
                  srLabel="Tools: "
                  className={`text-xs md:text-sm ${subtle}`}
                />

                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-2">
                  <button
                    type="button"
                    aria-pressed={added}
                    onClick={() => toggleService(s.title)}
                    className={`inline-flex min-h-11 items-center gap-2 border px-4 text-sm transition-colors md:text-base ${
                      added
                        ? "border-(--color-design) text-(--color-design)"
                        : `${inputBorder} hover:border-(--color-design)`
                    } ${focusRing}`}
                  >
                    {added ? (
                      <Check aria-hidden size={16} strokeWidth={2.5} />
                    ) : (
                      <Plus aria-hidden size={16} strokeWidth={2} />
                    )}
                    {added ? "Added to request" : "Add to request"}
                  </button>
                  {added && (
                    <a
                      href="#request"
                      className={`text-sm underline-offset-4 hover:underline md:text-base ${subtle} ${focusRing}`}
                    >
                      Review request
                    </a>
                  )}
                </div>
              </m.li>
            );
          })}
        </ul>

        {/* Request */}
        <section
          id="request"
          aria-labelledby="request-heading"
          className="mt-24 scroll-mt-24 md:mt-32"
        >
          <div className={`relative md:border-x ${border} md:px-20 md:py-24`}>
            <div className="absolute left-0 top-0 hidden h-full w-8 border-y md:block md:w-16" />
            <div className="absolute right-0 top-0 hidden h-full w-8 border-y md:block md:w-16" />

            <h2
              id="request-heading"
              className="mb-4 text-4xl font-thin italic leading-[100%] tracking-[-0.04em] md:text-6xl"
            >
              <ProximityText
                text="Start a project"
                maxDistance={150}
                minWeight={100}
                maxWeight={700}
              />
            </h2>
            <p className={`mb-10 text-sm md:mb-16 md:text-lg ${subtle}`}>
              {"// Tell me who you are and what you need. Details come later, on a call."}
            </p>

            <div className="grid grid-cols-1 gap-16 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-20">
              <div aria-live="polite" className="min-w-0">
                {sentTo ? (
                  <div className="flex flex-col items-start gap-6">
                    <span className="inline-flex items-center gap-2 text-(--color-design)">
                      <Check aria-hidden size={20} strokeWidth={2.5} />
                      Request sent
                    </span>
                    <p className="text-xl leading-[140%] md:text-2xl">
                      Thanks. I&apos;ll reply to{" "}
                      <span className="break-all text-(--color-design)">{sentTo}</span>.
                    </p>
                    <p className={`text-sm md:text-base ${subtle}`}>
                      Want to talk sooner? Grab a slot on my calendar.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                      <a
                        href={siteConfig.booking}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex min-h-12 items-center justify-center gap-2 bg-brand-soft px-6 font-semibold text-ink transition-opacity hover:opacity-90 ${focusRing}`}
                      >
                        Book a call
                        <ArrowUpRight aria-hidden size={18} strokeWidth={2} />
                        <NewTabHint />
                      </a>
                      <button
                        type="button"
                        onClick={() => setSentTo(null)}
                        className={`min-h-11 text-sm underline-offset-4 hover:underline md:text-base ${subtle} ${focusRing}`}
                      >
                        Send another request
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-12">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" className={`text-xs md:text-sm ${subtle}`}>
                          [ Name ]
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "name-error" : undefined}
                          value={form.name}
                          onChange={(e) => {
                            setForm((p) => ({ ...p, name: e.target.value }));
                            setErrors((p) => ({ ...p, name: undefined }));
                          }}
                          onBlur={() => handleBlur("name")}
                          className={inputClass("name")}
                        />
                        {errors.name && (
                          <span id="name-error" className="text-xs text-danger">
                            {errors.name}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className={`text-xs md:text-sm ${subtle}`}>
                          [ Email ]
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          spellCheck={false}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : "email-hint"}
                          value={form.email}
                          onChange={(e) => {
                            setForm((p) => ({ ...p, email: e.target.value }));
                            setErrors((p) => ({ ...p, email: undefined }));
                          }}
                          onBlur={() => handleBlur("email")}
                          className={inputClass("email")}
                        />
                        {errors.email ? (
                          <span id="email-error" className="text-xs text-danger">
                            {errors.email}
                          </span>
                        ) : (
                          <span id="email-hint" className={`text-xs ${subtle}`}>
                            Where I&apos;ll reply. Never shared.
                          </span>
                        )}
                      </div>
                    </div>

                    <fieldset
                      aria-describedby={errors.services ? "services-error" : undefined}
                      className="flex flex-col gap-5"
                    >
                      <legend className={`mb-5 flex w-full justify-between gap-4 text-xs md:text-sm ${subtle}`}>
                        <span>[ Services ] — select all that apply</span>
                        <span className="tabular-nums" aria-hidden>
                          {selected.length}/{services.length}
                        </span>
                      </legend>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {services.map((s) => {
                          const active = selected.includes(s.title);
                          return (
                            <label
                              key={s.id}
                              className={`flex min-h-14 cursor-pointer items-center gap-4 border p-4 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-(--color-brand) ${
                                active
                                  ? "border-(--color-design)"
                                  : errors.services
                                    ? "border-danger"
                                    : `${inputBorder} hover:border-(--color-design)`
                              }`}
                            >
                              <input
                                id={`service-${s.id}`}
                                type="checkbox"
                                name="services"
                                value={s.title}
                                checked={active}
                                onChange={() => toggleService(s.title)}
                                className="sr-only"
                              />
                              <span
                                aria-hidden
                                className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
                                  active
                                    ? "border-(--color-design) bg-(--color-design)"
                                    : inputBorder
                                }`}
                              >
                                {active && <Check size={14} strokeWidth={3} className="text-ink" />}
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
                      {errors.services && (
                        <span id="services-error" className="text-xs text-danger">
                          {errors.services}
                        </span>
                      )}
                    </fieldset>

                    <div className="flex flex-col gap-4">
                      <StatefulButton
                        type="submit"
                        status={status}
                        className="w-full max-w-xs bg-brand-soft px-6 font-semibold text-ink hover:opacity-90"
                      >
                        {status === "loading" ? "Sending…" : "Send request"}
                      </StatefulButton>
                      {sendFailed && (
                        <p role="alert" className="text-sm text-danger">
                          Couldn&apos;t send your request. Your details are still here, so
                          try again, or email me at{" "}
                          <a
                            href={`mailto:${siteConfig.email}`}
                            className={`underline underline-offset-4 ${focusRing}`}
                          >
                            {siteConfig.email}
                          </a>
                          .
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {/* What happens next — answers "what am I signing up for?" */}
              <aside aria-labelledby="next-heading" className="min-w-0">
                <h3 id="next-heading" className={`mb-6 text-xs md:text-sm ${subtle}`}>
                  [ What happens next ]
                </h3>
                <ol className={`border-t ${border}`}>
                  {nextSteps.map((step, i) => (
                    <li
                      key={step}
                      className={`flex gap-4 border-b ${border} py-4 text-base md:text-lg`}
                    >
                      <span className={`tabular-nums ${faint}`} aria-hidden>
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <p className={`mt-6 text-sm leading-[150%] ${subtle}`}>
                  Sending a request is free and doesn&apos;t commit you to anything.
                </p>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
