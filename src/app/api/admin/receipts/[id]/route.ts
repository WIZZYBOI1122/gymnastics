import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { readReceipt } from "@/lib/receipts";

export const runtime = "nodejs";

// Receipts live outside /public, so this admin-only route is the only way to view them.
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return new Response("Not signed in.", { status: 401 });

  const { id } = await ctx.params;
  const payment = await db.payment.findUnique({
    where: { id },
    select: { receiptFile: true, receiptMime: true },
  });
  if (!payment) return new Response("Not found.", { status: 404 });

  const file = await readReceipt(payment.receiptFile);
  if (!file) return new Response("Receipt file is missing.", { status: 404 });

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": payment.receiptMime,
      "Content-Length": String(file.length),
      "Content-Disposition": "inline",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
