-- Moves the studio's services/pricing (previously hardcoded in
-- src/lib/pricing.ts) into the database so the owner can manage them from
-- the admin dashboard. `active` hides an item everywhere (pricelist +
-- booking wizard); treatments additionally have `bookable` for the
-- narrower case of "show it on the pricelist but don't let it be selected
-- online" (mirrors the old static `bookable` flag).

create table treatments (
  id text primary key,
  name text not null,
  price_min bigint not null,
  price_max bigint,
  note text,
  bookable boolean not null default true,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table extensions (
  id text primary key,
  name text not null,
  price bigint not null,
  unit text not null default 'flat' check (unit in ('flat', 'per-nail')),
  active boolean not null default true,
  sort_order integer not null default 0
);

create table removal_fees (
  id text primary key,
  label text not null,
  price bigint not null,
  active boolean not null default true,
  sort_order integer not null default 0
);

insert into treatments (id, name, price_min, price_max, note, bookable, active, sort_order) values
  ('one-plain-color', 'One Plain Colour', 275000, null, 'Choose one colour from our selection on the display menu', true, true, 0),
  ('mix-color', 'Mixed Colour', 300000, null, 'We mix your preferred colours', true, true, 10),
  ('magnet-aurora', 'Magnet / Aurora', 350000, null, 'Choose one finish design from the display menu', true, true, 20),
  ('french-full-chrome', 'French / Full Chrome', 450000, null, 'French tip design or full clear chrome design', true, true, 30),
  ('sample-design', 'Sample Design', 400000, 600000, 'Choose a design from the prepared samples — price depends on which sample', true, true, 40),
  ('other-design', 'Other Design', 0, null, 'Bring references, detailed art on all 10 nails — message us to confirm price after booking', true, true, 50);

insert into extensions (id, name, price, unit, active, sort_order) values
  ('express-tip', 'Express Tip Extension', 200000, 'flat', true, 0),
  ('polygel', 'Polygel Extension', 400000, 'flat', true, 10),
  ('fill-in', 'Fill-in Extension', 10000, 'per-nail', true, 20);

insert into removal_fees (id, label, price, active, sort_order) values
  ('removal-here', 'Previous set done at this studio (non-3D)', 50000, true, 0),
  ('removal-elsewhere', 'Previous set done at another salon (non-3D)', 100000, true, 10),
  ('removal-3d-extra', 'Extra on top, if 3D design', 25000, true, 20),
  ('removal-ext-here', 'Previous gel-extension set done at this studio', 75000, true, 30),
  ('removal-ext-elsewhere', 'Previous gel-extension set done at another salon', 150000, true, 40);

alter table treatments enable row level security;
alter table extensions enable row level security;
alter table removal_fees enable row level security;

create policy "Public can read active treatments" on treatments for select using (active);
create policy "Public can read active extensions" on extensions for select using (active);
create policy "Public can read active removal fees" on removal_fees for select using (active);

create policy "Admins can manage treatments" on treatments for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admins can manage extensions" on extensions for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admins can manage removal fees" on removal_fees for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

grant select on treatments, extensions, removal_fees to anon;
