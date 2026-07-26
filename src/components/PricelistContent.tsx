"use client";

import { useState } from "react";
import Link from "next/link";
import { INCLUDED_ITEMS, formatIDR } from "@/lib/pricing";
import type { PublicPricingData } from "@/lib/services-data";

function priceLabel(min: number, max?: number | null) {
  if (min === 0) return "Ask / consult in advance";
  if (max) return `${formatIDR(min)} – ${formatIDR(max)}`;
  return formatIDR(min);
}

type PriceRow = { label: string; note?: string; price: string };

function PriceTable({ items }: { items: PriceRow[] }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-blush">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`flex items-center gap-6 p-5 sm:gap-12 sm:p-6 ${
            i % 2 === 1 ? "bg-blush" : ""
          }`}
        >
          <div className="flex-1">
            <p className="font-sans text-sm font-semibold text-charcoal sm:text-base">
              {item.label}
            </p>
            {item.note && (
              <p className="mt-1 font-sans text-xs text-charcoal/70 sm:text-sm">
                {item.note}
              </p>
            )}
          </div>
          <p className="shrink-0 whitespace-nowrap text-right font-sans text-sm font-bold text-price sm:text-base">
            {item.price}
          </p>
        </div>
      ))}
    </div>
  );
}

export function PricelistContent({ treatments, extensions, removalFees }: PublicPricingData) {
  const [tab, setTab] = useState<"nail-art" | "course">("nail-art");

  return (
    <div className="flex w-full flex-col gap-16 sm:gap-24 lg:gap-32">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="font-sans text-3xl font-semibold text-charcoal sm:text-4xl lg:text-5xl">
          Services &amp; Pricing
        </h1>
        <p className="max-w-2xl font-sans text-base text-charcoal/70 sm:text-lg">
          Prices listed are starting rates (minimum charges) and are subject to change. Final pricing is determined on the day of the appointment based on the agreed design and any additional details discussed between the customer and the nail artist.
        </p>
      </div>

      <div className="flex flex-col gap-10 sm:gap-16">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setTab("nail-art")}
            className={`rounded-full px-6 py-3 font-sans text-base font-medium transition-colors sm:text-lg ${
              tab === "nail-art"
                ? "bg-burgundy text-cream"
                : "border-2 border-burgundy text-burgundy hover:bg-blush/40"
            }`}
          >
            Nail art
          </button>
          <button
            type="button"
            onClick={() => setTab("course")}
            className={`rounded-full px-6 py-3 font-sans text-base font-medium transition-colors sm:text-lg ${
              tab === "course"
                ? "bg-burgundy text-cream"
                : "border-2 border-burgundy text-burgundy hover:bg-blush/40"
            }`}
          >
            Course
          </button>
        </div>

        {tab === "course" ? (
          <section className="flex flex-col gap-3">
              <h2 className="font-sans text-2xl font-semibold text-charcoal sm:text-3xl">
                Nail Art Classes Available Upon Request
              </h2>
              <p className="font-sans text-base text-charcoal/70 sm:text-lg">
              Interested in learning nail art? Our private nail art classes are available upon request.
              {" "}
              <a
                href="https://wa.me/message/VWIVVYAWNNR7N1"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-burgundy"
              >
                Message us
              </a>{" "}
              to enquire about course details, availability, and pricing.
            </p>
            </section>
        
        ) : (
          <>
            <section className="flex flex-col gap-8">
              <h2 className="font-sans text-xl font-semibold text-charcoal sm:text-2xl">
                Included in Every Treatment
              </h2>
              <PriceTable
                items={INCLUDED_ITEMS.map((item) => ({
                  label: item,
                  price: "FREE",
                }))}
              />
            </section>

            <section className="flex flex-col gap-8">
              <h2 className="font-sans text-xl font-semibold text-charcoal sm:text-2xl">
                Nail Treatment
              </h2>
              <PriceTable
                items={treatments.map((t) => ({
                  label: t.name,
                  note: t.note ?? undefined,
                  price: priceLabel(t.price_min, t.price_max),
                }))}
              />
            </section>

            <section className="flex flex-col gap-8">
              <div>
                <h2 className="font-sans text-xl font-semibold text-charcoal sm:text-2xl">
                  Nail Extension
                </h2>
                <p className="mt-2 font-sans text-base text-charcoal/70 sm:text-lg">
                  Optional add-on on top of a Nail Treatment.
                </p>
              </div>
              <PriceTable
                items={extensions.map((e) => ({
                  label: e.name,
                  price: `+${formatIDR(e.price)}${e.unit === "per-nail" ? " / nail" : ""}`,
                }))}
              />
            </section>

            <section className="flex flex-col gap-8">
              <div>
                <h2 className="font-sans text-xl font-semibold text-charcoal sm:text-2xl">
                  Removal
                </h2>
                <p className="mt-2 font-sans text-base text-charcoal/70 sm:text-lg">
                  Not included by default. Depends on your current nails, so
                  these may apply and are confirmed with the owner — settled
                  with your remaining balance in person.
                </p>
              </div>
              <PriceTable
                items={removalFees.map((r) => ({
                  label: r.label,
                  price: `+${formatIDR(r.price)}`,
                }))}
              />
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="font-sans text-2xl font-semibold text-charcoal sm:text-3xl">
                Want something custom?
              </h2>
              <p className="font-sans text-base text-charcoal/70 sm:text-lg">
                Contact us for custom premium press-on nail orders or detailed “Other Design” art on all 10 nails to confirm details and price before booking.
              </p>
              <a
                href="https://wa.me/message/VWIVVYAWNNR7N1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit font-sans text-base text-charcoal underline hover:text-burgundy sm:text-lg"
              >
                Send us a message.
              </a>
            </section>

            <section className="flex flex-col items-center gap-6 rounded-2xl bg-maroon px-6 py-10 text-center sm:px-10 sm:py-12">
              <div className="flex flex-col items-center gap-3">
                <h2 className="font-sans text-2xl font-semibold text-cream sm:text-3xl">
                  Ready to book your appointment?
                </h2>
                <p className="max-w-md font-sans text-base text-cream/80 sm:text-lg">
                  Limited appointments are available each day. Check our
                  availability and book your slot before it&apos;s gone.
                </p>
              </div>
              <Link
                href="/book"
                className="rounded-full bg-cream px-10 flex h-12 items-center font-sans text-lg font-medium text-maroon transition-colors hover:bg-cream-dark"
              >
                Book now
              </Link>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
