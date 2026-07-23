import Link from "next/link";
import { format } from "date-fns";
import { NAIL_TREATMENTS, EXTENSIONS, formatIDR } from "@/lib/pricing";
import { STUDIO_ADDRESS } from "@/lib/policy";
import { parseDateKey } from "@/lib/availability";
import type { BookingDraft } from "@/lib/booking-draft";

type Props = {
  draft: BookingDraft;
};

export function ConfirmationStep({ draft }: Props) {
  const treatment = NAIL_TREATMENTS.find((t) => t.id === draft.treatmentId);
  const extension = EXTENSIONS.find((e) => e.id === draft.extensionId);
  const total = (treatment?.priceMin ?? 0) + (extension?.price ?? 0);

  return (
    <div className="flex flex-col gap-6 text-center">
      <div>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-burgundy">
          Pending Verification
        </p>
        <h2 className="mt-2 font-serif text-2xl text-charcoal">
          Your slot is held!
        </h2>
        <p className="mt-2 font-sans text-sm text-charcoal/70">
          We&apos;ve received your proof of payment. The studio will verify
          it and confirm your appointment shortly.
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
            Estimated total
          </span>
          <span className="font-sans text-sm font-medium text-charcoal">
            {formatIDR(total)}
          </span>
        </div>
      </div>

      <p className="font-sans text-xs text-charcoal/50">
        {STUDIO_ADDRESS}
      </p>

      <p className="font-sans text-xs text-charcoal/50">
        Once confirmed, we&apos;ll notify you by email with your appointment
        details and remaining balance due. Need to change something? Contact
        the studio directly on WhatsApp or Instagram — bookings can&apos;t be
        self-cancelled per our policy.
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
