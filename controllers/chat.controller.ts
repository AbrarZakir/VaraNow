import type { SupabaseClient } from "@supabase/supabase-js";
import * as chatModel from "@/models/chat.model";
import { getById as getPropertyById } from "@/models/property.model";

export async function startOrGetConversation(
  supabase: SupabaseClient,
  userId: string,
  propertyId: string
) {
  // Check if property exists and get owner
  const { data: property, error: propError } = await getPropertyById(supabase, propertyId);
  if (propError || !property) {
    return { data: null, error: "Property not found" };
  }

  // Prevent user from chatting with themselves
  if (property.owner_id === userId) {
    return { data: null, error: "Cannot start a conversation with yourself" };
  }

  // Check if conversation already exists
  const { data: existingConv } = await chatModel.getConversation(
    supabase,
    propertyId,
    userId,
    property.owner_id
  );

  if (existingConv) {
    return { data: existingConv, error: null };
  }

  // Create new conversation
  const { data: newConv, error: createError } = await chatModel.createConversation(
    supabase,
    propertyId,
    userId,
    property.owner_id
  );

  return { data: newConv, error: createError?.message || null };
}

export async function getUserConversations(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await chatModel.getUserConversations(supabase, userId);
  return { data, error: error?.message || null };
}

export async function getMessages(
  supabase: SupabaseClient,
  userId: string,
  conversationId: string
) {
  // First, verify the user is part of the conversation
  const { data: conv, error: convError } = await chatModel.getConversationById(supabase, conversationId);
  
  if (convError || !conv) {
    return { data: null, error: "Conversation not found" };
  }

  if (conv.user1_id !== userId && conv.user2_id !== userId) {
    return { data: null, error: "Unauthorized access to conversation" };
  }

  const { data, error } = await chatModel.getMessages(supabase, conversationId);
  return { data, error: error?.message || null };
}

export async function sendMessage(
  supabase: SupabaseClient,
  userId: string,
  conversationId: string,
  content: string
) {
  if (!content.trim()) {
    return { data: null, error: "Message cannot be empty" };
  }

  // First, verify the user is part of the conversation
  const { data: conv, error: convError } = await chatModel.getConversationById(supabase, conversationId);
  
  if (convError || !conv) {
    return { data: null, error: "Conversation not found" };
  }

  if (conv.user1_id !== userId && conv.user2_id !== userId) {
    return { data: null, error: "Unauthorized access to conversation" };
  }

  const { data, error } = await chatModel.sendMessage(supabase, conversationId, userId, content);
  return { data, error: error?.message || null };
}

export async function markAsRead(
  supabase: SupabaseClient,
  userId: string,
  conversationId: string
) {
  const { error } = await chatModel.markMessagesAsRead(supabase, conversationId, userId);
  return { error: error?.message || null };
}
