// MODEL — add, listByPropertyId, reorder, delete
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PropertyImage } from "@/types";

export async function add(
  supabase: SupabaseClient,
  propertyId: string,
  url: string,
  sortOrder: number
): Promise<{ data: PropertyImage | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("property_images")
    .insert({ property_id: propertyId, url, sort_order: sortOrder })
    .select()
    .single();
  return { data: data as PropertyImage | null, error: error as Error | null };
}

export async function listByPropertyId(
  supabase: SupabaseClient,
  propertyId: string
): Promise<{ data: PropertyImage[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("property_images")
    .select("*")
    .eq("property_id", propertyId)
    .order("sort_order", { ascending: true });
  return { data: (data ?? []) as PropertyImage[], error: error as Error | null };
}

/** Reorder: set sort_order for each image by id. */
export async function reorder(
  supabase: SupabaseClient,
  updates: { id: string; sort_order: number }[]
): Promise<{ error: Error | null }> {
  for (const { id, sort_order } of updates) {
    const { error } = await supabase
      .from("property_images")
      .update({ sort_order })
      .eq("id", id);
    if (error) return { error: error as Error };
  }
  return { error: null };
}

export async function deleteById(
  supabase: SupabaseClient,
  id: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase.from("property_images").delete().eq("id", id);
  return { error: error as Error | null };
}
