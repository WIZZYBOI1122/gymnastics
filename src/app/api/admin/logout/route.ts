import { ADMIN_COOKIE } from "@/lib/auth";
import { fail, isSameOrigin, ok } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return fail(403, "Cross-site requests are not allowed.");
  const res = ok();
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
