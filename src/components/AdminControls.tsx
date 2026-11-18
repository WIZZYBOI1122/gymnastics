"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { FieldError, submit } from "./form-utils";

async function patch(url: string, body: unknown): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) return null;
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    return data?.error ?? "The update failed.";
  } catch {
    return "Network error. Please try again.";
  }
}

export function PaymentReviewButtons({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function review(next: "approved" | "rejected" | "pending") {
    setBusy(true);
    const error = await patch(`/api/admin/payments/${id}`, { status: next });
    setBusy(false);
    if (error) window.alert(error);
    else router.refresh();
  }

  return (
    <div className="admin-actions">
      {status !== "approved" && (
        <button className="mini-button mini-button--ok" disabled={busy} onClick={() => review("approved")}>
          Approve
        </button>
      )}
      {status !== "rejected" && (
        <button className="mini-button mini-button--bad" disabled={busy} onClick={() => review("rejected")}>
          Reject
        </button>
      )}
      {status !== "pending" && (
        <button className="mini-button" disabled={busy} onClick={() => review("pending")}>
          Reset
        </button>
      )}
    </div>
  );
}

export function BookingStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function change(next: string) {
    setBusy(true);
    const error = await patch(`/api/admin/bookings/${id}`, { status: next });
    setBusy(false);
    if (error) window.alert(error);
    else router.refresh();
  }

  return (
    <select
      className="mini-button"
      value={status}
      disabled={busy}
      aria-label="Booking status"
      onChange={(e) => change(e.target.value)}
    >
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="done">Done</option>
    </select>
  );
}

export function MessageHandledButton({ id, handled }: { id: string; handled: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const error = await patch(`/api/admin/messages/${id}`, { handled: !handled });
    setBusy(false);
    if (error) window.alert(error);
    else router.refresh();
  }

  return (
    <button className="mini-button" disabled={busy} onClick={toggle}>
      {handled ? "Mark unhandled" : "Mark handled"}
    </button>
  );
}

export function AdminToolbar() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-actions" style={{ alignItems: "center" }}>
      <ThemeToggle />
      <button className="mini-button" onClick={logout}>
        Sign out
      </button>
    </div>
  );
}

export function AdminLoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    const password = String(new FormData(event.currentTarget).get("password") ?? "");

    const result = await submit("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (result.ok) {
      router.push("/admin");
      router.refresh();
      return;
    }
    setError(result.error);
    setBusy(false);
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "login-error" : undefined}
        style={{
          width: "100%",
          minHeight: 54,
          padding: "13px 15px",
          border: "1px solid var(--field-border)",
          borderRadius: 12,
          background: "var(--field-bg)",
          color: "var(--text)",
          font: "inherit",
        }}
      />
      <FieldError id="login-error" message={error} />
      <button className="button-3d" type="submit" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
