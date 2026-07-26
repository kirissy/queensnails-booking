import Link from "next/link";
import { format } from "date-fns";
import { DEPOSIT_AMOUNT, formatIDR } from "@/lib/pricing";
import { STUDIO_ADDRESS } from "@/lib/policy";
import { parseDateKey } from "@/lib/availability";
import type { BookingDraft } from "@/lib/booking-draft";
import type { PublicPricingData } from "@/lib/services-data";

type Props = {
  draft: BookingDraft;
  pricing: PublicPricingData;
};

export function ConfirmationStep({ draft, pricing }: Props) {
  const treatment = pricing.treatments.find((t) => t.id === draft.treatmentId);
  const extension = pricing.extensions.find((e) => e.id === draft.extensionId);

  return (
    <div className="flex flex-col gap-6 text-center">
      <div>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-burgundy">
          Reserved
        </p>
        <h2 className="mt-2 font-serif text-xl font-semibold text-charcoal">
          Your slot is held for 60 minutes!
        </h2>
        <p className="mt-2 font-sans text-sm text-charcoal/70">
          Check WhatsApp for payment instructions — transfer the deposit and
          reply there with your proof to confirm your booking.
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-blush/40 px-5 py-4 text-left">
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-charcoal/70">Service</span>
          <span className="font-sans text-sm font-medium text-charcoal">
            {treatment?.name}
            {extension ? ` + ${extension.name}` : ""}
          </span>
        </div>
        {draft.date && draft.time && (
          <div className="flex items-center justify-between">
            <span className="font-sans text-sm text-charcoal/70">
              Date &amp; time
            </span>
            <span className="font-sans text-sm font-medium text-charcoal">
              {format(parseDateKey(draft.date), "EEEE, MMMM d")} · {draft.time}{" "}
              WIB
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-charcoal/70">
            Deposit due
          </span>
          <span className="font-sans text-sm font-medium text-charcoal">
            {formatIDR(DEPOSIT_AMOUNT)}
          </span>
        </div>
        {draft.removalRequested && (
          <div className="flex items-center justify-between">
            <span className="font-sans text-sm text-charcoal/70">Removal</span>
            <span className="font-sans text-sm font-medium text-charcoal">
              Requested
            </span>
          </div>
        )}
      </div>

      <p className="font-sans text-xs text-charcoal/50">
        {STUDIO_ADDRESS}
      </p>

      <p className="font-sans text-xs text-charcoal/50">
        The service above is just a note for us to prepare — final design and
        price are confirmed with the owner in person, and the remaining
        balance is paid then. Didn&apos;t get the WhatsApp message? Contact
        the studio directly on WhatsApp or Instagram.
      </p>

      <Link
        href="/"
        className="font-sans text-sm text-charcoal/60 underline hover:text-burgundy"
      >
        Back to home
      </Link>
    </div>
  );
}
