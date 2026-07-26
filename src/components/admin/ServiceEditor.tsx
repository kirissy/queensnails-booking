"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  createServiceItem,
  deleteServiceItem,
  moveServiceItem,
  updateServiceItem,
  type ServiceTable,
} from "@/app/admin/services-actions";

type FieldValue = string | number | boolean | null;
type ServiceItem = Record<string, FieldValue>;

type FieldConfig = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "select";
  options?: { value: string; label: string }[];
  /** Number/text fields only — empty input saves as null instead of 0/"". */
  optional?: boolean;
};

export function ServiceEditor({
  table,
  title,
  description,
  items,
  fields,
  titleKey,
  summary,
}: {
  table: ServiceTable;
  title: string;
  description: string;
  items: ServiceItem[];
  fields: FieldConfig[];
  titleKey: string;
  summary: (item: ServiceItem) => string;
}) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await action();
        setEditingId(null);
        setAdding(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-sans text-lg font-semibold text-charcoal">{title}</h2>
        <p className="mt-1 font-sans text-sm text-charcoal/60">{description}</p>
      </div>

      {error && <p className="font-sans text-xs text-burgundy">{error}</p>}

      <div className="flex flex-col gap-2">
        {items.map((item, i) => {
          const id = String(item.id);
          return (
            <div key={id} className="rounded-2xl border border-nude/60 bg-cream px-4 py-3">
              {editingId === id ? (
                <ServiceForm
                  fields={fields}
                  initial={item}
                  submitLabel="Save"
                  pending={isPending}
                  onCancel={() => setEditingId(null)}
                  onSubmit={(values) => run(() => updateServiceItem(table, id, values))}
                />
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-sans text-sm font-semibold text-charcoal">
                        {String(item[titleKey])}
                      </p>
                      {"active" in item && !item.active && (
                        <span className="rounded-full bg-charcoal/10 px-2 py-0.5 font-sans text-[11px] text-charcoal/50">
                          Hidden
                        </span>
                      )}
                      {"bookable" in item && !item.bookable && (
                        <span className="rounded-full bg-gold/30 px-2 py-0.5 font-sans text-[11px] text-charcoal">
                          Not bookable online
                        </span>
                      )}
                    </div>
                    {typeof item.note === "string" && item.note && (
                      <p className="font-sans text-xs text-charcoal/50">{item.note}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <p className="font-sans text-sm font-medium text-price">{summary(item)}</p>
                    <div className="flex flex-col">
                      <button
                        type="button"
                        disabled={isPending || i === 0}
                        onClick={() => run(() => moveServiceItem(table, id, "up"))}
                        className="text-charcoal/40 hover:text-charcoal disabled:opacity-20"
                        aria-label="Move up"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isPending || i === items.length - 1}
                        onClick={() => run(() => moveServiceItem(table, id, "down"))}
                        className="text-charcoal/40 hover:text-charcoal disabled:opacity-20"
                        aria-label="Move down"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingId(id)}
                      className="rounded-full border border-nude px-3 py-1.5 font-sans text-xs text-charcoal hover:bg-blush/30"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => {
                        if (confirm(`Delete "${String(item[titleKey])}"? This can't be undone.`)) {
                          run(() => deleteServiceItem(table, id));
                        }
                      }}
                      className="rounded-full border border-burgundy/40 px-3 py-1.5 font-sans text-xs text-burgundy"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {adding ? (
        <div className="rounded-2xl border border-dashed border-rose-gold/50 bg-blush/20 px-4 py-3">
          <ServiceForm
            fields={fields}
            initial={{}}
            submitLabel="Add"
            pending={isPending}
            onCancel={() => setAdding(false)}
            onSubmit={(values) => run(() => createServiceItem(table, values))}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="w-fit rounded-full border border-nude px-4 py-2 font-sans text-xs font-medium text-charcoal hover:bg-blush/30"
        >
          + Add
        </button>
      )}
    </section>
  );
}

function ServiceForm({
  fields,
  initial,
  submitLabel,
  pending,
  onCancel,
  onSubmit,
}: {
  fields: FieldConfig[];
  initial: ServiceItem;
  submitLabel: string;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (values: ServiceItem) => void;
}) {
  const [values, setValues] = useState<ServiceItem>(() => {
    const v: ServiceItem = {};
    for (const f of fields) {
      const raw = initial[f.key];
      if (f.type === "checkbox") v[f.key] = typeof raw === "boolean" ? raw : true;
      else if (f.type === "number") v[f.key] = typeof raw === "number" ? raw : "";
      else if (f.type === "select") v[f.key] = typeof raw === "string" ? raw : (f.options?.[0]?.value ?? "");
      else v[f.key] = typeof raw === "string" ? raw : "";
    }
    return v;
  });

  function set(key: string, value: FieldValue) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned: ServiceItem = {};
    for (const f of fields) {
      let v = values[f.key];
      if (f.type === "number") {
        v = v === "" || v === null ? (f.optional ? null : 0) : Number(v);
      } else if (f.type === "text" || f.type === "textarea") {
        v = typeof v === "string" ? v.trim() : v;
        if (f.optional && v === "") v = null;
      }
      cleaned[f.key] = v;
    }
    onSubmit(cleaned);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {fields.map((f) => (
        <label key={f.key} className="flex flex-col gap-1">
          <span className="font-sans text-xs text-charcoal/60">{f.label}</span>
          {f.type === "textarea" ? (
            <textarea
              value={typeof values[f.key] === "string" ? (values[f.key] as string) : ""}
              onChange={(e) => set(f.key, e.target.value)}
              rows={2}
              className="rounded-lg border border-nude/60 bg-cream px-3 py-2 font-sans text-sm text-charcoal outline-none focus:border-rose-gold"
            />
          ) : f.type === "checkbox" ? (
            <input
              type="checkbox"
              checked={Boolean(values[f.key])}
              onChange={(e) => set(f.key, e.target.checked)}
              className="h-4 w-4 self-start"
            />
          ) : f.type === "select" ? (
            <select
              value={typeof values[f.key] === "string" ? (values[f.key] as string) : ""}
              onChange={(e) => set(f.key, e.target.value)}
              className="rounded-lg border border-nude/60 bg-cream px-3 py-2 font-sans text-sm text-charcoal outline-none focus:border-rose-gold"
            >
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={f.type === "number" ? "number" : "text"}
              value={values[f.key] === null ? "" : (values[f.key] as string | number)}
              onChange={(e) =>
                set(f.key, f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)
              }
              className="rounded-lg border border-nude/60 bg-cream px-3 py-2 font-sans text-sm text-charcoal outline-none focus:border-rose-gold"
            />
          )}
        </label>
      ))}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-nude px-4 py-1.5 font-sans text-xs text-charcoal"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-rose-gold px-4 py-1.5 font-sans text-xs font-medium text-cream disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
