"use client";

import { useState } from "react";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { ServiceStep } from "@/components/booking/ServiceStep";
import { SlotStep } from "@/components/booking/SlotStep";
import { DetailsStep } from "@/components/booking/DetailsStep";
import { PolicyStep } from "@/components/booking/PolicyStep";
import { PaymentStep } from "@/components/booking/PaymentStep";
import { ConfirmationStep } from "@/components/booking/ConfirmationStep";
import {
  BOOKING_STEPS,
  EMPTY_BOOKING_DRAFT,
  type BookingDraft,
  type BookingStep,
  type CustomerDetails,
} from "@/lib/booking-draft";
import { submitBooking } from "@/lib/submit-booking";
import type { AvailabilityData } from "@/lib/get-availability-data";

export function BookingWizard({ availability }: { availability: AvailabilityData }) {
  const [step, setStep] = useState<BookingStep>("service");
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_BOOKING_DRAFT);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function goTo(nextStep: BookingStep) {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    const i = BOOKING_STEPS.indexOf(step);
    if (i > 0) goTo(BOOKING_STEPS[i - 1]);
  }

  async function handlePaymentSubmit(proofFile: File) {
    setSubmitting(true);
    setError(null);
    try {
      await submitBooking({ ...draft, proofFile });
      setDraft((d) => ({ ...d, proofFile }));
      goTo("confirmation");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't submit your booking right now. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <StepIndicator current={step} />

      {step === "service" && (
        <ServiceStep
          treatmentId={draft.treatmentId}
          extensionId={draft.extensionId}
          removalRequested={draft.removalRequested}
          onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
          onNext={() => goTo("slot")}
        />
      )}

      {step === "slot" && (
        <SlotStep
          date={draft.date}
          time={draft.time}
          availability={availability}
          onChange={(date, time) => setDraft((d) => ({ ...d, date, time }))}
          onNext={() => goTo("details")}
          onBack={back}
        />
      )}

      {step === "details" && (
        <DetailsStep
          defaultValues={draft.customer}
          referencePhoto={draft.referencePhoto}
          onSubmit={(customer: CustomerDetails, referencePhoto) => {
            setDraft((d) => ({ ...d, customer, referencePhoto }));
            goTo("policy");
          }}
          onBack={back}
        />
      )}

      {step === "policy" && (
        <PolicyStep
          accepted={draft.policyAccepted}
          onSubmit={(policyAccepted) => {
            setDraft((d) => ({ ...d, policyAccepted }));
            goTo("payment");
          }}
          onBack={back}
        />
      )}

      {step === "payment" && (
        <PaymentStep
          proofFile={draft.proofFile}
          submitting={submitting}
          error={error}
          onSubmit={handlePaymentSubmit}
          onBack={back}
        />
      )}

      {step === "confirmation" && <ConfirmationStep draft={draft} />}
    </div>
  );
}
