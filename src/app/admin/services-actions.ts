"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");
  return supabase;
}

const SERVICE_TABLES = ["treatments", "extensions", "removal_fees"] as const;
export type ServiceTable = (typeof SERVICE_TABLES)[number];

function assertValidTable(table: string): asserts table is ServiceTable {
  if (!SERVICE_TABLES.includes(table as ServiceTable)) {
    throw new Error(`Unknown service table: ${table}`);
  }
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-+|-+$)/g, "") || "item"
  );
}

function revalidateServicePaths() {
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/book");
}

/**
 * Supabase's generated types key each table's Insert/Update shape off the
 * literal table name, but `table` here is only known at runtime (validated
 * against SERVICE_TABLES by assertValidTable) — so TS can't verify a
 * dynamic write against the resulting union statically. Postgres' own
 * schema is the real check for these three near-identical tables; this
 * narrow `any` is what lets one generic function serve all three instead
 * of hand-duplicating create/update/delete/move per table.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serviceTable(supabase: Awaited<ReturnType<typeof requireAdmin>>, table: ServiceTable): any {
  return supabase.from(table);
}

export async function createServiceItem(
  table: ServiceTable,
  fields: Record<string, string | number | boolean | null>
) {
  assertValidTable(table);
  const supabase = await requireAdmin();
  const db = serviceTable(supabase, table);

  const name = String(fields.name ?? fields.label ?? "item");
  let id = slugify(name);
  const { data: existing } = await db.select("id").eq("id", id).maybeSingle();
  if (existing) id = `${id}-${Math.random().toString(36).slice(2, 6)}`;

  const { data: last } = await db
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (last?.sort_order ?? -10) + 10;

  const { error } = await db.insert({ id, sort_order, ...fields });
  if (error) throw new Error(error.message);
  revalidateServicePaths();
}

export async function updateServiceItem(
  table: ServiceTable,
  id: string,
  fields: Record<string, string | number | boolean | null>
) {
  assertValidTable(table);
  const supabase = await requireAdmin();
  const { error } = await serviceTable(supabase, table).update(fields).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateServicePaths();
}

export async function deleteServiceItem(table: ServiceTable, id: string) {
  assertValidTable(table);
  const supabase = await requireAdmin();
  const { error } = await serviceTable(supabase, table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateServicePaths();
}

export async function moveServiceItem(table: ServiceTable, id: string, direction: "up" | "down") {
  assertValidTable(table);
  const supabase = await requireAdmin();
  const db = serviceTable(supabase, table);
  const { data: items } = await db.select("id, sort_order").order("sort_order", { ascending: true });
  if (!items) return;

  const idx = items.findIndex((i: { id: string }) => i.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx === -1 || swapIdx < 0 || swapIdx >= items.length) return;

  const current = items[idx];
  const neighbor = items[swapIdx];
  await db.update({ sort_order: neighbor.sort_order }).eq("id", String(current.id));
  await db.update({ sort_order: current.sort_order }).eq("id", String(neighbor.id));
  revalidateServicePaths();
}
