"use server";

import { createClient } from "@/lib/supabase/server";
import * as chatController from "@/controllers/chat.controller";
import * as chatModel from "@/models/chat.model";

export async function startOrGetConversationAction(propertyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { data: null, error: "Not authenticated" };

  return chatController.startOrGetConversation(supabase, user.id, propertyId);
}

export async function getUserConversationsAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { data: null, error: "Not authenticated" };

  return chatController.getUserConversations(supabase, user.id);
}

export async function getMessagesAction(conversationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { data: null, error: "Not authenticated" };

  return chatController.getMessages(supabase, user.id, conversationId);
}

export async function sendMessageAction(conversationId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { data: null, error: "Not authenticated" };

  return chatController.sendMessage(supabase, user.id, conversationId, content);
}

export async function markAsReadAction(conversationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Not authenticated" };

  return chatController.markAsRead(supabase, user.id, conversationId);
}

export async function getUnreadCountAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { data: 0, error: "Not authenticated" };

  const { count, error } = await chatModel.getUnreadCount(supabase, user.id);
  return { data: count, error: error?.message || null };
}
