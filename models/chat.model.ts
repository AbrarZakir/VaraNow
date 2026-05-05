import type { SupabaseClient } from "@supabase/supabase-js";
import type { Conversation, Message, Profile } from "@/types";

export interface ConversationWithDetails extends Conversation {
  property: { id: string; title: string };
  other_user: Profile;
  last_message?: Message;
}

export async function createConversation(
  supabase: SupabaseClient,
  propertyId: string,
  user1Id: string,
  user2Id: string
): Promise<{ data: Conversation | null; error: any }> {
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      property_id: propertyId,
      user1_id: user1Id,
      user2_id: user2Id,
    })
    .select()
    .single();

  return { data, error };
}

export async function getConversation(
  supabase: SupabaseClient,
  propertyId: string,
  user1Id: string,
  user2Id: string
): Promise<{ data: Conversation | null; error: any }> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("property_id", propertyId)
    .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
    .maybeSingle();

  return { data, error };
}

export async function getConversationById(
  supabase: SupabaseClient,
  conversationId: string
): Promise<{ data: Conversation | null; error: any }> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .maybeSingle();

  return { data, error };
}

export async function getUserConversations(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: ConversationWithDetails[]; error: any }> {
  // Step 1: Fetch raw conversations
  const { data: conversations, error: convError } = await supabase
    .from("conversations")
    .select("*")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (convError || !conversations) {
    return { data: [], error: convError };
  }

  if (conversations.length === 0) {
    return { data: [], error: null };
  }

  // Step 2: Fetch all related data manually to avoid complex join issues
  const convIds = conversations.map(c => c.id);
  const propertyIds = Array.from(new Set(conversations.map(c => c.property_id))).filter(Boolean);
  const userIds = Array.from(new Set([
    ...conversations.map(c => c.user1_id),
    ...conversations.map(c => c.user2_id)
  ])).filter(Boolean);

  const [
    propRes,
    profRes,
    msgRes
  ] = await Promise.all([
    supabase.from("properties").select("id, title").in("id", propertyIds),
    supabase.from("profiles").select("*").in("id", userIds),
    supabase.from("messages").select("*").in("conversation_id", convIds).order("created_at", { ascending: false })
  ]);

  const properties = propRes.data;
  const profiles = profRes.data;
  const messages = msgRes.data;

  const formatted: ConversationWithDetails[] = conversations.map((conv) => {
    const property = properties?.find(p => p.id === conv.property_id);
    const user1 = profiles?.find(p => p.id === conv.user1_id);
    const user2 = profiles?.find(p => p.id === conv.user2_id);
    const convMessages = messages?.filter(m => m.conversation_id === conv.id);
    const lastMessage = convMessages?.[0];

    // Determine the other user (the one who is NOT the current requester)
    const currentRequesterId = userId?.toLowerCase().trim();
    const isUser1 = conv.user1_id?.toLowerCase().trim() === currentRequesterId;
    const otherUser = isUser1 ? user2 : user1;

    return {
      id: conv.id,
      property_id: conv.property_id,
      user1_id: conv.user1_id,
      user2_id: conv.user2_id,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      property: property || { id: conv.property_id, title: "Property" },
      other_user: (otherUser || { id: "unknown", full_name: "Unknown User", role: "seeker" }) as any,
      last_message: lastMessage,
    };
  });

  return { data: formatted, error: null };
}

export async function getMessages(
  supabase: SupabaseClient,
  conversationId: string
): Promise<{ data: Message[]; error: any }> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return { data: data || [], error };
}

export async function sendMessage(
  supabase: SupabaseClient,
  conversationId: string,
  senderId: string,
  content: string
): Promise<{ data: Message | null; error: any }> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    })
    .select()
    .single();

  if (!error) {
    // Update conversation timestamp
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);
  }

  return { data, error };
}

export async function markMessagesAsRead(
  supabase: SupabaseClient,
  conversationId: string,
  userId: string
): Promise<{ error: any }> {
  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .eq("is_read", false);

  return { error };
}

export async function getUnreadCount(
  supabase: SupabaseClient,
  userId: string
): Promise<{ count: number; error: any }> {
  // Get all conversation IDs the user is part of
  const { data: convs, error: convError } = await supabase
    .from("conversations")
    .select("id")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

  if (convError || !convs) {
    return { count: 0, error: convError };
  }

  const convIds = convs.map((c) => c.id);
  if (convIds.length === 0) {
    return { count: 0, error: null };
  }

  // Count unread messages in those conversations where the user is NOT the sender
  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .in("conversation_id", convIds)
    .neq("sender_id", userId)
    .eq("is_read", false);

  return { count: count || 0, error };
}
