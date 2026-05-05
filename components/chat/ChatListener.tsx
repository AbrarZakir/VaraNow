"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useChatStore } from "@/store/useChatStore";
import { getUnreadCountAction } from "@/app/actions/chat";

interface ChatListenerProps {
  userId: string | undefined;
}

export default function ChatListener({ userId }: ChatListenerProps) {
  const { incrementUnread, setUnreadCount, activeConversationId, isOpen } = useChatStore();
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    // Initial fetch of unread count
    const fetchUnread = async () => {
      const { data } = await getUnreadCountAction();
      if (typeof data === "number") {
        setUnreadCount(data);
      }
    };
    fetchUnread();

    // Subscribe to ALL messages in conversations involving the user
    // We can't filter by conversation_id here easily without knowing all IDs,
    // so we listen to all messages and check if they belong to the user's conversations.
    // Or better: subscribe to 'messages' and check if the user is a participant in the conversation.
    
    const channel = supabase
      .channel("global_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMessage = payload.new as any;
          
          // Ignore if user is the sender
          if (newMessage.sender_id === userId) return;

          // Check if this message is for a conversation the user is part of
          const { data: conv } = await supabase
            .from("conversations")
            .select("user1_id, user2_id")
            .eq("id", newMessage.conversation_id)
            .single();

          if (conv && (conv.user1_id === userId || conv.user2_id === userId)) {
            // Increment unread count ONLY if the chat is not open to this conversation
            if (!(isOpen && activeConversationId === newMessage.conversation_id)) {
              incrementUnread();
              
              // Optional: Browser notification or toast
              if ("Notification" in window && Notification.permission === "granted") {
                new Notification("New message on VaraNow", {
                  body: newMessage.content,
                  icon: "/favicon.ico",
                });
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase, incrementUnread, setUnreadCount, activeConversationId, isOpen]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return null;
}
