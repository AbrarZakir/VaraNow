"use server";

import { createClient } from "@/lib/supabase/server";
import * as bookmarkController from "@/controllers/bookmark.controller";

export async function addBookmarkAction(propertyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  return bookmarkController.addBookmark(supabase, user.id, propertyId);
}

export async function removeBookmarkAction(propertyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  return bookmarkController.removeBookmark(supabase, user.id, propertyId);
}

export async function getSavedListAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: "Not authenticated" };
  return bookmarkController.getSavedList(supabase, user.id);
}

export async function isBookmarkedAction(propertyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: false, error: null };
  return bookmarkController.isBookmarked(supabase, user.id, propertyId);
}
