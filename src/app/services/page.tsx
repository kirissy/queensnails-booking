import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PricelistContent } from "@/components/PricelistContent";
import { getPublicPricingData } from "@/lib/services-data";

// Pricing now lives in the database (managed from /admin/services) instead
// of a static file — without this, the page would get statically
// prerendered at build time and freeze pricing until the next deploy (the
// same class of bug documented on /book's dynamic export).
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const pricing = await getPublicPricingData();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-16 sm:px-10">
        <PricelistContent {...pricing} />
      </main>

      <SiteFooter />
    </div>
  );
}
