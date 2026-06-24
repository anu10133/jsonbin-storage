/**
 * Mock API Service for SummerHub
 * Unified API service that tries backend first, falls back to mock data
 * Exports all functions needed for Directory, Noticeboard, and Messaging
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
const fetchWithTimeout = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
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
        return await response.json();
      }
    } catch (error) {
      console.warn("Backend unavailable for getStudents, using mock data");
    }
    return studentsMock.getAllStudents();
  },

  /**
   * Get student by ID
   */
  async getStudentById(id: number) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/students/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Backend unavailable for getStudentById(${id}), using mock data`);
    }
    return studentsMock.getStudentById(id);
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
        return await response.json();
      }
    } catch (error) {
      console.warn(`Backend unavailable for searchStudents("${query}"), using mock data`);
    }
    return studentsMock.searchStudents(query);
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
        return await response.json();
      }
    } catch (error) {
      console.warn(`Backend unavailable for getStudentsByMajor("${major}"), using mock data`);
    }
    return studentsMock.getStudentsByMajor(major);
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
        return await response.json();
      }
    } catch (error) {
      console.warn(`Backend unavailable for getStudentsByYear("${year}"), using mock data`);
    }
    return studentsMock.getStudentsByYear(year);
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
        return await response.json();
      }
    } catch (error) {
      console.warn("Backend unavailable for getPosts, using mock data");
    }
    return postsMock.getAllPosts();
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
        return await response.json();
      }
    } catch (error) {
      console.warn(
        `Backend unavailable for getPostsByCategory("${category}"), using mock data`
      );
    }
    return postsMock.getPostsByCategory(category);
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
        return await response.json();
      }
    } catch (error) {
      console.warn(`Backend unavailable for searchPosts("${query}"), using mock data`);
    }
    return postsMock.searchPosts(query);
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
        return await response.json();
      }
    } catch (error) {
      console.warn("Backend unavailable for createPost, using mock data");
    }
    return postsMock.createPost(title, content, category, authorId, authorName);
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
        return await response.json();
      }
    } catch (error) {
      console.warn(`Backend unavailable for upvotePost(${postId}), using mock data`);
    }
    return postsMock.upvotePost(postId);
  },

  /**
   * Get all categories
   */
  getCategories(): postsMock.PostCategory[] {
    return postsMock.getCategories();
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
        return await response.json();
      }
    } catch (error) {
      console.warn("Backend unavailable for getConversations, using mock data");
    }
    return messagesMock.getAllConversations();
  },

  /**
   * Get conversation by ID
   */
  async getConversationById(id: number) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/conversations/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Backend unavailable for getConversationById(${id}), using mock data`);
    }
    return messagesMock.getConversationById(id);
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
        return await response.json();
      }
    } catch (error) {
      console.warn(
        `Backend unavailable for getConversationMessages(${conversationId}), using mock data`
      );
    }
    return messagesMock.getConversationMessages(conversationId);
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
        return await response.json();
      }
    } catch (error) {
      console.warn(`Backend unavailable for sendMessage to ${participantId}, using mock data`);
    }
    return messagesMock.sendMessage(participantId, content);
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
    return messagesMock.markConversationAsRead(conversationId);
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
        return await response.json();
      }
    } catch (error) {
      console.warn(`Backend unavailable for searchConversations("${query}"), using mock data`);
    }
    return messagesMock.searchConversations(query);
  }
};

export default {
  directoryApi,
  noticeboardApi,
  messagesApi
};
