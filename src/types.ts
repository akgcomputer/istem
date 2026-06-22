export interface Course {
  id: string;
  title: string;
  category: string;
  level: 'Başlangıç' | 'Orta' | 'İleri';
  duration: string;
  price: number;
  enrolledCount: number;
  rating: number;
  instructorName: string;
  instructorAvatar: string;
  instructorBio: string;
  image: string;
  hasChallenge: boolean;
  hasCohort: boolean;
  lessonsCount: number;
  xpReward: number;
  isPremiumIncluded: boolean;
  capstoneTitle: string;
  capstoneDesc: string;
  benefits: string[];
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isLocked: boolean;
  isCompleted: boolean;
  videoUrl?: string; // local simulation path
  hasQuiz?: boolean;
  quizQuestion?: string;
  quizOptions?: string[];
  quizAnswer?: number; // index of the option
}

export interface Category {
  id: string;
  name: string;
  iconName: string; // lucide icon name
  description: string;
  topSkills: string[];
}

export interface StudentProgress {
  courseId: string;
  completedLessons: string[]; // lesson ids
  progressPercent: number;
  timestampNotes: {
    lessonId: string;
    lessonTitle: string;
    text: string;
    timestamp: string; // e.g. "02:14"
  }[];
}

export interface Certificate {
  id: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  verificationId: string;
  grade: string;
  qrCodeUrl: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  assignedCourses: string[]; // courseIds
  progress: { [courseId: string]: number }; // percentage
  topSkill: string;
}
