import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isGoogleConfigured } from "@/lib/google-calendar";
import { AdminSlotCalendar } from "@/components/admin/AdminSlotCalendar";
import type { DayOverrides } from "@/lib/availability";

export default async function SlotsPage({
  searchParams,
}: {
  searchParams: Promise<{ google?: string }>;
}) {
  const { google } = await searchParams;

  if (!isSupabaseConfigured) {
    return (
      <p className="font-sans text-sm text-charcoal/60">
        Supabase isn&apos;t connected yet, so slot overrides can&apos;t be
        saved. See the project README for the env vars this needs.
      </p>
    );
  }

  const supabase = await createClient();
  const [{ data: overrideRows }, { data: settings }] = await Promise.all([
    supabase.from("day_overrides").select("booking_date, slots"),
    supabase.from("studio_settings").select("google_refresh_token").eq("id", true).single(),
  ]);

  const overrides: DayOverrides = {};
  for (const row of overrideRows ?? []) {
    overrides[row.booking_date] = row.slots.length === 0 ? "closed" : row.slots;
  }

  const googleConnected = Boolean(settings?.google_refresh_token);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Slots &amp; Calendar</h1>
        <p className="mt-1 font-sans text-sm text-charcoal/60">
          Tap a date to toggle which of the 11:00 / 18:00 slots are open, or
          close the whole day.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-nude/60 bg-cream-dark/30 px-5 py-4">
        <span className="font-sans text-sm text-charcoal">
          Google Calendar:{" "}
          {googleConnected ? (
            <span className="text-rose-gold-dark">Connected</span>
          ) : (
            <span className="text-charcoal/50">Not connected</span>
          )}
        </span>
        {isGoogleConfigured ? (
          <a
            href="/api/google/connect"
            className="rounded-full bg-charcoal px-4 py-1.5 font-sans text-xs font-medium text-cream hover:bg-burgundy"
          >
            {googleConnected ? "Reconnect" : "Connect"}
          </a>
        ) : (
          <span className="font-sans text-xs text-charcoal/40">
            (Google OAuth credentials not set)
          </span>
        )}
        {google === "connected" && (
          <span className="font-sans text-xs text-rose-gold-dark">Connected successfully.</span>
        )}
        {google === "error" && (
          <span className="font-sans text-xs text-burgundy">
            Couldn&apos;t connect — please try again.
          </span>
        )}
      </div>

      <AdminSlotCalendar initialOverrides={overrides} />
    </div>
  );
}
