"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  dateKey,
  isSunday,
  parseDateKey,
  SLOT_TIMES,
  type DateKey,
  type DayOverrides,
  type SlotTime,
} from "@/lib/availability";
import { setDayOverride } from "@/app/admin/actions";
import type { BookingStatus } from "@/lib/supabase/types";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type CalendarBooking = {
  date: DateKey;
  time: SlotTime;
  status: BookingStatus;
  customerName: string;
  service: string;
};

const ACTIVE_STATUSES: readonly BookingStatus[] = [
  "pending_verification",
  "confirmed",
  "completed",
  "no_show",
];

const DOT_COLOR: Partial<Record<BookingStatus, string>> = {
  pending_verification: "bg-gold",
  confirmed: "bg-rose-gold",
  completed: "bg-charcoal/40",
  no_show: "bg-burgundy",
};

const STATUS_LABEL_SHORT: Partial<Record<BookingStatus, string>> = {
  pending_verification: "Pending verification",
  confirmed: "Confirmed",
  completed: "Completed",
  no_show: "No-show",
};

export function DashboardCalendar({
  bookings,
  initialOverrides,
  googleBlocked,
}: {
  bookings: CalendarBooking[];
  initialOverrides: DayOverrides;
  /** Google freebusy blocks — only populated for the fetched window; a missing date just means "no info", not "free". */
  googleBlocked: Record<DateKey, SlotTime[]>;
}) {
  const [overrides, setOverrides] = useState(initialOverrides);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<DateKey | null>(null);
  const [isPending, startTransition] = useTransition();

  const today = dateKey(new Date());

  const bookingsByDate = useMemo(() => {
    const map = new Map<DateKey, CalendarBooking>();
    for (const b of bookings) {
      if (!ACTIVE_STATUSES.includes(b.status)) continue;
      map.set(b.date, b);
    }
    return map;
  }, [bookings]);

  const gridDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  function openSlotsFor(date: DateKey): SlotTime[] {
    const o = overrides[date];
    if (o === "closed") return [];
    return o ?? [...SLOT_TIMES];
  }

  function applyChange(date: DateKey, nextSlots: SlotTime[]) {
    setOverrides((prev) => ({
      ...prev,
      [date]: nextSlots.length === 0 ? "closed" : nextSlots,
    }));
    startTransition(async () => {
      await setDayOverride(date, nextSlots.length === 0 ? "closed" : nextSlots);
    });
  }

  function toggleSlot(date: DateKey, time: SlotTime) {
    const current = openSlotsFor(date);
    const next = current.includes(time) ? current.filter((t) => t !== time) : [...current, time];
    applyChange(date, next);
  }

  const selectedBooking = selected ? bookingsByDate.get(selected) : undefined;
  const selectedGoogleBlocks = selected ? (googleBlocked[selected] ?? []) : [];
  const selectedIsPast = selected ? selected < today : false;
  const selectedIsSunday = selected ? isSunday(parseDateKey(selected)) : false;

  return (
    <div>
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setMonth((m) => subMonths(m, 1))}
          className="rounded-full p-2 text-charcoal/60 hover:bg-blush/50"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-serif text-lg font-semibold text-charcoal">{format(month, "MMMM yyyy")}</p>
        <button
          type="button"
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="rounded-full p-2 text-charcoal/60 hover:bg-blush/50"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center font-sans text-xs text-charcoal/50">
        {WEEKDAY_LABELS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {gridDays.map((day) => {
          const inMonth = isSameMonth(day, month);
          const sunday = isSunday(day);
          const key = dateKey(day);
          const isSelected = key === selected;
          const booking = bookingsByDate.get(key);
          const closed = !booking && overrides[key] === "closed";
          const hasGoogleBlock = (googleBlocked[key] ?? []).length > 0;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={`flex flex-col items-center gap-1 rounded-xl py-2 font-sans text-sm transition-colors ${
                !inMonth ? "text-charcoal/20" : "text-charcoal hover:bg-blush/50"
              } ${isSelected ? "bg-charcoal text-cream hover:bg-charcoal" : ""}`}
            >
              {format(day, "d")}
              {inMonth && (
                <span className="flex items-center gap-0.5">
                  {booking ? (
                    <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLOR[booking.status]}`} />
                  ) : sunday || closed ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-charcoal/15" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-charcoal/0" />
                  )}
                  {hasGoogleBlock && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full border ${isSelected ? "border-cream" : "border-charcoal/40"}`}
                    />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-sans text-[11px] text-charcoal/50">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Pending
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-gold" /> Confirmed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-charcoal/40" /> Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-burgundy" /> No-show
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full border border-charcoal/40" /> Google busy
        </span>
      </div>

      {selected && (
        <div className="mt-6 rounded-2xl bg-blush/40 p-5">
          <p className="font-sans text-sm text-charcoal/70">
            {format(parseDateKey(selected), "EEEE, MMMM d")}
          </p>

          {selectedBooking ? (
            <div className="mt-3 flex flex-col gap-1">
              <p className="font-sans text-sm font-semibold text-charcoal">
                {selectedBooking.customerName}
              </p>
              <p className="font-sans text-sm text-charcoal/70">
                {selectedBooking.service} · {selectedBooking.time} WIB
              </p>
              <p className="font-sans text-xs text-charcoal/50">
                {STATUS_LABEL_SHORT[selectedBooking.status]}
              </p>
              <Link
                href={`/admin/bookings?date=${selected}`}
                className="mt-2 w-fit font-sans text-xs font-medium text-burgundy underline hover:opacity-70"
              >
                Manage in Bookings →
              </Link>
            </div>
          ) : selectedIsSunday ? (
            <p className="mt-3 font-sans text-sm text-charcoal/50">Closed on Sundays.</p>
          ) : selectedIsPast ? (
            <p className="mt-3 font-sans text-sm text-charcoal/50">
              Past date — no booking was made.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-3">
              {SLOT_TIMES.map((time) => {
                const isOpen = openSlotsFor(selected).includes(time);
                return (
                  <button
                    key={time}
                    type="button"
                    disabled={isPending}
                    onClick={() => toggleSlot(selected, time)}
                    className={`rounded-full px-5 py-2 font-sans text-sm font-medium transition-colors ${
                      isOpen ? "bg-rose-gold text-cream" : "bg-charcoal/10 text-charcoal/50"
                    }`}
                  >
                    {time} {isOpen ? "(open)" : "(closed)"}
                  </button>
                );
              })}
              <button
                type="button"
                disabled={isPending}
                onClick={() => applyChange(selected, [])}
                className="rounded-full border border-burgundy/40 px-5 py-2 font-sans text-sm font-medium text-burgundy"
              >
                Close whole day
              </button>
            </div>
          )}

          {selectedGoogleBlocks.length > 0 && (
            <p className="mt-3 font-sans text-xs text-charcoal/50">
              Owner&apos;s Google Calendar shows busy at: {selectedGoogleBlocks.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
