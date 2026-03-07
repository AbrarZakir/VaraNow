"use server";

import { createClient } from "@/lib/supabase/server";
import * as notificationController from "@/controllers/notification.controller";

export async function getNotificationsAction(options?: {
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: "Not authenticated" };
  return notificationController.getForUser(supabase, user.id, options);
}
