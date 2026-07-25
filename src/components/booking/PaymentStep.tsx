"use client";

import { BANK_TRANSFER } from "@/lib/policy";
import { DEPOSIT_AMOUNT, formatIDR } from "@/lib/pricing";

type Props = {
  submitting: boolean;
  error: string | null;
  onSubmit: () => void;
  onBack: () => void;
};

export function PaymentStep({ submitting, error, onSubmit, onBack }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-serif text-xl text-charcoal">Reserve Your Slot</h2>
        <p className="mt-1 font-sans text-sm text-charcoal/60">
          Reserving holds your slot for 60 minutes. Transfer the deposit and
          send your payment proof on WhatsApp to confirm.
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-blush/40 px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-charcoal/70">
            Deposit amount
          </span>
          <span className="font-serif text-lg text-charcoal">
            {formatIDR(DEPOSIT_AMOUNT)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-charcoal/70">Bank</span>
          <span className="font-sans text-sm font-medium text-charcoal">
            {BANK_TRANSFER.bankName}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-charcoal/70">
            Account number
          </span>
          <span className="font-sans text-sm font-medium text-charcoal">
            {BANK_TRANSFER.accountNumber}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-charcoal/70">
            Account holder
          </span>
          <span className="font-sans text-sm font-medium text-charcoal">
            {BANK_TRANSFER.accountHolder}
          </span>
        </div>
      </div>

      <p className="font-sans text-xs text-charcoal/50">
        After you reserve, we&apos;ll send you a WhatsApp message with these
        details — reply there with a screenshot of your transfer. If we
        don&apos;t receive it within <strong>60 minutes</strong>, your slot
        is released back to other customers.
      </p>

      {error && <p className="font-sans text-sm text-burgundy">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-full border border-nude px-6 py-3 font-sans text-sm text-charcoal transition-colors hover:bg-blush/30 disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={onSubmit}
          className="flex-1 rounded-full bg-rose-gold px-8 py-3 font-sans text-sm font-medium tracking-wide text-cream transition-colors hover:bg-rose-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Reserving…" : "Reserve My Slot"}
        </button>
      </div>
    </div>
  );
}
