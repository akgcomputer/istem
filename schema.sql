-- D1 Veritabanı Şeması (Örnek)
-- Bu dosya veritabanını başlatmak için kullanılabilir.
-- Örnek tablo: students (Öğrenci Kayıtları)

DROP TABLE IF EXISTS students;
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  course TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Örnek tablo: contacts (İletişim Formu Mesajları)

DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
