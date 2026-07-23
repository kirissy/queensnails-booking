-- Single-row settings table. Holds the owner's Google Calendar OAuth refresh
-- token once she connects her account (see /api/google/connect).
create table studio_settings (
  id boolean primary key default true,
  google_refresh_token text,
  google_calendar_id text default 'primary',
  constraint studio_settings_singleton check (id)
);

insert into studio_settings (id) values (true);

alter table studio_settings enable row level security;

create policy "Admins can manage studio settings"
  on studio_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
