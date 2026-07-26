import { createClient } from "@/lib/supabase/server";
import type { BookingRow, BookingStatus } from "@/lib/supabase/types";

export type AdminBooking = Pick<
  BookingRow,
  | "id"
  | "created_at"
  | "customer_name"
  | "customer_phone"
  | "customer_email"
  | "treatment_name"
  | "extension_name"
  | "treatment_price"
  | "extension_price"
  | "removal_requested"
  | "removal_surcharge"
  | "booking_date"
  | "booking_time"
  | "status"
  | "deposit_amount"
  | "balance_paid"
  | "customer_notes"
  | "hold_expires_at"
>;

const ADMIN_BOOKING_FIELDS =
  "id, created_at, customer_name, customer_phone, customer_email, treatment_name, extension_name, treatment_price, extension_price, removal_requested, removal_surcharge, booking_date, booking_time, status, deposit_amount, balance_paid, customer_notes, hold_expires_at";

/**
 * Every booking regardless of status — at most one active booking per day
 * by design, so the whole table is small enough to fetch in one query and
 * filter/sort/aggregate in memory rather than pushing that logic into SQL.
 */
export async function getAllBookings(): Promise<AdminBooking[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select(ADMIN_BOOKING_FIELDS)
    .order("booking_date", { ascending: false });
  return data ?? [];
}

export function bookingService(b: Pick<AdminBooking, "treatment_name" | "extension_name">): string {
  return b.extension_name ? `${b.treatment_name} + ${b.extension_name}` : b.treatment_name;
}

/** Statuses that still occupy their day — cancelled/rejected/expired free it back up for rebooking. */
export const ACTIVE_BOOKING_STATUSES = [
  "pending_verification",
  "confirmed",
  "completed",
  "no_show",
] as const;

export type Customer = {
  phone: string;
  name: string;
  email: string;
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string;
  lastStatus: BookingStatus;
};

/**
 * There's no separate customers table — a "customer" is just the set of
 * bookings sharing a phone number. Grouping happens here rather than in SQL
 * since the whole bookings table is already fetched in one shot elsewhere.
 */
export function computeCustomers(bookings: AdminBooking[]): Customer[] {
  const byPhone = new Map<string, AdminBooking[]>();
  for (const b of bookings) {
    const list = byPhone.get(b.customer_phone) ?? [];
    list.push(b);
    byPhone.set(b.customer_phone, list);
  }

  const customers: Customer[] = [];
  for (const [phone, list] of byPhone) {
    const sorted = [...list].sort((a, b) => b.booking_date.localeCompare(a.booking_date));
    const latest = sorted[0];
    const totalSpent = list
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce(
        (sum, b) => sum + b.treatment_price + (b.extension_price ?? 0) + (b.removal_surcharge ?? 0),
        0
      );

    customers.push({
      phone,
      name: latest.customer_name,
      email: latest.customer_email,
      totalBookings: list.length,
      totalSpent,
      lastBookingDate: latest.booking_date,
      lastStatus: latest.status,
    });
  }

  return customers.sort((a, b) => b.lastBookingDate.localeCompare(a.lastBookingDate));
}
