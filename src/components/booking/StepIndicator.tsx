import type { BookingStep } from "@/lib/booking-draft";

const LABELED_STEPS: { step: BookingStep; label: string }[] = [
  { step: "service", label: "Service" },
  { step: "slot", label: "Date & Time" },
  { step: "details", label: "Details" },
  { step: "policy", label: "Policy" },
  { step: "payment", label: "Reserve" },
];

export function StepIndicator({ current }: { current: BookingStep }) {
  if (current === "confirmation") return null;
  const currentIndex = LABELED_STEPS.findIndex((s) => s.step === current);

  return (
    <div className="flex items-center justify-center gap-2">
      {LABELED_STEPS.map((s, i) => (
        <div key={s.step} className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full font-sans text-xs ${
              i < currentIndex
                ? "bg-rose-gold text-cream"
                : i === currentIndex
                  ? "bg-charcoal text-cream"
                  : "bg-cream-dark text-charcoal/40"
            }`}
          >
            {i + 1}
          </div>
          {i < LABELED_STEPS.length - 1 && (
            <div
              className={`h-px w-4 ${
                i < currentIndex ? "bg-rose-gold" : "bg-nude/60"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
