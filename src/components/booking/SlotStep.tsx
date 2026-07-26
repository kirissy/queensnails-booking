import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import type { AvailabilityData } from "@/lib/get-availability-data";
import type { DateKey, SlotTime } from "@/lib/availability";

type Props = {
  date: DateKey | null;
  time: SlotTime | null;
  availability: AvailabilityData;
  onChange: (date: DateKey, time: SlotTime) => void;
  onNext: () => void;
  onBack: () => void;
};

export function SlotStep({ date, time, availability, onChange, onNext, onBack }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-charcoal">
          Choose a Date &amp; Time
        </h2>
        <p className="mt-1 font-sans text-sm text-charcoal/60">
          Closed Sundays. One booking a day, at 11:00, 15:00 or 18:00 WIB.
          Same-day booking isn&apos;t available — please book at least a day
          ahead.
        </p>
      </div>

      <AvailabilityCalendar
        overrides={availability.overrides}
        bookings={availability.bookings}
        initialDate={date}
        initialTime={time}
        onSelect={onChange}
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-nude px-6 py-3 font-sans text-sm text-charcoal transition-colors hover:bg-blush/30"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!date || !time}
          onClick={onNext}
          className="flex-1 rounded-full bg-rose-gold px-8 py-3 font-sans text-sm font-medium tracking-wide text-cream transition-colors hover:bg-rose-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
