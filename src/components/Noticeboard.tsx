/**
 * Noticeboard Component for SummerHub
 * Displays announcements and posts with filtering and search
 * Uses mock API service for data
 */

import React, { useState, useEffect } from "react";
import { noticeboardApi } from "../mocks/mockApi";
import type { Post, PostCategory } from "../mocks/mockApi";

interface NoticeboardProps {
  onSelectPost?: (post: Post) => void;
}

export const Noticeboard: React.FC<NoticeboardProps> = ({ onSelectPost }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | "">("");
  const [categories, setCategories] = useState<PostCategory[]>([]);

  // Fetch posts and categories on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await noticeboardApi.getPosts();
        setPosts(data);
        setFilteredPosts(data);
        setCategories(noticeboardApi.getCategories());
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle category filter
  const handleCategoryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const category = e.target.value as PostCategory | "";
    setSelectedCategory(category);

    if (category) {
      try {
        const filtered = await noticeboardApi.getPostsByCategory(category);
        setFilteredPosts(filtered);
        setSearchQuery("");
      } catch (err) {
        console.error("Error filtering by category:", err);
      }
    } else {
      setFilteredPosts(posts);
    }
  };

  // Handle search
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      try {
        const results = await noticeboardApi.searchPosts(query);
        setFilteredPosts(results);
        setSelectedCategory("");
      } catch (err) {
        console.error("Error searching posts:", err);
      }
    } else {
      if (selectedCategory) {
        const categoryPosts = await noticeboardApi.getPostsByCategory(
          selectedCategory
        );
        setFilteredPosts(categoryPosts);
      } else {
        setFilteredPosts(posts);
      }
    }
  };

  // Handle upvote
  const handleUpvote = async (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await noticeboardApi.upvotePost(postId);
      // Refresh posts to show updated count
      const updatedPosts = await noticeboardApi.getPosts();
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    } catch (err) {
      console.error("Error upvoting post:", err);
    }
  };

  const handlePostClick = (post: Post) => {
    if (onSelectPost) {
      onSelectPost(post);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Announcements: "#ff6b6b",
      "Study Groups": "#4ecdc4",
      Events: "#45b7d1",
      Marketplace: "#ffa502",
      "Lost & Found": "#f47e56",
      Services: "#6bcf7f",
      Clubs: "#a78bfa"
    };
    return colors[category] || "#999";
  };

  if (loading) {
    return (
      <div className="noticeboard-container loading">
        <p>Loading announcements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="noticeboard-container error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="noticeboard-container">
      <h1>Noticeboard</h1>
      <p className="subtitle">{posts.length}+ announcements and posts</p>

      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="results-info">
        Showing {filteredPosts.length} of {posts.length} posts
      </div>

      <div className="posts-list">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="post-card"
            onClick={() => handlePostClick(post)}
          >
            <div className="post-header">
              <div className="post-title-section">
                <h3 className="post-title">{post.title}</h3>
                <span
                  className="category-badge"
                  style={{ backgroundColor: getCategoryColor(post.category) }}
                >
                  {post.category}
                </span>
              </div>
              <div className="post-meta">
                <p className="post-author">{post.authorName}</p>
                <p className="post-time">{formatDate(post.timestamp)}</p>
              </div>
            </div>

            <p className="post-content">{post.content}</p>

            <div className="post-footer">
              <button
                className="upvote-button"
                onClick={(e) => handleUpvote(post.id, e)}
              >
                👍 {post.upvotes}
              </button>
              <button className="reply-button">💬 Reply</button>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="no-results">
          <p>No posts found matching your criteria.</p>
        </div>
      )}

      <style jsx>{`
        .noticeboard-container {
          padding: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .noticeboard-container.loading,
        .noticeboard-container.error {
          text-align: center;
          padding: 4rem 2rem;
        }

        h1 {
          color: #333;
          margin-bottom: 0.5rem;
          font-size: 2rem;
        }

        .subtitle {
          color: #666;
          margin-bottom: 2rem;
          font-size: 1rem;
        }

        .controls-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .search-box {
          flex: 1;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }

        .search-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .category-select {
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
        }

        .category-select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .results-info {
          color: #666;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .posts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .post-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .post-card:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #007bff;
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .post-title-section {
          flex: 1;
        }

        .post-title {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 1.1rem;
          line-height: 1.4;
        }

        .category-badge {
          display: inline-block;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .post-meta {
          text-align: right;
          min-width: 150px;
        }

        .post-author {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .post-time {
          margin: 0.25rem 0 0 0;
          color: #999;
          font-size: 0.85rem;
        }

        .post-content {
          color: #555;
          line-height: 1.6;
          margin: 0 0 1rem 0;
          font-size: 0.95rem;
        }

        .post-footer {
          display: flex;
          gap: 1rem;
          border-top: 1px solid #f0f0f0;
          padding-top: 1rem;
        }

        .upvote-button,
        .reply-button {
          padding: 0.5rem 1rem;
          background: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .upvote-button:hover {
          background: #e8f4fd;
          border-color: #007bff;
          color: #007bff;
        }

        .reply-button:hover {
          background: #f0f0f0;
          border-color: #666;
        }

        .no-results {
          text-align: center;
          padding: 3rem 2rem;
          color: #999;
        }

        @media (max-width: 768px) {
          .controls-section {
            grid-template-columns: 1fr;
          }

          .post-header {
            flex-direction: column;
          }

          .post-meta {
            text-align: left;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Noticeboard;
