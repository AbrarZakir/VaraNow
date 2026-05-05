"use client";

import { useState } from "react";
import { startOrGetConversationAction } from "@/app/actions/chat";
import { useChatStore } from "@/store/useChatStore";

interface ChatButtonProps {
  propertyId: string;
  isAuthenticated: boolean;
  className?: string;
}

export default function ChatButton({ propertyId, isAuthenticated, className = "" }: ChatButtonProps) {
  const [loading, setLoading] = useState(false);
  const openChat = useChatStore((state) => state.openChat);

  const handleChatClick = async () => {
    if (!isAuthenticated) {
      alert("Please log in to contact the owner.");
      return;
    }

    setLoading(true);
    const { data, error } = await startOrGetConversationAction(propertyId);
    setLoading(false);

    if (error) {
      alert(error);
      return;
    }

    if (data) {
      openChat(data.id, propertyId);
    }
  };

  return (
    <button
      onClick={handleChatClick}
      disabled={loading}
      className={`flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 disabled:bg-blue-400 disabled:cursor-not-allowed ${className}`}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      {loading ? "Opening Chat..." : "Message Owner"}
    </button>
  );
}
