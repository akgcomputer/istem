import { Course, Category, Employee, Certificate } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'yazilim',
    name: 'Yazılım',
    iconName: 'Code2',
    description: 'Modern Frameworkler ve Programlama Dilleri',
    topSkills: ['React/Next.js', 'TypeScript', 'Node.js/Express', 'Full-stack Mimari', 'PostgreSQL']
  },
  {
    id: 'veri',
    name: 'Veri Bilimi & AI',
    iconName: 'BrainCircuit',
    description: 'Yapay Zeka ve Büyük Veri Analitiği',
    topSkills: ['Python & Pandas', 'RAG Sistemleri', 'LLM Prompt Engineering', 'Machine Learning', 'SQL / NoSQL']
  },
  {
    id: 'tasarim',
    name: 'Tasarım / UI-UX',
    iconName: 'Figma',
    description: 'Kullanıcı Deneyimi ve Arayüz Tasarımı',
    topSkills: ['Figma Prototipleme', 'Tasarım Sistemleri', 'Kullanıcı Psikolojisi', 'Bölünmüş Testler (A/B)', 'Motion Design']
  },
  {
    id: 'diller',
    name: 'Diller',
    iconName: 'Languages',
    description: 'Global İletişim Akıcılığı',
    topSkills: ['Mesleki İngilizce', 'Almanca A1-B2', 'Kusursuz Sunum Kürasyonu', 'Yazışma Kültürü']
  },
  {
    id: 'mühendislik',
    name: 'Mühendislik & Bulut',
    iconName: 'Cloud',
    description: 'DevOps, Güvenlik ve Altyapı Yönetimi',
    topSkills: ['Docker & Kubernetes', 'AWS / Cloudflare', 'Sızma Testleri', 'Siber Güvenlik Standartları', 'Linux Bash']
  },
  {
    id: 'kisisel',
    name: 'Kişisel Gelişim',
    iconName: 'Sparkles',
    description: 'Liderlik ve Verimli Çalışma Modelleri',
    topSkills: ['Zaman Yönetimi', 'Etkin Sunum Teknikleri', 'Finansal Okuryazarlık', 'SaaS Girişimciliği']
  }
];

import { GENERATED_COURSES } from './data/generated';

export const COURSES: Course[] = [
  ...GENERATED_COURSES,
  {
    id: 'kurs-1',
    title: '12 Haftalık Full-Stack Next.js & Serverless Cohort',
    category: 'Yazılım',
    level: 'Orta',
    duration: '12 Hafta',
    price: 18500,
    enrolledCount: 1420,
    rating: 4.9,
    instructorName: 'Murat Caner',
    instructorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    instructorBio: 'Eski Amazon Kıdemli Engineer, Full-Stack Mimarı ve Açık Kaynak Geliştirici.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    hasChallenge: true,
    hasCohort: true,
    lessonsCount: 6,
    xpReward: 480,
    isPremiumIncluded: true,
    capstoneTitle: 'Gerçek Zamanlı SaaS Fatura Yönetim SaaS Uygulaması',
    capstoneDesc: 'Fark: D1 Cloudflare SQL ve Clerk Auth kullanarak baştan sona canlı, fatura PDF üreten ve webhook entegrasyonu olan tam teşekküllü bir SaaS ürünü ayağa kaldıracaksınız.',
    benefits: [
      'Birebir haftalık canlı Kod İncelemesi',
      'Komisyonsuz eğitim pazarında ömür boyu erişim',
      'Sektör Lideri firmalara direkt CV paylaşım hakkı'
    ],
    lessons: [
      {
        id: 'k1-l1',
        title: 'Bölüm 1: Next.js App Router & Server Component Mimari Sırları',
        duration: '45 dk',
        isLocked: false,
        isCompleted: true,
        quizQuestion: 'React Server Components (RSC) ile Client Components arasındaki temel fark nedir?',
        quizOptions: [
          'RSC sadece client tarafında render edilir.',
          'RSC bundle boyutunu sıfıra indirerek sunucuda render edilir ve client tarafına HTML-gibi veri akışı sağlar.',
          'Client components sunucuya hiçbir zaman istek atamaz.',
          'Arasında hiçbir render farkı bulunmamaktadır.'
        ],
        quizAnswer: 1
      },
      {
        id: 'k1-l2',
        title: 'Bölüm 2: PostgreSQL ve Prisma ile Veri Modelleme Kurulumu',
        duration: '50 dk',
        isLocked: false,
        isCompleted: true,
        quizQuestion: 'Prisma şemasında "db push" ile "migrate dev" komutu arasındaki temel kullanım farkı nedir?',
        quizOptions: [
          'migrate dev üretim veritabanlarında doğrudan kullanılırken db push kilitleri çözer.',
          'migrate dev migration dosyası oluşturup geçmişi izler, db push ise lokal prototip veritabanını iz bırakmadan hızlıca eşitler.',
          'db push sadece SQL veritabanlarında çalışır.',
          'İkisi de tamamen aynı işlevi görür.'
        ],
        quizAnswer: 1
      },
      {
        id: 'k1-l3',
        title: 'Bölüm 3: Server Actions ile Form İşleme ve Revalidation',
        duration: '38 dk',
        isLocked: false,
        isCompleted: false,
        quizQuestion: 'Server Actions çağrısında "useActionState" hook\'u ne için kullanılır?',
        quizOptions: [
          'Client-side form submit işlemlerini önlemek için.',
          'Form durumu, dönen hata mesajları ve bekletme (pending) state\'lerini kolayca yönetebilmek için.',
          'Veritabanı bağlantı şifresini şifrelemek için.',
          'Videonun hızını değiştirmek için.'
        ],
        quizAnswer: 1
      },
      {
        id: 'k1-l4',
        title: 'Bölüm 4: Edge Middleware ve Gelişmiş Şifreleme Yöntemleri',
        duration: '41 dk',
        isLocked: true,
        isCompleted: false
      },
      {
        id: 'k1-l5',
        title: 'Bölüm 5: Capstone Challenge: Stripe Webhook Entegrasyonu',
        duration: '60 dk',
        isLocked: true,
        isCompleted: false
      },
      {
        id: 'k1-l6',
        title: 'Bölüm 6: Cloudflare Edge Deploy ve Vercel Karşılaştırmalı Optimizasyon',
        duration: '30 dk',
        isLocked: true,
        isCompleted: false
      }
    ]
  },
  {
    id: 'kurs-2',
    title: 'Üretken Yapay Zeka (AI) ve Gemini API ile RAG Geliştirme',
    category: 'Yapay Zeka',
    level: 'İleri',
    duration: '6 Hafta',
    price: 14200,
    enrolledCount: 920,
    rating: 4.8,
    instructorName: 'Dr. Aylin Yılmaz',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    instructorBio: 'Yapay Zeka Profesörü, NLP Araştırmacısı ve Teknoloji Girişimcisi.',
    image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=600&q=80',
    hasChallenge: true,
    hasCohort: false,
    lessonsCount: 4,
    xpReward: 350,
    isPremiumIncluded: false,
    capstoneTitle: 'Kişisel PDF Analiz Eden Yapay Zeka Ajanı',
    capstoneDesc: 'Fark: Pinecone Vektör Veritabanı ve Gemini 2.5 Flash entegre ederek, yüklediğiniz yüzlerce sayfalık raporları saniyeler içinde analiz eden ve kaynakça göstererek cevaplayan bir RAG kuracaksınız.',
    benefits: [
      'Vektör veritabanı mekaniği',
      'System Prompts ile Ajan Yapısı',
      'Maliyet Dostu API Token Optimizasyonu'
    ],
    lessons: [
      {
        id: 'k2-l1',
        title: 'Bölüm 1: Gemini API Entegrasyonu & Modern SDK Kurulumları',
        duration: '35 dk',
        isLocked: false,
        isCompleted: true,
        quizQuestion: 'Gemini model çağrılarında "Temperature" parametresi neye yardımcı olur?',
        quizOptions: [
          'Çıktının ne kadar yaratıcı veya ne kadar deterministik tutarlı olacağını kontrol etmeye.',
          'Modelin çalışma hızını artırmaya.',
          'Token başına harcanan maliyeti azaltmaya.',
          'Modelin desteklediği maksimum dilleri sınırlamaya.'
        ],
        quizAnswer: 0
      },
      {
        id: 'k2-l2',
        title: 'Bölüm 2: Metin Parçalama (Chunking) ve Vektör Veritabanlarına Giriş',
        duration: '45 dk',
        isLocked: false,
        isCompleted: false,
        quizQuestion: 'RAG mimarisinde "Embedding" temel olarak ne anlama gelir?',
        quizOptions: [
          'Metinlerin HTML dosyalarına gömülmesini.',
          'Kelimelerin veya paragrafların semantik anlamlarını temsil eden sayı dizilerine (vektörlere) dönüştürülmesini.',
          'Fotoğrafları AI ile sıkıştırmayı.',
          'Kodların şifreli sunucularda saklanma protokolünü.'
        ],
        quizAnswer: 1
      },
      {
        id: 'k2-l3',
        title: 'Bölüm 3: LangChain ile Ajanik Zincir Tasarımı',
        duration: '40 dk',
        isLocked: true,
        isCompleted: false
      },
      {
        id: 'k2-l4',
        title: 'Bölüm 4: Capstone Projesi: Canlı Deploy & LLM Güvenlik Açıkları Çözümü',
        duration: '55 dk',
        isLocked: true,
        isCompleted: false
      }
    ]
  },
  {
    id: 'kurs-3',
    title: 'Figma ile Sıfırdan İleri Seviye UI/UX Tasarım Sistemi Kurma',
    category: 'Tasarım',
    level: 'Başlangıç',
    duration: '8 Hafta',
    price: 12500,
    enrolledCount: 1840,
    rating: 4.7,
    instructorName: 'Oğuzhan Kaya',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    instructorBio: 'UI/UX Lead Designer, eski Trendyol Tasarımcısı, Design Tokens Evanjelisti.',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80',
    hasChallenge: false,
    hasCohort: true,
    lessonsCount: 3,
    xpReward: 240,
    isPremiumIncluded: true,
    capstoneTitle: 'Tam Kapsamlı Mobil Finans Tasarım Sistemi (Design System)',
    capstoneDesc: 'Fark: Sadece 3 sayfa çizmeyeceksiniz. Typography, Figma Variables, Auto-Layout 5.0 ve Dark Mode destekli 150+ duyarlı bileşenden oluşan premium bir Finansal Tasarım Sistemi yaratacaksınız.',
    benefits: [
      'Tasarım Değişkenleri (Variables) uzmanlığı',
      'Auto-layout ve gelişmiş Prototip ağları',
      'UX araştırması, persona kurma ve kullanıcı testi'
    ],
    lessons: [
      {
        id: 'k3-l1',
        title: 'Bölüm 1: Auto-Layout 5.0 ile Esnek ve Ölçeklenebilir Kartlar Çizmek',
        duration: '55 dk',
        isLocked: false,
        isCompleted: true,
        quizQuestion: 'Figma Auto-layout yapısında "Fill Container" ayarı neyi ifade eder?',
        quizOptions: [
          'Bileşenin içindeki metnin boyutuna göre otomatik daralmasını.',
          'Bileşenin, üstündeki anne (parent) kutunun sınırlarına kadar esneyerek genişlemesini.',
          'Bileşenin yüksekliğinin içeriğe kilitlenmesini.',
          'Resmin piksellerinin bozulmamasını.'
        ],
        quizAnswer: 1
      },
      {
        id: 'k3-l2',
        title: 'Bölüm 2: Multi-Brand Tasarımlar için Design Variables & Token Kurulumu',
        duration: '65 dk',
        isLocked: false,
        isCompleted: false,
        quizQuestion: 'Design Tokens kullanmanın en büyük faydası nedir?',
        quizOptions: [
          'Çizilen görsellerin daha hızlı indirilmesi.',
          'Tasarım ve kod arasındaki renk, boşluk gibi değerleri tek bir kaynaktan yöneterek kolayca eşitlemek.',
          'Figma abonelik ücretini düşürmek.',
          'Daha çok görsel efekt uygulamak.'
        ],
        quizAnswer: 1
      },
      {
        id: 'k3-l3',
        title: 'Bölüm 3: Capstone Challenge: Üst Düzey Mikro-Etkileşim Mobil Prototipleme',
        duration: '75 dk',
        isLocked: true,
        isCompleted: false
      }
    ]
  }
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Anıl Altan',
    email: 'anil.altan@firma.com',
    assignedCourses: ['kurs-1', 'kurs-2'],
    progress: { 'kurs-1': 82, 'kurs-2': 35 },
    topSkill: 'TypeScript'
  },
  {
    id: 'emp-2',
    name: 'Buse Şener',
    email: 'buse.sener@firma.com',
    assignedCourses: ['kurs-1', 'kurs-3'],
    progress: { 'kurs-1': 100, 'kurs-3': 45 },
    topSkill: 'React App Router'
  },
  {
    id: 'emp-3',
    name: 'Caner Özçelik',
    email: 'caner.ozcelik@firma.com',
    assignedCourses: ['kurs-2'],
    progress: { 'kurs-2': 12 },
    topSkill: 'Python Analiz'
  },
  {
    id: 'emp-4',
    name: 'Damla Güler',
    email: 'damla.guler@firma.com',
    assignedCourses: ['kurs-3'],
    progress: { 'kurs-3': 90 },
    topSkill: 'Figma Variables'
  }
];

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    studentName: 'Gamze Çelik',
    courseTitle: '12 Haftalık Full-Stack Next.js & Serverless Cohort',
    issueDate: '01.06.2026',
    verificationId: 'NEXT-9842-12',
    grade: 'Pekiyi (AA - 96/100)',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/verify/NEXT-9842-12'
  },
  {
    id: 'cert-2',
    studentName: 'Burak Ertuğrul',
    courseTitle: 'Üretken Yapay Zeka (AI) ve Gemini API ile RAG Geliştirme',
    issueDate: '12.05.2026',
    verificationId: 'GEMINI-3421-08',
    grade: 'Başarılı (BB - 85/100)',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/verify/GEMINI-3421-08'
  },
  {
    id: 'cert-3',
    studentName: 'Meltem Tan',
    courseTitle: 'Figma ile Sıfırdan İleri Seviye UI/UX Tasarım Sistemi Kurma',
    issueDate: '28.04.2026',
    verificationId: 'UIUX-5520-22',
    grade: 'Mükemmel (AA - 98/100)',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/verify/UIUX-5520-22'
  }
];
