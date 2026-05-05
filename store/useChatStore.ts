import { create } from 'zustand';

interface ChatState {
  isOpen: boolean;
  isInboxOpen: boolean;
  activeConversationId: string | null;
  propertyIdContext: string | null;
  unreadCount: number;
  openChat: (conversationId: string | null, propertyId?: string) => void;
  closeChat: () => void;
  toggleInbox: () => void;
  setInboxOpen: (open: boolean) => void;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  isInboxOpen: false,
  activeConversationId: null,
  propertyIdContext: null,
  unreadCount: 0,
  
  openChat: (conversationId, propertyId) => set({ 
    isOpen: true, 
    isInboxOpen: false, // Close inbox list when a specific chat is opened
    activeConversationId: conversationId,
    ...(propertyId ? { propertyIdContext: propertyId } : {})
  }),
  
  closeChat: () => set({ 
    isOpen: false, 
    activeConversationId: null, 
    propertyIdContext: null 
  }),

  toggleInbox: () => set((state) => ({ isInboxOpen: !state.isInboxOpen, isOpen: false })),
  setInboxOpen: (open) => set({ isInboxOpen: open, isOpen: false }),
  
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
}));
