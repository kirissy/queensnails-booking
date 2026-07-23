"use client";

import { useState } from "react";
import { POLICY_PARAGRAPHS } from "@/lib/policy";

type Props = {
  accepted: boolean;
  onSubmit: (accepted: boolean) => void;
  onBack: () => void;
};

export function PolicyStep({ accepted, onSubmit, onBack }: Props) {
  const [checked, setChecked] = useState(accepted);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-serif text-xl text-charcoal">
          Booking Policy
        </h2>
        <p className="mt-1 font-sans text-sm text-charcoal/60">
          Please read carefully before continuing to payment.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-nude/60 bg-cream-dark/40 px-5 py-4">
        {POLICY_PARAGRAPHS.map((p) => (
          <p key={p} className="font-sans text-sm leading-relaxed text-charcoal/80">
            {p}
          </p>
        ))}
      </div>

      <label className="flex items-start gap-3 font-sans text-sm text-charcoal">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-rose-gold"
        />
        I have read and agree to the deposit and cancellation policy.
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-nude px-6 py-3 font-sans text-sm text-charcoal transition-colors hover:bg-blush/30"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!checked}
          onClick={() => onSubmit(checked)}
          className="flex-1 rounded-full bg-rose-gold px-8 py-3 font-sans text-sm font-medium tracking-wide text-cream transition-colors hover:bg-rose-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
