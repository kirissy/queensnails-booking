import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";

/**
 * Bookkeeping sweep only — flips stale pending_verification rows to
 * 'expired' so they don't linger in that state forever. The 60-minute hold
 * window (HOLD_WINDOW_MINUTES in lib/policy.ts) is actually enforced lazily
 * in /api/bookings, the moment someone else tries to claim the same slot, so
 * a slot is never stuck waiting on this cron to run. That's what lets this
 * run just once a day — Vercel's Hobby plan doesn't allow more frequent cron.
 */
export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured) {
    return NextResponse.json({ expired: 0 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "expired" })
    .eq("status", "pending_verification")
    .lt("hold_expires_at", new Date().toISOString())
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ expired: data?.length ?? 0 });
}
