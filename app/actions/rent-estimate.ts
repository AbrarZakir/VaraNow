"use server";

import { createClient } from "@/lib/supabase/server";
import * as rentEstimateController from "@/controllers/rent-estimate.controller";

export async function getRentEstimateAction(params: {
  area_sqft: number;
  latitude: number;
  longitude: number;
}) {
  const supabase = await createClient();
  return rentEstimateController.estimateRent(supabase, params);
}
