import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "name must be at least 2 characters")
    .max(60, "name is too long"),
  email: z.email("please enter a valid email").trim().max(254),
  message: z
    .string()
    .trim()
    .min(10, "message must be at least 10 characters")
    .max(2000, "message is too long"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "invalid input";
}
