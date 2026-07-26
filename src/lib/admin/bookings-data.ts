import { createClient } from "@/lib/supabase/server";
import type { BookingRow } from "@/lib/supabase/types";

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
