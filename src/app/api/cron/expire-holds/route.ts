import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";

/**
 * Releases slots held by customers who never uploaded proof / whose hold
 * window lapsed — see HOLD_WINDOW_MINUTES in lib/policy.ts. Meant to run
 * every few minutes via an external scheduler (e.g. Vercel Cron).
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
