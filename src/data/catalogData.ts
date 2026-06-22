export interface TeacherSession {
  name: string;
  price: number;
  courseId?: string; // Links to details
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  commentsCount: number;
  experienceYears: number; // For filtering
  experienceLabel: 'Yeni' | '1-5 Yıl' | '+5 Yıldan Fazla' | '+10 Yıldan Fazla';
  bio: string;
  sessions: TeacherSession[];
  preferredLocation: string;
  canCorporate: boolean;
  canOnline: boolean;
  canFaceToFace: boolean;
  tags: string[];
  category: 'Bilişim' | 'Dil' | 'İlköğretim' | 'Lise/Sınav' | 'Spor' | 'Sanat' | 'Kişisel';
}

export interface PrivateSchool {
  id: string;
  name: string;
  image: string;
  location: string;
  capacity: number;
  teachersCount: number;
  lessons: string[];
  lessonHours: string;
  schoolHours: string;
  parentReviewText: string;
  reviewerName: string;
  rating: number;
  type: 'Anaokulu' | 'İlkokul' | 'Ortaokul' | 'Lise' | 'Yabancı Dil' | 'Tümü';
  sector?: 'Özel Okul' | 'Devlet Okulu';
  averageClassSize?: number;
  branchesCount?: number;
  reviewsCount?: number;
  imagesCount?: number;
  deals?: string[];
  monthlyPrice?: number;
  classSizeCategory?: '1-5 kişilik' | '1-10 kişilik' | '1-15 Kişilik' | '1-20 Kişilik' | '+20 Kişilik';
  educationSystem?: string;
  physicalFacilities?: string[];
  services?: string[];
  activities?: string[];
  languages?: string[];
}

export interface SpecialCourse {
  id: string;
  name: string;
  image: string;
  type: string;
  location: string;
  capacity: number;
  teachersCount: number;
  classes: string[];
  hoursPerWeek: string;
  priceRange: string;
  parentReviewText: string;
  reviewerName: string;
  rating: number;
  branchesCount?: number;
  averageClassSize?: number;
}

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: 'teacher-1',
    name: 'Mehmet Ali Öztürk',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 4.9,
    commentsCount: 38,
    experienceYears: 12,
    experienceLabel: '+10 Yıldan Fazla',
    bio: "2015'ten beri aktif olarak programlama ve yapay zeka eğitimleri vermekteyim. Öğrencilerime teoriden çok iş bulmalarını sağlayacak pratik becerileri kazandırmaya odaklanıyorum.",
    sessions: [
      { name: 'Python ile Sıfırdan İleri Seviye', price: 825, courseId: 'kurs-1' },
      { name: 'Yapay Zeka Destekli Mobil Uygulamaları', price: 1125, courseId: 'kurs-2' }
    ],
    preferredLocation: 'İstanbul Anadolu Yakası',
    canCorporate: true,
    canOnline: true,
    canFaceToFace: true,
    tags: ['Python', 'C#', 'Java', 'Mobil'],
    category: 'Bilişim'
  },
  {
    id: 'teacher-2',
    name: 'Elif Şahin',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    rating: 4.8,
    commentsCount: 24,
    experienceYears: 4,
    experienceLabel: '1-5 Yıl',
    bio: 'Yurt dışı deneyimli İngilizce ve Almanca öğretmeni. Akademik ve Sınav (IELTS, TOEFL) hazırlık odaklı, interaktif metodoloji ile her yaştan kitleye akıcılık kazandırıyorum.',
    sessions: [
      { name: 'Konuşma Odaklı Mesleki İngilizce', price: 650 },
      { name: 'IELTS / TOEFL Nokta Atışı Hazırlık', price: 950 }
    ],
    preferredLocation: 'İstanbul Avrupa Yakası',
    canCorporate: true,
    canOnline: true,
    canFaceToFace: false,
    tags: ['İngilizce', 'Almanca', 'TOEFL'],
    category: 'Dil'
  },
  {
    id: 'teacher-3',
    name: 'Caner Şen',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    rating: 5.0,
    commentsCount: 15,
    experienceYears: 7,
    experienceLabel: '+5 Yıldan Fazla',
    bio: 'TÜBİTAK Olimpiyatlarında derece sahibi Matematik Eğitmeni. Öğrencilerin ders sevgisini artıracak özel formüller ve LGS / YKS taktikleriyle yüksek puan garantili öğretim.',
    sessions: [
      { name: 'Lise İleri Matematik ve Geometri', price: 750 },
      { name: 'LGS Derece Garantili Matematik Kampı', price: 890 }
    ],
    preferredLocation: 'İstanbul Anadolu Yakası',
    canCorporate: false,
    canOnline: true,
    canFaceToFace: true,
    tags: ['Matematik', 'LGS', 'YKS'],
    category: 'Lise/Sınav'
  },
  {
    id: 'teacher-4',
    name: 'Selin Aktaş',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    rating: 4.6,
    commentsCount: 6,
    experienceYears: 1,
    experienceLabel: 'Yeni',
    bio: 'Sanat akademisi mezunu, çocuk yaş grubu ve yetişkinler için yağlı boya ve dijital illüstrasyon mentörü. İçinizdeki sanatçıyı keşfetmek için harika bir adımla başlıyoruz.',
    sessions: [
      { name: 'Figma ile Dijital Karakter Çizimi', price: 500, courseId: 'kurs-3' },
      { name: 'Temel Yağlı Boya Teknikleri Atölyesi', price: 600 }
    ],
    preferredLocation: 'İstanbul Beyoğlu',
    canCorporate: true,
    canOnline: false,
    canFaceToFace: true,
    tags: ['Sanat', 'Resim', 'Figma', 'İllüstrasyon'],
    category: 'Sanat'
  },
  {
    id: 'teacher-5',
    name: 'Deniz Soylu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    rating: 4.9,
    commentsCount: 42,
    experienceYears: 15,
    experienceLabel: '+10 Yıldan Fazla',
    bio: 'Eski milli sporcu ve akademisyen. Çocuklar ve yetişkinler için duruş bozuklukları düzeltme, kişiye özel atletizm ve yüzme koordinasyon dersleri ile bizzat evinizde koçluk.',
    sessions: [
      { name: 'Kardiyo ve Duruş Bozukluğu Terapisi', price: 1200 },
      { name: 'Masa Başı Çalışanlar İçin Postür Atölyesi', price: 1000 }
    ],
    preferredLocation: "Ankara'nın Tamamı",
    canCorporate: true,
    canOnline: true,
    canFaceToFace: true,
    tags: ['Spor', 'Sağlık', 'Postür', 'Koçluk'],
    category: 'Spor'
  },
  {
    id: 'teacher-6',
    name: 'Ayşe Karaca',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    rating: 4.7,
    commentsCount: 11,
    experienceYears: 6,
    experienceLabel: '+5 Yıldan Fazla',
    bio: 'Yaratıcı Drama ve Hızlı Okuma Uzmanı. İlköğretim çağındaki çocukların odaklanma sürelerini artırma, kitap okumayı sevdirme ve sınav kaygılarını minimize etme seansları.',
    sessions: [
      { name: 'İlköğretim Hızlı Okuma Eğitimi', price: 680 },
      { name: 'Çocuklar İçin Yaratıcı Drama', price: 590 }
    ],
    preferredLocation: 'İstanbul Anadolu Yakası',
    canCorporate: false,
    canOnline: true,
    canFaceToFace: true,
    tags: ['İlköğretim', 'Drama', 'Hızlı Okuma'],
    category: 'İlköğretim'
  }
];

export const MOCK_PRIVATE_SCHOOLS: PrivateSchool[] = [
  {
    id: 'school-1',
    name: 'İstanbul Anadolu Bilim Koleji',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    location: 'İstanbul / Kadıköy / Göztepe',
    capacity: 450,
    teachersCount: 38,
    type: 'Lise',
    lessons: ['Fen Olimpiyatları', 'Robotik Kodlama', 'Girişimcilik ve Finans'],
    lessonHours: 'Haftalık 42 Ders Saati',
    schoolHours: '08:30 - 16:30 (Tam Zamanlı)',
    parentReviewText: 'Oğlumuz bu okula başladığından beri bilim olimpiyatlarına merak saldı. Robotik laboratuvarları ve öğretmen kalitesi birinci sınıf.',
    reviewerName: 'Ahmet & Canan Yeşildere',
    rating: 4.9,
    sector: 'Özel Okul',
    averageClassSize: 16,
    branchesCount: 5,
    reviewsCount: 44,
    imagesCount: 12,
    deals: ['%30 İndirim', 'Kampanya', 'Yaz Okulu'],
    monthlyPrice: 12500,
    classSizeCategory: '1-20 Kişilik',
    educationSystem: 'Çoklu Zeka Modeli',
    physicalFacilities: ['Yemekhane', 'Bilgisayar Laboratuvarı', 'Kapalı Spor Salonu', 'Konferans Salonu'],
    services: ['Güvenlik', 'Rehberlik', 'Servis'],
    activities: ['Futbol', 'Basketbol', 'Masa Tenisi'],
    languages: ['İngilizce', 'Almanca']
  },
  {
    id: 'school-2',
    name: 'Avrupa Lisan ve Sanat Koleji',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
    location: 'İstanbul / Beşiktaş / Bebek',
    capacity: 320,
    teachersCount: 29,
    type: 'İlkokul',
    lessons: ['Akıcı İngilizce (Cambridge)', 'B2 Fransızca / Almanca', 'Drama ve Yağlı Boya'],
    lessonHours: 'Haftalık 36 Ders Saati',
    schoolHours: '09:00 - 15:30 (Yarım/Tam Opsiyonu)',
    parentReviewText: 'İki dilli eğitim iddiasını gerçekten hakkıyla yerine getiren nadir okullardan. Dönem sonlarında harika tiyatro oyunları sahneliyorlar.',
    reviewerName: 'Yasemin Güneş',
    rating: 4.7,
    sector: 'Özel Okul',
    averageClassSize: 12,
    branchesCount: 3,
    reviewsCount: 32,
    imagesCount: 8,
    deals: ['%15 Erken Kayıt', 'Kampanya'],
    monthlyPrice: 14000,
    classSizeCategory: '1-15 Kişilik',
    educationSystem: 'Montessori Eğitimi',
    physicalFacilities: ['Yemekhane', 'Havuz', 'Bilgisayar Laboratuvarı', 'Konferans Salonu'],
    services: ['Güvenlik', 'Rehberlik', 'Yaz Okulu', 'Organik Beslenme'],
    activities: ['Voleybol', 'Judo', 'Masa Tenisi'],
    languages: ['İngilizce', 'Fransızca', 'Almanca']
  },
  {
    id: 'school-3',
    name: 'Yedi Tepe Akıllı Doğa Koleji',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    location: 'İstanbul / Üsküdar / Kısıklı',
    capacity: 600,
    teachersCount: 45,
    type: 'Ortaokul',
    lessons: ['Yapay Zeka Destekli Derslikler', 'Ekolojik Tarım Atölyesi', 'Sürdürülebilir Tasarım'],
    lessonHours: 'Haftalık 40 Ders Saati',
    schoolHours: '08:15 - 16:00',
    parentReviewText: 'Bahçesindeki tarım uygulamaları ve çocukların kendi sebzelerini yetiştirmesi çok ince düşünülmüş bir vizyon. Tavsiye ederim.',
    reviewerName: 'Murat Kara',
    rating: 4.8,
    sector: 'Özel Okul',
    averageClassSize: 18,
    branchesCount: 8,
    reviewsCount: 56,
    imagesCount: 22,
    deals: ['%20 İndirim', 'Yaz Okulu'],
    monthlyPrice: 11000,
    classSizeCategory: '1-20 Kişilik',
    educationSystem: 'Eklektik Yaklaşım',
    physicalFacilities: ['Yemekhane', 'Havuz', 'Kapalı Spor Salonu', 'Futbol Sahası'],
    services: ['Güvenlik', 'Rehberlik', 'Servis', 'Hafta sonu Eğitim', 'Organik Beslenme'],
    activities: ['Futbol', 'Voleybol', 'Basketbol', 'Su Topu'],
    languages: ['İngilizce', 'İspanyolca', 'İtalyanca']
  },
  {
    id: 'school-4',
    name: 'Kısıklı Devlet Klasik Anadolu Lisesi',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    location: 'İstanbul / Üsküdar / Kısıklı',
    capacity: 700,
    teachersCount: 48,
    type: 'Lise',
    lessons: ['YKS Nokta Atışı', 'Edebiyat Atölyeleri', 'Kütüphane Araştırmaları'],
    lessonHours: 'Haftalık 35 Ders Saati',
    schoolHours: '08:00 - 15:30',
    parentReviewText: 'Devlet okulu olmasına rağmen son derece disiplinli, öğretmenleri idealist ve canla başla çalışıyorlar.',
    reviewerName: 'Metin Sancaklı',
    rating: 4.5,
    sector: 'Devlet Okulu',
    averageClassSize: 24,
    branchesCount: 1,
    reviewsCount: 19,
    imagesCount: 6,
    deals: [],
    monthlyPrice: 400,
    classSizeCategory: '+20 Kişilik',
    educationSystem: 'MEB Odaklı Eğitim',
    physicalFacilities: ['Yemekhane', 'Kapalı Spor Salonu', 'Konferans Salonu'],
    services: ['Güvenlik', 'Rehberlik'],
    activities: ['Futbol', 'Voleybol', 'Basketbol'],
    languages: ['İngilizce', 'Almanca']
  },
  {
    id: 'school-5',
    name: 'Mutlu Yumurcaklar Montessori Anaokulu',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80',
    location: 'İstanbul / Maltepe / Küçükyalı',
    capacity: 120,
    teachersCount: 12,
    type: 'Anaokulu',
    lessons: ['Duyu Gelişimi', 'Ahşap Oyuncak Atölyesi', 'Müzik ve Ritim'],
    lessonHours: 'Haftalık 30 Ders Saati',
    schoolHours: '08:30 - 17:00 (Tam Gün)',
    parentReviewText: 'Kızımızın bireysel becerileri o kadar gelişti ki, kendi yemeğini kendi hazırlıyor ve her şeyi topluyor. Montessori felsefesini tam uyguluyorlar.',
    reviewerName: 'Melis Atasoy',
    rating: 4.9,
    sector: 'Özel Okul',
    averageClassSize: 8,
    branchesCount: 2,
    reviewsCount: 15,
    imagesCount: 9,
    deals: ['%10 Kardeş İndirimi', 'Yaz Okulu'],
    monthlyPrice: 9500,
    classSizeCategory: '1-10 kişilik',
    educationSystem: 'Montessori Eğitimi',
    physicalFacilities: ['Yemekhane', 'Kapalı Spor Salonu'],
    services: ['Güvenlik', 'Rehberlik', 'Organik Beslenme'],
    activities: ['Judo', 'Masa Tenisi'],
    languages: ['İngilizce']
  }
];

export const MOCK_SPECIAL_COURSES: SpecialCourse[] = [
  {
    id: 'spec-1',
    name: 'Metropol LGS & YKS Hazırlık Akademisi',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    type: 'YKS',
    location: 'İstanbul / Ataşehir / Atatürk Mah.',
    capacity: 150,
    teachersCount: 14,
    classes: ['Sayısal Derece Grubu', 'Eşit Ağırlık Nokta Atışı', 'Geometri Pratik Atölyesi'],
    hoursPerWeek: 'Haftalık 16 Saat Etüt + Deneme',
    priceRange: '₺125.000',
    parentReviewText: 'Kızım geçen sene YKS sayısal alanda ilk 15 bin içerisine girdi. Rehberlik ve deneme takip sistemleri muhteşemdi.',
    reviewerName: 'Süreyya Özcan',
    rating: 4.9,
    branchesCount: 5,
    averageClassSize: 6
  },
  {
    id: 'spec-2',
    name: 'Vera Güzel Sanatlar & Konservatuar Atölyesi',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    type: 'Yetenek Sınavları',
    location: 'İstanbul / Kadıköy / Göztepe',
    capacity: 80,
    teachersCount: 8,
    classes: ['Güzel Sanatlara Hazırlık Portfolyosu', 'Piyano & Keman Metodolojisi', 'Heykel / Seramik'],
    hoursPerWeek: 'Haftalık 12 Saat Birebir Atölye',
    priceRange: '₺15.000',
    parentReviewText: 'Resim yeteneği olan oğlumu Mimar Sinan sınavlarına hazırladılar ve kazandık! Eğitmenler inanılmaz ilgili.',
    reviewerName: 'Bülent Alkan',
    rating: 5.0,
    branchesCount: 2,
    averageClassSize: 4
  },
  {
    id: 'spec-3',
    name: 'Emniyet Direksiyon & Güvenli Sürüş Kursu',
    image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=600&q=80',
    type: 'Sürücü Kursu',
    location: 'İstanbul / Şişli / Merkez',
    capacity: 250,
    teachersCount: 12,
    classes: ['Manuel/Otomatik Vites B Sınıfı', 'İleri Sürüş ve Defansif Teknikler', 'Simülasyonlu Park Eğitimi'],
    hoursPerWeek: 'Haftalık 16 Saat Direksiyon',
    priceRange: '₺12.500',
    parentReviewText: 'Sürüş fobisi olan biri olarak sabırla bana trafiği öğrettiler. İlk sınavda ehliyeti aldım, çok minnettarım.',
    reviewerName: 'Gizem Yıldız',
    rating: 4.6,
    branchesCount: 3,
    averageClassSize: 1
  }
];
