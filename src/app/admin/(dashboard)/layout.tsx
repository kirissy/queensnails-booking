import Link from "next/link";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col bg-cream">
      <header className="flex items-center justify-between border-b border-nude/60 px-6 py-4 sm:px-8">
        <span className="font-serif text-xl text-charcoal">
          queensnails <span className="text-charcoal/40">admin</span>
        </span>
        <SignOutButton />
      </header>

      <nav className="flex gap-1 overflow-x-auto border-b border-nude/60 px-4 sm:px-8">
        {[
          { href: "/admin", label: "Verification Queue" },
          { href: "/admin/bookings", label: "Bookings" },
          { href: "/admin/slots", label: "Slots" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap px-4 py-3 font-sans text-sm text-charcoal/70 hover:text-charcoal"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="flex-1 px-4 py-6 sm:px-8">{children}</main>
    </div>
  );
}
