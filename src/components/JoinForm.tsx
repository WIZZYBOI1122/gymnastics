"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { GOALS, PREFERRED_TIMES } from "@/lib/content";
import { FieldError, HoneypotField, formToObject, submit, type FieldErrors } from "./form-utils";

export function JoinForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [errors, setErrors] = useState<FieldErrors>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    // Two submit buttons: "Submit & Book Now" (membership) and "Book A Free Trial".
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = submitter?.dataset.intent === "trial" ? "trial" : "membership";

    setBusy(true);
    setError(undefined);
    setErrors({});

    const result = await submit("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formToObject(form), intent }),
    });

    if (!result.ok) {
      setError(result.error);
      setErrors(result.fieldErrors ?? {});
      setBusy(false);
      return;
    }

    if (intent === "membership" && result.id) {
      router.push(`/payment?booking=${encodeURIComponent(result.id)}`);
    } else {
      router.push("/thank-you");
    }
  }

  return (
    <form className="panel form join-form" onSubmit={onSubmit}>
      <label htmlFor="name">Full Name:</label>
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

      <label htmlFor="email">Email Address:</label>
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

      <label htmlFor="phone">Phone Number:</label>
      <input
        type="tel"
        id="phone"
        name="phone"
        autoComplete="tel"
        required
        aria-invalid={Boolean(errors.phone)}
        aria-describedby={errors.phone ? "phone-error" : undefined}
      />
      <FieldError id="phone-error" message={errors.phone} />

      <label htmlFor="preferredTime">Preferred Class Time:</label>
      <select
        id="preferredTime"
        name="preferredTime"
        required
        defaultValue=""
        aria-invalid={Boolean(errors.preferredTime)}
        aria-describedby={errors.preferredTime ? "time-error" : undefined}
      >
        <option value="" disabled>
          Select a time
        </option>
        {PREFERRED_TIMES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <FieldError id="time-error" message={errors.preferredTime} />

      <label htmlFor="goal">Primary Fitness Goal:</label>
      <select
        id="goal"
        name="goal"
        required
        defaultValue=""
        aria-invalid={Boolean(errors.goal)}
        aria-describedby={errors.goal ? "goal-error" : undefined}
      >
        <option value="" disabled>
          Select a goal
        </option>
        {GOALS.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </select>
      <FieldError id="goal-error" message={errors.goal} />

      <HoneypotField />

      {error && (
        <p className="form-alert" role="alert">
          {error}
        </p>
      )}

      <button className="button-3d" type="submit" data-intent="membership" disabled={busy}>
        {busy ? "Saving…" : "Submit & Book Now"}
      </button>
      <button
        className="button-3d button-3d--secondary"
        type="submit"
        data-intent="trial"
        disabled={busy}
        style={{ marginTop: 10 }}
      >
        Book A Free Trial
      </button>
    </form>
  );
}
