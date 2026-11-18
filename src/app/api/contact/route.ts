import { clientIp, fail, ok, readJson } from "@/lib/http";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema, toFieldErrors } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limit = rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return fail(429, "Too many messages. Please try again in a few minutes.", undefined, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  const body = await readJson(req);
  if (!body) return fail(400, "The request body must be valid JSON.");

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return fail(422, "Please check the highlighted fields.", toFieldErrors(parsed.error));
  }

  const { website, ...data } = parsed.data;
  if (website) return ok(); // honeypot tripped: pretend it worked, store nothing

  const created = await db.contactMessage.create({ data });
  return ok({ id: created.id }, 201);
}
