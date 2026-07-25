import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { NAIL_TREATMENTS, EXTENSIONS, DEPOSIT_AMOUNT } from "@/lib/pricing";
import { SLOT_TIMES } from "@/lib/availability";
import { notifyOwnerOfNewReservation, notifyCustomerReservation } from "@/lib/notifications";
import { sendReservationWhatsApp } from "@/lib/whatsapp";

const fieldsSchema = z.object({
  treatmentId: z.string(),
  extensionId: z.string().optional(),
  removalRequested: z.enum(["true", "false"]).default("false"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.enum(SLOT_TIMES),
  name: z.string().trim().min(2),
  phone: z.string().trim().min(9).max(16),
  email: z.string().trim().email(),
  notes: z.string().trim().max(500).optional(),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: "Booking storage isn't configured yet. Contact the studio directly for now." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const parsed = fieldsSchema.safeParse({
    treatmentId: formData.get("treatmentId"),
    extensionId: formData.get("extensionId") || undefined,
    removalRequested: formData.get("removalRequested") || undefined,
    date: formData.get("date"),
    time: formData.get("time"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking details.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const treatment = NAIL_TREATMENTS.find(
    (t) => t.id === parsed.data.treatmentId && t.bookable
  );
  if (!treatment) {
    return NextResponse.json({ error: "Invalid service selected." }, { status: 400 });
  }
  const extension = parsed.data.extensionId
    ? EXTENSIONS.find((e) => e.id === parsed.data.extensionId)
    : undefined;

  const referencePhoto = formData.get("referencePhoto");

  const supabase = createAdminClient();
  const bookingId = crypto.randomUUID();

  // Lazily release a stale hold on this day before claiming it — this is
  // what actually enforces the 60-minute hold window (see HOLD_WINDOW_MINUTES),
  // not the daily cron sweep, which only exists for bookkeeping on Vercel's
  // Hobby plan (cron can't run more often than once a day there). Matches on
  // the whole day, not just this exact time, since only one booking per day
  // is allowed at all.
  await supabase
    .from("bookings")
    .update({ status: "expired" })
    .eq("booking_date", parsed.data.date)
    .eq("status", "pending_verification")
    .lt("hold_expires_at", new Date().toISOString());

  let referencePhotoPath: string | null = null;
  if (referencePhoto instanceof File && referencePhoto.size > 0) {
    const refExt = referencePhoto.name.split(".").pop() || "jpg";
    referencePhotoPath = `${bookingId}/reference.${refExt}`;
    await supabase.storage
      .from("booking-uploads")
      .upload(referencePhotoPath, referencePhoto, { contentType: referencePhoto.type });
  }

  // Slot is held (status defaults to pending_verification, hold_expires_at
  // defaults to +60min) as soon as this insert succeeds — proof of payment
  // now happens over WhatsApp, not an upload here. The owner checks it there
  // and confirms manually in the admin dashboard (src/app/admin/actions.ts).
  const bookingRecord = {
    id: bookingId,
    treatment_id: treatment.id,
    treatment_name: treatment.name,
    treatment_price: treatment.priceMin,
    extension_id: extension?.id ?? null,
    extension_name: extension?.name ?? null,
    extension_price: extension?.price ?? null,
    booking_date: parsed.data.date,
    booking_time: parsed.data.time,
    customer_name: parsed.data.name,
    customer_phone: parsed.data.phone,
    customer_email: parsed.data.email,
    customer_notes: parsed.data.notes ?? "",
    removal_requested: parsed.data.removalRequested === "true",
    reference_photo_path: referencePhotoPath,
    deposit_amount: DEPOSIT_AMOUNT,
  };

  const { error: insertError } = await supabase.from("bookings").insert(bookingRecord);

  if (insertError) {
    // Unique violation on booking_date among held/confirmed rows — only one booking per day.
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "Sorry, that day was just booked. Please pick another." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "We couldn't save your booking. Please try again." },
      { status: 500 }
    );
  }

  await Promise.allSettled([
    sendReservationWhatsApp({
      phone: parsed.data.phone,
      customerName: parsed.data.name,
      date: parsed.data.date,
      time: parsed.data.time,
    }),
    notifyOwnerOfNewReservation({
      customerName: parsed.data.name,
      date: parsed.data.date,
      time: parsed.data.time,
    }),
    notifyCustomerReservation({
      email: parsed.data.email,
      customerName: parsed.data.name,
      date: parsed.data.date,
      time: parsed.data.time,
    }),
  ]);

  return NextResponse.json({ bookingId });
}
