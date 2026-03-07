"use server";

import { createClient } from "@/lib/supabase/server";
import * as propertyController from "@/controllers/property.controller";
import type { ListPublicFilters } from "@/models/property.model";

export async function getFeaturedListings(limit = 8) {
  const supabase = await createClient();
  return propertyController.listForSearch(supabase, { limit, offset: 0 });
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
  return propertyController.listForSearch(supabase, filters);
}

export async function getMyListingsAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: "Not authenticated" };
  return propertyController.listByOwner(supabase, user.id);
}
