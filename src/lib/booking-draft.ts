import type { DateKey, SlotTime } from "./availability";

export type CustomerDetails = {
  name: string;
  phone: string;
  email: string;
  notes: string;
};

export type BookingDraft = {
  treatmentId: string | null;
  extensionId: string | null;
  date: DateKey | null;
  time: SlotTime | null;
  customer: CustomerDetails | null;
  referencePhoto: File | null;
  policyAccepted: boolean;
  proofFile: File | null;
};

export const EMPTY_BOOKING_DRAFT: BookingDraft = {
  treatmentId: null,
  extensionId: null,
  date: null,
  time: null,
  customer: null,
  referencePhoto: null,
  policyAccepted: false,
  proofFile: null,
};

export const BOOKING_STEPS = [
  "service",
  "slot",
  "details",
  "policy",
  "payment",
  "confirmation",
] as const;

export type BookingStep = (typeof BOOKING_STEPS)[number];
