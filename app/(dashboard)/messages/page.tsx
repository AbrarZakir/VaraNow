"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ConversationList from "@/components/chat/ConversationList";
import ChatBox from "@/components/chat/ChatBox";

export default function MessagesPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    fetchUser();
  }, [supabase]);

  if (!currentUserId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] max-w-6xl mx-auto mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full divide-x divide-gray-200">
        
        {/* Left Sidebar: Conversation List */}
        <div className={`col-span-1 h-full overflow-hidden flex flex-col ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Inbox</h1>
          </div>
          <div className="flex-1 overflow-hidden">
            <ConversationList 
              currentUserId={currentUserId} 
              activeId={activeConversationId} 
              onSelect={(id) => setActiveConversationId(id)} 
            />
          </div>
        </div>

        {/* Right Content: Active Chat */}
        <div className={`col-span-1 md:col-span-2 h-full flex flex-col bg-gray-50 ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
          {activeConversationId ? (
            <>
              {/* Mobile Back Button */}
              <div className="md:hidden p-3 border-b border-gray-200 bg-white flex items-center">
                <button 
                  onClick={() => setActiveConversationId(null)}
                  className="flex items-center text-blue-600 font-medium"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Inbox
                </button>
              </div>
              <ChatBox 
                conversationId={activeConversationId} 
                currentUserId={currentUserId} 
                className="flex-1"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-gray-600 mb-2">Your Messages</h2>
              <p className="text-sm max-w-xs">
                Select a conversation from the sidebar to view your chat history and continue the conversation.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
