import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getAllBookings, bookingService } from "@/lib/admin/bookings-data";
import { BookingsBoard } from "@/components/admin/BookingsBoard";
import type { BookingRowData } from "@/components/admin/BookingRow";
import type { BookingStatus } from "@/lib/supabase/types";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string; search?: string }>;
}) {
  const { status, date, search } = await searchParams;

  if (!isSupabaseConfigured) {
    return (
      <p className="font-sans text-sm text-charcoal/60">
        Supabase isn&apos;t connected yet — nothing to show until real
        bookings start coming in.
      </p>
    );
  }

  const bookings = await getAllBookings();

  const rows: BookingRowData[] = bookings.map((b) => ({
    id: b.id,
    createdAt: b.created_at,
    customerName: b.customer_name,
    customerPhone: b.customer_phone,
    customerEmail: b.customer_email,
    service: bookingService(b),
    removalRequested: b.removal_requested,
    date: b.booking_date,
    time: b.booking_time,
    status: b.status,
    depositAmount: b.deposit_amount,
    balancePaid: b.balance_paid,
    notes: b.customer_notes,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">Bookings</h1>
        <p className="mt-1 font-sans text-sm text-charcoal/60">
          Every reservation, from pending deposits to past appointments.
        </p>
      </div>

      <BookingsBoard
        bookings={rows}
        initialStatus={status as BookingStatus | undefined}
        initialDate={date}
        initialSearch={search}
      />
    </div>
  );
}
