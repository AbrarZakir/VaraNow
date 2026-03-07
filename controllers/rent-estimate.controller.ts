// CONTROLLER — estimateRent(area, lat, lng) → property.model aggregate recent rents in area
import type { SupabaseClient } from "@supabase/supabase-js";
import * as propertyModel from "@/models/property.model";

export type RentEstimateResult = {
  average: number;
  min: number;
  max: number;
  count: number;
};

const DEFAULT_RADIUS_KM = 5;
const MAX_SAMPLES = 100;

export async function estimateRent(
  supabase: SupabaseClient,
  params: { area_sqft: number; latitude: number; longitude: number }
): Promise<{ data: RentEstimateResult | null; error: string | null }> {
  const { area_sqft, latitude, longitude } = params;

  const { data: properties, error } = await propertyModel.listPublic(
    supabase,
    {
      type: "rent",
      lat: latitude,
      lng: longitude,
      radiusKm: DEFAULT_RADIUS_KM,
      limit: MAX_SAMPLES,
    }
  );

  if (error) return { data: null, error: (error as Error).message };
  if (!properties.length) {
    return {
      data: { average: 0, min: 0, max: 0, count: 0 },
      error: null,
    };
  }

  const prices = properties.map((p) => Number(p.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const sum = prices.reduce((a, b) => a + b, 0);
  const average = sum / prices.length;

  return {
    data: { average, min, max, count: prices.length },
    error: null,
  };
}
