/**
 * Mock API Service for SummerHub
 * Unified API service that tries backend first, falls back to mock data
 * Exports all functions needed for Directory, Noticeboard, and Messaging
 * DEFENSIVE: All responses validated and defaulted to safe values
 */

// Import mock data
import * as studentsMock from "./mockStudents";
import * as postsMock from "./mockPosts";
import * as messagesMock from "./mockMessages";

// Re-export types
export type { Student } from "./mockStudents";
export type { Post, PostCategory } from "./mockPosts";
export type { Message, Conversation } from "./mockMessages";

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
const TIMEOUT = 5000; // 5 second timeout for backend calls

/**
 * Fetch with timeout
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Defensive response validator - ensures responses are valid arrays
 */
const validateArrayResponse = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }
  console.warn("API returned non-array response, using empty array fallback", data);
  return [];
};

/**
 * Defensive single object validator
 */
const validateObjectResponse = <T>(data: unknown): T | null => {
  if (data !== null && typeof data === "object") {
    return data as T;
  }
  console.warn("API returned invalid object response, using null fallback", data);
  return null;
};

// ==================== DIRECTORY API ====================

export const directoryApi = {
  /**
   * Get all students
   */
  async getStudents() {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/students`);
      if (response.ok) {
        const data = await response.json();
        return validateArrayResponse(data);
      }
    } catch (error) {
      console.warn("Backend unavailable for getStudents, using mock data");
    }
    try {
      const data = await studentsMock.getAllStudents();
      return validateArrayResponse(data);
    } catch (error) {
      console.error("Error fetching mock students:", error);
      return [];
    }
  },

  /**
   * Get student by ID
   */
  async getStudentById(id: number) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/students/${id}`);
      if (response.ok) {
        const data = await response.json();
        return validateObjectResponse(data);
      }
    } catch (error) {
      console.warn(`Backend unavailable for getStudentById(${id}), using mock data`);
    }
    try {
      const data = await studentsMock.getStudentById(id);
      return validateObjectResponse(data);
    } catch (error) {
      console.error(`Error fetching mock student ${id}:`, error);
      return null;
    }
  },

  /**
   * Search students
   */
  async searchStudents(query: string) {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/students/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        return validateArrayResponse(data);
      }
    } catch (error) {
      console.warn(`Backend unavailable for searchStudents("${query}"), using mock data`);
    }
    try {
      const data = await studentsMock.searchStudents(query);
      return validateArrayResponse(data);
    } catch (error) {
      console.error(`Error searching mock students:`, error);
      return [];
    }
  },

  /**
   * Filter students by major
   */
  async getStudentsByMajor(major: string) {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/students/major/${encodeURIComponent(major)}`
      );
      if (response.ok) {
        const data = await response.json();
        return validateArrayResponse(data);
      }
    } catch (error) {
      console.warn(`Backend unavailable for getStudentsByMajor("${major}"), using mock data`);
    }
    try {
      const data = await studentsMock.getStudentsByMajor(major);
      return validateArrayResponse(data);
    } catch (error) {
      console.error(`Error filtering mock students by major:`, error);
      return [];
    }
  },

  /**
   * Filter students by year
   */
  async getStudentsByYear(year: string) {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/students/year/${encodeURIComponent(year)}`
      );
      if (response.ok) {
        const data = await response.json();
        return validateArrayResponse(data);
      }
    } catch (error) {
      console.warn(`Backend unavailable for getStudentsByYear("${year}"), using mock data`);
    }
    try {
      const data = await studentsMock.getStudentsByYear(year);
      return validateArrayResponse(data);
    } catch (error) {
      console.error(`Error filtering mock students by year:`, error);
      return [];
    }
  }
};

// ==================== NOTICEBOARD API ====================

export const noticeboardApi = {
  /**
   * Get all posts
   */
  async getPosts() {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/posts`);
      if (response.ok) {
        const data = await response.json();
        return validateArrayResponse(data);
      }
    } catch (error) {
      console.warn("Backend unavailable for getPosts, using mock data");
    }
    try {
      const data = await postsMock.getAllPosts();
      return validateArrayResponse(data);
    } catch (error) {
      console.error("Error fetching mock posts:", error);
      return [];
    }
  },

  /**
   * Get posts by category
   */
  async getPostsByCategory(category: postsMock.PostCategory) {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/posts/category/${encodeURIComponent(category)}`
      );
      if (response.ok) {
        const data = await response.json();
        return validateArrayResponse(data);
      }
    } catch (error) {
      console.warn(
        `Backend unavailable for getPostsByCategory("${category}"), using mock data`
      );
    }
    try {
      const data = await postsMock.getPostsByCategory(category);
      return validateArrayResponse(data);
    } catch (error) {
      console.error(`Error fetching mock posts by category:`, error);
      return [];
    }
  },

  /**
   * Search posts
   */
  async searchPosts(query: string) {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/posts/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        return validateArrayResponse(data);
      }
    } catch (error) {
      console.warn(`Backend unavailable for searchPosts("${query}"), using mock data`);
    }
    try {
      const data = await postsMock.searchPosts(query);
      return validateArrayResponse(data);
    } catch (error) {
      console.error(`Error searching mock posts:`, error);
      return [];
    }
  },

  /**
   * Create new post
   */
  async createPost(
    title: string,
    content: string,
    category: postsMock.PostCategory,
    authorId: number,
    authorName: string
  ) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category, authorId, authorName })
      });
      if (response.ok) {
        const data = await response.json();
        return validateObjectResponse(data) || {
          id: 0,
          title,
          content,
          category,
          authorId,
          authorName,
          timestamp: new Date().toISOString(),
          upvotes: 0
        };
      }
    } catch (error) {
      console.warn("Backend unavailable for createPost, using mock data");
    }
    try {
      const data = await postsMock.createPost(title, content, category, authorId, authorName);
      return data;
    } catch (error) {
      console.error(`Error creating mock post:`, error);
      return {
        id: 0,
        title,
        content,
        category,
        authorId,
        authorName,
        timestamp: new Date().toISOString(),
        upvotes: 0
      };
    }
  },

  /**
   * Upvote a post
   */
  async upvotePost(postId: number) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/posts/${postId}/upvote`, {
        method: "POST"
      });
      if (response.ok) {
        const data = await response.json();
        return validateObjectResponse(data);
      }
    } catch (error) {
      console.warn(`Backend unavailable for upvotePost(${postId}), using mock data`);
    }
    try {
      const data = await postsMock.upvotePost(postId);
      return validateObjectResponse(data);
    } catch (error) {
      console.error(`Error upvoting mock post:`, error);
      return null;
    }
  },

  /**
   * Get all categories
   */
  getCategories(): postsMock.PostCategory[] {
    try {
      const data = postsMock.getCategories();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error getting post categories:", error);
      return [];
    }
  }
};

// ==================== MESSAGING API ====================

export const messagesApi = {
  /**
   * Get all conversations
   */
  async getConversations() {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/conversations`);
      if (response.ok) {
        const data = await response.json();
        return validateArrayResponse(data);
      }
    } catch (error) {
      console.warn("Backend unavailable for getConversations, using mock data");
    }
    try {
      const data = await messagesMock.getAllConversations();
      return validateArrayResponse(data);
    } catch (error) {
      console.error("Error fetching mock conversations:", error);
      return [];
    }
  },

  /**
   * Get conversation by ID
   */
  async getConversationById(id: number) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/conversations/${id}`);
      if (response.ok) {
        const data = await response.json();
        return validateObjectResponse(data);
      }
    } catch (error) {
      console.warn(`Backend unavailable for getConversationById(${id}), using mock data`);
    }
    try {
      const data = await messagesMock.getConversationById(id);
      return validateObjectResponse(data);
    } catch (error) {
      console.error(`Error fetching mock conversation:`, error);
      return null;
    }
  },

  /**
   * Get messages for a conversation
   */
  async getConversationMessages(conversationId: number) {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/conversations/${conversationId}/messages`
      );
      if (response.ok) {
        const data = await response.json();
        return validateArrayResponse(data);
      }
    } catch (error) {
      console.warn(
        `Backend unavailable for getConversationMessages(${conversationId}), using mock data`
      );
    }
    try {
      const data = await messagesMock.getConversationMessages(conversationId);
      return validateArrayResponse(data);
    } catch (error) {
      console.error(`Error fetching mock conversation messages:`, error);
      return [];
    }
  },

  /**
   * Send a message
   */
  async sendMessage(participantId: number, content: string) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId, content })
      });
      if (response.ok) {
        const data = await response.json();
        return validateObjectResponse(data);
      }
    } catch (error) {
      console.warn(`Backend unavailable for sendMessage to ${participantId}, using mock data`);
    }
    try {
      const data = await messagesMock.sendMessage(participantId, content);
      return data;
    } catch (error) {
      console.error(`Error sending mock message:`, error);
      return {
        id: 0,
        senderId: 0,
        senderName: "You",
        recipientId: participantId,
        content,
        timestamp: new Date().toISOString(),
        isRead: false
      };
    }
  },

  /**
   * Mark conversation as read
   */
  async markConversationAsRead(conversationId: number) {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/conversations/${conversationId}/read`,
        {
          method: "POST"
        }
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(
        `Backend unavailable for markConversationAsRead(${conversationId}), using mock data`
      );
    }
    try {
      return await messagesMock.markConversationAsRead(conversationId);
    } catch (error) {
      console.error(`Error marking mock conversation as read:`, error);
      return undefined;
    }
  },

  /**
   * Search conversations
   */
  async searchConversations(query: string) {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/conversations/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        return validateArrayResponse(data);
      }
    } catch (error) {
      console.warn(`Backend unavailable for searchConversations("${query}"), using mock data`);
    }
    try {
      const data = await messagesMock.searchConversations(query);
      return validateArrayResponse(data);
    } catch (error) {
      console.error(`Error searching mock conversations:`, error);
      return [];
    }
  }
};

export default {
  directoryApi,
  noticeboardApi,
  messagesApi
};
