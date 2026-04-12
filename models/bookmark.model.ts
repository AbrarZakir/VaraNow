// MODEL — add, remove, listByUserId, isBookmarked
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Bookmark } from "@/types";

export async function add(
  supabase: SupabaseClient,
  userId: string,
  propertyId: string
): Promise<{ data: Bookmark | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("bookmarks")
    .insert({ user_id: userId, property_id: propertyId })
    .select()
    .single();
  return { data: data as Bookmark | null, error: error as Error | null };
}

export async function remove(
  supabase: SupabaseClient,
  userId: string,
  propertyId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("property_id", propertyId);
  return { error: error as Error | null };
}

export async function listByUserId(
  supabase: SupabaseClient,
  userId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<{ data: Bookmark[]; count: number; error: Error | null }> {
  const { limit = 12, offset = 0 } = options;
  const { data, error, count } = await supabase
    .from("bookmarks")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  return {
    data: (data ?? []) as Bookmark[],
    count: count ?? 0,
    error: error as Error | null,
  };
}

export async function isBookmarked(
  supabase: SupabaseClient,
  userId: string,
  propertyId: string
): Promise<{ data: boolean; error: Error | null }> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("property_id", propertyId)
    .maybeSingle();
  return { data: !!data, error: error as Error | null };
}
