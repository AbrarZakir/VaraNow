import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as searchController from "@/controllers/search.controller";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minBedrooms = searchParams.get("minBedrooms");
  const minBathrooms = searchParams.get("minBathrooms");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radiusKm = searchParams.get("radiusKm");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  const filters = {
    ...(type && { type: type as "buy" | "rent" }),
    ...(category && { category: category as "apartment" | "house" | "land" }),
    ...(minPrice != null && { minPrice: Number(minPrice) }),
    ...(maxPrice != null && { maxPrice: Number(maxPrice) }),
    ...(minBedrooms != null && { minBedrooms: Number(minBedrooms) }),
    ...(minBathrooms != null && { minBathrooms: Number(minBathrooms) }),
    ...(lat != null && lng != null && { lat: Number(lat), lng: Number(lng) }),
    ...(radiusKm != null && { radiusKm: Number(radiusKm) }),
    ...(limit != null && { limit: Number(limit) }),
    ...(offset != null && { offset: Number(offset) }),
  };

  const { data, error } = await searchController.search(supabase, filters);
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ data });
}
