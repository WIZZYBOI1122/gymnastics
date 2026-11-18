import type { Metadata } from "next";
import Link from "next/link";
import { PaymentForm } from "@/components/PaymentForm";
import { bank } from "@/lib/config";
import { PLANS } from "@/lib/content";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Membership Payment",
  robots: { index: false },
};

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string | string[] }>;
}) {
  const params = await searchParams;
  const bookingId = typeof params.booking === "string" ? params.booking : "";

  const booking = bookingId
    ? await db.booking.findUnique({ where: { id: bookingId }, select: { id: true } })
    : null;

  if (!booking) {
    return (
      <section className="panel" style={{ maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ marginTop: 0 }}>Start with your details</h1>
        <p>
          We link each payment receipt to a booking. Fill in the short join form first, then
          you&apos;ll come back here to pick a plan and upload your receipt.
        </p>
        <Link className="button-3d" href="/join" style={{ textDecoration: "none" }}>
          Go to the join form
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="banner" aria-labelledby="payment-title">
        <p className="eyebrow">SECURE CHECKOUT</p>
        <h1 id="payment-title">Complete Your Membership Payment</h1>
        <p>Choose your plan, transfer payment, and add your receipt to request confirmation.</p>
      </section>
      <PaymentForm bookingId={booking.id} plans={PLANS} bank={bank} />
    </>
  );
}
