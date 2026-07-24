import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PricelistContent } from "@/components/PricelistContent";

export default function ServicesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-16 px-6 py-16 sm:px-10">
        <PricelistContent />

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
