# My Fitness Studio – Next.js + backend

A Next.js (App Router, TypeScript) rebuild of the static GYMNASTICS site, with a real backend:
forms are saved to a database, payment receipts are uploaded and stored privately, and an
admin dashboard lets the studio review everything.

## Quick start

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL, DIRECT_URL, ADMIN_PASSWORD, SESSION_SECRET
npm run db:push             # creates the tables in your Supabase database
npm run dev                 # http://localhost:3000
```

Admin dashboard: <http://localhost:3000/admin> (locked until `ADMIN_PASSWORD` and
`SESSION_SECRET` are set in `.env`).

Generate a session secret with `openssl rand -base64 48`.

### Supabase setup

1. Create a project at <https://supabase.com> and remember the database password.
2. In the dashboard click **Connect** and copy two connection strings into `.env`:
   - `DATABASE_URL`: Transaction pooler (port 6543), keep `?pgbouncer=true&connection_limit=1`.
   - `DIRECT_URL`: Session pooler or direct connection (port 5432), used by Prisma commands.
3. Run `npm run db:push` to create the `Booking`, `Payment` and `ContactMessage` tables.
   Prisma stays the ORM; Supabase is just the Postgres host. Use `npm run db:migrate` instead
   if you want migration files.
4. Tables created by Prisma are reachable through Supabase's public REST API unless Row Level
   Security is on. This app only talks to the database server-side with the Postgres password,
   so in the Supabase SQL editor enable RLS on all three tables (with no policies) to block
   anonymous API access:
   ```sql
   alter table "Booking" enable row level security;
   alter table "Payment" enable row level security;
   alter table "ContactMessage" enable row level security;
   ```
   Prisma connects as the `postgres` role, which bypasses RLS, so the app keeps working.

## Pages

| Old file          | New route       | Notes                                              |
| ----------------- | --------------- | -------------------------------------------------- |
| `index.html`      | `/`             | Hero uses `next/image`                             |
| `classes.html`    | `/classes`      |                                                    |
| `trainers.html`   | `/trainers`     |                                                    |
| `membership.html` | `/membership`   |                                                    |
| `contactus.html`  | `/contact`      | Saves to the database                              |
| `joinus.html`     | `/join`         | Saves a booking, then goes to payment or thank-you |
| `payment.html`    | `/payment`      | Needs a booking (`?booking=<id>`), uploads receipt |
| `thankyou.html`   | `/thank-you`    |                                                    |
| –                 | `/admin`        | New: payments, bookings, messages                  |

The 11 CSS files are merged into `src/app/globals.css` using CSS variables for light/dark mode.
Dark mode is applied before first paint, so there is no white flash.

## Backend

All endpoints live in `src/app/api`. Public ones return `{ ok: true, ... }` or
`{ ok: false, error, fieldErrors? }`.

| Method | Path                         | Purpose                                                                 |
| ------ | ---------------------------- | ----------------------------------------------------------------------- |
| POST   | `/api/contact`               | JSON `{ name, email, subject, message }` → saves a message              |
| POST   | `/api/bookings`              | JSON `{ name, email, phone, preferredTime, goal, intent }` → `{ id }`   |
| POST   | `/api/payments`              | multipart `{ bookingId, plan, receipt }` → stores receipt + payment     |
| GET    | `/api/plans` `/classes` `/trainers` | Site content as JSON                                             |
| POST   | `/api/admin/login` `/logout` | Admin session cookie                                                    |
| PATCH  | `/api/admin/payments/:id`    | `{ status: approved \| rejected \| pending, note? }`                    |
| PATCH  | `/api/admin/bookings/:id`    | `{ status: new \| contacted \| done }`                                  |
| PATCH  | `/api/admin/messages/:id`    | `{ handled: boolean }`                                                  |
| GET    | `/api/admin/receipts/:id`    | Streams a receipt (admin only)                                          |

Data model (`prisma/schema.prisma`): `Booking`, `Payment` (linked to a booking), `ContactMessage`.

### Security notes

- Inputs are validated server-side with zod; the browser's checks are only a convenience.
- Plan prices come from `src/lib/content.ts`, never from the browser.
- Receipts: max 5 MB, type is detected from the file's first bytes (JPG/PNG/PDF only), saved
  under a random name in `RECEIPTS_DIR` (outside `public/`), and only viewable by a signed-in admin.
- Admin login uses a constant-time password check and an HMAC-signed, HttpOnly, SameSite=Strict
  cookie (8 hours). Admin mutations also check the `Origin` header.
- Forms have a hidden honeypot field and per-IP rate limits.

## Things to know before deploying

- **Rate limiting is in-memory.** Fine for one server; use Redis/Upstash for several instances.
- **Receipt files are still saved on local disk** (`RECEIPTS_DIR`), so they need a persistent disk
  (a VPS, Docker volume, Railway/Fly volume). On Vercel/serverless the disk is wiped between
  requests, so move receipts to Supabase Storage (private bucket) or S3/R2 by replacing
  `src/lib/receipts.ts`. The database already works on serverless.
- **No emails are sent yet.** The thank-you page promises a reply within 24 hours; the admin
  dashboard is where the team sees new items. Add Resend/Nodemailer in the three POST routes if
  you want notifications.
- Payments are manual bank transfers confirmed by an admin; there is no payment gateway.
- Bank and contact details are read from `.env` (defaults match the original site).

## Content changes from the original

- Prices show `₦` instead of `#`.
- Fixed spacing typos (e.g. "scheduleand", "fees.Choose") and removed the stray `**` around the studio name on the home page.
- Join form: every option previously had the value `yoga`/`pilates`/`spin`, and two fields shared `id="class"`. They now have proper values and unique ids.
- Payment page now shows the amount to transfer once a plan is chosen.
- The HIIT class still lists "Guided Breathwork & Mindfulness" (copied from Yoga in the original). Edit it in `src/lib/content.ts`.
- `istockphoto-1613733412-1024x1024.jpg` was not referenced by any page, so it was not copied.

## Scripts

`npm run dev` · `npm run build` · `npm start` · `npm run typecheck` · `npm run db:push` · `npm run db:studio`
