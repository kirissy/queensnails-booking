import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getAvailabilityData } from "@/lib/get-availability-data";

// Availability changes constantly (bookings, holds expiring, owner slot
// toggles) and this page reads none of the signals (cookies/headers/params)
// that would otherwise make Next.js render it dynamically — without this,
// it gets statically prerendered at build time and every visitor sees the
// same frozen snapshot of availability from whenever the site was last built.
export const dynamic = "force-dynamic";

export default async function BookPage() {
  const availability = await getAvailabilityData();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-16 sm:px-10">
        <BookingWizard availability={availability} />
      </main>

      <SiteFooter />
    </div>
  );
}
