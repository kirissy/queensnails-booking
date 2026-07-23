import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getAvailabilityData } from "@/lib/get-availability-data";

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
