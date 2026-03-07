// CONTROLLER — search(filters, pagination) → property.model listPublic with filters
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Property } from "@/types";
import type { ListPublicFilters } from "@/models/property.model";
import * as propertyModel from "@/models/property.model";

export type SearchFilters = ListPublicFilters;

export async function search(
  supabase: SupabaseClient,
  filters: SearchFilters = {}
): Promise<{ data: Property[]; error: string | null }> {
  const { data, error } = await propertyModel.listPublic(supabase, filters);
  return { data, error: (error as Error)?.message ?? null };
}
