import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getAllBookings, computeCustomers } from "@/lib/admin/bookings-data";
import { formatIDR } from "@/lib/pricing";
import { waChatLink } from "@/lib/whatsapp";

export default async function CustomersPage() {
  if (!isSupabaseConfigured) {
    return (
      <p className="font-sans text-sm text-charcoal/60">
        Supabase isn&apos;t connected yet — nothing to show until real
        bookings start coming in.
      </p>
    );
  }

  const bookings = await getAllBookings();
  const customers = computeCustomers(bookings);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">Customers</h1>
        <p className="mt-1 font-sans text-sm text-charcoal/60">
          Every customer who&apos;s booked, grouped by phone number —{" "}
          {customers.length} total.
        </p>
      </div>

      {customers.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-nude/60 px-5 py-8 text-center font-sans text-sm text-charcoal/50">
          No customers yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {customers.map((c) => (
            <div
              key={c.phone}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-nude/60 bg-cream px-5 py-4"
            >
              <div className="flex flex-col gap-1">
                <p className="font-serif text-lg font-semibold text-charcoal">{c.name}</p>
                <p className="font-sans text-sm text-charcoal/70">
                  {c.phone} · {c.email}
                </p>
                <p className="font-sans text-xs text-charcoal/50">
                  Last booking: {c.lastBookingDate}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="font-sans text-sm font-medium text-charcoal">
                  {c.totalBookings} {c.totalBookings === 1 ? "booking" : "bookings"}
                </p>
                <p className="font-sans text-sm font-medium text-price">
                  {formatIDR(c.totalSpent)} spent
                </p>
              </div>
              <div className="flex w-full items-center gap-3 border-t border-nude/40 pt-3 font-sans text-xs">
                <a
                  href={waChatLink(c.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal/60 underline hover:text-burgundy"
                >
                  WhatsApp
                </a>
                <a href={`mailto:${c.email}`} className="text-charcoal/60 underline hover:text-burgundy">
                  Email
                </a>
                <Link
                  href={`/admin/bookings?search=${encodeURIComponent(c.phone)}`}
                  className="text-charcoal/60 underline hover:text-burgundy"
                >
                  View bookings
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
