"use client";

import { useMemo, useState } from "react";
import { dateKey } from "@/lib/availability";
import { BookingRow, STATUS_LABEL, type BookingRowData } from "./BookingRow";
import type { BookingStatus } from "@/lib/supabase/types";

const STATUS_OPTIONS: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending_verification", label: STATUS_LABEL.pending_verification },
  { value: "confirmed", label: STATUS_LABEL.confirmed },
  { value: "completed", label: STATUS_LABEL.completed },
  { value: "no_show", label: STATUS_LABEL.no_show },
  { value: "cancelled", label: STATUS_LABEL.cancelled },
  { value: "rejected", label: STATUS_LABEL.rejected },
  { value: "expired", label: STATUS_LABEL.expired },
];

type DateFilter = "all" | "upcoming" | "past";
type SortKey = "date_desc" | "date_asc" | "created_desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "date_desc", label: "Date (upcoming first)" },
  { value: "date_asc", label: "Date (earliest first)" },
  { value: "created_desc", label: "Recently booked" },
];

export function BookingsBoard({
  bookings,
  initialStatus,
  initialDate,
  initialSearch,
}: {
  bookings: BookingRowData[];
  initialStatus?: BookingStatus;
  initialDate?: string;
  initialSearch?: string;
}) {
  const [status, setStatus] = useState<BookingStatus | "all">(initialStatus ?? "all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [exactDate, setExactDate] = useState<string | null>(initialDate ?? null);
  const [search, setSearch] = useState(initialSearch ?? "");
  const [sort, setSort] = useState<SortKey>("date_desc");

  const today = dateKey(new Date());

  const filtered = useMemo(() => {
    let list = bookings;
    if (status !== "all") list = list.filter((b) => b.status === status);
    if (exactDate) list = list.filter((b) => b.date === exactDate);
    if (dateFilter === "upcoming") list = list.filter((b) => b.date >= today);
    if (dateFilter === "past") list = list.filter((b) => b.date < today);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.customerName.toLowerCase().includes(q) || b.customerPhone.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      if (sort === "date_asc") {
        return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
      }
      if (sort === "date_desc") {
        return b.date.localeCompare(a.date) || b.time.localeCompare(a.time);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [bookings, status, exactDate, dateFilter, search, sort, today]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as BookingStatus | "all")}
          className="rounded-full border border-nude/60 bg-cream px-4 py-2 font-sans text-xs text-charcoal outline-none focus:border-rose-gold"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          className="rounded-full border border-nude/60 bg-cream px-4 py-2 font-sans text-xs text-charcoal outline-none focus:border-rose-gold"
        >
          <option value="all">All dates</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full border border-nude/60 bg-cream px-4 py-2 font-sans text-xs text-charcoal outline-none focus:border-rose-gold"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or phone…"
          className="min-w-[10rem] flex-1 rounded-full border border-nude/60 bg-cream px-4 py-2 font-sans text-xs text-charcoal outline-none focus:border-rose-gold"
        />

        {exactDate && (
          <button
            type="button"
            onClick={() => setExactDate(null)}
            className="rounded-full bg-charcoal/10 px-4 py-2 font-sans text-xs text-charcoal hover:bg-charcoal/20"
          >
            {exactDate} only · Clear
          </button>
        )}
      </div>

      <p className="font-sans text-xs text-charcoal/50">
        {filtered.length} {filtered.length === 1 ? "booking" : "bookings"}
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-nude/60 px-5 py-8 text-center font-sans text-sm text-charcoal/50">
          No bookings match these filters.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((b) => (
            <BookingRow key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}
