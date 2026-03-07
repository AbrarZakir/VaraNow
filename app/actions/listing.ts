"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import * as propertyController from "@/controllers/property.controller";

export type CreateListingState = { error?: string };

export async function createListingAction(
  _prev: CreateListingState,
  formData: FormData
): Promise<CreateListingState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const params = {
    title: (formData.get("title") as string) ?? "",
    description: (formData.get("description") as string) ?? "",
    type: (formData.get("type") as "buy" | "rent") ?? "rent",
    category: (formData.get("category") as "apartment" | "house" | "land") ?? "apartment",
    price: Number(formData.get("price")) || 0,
    latitude: Number(formData.get("latitude")) || 0,
    longitude: Number(formData.get("longitude")) || 0,
    address: (formData.get("address") as string) ?? "",
    area_sqft: Number(formData.get("area_sqft")) || 0,
    bedrooms: Number(formData.get("bedrooms")) || 0,
    bathrooms: Number(formData.get("bathrooms")) || 0,
  };

  const { data, error } = await propertyController.createListing(
    supabase,
    user.id,
    params
  );
  if (error) return { error };
  if (data) redirect(`/property/${data.id}`);
  return { error: "Failed to create listing" };
}
