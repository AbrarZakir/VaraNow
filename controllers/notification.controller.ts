// CONTROLLER — getForUser, markRead, markAllRead
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Notification } from "@/types";
import * as notificationModel from "@/models/notification.model";

export async function getForUser(
  supabase: SupabaseClient,
  userId: string,
  options?: { unreadOnly?: boolean; limit?: number; offset?: number }
): Promise<{ data: Notification[]; error: string | null }> {
  const { data, error } = await notificationModel.listByUserId(
    supabase,
    userId,
    options
  );
  return { data, error: (error as Error)?.message ?? null };
}

export async function markRead(
  supabase: SupabaseClient,
  notificationId: string,
  userId: string
): Promise<{ data: Notification | null; error: string | null }> {
  const { data, error } = await notificationModel.markRead(
    supabase,
    notificationId,
    userId
  );
  return { data, error: (error as Error)?.message ?? null };
}

export async function markAllRead(
  supabase: SupabaseClient,
  userId: string
): Promise<{ error: string | null }> {
  const { error } = await notificationModel.markAllRead(supabase, userId);
  return { error: (error as Error)?.message ?? null };
}
