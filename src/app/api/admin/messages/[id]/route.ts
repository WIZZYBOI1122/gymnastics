import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, isSameOrigin, ok, readJson } from "@/lib/http";
import { messageHandledSchema, toFieldErrors } from "@/lib/validation";

export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return fail(403, "Cross-site requests are not allowed.");
  if (!(await isAdmin())) return fail(401, "Not signed in.");

  const { id } = await ctx.params;
  const parsed = messageHandledSchema.safeParse(await readJson(req));
  if (!parsed.success) return fail(422, "Invalid update.", toFieldErrors(parsed.error));

  try {
    await db.contactMessage.update({ where: { id }, data: { handled: parsed.data.handled } });
    return ok();
  } catch {
    return fail(404, "Message not found.");
  }
}
