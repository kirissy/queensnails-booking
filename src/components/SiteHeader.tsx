import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-6 sm:px-10">
      <Link href="/" className="shrink-0">
        <Image
          src="/logo.png"
          alt="queensnails — private nail studio"
          width={1225}
          height={313}
          priority
          className="hidden h-9 w-auto sm:block"
        />
        <Image
          src="/icon.png"
          alt="queensnails"
          width={512}
          height={512}
          priority
          className="h-9 w-9 sm:hidden"
        />
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          href="/services"
          className="font-sans text-sm text-charcoal/70 hover:text-burgundy"
        >
          <span className="hidden sm:inline">Services &amp; Pricing</span>
          <span className="sm:hidden">Pricing</span>
        </Link>
        <Link
          href="/book"
          className="rounded-full bg-rose-gold px-5 py-2 font-sans text-sm font-medium tracking-wide text-cream transition-colors hover:bg-rose-gold-dark"
        >
          Book Now
        </Link>
      </nav>
    </header>
  );
}
