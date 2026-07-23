import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-6 sm:px-10">
      <Link
        href="/"
        className="font-serif text-2xl tracking-wide text-charcoal"
      >
        queensnails
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
