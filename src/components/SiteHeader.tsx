import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="px-8 py-6">
      <div className="flex max-h-[78px] w-full items-center gap-6 rounded-full bg-maroon px-5 py-[15px] sm:gap-12 sm:px-8">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo-white.png"
            alt="queensnails — private nail studio"
            width={1225}
            height={313}
            priority
            className="hidden h-8 w-auto sm:block"
          />
          <Image
            src="/icon-white.png"
            alt="queensnails"
            width={512}
            height={512}
            priority
            className="h-8 w-8 sm:hidden"
          />
        </Link>
        <nav className="flex flex-1 items-center justify-end gap-1 sm:gap-4">
          <Link
            href="/services"
            className="flex h-12 items-center justify-center rounded-full px-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-cream/10 sm:px-6 sm:text-lg"
          >
            Pricelist
          </Link>
          <Link
            href="/faq"
            className="hidden h-12 items-center justify-center rounded-full px-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-cream/10 sm:flex sm:px-6 sm:text-lg"
          >
            FAQ
          </Link>
          <Link
            href="/book"
            className="flex h-12 items-center justify-center rounded-full bg-cream px-4 font-sans text-sm font-semibold text-maroon transition-colors hover:bg-cream-dark sm:px-6 sm:text-lg"
          >
            Book now
          </Link>
        </nav>
      </div>
    </header>
  );
}
