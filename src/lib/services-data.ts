import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { MOCK_TREATMENTS, MOCK_EXTENSIONS, MOCK_REMOVAL_FEES } from "@/lib/mock-data";
import type { ExtensionRow, RemovalFeeRow, TreatmentRow } from "@/lib/supabase/types";

export type PublicPricingData = {
  treatments: TreatmentRow[];
  extensions: ExtensionRow[];
  removalFees: RemovalFeeRow[];
};

/**
 * Public-facing pricing: active rows only, in display order. Reads via the
 * admin client (like getAvailabilityData) since this never runs in the
 * browser — a plain read of public, non-PII data doesn't need RLS.
 */
export async function getPublicPricingData(): Promise<PublicPricingData> {
  if (!isSupabaseConfigured) {
    return {
      treatments: MOCK_TREATMENTS,
      extensions: MOCK_EXTENSIONS,
      removalFees: MOCK_REMOVAL_FEES,
    };
  }

  const supabase = createAdminClient();
  const [{ data: treatments }, { data: extensions }, { data: removalFees }] = await Promise.all([
    supabase.from("treatments").select("*").eq("active", true).order("sort_order"),
    supabase.from("extensions").select("*").eq("active", true).order("sort_order"),
    supabase.from("removal_fees").select("*").eq("active", true).order("sort_order"),
  ]);

  return {
    treatments: treatments ?? [],
    extensions: extensions ?? [],
    removalFees: removalFees ?? [],
  };
}

/** Every row regardless of active/bookable state, for the admin Services screen. */
export async function getAllServicesForAdmin(): Promise<PublicPricingData> {
  const supabase = await createClient();
  const [{ data: treatments }, { data: extensions }, { data: removalFees }] = await Promise.all([
    supabase.from("treatments").select("*").order("sort_order"),
    supabase.from("extensions").select("*").order("sort_order"),
    supabase.from("removal_fees").select("*").order("sort_order"),
  ]);

  return {
    treatments: treatments ?? [],
    extensions: extensions ?? [],
    removalFees: removalFees ?? [],
  };
}
