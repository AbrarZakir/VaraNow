// MODEL — create, listByUserId, markRead, markAllRead
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Notification } from "@/types";

export async function create(
  supabase: SupabaseClient,
  params: { user_id: string; type: string; title: string; body?: string }
): Promise<{ data: Notification | null; error: Error | null }> {
  const { user_id, type, title, body = "" } = params;
  const { data, error } = await supabase
    .from("notifications")
    .insert({ user_id, type, title, body })
    .select()
    .single();
  return { data: data as Notification | null, error: error as Error | null };
}

export async function listByUserId(
  supabase: SupabaseClient,
  userId: string,
  options?: { unreadOnly?: boolean; limit?: number; offset?: number }
): Promise<{ data: Notification[]; error: Error | null }> {
  const { unreadOnly = false, limit = 50, offset = 0 } = options ?? {};
  let query = supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (unreadOnly) query = query.is("read_at", null);

  const { data, error } = await query.range(offset, offset + limit - 1);
  return { data: (data ?? []) as Notification[], error: error as Error | null };
}

export async function markRead(
  supabase: SupabaseClient,
  notificationId: string,
  userId: string
): Promise<{ data: Notification | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", userId)
    .select()
    .single();
  return { data: data as Notification | null, error: error as Error | null };
}

export async function markAllRead(
  supabase: SupabaseClient,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);
  return { error: error as Error | null };
}
