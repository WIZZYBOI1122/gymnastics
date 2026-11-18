import type { Metadata } from "next";
import Link from "next/link";
import { PLANS, formatNaira } from "@/lib/content";

export const metadata: Metadata = { title: "Membership" };

export default function MembershipPage() {
  return (
    <>
      <section className="page-heading">
        <h1>Membership Plans</h1>
        <p>
          Simple transparent pricing with zero hidden fees. Choose a plan that fits your schedule
          and fitness goals. Upgrade, downgrade or cancel at any time.
        </p>
      </section>

      <div className="card-grid card-grid--3">
        {PLANS.map((plan) => (
          <section key={plan.id} className="card">
            <h2>{plan.name}</h2>
            <p className="price">{formatNaira(plan.priceNaira)}/month</p>
            <h3>Features</h3>
            <ul>
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p>
              <strong>Best for:</strong> {plan.bestFor}
            </p>
          </section>
        ))}
      </div>

      <section className="card membership-cta" aria-labelledby="membership-cta-title">
        <h2 id="membership-cta-title">Ready to Get Started or Want to Try a Free Class First?</h2>
        <Link className="book-class-button" href="/join">
          CHOOSE A PLAN/JOIN NOW
        </Link>
      </section>
    </>
  );
}
