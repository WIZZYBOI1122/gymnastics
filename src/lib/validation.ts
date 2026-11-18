import { z } from "zod";
import {
  CONTACT_SUBJECTS,
  GOALS,
  PLAN_IDS,
  PREFERRED_TIMES,
} from "./content";

const text = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `${label} is required` })
    .trim()
    .min(min, `${label} must be at least ${min} characters`)
    .max(max, `${label} must be ${max} characters or fewer`);

const email = z
  .string({ required_error: "Email address is required" })
  .trim()
  .toLowerCase()
  .max(254, "Email address is too long")
  .email("Enter a valid email address");

const phone = z
  .string({ required_error: "Phone number is required" })
  .trim()
  .regex(/^\+?[0-9()\s-]{7,20}$/, "Enter a valid phone number");

function oneOf<T extends readonly { value: string }[]>(options: T, label: string) {
  const values = options.map((o) => o.value) as [string, ...string[]];
  return z.enum(values, { errorMap: () => ({ message: `Choose a valid ${label}` }) });
}

// Hidden "website" field: real people leave it empty, simple bots fill it in.
const honeypot = z.string().max(200).optional();

export const contactSchema = z.object({
  name: text(2, 100, "Full name"),
  email,
  subject: oneOf(CONTACT_SUBJECTS, "subject"),
  message: text(10, 2000, "Message"),
  website: honeypot,
});

export const bookingSchema = z.object({
  name: text(2, 100, "Full name"),
  email,
  phone,
  preferredTime: oneOf(PREFERRED_TIMES, "class time"),
  goal: oneOf(GOALS, "fitness goal"),
  intent: z.enum(["trial", "membership"], {
    errorMap: () => ({ message: "Choose a valid booking type" }),
  }),
  website: honeypot,
});

export const paymentFieldsSchema = z.object({
  bookingId: z
    .string({ required_error: "Booking reference is missing" })
    .trim()
    .min(1, "Booking reference is missing")
    .max(64, "Booking reference is invalid"),
  plan: z.enum(PLAN_IDS, { errorMap: () => ({ message: "Choose a plan" }) }),
  website: honeypot,
});

export const paymentReviewSchema = z.object({
  status: z.enum(["approved", "rejected", "pending"]),
  note: z.string().trim().max(500).optional(),
});

export const bookingStatusSchema = z.object({
  status: z.enum(["new", "contacted", "done"]),
});

export const messageHandledSchema = z.object({ handled: z.boolean() });

export type FieldErrors = Record<string, string>;

/** Turn a zod error into { field: "first message" } for the forms. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
