import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PricelistContent } from "@/components/PricelistContent";

export default function ServicesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-16 sm:px-10">
        <PricelistContent />
      </main>

      <SiteFooter />
    </div>
  );
}
