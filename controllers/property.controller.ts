// CONTROLLER — createListing, updateListing, deleteListing, getPropertyDetail, listForSearch, listForMap
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Property, Profile, PropertyImage } from "@/types";
import * as propertyModel from "@/models/property.model";
import * as propertyImageModel from "@/models/property_image.model";
import * as userModel from "@/models/user.model";
import { createListingSchema, updateListingSchema } from "@/lib/validations/property";
import type { CreatePropertyParams } from "@/models/property.model";
import type { ListPublicFilters } from "@/models/property.model";
import type { PropertyMapItem } from "@/models/property.model";

export type PropertyDetail = {
  property: Property;
  images: PropertyImage[];
  owner: Profile | null;
};

export type ListForSearchFilters = ListPublicFilters;

/** Only owner_agent or admin can create. Caller must pass authenticated userId. */
export async function createListing(
  supabase: SupabaseClient,
  userId: string,
  params: Record<string, unknown>
): Promise<{ data: Property | null; error: string | null }> {
  const parsed = createListingSchema.safeParse(params);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Invalid input";
    return { data: null, error: msg };
  }

  const { data: profile } = await userModel.getProfileById(supabase, userId);
  if (!profile || !["owner_agent", "admin"].includes(profile.role)) {
    return { data: null, error: "Only owners or agents can create listings" };
  }

  const { expiry_at, ...rest } = parsed.data;
  const createParams: CreatePropertyParams = {
    ...rest,
    owner_id: userId,
    status: "available",
    ...(expiry_at != null ? { expiry_at } : {}),
  };

  const { data, error } = await propertyModel.create(supabase, createParams);
  return {
    data,
    error: error?.message ?? null,
  };
}

export async function updateListing(
  supabase: SupabaseClient,
  propertyId: string,
  userId: string,
  params: Record<string, unknown>
): Promise<{ data: Property | null; error: string | null }> {
  const parsed = updateListingSchema.safeParse(params);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Invalid input";
    return { data: null, error: msg };
  }

  const { data: property } = await propertyModel.getById(supabase, propertyId);
  if (!property) return { data: null, error: "Property not found" };
  if (property.owner_id !== userId) {
    const { data: profile } = await userModel.getProfileById(supabase, userId);
    if (!profile || profile.role !== "admin") {
      return { data: null, error: "Not allowed to update this listing" };
    }
  }

  const updateData: propertyModel.UpdatePropertyData = { ...parsed.data };
  const { data, error } = await propertyModel.update(
    supabase,
    propertyId,
    updateData
  );
  return { data, error: error?.message ?? null };
}

export async function deleteListing(
  supabase: SupabaseClient,
  propertyId: string,
  userId: string
): Promise<{ error: string | null }> {
  const { data: property } = await propertyModel.getById(supabase, propertyId);
  if (!property) return { error: "Property not found" };
  if (property.owner_id !== userId) {
    const { data: profile } = await userModel.getProfileById(supabase, userId);
    if (!profile || profile.role !== "admin") {
      return { error: "Not allowed to delete this listing" };
    }
  }
  const { error } = await propertyModel.deleteById(supabase, propertyId);
  return { error: error?.message ?? null };
}

export async function getPropertyDetail(
  supabase: SupabaseClient,
  propertyId: string
): Promise<{ data: PropertyDetail | null; error: string | null }> {
  const { data: property, error: propError } = await propertyModel.getById(
    supabase,
    propertyId
  );
  if (propError || !property) {
    return { data: null, error: propError?.message ?? "Property not found" };
  }

  const [imagesResult, ownerResult] = await Promise.all([
    propertyImageModel.listByPropertyId(supabase, propertyId),
    userModel.getProfileById(supabase, property.owner_id),
  ]);

  return {
    data: {
      property,
      images: imagesResult.data,
      owner: ownerResult.data ?? null,
    },
    error: imagesResult.error?.message ?? ownerResult.error?.message ?? null,
  };
}

export async function listForSearch(
  supabase: SupabaseClient,
  filters: ListForSearchFilters
): Promise<{ data: Property[]; error: string | null }> {
  const { data, error } = await propertyModel.listPublic(supabase, filters);
  return { data, error: error?.message ?? null };
}

export async function listForMap(
  supabase: SupabaseClient
): Promise<{ data: PropertyMapItem[]; error: string | null }> {
  const { data, error } = await propertyModel.listForMap(supabase);
  return { data, error: error?.message ?? null };
}

export async function listByOwner(
  supabase: SupabaseClient,
  ownerId: string
): Promise<{ data: Property[]; error: string | null }> {
  const { data, error } = await propertyModel.listByOwner(supabase, ownerId);
  return { data, error: (error as Error)?.message ?? null };
}
