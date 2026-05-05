"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import * as propertyController from "@/controllers/property.controller";
import type { ListPublicFilters } from "@/models/property.model";
import type { Property } from "@/types";

/** Batch-fetches the first image URL for a list of property IDs. */
async function getFirstImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  propertyIds: string[]
): Promise<Record<string, string>> {
  if (propertyIds.length === 0) return {};
  const { data } = await supabase
    .from("property_images")
    .select("property_id, url")
    .in("property_id", propertyIds)
    .order("sort_order", { ascending: true });

  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    if (!map[row.property_id]) map[row.property_id] = row.url;
  }
  return map;
}

export async function getFeaturedListings(limit = 8) {
  const supabase = await createClient();
  const result = await propertyController.listForSearch(supabase, { limit, offset: 0 });
  const imageMap = await getFirstImages(supabase, result.data.map((p) => p.id));
  return { ...result, imageMap };
}

export async function getPropertyDetailAction(propertyId: string) {
  const supabase = await createClient();
  return propertyController.getPropertyDetail(supabase, propertyId);
}

export async function getMapMarkersAction() {
  const supabase = await createClient();
  return propertyController.listForMap(supabase);
}

export async function searchListingsAction(filters: ListPublicFilters = {}) {
  const supabase = await createClient();
  const result = await propertyController.listForSearch(supabase, filters);
  const imageMap = await getFirstImages(supabase, result.data.map((p) => p.id));
  return { ...result, imageMap };
}

export async function getMyListingsAction(options: { limit?: number; offset?: number } = {}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [] as Property[], count: 0, error: "Not authenticated", imageMap: {} };
  const result = await propertyController.listByOwner(supabase, user.id, options);
  const imageMap = await getFirstImages(supabase, result.data.map((p) => p.id));
  return { ...result, imageMap };
}

export async function deleteListingAction(
  propertyId: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  const result = await propertyController.deleteListing(supabase, propertyId, user.id);
  if (!result.error) {
    revalidatePath("/dashboard/listings");
  }
  return result;
}
