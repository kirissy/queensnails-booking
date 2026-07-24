import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export const STUDIO_TIMEZONE = "Asia/Jakarta";

export const SLOT_TIMES = ["11:00", "15:00", "18:00"] as const;
export type SlotTime = (typeof SLOT_TIMES)[number];

/** yyyy-MM-dd, always read in the studio's timezone regardless of caller's clock. */
export type DateKey = string;

export function dateKey(date: Date): DateKey {
  return formatInTimeZone(date, STUDIO_TIMEZONE, "yyyy-MM-dd");
}

export function isSunday(date: Date): boolean {
  return toZonedTime(date, STUDIO_TIMEZONE).getDay() === 0;
}

/** Parses a yyyy-MM-dd DateKey as a local calendar date, avoiding the UTC-midnight shift `new Date(string)` applies in negative-offset timezones. */
export function parseDateKey(key: DateKey): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Owner's per-day slot control. A date with no entry defaults to all slots
 * open (the studio's normal capacity) unless it's a Sunday. Only one of
 * these can actually be booked per day — see getDayAvailability.
 */
export type DayOverride = SlotTime[] | "closed";
export type DayOverrides = Record<DateKey, DayOverride>;

export type BookingStub = {
  date: DateKey;
  time: SlotTime;
  /** Pending holds a slot too — it isn't released until confirmed, rejected, or the hold expires. */
  status: "pending" | "confirmed";
};

export type SlotStatus = "open" | "booked" | "closed";

export type DayAvailability = {
  date: DateKey;
  isSunday: boolean;
  isPast: boolean;
  slots: { time: SlotTime; status: SlotStatus }[];
  /** true when at least one slot can still be booked */
  hasAvailability: boolean;
};

export function getDayAvailability(
  date: Date,
  overrides: DayOverrides,
  bookings: BookingStub[],
  now: Date = new Date()
): DayAvailability {
  const key = dateKey(date);
  const sunday = isSunday(date);
  // Same-day booking isn't allowed — customers need at least 1 day's notice.
  const isPast = key <= dateKey(now);

  const override = overrides[key];
  const ownerOpenSlots: readonly SlotTime[] =
    override === "closed" ? [] : override ?? SLOT_TIMES;

  const bookingsToday = bookings.filter((b) => b.date === key);
  const bookedTimes = new Set(bookingsToday.map((b) => b.time));
  // Only one booking per day total — once any slot is taken, the rest of the day closes too.
  const dayIsFull = bookingsToday.length > 0;

  const slots: DayAvailability["slots"] = SLOT_TIMES.map((time) => {
    if (bookedTimes.has(time)) {
      return { time, status: "booked" };
    }
    if (sunday || isPast || dayIsFull || !ownerOpenSlots.includes(time)) {
      return { time, status: "closed" };
    }
    return { time, status: "open" };
  });

  return {
    date: key,
    isSunday: sunday,
    isPast,
    slots,
    hasAvailability: slots.some((s) => s.status === "open"),
  };
}

export function getAvailabilityRange(
  startDate: Date,
  days: number,
  overrides: DayOverrides,
  bookings: BookingStub[],
  now: Date = new Date()
): DayAvailability[] {
  const result: DayAvailability[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    result.push(getDayAvailability(d, overrides, bookings, now));
  }
  return result;
}
