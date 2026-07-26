# Queensnails Booking

Online booking app for Queensnails, a private home nail art studio in Jakarta. Customers reserve a slot online (held for 60 minutes), get an automated WhatsApp message with bank transfer details, and send their payment proof back over WhatsApp. The studio owner checks it there and manually confirms the booking from an admin dashboard, which syncs it to her Google Calendar.

## Stack

Next.js (App Router) + TypeScript + Tailwind, Supabase (Postgres, Auth, Storage), Google Calendar API, Resend for email, WhatsApp Cloud API for the reservation message, Instagram Graph API for the homepage feed. See `AGENTS.md` — this project pins a Next.js version with breaking changes from older docs/training data (e.g. `middleware.ts` is now `proxy.ts`); check `node_modules/next/dist/docs/` before assuming an API.

## Running locally

```bash
npm install
npm run dev
```

Without any environment variables set, the site runs on mock data (`src/lib/mock-data.ts`) — the homepage, `/services`, and the `/book` wizard all work end-to-end, but nothing persists and `/admin` shows a "not connected" placeholder.

## Connecting real services

Copy `.env.example` to `.env.local` and fill in as you go — each block below is independent, so you can wire up Supabase without touching Google/Resend yet.

### Supabase (required for real bookings + admin)

1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL files in `supabase/migrations/` against it, in order (SQL Editor, or `supabase db push` if you link the CLI). `20260727000001_services_pricing.sql` seeds the `treatments`/`extensions`/`removal_fees` tables with the studio's current pricing — until it's run, `/services` and `/book` will render with an empty pricelist (no crash, just nothing to show).
3. Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from Project Settings → API.
4. Create the owner's admin login: Authentication → Users → Add user (email + password). There's no self-signup flow by design — it's a single admin account.
5. Under Authentication → URL Configuration, add `<your-site-url>/admin/auth/confirm` (and `http://localhost:3000/admin/auth/confirm` for local dev) to **Redirect URLs** — required for the "Forgot password?" flow on `/admin/login` to work; without it Supabase rejects the reset link's redirect.

### Google Calendar (optional — two-way sync)

1. In [Google Cloud Console](https://console.cloud.google.com), create an OAuth client (type "Web application") and enable the Google Calendar API.
2. Add `GOOGLE_REDIRECT_URI` (e.g. `https://yourdomain.com/api/google/callback`) as an authorized redirect URI on that client.
3. Fill in `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`.
4. As the studio owner, sign in to `/admin` and click **Connect** on the Dashboard — this is `/api/google/connect`, which redirects to Google's consent screen and stores a refresh token in `studio_settings`.

Without this, bookings are still confirmed and emailed — they just don't create a calendar event, and the owner's manual Google Calendar blocks won't affect site availability.

### Resend (optional — transactional email)

1. Create an account at [resend.com](https://resend.com) and verify a sending domain.
2. Fill in `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `OWNER_EMAIL` (where new-proof and cancellation/no-show alerts go).

Without this, emails are skipped and logged to the server console instead — the booking flow itself doesn't depend on it.

### Instagram (optional — homepage post feed)

1. Convert the studio's Instagram account to a professional (Business or Creator) account if it isn't already.
2. Create a Meta Developer app with the Instagram API product and generate a long-lived access token for that account — see [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login).
3. Fill in `INSTAGRAM_ACCESS_TOKEN`.

Without this, the homepage shows placeholder tiles in the brand palette instead of real posts (`src/lib/instagram.ts`) — everything else on the page still works. Long-lived tokens expire after 60 days and need refreshing; there's no refresh flow built yet since this needs a real token to test against.

### WhatsApp (required for the automated reservation message)

The message telling a customer their slot is reserved and how to pay is sent automatically via the WhatsApp Cloud API — this needs real setup through Meta, not just an API key:

1. Create a Meta Developer app, add the WhatsApp product, and set up a WhatsApp Business Account (WABA) with a registered phone number (Meta's free test number works for development; production needs your own verified number).
2. Generate a permanent access token for the WABA (via a System User in Meta Business Manager — the short-lived token you get by default in the app dashboard expires in 24h).
3. **Submit a message template for approval** — business-initiated messages can't be free text, they have to use a pre-approved template. Create one named to match `WHATSAPP_TEMPLATE_NAME` (default `booking_slot_reserved`), category **Utility**, with this body and exactly 3 variables in this order (name, date, time):
   > Hi {{1}}, your queensnails appointment on {{2}} at {{3}} WIB is reserved for the next 60 minutes. Please transfer Rp50,000 to BCA 5490409051 (Aurelia Queena) and reply here with your payment proof to confirm. If we don't receive it in time, this slot will be released.

   Approval is manual on Meta's side and can take anywhere from minutes to a couple of days.
4. Fill in `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` (found in the app dashboard's WhatsApp → API Setup page). Adjust `WHATSAPP_TEMPLATE_NAME`/`WHATSAPP_TEMPLATE_LANGUAGE` if you named or localized the template differently.

Without this, the WhatsApp send is skipped (logged to the server console) but the booking still goes through — the reservation email covers the same information as a fallback, so nothing is silently lost, it's just not on WhatsApp until this is set up.

The owner's own outbound messaging (checking a customer's payment proof, following up) still just uses plain `wa.me` click-to-chat links (`src/lib/whatsapp.ts`) — no API needed for that side, since she's a human replying, not the system sending unprompted.

### Scheduled jobs

Two routes run on a daily schedule (Vercel's Hobby plan doesn't allow cron more often than once a day):

- `GET /api/cron/expire-holds` — bookkeeping only. The 60-minute abandoned-hold window is actually enforced lazily in `/api/bookings` the moment someone else tries to claim the same slot, so correctness never depends on this cron's cadence — it just flips stale rows to `expired` so they don't linger in the admin queue.
- `GET /api/cron/reminders` — emails customers with a confirmed booking the next day.

`vercel.json` already declares both as Vercel Cron jobs. Set `CRON_SECRET` to any random string — Vercel sends it automatically as `Authorization: Bearer $CRON_SECRET`. On another host, call these on the same schedule with that header yourself.

## Deploying to Vercel

`.env.local` is only read locally — it's gitignored and Vercel never sees it. Environment variables have to be added separately in the Vercel dashboard (**Settings → Environment Variables**), and a few things trip people up:

- Check the **Production** box for each variable. It's easy to add one scoped to only Preview/Development and have the live site silently keep running on mock data.
- Vercel snapshots env vars into the deployment at **build time**, not live at runtime. Adding or changing a variable does nothing to deployments that already exist — you have to trigger a new one (Deployments tab → **Redeploy**, or push a commit) *after* saving the variable, not before.
- Set `NEXT_PUBLIC_SITE_URL` to your actual Vercel URL, not `http://localhost:3000` — it's used in email links back to the admin dashboard.

If `/admin` shows "Supabase isn't connected yet" on the live site but works fine on `npm run dev` locally, it's this — not a code issue.

## Project structure

- `src/lib/pricing.ts` — deposit amount, IDR formatting, and the free-inclusions list (nothing that needs a price, so not worth a CRUD table). `src/lib/policy.ts` — the studio's booking policy (verbatim copy, reused across the booking flow, emails, and admin). Treatments/extensions/removal fees used to live in `pricing.ts` too but are now database-backed — see `src/lib/services-data.ts` and `/admin/services`.
- `src/lib/availability.ts` — the slot engine (Sundays closed, 11:00/15:00/18:00 fixed slots, one booking per day, Asia/Jakarta timezone, ≥1 day lead time).
- `src/lib/supabase/` — browser/server/admin Supabase clients. `admin.ts` uses the service role key and is server-only.
- `src/lib/whatsapp.ts` — automated reservation message via the WhatsApp Cloud API, plus the plain `wa.me` click-to-chat helper used by the admin dashboard.
- `src/app/book/` — the customer booking wizard (service → slot → details → policy → reserve → confirmation). Proof of payment is sent over WhatsApp, not uploaded on the site.
- `src/app/admin/` — the owner's dashboard, a sidebar layout (top bar + horizontal nav on mobile) behind Supabase Auth (`src/proxy.ts` gates `/admin/*`). `/admin` is an overview: booking/revenue stats for the month, Google Calendar connect status, and a month calendar showing appointments, Google Calendar busy blocks, and per-day slot open/close controls (`day_overrides`). `/admin/bookings` lists every booking regardless of status with filter/sort/search and status-appropriate actions (confirm, reject, mark balance paid, no-show, cancel, reschedule) — deep-linkable via `?status=`/`?date=`/`?search=`. `/admin/customers` groups bookings by phone number into a customer list (total bookings, total spent, last visit) with links into filtered Bookings. `/admin/services` is CRUD for the treatments/extensions/removal fees shown on `/services` and the booking wizard (`src/app/admin/services-actions.ts`) — add/edit/delete/reorder, with an `active` flag to hide an item without deleting it and (treatments only) a `bookable` flag to show-but-disable online selection. `/admin/forgot-password` → `/admin/auth/confirm` → `/admin/reset-password` is the self-serve password reset flow.
- `supabase/migrations/` — schema: `bookings`, `day_overrides`, `studio_settings`, storage bucket for optional reference-photo uploads (not proof of payment, which never touches the site).
- `src/lib/instagram.ts` — Instagram Graph API fetcher for the homepage post feed.
- `public/logo.png` / `public/logo-white.png`, `public/icon.png` / `public/icon-white.png` — the real logo, trimmed and squared from the owner's source files; the white variants are derived from the same alpha channel for use on the burgundy header/footer.
