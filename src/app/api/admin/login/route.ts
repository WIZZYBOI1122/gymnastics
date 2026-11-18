import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  adminConfigured,
  createSessionToken,
  passwordMatches,
} from "@/lib/auth";
import { clientIp, fail, isSameOrigin, ok, readJson } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return fail(403, "Cross-site requests are not allowed.");

  if (!adminConfigured()) {
    return fail(503, "The admin area is not configured. Set ADMIN_PASSWORD and SESSION_SECRET.");
  }

  const limit = rateLimit(`admin-login:${clientIp(req)}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return fail(429, "Too many attempts. Try again later.", undefined, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  const body = (await readJson(req)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  if (!passwordMatches(password)) return fail(401, "Incorrect password.");

  const token = createSessionToken();
  if (!token) return fail(503, "The admin area is not configured.");

  const res = ok();
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  });
  return res;
}
