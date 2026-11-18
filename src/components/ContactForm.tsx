"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CONTACT_SUBJECTS } from "@/lib/content";
import { FieldError, HoneypotField, formToObject, submit, type FieldErrors } from "./form-utils";

export function ContactForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [errors, setErrors] = useState<FieldErrors>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    setErrors({});

    const result = await submit("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formToObject(event.currentTarget)),
    });

    if (result.ok) {
      router.push("/thank-you");
      return;
    }
    setError(result.error);
    setErrors(result.fieldErrors ?? {});
    setBusy(false);
  }

  return (
    <section className="panel" aria-labelledby="form-title">
      <p className="eyebrow">GENERAL INQUIRY</p>
      <h2 id="form-title">Send Us a Message</h2>
      <p className="panel-intro">Tell us what you need and our team will be in touch.</p>

      <form className="form" onSubmit={onSubmit}>
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        <FieldError id="name-error" message={errors.name} />

        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        <FieldError id="email-error" message={errors.email} />

        <label htmlFor="subject">Subject</label>
        <select
          id="subject"
          name="subject"
          required
          defaultValue=""
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "subject-error" : undefined}
        >
          <option value="" disabled>
            Choose a subject
          </option>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <FieldError id="subject-error" message={errors.subject} />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={2000}
          placeholder="How can we help you?"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        <FieldError id="message-error" message={errors.message} />

        <HoneypotField />

        {error && (
          <p className="form-alert" role="alert">
            {error}
          </p>
        )}

        <button className="button-3d" type="submit" disabled={busy}>
          {busy ? "Sending…" : "Send Message"}
        </button>
      </form>
    </section>
  );
}
