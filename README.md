# Queensnails Booking

Online booking app for Queensnails, a private home nail art studio in Jakarta. Customers book a service and pay a Rp 50,000 deposit via bank transfer (with photo proof), the studio owner verifies it from an admin dashboard, and confirmed bookings sync to her Google Calendar.

## Stack

Next.js (App Router) + TypeScript + Tailwind, Supabase (Postgres, Auth, Storage), Google Calendar API, Resend for email. See `AGENTS.md` — this project pins a Next.js version with breaking changes from older docs/training data (e.g. `middleware.ts` is now `proxy.ts`); check `node_modules/next/dist/docs/` before assuming an API.

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
2. Run the SQL files in `supabase/migrations/` against it, in order (SQL Editor, or `supabase db push` if you link the CLI).
3. Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from Project Settings → API.
4. Create the owner's admin login: Authentication → Users → Add user (email + password). There's no self-signup flow by design — it's a single admin account.

### Google Calendar (optional — two-way sync)

1. In [Google Cloud Console](https://console.cloud.google.com), create an OAuth client (type "Web application") and enable the Google Calendar API.
2. Add `GOOGLE_REDIRECT_URI` (e.g. `https://yourdomain.com/api/google/callback`) as an authorized redirect URI on that client.
3. Fill in `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`.
4. As the studio owner, sign in to `/admin` and click **Connect** on the Slots page (`/admin/slots`) — this is `/api/google/connect`, which redirects to Google's consent screen and stores a refresh token in `studio_settings`.

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

### WhatsApp

No WhatsApp Business API integration is built — per the spec, click-to-chat (`wa.me`) links are used instead, both for customers messaging the studio and for the owner messaging customers from the admin dashboard. No credentials needed.

### Scheduled jobs

Two routes run on a daily schedule (Vercel's Hobby plan doesn't allow cron more often than once a day):

- `GET /api/cron/expire-holds` — bookkeeping only. The 60-minute abandoned-hold window is actually enforced lazily in `/api/bookings` the moment someone else tries to claim the same slot, so correctness never depends on this cron's cadence — it just flips stale rows to `expired` so they don't linger in the admin queue.
- `GET /api/cron/reminders` — emails customers with a confirmed booking the next day.

`vercel.json` already declares both as Vercel Cron jobs. Set `CRON_SECRET` to any random string — Vercel sends it automatically as `Authorization: Bearer $CRON_SECRET`. On another host, call these on the same schedule with that header yourself.

## Project structure

- `src/lib/pricing.ts`, `src/lib/policy.ts` — the studio's fixed pricelist and booking policy (verbatim copy, reused across the booking flow, emails, and admin).
- `src/lib/availability.ts` — the slot engine (Sundays closed, 11:00/18:00 fixed slots, Asia/Jakarta timezone).
- `src/lib/supabase/` — browser/server/admin Supabase clients. `admin.ts` uses the service role key and is server-only.
- `src/app/book/` — the customer booking wizard (service → slot → details → policy → payment/proof → confirmation).
- `src/app/admin/` — the owner's dashboard: deposit-verification queue (`/admin`, the default view), bookings list, slot/calendar controls, all behind Supabase Auth (`src/proxy.ts` gates `/admin/*`).
- `supabase/migrations/` — schema: `bookings`, `day_overrides`, `studio_settings`, storage bucket for proof-of-payment uploads.
- `src/lib/instagram.ts` — Instagram Graph API fetcher for the homepage post feed.
- `public/logo.png` / `public/logo-white.png`, `public/icon.png` / `public/icon-white.png` — the real logo, trimmed and squared from the owner's source files; the white variants are derived from the same alpha channel for use on the burgundy header/footer.
