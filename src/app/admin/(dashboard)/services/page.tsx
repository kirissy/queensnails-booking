import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getAllServicesForAdmin } from "@/lib/services-data";
import { formatIDR } from "@/lib/pricing";
import { ServiceEditor } from "@/components/admin/ServiceEditor";

function priceLabel(min: number, max: number | null) {
  if (min === 0) return "Ask / consult";
  if (max) return `${formatIDR(min)}–${formatIDR(max)}`;
  return formatIDR(min);
}

export default async function ServicesPage() {
  if (!isSupabaseConfigured) {
    return (
      <p className="font-sans text-sm text-charcoal/60">
        Supabase isn&apos;t connected yet — service and pricing management
        needs it. See the project README for the env vars this needs.
      </p>
    );
  }

  const { treatments, extensions, removalFees } = await getAllServicesForAdmin();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">Services</h1>
        <p className="mt-1 font-sans text-sm text-charcoal/60">
          Manage the treatments, extensions, and removal fees shown on the
          public pricelist and the booking wizard. Changes appear
          immediately on the website.
        </p>
      </div>

      <ServiceEditor
        table="treatments"
        title="Nail Treatments"
        description="The base services customers choose in step 1 of booking."
        titleKey="name"
        items={treatments}
        fields={[
          { key: "name", label: "Name", type: "text" },
          { key: "price_min", label: "Starting price (IDR)", type: "number" },
          {
            key: "price_max",
            label: "Max price (IDR) — optional, shows a range",
            type: "number",
            optional: true,
          },
          { key: "note", label: "Note (optional)", type: "textarea", optional: true },
          { key: "bookable", label: "Bookable online", type: "checkbox" },
          { key: "active", label: "Shown on pricelist", type: "checkbox" },
        ]}
        summary={(item) => priceLabel(item.price_min as number, item.price_max as number | null)}
      />

      <ServiceEditor
        table="extensions"
        title="Nail Extensions"
        description="Optional add-ons offered alongside a treatment."
        titleKey="name"
        items={extensions}
        fields={[
          { key: "name", label: "Name", type: "text" },
          { key: "price", label: "Price (IDR)", type: "number" },
          {
            key: "unit",
            label: "Unit",
            type: "select",
            options: [
              { value: "flat", label: "Flat" },
              { value: "per-nail", label: "Per nail" },
            ],
          },
          { key: "active", label: "Shown on pricelist", type: "checkbox" },
        ]}
        summary={(item) =>
          `+${formatIDR(item.price as number)}${item.unit === "per-nail" ? " / nail" : ""}`
        }
      />

      <ServiceEditor
        table="removal_fees"
        title="Removal Fees"
        description="Fees for removing a customer's existing set before a new treatment."
        titleKey="label"
        items={removalFees}
        fields={[
          { key: "label", label: "Label", type: "text" },
          { key: "price", label: "Price (IDR)", type: "number" },
          { key: "active", label: "Shown on pricelist", type: "checkbox" },
        ]}
        summary={(item) => `+${formatIDR(item.price as number)}`}
      />
    </div>
  );
}
