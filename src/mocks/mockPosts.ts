/**
 * Mock Posts/Announcements Data for SummerHub Noticeboard
 * Contains 10 announcements to populate the noticeboard when backend is unavailable
 */

export interface Post {
  id: number;
  authorId: number;
  authorName: string;
  title: string;
  content: string;
  category: string;
  timestamp: string;
  upvotes: number;
  image?: string;
}

export type PostCategory = 
  | "Announcements"
  | "Study Groups"
  | "Events"
  | "Marketplace"
  | "Lost & Found"
  | "Services"
  | "Clubs";

export const MOCK_POSTS: Post[] = [
  {
    id: 1,
    authorId: 1,
    authorName: "Alice Johnson",
    title: "AI Study Group Starting This Week",
    content: "Looking for students interested in AI fundamentals. We'll meet every Tuesday and Thursday at the library. All levels welcome! Bring your laptops.",
    category: "Study Groups",
    timestamp: "2026-06-24T14:30:00Z",
    upvotes: 24
  },
  {
    id: 2,
    authorId: 2,
    authorName: "Bob Smith",
    title: "Summer Internship Opportunities - Tech Companies Hiring",
    content: "Several tech companies are hiring interns for summer 2026. Check the career portal for details. Positions available in: Frontend, Backend, Data Science. Deadline is June 30th.",
    category: "Announcements",
    timestamp: "2026-06-24T13:15:00Z",
    upvotes: 38
  },
  {
    id: 3,
    authorId: 3,
    authorName: "Carol Williams",
    title: "Laptop for Sale - Dell XPS 15",
    content: "Selling my Dell XPS 15 from 2024. Great condition, includes original charger and case. 16GB RAM, 512GB SSD. Used for one year only. $800 OBO. Contact via DM.",
    category: "Marketplace",
    timestamp: "2026-06-24T12:00:00Z",
    upvotes: 15
  },
  {
    id: 4,
    authorId: 4,
    authorName: "David Brown",
    title: "Campus Robotics Competition - Team Registration Open",
    content: "Sign up your team for the annual robotics competition! Teams of 4-6 members. Registration closes July 10th. Prize pool: $5000. First place gets $2500. Event details: https://campus.robotics.edu",
    category: "Events",
    timestamp: "2026-06-24T11:45:00Z",
    upvotes: 42
  },
  {
    id: 5,
    authorId: 5,
    authorName: "Emma Davis",
    title: "Lost: Black AirPods Pro Near Science Building",
    content: "Lost my AirPods Pro near the science building entrance on Monday. They're in a white charging case. If you find them, please contact me ASAP. Reward offered! Email or call.",
    category: "Lost & Found",
    timestamp: "2026-06-24T10:30:00Z",
    upvotes: 8
  },
  {
    id: 6,
    authorId: 6,
    authorName: "Frank Miller",
    title: "Environmental Sustainability Workshop - Free Admission",
    content: "Join us for a free workshop on sustainable campus practices and eco-friendly living. Saturday 2 PM at the Green Center. Refreshments and snacks provided. All students welcome!",
    category: "Events",
    timestamp: "2026-06-24T09:20:00Z",
    upvotes: 19
  },
  {
    id: 7,
    authorId: 7,
    authorName: "Grace Lee",
    title: "Free Math Tutoring Available",
    content: "I'm offering free math tutoring for Calculus and Linear Algebra. Available on weekends and some weekday evenings. DM for schedule. Currently 5 slots available. First come, first served!",
    category: "Services",
    timestamp: "2026-06-23T20:15:00Z",
    upvotes: 31
  },
  {
    id: 8,
    authorId: 8,
    authorName: "Henry Wilson",
    title: "Chemistry Lab Equipment for Sale",
    content: "Selling unused chemistry lab equipment from my sophomore year. Includes beakers, flasks, burners, and safety equipment. Great for anyone setting up a home lab. $150 for all.",
    category: "Marketplace",
    timestamp: "2026-06-23T18:45:00Z",
    upvotes: 12
  },
  {
    id: 9,
    authorId: 9,
    authorName: "Iris Anderson",
    title: "Creative Writing Club Meeting Tomorrow - Join Us!",
    content: "Our weekly creative writing club meets tomorrow (Wednesday) at 6 PM in the Arts Building Room 205. Bring your work and get constructive feedback from peers. New members always welcome!",
    category: "Clubs",
    timestamp: "2026-06-23T17:30:00Z",
    upvotes: 26
  },
  {
    id: 10,
    authorId: 10,
    authorName: "Jack Martinez",
    title: "Free Guitar Lessons - All Levels Welcome",
    content: "Teaching free guitar lessons every Wednesday evening at 7 PM in the Music Building. Acoustic and electric guitars welcome. First lesson free - no commitment needed. Beginners to advanced.",
    category: "Services",
    timestamp: "2026-06-23T16:00:00Z",
    upvotes: 45
  }
];

/**
 * Get all posts
 */
export const getAllPosts = (): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_POSTS].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )), 300);
  });
};

/**
 * Get posts by category
 */
export const getPostsByCategory = (category: PostCategory): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = MOCK_POSTS.filter((p) => p.category === category).sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      resolve(results);
    }, 250);
  });
};

/**
 * Search posts by title or content
 */
export const searchPosts = (query: string): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = MOCK_POSTS.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.content.toLowerCase().includes(query.toLowerCase()) ||
        p.authorName.toLowerCase().includes(query.toLowerCase())
      ).sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      resolve(results);
    }, 250);
  });
};

/**
 * Create new post
 */
export const createPost = (
  title: string,
  content: string,
  category: PostCategory,
  authorId: number,
  authorName: string
): Promise<Post> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPost: Post = {
        id: Math.max(...MOCK_POSTS.map((p) => p.id)) + 1,
        title,
        content,
        category,
        authorId,
        authorName,
        timestamp: new Date().toISOString(),
        upvotes: 0
      };
      MOCK_POSTS.unshift(newPost);
      resolve(newPost);
    }, 200);
  });
};

/**
 * Upvote a post
 */
export const upvotePost = (postId: number): Promise<Post | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = MOCK_POSTS.find((p) => p.id === postId);
      if (post) {
        post.upvotes += 1;
        resolve({ ...post });
      } else {
        resolve(null);
      }
    }, 150);
  });
};

/**
 * Get all available categories
 */
export const getCategories = (): PostCategory[] => {
  return [
    "Announcements",
    "Study Groups",
    "Events",
    "Marketplace",
    "Lost & Found",
    "Services",
    "Clubs"
  ];
};
