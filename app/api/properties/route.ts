import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as searchController from "@/controllers/search.controller";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const filters = {
    type: (searchParams.get("type") as "buy" | "rent" | undefined) ?? undefined,
    category: (searchParams.get("category") as "apartment" | "house" | "land" | undefined) ?? undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    minBedrooms: searchParams.get("minBedrooms")
      ? Number(searchParams.get("minBedrooms"))
      : undefined,
    minBathrooms: searchParams.get("minBathrooms")
      ? Number(searchParams.get("minBathrooms"))
      : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 50,
    offset: searchParams.get("offset") ? Number(searchParams.get("offset")) : 0,
  };
  const { data, error } = await searchController.search(supabase, filters);
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ data });
}
