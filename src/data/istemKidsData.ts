export type IstemKidsRole = 'veli' | 'ogretmen' | 'kurum_sahibi' | 'servis_gorevlisi';

// Web Audio API Melodic Chime Generator (Neither a short harsh beep nor a long song — pleasant 2.2s 3-note chime)
export function playMelodicChime(type: 'lesson' | 'medicine' | 'shuttle' | 'request' = 'lesson') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const patterns: Record<string, number[]> = {
      lesson: [523.25, 659.25, 783.99, 1046.5], // C5 - E5 - G5 - C6 (Warm school chime)
      medicine: [587.33, 739.99, 880.0],        // D5 - F#5 - A5 (Gentle health reminder)
      shuttle: [440.0, 554.37, 659.25],         // A4 - C#5 - E5 (Shuttle arrival)
      request: [659.25, 523.25, 783.99]         // E5 - C5 - G5 (Door knock / request chime)
    };

    const notes = patterns[type] || patterns.lesson;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.28);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.28);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.28 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.28 + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.28);
      osc.stop(ctx.currentTime + idx * 0.28 + 0.7);
    });
  } catch {
    // AudioContext blocked or unsupported
  }
}

export interface KidsLessonBellSlot {
  id: string;
  title: string;
  type: 'ders' | 'teneffus' | 'yemek' | 'uyku';
  startTime: string;
  endTime: string;
  remainingMinutes: number;
  isCurrent: boolean;
}

export interface ParentRequestTicket {
  id: number;
  studentId: string;
  studentName: string;
  parentName: string;
  templateType:
    | 'Kapıdayım, öğrenciyi teslim alacağım'
    | 'Öğrenciyi erken alma talebi'
    | 'Öğrenciyi geç alacağım / geç getireceğim'
    | 'Öğretmen / Yönetim görüşme talebi'
    | 'Beslenme menüsü görüş / öneri / şikayet';
  recipient: 'Yönetim' | 'Ayşe Yılmaz (Sınıf Öğretmeni)' | 'Elif Kaya (Sınıf Öğretmeni)';
  shortNote: string; // max 140 chars
  createdAt: string;
  status: 'Yeni İletildi' | 'Görülüyor / Hazırlanıyor' | 'Tamamlandı ✅';
}

export interface KidsMedicineItem {
  id: number;
  diseaseName: string; // Salgın kontrolü: hastalık adı veya "Hastalığın adı girilmedi"
  medicineName: string;
  time: string;
  stomachStatus: 'Tok Karnına' | 'Aç Karnına';
  howToGive: string; // Örn: Su ile karıştırarak, meyve püresiyle, doğrudan ölçekle
  durationText: string; // Örn: İlaç bitene kadar, 5 gün boyunca
  enteredBy: 'Veli' | 'Yönetim';
  given: boolean;
  givenBy?: string;
  givenAt?: string;
}

export interface KidsDiaperLog {
  id: number;
  time: string;
  type: 'Islak' | 'Normal' | 'Krem Uygulandı';
  note: string;
}

export interface KidsPickupPerson {
  id: string;
  studentId: string;
  studentName: string;
  personName: string;
  relation: string;
  phone: string;
  code: string;
  verified: boolean;
}

export interface KidsCompetencyItem {
  id: string;
  category: 'Bilişsel & Dil' | 'İnce & Kaba Motor' | 'Sosyal & Duygusal' | 'Özbakım Becerileri';
  skillTitle: string;
  status: 'Kazanıldı 🌟' | 'Gelişiyor 🌱' | 'Destekleniyor 🎯';
  progressPercent: number;
  teacherNote: string;
}

export interface KidsStudentRecord {
  id: string;
  passportId: string;
  name: string;
  birthDate: string;
  heightCm: number;
  weightKg: number;
  ageLabel: string;
  ageGroup: '0-3' | '3-6';
  className: string;
  avatar: string;
  parentName: string;
  parentPhone: string;
  parentUsername: string;
  allergies: string[];
  attendance: 'geldi' | 'gelmedi' | 'izinli';
  // Default meal rule: true = Yemeğini Yedi (default), teacher only marks false if child didn't eat!
  ateBreakfast: boolean;
  ateLunch: boolean;
  ateSnack: boolean;
  mealExceptionNote?: string;
  sleepStatus: 'Mışıl Mışıl Uyudu (13:00-14:30)' | 'Dinlendi (Uyumadı)' | 'Kısa Uyudu (45 dk)';
  mood: 'Çok Neşeli & Paylaşımcı 😊' | 'Sakin & Gözlemci 🌿' | 'Biraz Yorgun 🧸';
  activities: string[];
  diaperLogs: KidsDiaperLog[];
  teacherDailyNote: string;
  medicines: KidsMedicineItem[];
  competencies: KidsCompetencyItem[];
  tuitionAmount: number;
  tuitionPaid: boolean;
  invoiceNo?: string;
}

export interface SequentialShuttleStop {
  stopOrder: number;
  studentId: string;
  studentName: string;
  className: string;
  avatar: string;
  addressStop: string;
  plannedTime: string;
  parentName: string;
  parentPhone: string;
  // Morning / Evening exception & sequential status
  status:
    | 'Sırada Bekliyor'
    | 'Önceki Durak Tamamlandı — Hazırlanın 🔔'
    | 'Servise Bindi (Okula Gidiyor / Eve Dönüyor) 🚌'
    | 'Veli: Çocuğu Servise Verdim / Teslim Aldım ✅'
    | 'Bugün Gelmedi (Atlandı)'
    | 'Öğlen Velisi Okuldan Aldı (Akşam Serviste Yok)'
    | 'Sabah Gelmedi — Akşam Dönüş Rotasına Eklendi';
  completed: boolean;
}

export interface KidsAnnouncement {
  id: number;
  title: string;
  content: string;
  date: string;
  tag: 'Önemli Duyuru' | 'Resmi Duyuru' | 'Hatırlatma' | 'Normal Duyuru';
  priorityWeight: number; // 4 = Önemli, 3 = Resmi, 2 = Hatırlatma, 1 = Normal
}

export interface KidsSocialMediaConsent {
  studentId: string;
  studentName: string;
  parentName: string;
  decision: 'Bekliyor' | 'İzin Veriyorum ✅' | 'İzin Vermiyorum ❌';
  decidedAt?: string;
}

export interface KidsDiaryPost {
  id: number;
  className: string;
  teacherName: string;
  timeAgo: string;
  caption: string;
  images: string[];
  scope: 'Tek Öğrenci' | 'Tüm Sınıf (Grup)';
  socialMediaRequested: boolean;
  socialMediaPlatform?: 'Instagram & YouTube Resmi Hesabı';
  consents: KidsSocialMediaConsent[];
}

export interface DemoRoleAccount {
  role: IstemKidsRole;
  roleLabel: string;
  badge: string;
  username: string;
  password: string;
  institutionCode: string;
  fullName: string;
  summary: string;
}

export const ISTEM_KIDS_DEMO_ACCOUNTS: DemoRoleAccount[] = [
  {
    role: 'veli',
    roleLabel: '👨‍👩‍👧 Veli & Öğrenci',
    badge: 'Açık Tema • Veli Portalı',
    username: 'fatihsari',
    password: '141346',
    institutionCode: 'zerdalikres',
    fullName: 'Fatih Sarı (Zeynep Sarı Veli)',
    summary: 'Ders zili sayacı, Hızlı Talebini İlet, Sıralı Servis Onayı, Salgın/İlaç Çizelgesi, Kreşten Günlükler (KVKK İzinli) ve Kazanımlar.'
  },
  {
    role: 'ogretmen',
    roleLabel: '👩‍🏫 Sınıf Öğretmeni',
    badge: 'Açık Tema • Hızlı Sınıf',
    username: 'ayseogretmen',
    password: '141346',
    institutionCode: 'zerdalikres',
    fullName: 'Ayşe Yılmaz (Papatyalar Sınıf Öğretmeni)',
    summary: 'Sadece yemeyeni işaretleme, sesli ilaç saati onayı, günlük karne/kazanım girişi ve sosyal medya veli izin talebi.'
  },
  {
    role: 'servis_gorevlisi',
    roleLabel: '🚌 Servis & Hostes',
    badge: 'Açık Tema • Sıralı Rota',
    username: 'servishostesi',
    password: '141346',
    institutionCode: 'zerdalikres',
    fullName: 'Derya Demir & Murat Kaptan (34 IST 424)',
    summary: 'Sıra atlanamayan durak (Root) yönetimi, bir sonraki veliye otomatik bildirim ve sabah/akşam istisna takibi.'
  },
  {
    role: 'kurum_sahibi',
    roleLabel: '🏛️ Kurum & Stok Pratik Yönetimi',
    badge: 'Koyu Tema • Yönetim & ERP',
    username: 'zerdalimudur',
    password: '141346',
    institutionCode: 'zerdalikres',
    fullName: 'Selma Karahan (Kurucu Müdür)',
    summary: 'Kayıt, Eğitim, Sağlık, Servis, Raporlar, Ajanda, Aylık Ders Zili Planı ve Stok Pratik Muhasebe/Depo.'
  }
];

export const INITIAL_LESSON_BELL_SLOTS: KidsLessonBellSlot[] = [
  {
    id: 'slot-1',
    title: 'Sabah Karşılama & Kahvaltı Saati',
    type: 'yemek',
    startTime: '08:30',
    endTime: '09:15',
    remainingMinutes: 0,
    isCurrent: false
  },
  {
    id: 'slot-2',
    title: '1. Ders: Ekoloji & Doğa Atölyesi',
    type: 'ders',
    startTime: '09:15',
    endTime: '10:00',
    remainingMinutes: 14,
    isCurrent: true
  },
  {
    id: 'slot-3',
    title: 'Teneffüs & Serbest Oyun Molası',
    type: 'teneffus',
    startTime: '10:00',
    endTime: '10:20',
    remainingMinutes: 20,
    isCurrent: false
  },
  {
    id: 'slot-4',
    title: '2. Ders: Orff Müzik & İngilizce Drama',
    type: 'ders',
    startTime: '10:20',
    endTime: '11:10',
    remainingMinutes: 50,
    isCurrent: false
  },
  {
    id: 'slot-5',
    title: 'Diyetisyen Onaylı Öğle Yemeği',
    type: 'yemek',
    startTime: '12:00',
    endTime: '12:45',
    remainingMinutes: 45,
    isCurrent: false
  },
  {
    id: 'slot-6',
    title: 'Öğle Uykusu & Masal Dinlenme Saati',
    type: 'uyku',
    startTime: '13:00',
    endTime: '14:30',
    remainingMinutes: 90,
    isCurrent: false
  }
];

export const INITIAL_KIDS_STUDENTS: KidsStudentRecord[] = [
  {
    id: 'zeynep',
    passportId: 'IST-KIDS-2022-0418',
    name: 'Zeynep Sarı',
    birthDate: '14 Mayıs 2022',
    heightCm: 104,
    weightKg: 16.8,
    ageLabel: '4 Yaş (Okul Öncesi)',
    ageGroup: '3-6',
    className: 'Papatyalar Sınıfı (4 Yaş)',
    avatar: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=300&q=80',
    parentName: 'Fatih & Esra Sarı',
    parentPhone: '0532 410 22 33',
    parentUsername: 'fatihsari',
    allergies: ['Yer Fıstığı Hassasiyeti'],
    attendance: 'geldi',
    ateBreakfast: true,
    ateLunch: true,
    ateSnack: true,
    sleepStatus: 'Mışıl Mışıl Uyudu (13:00-14:30)',
    mood: 'Çok Neşeli & Paylaşımcı 😊',
    activities: ['Ekoloji & Toprak Atölyesi', 'Orff Müzik & Ritim', 'İngilizce Oyun Saati'],
    diaperLogs: [],
    teacherDailyNote: 'Zeynep bugün ekoloji bahçesinde tohum ekiminde arkadaşlarına liderlik etti.',
    medicines: [
      {
        id: 101,
        diseaseName: 'Mevsimsel Üst Solunum Hassasiyeti (Bulaşıcı Değil)',
        medicineName: 'D Vitamini Damla',
        time: '13:00',
        stomachStatus: 'Tok Karnına',
        howToGive: 'Su ile karıştırarak',
        durationText: 'İlaç bitene kadar',
        enteredBy: 'Veli',
        given: true,
        givenBy: 'Ayşe Yılmaz',
        givenAt: '13:04'
      },
      {
        id: 102,
        diseaseName: 'Hastalığın adı girilmedi',
        medicineName: 'Bitkisel Ihlamur & Propolis Şurubu',
        time: '15:30',
        stomachStatus: 'Tok Karnına',
        howToGive: 'Doğrudan ölçekle (5 ml)',
        durationText: '5 Gün Boyunca',
        enteredBy: 'Veli',
        given: false
      }
    ],
    competencies: [
      {
        id: 'comp-1',
        category: 'Bilişsel & Dil',
        skillTitle: 'İngilizce Renk ve Doğa Kavramlarını Tanıma (25+ Kelime)',
        status: 'Kazanıldı 🌟',
        progressPercent: 95,
        teacherNote: 'Oyun içinde İngilizce yönergeleri anında uyguluyor.'
      },
      {
        id: 'comp-2',
        category: 'İnce & Kaba Motor',
        skillTitle: 'Makas Kullanımı, Çizgi Takibi ve Ahşap Blok Dengesi',
        status: 'Kazanıldı 🌟',
        progressPercent: 90,
        teacherNote: 'İnce motor kas kontrolü yaş grubunun üzerinde.'
      },
      {
        id: 'comp-3',
        category: 'Sosyal & Duygusal',
        skillTitle: 'Grup Oyunlarında Sıra Bekleme ve Empati Kurma',
        status: 'Gelişiyor 🌱',
        progressPercent: 82,
        teacherNote: 'Liderlik yönü güçlü, paylaşım becerisi çok güzel ilerliyor.'
      },
      {
        id: 'comp-4',
        category: 'Özbakım Becerileri',
        skillTitle: 'Yemek Sonrası El-Ağız Temizliği ve Kıyafet Düzeni',
        status: 'Kazanıldı 🌟',
        progressPercent: 100,
        teacherNote: 'Tamamen bağımsız olarak özbakımını yapıyor.'
      }
    ],
    tuitionAmount: 18500,
    tuitionPaid: false
  },
  {
    id: 'aliefe',
    passportId: 'IST-KIDS-2024-0892',
    name: 'Ali Efe Kaya',
    birthDate: '10 Kasım 2024',
    heightCm: 88,
    weightKg: 12.6,
    ageLabel: '2 Yaş (Oyun & Bebek Grubu)',
    ageGroup: '0-3',
    className: 'Minik Kalpler Sınıfı (0-3 Yaş)',
    avatar: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=300&q=80',
    parentName: 'Murat & Elif Kaya',
    parentPhone: '0535 210 44 19',
    parentUsername: 'muratkaya',
    allergies: ['Yumurta Akı Hassasiyeti'],
    attendance: 'geldi',
    ateBreakfast: true,
    ateLunch: true,
    ateSnack: true,
    sleepStatus: 'Mışıl Mışıl Uyudu (13:00-14:30)',
    mood: 'Sakin & Gözlemci 🌿',
    activities: ['Duyusal Kinetik Kum Oyunu', 'Parmak Boyası', 'Masal & Uyku Rutini'],
    diaperLogs: [
      { id: 1, time: '10:15', type: 'Islak', note: 'Sabah kahvaltısı sonrası bez değişimi yapıldı.' },
      { id: 2, time: '12:50', type: 'Normal', note: 'Öğle uykusu öncesi bez değişimi + krem uygulandı.' }
    ],
    teacherDailyNote: 'Ali Efe duyusal oyun saatinde renkli toplarla çok güzel odaklandı.',
    medicines: [
      {
        id: 201,
        diseaseName: 'Hastalığın adı girilmedi',
        medicineName: 'Probiyotik Damla',
        time: '14:00',
        stomachStatus: 'Tok Karnına',
        howToGive: 'Meyve püresiyle karıştırarak (5 damla)',
        durationText: 'İlaç bitene kadar',
        enteredBy: 'Veli',
        given: true,
        givenBy: 'Ayşe Yılmaz',
        givenAt: '14:03'
      }
    ],
    competencies: [
      {
        id: 'comp-201',
        category: 'İnce & Kaba Motor',
        skillTitle: 'Duyusal Nesneleri Kavrama ve Kule Yapma',
        status: 'Kazanıldı 🌟',
        progressPercent: 88,
        teacherNote: 'Renkli halkaları doğru sırayla dizebiliyor.'
      },
      {
        id: 'comp-202',
        category: 'Özbakım Becerileri',
        skillTitle: 'Kaşık Tutma ve Bardaktan Su İçme Alışkanlığı',
        status: 'Gelişiyor 🌱',
        progressPercent: 75,
        teacherNote: 'Kendi başına kaşık kullanmaya çok hevesli.'
      }
    ],
    tuitionAmount: 19500,
    tuitionPaid: true,
    invoiceNo: 'GIB202600049182'
  },
  {
    id: 'efe',
    passportId: 'IST-KIDS-2022-0512',
    name: 'Efe Demir',
    birthDate: '22 Ağustos 2022',
    heightCm: 106,
    weightKg: 17.4,
    ageLabel: '4 Yaş (Okul Öncesi)',
    ageGroup: '3-6',
    className: 'Papatyalar Sınıfı (4 Yaş)',
    avatar: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=300&q=80',
    parentName: 'Selin & Burak Demir',
    parentPhone: '0544 312 88 10',
    parentUsername: 'selindemir',
    allergies: [],
    attendance: 'geldi',
    ateBreakfast: true,
    ateLunch: false,
    ateSnack: true,
    mealExceptionNote: 'Öğle yemeğinde sebze çorbasını istemedi, sadece pilav ve yoğurt yedi.',
    sleepStatus: 'Mışıl Mışıl Uyudu (13:00-14:30)',
    mood: 'Çok Neşeli & Paylaşımcı 😊',
    activities: ['Ekoloji & Toprak Atölyesi', 'Orff Müzik & Ritim'],
    diaperLogs: [],
    teacherDailyNote: 'Efe bugün ritim atölyesinde marakas çalarken çok mutluydu.',
    medicines: [],
    competencies: [],
    tuitionAmount: 18500,
    tuitionPaid: true,
    invoiceNo: 'GIB202600049175'
  },
  {
    id: 'ada',
    passportId: 'IST-KIDS-2022-0619',
    name: 'Ada Yılmaz',
    birthDate: '03 Kasım 2022',
    heightCm: 102,
    weightKg: 15.9,
    ageLabel: '4 Yaş (Okul Öncesi)',
    ageGroup: '3-6',
    className: 'Papatyalar Sınıfı (4 Yaş)',
    avatar: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80',
    parentName: 'Kerem & Duygu Yılmaz',
    parentPhone: '0533 908 11 45',
    parentUsername: 'keremyilmaz',
    allergies: ['Laktoz Hassasiyeti'],
    attendance: 'gelmedi',
    ateBreakfast: true,
    ateLunch: true,
    ateSnack: true,
    sleepStatus: 'Dinlendi (Uyumadı)',
    mood: 'Sakin & Gözlemci 🌿',
    activities: ['Ekoloji & Toprak Atölyesi'],
    diaperLogs: [],
    teacherDailyNote: 'Bugün izinli.',
    medicines: [],
    competencies: [],
    tuitionAmount: 18500,
    tuitionPaid: true,
    invoiceNo: 'GIB202600049179'
  }
];

export const INITIAL_SEQUENTIAL_SHUTTLE_ROUTE: SequentialShuttleStop[] = [
  {
    stopOrder: 1,
    studentId: 'zeynep',
    studentName: 'Zeynep Sarı',
    className: 'Papatyalar Sınıfı (4 Yaş)',
    avatar: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=300&q=80',
    addressStop: '1. Durak: Kozyatağı Çamlık Sok. No:14',
    plannedTime: '16:15',
    parentName: 'Fatih Sarı',
    parentPhone: '0532 410 22 33',
    status: 'Servise Bindi (Okula Gidiyor / Eve Dönüyor) 🚌',
    completed: false
  },
  {
    stopOrder: 2,
    studentId: 'efe',
    studentName: 'Efe Demir',
    className: 'Papatyalar Sınıfı (4 Yaş)',
    avatar: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=300&q=80',
    addressStop: '2. Durak: Suadiye Bağdat Cad. No:312',
    plannedTime: '16:23',
    parentName: 'Selin Demir',
    parentPhone: '0544 312 88 10',
    status: 'Sırada Bekliyor',
    completed: false
  },
  {
    stopOrder: 3,
    studentId: 'ada',
    studentName: 'Ada Yılmaz',
    className: 'Papatyalar Sınıfı (4 Yaş)',
    avatar: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80',
    addressStop: '3. Durak: Bostancı Gösteri Mrk. Yanı No:8',
    plannedTime: '16:30',
    parentName: 'Kerem Yılmaz',
    parentPhone: '0533 908 11 45',
    status: 'Öğlen Velisi Okuldan Aldı (Akşam Serviste Yok)',
    completed: true
  },
  {
    stopOrder: 4,
    studentId: 'aliefe',
    studentName: 'Ali Efe Sarı',
    className: 'Minik Kalpler Sınıfı (0-3 Yaş)',
    avatar: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=300&q=80',
    addressStop: '4. Durak: Ataşehir Atatürk Mah. Lale Sitesi',
    plannedTime: '16:40',
    parentName: 'Esra Sarı',
    parentPhone: '0532 410 22 33',
    status: 'Sabah Gelmedi — Akşam Dönüş Rotasına Eklendi',
    completed: false
  }
];

export const INITIAL_ANNOUNCEMENTS: KidsAnnouncement[] = [
  {
    id: 1,
    title: '10-16 Kasım Atatürk Haftası Anma Programı ve Kıyafet Düzeni',
    content:
      '10 Kasım Salı sabahı saat 09:00’da tüm sınıflarımızla bahçe tören alanında buluşacağız. Öğrencilerimizin siyah-beyaz veya kırmızı-beyaz sade kıyafetlerle gelmeleri rica olunur.',
    date: '10 Kasım 2026',
    tag: 'Önemli Duyuru',
    priorityWeight: 4
  },
  {
    id: 2,
    title: 'MEB & Sağlık Bakanlığı Kış Dönemi Salgın Koruma Protokolü',
    content:
      'Ateş, öksürük veya bulaşıcı belirti gösteren öğrencilerimizin dinlendirilmesi ve ilaç çizelgesine hastalık tanısının girilmesi kurum sağlığımız için zorunludur.',
    date: '09 Kasım 2026',
    tag: 'Resmi Duyuru',
    priorityWeight: 3
  },
  {
    id: 3,
    title: 'Çarşamba Ekoloji Bahçesi Çizme & Yağmurluk Hatırlatması',
    content:
      'Yarın yapılacak toprak ve fide dikimi etkinliğimiz için yedek çorap ve yağmur çizmelerini çantaya eklemeyi unutmayınız.',
    date: '09 Kasım 2026',
    tag: 'Hatırlatma',
    priorityWeight: 2
  },
  {
    id: 4,
    title: 'Kasım Ayı Pedagojik Aile Bülteni Yayınlandı',
    content:
      '0-6 yaş çocuklarda sınır koyma ve ekran süresi yönetimi bültenimizi Eğitim İşlemleri menüsünden inceleyebilirsiniz.',
    date: '07 Kasım 2026',
    tag: 'Normal Duyuru',
    priorityWeight: 1
  }
];

export const INITIAL_DIARY_POSTS: KidsDiaryPost[] = [
  {
    id: 1,
    className: 'Papatyalar Sınıfı (4 Yaş)',
    teacherName: 'Ayşe Yılmaz',
    timeAgo: 'Bugün 10:45',
    caption:
      'Papatyalar Sınıfı ile Ekoloji ve Toprak Atölyemizde kış sebzelerinin tohumlarını inceledik ve kendi saksılarımıza dikim yaptık. (Bu paylaşım uçtan uca şifrelidir, sadece sınıf velilerimiz görüntüleyebilir.)',
    images: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=700&q=80'
    ],
    scope: 'Tüm Sınıf (Grup)',
    socialMediaRequested: true,
    socialMediaPlatform: 'Instagram & YouTube Resmi Hesabı',
    consents: [
      {
        studentId: 'zeynep',
        studentName: 'Zeynep Sarı',
        parentName: 'Fatih Sarı',
        decision: 'Bekliyor'
      },
      {
        studentId: 'efe',
        studentName: 'Efe Demir',
        parentName: 'Selin Demir',
        decision: 'İzin Veriyorum ✅',
        decidedAt: '11:05'
      }
    ]
  },
  {
    id: 2,
    className: 'Minik Kalpler Sınıfı (0-3 Yaş)',
    teacherName: 'Ayşe Yılmaz',
    timeAgo: 'Bugün 11:30',
    caption:
      'Minik Kalpler sınıfımızda duyusal kinetik kum ve renkli ahşap bloklarla ince motor kaslarımızı çalıştırdık.',
    images: [
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=700&q=80'
    ],
    scope: 'Tek Öğrenci',
    socialMediaRequested: false,
    consents: [
      {
        studentId: 'aliefe',
        studentName: 'Ali Efe Sarı',
        parentName: 'Fatih Sarı',
        decision: 'Bekliyor'
      }
    ]
  }
];

export const INITIAL_PARENT_REQUESTS: ParentRequestTicket[] = [
  {
    id: 1,
    studentId: 'zeynep',
    studentName: 'Zeynep Sarı',
    parentName: 'Fatih Sarı',
    templateType: 'Öğrenciyi erken alma talebi',
    recipient: 'Ayşe Yılmaz (Sınıf Öğretmeni)',
    shortNote: 'Diş hekimi kontrolümüz nedeniyle Zeynep’i bugün saat 15:15’te alacağım.',
    createdAt: '09:40',
    status: 'Görülüyor / Hazırlanıyor'
  }
];

export const INITIAL_PICKUP_PERSONS: KidsPickupPerson[] = [
  {
    id: 'pk-1',
    studentId: 'zeynep',
    studentName: 'Zeynep Sarı',
    personName: 'Hatice Sarı',
    relation: 'Anneannesi',
    phone: '0533 612 44 19',
    code: 'ZR-8492',
    verified: true
  },
  {
    id: 'pk-2',
    studentId: 'efe',
    studentName: 'Efe Demir',
    personName: 'Kemal Demir',
    relation: 'Dedesi',
    phone: '0542 711 09 22',
    code: 'ZR-3109',
    verified: true
  }
];

export const INITIAL_WEEKLY_DIET_MENU = [
  {
    day: 'Pazartesi',
    calories: '1.180 kcal',
    dietitian: 'Uzm. Dyt. Selin Soylu Onaylı',
    breakfast: 'Haşlanmış Köy Yumurtası, Ezine Peyniri, Ceviz İçi, Organik Domates-Salatalık, Ihlamur',
    lunch: 'Sebzeli Mercimek Çorbası, Fırın İzmir Köfte, Siyez Bulgur Pilavı, Ev Yoğurdu',
    snack: 'Ev Yapımı Elmalı Tarçınlı Tam Buğday Kek & Kefir',
    allergenNote: 'Gluten, Süt Ürünü ve Yumurta içerir (Alerjik çocuklara glutensiz/yumurtasız alternatif hazırlanır)'
  },
  {
    day: 'Salı',
    calories: '1.210 kcal',
    dietitian: 'Uzm. Dyt. Selin Soylu Onaylı',
    breakfast: 'Kaşarlı Tam Buğday Tost, Zeytin Ezmesi, Çeri Domates, Günlük Pastorize Süt',
    lunch: 'Tavuk Suyu Şehriye Çorbası, Zeytinyağlı Taze Fasulye, Pirinç Pilavı, Cacık',
    snack: 'Mevsim Meyve Tabağı (Muz, Mandalina, Elma) & Çiğ Fındık',
    allergenNote: 'Kuruyemiş hassasiyeti olan çocuklara yulaf ezmesi verilir'
  },
  {
    day: 'Çarşamba',
    calories: '1.195 kcal',
    dietitian: 'Uzm. Dyt. Selin Soylu Onaylı',
    breakfast: 'Sebzeli Peynirli Omlet, Keçiboynuzu Pekmezi & Tahin, Kuşburnu Çayı',
    lunch: 'Yayla Çorbası, Fırında Somon Köftesi, Tatlı Patates Püresi, Yeşil Salata',
    snack: 'Şekersiz Bal ile Tatlandırılmış Ev Yapımı Fırın Sütlaç',
    allergenNote: 'Balık ve Süt Ürünü içerir'
  },
  {
    day: 'Perşembe',
    calories: '1.200 kcal',
    dietitian: 'Uzm. Dyt. Selin Soylu Onaylı',
    breakfast: 'Ev Yapımı Pankek, Labne Peyniri, Mevsim Yeşillikleri, Taze Portakal Suyu',
    lunch: 'Ezogelin Çorbası, Kuzu Etli Nohut Yemeği, Sebzeli Erişte, Ayran',
    snack: 'Ev Yapımı Peynirli Poğaça & Rezene Çayı',
    allergenNote: 'Gluten ve Süt Ürünü içerir'
  },
  {
    day: 'Cuma',
    calories: '1.175 kcal',
    dietitian: 'Uzm. Dyt. Selin Soylu Onaylı',
    breakfast: 'Menemen (Az Tuzlu), Beyaz Peynir, Ceviz, Tam Buğday Ekmeği, Süt',
    lunch: 'Brokoli Çorbası, Hindi Sote, Sebzeli Kuskus, Ev Yoğurdu',
    snack: 'Ev Yapımı Mozaik Pasta (Keçiboynuzu Tozlu) & Süt',
    allergenNote: 'Yumurta ve Süt Ürünü içerir'
  }
];
