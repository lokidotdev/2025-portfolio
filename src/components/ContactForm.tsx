"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useGlobalContext } from "@/context/globalContext";
import { StatefulButton, type ButtonStatus } from "./ui/stateful-button";
import { contactSchema, firstError, type ContactInput } from "@/lib/validations";
import { themeTokens } from "@/lib/theme";

export default function ContactForm() {
  const { darkTheme } = useGlobalContext();
  const [status, setStatus] = useState<ButtonStatus>("idle");
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [formData, setFormData] = useState<ContactInput>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>(
    {}
  );

  function handleData(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // an in-flight submit stays interactive across the await; refuse re-entry
    if (status !== "idle") return;

    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ContactInput;
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error(firstError(parsed.error));
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/message`,
        parsed.data
      );
      toast.success("message sent successfully");
      setFormData({ name: "", email: "", message: "" });
      setStatus("success");
      resetTimeoutRef.current = setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      toast.error("some error occured");
      setStatus("idle");
    }
  }

  const { subtle, inputBorder } = themeTokens(darkTheme);

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className={`text-xs md:text-sm ${subtle}`}>
          [ Name ]
        </label>
        <input
          id="name"
          name="name"
          type="text"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          value={formData.name}
          onChange={handleData}
          className={`w-full border-b bg-transparent pb-2 text-base outline-none transition-colors md:text-lg ${
            errors.name ? "border-danger" : inputBorder
          } focus:border-(--color-design)`}
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
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          value={formData.email}
          onChange={handleData}
          className={`w-full border-b bg-transparent pb-2 text-base outline-none transition-colors md:text-lg ${
            errors.email ? "border-danger" : inputBorder
          } focus:border-(--color-design)`}
        />
        {errors.email && (
          <span id="email-error" className="text-xs text-danger">
            {errors.email}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={`text-xs md:text-sm ${subtle}`}>
          [ Message ]
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          value={formData.message}
          onChange={handleData}
          className={`w-full resize-none border bg-transparent p-3 text-base outline-none transition-colors md:text-lg ${
            errors.message ? "border-danger" : inputBorder
          } focus:border-(--color-design)`}
        />
        {errors.message && (
          <span id="message-error" className="text-xs text-danger">
            {errors.message}
          </span>
        )}
      </div>

      <StatefulButton
        type="submit"
        status={status}
        className="mt-2 w-full sm:max-w-xs bg-brand-soft text-ink font-semibold hover:opacity-90"
      >
        {status === "success" ? "Sent" : "Submit"}
      </StatefulButton>
    </form>
  );
}
