import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        <section className="mx-6 flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-blush via-nude to-blush-dark px-6 py-24 text-center shadow-sm sm:mx-10 sm:py-32">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-burgundy">
            Private Home Nail Art Studio
          </p>
          <h1 className="max-w-2xl font-serif text-4xl font-medium leading-tight text-charcoal sm:text-6xl">
            Nail art, made unhurried.
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
        </section>

        <section className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-8 px-6 py-16 sm:grid-cols-2 sm:px-10">
          <div className="flex items-start gap-4">
            <Clock className="mt-1 h-5 w-5 shrink-0 text-rose-gold" />
            <div>
              <h2 className="font-serif text-lg text-charcoal">Hours</h2>
              <p className="font-sans text-sm text-charcoal/70">
                By appointment only. Closed Sundays.
                <br />
                Two daily slots: 11:00 &amp; 18:00 WIB.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-rose-gold" />
            <div>
              <h2 className="font-serif text-lg text-charcoal">Studio</h2>
              <p className="font-sans text-sm text-charcoal/70">
                Apartemen Citralake Suites, Jl. Citra Garden City 6 Boulevard
                No.5, Kalideres, Jakarta Barat
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
