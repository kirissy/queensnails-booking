"use client";

import { useState, useTransition } from "react";
import { waChatLink } from "@/lib/whatsapp";
import { SLOT_TIMES, type SlotTime } from "@/lib/availability";
import {
  cancelBooking,
  markBalancePaid,
  markNoShow,
  rescheduleBooking,
} from "@/app/admin/actions";
import type { BookingStatus } from "@/lib/supabase/types";

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending_verification: "Pending Verification",
  confirmed: "Confirmed",
  rejected: "Rejected",
  expired: "Expired",
  completed: "Completed",
  no_show: "No-show",
  cancelled: "Cancelled",
};

type Props = {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  service: string;
  removalRequested: boolean;
  date: string;
  time: SlotTime;
  status: BookingStatus;
  balancePaid: boolean;
  notes: string;
};

export function BookingRow({
  bookingId,
  customerName,
  customerPhone,
  customerEmail,
  service,
  removalRequested,
  date,
  time,
  status,
  balancePaid,
  notes,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"idle" | "balance" | "reschedule">("idle");
  const [surcharge, setSurcharge] = useState("");
  const [newDate, setNewDate] = useState(date);
  const [newTime, setNewTime] = useState<SlotTime>(time);
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await action();
        setMode("idle");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  const isActionable = status === "confirmed";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-nude/60 bg-cream px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-serif text-lg font-semibold text-charcoal">{customerName}</h3>
        <span className="rounded-full bg-blush/50 px-3 py-1 font-sans text-xs text-charcoal/70">
          {STATUS_LABEL[status]}
        </span>
      </div>
      <p className="font-sans text-sm text-charcoal/70">{service}</p>
      <p className="font-sans text-sm text-charcoal/70">
        {date} · {time} WIB
        {balancePaid && <span className="ml-2 text-rose-gold-dark">Balance paid</span>}
      </p>
      {removalRequested && (
        <span className="w-fit rounded-full bg-burgundy/10 px-2.5 py-1 font-sans text-xs font-medium text-burgundy">
          Removal requested
        </span>
      )}
      {notes && <p className="font-sans text-xs text-charcoal/50">Notes: {notes}</p>}
      <div className="flex flex-wrap gap-3 font-sans text-xs text-charcoal/60">
        <a href={waChatLink(customerPhone)} target="_blank" rel="noopener noreferrer" className="underline hover:text-burgundy">
          WhatsApp
        </a>
        <a href={`mailto:${customerEmail}`} className="underline hover:text-burgundy">
          Email
        </a>
      </div>

      {error && <p className="font-sans text-xs text-burgundy">{error}</p>}

      {isActionable && mode === "idle" && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("balance")}
            className="rounded-full bg-rose-gold px-4 py-1.5 font-sans text-xs font-medium text-cream hover:bg-rose-gold-dark"
          >
            Mark Balance Paid
          </button>
          <button
            type="button"
            onClick={() => setMode("reschedule")}
            className="rounded-full border border-nude px-4 py-1.5 font-sans text-xs text-charcoal"
          >
            Reschedule
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => run(() => markNoShow(bookingId))}
            className="rounded-full border border-charcoal/20 px-4 py-1.5 font-sans text-xs text-charcoal/70"
          >
            No-show
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => run(() => cancelBooking(bookingId))}
            className="rounded-full border border-burgundy/40 px-4 py-1.5 font-sans text-xs text-burgundy"
          >
            Cancel
          </button>
        </div>
      )}

      {mode === "balance" && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            value={surcharge}
            onChange={(e) => setSurcharge(e.target.value)}
            placeholder="Removal surcharge (optional, IDR)"
            className="w-56 rounded-lg border border-nude/60 bg-cream-dark/30 px-3 py-1.5 font-sans text-xs text-charcoal outline-none focus:border-rose-gold"
          />
          <button
            type="button"
            onClick={() => setMode("idle")}
            className="rounded-full border border-nude px-3 py-1.5 font-sans text-xs text-charcoal"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              run(() =>
                markBalancePaid(bookingId, surcharge ? Number(surcharge) : undefined)
              )
            }
            className="rounded-full bg-rose-gold px-4 py-1.5 font-sans text-xs font-medium text-cream"
          >
            Confirm Paid
          </button>
        </div>
      )}

      {mode === "reschedule" && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="rounded-lg border border-nude/60 bg-cream-dark/30 px-3 py-1.5 font-sans text-xs text-charcoal outline-none focus:border-rose-gold"
          />
          <select
            value={newTime}
            onChange={(e) => setNewTime(e.target.value as SlotTime)}
            className="rounded-lg border border-nude/60 bg-cream-dark/30 px-3 py-1.5 font-sans text-xs text-charcoal outline-none focus:border-rose-gold"
          >
            {SLOT_TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setMode("idle")}
            className="rounded-full border border-nude px-3 py-1.5 font-sans text-xs text-charcoal"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => run(() => rescheduleBooking(bookingId, newDate, newTime))}
            className="rounded-full bg-rose-gold px-4 py-1.5 font-sans text-xs font-medium text-cream"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
