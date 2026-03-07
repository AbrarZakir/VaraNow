// CONTROLLER — addBookmark, removeBookmark, getSavedList (bookmark.model + property.model for full listing data)
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Property } from "@/types";
import * as bookmarkModel from "@/models/bookmark.model";
import * as propertyModel from "@/models/property.model";

export type SavedListing = { property: Property; bookmarkId: string };

export async function addBookmark(
  supabase: SupabaseClient,
  userId: string,
  propertyId: string
): Promise<{ error: string | null }> {
  const { data: property } = await propertyModel.getById(supabase, propertyId);
  if (!property) return { error: "Property not found" };

  const { error } = await bookmarkModel.add(supabase, userId, propertyId);
  if (error) {
    if ((error as { code?: string }).code === "23505") {
      return { error: null }; // already bookmarked
    }
    return { error: (error as Error).message };
  }
  return { error: null };
}

export async function removeBookmark(
  supabase: SupabaseClient,
  userId: string,
  propertyId: string
): Promise<{ error: string | null }> {
  const { error } = await bookmarkModel.remove(supabase, userId, propertyId);
  return { error: (error as Error)?.message ?? null };
}

export async function getSavedList(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: SavedListing[]; error: string | null }> {
  const { data: bookmarks, error: bError } = await bookmarkModel.listByUserId(
    supabase,
    userId
  );
  if (bError) return { data: [], error: (bError as Error).message };

  const listings: SavedListing[] = [];
  for (const b of bookmarks) {
    const { data: property } = await propertyModel.getById(
      supabase,
      b.property_id
    );
    if (property) listings.push({ property, bookmarkId: b.id });
  }
  return { data: listings, error: null };
}

export async function isBookmarked(
  supabase: SupabaseClient,
  userId: string,
  propertyId: string
): Promise<{ data: boolean; error: string | null }> {
  const { data, error } = await bookmarkModel.isBookmarked(
    supabase,
    userId,
    propertyId
  );
  return {
    data: data ?? false,
    error: (error as Error)?.message ?? null,
  };
}
