-- Queensnails booking schema.
-- Bookings hold a slot the moment proof-of-payment is submitted (status
-- pending_verification), not only once the owner confirms — see
-- hold_expires_at for the 60-minute abandon window.

create extension if not exists pgcrypto;

create type booking_status as enum (
  'pending_verification',
  'confirmed',
  'rejected',
  'expired',
  'completed',
  'no_show',
  'cancelled'
);

create type slot_time as enum ('11:00', '18:00');

create table bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  treatment_id text not null,
  treatment_name text not null,
  treatment_price bigint not null,
  extension_id text,
  extension_name text,
  extension_price bigint,

  booking_date date not null,
  booking_time slot_time not null,

  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  customer_notes text not null default '',
  reference_photo_path text,

  deposit_amount bigint not null default 50000,
  proof_photo_path text not null,

  status booking_status not null default 'pending_verification',
  hold_expires_at timestamptz not null default (now() + interval '60 minutes'),
  verified_at timestamptz,
  verified_by uuid references auth.users (id),
  rejection_reason text,

  balance_paid boolean not null default false,
  removal_surcharge bigint,
  admin_notes text,

  google_calendar_event_id text
);

-- One studio, at most one live (held-or-confirmed) booking per date+time.
create unique index bookings_active_slot_idx
  on bookings (booking_date, booking_time)
  where status in ('pending_verification', 'confirmed');

create index bookings_status_idx on bookings (status);
create index bookings_date_idx on bookings (booking_date);

-- Owner's per-day slot control. No row for a date = both slots open
-- (the default). slots = '{}' means the whole day is closed.
create table day_overrides (
  booking_date date primary key,
  slots slot_time[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table bookings enable row level security;
alter table day_overrides enable row level security;

-- The public site never talks to Postgres directly for writes — booking
-- creation goes through the /api/bookings route using the service role key,
-- so it can atomically check-and-hold a slot. Anonymous clients get read-only
-- access to non-PII availability columns via the view below.
create view public_slot_status as
select booking_date, booking_time, status
from bookings
where status in ('pending_verification', 'confirmed');

grant select on public_slot_status to anon;
grant select on day_overrides to anon;

create policy "Admins can do everything on bookings"
  on bookings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admins can manage day overrides"
  on day_overrides for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage: proof-of-payment and reference photos. Private bucket — only
-- admins (authenticated) can read; uploads happen server-side via the
-- service role key from the booking API route.
insert into storage.buckets (id, name, public)
values ('booking-uploads', 'booking-uploads', false)
on conflict (id) do nothing;

create policy "Admins can read booking uploads"
  on storage.objects for select
  using (bucket_id = 'booking-uploads' and auth.role() = 'authenticated');
