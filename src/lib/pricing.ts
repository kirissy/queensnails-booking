// Treatments/extensions/removal fees used to be hardcoded here — they now
// live in the `treatments`/`extensions`/`removal_fees` tables (see
// src/lib/services-data.ts) so the owner can manage them from
// /admin/services. This file keeps what's still genuinely fixed: the
// deposit amount, IDR formatting, and the free inclusions list (no pricing
// to manage, so not worth a CRUD table).

export const INCLUDED_ITEMS = [
  "Machine manicure",
  "Structural builder gel",
  "Gel polish application",
  "Vitamins",
  "Hand cream (all 10 fingers)",
];

export const DEPOSIT_AMOUNT = 50_000;

export function formatIDR(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
  // Intl inserts a space between "Rp" and the number ("Rp 275.000") — the
  // brand's own formatting drops it ("Rp275.000").
  return formatted.replace(/\s/g, "");
}
