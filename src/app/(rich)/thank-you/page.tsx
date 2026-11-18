import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Thank You" };

export default function ThankYouPage() {
  return (
    <div className="thankyou-page">
      <section className="thankyou-card" aria-labelledby="thankyou-title">
        <div className="thankyou-icon" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="42"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m16 9-5.5 5.5L8 12" />
          </svg>
        </div>
        <p className="eyebrow">MESSAGE RECEIVED</p>
        <h1 id="thankyou-title">Thank You!</h1>
        <p className="thankyou-message">
          We&apos;ve received your submission. Whether you booked a class, asked about membership,
          or sent an inquiry, our team will be in touch within 24 hours.
        </p>
        <ul className="next-steps">
          <li>Check your email or WhatsApp for a confirmation from our front desk.</li>
          <li>If you booked a free trial, please arrive 10 minutes early.</li>
        </ul>
        <div className="thankyou-actions">
          <Link className="button-3d" href="/">
            Return to Home
          </Link>
          <Link className="button-3d button-3d--secondary" href="/classes">
            Explore Our Classes
          </Link>
        </div>
      </section>
    </div>
  );
}
