/**
 * Mock Messages/Conversations Data for SummerHub Messaging
 * Contains 5 conversations to populate messaging when backend is unavailable
 */

export interface Message {
  id: number;
  senderId: number;
  senderName: string;
  recipientId: number;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: number;
  participantId: number;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const MOCK_MESSAGES_DATA: Message[] = [
  // Conversation 1 - Alice Johnson
  {
    id: 1,
    senderId: 0,
    senderName: "You",
    recipientId: 1,
    content: "Hi Alice! Are you still interested in the AI study group?",
    timestamp: "2026-06-24T15:00:00Z",
    isRead: true
  },
  {
    id: 2,
    senderId: 1,
    senderName: "Alice Johnson",
    recipientId: 0,
    content: "Absolutely! I'd love to join. When does it start?",
    timestamp: "2026-06-24T15:05:00Z",
    isRead: true
  },
  {
    id: 3,
    senderId: 0,
    senderName: "You",
    recipientId: 1,
    content: "Great! See you at the study session tomorrow at 5 PM in the library.",
    timestamp: "2026-06-24T15:30:00Z",
    isRead: false
  },

  // Conversation 2 - Bob Smith
  {
    id: 4,
    senderId: 2,
    senderName: "Bob Smith",
    recipientId: 0,
    content: "Hey! Thanks for the internship tips! Really helpful.",
    timestamp: "2026-06-24T14:15:00Z",
    isRead: true
  },
  {
    id: 5,
    senderId: 0,
    senderName: "You",
    recipientId: 2,
    content: "No problem! Let me know if you need anything else for your applications.",
    timestamp: "2026-06-24T14:20:00Z",
    isRead: true
  },

  // Conversation 3 - Grace Lee
  {
    id: 6,
    senderId: 7,
    senderName: "Grace Lee",
    recipientId: 0,
    content: "I saw your message. Sure, I can help you with that calculus problem.",
    timestamp: "2026-06-24T13:45:00Z",
    isRead: false
  },
  {
    id: 7,
    senderId: 0,
    senderName: "You",
    recipientId: 7,
    content: "That would be amazing! Are you free this weekend?",
    timestamp: "2026-06-24T13:50:00Z",
    isRead: false
  },

  // Conversation 4 - David Brown
  {
    id: 8,
    senderId: 4,
    senderName: "David Brown",
    recipientId: 0,
    content: "Have you registered your team for the robotics competition yet?",
    timestamp: "2026-06-24T12:20:00Z",
    isRead: true
  },
  {
    id: 9,
    senderId: 0,
    senderName: "You",
    recipientId: 4,
    content: "We're working on it! Should have it done by end of week.",
    timestamp: "2026-06-24T12:25:00Z",
    isRead: true
  },

  // Conversation 5 - Jack Martinez
  {
    id: 10,
    senderId: 10,
    senderName: "Jack Martinez",
    recipientId: 0,
    content: "I'd love to learn guitar! When's your next free lesson?",
    timestamp: "2026-06-24T11:00:00Z",
    isRead: false
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    participantId: 1,
    participantName: "Alice Johnson",
    participantAvatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Great! See you at the study session tomorrow at 5 PM in the library.",
    lastMessageTime: "2026-06-24T15:30:00Z",
    unreadCount: 1,
    messages: MOCK_MESSAGES_DATA.filter((m) => m.recipientId === 1 || m.senderId === 1)
  },
  {
    id: 2,
    participantId: 2,
    participantName: "Bob Smith",
    participantAvatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "No problem! Let me know if you need anything else for your applications.",
    lastMessageTime: "2026-06-24T14:20:00Z",
    unreadCount: 0,
    messages: MOCK_MESSAGES_DATA.filter((m) => m.recipientId === 2 || m.senderId === 2)
  },
  {
    id: 3,
    participantId: 7,
    participantName: "Grace Lee",
    participantAvatar: "https://i.pravatar.cc/150?img=7",
    lastMessage: "That would be amazing! Are you free this weekend?",
    lastMessageTime: "2026-06-24T13:50:00Z",
    unreadCount: 2,
    messages: MOCK_MESSAGES_DATA.filter((m) => m.recipientId === 7 || m.senderId === 7)
  },
  {
    id: 4,
    participantId: 4,
    participantName: "David Brown",
    participantAvatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "We're working on it! Should have it done by end of week.",
    lastMessageTime: "2026-06-24T12:25:00Z",
    unreadCount: 0,
    messages: MOCK_MESSAGES_DATA.filter((m) => m.recipientId === 4 || m.senderId === 4)
  },
  {
    id: 5,
    participantId: 10,
    participantName: "Jack Martinez",
    participantAvatar: "https://i.pravatar.cc/150?img=10",
    lastMessage: "I'd love to learn guitar! When's your next free lesson?",
    lastMessageTime: "2026-06-24T11:00:00Z",
    unreadCount: 1,
    messages: MOCK_MESSAGES_DATA.filter((m) => m.recipientId === 10 || m.senderId === 10)
  }
];

/**
 * Get all conversations
 */
export const getAllConversations = (): Promise<Conversation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_CONVERSATIONS]), 300);
  });
};

/**
 * Get conversation by ID
 */
export const getConversationById = (id: number): Promise<Conversation | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const conversation = MOCK_CONVERSATIONS.find((c) => c.id === id);
      resolve(conversation ? { ...conversation } : null);
    }, 200);
  });
};

/**
 * Get messages for a conversation
 */
export const getConversationMessages = (conversationId: number): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const conversation = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
      resolve(conversation ? [...conversation.messages] : []);
    }, 250);
  });
};

/**
 * Send a message to a participant
 */
export const sendMessage = (
  participantId: number,
  content: string,
  currentUserId: number = 0,
  currentUserName: string = "You"
): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage: Message = {
        id: Math.max(...MOCK_MESSAGES_DATA.map((m) => m.id)) + 1,
        senderId: currentUserId,
        senderName: currentUserName,
        recipientId: participantId,
        content,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      MOCK_MESSAGES_DATA.push(newMessage);

      // Update conversation
      const conversation = MOCK_CONVERSATIONS.find((c) => c.participantId === participantId);
      if (conversation) {
        conversation.lastMessage = content;
        conversation.lastMessageTime = newMessage.timestamp;
        conversation.messages.push(newMessage);
      }

      resolve(newMessage);
    }, 200);
  });
};

/**
 * Mark conversation as read
 */
export const markConversationAsRead = (conversationId: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const conversation = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
      if (conversation) {
        conversation.messages.forEach((m) => {
          if (m.recipientId === 0) {
            m.isRead = true;
          }
        });
        conversation.unreadCount = 0;
      }
      resolve();
    }, 150);
  });
};

/**
 * Search conversations
 */
export const searchConversations = (query: string): Promise<Conversation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = MOCK_CONVERSATIONS.filter((c) =>
        c.participantName.toLowerCase().includes(query.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 250);
  });
};
