"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CircleAlert } from "lucide-react";
import { useGlobalContext } from "@/context/globalContext";
import { StatefulButton, type ButtonStatus } from "./ui/stateful-button";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { themeTokens } from "@/lib/theme";
import { siteConfig } from "@/lib/site";
import { focusRing } from "./projects/shared";

type Field = keyof ContactInput;
type Errors = Partial<Record<Field, string>>;

const EMPTY: ContactInput = { name: "", email: "", message: "" };

const MESSAGE_MAX = 2000;
// Only show the counter once it's useful — near the limit.
const COUNTER_FROM = 1600;

const FIELDS: {
  name: Field;
  label: string;
  placeholder: string;
  hint?: string;
  autoComplete?: string;
}[] = [
  { name: "name", label: "Name", placeholder: "John Smith", autoComplete: "name" },
  {
    name: "email",
    label: "Email",
    placeholder: "john@company.com",
    hint: "I'll reply to this address.",
    autoComplete: "email",
  },
  {
    name: "message",
    label: "Message",
    placeholder: "We need a marketing site with scroll animations by March…",
    hint: "What you're building, a rough timeline, and budget if you have one.",
  },
];

function validate(data: ContactInput): Errors {
  const parsed = contactSchema.safeParse(data);
  if (parsed.success) return {};
  const errors: Errors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as Field;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

export default function ContactForm() {
  const { darkTheme } = useGlobalContext();
  const { subtle, faint, inputBorder, border } = themeTokens(darkTheme);

  const [status, setStatus] = useState<ButtonStatus>("idle");
  const [formData, setFormData] = useState<ContactInput>(EMPTY);
  // Errors only show for fields the visitor has left (or after a send attempt),
  // so nobody gets scolded for a field they haven't reached yet.
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [sendFailed, setSendFailed] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => () => {
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
  }, []);

  const errors = validate(formData);
  const visibleError = (field: Field) => (touched[field] ? errors[field] : undefined);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSendFailed(false);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = e.target.name as Field;
    // Leaving an untouched empty field isn't a mistake yet.
    if (!formData[field]) return;
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // an in-flight submit stays interactive across the await; refuse re-entry
    if (status !== "idle") return;

    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      setTouched({ name: true, email: true, message: true });
      // Send focus to the first field that needs fixing.
      const first = FIELDS.find((f) => errors[f.name]);
      if (first) formRef.current?.querySelector<HTMLElement>(`#${first.name}`)?.focus();
      return;
    }

    setSendFailed(false);
    setStatus("loading");
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/message`, parsed.data);
      setStatus("success");
      resetTimeoutRef.current = setTimeout(() => {
        setSentTo(parsed.data.email);
        setFormData(EMPTY);
        setTouched({});
        setStatus("idle");
      }, 900);
    } catch {
      // Keep everything they typed; offer a route that doesn't depend on this form.
      setSendFailed(true);
      setStatus("idle");
    }
  }

  if (sentTo) {
    return (
      <div role="status" className={`flex flex-col items-start gap-4 border ${border} p-6 md:p-8`}>
        <p className="text-xl font-medium tracking-[-0.02em] md:text-2xl">Message sent.</p>
        <p className={`text-sm md:text-base ${subtle}`}>
          I&apos;ll reply to <span className="break-all">{sentTo}</span>. If it&apos;s urgent, book a call
          instead.
        </p>
        <button
          type="button"
          onClick={() => setSentTo(null)}
          className={`min-h-11 text-sm underline underline-offset-4 md:text-base ${focusRing}`}
        >
          Send another message
        </button>
      </div>
    );
  }

  const messageLength = formData.message.length;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      {FIELDS.map(({ name, label, placeholder, hint, autoComplete }) => {
        const error = visibleError(name);
        const describedBy = [error && `${name}-error`, hint && `${name}-hint`].filter(Boolean).join(" ");
        const shared = {
          id: name,
          name,
          value: formData[name],
          placeholder,
          onChange: handleChange,
          onBlur: handleBlur,
          required: true,
          "aria-invalid": !!error,
          "aria-describedby": describedBy || undefined,
          className: `w-full bg-transparent text-base outline-none transition-colors md:text-lg ${
            darkTheme ? "placeholder:text-on-dark/50" : "placeholder:text-ink/65"
          } ${error ? "border-danger" : inputBorder} focus:border-(--color-brand)`,
        };

        return (
          <div key={name} className="flex flex-col gap-2">
            <label htmlFor={name} className={`text-xs md:text-sm ${subtle}`}>
              [ {label} ]
            </label>

            {name === "message" ? (
              <textarea {...shared} rows={5} maxLength={MESSAGE_MAX} className={`${shared.className} resize-y border p-3`} />
            ) : (
              <input
                {...shared}
                type={name === "email" ? "email" : "text"}
                inputMode={name === "email" ? "email" : undefined}
                spellCheck={name === "email" ? false : undefined}
                autoComplete={autoComplete}
                className={`${shared.className} border-b pb-2`}
              />
            )}

            <div className="flex items-start justify-between gap-4 text-xs md:text-sm">
              <div className="flex flex-col gap-1">
                {/* Red carries the signal on the border and icon; the words stay
                    in body colour so they clear contrast on both themes. */}
                {error && (
                  <span id={`${name}-error`} className="flex items-start gap-1.5">
                    <CircleAlert aria-hidden size={14} className="mt-0.5 shrink-0 text-danger" />
                    {error.charAt(0).toUpperCase() + error.slice(1)}
                  </span>
                )}
                {hint && (
                  <span id={`${name}-hint`} className={faint}>
                    {hint}
                  </span>
                )}
              </div>
              {name === "message" && messageLength >= COUNTER_FROM && (
                <span className={`shrink-0 tabular-nums ${faint}`}>
                  {messageLength}/{MESSAGE_MAX}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {sendFailed && (
        <p role="alert" className="border-l-2 border-danger pl-3 text-sm md:text-base">
          Couldn&apos;t send your message. Your text is still here, so try again, or email it to{" "}
          <a href={`mailto:${siteConfig.email}`} className={`break-all underline underline-offset-4 ${focusRing}`}>
            {siteConfig.email}
          </a>
          .
        </p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
        <StatefulButton
          type="submit"
          status={status}
          className="w-full bg-brand-soft font-semibold text-ink hover:opacity-90 sm:max-w-xs"
        >
          {status === "loading" ? "Sending…" : status === "success" ? "Sent" : "Send message"}
        </StatefulButton>
        <span className={`text-xs md:text-sm ${faint}`}>All fields are required.</span>
      </div>
    </form>
  );
}
