// MODEL — create, update, delete, getById, listForMap, listByOwner, listPublic (expiry + filters)
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Property,
  PropertyType,
  PropertyCategory,
  PropertyStatus,
} from "@/types";

/** Public listing filters; only available + non-expired rows are returned. */
export interface ListPublicFilters {
  type?: PropertyType;
  category?: PropertyCategory;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  /** Optional: limit to area around (lat, lng) within radiusKm (approximate). */
  lat?: number;
  lng?: number;
  radiusKm?: number;
  limit?: number;
  offset?: number;
}

/** Row shape for map markers (Leaflet). */
export interface PropertyMapItem {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  status: PropertyStatus;
}

export type CreatePropertyParams = Omit<
  Property,
  "id" | "created_at" | "updated_at" | "expiry_at"
> & { expiry_at?: string | null };

export async function create(
  supabase: SupabaseClient,
  params: CreatePropertyParams
): Promise<{ data: Property | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("properties")
    .insert(params)
    .select()
    .single();
  return { data: data as Property | null, error: error as Error | null };
}

export type UpdatePropertyData = Partial<
  Omit<Property, "id" | "owner_id" | "created_at" | "expiry_at">
> & { expiry_at?: string | null };

export async function update(
  supabase: SupabaseClient,
  id: string,
  data: UpdatePropertyData
): Promise<{ data: Property | null; error: Error | null }> {
  const { data: updated, error } = await supabase
    .from("properties")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  return { data: updated as Property | null, error: error as Error | null };
}

export async function deleteById(
  supabase: SupabaseClient,
  id: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase.from("properties").delete().eq("id", id);
  return { error: error as Error | null };
}

export async function getById(
  supabase: SupabaseClient,
  id: string
): Promise<{ data: Property | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  return { data: data as Property | null, error: error as Error | null };
}

const nowIso = () => new Date().toISOString();

/** For map: id, lat, lng, title, status. Only available and non-expired. */
export async function listForMap(
  supabase: SupabaseClient
): Promise<{ data: PropertyMapItem[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("properties")
    .select("id, latitude, longitude, title, status")
    .eq("status", "available")
    .or(`expiry_at.is.null,expiry_at.gt.${nowIso()}`)
    .order("created_at", { ascending: false });
  return {
    data: (data ?? []) as PropertyMapItem[],
    error: error as Error | null,
  };
}

export async function listByOwner(
  supabase: SupabaseClient,
  ownerId: string
): Promise<{ data: Property[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  return { data: (data ?? []) as Property[], error: error as Error | null };
}

/** Public list: only available and non-expired; optional filters and pagination. */
export async function listPublic(
  supabase: SupabaseClient,
  filters: ListPublicFilters = {}
): Promise<{ data: Property[]; error: Error | null }> {
  const {
    type,
    category,
    minPrice,
    maxPrice,
    minBedrooms,
    minBathrooms,
    lat,
    lng,
    radiusKm,
    limit = 50,
    offset = 0,
  } = filters;

  const now = new Date().toISOString();
  let query = supabase
    .from("properties")
    .select("*")
    .eq("status", "available")
    .or(`expiry_at.is.null,expiry_at.gt.${now}`);

  if (type) query = query.eq("type", type);
  if (category) query = query.eq("category", category);
  if (minPrice != null) query = query.gte("price", minPrice);
  if (maxPrice != null) query = query.lte("price", maxPrice);
  if (minBedrooms != null) query = query.gte("bedrooms", minBedrooms);
  if (minBathrooms != null) query = query.gte("bathrooms", minBathrooms);

  if (lat != null && lng != null && radiusKm != null && radiusKm > 0) {
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
    query = query
      .gte("latitude", lat - latDelta)
      .lte("latitude", lat + latDelta)
      .gte("longitude", lng - lngDelta)
      .lte("longitude", lng + lngDelta);
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return { data: (data ?? []) as Property[], error: error as Error | null };
}
