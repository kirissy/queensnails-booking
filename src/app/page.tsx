import Link from "next/link";
import { Clock, MapPin, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooterExpanded } from "@/components/SiteFooterExpanded";
import { GradientPanel } from "@/components/GradientPanel";
import { NAIL_TREATMENTS, formatIDR } from "@/lib/pricing";
import { STUDIO_ADDRESS } from "@/lib/policy";

const EYEBROW = "font-sans text-xs uppercase tracking-[0.3em] text-burgundy";

const PREVIEW_TREATMENTS = NAIL_TREATMENTS.filter((t) => t.bookable).slice(0, 4);
const PREVIEW_VARIANTS = ["blush", "gold", "clay", "cream"] as const;

const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(STUDIO_ADDRESS)}&output=embed`;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative mx-6 sm:mx-10">
          <div className="relative overflow-visible rounded-3xl">
            <GradientPanel variant="blush" className="absolute inset-0 rounded-3xl" />
            <div className="relative flex flex-col items-center gap-6 px-6 py-24 text-center sm:py-32">
              <p className={EYEBROW}>Private Home Nail Art Studio</p>
              <h1 className="max-w-2xl font-serif text-5xl font-medium leading-tight text-charcoal sm:text-7xl">
                Nail art,
                <br />
                <span className="text-rose-gold-dark">made unhurried.</span>
              </h1>
              <p className="max-w-md font-sans text-base text-charcoal/70">
                Book your appointment online in a few simple steps — no more
                waiting on a WhatsApp reply.
              </p>
              <Link
                href="/book"
                className="mt-2 rounded-full bg-charcoal px-8 py-3 font-sans text-sm font-medium tracking-wide text-cream transition-colors hover:bg-burgundy"
              >
                Book Your Appointment
              </Link>
            </div>

            <div className="absolute -top-5 right-4 flex items-center gap-2 rounded-2xl bg-cream px-4 py-3 shadow-md sm:-top-6 sm:right-8 sm:px-5 sm:py-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/40">
                <Sparkles className="h-4 w-4 text-rose-gold-dark" />
              </span>
              <div className="text-left">
                <p className="font-sans text-[10px] uppercase tracking-widest text-charcoal/50">
                  Est. Jakarta
                </p>
                <p className="font-serif text-sm text-charcoal">
                  By Appointment Only
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services preview */}
        <section className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-10 sm:py-28">
          <div className="mb-10 text-center">
            <p className={EYEBROW}>The Menu</p>
            <h2 className="mt-2 font-serif text-3xl text-charcoal">
              Popular Treatments
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {PREVIEW_TREATMENTS.map((t, i) => (
              <Link key={t.id} href="/services" className="group flex flex-col gap-3">
                <GradientPanel
                  variant={PREVIEW_VARIANTS[i % PREVIEW_VARIANTS.length]}
                  className="aspect-square rounded-2xl transition-transform group-hover:scale-[1.02]"
                />
                <div>
                  <p className="font-serif text-sm text-charcoal">{t.name}</p>
                  <p className="font-sans text-xs text-charcoal/50">
                    From {formatIDR(t.priceMin)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Philosophy band */}
        <section className="bg-clay px-6 py-20 text-center sm:py-28">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-cream/70">
            Our Approach
          </p>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-2xl leading-relaxed text-cream sm:text-3xl">
            Nail art is self-care, not a rush job. Every appointment is
            private, unhurried, and made to feel like an occasion.
          </p>
          <Link
            href="/book"
            className="mt-8 inline-block rounded-full bg-cream px-8 py-3 font-sans text-sm font-medium text-charcoal transition-colors hover:bg-cream-dark"
          >
            Book Your Appointment
          </Link>
        </section>

        {/* Brand focus */}
        <section className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 px-6 py-20 sm:grid-cols-2 sm:px-10 sm:py-28">
          <GradientPanel
            variant="gold"
            className="order-2 aspect-[4/5] rounded-3xl sm:order-1"
          />
          <div className="order-1 sm:order-2">
            <p className={EYEBROW}>Our Story</p>
            <h2 className="mt-3 font-serif text-5xl text-charcoal sm:text-6xl">
              queensnails
            </h2>
            <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-charcoal/70">
              What started as a passion for detailed nail art grew into a
              private studio built around one idea: booking a slot
              shouldn&apos;t feel like a hassle. No queues, no rush — just one
              client at a time, by appointment.
            </p>
          </div>
        </section>

        {/* Hours & location */}
        <section
          id="hours"
          className="mx-auto grid w-full max-w-5xl scroll-mt-8 grid-cols-1 gap-10 px-6 py-20 sm:grid-cols-2 sm:px-10 sm:py-28"
        >
          <div>
            <p className={EYEBROW}>Visit Us</p>
            <h2 className="mt-3 font-serif text-3xl text-charcoal">
              Hours &amp; Location
            </h2>
            <div className="mt-6 flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-rose-gold" />
                <p className="font-sans text-sm text-charcoal/70">
                  By appointment only. Closed Sundays.
                  <br />
                  Two daily slots: 11:00 &amp; 18:00 WIB.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-rose-gold" />
                <p className="font-sans text-sm text-charcoal/70">
                  {STUDIO_ADDRESS}
                </p>
              </div>
            </div>
          </div>
          <div className="min-h-[280px] overflow-hidden rounded-3xl">
            <iframe
              src={MAP_EMBED_URL}
              className="h-full min-h-[280px] w-full border-0"
              loading="lazy"
              title="Queensnails studio location"
            />
          </div>
        </section>

        {/* Follow */}
        <section className="mx-auto w-full max-w-5xl px-6 py-20 text-center sm:px-10 sm:py-28">
          <p className={EYEBROW}>Follow Along</p>
          <h2 className="mt-2 font-serif text-3xl text-charcoal">
            @queensnailsid
          </h2>
          <div className="mt-10 grid grid-cols-3 gap-4">
            <GradientPanel variant="blush" className="aspect-square rounded-2xl" />
            <GradientPanel variant="gold" className="aspect-square rounded-2xl" />
            <GradientPanel variant="clay" className="aspect-square rounded-2xl" />
          </div>
          <a
            href="https://instagram.com/queensnailsid"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full border border-nude px-8 py-3 font-sans text-sm font-medium text-charcoal transition-colors hover:bg-blush/30"
          >
            View on Instagram
          </a>
        </section>
      </main>

      <SiteFooterExpanded />
    </div>
  );
}
