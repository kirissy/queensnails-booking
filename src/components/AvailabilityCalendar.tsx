"use client";

import { useMemo, useState } from "react";
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
  getDayAvailability,
  parseDateKey,
  type BookingStub,
  type DateKey,
  type DayOverrides,
  type SlotTime,
} from "@/lib/availability";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
  overrides: DayOverrides;
  bookings: BookingStub[];
  initialDate?: DateKey | null;
  initialTime?: SlotTime | null;
  onSelect?: (date: DateKey, time: SlotTime) => void;
};

export function AvailabilityCalendar({
  overrides,
  bookings,
  initialDate,
  initialTime,
  onSelect,
}: Props) {
  const [month, setMonth] = useState(() =>
    startOfMonth(initialDate ? parseDateKey(initialDate) : new Date())
  );
  const [selectedDate, setSelectedDate] = useState<DateKey | null>(
    initialDate ?? null
  );
  const [selectedTime, setSelectedTime] = useState<SlotTime | null>(
    initialTime ?? null
  );

  const gridDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  const selectedDayAvailability = useMemo(() => {
    if (!selectedDate) return null;
    return getDayAvailability(parseDateKey(selectedDate), overrides, bookings);
  }, [selectedDate, overrides, bookings]);

  function handleDayClick(day: Date) {
    const availability = getDayAvailability(day, overrides, bookings);
    if (!availability.hasAvailability) return;
    setSelectedDate(availability.date);
    setSelectedTime(null);
  }

  function handleTimeClick(time: SlotTime) {
    if (!selectedDate) return;
    setSelectedTime(time);
    onSelect?.(selectedDate, time);
  }

  return (
    <div>
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setMonth((m) => subMonths(m, 1))}
          className="rounded-full p-2 text-charcoal/60 transition-colors hover:bg-blush/50 hover:text-charcoal"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-serif text-lg text-charcoal">
          {format(month, "MMMM yyyy")}
        </p>
        <button
          type="button"
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="rounded-full p-2 text-charcoal/60 transition-colors hover:bg-blush/50 hover:text-charcoal"
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
          const availability = getDayAvailability(day, overrides, bookings);
          const key = dateKey(day);
          const isSelected = key === selectedDate;
          const disabled = !inMonth || !availability.hasAvailability;

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(day)}
              className={`flex flex-col items-center gap-1 rounded-xl py-2 font-sans text-sm transition-colors ${
                !inMonth ? "text-charcoal/20" : ""
              } ${
                disabled && inMonth
                  ? "cursor-not-allowed text-charcoal/30"
                  : "text-charcoal hover:bg-blush/50"
              } ${isSelected ? "bg-rose-gold text-cream hover:bg-rose-gold" : ""}`}
            >
              {format(day, "d")}
              {inMonth && !availability.isSunday && !availability.isPast && (
                <span className="flex gap-0.5">
                  {availability.slots.map((s) => (
                    <span
                      key={s.time}
                      className={`h-1 w-1 rounded-full ${
                        s.status === "open"
                          ? isSelected
                            ? "bg-cream"
                            : "bg-rose-gold"
                          : "bg-charcoal/15"
                      }`}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selectedDayAvailability && (
        <div className="mt-6 rounded-2xl bg-blush/40 p-5">
          <p className="font-sans text-sm text-charcoal/70">
            {format(parseDateKey(selectedDayAvailability.date), "EEEE, MMMM d")} —
            approx. 2–4 hours
          </p>
          <div className="mt-3 flex gap-3">
            {selectedDayAvailability.slots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                disabled={slot.status !== "open"}
                onClick={() => handleTimeClick(slot.time)}
                className={`rounded-full px-5 py-2 font-sans text-sm font-medium transition-colors ${
                  slot.status !== "open"
                    ? "cursor-not-allowed bg-charcoal/10 text-charcoal/30"
                    : selectedTime === slot.time
                      ? "bg-charcoal text-cream"
                      : "bg-cream text-charcoal hover:bg-rose-gold hover:text-cream"
                }`}
              >
                {slot.time} {slot.status === "booked" ? "(booked)" : ""}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
