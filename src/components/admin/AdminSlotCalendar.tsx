"use client";

import { useMemo, useState, useTransition } from "react";
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
import { dateKey, isSunday, parseDateKey, SLOT_TIMES, type DateKey, type DayOverrides, type SlotTime } from "@/lib/availability";
import { setDayOverride } from "@/app/admin/actions";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AdminSlotCalendar({ initialOverrides }: { initialOverrides: DayOverrides }) {
  const [overrides, setOverrides] = useState(initialOverrides);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<DateKey | null>(null);
  const [isPending, startTransition] = useTransition();

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
    const next = current.includes(time)
      ? current.filter((t) => t !== time)
      : [...current, time];
    applyChange(date, next);
  }

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
        <p className="font-serif text-lg text-charcoal">{format(month, "MMMM yyyy")}</p>
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
          const open = openSlotsFor(key);
          const isSelected = key === selected;

          return (
            <button
              key={key}
              type="button"
              disabled={!inMonth || sunday}
              onClick={() => setSelected(key)}
              className={`flex flex-col items-center gap-1 rounded-xl py-2 font-sans text-sm transition-colors ${
                !inMonth ? "text-charcoal/20" : sunday ? "cursor-not-allowed text-charcoal/25" : "text-charcoal hover:bg-blush/50"
              } ${isSelected ? "bg-charcoal text-cream hover:bg-charcoal" : ""}`}
            >
              {format(day, "d")}
              {inMonth && !sunday && (
                <span className="flex gap-0.5">
                  {SLOT_TIMES.map((t) => (
                    <span
                      key={t}
                      className={`h-1 w-1 rounded-full ${
                        open.includes(t) ? (isSelected ? "bg-cream" : "bg-gold") : "bg-charcoal/15"
                      }`}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected && !isSunday(parseDateKey(selected)) && (
        <div className="mt-6 rounded-2xl bg-blush/40 p-5">
          <p className="font-sans text-sm text-charcoal/70">
            {format(parseDateKey(selected), "EEEE, MMMM d")}
          </p>
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
        </div>
      )}
    </div>
  );
}
