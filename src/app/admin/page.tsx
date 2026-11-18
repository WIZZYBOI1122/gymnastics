import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AdminToolbar,
  BookingStatusSelect,
  MessageHandledButton,
  PaymentReviewButtons,
} from "@/components/AdminControls";
import { isAdmin } from "@/lib/auth";
import {
  CONTACT_SUBJECTS,
  GOALS,
  PREFERRED_TIMES,
  formatNaira,
  getPlan,
} from "@/lib/content";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const TABS = ["payments", "bookings", "messages"] as const;
type Tab = (typeof TABS)[number];

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Lagos",
});

function label(list: readonly { value: string; label: string }[], value: string) {
  return list.find((o) => o.value === value)?.label ?? value;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  const { tab: rawTab } = await searchParams;
  const tab: Tab = TABS.find((t) => t === rawTab) ?? "payments";

  const [pendingPayments, newBookings, openMessages] = await Promise.all([
    db.payment.count({ where: { status: "pending" } }),
    db.booking.count({ where: { status: "new" } }),
    db.contactMessage.count({ where: { handled: false } }),
  ]);

  const counts: Record<Tab, number> = {
    payments: pendingPayments,
    bookings: newBookings,
    messages: openMessages,
  };

  return (
    <>
      <div className="admin-bar">
        <h1>Studio admin</h1>
        <AdminToolbar />
      </div>

      <nav className="admin-tabs" aria-label="Admin sections">
        {TABS.map((t) => (
          <Link
            key={t}
            className="admin-tab"
            href={`/admin?tab=${t}`}
            aria-current={t === tab ? "page" : undefined}
          >
            {t[0].toUpperCase() + t.slice(1)}
            {counts[t] > 0 ? ` (${counts[t]})` : ""}
          </Link>
        ))}
      </nav>

      {tab === "payments" && <PaymentsTable />}
      {tab === "bookings" && <BookingsTable />}
      {tab === "messages" && <MessagesTable />}
    </>
  );
}

async function PaymentsTable() {
  const payments = await db.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { booking: { select: { name: true, email: true, phone: true } } },
  });

  if (payments.length === 0) return <p className="admin-empty">No payment receipts yet.</p>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Received</th>
            <th>Member</th>
            <th>Plan</th>
            <th>Receipt</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{dateFmt.format(p.createdAt)}</td>
              <td>
                {p.booking.name}
                <br />
                <a href={`mailto:${p.booking.email}`}>{p.booking.email}</a>
                <br />
                {p.booking.phone}
              </td>
              <td>
                {getPlan(p.plan)?.name ?? p.plan}
                <br />
                {formatNaira(p.amountNaira)}
              </td>
              <td>
                <a href={`/api/admin/receipts/${p.id}`} target="_blank" rel="noopener noreferrer">
                  View receipt
                </a>
              </td>
              <td>
                <span className={`badge badge--${p.status}`}>{p.status}</span>
              </td>
              <td>
                <PaymentReviewButtons id={p.id} status={p.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function BookingsTable() {
  const bookings = await db.booking.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  if (bookings.length === 0) return <p className="admin-empty">No bookings yet.</p>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Received</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Preferred time</th>
            <th>Goal</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{dateFmt.format(b.createdAt)}</td>
              <td>{b.name}</td>
              <td>
                <a href={`mailto:${b.email}`}>{b.email}</a>
                <br />
                <a href={`tel:${b.phone.replace(/[^+\d]/g, "")}`}>{b.phone}</a>
              </td>
              <td>{label(PREFERRED_TIMES, b.preferredTime)}</td>
              <td>{label(GOALS, b.goal)}</td>
              <td>{b.intent === "trial" ? "Free trial" : "Membership"}</td>
              <td>
                <BookingStatusSelect id={b.id} status={b.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function MessagesTable() {
  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  if (messages.length === 0) return <p className="admin-empty">No messages yet.</p>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Received</th>
            <th>From</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m.id}>
              <td>{dateFmt.format(m.createdAt)}</td>
              <td>
                {m.name}
                <br />
                <a href={`mailto:${m.email}`}>{m.email}</a>
              </td>
              <td>{label(CONTACT_SUBJECTS, m.subject)}</td>
              <td className="admin-message">{m.message}</td>
              <td>
                <span className={`badge ${m.handled ? "badge--handled" : "badge--new"}`}>
                  {m.handled ? "handled" : "new"}
                </span>
              </td>
              <td>
                <MessageHandledButton id={m.id} handled={m.handled} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
