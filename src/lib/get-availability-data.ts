import { createAdminClient } from "./supabase/admin";
import { isSupabaseConfigured } from "./supabase/env";
import { getGoogleBlockedSlots, isGoogleConfigured } from "./google-calendar";
import { MOCK_DAY_OVERRIDES, MOCK_BOOKINGS } from "./mock-data";
import { SLOT_TIMES, type BookingStub, type DayOverrides } from "./availability";

export type AvailabilityData = {
  overrides: DayOverrides;
  bookings: BookingStub[];
};

const AVAILABILITY_WINDOW_DAYS = 60;

/**
 * Server-only: reads live availability from Supabase (+ Google Calendar
 * blocks, if connected), or falls back to mock data until a project is
 * connected. Uses the admin client for a simple read of non-PII columns —
 * fine here since this never runs in the browser.
 */
export async function getAvailabilityData(): Promise<AvailabilityData> {
  if (!isSupabaseConfigured) {
    return { overrides: MOCK_DAY_OVERRIDES, bookings: MOCK_BOOKINGS };
  }

  const supabase = createAdminClient();

  const now = new Date();
  const windowEnd = new Date(now);
  windowEnd.setDate(windowEnd.getDate() + AVAILABILITY_WINDOW_DAYS);

  const [overridesRes, bookingsRes, googleBlocked] = await Promise.all([
    supabase.from("day_overrides").select("booking_date, slots"),
    supabase
      .from("bookings")
      .select("booking_date, booking_time, status")
      .in("status", ["pending_verification", "confirmed"]),
    isGoogleConfigured
      ? getGoogleBlockedSlots(now, windowEnd)
      : Promise.resolve({} as Record<string, (typeof SLOT_TIMES)[number][]>),
  ]);

  const overrides: DayOverrides = {};
  for (const row of overridesRes.data ?? []) {
    overrides[row.booking_date] = row.slots.length === 0 ? "closed" : row.slots;
  }

  for (const [date, blockedTimes] of Object.entries(googleBlocked)) {
    const currentOpen = overrides[date] === "closed" ? [] : overrides[date] ?? [...SLOT_TIMES];
    const remaining = currentOpen.filter((t) => !blockedTimes.includes(t));
    overrides[date] = remaining.length === 0 ? "closed" : remaining;
  }

  const bookings: BookingStub[] = (bookingsRes.data ?? []).map((row) => ({
    date: row.booking_date,
    time: row.booking_time,
    status: row.status === "confirmed" ? "confirmed" : "pending",
  }));

  return { overrides, bookings };
}
