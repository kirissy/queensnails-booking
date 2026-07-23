"use client";

import { useState } from "react";
import { BANK_TRANSFER } from "@/lib/policy";
import { DEPOSIT_AMOUNT, formatIDR } from "@/lib/pricing";

type Props = {
  proofFile: File | null;
  submitting: boolean;
  error: string | null;
  onSubmit: (proofFile: File) => void;
  onBack: () => void;
};

export function PaymentStep({
  proofFile,
  submitting,
  error,
  onSubmit,
  onBack,
}: Props) {
  const [file, setFile] = useState<File | null>(proofFile);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-serif text-xl text-charcoal">Deposit Payment</h2>
        <p className="mt-1 font-sans text-sm text-charcoal/60">
          Transfer the deposit yourself, then upload your receipt below.
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

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-sm text-charcoal">
          Upload transfer proof
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="font-sans text-sm text-charcoal/70 file:mr-3 file:rounded-full file:border-0 file:bg-blush file:px-4 file:py-2 file:font-sans file:text-sm file:text-charcoal hover:file:bg-blush-dark"
        />
        <span className="font-sans text-xs text-charcoal/50">
          Your slot is held for {""}
          <strong>60 minutes</strong> while awaiting your proof — after that
          it&apos;s released back to other customers.
        </span>
      </label>

      {error && (
        <p className="font-sans text-sm text-burgundy">{error}</p>
      )}

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
          disabled={!file || submitting}
          onClick={() => file && onSubmit(file)}
          className="flex-1 rounded-full bg-rose-gold px-8 py-3 font-sans text-sm font-medium tracking-wide text-cream transition-colors hover:bg-rose-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Submitting…" : "Submit Proof of Payment"}
        </button>
      </div>
    </div>
  );
}
