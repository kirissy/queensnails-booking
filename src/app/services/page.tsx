import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  NAIL_TREATMENTS,
  EXTENSIONS,
  REMOVAL_FEES,
  INCLUDED_ITEMS,
  formatIDR,
} from "@/lib/pricing";

function priceLabel(min: number, max?: number) {
  if (min === 0) return "Ask / consult in advance";
  if (max) return `${formatIDR(min)} – ${formatIDR(max)}`;
  return formatIDR(min);
}

export default function ServicesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-16 px-6 py-16 sm:px-10">
        <div className="text-center">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-burgundy">
            June 2026 Pricelist
          </p>
          <h1 className="mt-2 font-serif text-4xl text-charcoal">
            Services &amp; Pricing
          </h1>
          <p className="mt-3 font-sans text-sm text-charcoal/70">
            Prices are fixed and shown as-is. Choose one Nail Treatment as
            your base service, with an optional Extension add-on.
          </p>
        </div>

        <section>
          <h2 className="font-serif text-2xl text-charcoal">
            Nail Treatment
          </h2>
          <p className="mt-1 font-sans text-sm text-charcoal/60">
            Pick one base service.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-nude/60">
            {NAIL_TREATMENTS.map((t, i) => (
              <div
                key={t.id}
                className={`flex items-start justify-between gap-4 px-5 py-4 ${
                  i % 2 === 0 ? "bg-cream" : "bg-cream-dark"
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
                <p className="shrink-0 whitespace-nowrap font-sans text-sm text-rose-gold-dark">
                  {priceLabel(t.priceMin, t.priceMax)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal">
            Nail Extension
          </h2>
          <p className="mt-1 font-sans text-sm text-charcoal/60">
            Optional add-on on top of a Nail Treatment.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-nude/60">
            {EXTENSIONS.map((e, i) => (
              <div
                key={e.id}
                className={`flex items-center justify-between gap-4 px-5 py-4 ${
                  i % 2 === 0 ? "bg-cream" : "bg-cream-dark"
                }`}
              >
                <p className="font-sans text-sm font-medium text-charcoal">
                  {e.name}
                </p>
                <p className="shrink-0 whitespace-nowrap font-sans text-sm text-rose-gold-dark">
                  +{formatIDR(e.price)}
                  {e.unit === "per-nail" ? " / nail" : ""}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal">
            Included in Every Treatment
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 font-sans text-sm text-charcoal/70 sm:grid-cols-2">
            {INCLUDED_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-gold" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal">Removal</h2>
          <p className="mt-1 font-sans text-sm text-charcoal/60">
            Not included by default. Depends on your current nails, so these
            may apply and are confirmed with the owner — settled with your
            remaining balance in person.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-nude/60">
            {REMOVAL_FEES.map((r, i) => (
              <div
                key={r.id}
                className={`flex items-center justify-between gap-4 px-5 py-4 ${
                  i % 2 === 0 ? "bg-cream" : "bg-cream-dark"
                }`}
              >
                <p className="font-sans text-sm text-charcoal">{r.label}</p>
                <p className="shrink-0 whitespace-nowrap font-sans text-sm text-rose-gold-dark">
                  +{formatIDR(r.price)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-blush/50 px-6 py-8 text-center">
          <h2 className="font-serif text-xl text-charcoal">
            Want something custom?
          </h2>
          <p className="mx-auto mt-2 max-w-md font-sans text-sm text-charcoal/70">
            Classes and custom premium press-on nail orders, or detailed
            &ldquo;Other Design&rdquo; art on all 10 nails, are handled
            directly — message us on Instagram to confirm details and price
            before booking.
          </p>
          <a
            href="https://instagram.com/queensnailsid"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-full bg-charcoal px-6 py-2.5 font-sans text-sm font-medium text-cream transition-colors hover:bg-burgundy"
          >
            DM @queensnailsid
          </a>
        </section>

        <div className="text-center">
          <Link
            href="/book"
            className="inline-block rounded-full bg-rose-gold px-8 py-3 font-sans text-sm font-medium tracking-wide text-cream transition-colors hover:bg-rose-gold-dark"
          >
            Book Your Appointment
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
