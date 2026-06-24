# SummerHub Mock Data Integration Guide

## Overview

This guide explains all the files created for SummerHub to work without backend APIs. The application now displays mock data for Directory, Noticeboard, and Messages.

---

## 📋 Created Files Summary

### 1. Mock Data Files (src/mocks/)

#### `src/mocks/mockStudents.ts`
- **Purpose**: Contains 11 students for the Directory
- **Exports**:
  - `MOCK_STUDENTS[]`: Array of Student objects
  - `getAllStudents()`: Fetch all students
  - `getStudentById(id)`: Get specific student
  - `searchStudents(query)`: Search by name, major, interests
  - `getStudentsByMajor(major)`: Filter by major
  - `getStudentsByYear(year)`: Filter by year

#### `src/mocks/mockPosts.ts`
- **Purpose**: Contains 10 announcements for the Noticeboard
- **Exports**:
  - `MOCK_POSTS[]`: Array of Post objects
  - `getAllPosts()`: Fetch all posts
  - `getPostsByCategory(category)`: Filter by category
  - `searchPosts(query)`: Search by title/content/author
  - `createPost()`: Add new post
  - `upvotePost(postId)`: Increment upvotes
  - `getCategories()`: List all post categories

#### `src/mocks/mockMessages.ts`
- **Purpose**: Contains 5 conversations for Messaging
- **Exports**:
  - `MOCK_CONVERSATIONS[]`: Array of Conversation objects
  - `getAllConversations()`: Fetch all conversations
  - `getConversationById(id)`: Get specific conversation
  - `getConversationMessages(id)`: Get messages in conversation
  - `sendMessage(participantId, content)`: Send message
  - `markConversationAsRead(id)`: Mark as read
  - `searchConversations(query)`: Search conversations

#### `src/mocks/mockApi.ts`
- **Purpose**: Unified API service that tries backend first, falls back to mock data
- **Features**:
  - Auto-fallback to mock data if backend unavailable
  - 5-second timeout for backend requests
  - Complete API for Directory, Noticeboard, and Messaging
- **Exports**:
  - `directoryApi`: Directory endpoints
  - `noticeboardApi`: Noticeboard endpoints
  - `messagesApi`: Messaging endpoints

### 2. Component Files (src/components/)

#### `src/components/Directory.tsx`
- **Purpose**: Student directory with search and filters
- **Features**:
  - Display 11+ students
  - Search by name, major, interests
  - Filter by year and major
  - Send message button
  - Responsive grid layout
- **Imports**:
  ```typescript
  import { directoryApi } from "../mocks/mockApi";
  import type { Student } from "../mocks/mockApi";
  ```

#### `src/components/Noticeboard.tsx`
- **Purpose**: Announcements and posts display
- **Features**:
  - Display 10 posts
  - Search functionality
  - Filter by category (7 types)
  - Upvote posts
  - Time-based post ordering
  - Color-coded categories
- **Imports**:
  ```typescript
  import { noticeboardApi } from "../mocks/mockApi";
  import type { Post, PostCategory } from "../mocks/mockApi";
  ```

#### `src/components/Messages.tsx`
- **Purpose**: Student messaging interface
- **Features**:
  - Display 5 conversations
  - Real-time message exchange
  - Search conversations
  - Unread message count
  - Mark as read
  - Message timestamps
- **Imports**:
  ```typescript
  import { messagesApi } from "../mocks/mockApi";
  import type { Conversation, Message } from "../mocks/mockApi";
  ```

---

## 🔧 How to Use

### Import in Your App.tsx or Main Component

```typescript
import Directory from "./components/Directory";
import Noticeboard from "./components/Noticeboard";
import Messages from "./components/Messages";

function App() {
  return (
    <div>
      {/* Use components */}
      <Directory />
      <Noticeboard />
      <Messages />
    </div>
  );
}
```

### Usage with Props

```typescript
// Directory
<Directory 
  onSelectStudent={(student) => {
    console.log("Selected:", student);
  }} 
/>

// Messages
<Messages 
  currentUserId={0}
  currentUserName="You"
/>

// Noticeboard
<Noticeboard 
  onSelectPost={(post) => {
    console.log("Selected:", post);
  }} 
/>
```

---

## 📊 Mock Data Quantities

| Feature | Count | Details |
|---------|-------|---------|
| **Students** | 11 | Various years, majors, and interests |
| **Posts** | 10 | 7 different categories |
| **Conversations** | 5 | Realistic message exchanges |
| **Message Count** | 10+ | Pre-populated conversations |

---

## 🔌 Backend Integration Strategy

The `mockApi.ts` implements a **graceful fallback pattern**:

```typescript
export const directoryApi = {
  async getStudents() {
    try {
      // Try backend first
      const response = await fetchWithTimeout(`${API_BASE_URL}/students`);
      if (response.ok) return await response.json();
    } catch (error) {
      console.warn("Backend unavailable, using mock data");
    }
    // Fall back to mock data
    return studentsMock.getAllStudents();
  }
};
```

**To switch to real backend:**
1. Set `REACT_APP_API_URL` environment variable
2. Backend will be used automatically if available
3. If backend fails, mock data is used as fallback

---

## 🚀 Build & Run Commands

### Development Mode
```bash
npm start
```

### Build Production
```bash
npm run build
```

### Type Check
```bash
npx tsc --noEmit
```

### Lint
```bash
npm run lint
```

---

## 📁 File Structure

```
src/
├── components/
│   ├── Directory.tsx          ← Student directory with search/filter
│   ├── Noticeboard.tsx        ← Announcements and posts
│   └── Messages.tsx           ← Messaging interface
├── mocks/
│   ├── mockStudents.ts        ← 11 students data + functions
│   ├── mockPosts.ts           ← 10 posts data + functions
│   ├── mockMessages.ts        ← 5 conversations data + functions
│   └── mockApi.ts             ← Unified API service (backend-first)
└── App.tsx                    ← Main app file
```

---

## ✅ Verification Checklist

- [x] Directory displays 11+ students
- [x] Directory search works (name, major, interests)
- [x] Directory filter works (year, major)
- [x] Noticeboard displays 10 posts
- [x] Noticeboard has 7 categories
- [x] Noticeboard search works
- [x] Noticeboard upvote works
- [x] Messages shows 5 conversations
- [x] Messages search works
- [x] Messages send/reply works
- [x] All components styled and responsive
- [x] TypeScript types exported correctly
- [x] Mock API has fallback to backend
- [x] Timeout handling for backend calls

---

## 🎨 Styling Features

All components include:
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ CSS-in-JS with styled JSX
- ✅ Hover effects and transitions
- ✅ Loading and error states
- ✅ Professional color scheme
- ✅ Accessibility features

---

## 🔄 Data Flow

```
Component Mount
       ↓
Call mockApi.getXxx()
       ↓
Try Backend (5s timeout)
       ↓
Success? → Return Backend Data
    ↓
No? → Return Mock Data
       ↓
Display Data
```

---

## 📝 Environment Configuration

Create `.env` file to configure backend:

```env
# Development (uses mock data as fallback)
REACT_APP_API_URL=http://localhost:3001/api

# Or leave empty to use mock data only
# REACT_APP_API_URL=
```

---

## 🐛 Debugging

Enable console logs to see what's happening:

```typescript
// In mockApi.ts, logs will show:
// "Backend unavailable for getStudents, using mock data"
// When backend is not responding or times out
```

Check browser console for:
- `console.warn()`: Backend fallback messages
- `console.error()`: Error details

---

## 🚀 Next Steps

1. **Backend Integration**: Connect real backend API when ready
2. **Authentication**: Add user login with session management
3. **Real-time Updates**: Implement WebSocket for live messages
4. **Database Sync**: Replace mock data with actual database
5. **User Profiles**: Expand profile information
6. **Media Upload**: Add image/file upload capability

---

## 📞 Support

For issues:
1. Check if backend is running on the correct URL
2. Verify `REACT_APP_API_URL` environment variable
3. Check browser console for error messages
4. Ensure all components are imported correctly
5. Verify mock data files are in `src/mocks/` directory

---

## ✨ Features Ready

- ✅ Full Student Directory (11 students)
- ✅ Complete Noticeboard (10 posts, 7 categories)
- ✅ Messaging System (5 conversations)
- ✅ Search & Filter functionality
- ✅ Responsive UI
- ✅ TypeScript support
- ✅ Backend-first architecture
- ✅ Mock data fallback
- ✅ Production-ready code

**The application is now fully functional without backend APIs!**
