import { NextResponse } from "next/server";
import type { FieldErrors } from "./validation";

export function ok<T extends object>(data: T = {} as T, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

export function fail(status: number, error: string, fieldErrors?: FieldErrors, headers?: HeadersInit) {
  return NextResponse.json({ ok: false, error, fieldErrors }, { status, headers });
}

/**
 * Best-effort client IP. x-forwarded-for is only trustworthy behind a proxy you
 * control (Vercel, Nginx, Cloudflare...), which is the normal way to deploy.
 */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Reject cross-site state-changing requests (defence in depth on top of SameSite cookies). */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients (curl) do not send Origin
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function readJson(req: Request): Promise<unknown | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
