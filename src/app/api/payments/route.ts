import { clientIp, fail, ok } from "@/lib/http";
import { db } from "@/lib/db";
import { getPlan } from "@/lib/content";
import { rateLimit } from "@/lib/rate-limit";
import { MAX_RECEIPT_BYTES, saveReceipt, sniffReceipt } from "@/lib/receipts";
import { paymentFieldsSchema, toFieldErrors } from "@/lib/validation";

export const runtime = "nodejs";

const MAX_PENDING_PER_BOOKING = 3;

export async function POST(req: Request) {
  const limit = rateLimit(`payment:${clientIp(req)}`, 6, 10 * 60 * 1000);
  if (!limit.ok) {
    return fail(429, "Too many uploads. Please try again in a few minutes.", undefined, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  // Cheap early rejection before the body is buffered (header can be absent or wrong, so we re-check below).
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_RECEIPT_BYTES + 64 * 1024) {
    return fail(413, "The receipt is too large. The limit is 5 MB.");
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail(400, "The request must be a multipart form.");
  }

  const parsed = paymentFieldsSchema.safeParse({
    bookingId: form.get("bookingId"),
    plan: form.get("plan"),
    website: form.get("website") ?? undefined,
  });
  if (!parsed.success) {
    return fail(422, "Please check the highlighted fields.", toFieldErrors(parsed.error));
  }
  if (parsed.data.website) return ok(); // honeypot tripped

  const file = form.get("receipt");
  if (!(file instanceof File) || file.size === 0) {
    return fail(422, "Please attach your payment receipt.", {
      receipt: "Please attach your payment receipt.",
    });
  }
  if (file.size > MAX_RECEIPT_BYTES) {
    return fail(413, "The receipt is too large. The limit is 5 MB.", {
      receipt: "The receipt must be 5 MB or smaller.",
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = sniffReceipt(buffer);
  if (!kind) {
    return fail(415, "Unsupported file type.", {
      receipt: "Upload a JPG, PNG or PDF file.",
    });
  }

  const booking = await db.booking.findUnique({
    where: { id: parsed.data.bookingId },
    select: { id: true },
  });
  if (!booking) {
    return fail(404, "We could not find your booking. Please start again from the join page.");
  }

  const pending = await db.payment.count({
    where: { bookingId: booking.id, status: "pending" },
  });
  if (pending >= MAX_PENDING_PER_BOOKING) {
    return fail(409, "You already have receipts waiting for review. We will be in touch shortly.");
  }

  const plan = getPlan(parsed.data.plan);
  if (!plan) return fail(422, "Choose a plan.", { plan: "Choose a plan." });

  const receiptFile = await saveReceipt(buffer, kind);
  const payment = await db.payment.create({
    data: {
      bookingId: booking.id,
      plan: plan.id,
      amountNaira: plan.priceNaira, // price comes from the server, never from the browser
      receiptFile,
      receiptMime: kind.mime,
      receiptBytes: buffer.length,
    },
    select: { id: true },
  });

  return ok({ id: payment.id }, 201);
}
