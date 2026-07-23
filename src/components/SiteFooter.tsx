function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="flex items-center justify-center gap-2 border-t border-nude/60 px-6 py-8 font-sans text-sm text-charcoal/60">
      <InstagramIcon />
      <a
        href="https://instagram.com/queensnailsid"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-burgundy"
      >
        @queensnailsid
      </a>
    </footer>
  );
}
