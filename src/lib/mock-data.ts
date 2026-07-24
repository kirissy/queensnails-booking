import { dateKey, type BookingStub, type DayOverrides } from "./availability";

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

/**
 * Placeholder data standing in for the admin dashboard's per-day toggles
 * and Supabase-backed bookings until those are wired up (build order steps 4-6).
 */
export const MOCK_DAY_OVERRIDES: DayOverrides = {
  [dateKey(daysFromNow(3))]: ["11:00"],
  [dateKey(daysFromNow(6))]: "closed",
};

export const MOCK_BOOKINGS: BookingStub[] = [
  // Only one booking per day is allowed — each entry here is a different day.
  { date: dateKey(daysFromNow(2)), time: "18:00", status: "confirmed" },
  { date: dateKey(daysFromNow(5)), time: "15:00", status: "pending" },
  { date: dateKey(daysFromNow(9)), time: "11:00", status: "confirmed" },
];
