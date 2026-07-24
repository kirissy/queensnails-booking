import Link from "next/link";
import { NAIL_TREATMENTS, EXTENSIONS } from "@/lib/pricing";

type Props = {
  treatmentId: string | null;
  extensionId: string | null;
  onChange: (patch: { treatmentId?: string | null; extensionId?: string | null }) => void;
  onNext: () => void;
};

export function ServiceStep({ treatmentId, extensionId, onChange, onNext }: Props) {
  const treatment = NAIL_TREATMENTS.find((t) => t.id === treatmentId) ?? null;
  const canProceed = !!treatment && treatment.bookable;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-serif text-xl text-charcoal">
          Choose a Nail Treatment
        </h2>
        <p className="mt-1 font-sans text-sm text-charcoal/60">
          Pick one base service — this just lets us know what to prepare for.
          You can still change your mind with the owner in person. See the{" "}
          <Link href="/services" className="underline hover:text-burgundy">
            full pricelist
          </Link>
          .
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {NAIL_TREATMENTS.map((t) => (
          <button
            key={t.id}
            type="button"
            disabled={!t.bookable}
            onClick={() => onChange({ treatmentId: t.id })}
            className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-colors ${
              !t.bookable
                ? "cursor-not-allowed border-nude/40 bg-cream-dark/50 opacity-60"
                : treatmentId === t.id
                  ? "border-rose-gold bg-blush/40"
                  : "border-nude/60 hover:bg-blush/20"
            }`}
          >
            <div>
              <p className="font-sans text-sm font-medium text-charcoal">
                {t.name}
              </p>
              {t.note && (
                <p className="mt-0.5 font-sans text-xs text-charcoal/60">
                  {t.note}
                </p>
              )}
            </div>
            {!t.bookable && (
              <p className="shrink-0 whitespace-nowrap font-sans text-sm text-rose-gold-dark">
                Message us
              </p>
            )}
          </button>
        ))}
      </div>

      {treatmentId === "other-design" && (
        <p className="rounded-xl bg-blush/40 px-4 py-3 font-sans text-xs text-charcoal/70">
          &ldquo;Other Design&rdquo; needs a quick chat to confirm details —
          message{" "}
          <a
            href="https://instagram.com/queensnailsid"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            @queensnailsid
          </a>{" "}
          on Instagram instead of booking online.
        </p>
      )}

      <div>
        <h3 className="font-serif text-lg text-charcoal">
          Nail Extension{" "}
          <span className="font-sans text-xs font-normal text-charcoal/50">
            (optional add-on)
          </span>
        </h3>
        <div className="mt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onChange({ extensionId: null })}
            className={`rounded-xl border px-4 py-2.5 text-left font-sans text-sm transition-colors ${
              extensionId === null
                ? "border-rose-gold bg-blush/40"
                : "border-nude/60 hover:bg-blush/20"
            }`}
          >
            None
          </button>
          {EXTENSIONS.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => onChange({ extensionId: e.id })}
              className={`rounded-xl border px-4 py-2.5 text-left font-sans text-sm transition-colors ${
                extensionId === e.id
                  ? "border-rose-gold bg-blush/40"
                  : "border-nude/60 hover:bg-blush/20"
              }`}
            >
              <p className="text-charcoal">{e.name}</p>
            </button>
          ))}
        </div>
      </div>

      <p className="font-sans text-xs text-charcoal/50">
        Prices depend on your chosen design and current nails, and are
        confirmed with the owner — see the{" "}
        <Link href="/services" className="underline hover:text-burgundy">
          full pricelist
        </Link>{" "}
        for reference. Only the Rp 50,000 deposit is due now; the rest is
        settled in person.
      </p>

      <button
        type="button"
        disabled={!canProceed}
        onClick={onNext}
        className="rounded-full bg-rose-gold px-8 py-3 font-sans text-sm font-medium tracking-wide text-cream transition-colors hover:bg-rose-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}
