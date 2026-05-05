"use client";

import { useChatStore } from "@/store/useChatStore";

export default function ChatNotification() {
  const { unreadCount, toggleInbox } = useChatStore();

  return (
    <button
      onClick={toggleInbox}
      className="relative flex items-center justify-center rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
      title="Messages"
    >
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}
