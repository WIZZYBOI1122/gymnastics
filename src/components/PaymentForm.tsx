"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { formatNaira, getPlan, type Plan } from "@/lib/content";
import { FieldError, HoneypotField, submit, type FieldErrors } from "./form-utils";

type Bank = { name: string; accountNumber: string; accountName: string };

const MAX_BYTES = 5 * 1024 * 1024;

export function PaymentForm({
  bookingId,
  plans,
  bank,
}: {
  bookingId: string;
  plans: Plan[];
  bank: Bank;
}) {
  const router = useRouter();
  const [planId, setPlanId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [errors, setErrors] = useState<FieldErrors>({});

  const selected = getPlan(planId);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("bookingId", bookingId);

    const receipt = data.get("receipt");
    if (receipt instanceof File && receipt.size > MAX_BYTES) {
      setErrors({ receipt: "The receipt must be 5 MB or smaller." });
      return;
    }

    setBusy(true);
    setError(undefined);
    setErrors({});

    // Do not set Content-Type: the browser adds the multipart boundary itself.
    const result = await submit("/api/payments", { method: "POST", body: data });

    if (result.ok) {
      router.push("/thank-you");
      return;
    }
    setError(result.error);
    setErrors(result.fieldErrors ?? {});
    setBusy(false);
  }

  return (
    <form className="payment-grid" onSubmit={onSubmit}>
      <section className="panel payment-card" aria-labelledby="summary-title">
        <p className="eyebrow">YOUR ORDER</p>
        <h2 id="summary-title">Order Summary</h2>

        <label htmlFor="plan">Selected Plan</label>
        <select
          id="plan"
          name="plan"
          required
          value={planId}
          onChange={(e) => setPlanId(e.target.value)}
          className={planId ? undefined : "is-empty"}
          aria-invalid={Boolean(errors.plan)}
          aria-describedby={errors.plan ? "plan-error" : undefined}
        >
          <option value="" disabled>
            Choose a plan
          </option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} Plan - {formatNaira(p.priceNaira)}/month
            </option>
          ))}
        </select>
        <FieldError id="plan-error" message={errors.plan} />

        <div className="summary-row">
          <span>Registration Fee</span>
          <strong>{formatNaira(0)}</strong>
        </div>
        <div className="summary-row summary-row--total">
          <span>Amount to transfer</span>
          <strong>{selected ? formatNaira(selected.priceNaira) : "Choose a plan"}</strong>
        </div>
        <p className="security-note">Transfer the exact amount shown for your selected plan.</p>
      </section>

      <section className="panel payment-card" aria-labelledby="payment-method-title">
        <p className="eyebrow">PAYMENT METHOD</p>
        <h2 id="payment-method-title">Direct Bank Transfer</h2>

        <div className="bank-details">
          <div className="bank-detail">
            <span>Bank Name</span>
            <strong>{bank.name}</strong>
          </div>
          <div className="bank-detail">
            <span>Account Number</span>
            <strong>{bank.accountNumber}</strong>
          </div>
          <div className="bank-detail">
            <span>Account Name</span>
            <strong>{bank.accountName}</strong>
          </div>
        </div>

        <p className="transfer-note">
          After making your transfer, choose your receipt below to request payment confirmation.
        </p>

        <div className="receipt-field">
          <label htmlFor="receipt">Upload Payment Receipt</label>
          <input
            type="file"
            id="receipt"
            name="receipt"
            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
            required
            aria-invalid={Boolean(errors.receipt)}
            aria-describedby={errors.receipt ? "receipt-error" : "receipt-help"}
          />
          <p id="receipt-help" className="file-help">
            Accepted formats: JPG, JPEG, PNG, or PDF (up to 5 MB).
          </p>
          <FieldError id="receipt-error" message={errors.receipt} />
        </div>

        <HoneypotField />

        {error && (
          <p className="form-alert" role="alert">
            {error}
          </p>
        )}

        <button className="button-3d" type="submit" disabled={busy}>
          {busy ? "Uploading…" : "Confirm Payment"}
        </button>
      </section>
    </form>
  );
}
