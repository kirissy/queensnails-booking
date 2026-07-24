import type { BookingDraft } from "./booking-draft";
import { isSupabaseConfigured } from "./supabase/env";

export class SlotTakenError extends Error {}

/**
 * Submits the completed booking draft. Until a real Supabase project is
 * connected (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY), this simulates the network
 * round trip so the wizard stays demoable end-to-end on mock data.
 */
export async function submitBooking(draft: BookingDraft): Promise<{ bookingId: string }> {
  if (!draft.treatmentId || !draft.date || !draft.time || !draft.customer || !draft.proofFile) {
    throw new Error("Booking draft is incomplete.");
  }

  if (!isSupabaseConfigured) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { bookingId: `demo-${Date.now()}` };
  }

  const formData = new FormData();
  formData.set("treatmentId", draft.treatmentId);
  if (draft.extensionId) formData.set("extensionId", draft.extensionId);
  formData.set("removalRequested", String(draft.removalRequested));
  formData.set("date", draft.date);
  formData.set("time", draft.time);
  formData.set("name", draft.customer.name);
  formData.set("phone", draft.customer.phone);
  formData.set("email", draft.customer.email);
  formData.set("notes", draft.customer.notes);
  formData.set("proofFile", draft.proofFile);
  if (draft.referencePhoto) formData.set("referencePhoto", draft.referencePhoto);

  const res = await fetch("/api/bookings", { method: "POST", body: formData });
  const body = await res.json();

  if (!res.ok) {
    if (res.status === 409) throw new SlotTakenError(body.error);
    throw new Error(body.error ?? "Something went wrong submitting your booking.");
  }

  return body;
}
