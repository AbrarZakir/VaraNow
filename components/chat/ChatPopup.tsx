"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import ChatBox from "./ChatBox";
import ConversationList from "./ConversationList";
import { getUserConversationsAction } from "@/app/actions/chat";
import type { ConversationWithDetails } from "@/models/chat.model";

interface ChatPopupProps {
  currentUserId: string | undefined;
}

export default function ChatPopup({ currentUserId }: ChatPopupProps) {
  const { 
    isOpen, 
    isInboxOpen, 
    activeConversationId, 
    closeChat, 
    toggleInbox,
    setInboxOpen,
    openChat
  } = useChatStore();

  const [activeConv, setActiveConv] = useState<ConversationWithDetails | null>(null);

  useEffect(() => {
    if (isOpen && activeConversationId) {
      getUserConversationsAction().then(({ data }) => {
        const found = data?.find(c => c.id === activeConversationId);
        if (found) setActiveConv(found);
      });
    } else {
      setActiveConv(null);
    }
  }, [isOpen, activeConversationId]);

  if ((!isOpen && !isInboxOpen) || !currentUserId) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
        <div className="flex items-center gap-2 truncate pr-4">
           {isOpen ? (
             <button onClick={() => setInboxOpen(true)} className="mr-1 hover:bg-blue-700 p-1 rounded-full flex-shrink-0">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
             </button>
           ) : (
             <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
             </svg>
           )}
          <span className="font-semibold tracking-wide truncate">
            {isOpen ? (activeConv?.other_user?.full_name || "Chat") : "Messages"}
          </span>
        </div>
        <button
          onClick={isOpen ? closeChat : toggleInbox}
          className="rounded-full p-1 hover:bg-blue-700 transition"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden relative bg-gray-50">
        {isOpen && activeConversationId ? (
          <ChatBox 
            conversationId={activeConversationId} 
            currentUserId={currentUserId} 
          />
        ) : (
          <ConversationList 
            currentUserId={currentUserId}
            activeId={activeConversationId}
            onSelect={(id) => openChat(id)}
          />
        )}
      </div>
    </div>
  );
}
