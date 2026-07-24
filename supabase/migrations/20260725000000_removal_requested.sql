-- Customer-indicated "I need my previous set removed" flag, captured during
-- service selection. This is just a heads-up note for the owner to prepare —
-- the actual removal category/fee (see REMOVAL_FEES in src/lib/pricing.ts)
-- is confirmed with the customer in person, same as the rest of the price.
alter table bookings add column removal_requested boolean not null default false;
