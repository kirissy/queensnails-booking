"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  notifyCustomerConfirmed,
  notifyCustomerRejected,
  notifyOwnerEvent,
} from "@/lib/notifications";
import { createCalendarEventForBooking } from "@/lib/google-calendar";
import type { SlotTime } from "@/lib/availability";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");
  return { supabase, user };
}

export async function confirmBooking(bookingId: string) {
  const { supabase, user } = await requireAdmin();

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();
  if (fetchError || !booking) throw new Error("Booking not found.");

  const { error } = await supabase
    .from("bookings")
    .update({ status: "confirmed", verified_at: new Date().toISOString(), verified_by: user.id })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);

  const eventId = await createCalendarEventForBooking(booking).catch((err) => {
    console.error("[calendar] failed to create event", err);
    return null;
  });
  if (eventId) {
    await supabase
      .from("bookings")
      .update({ google_calendar_event_id: eventId })
      .eq("id", bookingId);
  }

  await notifyCustomerConfirmed({
    email: booking.customer_email,
    customerName: booking.customer_name,
    date: booking.booking_date,
    time: booking.booking_time,
    treatmentName: booking.treatment_name,
    extensionName: booking.extension_name,
    depositAmount: booking.deposit_amount,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
}

export async function rejectBooking(bookingId: string, reason: string) {
  const { supabase } = await requireAdmin();

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("customer_email, customer_name")
    .eq("id", bookingId)
    .single();
  if (fetchError || !booking) throw new Error("Booking not found.");

  const { error } = await supabase
    .from("bookings")
    .update({ status: "rejected", rejection_reason: reason, verified_at: new Date().toISOString() })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);

  await notifyCustomerRejected({
    email: booking.customer_email,
    customerName: booking.customer_name,
    reason,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
}

export async function markBalancePaid(bookingId: string, removalSurcharge?: number) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("bookings")
    .update({
      balance_paid: true,
      status: "completed",
      removal_surcharge: removalSurcharge ?? null,
    })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/bookings");
}

export async function markNoShow(bookingId: string) {
  const { supabase } = await requireAdmin();
  const { data: booking } = await supabase
    .from("bookings")
    .select("customer_name, booking_date, booking_time")
    .eq("id", bookingId)
    .single();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "no_show" })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);

  if (booking) {
    await notifyOwnerEvent(
      "No-show logged",
      `${booking.customer_name}'s ${booking.booking_date} ${booking.booking_time} appointment was marked no-show.`
    );
  }

  revalidatePath("/admin/bookings");
}

export async function cancelBooking(bookingId: string, reason?: string) {
  const { supabase } = await requireAdmin();
  const { data: booking } = await supabase
    .from("bookings")
    .select("customer_name, customer_email, booking_date, booking_time")
    .eq("id", bookingId)
    .single();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", admin_notes: reason ?? null })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);

  if (booking) {
    await notifyOwnerEvent(
      "Booking cancelled",
      `${booking.customer_name}'s ${booking.booking_date} ${booking.booking_time} appointment was cancelled by the studio.`
    );
  }

  revalidatePath("/admin/bookings");
}

export async function rescheduleBooking(bookingId: string, date: string, time: SlotTime) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("bookings")
    .update({ booking_date: date, booking_time: time })
    .eq("id", bookingId);
  if (error) {
    if (error.code === "23505") throw new Error("That slot is already taken.");
    throw new Error(error.message);
  }
  revalidatePath("/admin/bookings");
  revalidatePath("/book");
}

export async function setDayOverride(date: string, slots: SlotTime[] | "closed") {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("day_overrides")
    .upsert({ booking_date: date, slots: slots === "closed" ? [] : slots });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/slots");
  revalidatePath("/book");
}
