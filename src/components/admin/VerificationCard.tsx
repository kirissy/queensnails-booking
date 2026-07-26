"use client";

import { useState, useTransition } from "react";
import { formatIDR } from "@/lib/pricing";
import { waChatLink } from "@/lib/whatsapp";
import { confirmBooking, rejectBooking } from "@/app/admin/actions";

type Props = {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  service: string;
  removalRequested: boolean;
  date: string;
  time: string;
  depositAmount: number;
  submittedAt: string;
};

export function VerificationCard({
  bookingId,
  customerName,
  customerPhone,
  service,
  removalRequested,
  date,
  time,
  depositAmount,
  submittedAt,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      try {
        await confirmBooking(bookingId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't confirm.");
      }
    });
  }

  function handleReject() {
    setError(null);
    startTransition(async () => {
      try {
        await rejectBooking(bookingId, reason);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't reject.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-nude/60 bg-cream p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-serif text-lg font-semibold text-charcoal">{customerName}</h3>
        <p className="font-sans text-xs text-charcoal/50">
          Reserved {new Date(submittedAt).toLocaleString()}
        </p>
      </div>
      <p className="font-sans text-sm text-charcoal/70">{service}</p>
      <p className="font-sans text-sm text-charcoal/70">
        {date} · {time} WIB
      </p>
      {removalRequested && (
        <span className="w-fit rounded-full bg-burgundy/10 px-2.5 py-1 font-sans text-xs font-medium text-burgundy">
          Removal requested
        </span>
      )}
      <p className="font-sans text-sm font-medium text-rose-gold-dark">
        Deposit: {formatIDR(depositAmount)}
      </p>

      <a
        href={waChatLink(customerPhone)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 flex w-fit items-center gap-2 rounded-full border border-burgundy/40 px-4 py-2 font-sans text-xs font-medium text-burgundy transition-colors hover:bg-burgundy/10"
      >
        Check payment proof on WhatsApp
      </a>

      {error && <p className="font-sans text-xs text-burgundy">{error}</p>}

      {showReject ? (
        <div className="mt-2 flex flex-col gap-2">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (e.g. unclear screenshot, wrong amount)"
            className="rounded-lg border border-nude/60 bg-cream-dark/30 px-3 py-2 font-sans text-sm text-charcoal outline-none focus:border-rose-gold"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowReject(false)}
              className="rounded-full border border-nude px-4 py-2 font-sans text-xs text-charcoal"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isPending || !reason.trim()}
              onClick={handleReject}
              className="flex-1 rounded-full bg-burgundy px-4 py-2 font-sans text-xs font-medium text-cream disabled:opacity-50"
            >
              Confirm Reject
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setShowReject(true)}
            className="rounded-full border border-burgundy/40 px-4 py-2 font-sans text-xs font-medium text-burgundy disabled:opacity-50"
          >
            Reject
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleConfirm}
            className="flex-1 rounded-full bg-rose-gold px-4 py-2 font-sans text-xs font-medium text-cream hover:bg-rose-gold-dark disabled:opacity-50"
          >
            {isPending ? "Working…" : "Confirm"}
          </button>
        </div>
      )}
    </div>
  );
}
