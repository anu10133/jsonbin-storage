/**
 * Messages Component for SummerHub
 * Handles messaging and conversations between students
 * Uses mock API service for data
 */

import React, { useState, useEffect } from "react";
import { messagesApi } from "../mocks/mockApi";
import type { Conversation, Message } from "../mocks/mockApi";

interface MessagesProps {
  currentUserId?: number;
  currentUserName?: string;
}

export const Messages: React.FC<MessagesProps> = ({
  currentUserId = 0,
  currentUserName = "You"
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await messagesApi.getConversations();
        setConversations(data);
        if (data.length > 0) {
          setSelectedConversation(data[0]);
          setMessages(data[0].messages);
        }
      } catch (err) {
        setError("Failed to load conversations. Please try again later.");
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Handle selecting a conversation
  const handleSelectConversation = async (conversation: Conversation) => {
    try {
      setSelectedConversation(conversation);
      await messagesApi.markConversationAsRead(conversation.id);

      // Update conversation list to reflect read status
      setConversations(
        conversations.map((c) =>
          c.id === conversation.id ? { ...c, unreadCount: 0 } : c
        )
      );

      setMessages(conversation.messages);
    } catch (err) {
      console.error("Error selecting conversation:", err);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSendingMessage(true);
      const sentMessage = await messagesApi.sendMessage(
        selectedConversation.participantId,
        newMessage
      );

      // Update messages list
      setMessages([...messages, sentMessage]);
      setNewMessage("");

      // Update conversations list with new last message
      setConversations(
        conversations.map((c) =>
          c.id === selectedConversation.id
            ? {
                ...c,
                lastMessage: newMessage,
                lastMessageTime: sentMessage.timestamp
              }
            : c
        )
      );
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle search
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      try {
        const results = await messagesApi.searchConversations(query);
        setConversations(results);
      } catch (err) {
        console.error("Error searching conversations:", err);
      }
    } else {
      // Reload original conversations
      try {
        const data = await messagesApi.getConversations();
        setConversations(data);
      } catch (err) {
        console.error("Error reloading conversations:", err);
      }
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays =
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

    if (diffInDays < 1) {
      return "Today";
    } else if (diffInDays < 2) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
      });
    }
  };

  const totalUnread = conversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0
  );

  if (loading) {
    return (
      <div className="messages-container loading">
        <p>Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <div className="messages-layout">
        {/* Conversations List */}
        <div className="conversations-panel">
          <div className="conversations-header">
            <h2>Messages</h2>
            {totalUnread > 0 && (
              <span className="unread-badge">{totalUnread}</span>
            )}
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="empty-conversations">
                <p>No conversations</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${
                    selectedConversation?.id === conversation.id
                      ? "active"
                      : ""
                  } ${conversation.unreadCount > 0 ? "unread" : ""}`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <img
                    src={conversation.participantAvatar}
                    alt={conversation.participantName}
                    className="conversation-avatar"
                  />
                  <div className="conversation-info">
                    <h4 className="conversation-name">
                      {conversation.participantName}
                    </h4>
                    <p className="conversation-preview">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  <div className="conversation-right">
                    <p className="conversation-time">
                      {formatDate(conversation.lastMessageTime)}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="unread-dot">●</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="chat-panel">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-header-info">
                  <img
                    src={selectedConversation.participantAvatar}
                    alt={selectedConversation.participantName}
                    className="chat-avatar"
                  />
                  <h3>{selectedConversation.participantName}</h3>
                </div>
              </div>

              <div className="messages-list">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${
                      message.senderId === currentUserId ? "sent" : "received"
                    }`}
                  >
                    <div className="message-content">{message.content}</div>
                    <p className="message-time">
                      {formatDate(message.timestamp)}
                    </p>
                  </div>
                ))}
              </div>

              <form className="message-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sendingMessage}
                  className="message-input"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sendingMessage}
                  className="send-button"
                >
                  {sendingMessage ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation">
              <p>Select a conversation to start messaging</p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>

      <style jsx>{`
        .messages-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f5f5f5;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        }

        .messages-container.loading {
          align-items: center;
          justify-content: center;
        }

        .messages-layout {
          display: flex;
          flex: 1;
          height: 100%;
          overflow: hidden;
        }

        /* Conversations Panel */
        .conversations-panel {
          width: 320px;
          background: white;
          border-right: 1px solid #e0e0e0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .conversations-header {
          padding: 1rem;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .conversations-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #333;
        }

        .unread-badge {
          background: #ff6b6b;
          color: white;
          border-radius: 12px;
          padding: 0.25rem 0.75rem;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .search-box {
          padding: 0.75rem;
        }

        .search-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 20px;
          font-size: 0.9rem;
          box-sizing: border-box;
        }

        .search-input:focus {
          outline: none;
          border-color: #007bff;
        }

        .conversations-list {
          flex: 1;
          overflow-y: auto;
        }

        .conversation-item {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          cursor: pointer;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.2s;
          gap: 0.75rem;
        }

        .conversation-item:hover {
          background: #f9f9f9;
        }

        .conversation-item.active {
          background: #e8f4fd;
          border-right: 3px solid #007bff;
        }

        .conversation-item.unread {
          font-weight: 600;
          background: #fafafa;
        }

        .conversation-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .conversation-info {
          flex: 1;
          min-width: 0;
        }

        .conversation-name {
          margin: 0;
          font-size: 0.95rem;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conversation-preview {
          margin: 0.25rem 0 0 0;
          font-size: 0.85rem;
          color: #999;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conversation-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .conversation-time {
          margin: 0;
          font-size: 0.8rem;
          color: #999;
        }

        .unread-dot {
          color: #007bff;
          font-size: 1rem;
        }

        .empty-conversations {
          padding: 2rem 1rem;
          text-align: center;
          color: #999;
        }

        /* Chat Panel */
        .chat-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
          overflow: hidden;
        }

        .chat-header {
          padding: 1rem;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
        }

        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .chat-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .chat-header h3 {
          margin: 0;
          font-size: 1rem;
          color: #333;
        }

        .messages-list {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .message {
          display: flex;
          flex-direction: column;
          max-width: 60%;
        }

        .message.sent {
          align-self: flex-end;
        }

        .message.received {
          align-self: flex-start;
        }

        .message-content {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          word-wrap: break-word;
        }

        .message.sent .message-content {
          background: #007bff;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message.received .message-content {
          background: #f0f0f0;
          color: #333;
          border-bottom-left-radius: 4px;
        }

        .message-time {
          margin: 0.25rem 0.5rem 0 0.5rem;
          font-size: 0.75rem;
          color: #999;
        }

        .message-input-form {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          border-top: 1px solid #e0e0e0;
          background: white;
        }

        .message-input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 20px;
          font-size: 0.95rem;
          box-sizing: border-box;
        }

        .message-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .send-button {
          padding: 0.75rem 1.5rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s;
        }

        .send-button:hover:not(:disabled) {
          background: #0056b3;
        }

        .send-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .no-conversation {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #999;
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 0.75rem 1rem;
          border-top: 1px solid #fcc;
        }

        @media (max-width: 768px) {
          .conversations-panel {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #e0e0e0;
            max-height: 40%;
          }

          .chat-panel {
            width: 100%;
            max-height: 60%;
          }

          .messages-layout {
            flex-direction: column;
          }

          .message {
            max-width: 80%;
          }
        }
      `}</style>
    </div>
  );
};

export default Messages;
