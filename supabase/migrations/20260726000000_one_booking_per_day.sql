-- Add a third daily slot (15:00) and change capacity from "one booking per
-- slot" to "one booking per day total" — once any slot is taken, the whole
-- day closes instead of just that specific time.

alter type slot_time add value if not exists '15:00';

drop index if exists bookings_active_slot_idx;

create unique index bookings_active_slot_idx
  on bookings (booking_date)
  where status in ('pending_verification', 'confirmed');
