-- --------------------------------------------------------
-- Cloudflare D1 Veritabanı Şeması
-- İstanbul Eğitim Merkezi Uygulaması İçin
-- --------------------------------------------------------

DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  iconName TEXT,
  description TEXT,
  topSkills TEXT -- JSON array as string
);

DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT,
  duration TEXT,
  price REAL,
  enrolledCount INTEGER DEFAULT 0,
  rating REAL DEFAULT 0.0,
  instructorName TEXT,
  instructorAvatar TEXT, -- R2 url
  instructorBio TEXT,
  image TEXT, -- R2 url
  hasChallenge BOOLEAN DEFAULT 0,
  hasCohort BOOLEAN DEFAULT 0,
  lessonsCount INTEGER DEFAULT 0,
  xpReward INTEGER DEFAULT 0,
  isPremiumIncluded BOOLEAN DEFAULT 0,
  capstoneTitle TEXT,
  capstoneDesc TEXT,
  benefits TEXT -- JSON array as string
);

DROP TABLE IF EXISTS lessons;
CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  courseId TEXT NOT NULL,
  title TEXT NOT NULL,
  duration TEXT,
  isLocked BOOLEAN DEFAULT 1,
  isCompleted BOOLEAN DEFAULT 0,
  quizQuestion TEXT,
  quizOptions TEXT, -- JSON array as string
  quizAnswer INTEGER,
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS teachers;
CREATE TABLE teachers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT, -- R2 url
  rating REAL DEFAULT 0.0,
  commentsCount INTEGER DEFAULT 0,
  experienceYears INTEGER,
  experienceLabel TEXT,
  bio TEXT,
  preferredLocation TEXT,
  canCorporate BOOLEAN DEFAULT 0,
  canOnline BOOLEAN DEFAULT 0,
  canFaceToFace BOOLEAN DEFAULT 0,
  tags TEXT, -- JSON array
  category TEXT
);

DROP TABLE IF EXISTS teacher_sessions;
CREATE TABLE teacher_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacherId TEXT NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  courseId TEXT,
  FOREIGN KEY (teacherId) REFERENCES teachers(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS private_schools;
CREATE TABLE private_schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT, -- R2 url
  location TEXT,
  capacity INTEGER,
  teachersCount INTEGER,
  type TEXT,
  lessons TEXT, -- JSON array
  lessonHours TEXT,
  schoolHours TEXT,
  parentReviewText TEXT,
  reviewerName TEXT,
  rating REAL DEFAULT 0.0,
  sector TEXT,
  averageClassSize INTEGER,
  branchesCount INTEGER,
  reviewsCount INTEGER,
  imagesCount INTEGER,
  deals TEXT, -- JSON array
  monthlyPrice REAL,
  classSizeCategory TEXT,
  educationSystem TEXT,
  physicalFacilities TEXT, -- JSON array
  services TEXT, -- JSON array
  activities TEXT, -- JSON array
  languages TEXT -- JSON array
);

DROP TABLE IF EXISTS special_courses;
CREATE TABLE special_courses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT, -- R2 url
  type TEXT,
  location TEXT,
  capacity INTEGER,
  teachersCount INTEGER,
  classes TEXT, -- JSON array
  hoursPerWeek TEXT,
  priceRange TEXT,
  parentReviewText TEXT,
  reviewerName TEXT,
  rating REAL DEFAULT 0.0,
  branchesCount INTEGER,
  averageClassSize INTEGER
);

DROP TABLE IF EXISTS employees;
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  assignedCourses TEXT, -- JSON array
  progress TEXT, -- JSON object
  topSkill TEXT
);

DROP TABLE IF EXISTS certificates;
CREATE TABLE certificates (
  id TEXT PRIMARY KEY,
  studentName TEXT NOT NULL,
  courseTitle TEXT NOT NULL,
  issueDate TEXT,
  verificationId TEXT UNIQUE NOT NULL,
  grade TEXT,
  qrCodeUrl TEXT -- R2 url or external
);

-- Ek olarak İletişim vs formlar için
DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
