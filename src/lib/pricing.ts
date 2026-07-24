export type NailTreatment = {
  id: string;
  name: string;
  priceMin: number;
  priceMax?: number;
  note?: string;
  bookable: boolean;
};

export type Extension = {
  id: string;
  name: string;
  price: number;
  unit?: "flat" | "per-nail";
};

export type RemovalFee = {
  id: string;
  label: string;
  price: number;
};

export const NAIL_TREATMENTS: NailTreatment[] = [
  {
    id: "one-plain-color",
    name: "One Plain Color",
    priceMin: 275_000,
    note: "Choose one color from the display menu",
    bookable: true,
  },
  {
    id: "mix-color",
    name: "Mix Color",
    priceMin: 300_000,
    note: "We mix your preferred colors",
    bookable: true,
  },
  {
    id: "magnet-aurora",
    name: "Magnet / Aurora",
    priceMin: 350_000,
    note: "Choose one finish design from the display menu",
    bookable: true,
  },
  {
    id: "french-full-chrome",
    name: "French / Full Chrome",
    priceMin: 450_000,
    note: "French tip design or full clear chrome design",
    bookable: true,
  },
  {
    id: "sample-design",
    name: "Sample Design",
    priceMin: 400_000,
    priceMax: 600_000,
    note: "Choose a design from the prepared samples — price depends on which sample",
    bookable: true,
  },
  {
    id: "other-design",
    name: "Other Design",
    priceMin: 0,
    note: "Bring references, detailed art on all 10 nails — message us to confirm price after booking",
    bookable: true,
  },
];

export const EXTENSIONS: Extension[] = [
  { id: "express-tip", name: "Express Tip Extension", price: 200_000, unit: "flat" },
  { id: "polygel", name: "Polygel Extension", price: 400_000, unit: "flat" },
  { id: "fill-in", name: "Fill-in Extension", price: 10_000, unit: "per-nail" },
];

export const INCLUDED_ITEMS = [
  "Machine manicure",
  "Structural builder gel",
  "Gel polish application",
  "Vitamins",
  "Hand cream (all 10 fingers)",
];

export const REMOVAL_FEES: RemovalFee[] = [
  { id: "removal-here", label: "Previous set done at this studio (non-3D)", price: 50_000 },
  { id: "removal-elsewhere", label: "Previous set done at another salon (non-3D)", price: 100_000 },
  { id: "removal-3d-extra", label: "Extra on top, if 3D design", price: 25_000 },
  { id: "removal-ext-here", label: "Previous gel-extension set done at this studio", price: 75_000 },
  { id: "removal-ext-elsewhere", label: "Previous gel-extension set done at another salon", price: 150_000 },
];

export const DEPOSIT_AMOUNT = 50_000;

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}
