import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as rentEstimateController from "@/controllers/rent-estimate.controller";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const area_sqft = Number(searchParams.get("area_sqft"));
  const latitude = Number(searchParams.get("latitude"));
  const longitude = Number(searchParams.get("longitude"));

  if (!area_sqft || !latitude || !longitude) {
    return NextResponse.json(
      { error: "area_sqft, latitude, and longitude are required" },
      { status: 400 }
    );
  }

  const { data, error } = await rentEstimateController.estimateRent(supabase, {
    area_sqft,
    latitude,
    longitude,
  });
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ data });
}
