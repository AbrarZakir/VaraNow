"use client";

import { useEffect, useState } from "react";
import { getUserConversationsAction } from "@/app/actions/chat";
import type { ConversationWithDetails } from "@/models/chat.model";
import { useChatStore } from "@/store/useChatStore";

interface ConversationListProps {
  currentUserId: string;
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({ currentUserId, activeId, onSelect }: ConversationListProps) {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const isInboxOpen = useChatStore((state) => state.isInboxOpen);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      const { data, error } = await getUserConversationsAction();
      if (data) setConversations(data);
      if (error) console.error("Failed to fetch conversations", error);
      setLoading(false);
    };

    if (isInboxOpen || !activeId) {
      fetchConversations();
    }
  }, [isInboxOpen, activeId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full p-4 gap-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-gray-500 font-medium">Loading messages...</span>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <p className="text-gray-900 font-semibold mb-1">No messages yet</p>
        <p className="text-sm text-gray-500">Inquiries about properties will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto divide-y divide-gray-100">
      {conversations.map((conv) => {
        const isActive = conv.id === activeId;
        const otherUser = conv.other_user;
        const lastMessage = conv.last_message;
        const isUnread = lastMessage && !lastMessage.is_read && lastMessage.sender_id !== currentUserId;

        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`flex items-start gap-4 w-full p-4 text-left transition hover:bg-gray-50 ${
              isActive ? "bg-blue-50 border-l-4 border-blue-600" : "border-l-4 border-transparent"
            }`}
          >
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700 shadow-sm flex-shrink-0">
                {otherUser?.avatar_url ? (
                  <img src={otherUser.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  otherUser?.full_name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              {isUnread && (
                <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className={`text-sm font-semibold truncate ${isUnread ? "text-gray-900" : "text-gray-700"}`}>
                  {otherUser?.full_name || 'Unknown User'}
                </h3>
                {lastMessage && (
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                    {new Date(lastMessage.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
              
              <p className="text-xs text-blue-600 font-medium truncate mb-1">
                {conv.property?.title}
              </p>
              
              <p className={`text-sm truncate ${isUnread ? "font-semibold text-gray-900" : "text-gray-500"}`}>
                {lastMessage ? (
                  <span>
                    {lastMessage.sender_id === currentUserId && "You: "}
                    {lastMessage.content}
                  </span>
                ) : (
                  "No messages yet"
                )}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
