export function SiteFooter() {
  return (
    <footer className="flex items-center justify-between bg-burgundy px-6 py-4 sm:px-10">
      <p className="font-sans text-sm text-cream">
        © {new Date().getFullYear()} queensnails. All rights reserved.
      </p>
      <a
        href="https://instagram.com/queensnailsid"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center rounded-full p-3 transition-colors hover:bg-cream/10"
        aria-label="queensnails on Instagram"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon-instagram.svg" alt="" className="h-5 w-5" />
      </a>
    </footer>
  );
}
