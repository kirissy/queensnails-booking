import { NextResponse } from "next/server";
import { formatInTimeZone } from "date-fns-tz";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { notifyCustomerReminder } from "@/lib/notifications";
import { STUDIO_TIMEZONE } from "@/lib/availability";

/** Sends the 24h-before reminder email for tomorrow's confirmed bookings. Meant to run once a day via an external scheduler. */
export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured) {
    return NextResponse.json({ sent: 0 });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = formatInTimeZone(tomorrow, STUDIO_TIMEZONE, "yyyy-MM-dd");

  const supabase = createAdminClient();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("customer_email, customer_name, booking_date, booking_time")
    .eq("status", "confirmed")
    .eq("booking_date", tomorrowKey);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await Promise.allSettled(
    (bookings ?? []).map((b) =>
      notifyCustomerReminder({
        email: b.customer_email,
        customerName: b.customer_name,
        date: b.booking_date,
        time: b.booking_time,
      })
    )
  );

  return NextResponse.json({ sent: bookings?.length ?? 0 });
}
