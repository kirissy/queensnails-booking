import Image from "next/image";
import Link from "next/link";

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Book",
    links: [
      { label: "Services & Pricing", href: "/services" },
      { label: "Book Now", href: "/book" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Hours & Location", href: "/#hours" },
      { label: "Studio Admin", href: "/admin/login" },
    ],
  },
  {
    title: "Follow",
    links: [
      {
        label: "@queensnailsid",
        href: "https://instagram.com/queensnailsid",
        external: true,
      },
    ],
  },
];

export function SiteFooterExpanded() {
  return (
    <footer className="border-t border-nude/60 px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div>
          <Image
            src="/logo.png"
            alt="queensnails"
            width={1225}
            height={313}
            className="h-8 w-auto"
          />
          <p className="mt-3 max-w-[220px] font-sans text-sm text-charcoal/60">
            A private home nail art studio in Jakarta. By appointment only.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 sm:gap-16">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-charcoal/40">
                {col.title}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-sm text-charcoal/70 hover:text-burgundy"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="font-sans text-sm text-charcoal/70 hover:text-burgundy"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-5xl font-sans text-xs text-charcoal/40">
        © {new Date().getFullYear()} queensnails
      </p>
    </footer>
  );
}
