/**
 * Mock Student Data for SummerHub Directory
 * Contains 11 students to populate the directory when backend is unavailable
 */

export interface Student {
  id: number;
  name: string;
  year: string;
  major: string;
  interests: string[];
  profilePic: string;
  email: string;
  bio?: string;
}

export const MOCK_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Alice Johnson",
    year: "Junior",
    major: "Computer Science",
    interests: ["AI", "Web Development", "Robotics"],
    profilePic: "https://i.pravatar.cc/150?img=1",
    email: "alice.johnson@university.edu",
    bio: "Passionate about AI and building cool projects"
  },
  {
    id: 2,
    name: "Bob Smith",
    year: "Senior",
    major: "Data Science",
    interests: ["Machine Learning", "Statistics", "Big Data"],
    profilePic: "https://i.pravatar.cc/150?img=2",
    email: "bob.smith@university.edu",
    bio: "Data science enthusiast and aspiring data engineer"
  },
  {
    id: 3,
    name: "Carol Williams",
    year: "Sophomore",
    major: "Business Administration",
    interests: ["Entrepreneurship", "Marketing", "Finance"],
    profilePic: "https://i.pravatar.cc/150?img=3",
    email: "carol.williams@university.edu",
    bio: "Building the next startup"
  },
  {
    id: 4,
    name: "David Brown",
    year: "Junior",
    major: "Electrical Engineering",
    interests: ["Circuit Design", "IoT", "Embedded Systems"],
    profilePic: "https://i.pravatar.cc/150?img=4",
    email: "david.brown@university.edu",
    bio: "IoT and embedded systems developer"
  },
  {
    id: 5,
    name: "Emma Davis",
    year: "Senior",
    major: "Psychology",
    interests: ["Research", "Cognitive Science", "Mental Health"],
    profilePic: "https://i.pravatar.cc/150?img=5",
    email: "emma.davis@university.edu",
    bio: "Conducting research on cognitive science"
  },
  {
    id: 6,
    name: "Frank Miller",
    year: "Sophomore",
    major: "Environmental Science",
    interests: ["Sustainability", "Climate Change", "Conservation"],
    profilePic: "https://i.pravatar.cc/150?img=6",
    email: "frank.miller@university.edu",
    bio: "Environmental advocate and conservation enthusiast"
  },
  {
    id: 7,
    name: "Grace Lee",
    year: "Junior",
    major: "Mathematics",
    interests: ["Pure Math", "Cryptography", "Problem Solving"],
    profilePic: "https://i.pravatar.cc/150?img=7",
    email: "grace.lee@university.edu",
    bio: "Math tutor and cryptography enthusiast"
  },
  {
    id: 8,
    name: "Henry Wilson",
    year: "Senior",
    major: "Chemistry",
    interests: ["Organic Chemistry", "Research", "Lab Work"],
    profilePic: "https://i.pravatar.cc/150?img=8",
    email: "henry.wilson@university.edu",
    bio: "Chemistry researcher focusing on organic synthesis"
  },
  {
    id: 9,
    name: "Iris Anderson",
    year: "Sophomore",
    major: "English Literature",
    interests: ["Writing", "Poetry", "Classical Literature"],
    profilePic: "https://i.pravatar.cc/150?img=9",
    email: "iris.anderson@university.edu",
    bio: "Aspiring author and poetry enthusiast"
  },
  {
    id: 10,
    name: "Jack Martinez",
    year: "Junior",
    major: "Music Education",
    interests: ["Guitar", "Jazz", "Composition"],
    profilePic: "https://i.pravatar.cc/150?img=10",
    email: "jack.martinez@university.edu",
    bio: "Guitar teacher and jazz composer"
  },
  {
    id: 11,
    name: "Kat Thompson",
    year: "Senior",
    major: "Philosophy",
    interests: ["Ethics", "Logic", "Metaphysics"],
    profilePic: "https://i.pravatar.cc/150?img=11",
    email: "kat.thompson@university.edu",
    bio: "Philosophy researcher focused on ethics and logic"
  }
];

/**
 * Get all students
 */
export const getAllStudents = (): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_STUDENTS]), 300);
  });
};

/**
 * Get student by ID
 */
export const getStudentById = (id: number): Promise<Student | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const student = MOCK_STUDENTS.find((s) => s.id === id);
      resolve(student || null);
    }, 200);
  });
};

/**
 * Search students by name, major, or interests
 */
export const searchStudents = (query: string): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = MOCK_STUDENTS.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.major.toLowerCase().includes(query.toLowerCase()) ||
        s.interests.some((i) => i.toLowerCase().includes(query.toLowerCase()))
      );
      resolve(results);
    }, 250);
  });
};

/**
 * Filter students by major
 */
export const getStudentsByMajor = (major: string): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = MOCK_STUDENTS.filter((s) =>
        s.major.toLowerCase().includes(major.toLowerCase())
      );
      resolve(results);
    }, 250);
  });
};

/**
 * Filter students by year
 */
export const getStudentsByYear = (year: string): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = MOCK_STUDENTS.filter((s) => s.year === year);
      resolve(results);
    }, 250);
  });
};
