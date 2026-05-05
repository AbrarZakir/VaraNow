"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getMessagesAction, sendMessageAction, markAsReadAction, getUnreadCountAction } from "@/app/actions/chat";
import type { Message } from "@/types";
import { useChatStore } from "@/store/useChatStore";

interface ChatBoxProps {
  conversationId: string;
  currentUserId: string;
  className?: string;
}

export default function ChatBox({ conversationId, currentUserId, className = "" }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const setUnreadCount = useChatStore((state) => state.setUnreadCount);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initial load
  useEffect(() => {
    let isMounted = true;
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await getMessagesAction(conversationId);
      if (isMounted) {
        if (fetchError) {
          setError(fetchError);
        } else if (data) {
          setMessages(data);
          setTimeout(scrollToBottom, 100);
        }
      }
      setLoading(false);
      // Mark as read when opened
      await markAsReadAction(conversationId);
      const { data: count } = await getUnreadCountAction();
      if (typeof count === "number") setUnreadCount(count);
    };

    fetchMessages();

    return () => { isMounted = false; };
  }, [conversationId, setUnreadCount]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const incomingMessage = payload.new as Message;
          setMessages((prev) => {
            // Prevent duplicates if we already added it optimistically
            if (prev.some((m) => m.id === incomingMessage.id)) return prev;
            return [...prev, incomingMessage];
          });
          
          if (incomingMessage.sender_id !== currentUserId) {
            markAsReadAction(conversationId);
            getUnreadCountAction().then(({ data }) => {
              if (typeof data === "number") setUnreadCount(data);
            });
          }
          setTimeout(scrollToBottom, 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId, supabase]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const content = newMessage.trim();
    setNewMessage(""); // Optimistic clear

    // Optimistically add message
    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        conversation_id: conversationId,
        sender_id: currentUserId,
        content,
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ]);
    setTimeout(scrollToBottom, 100);

    const { data, error } = await sendMessageAction(conversationId, content);
    
    if (error || !data) {
      // Revert optimistic addition if failed
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setNewMessage(content); // Restore input
      console.error("Failed to send message:", error);
    } else {
      // Replace temp message with real one
      setMessages((prev) => prev.map((m) => m.id === tempId ? data : m));
    }
    
    setSending(false);
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-gray-400">Loading messages...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-full text-center p-4">
            <span className="text-red-500 mb-2">⚠️ {error}</span>
            <button 
              onClick={() => window.location.reload()} 
              className="text-xs text-blue-600 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-gray-400">No messages yet. Start the conversation!</span>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <span
                    className={`text-[10px] mt-1 block ${
                      isMe ? "text-blue-200 text-right" : "text-gray-400 text-left"
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 p-3 bg-gray-50 rounded-b-xl">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition flex items-center justify-center w-10 h-10"
          >
             <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
