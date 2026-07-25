-- Proof of payment is no longer uploaded through the site — customers send
-- it via WhatsApp after their slot is reserved, and the owner checks it
-- there before manually confirming in the admin dashboard.
alter table bookings alter column proof_photo_path drop not null;
