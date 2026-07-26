import { dateKey, type BookingStub, type DayOverrides } from "./availability";
import type { ExtensionRow, RemovalFeeRow, TreatmentRow } from "./supabase/types";

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

/**
 * Placeholder data standing in for the admin dashboard's per-day toggles
 * and Supabase-backed bookings until those are wired up (build order steps 4-6).
 */
export const MOCK_DAY_OVERRIDES: DayOverrides = {
  [dateKey(daysFromNow(3))]: ["11:00"],
  [dateKey(daysFromNow(6))]: "closed",
};

export const MOCK_BOOKINGS: BookingStub[] = [
  // Only one booking per day is allowed — each entry here is a different day.
  { date: dateKey(daysFromNow(2)), time: "18:00", status: "confirmed" },
  { date: dateKey(daysFromNow(5)), time: "15:00", status: "pending" },
  { date: dateKey(daysFromNow(9)), time: "11:00", status: "confirmed" },
];

/** Stands in for the `treatments`/`extensions`/`removal_fees` tables until Supabase is connected. */
export const MOCK_TREATMENTS: TreatmentRow[] = [
  {
    id: "one-plain-color",
    name: "One Plain Colour",
    price_min: 275_000,
    price_max: null,
    note: "Choose one colour from our selection on the display menu",
    bookable: true,
    active: true,
    sort_order: 0,
  },
  {
    id: "mix-color",
    name: "Mixed Colour",
    price_min: 300_000,
    price_max: null,
    note: "We mix your preferred colours",
    bookable: true,
    active: true,
    sort_order: 10,
  },
  {
    id: "magnet-aurora",
    name: "Magnet / Aurora",
    price_min: 350_000,
    price_max: null,
    note: "Choose one finish design from the display menu",
    bookable: true,
    active: true,
    sort_order: 20,
  },
  {
    id: "french-full-chrome",
    name: "French / Full Chrome",
    price_min: 450_000,
    price_max: null,
    note: "French tip design or full clear chrome design",
    bookable: true,
    active: true,
    sort_order: 30,
  },
  {
    id: "sample-design",
    name: "Sample Design",
    price_min: 400_000,
    price_max: 600_000,
    note: "Choose a design from the prepared samples — price depends on which sample",
    bookable: true,
    active: true,
    sort_order: 40,
  },
  {
    id: "other-design",
    name: "Other Design",
    price_min: 0,
    price_max: null,
    note: "Bring references, detailed art on all 10 nails — message us to confirm price after booking",
    bookable: true,
    active: true,
    sort_order: 50,
  },
];

export const MOCK_EXTENSIONS: ExtensionRow[] = [
  { id: "express-tip", name: "Express Tip Extension", price: 200_000, unit: "flat", active: true, sort_order: 0 },
  { id: "polygel", name: "Polygel Extension", price: 400_000, unit: "flat", active: true, sort_order: 10 },
  { id: "fill-in", name: "Fill-in Extension", price: 10_000, unit: "per-nail", active: true, sort_order: 20 },
];

export const MOCK_REMOVAL_FEES: RemovalFeeRow[] = [
  { id: "removal-here", label: "Previous set done at this studio (non-3D)", price: 50_000, active: true, sort_order: 0 },
  { id: "removal-elsewhere", label: "Previous set done at another salon (non-3D)", price: 100_000, active: true, sort_order: 10 },
  { id: "removal-3d-extra", label: "Extra on top, if 3D design", price: 25_000, active: true, sort_order: 20 },
  { id: "removal-ext-here", label: "Previous gel-extension set done at this studio", price: 75_000, active: true, sort_order: 30 },
  { id: "removal-ext-elsewhere", label: "Previous gel-extension set done at another salon", price: 150_000, active: true, sort_order: 40 },
];
