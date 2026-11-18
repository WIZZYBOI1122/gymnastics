import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, isSameOrigin, ok, readJson } from "@/lib/http";
import { paymentReviewSchema, toFieldErrors } from "@/lib/validation";

export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return fail(403, "Cross-site requests are not allowed.");
  if (!(await isAdmin())) return fail(401, "Not signed in.");

  const { id } = await ctx.params;
  const body = await readJson(req);
  const parsed = paymentReviewSchema.safeParse(body);
  if (!parsed.success) return fail(422, "Invalid review.", toFieldErrors(parsed.error));

  try {
    const updated = await db.payment.update({
      where: { id },
      data: {
        status: parsed.data.status,
        note: parsed.data.note || null,
        reviewedAt: parsed.data.status === "pending" ? null : new Date(),
      },
      select: { id: true, status: true },
    });
    return ok({ payment: updated });
  } catch {
    return fail(404, "Payment not found.");
  }
}
