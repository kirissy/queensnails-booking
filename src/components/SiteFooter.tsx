function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="white" className="h-5 w-5" aria-hidden="true">
      <path d="M10 0.5C4.75 0.5 0.5 4.75 0.5 10c0 1.77 0.49 3.43 1.33 4.85L0.5 19.5l4.79-1.31C6.65 19.01 8.27 19.5 10 19.5c5.25 0 9.5-4.25 9.5-9.5S15.25 0.5 10 0.5Zm0 17.27c-1.55 0-2.99-0.45-4.21-1.22l-0.3-0.18-3.13 0.86 0.84-3.06-0.2-0.31C2.2 12.65 1.73 11.36 1.73 10c0-4.56 3.71-8.27 8.27-8.27s8.27 3.71 8.27 8.27-3.71 8.27-8.27 8.27Zm4.53-6.2c-0.25-0.12-1.46-0.72-1.69-0.8-0.23-0.08-0.39-0.12-0.56 0.12-0.16 0.25-0.64 0.8-0.79 0.96-0.14 0.16-0.29 0.18-0.54 0.06-0.25-0.12-1.04-0.38-1.98-1.22-0.73-0.65-1.23-1.46-1.37-1.71-0.14-0.25-0.02-0.38 0.11-0.51 0.11-0.11 0.25-0.29 0.37-0.43 0.12-0.14 0.16-0.25 0.25-0.41 0.08-0.16 0.04-0.31-0.02-0.43-0.06-0.12-0.56-1.35-0.77-1.85-0.2-0.48-0.41-0.42-0.56-0.42-0.14 0-0.31-0.02-0.47-0.02s-0.43 0.06-0.66 0.31c-0.23 0.25-0.87 0.85-0.87 2.08s0.89 2.41 1.01 2.58c0.12 0.16 1.75 2.67 4.24 3.74 0.59 0.26 1.05 0.41 1.41 0.52 0.59 0.19 1.13 0.16 1.55 0.1 0.47-0.07 1.46-0.6 1.67-1.18 0.21-0.58 0.21-1.08 0.14-1.18-0.06-0.1-0.23-0.16-0.48-0.28Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="flex items-center justify-between bg-burgundy px-6 py-4 sm:px-10">
      <p className="font-sans text-sm text-cream">
        © {new Date().getFullYear()} queensnails. All rights reserved.
      </p>
      <div className="flex items-center">
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
        <a
          href="https://www.tiktok.com/@queensnailsid"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full p-3 transition-colors hover:bg-cream/10"
          aria-label="queensnails on TikTok"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-tiktok.svg" alt="" className="h-5 w-5" />
        </a>
        <a
          href="https://wa.me/message/VWIVVYAWNNR7N1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full p-3 transition-colors hover:bg-cream/10"
          aria-label="Message queensnails on WhatsApp"
        >
          <WhatsAppIcon />
        </a>
      </div>
    </footer>
  );
}
