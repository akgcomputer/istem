ALTER TABLE teachers ADD COLUMN isActive BOOLEAN DEFAULT 1;
ALTER TABLE courses ADD COLUMN isActive BOOLEAN DEFAULT 1;
ALTER TABLE special_courses ADD COLUMN isActive BOOLEAN DEFAULT 1;
ALTER TABLE private_schools ADD COLUMN isActive BOOLEAN DEFAULT 1;

DROP TABLE IF EXISTS challenges;
CREATE TABLE challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  sponsor TEXT,
  limit_text TEXT,
  date TEXT,
  status TEXT DEFAULT 'Aktif',
  isActive BOOLEAN DEFAULT 1
);

INSERT INTO challenges (id, title, category, sponsor, limit_text, date, status, isActive) VALUES 
('chal-1', 'Bahar Kodlama Turnuvası', 'Yazılım', 'Google TR', '500 Katılımcı', '15 Mart 2026', 'Aktif', 1),
('chal-2', 'LGS Deneme Sınavı Türkiye Geneli', 'Sınav Hazırlık', 'Eğitim Vadisi', '10.000 Katılımcı', '22 Nisan 2026', 'Aktif', 1),
('chal-3', 'Yapay Zeka Fikir Maratonu', 'Yapay Zeka', 'Teknopark İstanbul', '150 Takım', '10 Mayıs 2026', 'Draft', 1),
('chal-4', 'İstanbul Liseler Arası Münazara', 'Kişisel Gelişim', 'İBB Eğitim', '200 Katılımcı', '05 Haziran 2026', 'Completed', 1);
