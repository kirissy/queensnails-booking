import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { VerificationCard } from "@/components/admin/VerificationCard";

export default async function VerificationQueuePage() {
  if (!isSupabaseConfigured) {
    return (
      <p className="font-sans text-sm text-charcoal/60">
        Supabase isn&apos;t connected yet — there&apos;s nothing to verify
        until real bookings start coming in. See the project README for the
        env vars this needs.
      </p>
    );
  }

  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "id, created_at, customer_name, customer_phone, treatment_name, extension_name, removal_requested, booking_date, booking_time, deposit_amount"
    )
    .eq("status", "pending_verification")
    // Excludes holds whose 60-minute window already lapsed but haven't been
    // flipped to 'expired' yet (that only happens lazily, when someone else
    // tries to claim the same slot — see /api/bookings).
    .gt("hold_expires_at", new Date().toISOString())
    .order("created_at", { ascending: true });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Deposit Verification Queue
        </h1>
        <p className="mt-1 font-sans text-sm text-charcoal/60">
          A slot isn&apos;t secured until you confirm it — check WhatsApp for
          their payment proof, oldest reservations first.
        </p>
      </div>

      {!bookings || bookings.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-nude/60 px-5 py-8 text-center font-sans text-sm text-charcoal/50">
          Nothing waiting on you right now.
        </p>
      ) : (
        bookings.map((b) => (
          <VerificationCard
            key={b.id}
            bookingId={b.id}
            customerName={b.customer_name}
            customerPhone={b.customer_phone}
            service={
              b.extension_name
                ? `${b.treatment_name} + ${b.extension_name}`
                : b.treatment_name
            }
            removalRequested={b.removal_requested}
            date={b.booking_date}
            time={b.booking_time}
            depositAmount={b.deposit_amount}
            submittedAt={b.created_at}
          />
        ))
      )}
    </div>
  );
}
