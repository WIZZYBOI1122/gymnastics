export type FieldErrors = Record<string, string>;

export type SubmitResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

/** Send a request to our own API and normalise success / validation / network failures. */
export async function submit(url: string, init: RequestInit): Promise<SubmitResult> {
  try {
    const res = await fetch(url, init);
    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; id?: string; error?: string; fieldErrors?: FieldErrors }
      | null;

    if (res.ok && data?.ok) return { ok: true, id: data.id };
    return {
      ok: false,
      error: data?.error ?? "Something went wrong. Please try again.",
      fieldErrors: data?.fieldErrors,
    };
  } catch {
    return { ok: false, error: "Network error. Check your connection and try again." };
  }
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error" role="alert">
      {message}
    </p>
  );
}

/** Honeypot input. Real visitors never see or fill it. */
export function HoneypotField() {
  return (
    <div className="hp-field" aria-hidden="true">
      <label htmlFor="website">Website</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function formToObject(form: HTMLFormElement): Record<string, string> {
  const out: Record<string, string> = {};
  new FormData(form).forEach((value, key) => {
    if (typeof value === "string") out[key] = value;
  });
  return out;
}
