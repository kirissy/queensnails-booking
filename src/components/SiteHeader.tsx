import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="px-6 py-6 sm:px-10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full bg-burgundy px-5 py-3 sm:px-8 sm:py-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo-white.png"
            alt="queensnails — private nail studio"
            width={1225}
            height={313}
            priority
            className="hidden h-6 w-auto sm:block"
          />
          <Image
            src="/icon-white.png"
            alt="queensnails"
            width={512}
            height={512}
            priority
            className="h-7 w-7 sm:hidden"
          />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/services"
            className="rounded-full px-3 py-2 font-sans text-sm font-semibold text-rose-gold transition-colors hover:text-cream sm:px-6 sm:py-3 sm:text-lg"
          >
            Pricelist
          </Link>
          <Link
            href="/book"
            className="rounded-full bg-cream px-4 py-2 font-sans text-sm font-semibold text-burgundy transition-colors hover:bg-cream-dark sm:px-6 sm:py-3 sm:text-lg"
          >
            Book now
          </Link>
        </nav>
      </div>
    </header>
  );
}
