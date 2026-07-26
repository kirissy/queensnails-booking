import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { BookingRow } from "@/components/admin/BookingRow";

export default async function BookingsPage() {
  if (!isSupabaseConfigured) {
    return (
      <p className="font-sans text-sm text-charcoal/60">
        Supabase isn&apos;t connected yet — nothing to show until real
        bookings start coming in.
      </p>
    );
  }

  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "id, customer_name, customer_phone, customer_email, treatment_name, extension_name, removal_requested, booking_date, booking_time, status, balance_paid, customer_notes"
    )
    .in("status", ["confirmed", "completed", "no_show", "cancelled", "rejected", "expired"])
    .order("booking_date", { ascending: true });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">Bookings</h1>
        <p className="mt-1 font-sans text-sm text-charcoal/60">
          Confirmed and past appointments.
        </p>
      </div>

      {!bookings || bookings.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-nude/60 px-5 py-8 text-center font-sans text-sm text-charcoal/50">
          No bookings yet.
        </p>
      ) : (
        bookings.map((b) => (
          <BookingRow
            key={b.id}
            bookingId={b.id}
            customerName={b.customer_name}
            customerPhone={b.customer_phone}
            customerEmail={b.customer_email}
            service={
              b.extension_name ? `${b.treatment_name} + ${b.extension_name}` : b.treatment_name
            }
            removalRequested={b.removal_requested}
            date={b.booking_date}
            time={b.booking_time}
            status={b.status}
            balancePaid={b.balance_paid}
            notes={b.customer_notes}
          />
        ))
      )}
    </div>
  );
}
