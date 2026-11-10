export type IstemKidsRole = 'veli' | 'ogretmen' | 'kurum_sahibi' | 'servis_gorevlisi';

export interface KidsMedicineItem {
  id: number;
  time: string;
  name: string;
  dose: string;
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

export interface KidsPickupAuth {
  code: string;
  personName: string;
  relation: string;
  phone: string;
  createdAt: string;
  verified: boolean;
}

export interface KidsStudentRecord {
  id: string;
  passportId: string;
  name: string;
  ageLabel: string;
  ageGroup: '0-3' | '3-6';
  className: string;
  avatar: string;
  parentName: string;
  parentPhone: string;
  parentUsername: string;
  allergies: string[];
  attendance: 'geldi' | 'gelmedi' | 'izinli';
  breakfast: 'Hepsini Yedi' | 'Yarısını Yedi' | 'Az Yedi';
  lunch: 'Hepsini Yedi' | 'Yarısını Yedi' | 'Az Yedi';
  snack: 'Hepsini Yedi' | 'Yarısını Yedi' | 'Az Yedi';
  sleepStatus: 'Mışıl Mışıl Uyudu (13:00-14:30)' | 'Dinlendi (Uyumadı)' | 'Kısa Uyudu (45 dk)';
  mood: 'Çok Neşeli & Paylaşımcı 😊' | 'Sakin & Gözlemci 🌿' | 'Biraz Yorgun 🧸';
  activities: string[];
  diaperLogs: KidsDiaperLog[];
  teacherDailyNote: string;
  parentMorningNote: string;
  shuttleStatus:
    | 'Sabah Okula Teslim Edildi (08:35)'
    | 'Servise Bindi - Eve Dönüyor 🚌'
    | 'Bugün Servise Binmeyecek (Veli Alacak)'
    | 'Veliye Güvenle Teslim Edildi ✅';
  gateBellActive: boolean;
  gateBellTime?: string;
  gateBellPrepared?: boolean;
  pickupAuth: KidsPickupAuth;
  medicines: KidsMedicineItem[];
  tuitionAmount: number;
  tuitionPaid: boolean;
  invoiceNo?: string;
}

export interface KidsFeedPost {
  id: number;
  className: string;
  teacherName: string;
  teacherRole: string;
  timeAgo: string;
  caption: string;
  images: string[];
  likes: number;
  approvedByOwner: boolean;
  comments: { id: number; author: string; text: string; time: string }[];
}

export interface KidsInstitutionTenant {
  code: string;
  name: string;
  district: string;
  stage: 'vitrin_ucretsiz' | 'aktif_kurum_stok_pratik';
  stokPratikTenantId: string;
  capacity: number;
  enrolledCount: number;
  classes: { id: string; name: string; ageRange: string; teacher: string; assistant: string; count: number }[];
  stockAlerts: { id: number; item: string; category: 'Mutfak & Erzak' | 'Özbakım & Hijyen' | 'Kırtasiye & Atölye'; remaining: string; critical: boolean }[];
  monthlyMenu: { day: string; breakfast: string; lunch: string; snack: string; allergenWarning: string }[];
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
    roleLabel: '👨‍👩‍👧 Veli Girişi',
    badge: 'Anne / Baba Ekranı',
    username: 'fatihsari',
    password: '141346',
    institutionCode: 'zerdalikres',
    fullName: 'Fatih Sarı (Zeynep & Ali Efe Veli)',
    summary: 'Canlı günlük karne, Kapıdayım zili, ilaç bildirimi, güvenli teslim kodu (QR) ve taksit ödeme.'
  },
  {
    role: 'ogretmen',
    roleLabel: '👩‍🏫 Sınıf Öğretmeni',
    badge: 'Mobil Hızlı Sınıf Paneli',
    username: 'ayseogretmen',
    password: '141346',
    institutionCode: 'zerdalikres',
    fullName: 'Ayşe Yılmaz (Papatyalar & Minik Kalpler)',
    summary: 'Tek tuşla yoklama, toplu yemek/uyku/bez karnesi, ilaç içirme onayı ve sınıf albümü paylaşımı.'
  },
  {
    role: 'kurum_sahibi',
    roleLabel: '🏢 Kreş Sahibi / Müdür',
    badge: 'İdare + Stok Pratik ERP',
    username: 'zerdalimudur',
    password: '141346',
    institutionCode: 'zerdalikres',
    fullName: 'Selma Karahan (Kurucu Müdür)',
    summary: 'Vitrin ön kayıt onayları, sınıf/personel atama, fotoğraf denetimi ve Stok Pratik e-Fatura & erzak stok.'
  },
  {
    role: 'servis_gorevlisi',
    roleLabel: '🚌 Servis & Kapı Görevlisi',
    badge: 'Bindi/İndi & Teslim Kodu',
    username: 'servishostesi',
    password: '141346',
    institutionCode: 'zerdalikres',
    fullName: 'Derya Demir (34 IST 424 Hostes & Kapı)',
    summary: 'Öğrenci servise bindi/indi bildirimi, Kapıdayım sesli zili ve güvenli alıcı QR kod doğrulama.'
  }
];

export const INITIAL_KIDS_STUDENTS: KidsStudentRecord[] = [
  {
    id: 'zeynep',
    passportId: 'IST-PAS-2022-0418',
    name: 'Zeynep Sarı',
    ageLabel: '4 Yaş (Okul Öncesi)',
    ageGroup: '3-6',
    className: 'Papatyalar Sınıfı (4 Yaş)',
    avatar: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=300&q=80',
    parentName: 'Fatih & Esra Sarı',
    parentPhone: '0532 410 22 33',
    parentUsername: 'fatihsari',
    allergies: ['Yer Fıstığı Hassasiyeti'],
    attendance: 'geldi',
    breakfast: 'Hepsini Yedi',
    lunch: 'Hepsini Yedi',
    snack: 'Yarısını Yedi',
    sleepStatus: 'Mışıl Mışıl Uyudu (13:00-14:30)',
    mood: 'Çok Neşeli & Paylaşımcı 😊',
    activities: ['Ekoloji & Toprak Atölyesi', 'Orff Müzik & Ritim', 'İngilizce Oyun Saati'],
    diaperLogs: [],
    teacherDailyNote: 'Zeynep bugün ekoloji bahçesinde tohum ekiminde arkadaşlarına liderlik etti, öğle çorbasını çok severek içti.',
    parentMorningNote: 'Dün gece biraz öksürdü, bugün ılık su tüketimine dikkat edelim lütfen.',
    shuttleStatus: 'Sabah Okula Teslim Edildi (08:35)',
    gateBellActive: false,
    pickupAuth: {
      code: 'ZR-8492',
      personName: 'Hatice Sarı',
      relation: 'Anneannesi',
      phone: '0533 612 44 19',
      createdAt: 'Bugün 11:20',
      verified: false
    },
    medicines: [
      {
        id: 101,
        time: '13:30',
        name: 'Bitkisel Boğaz Şurubu',
        dose: '1 Ölçek (5 ml) - Tok Karnına',
        given: true,
        givenBy: 'Ayşe Yılmaz',
        givenAt: '13:34'
      },
      {
        id: 102,
        time: '15:30',
        name: 'D3 Vitamini Damla',
        dose: '3 Damla',
        given: false
      }
    ],
    tuitionAmount: 18500,
    tuitionPaid: false
  },
  {
    id: 'aliefe',
    passportId: 'IST-PAS-2024-0892',
    name: 'Ali Efe Sarı',
    ageLabel: '2 Yaş (Oyun & Bebek Grubu)',
    ageGroup: '0-3',
    className: 'Minik Kalpler Sınıfı (0-3 Yaş)',
    avatar: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=300&q=80',
    parentName: 'Fatih & Esra Sarı',
    parentPhone: '0532 410 22 33',
    parentUsername: 'fatihsari',
    allergies: ['Yumurta Akı'],
    attendance: 'geldi',
    breakfast: 'Hepsini Yedi',
    lunch: 'Yarısını Yedi',
    snack: 'Hepsini Yedi',
    sleepStatus: 'Mışıl Mışıl Uyudu (13:00-14:30)',
    mood: 'Sakin & Gözlemci 🌿',
    activities: ['Duyusal Kinetik Kum Oyunu', 'Parmak Boyası', 'Masal & Uyku Rutini'],
    diaperLogs: [
      { id: 1, time: '10:15', type: 'Islak', note: 'Sabah kahvaltısı sonrası bez değişimi yapıldı.' },
      { id: 2, time: '12:50', type: 'Normal', note: 'Öğle uykusu öncesi bez değişimi + pişik kremi uygulandı.' },
      { id: 3, time: '15:10', type: 'Islak', note: 'Uyku sonrası bez kontrolü ve değişimi tamamlandı.' }
    ],
    teacherDailyNote: 'Ali Efe duyusal oyun saatinde renkli toplarla çok güzel odaklandı, öğle uykusuna kendi kendine daldı.',
    parentMorningNote: 'Çantasına yedek 4 adet bez ve pişik kremi koyduk.',
    shuttleStatus: 'Bugün Servise Binmeyecek (Veli Alacak)',
    gateBellActive: false,
    pickupAuth: {
      code: 'ZR-8492',
      personName: 'Hatice Sarı',
      relation: 'Anneannesi',
      phone: '0533 612 44 19',
      createdAt: 'Bugün 11:20',
      verified: false
    },
    medicines: [
      {
        id: 201,
        time: '14:45',
        name: 'Probiyotik Damla',
        dose: '5 Damla (Meyve püresiyle)',
        given: true,
        givenBy: 'Ayşe Yılmaz',
        givenAt: '14:48'
      }
    ],
    tuitionAmount: 19500,
    tuitionPaid: true,
    invoiceNo: 'GIB202600049182'
  },
  {
    id: 'efe',
    passportId: 'IST-PAS-2022-0512',
    name: 'Efe Demir',
    ageLabel: '4 Yaş (Okul Öncesi)',
    ageGroup: '3-6',
    className: 'Papatyalar Sınıfı (4 Yaş)',
    avatar: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=300&q=80',
    parentName: 'Selin & Burak Demir',
    parentPhone: '0544 312 88 10',
    parentUsername: 'selindemir',
    allergies: [],
    attendance: 'geldi',
    breakfast: 'Hepsini Yedi',
    lunch: 'Hepsini Yedi',
    snack: 'Hepsini Yedi',
    sleepStatus: 'Mışıl Mışıl Uyudu (13:00-14:30)',
    mood: 'Çok Neşeli & Paylaşımcı 😊',
    activities: ['Ekoloji & Toprak Atölyesi', 'Orff Müzik & Ritim', 'İngilizce Oyun Saati'],
    diaperLogs: [],
    teacherDailyNote: 'Efe bugün ritim atölyesinde marakas çalarken çok mutluydu.',
    parentMorningNote: 'Akşam 16:30 servisiyle gelecek.',
    shuttleStatus: 'Sabah Okula Teslim Edildi (08:35)',
    gateBellActive: false,
    pickupAuth: {
      code: 'ZR-3109',
      personName: 'Selin Demir',
      relation: 'Annesi',
      phone: '0544 312 88 10',
      createdAt: 'Standart Veli',
      verified: true
    },
    medicines: [],
    tuitionAmount: 18500,
    tuitionPaid: true,
    invoiceNo: 'GIB202600049175'
  },
  {
    id: 'ada',
    passportId: 'IST-PAS-2022-0619',
    name: 'Ada Yılmaz',
    ageLabel: '4 Yaş (Okul Öncesi)',
    ageGroup: '3-6',
    className: 'Papatyalar Sınıfı (4 Yaş)',
    avatar: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80',
    parentName: 'Kerem & Duygu Yılmaz',
    parentPhone: '0533 908 11 45',
    parentUsername: 'keremyilmaz',
    allergies: ['Laktoz Hassasiyeti (Laktozsuz Süt)'],
    attendance: 'geldi',
    breakfast: 'Yarısını Yedi',
    lunch: 'Hepsini Yedi',
    snack: 'Hepsini Yedi',
    sleepStatus: 'Dinlendi (Uyumadı)',
    mood: 'Sakin & Gözlemci 🌿',
    activities: ['Ekoloji & Toprak Atölyesi', 'Orff Müzik & Ritim'],
    diaperLogs: [],
    teacherDailyNote: 'Ada bugün laktozsuz ara öğününü afiyetle yedi.',
    parentMorningNote: 'Bugün öğleden sonra babası okuldan teslim alacak.',
    shuttleStatus: 'Bugün Servise Binmeyecek (Veli Alacak)',
    gateBellActive: false,
    pickupAuth: {
      code: 'ZR-7741',
      personName: 'Kerem Yılmaz',
      relation: 'Babası',
      phone: '0533 908 11 45',
      createdAt: 'Bugün 09:00',
      verified: false
    },
    medicines: [],
    tuitionAmount: 18500,
    tuitionPaid: true,
    invoiceNo: 'GIB202600049179'
  }
];

export const INITIAL_KIDS_POSTS: KidsFeedPost[] = [
  {
    id: 1,
    className: 'Papatyalar Sınıfı (4 Yaş)',
    teacherName: 'Ayşe Yılmaz',
    teacherRole: 'Papatyalar Sınıf Öğretmeni',
    timeAgo: '42 dakika önce',
    caption:
      'Bugün Papatyalar Sınıfı ile İSTEM Kids Ekoloji & Doğa Atölyemizde kendi fesleğen tohumlarımızı ektik ve ince motor kaslarımızı destekleyen ahşap blok istasyonunda takım çalışması yaptık 🌱🎨',
    images: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=700&q=80'
    ],
    likes: 24,
    approvedByOwner: true,
    comments: [
      {
        id: 1,
        author: 'Fatih Sarı (Zeynep Veli)',
        text: 'Ellerinize sağlık Ayşe Öğretmenim, Zeynep akşamları hep bu etkinlikleri anlatıyor ❤️',
        time: '14:20'
      },
      {
        id: 2,
        author: 'Selin Demir (Efe Veli)',
        text: 'Harika görünüyorlar, emeklerinize sağlık!',
        time: '14:35'
      }
    ]
  }
];

export const INITIAL_KIDS_INSTITUTION: KidsInstitutionTenant = {
  code: 'zerdalikres',
  name: 'Özel Zerdali Kreş, Anaokulu ve Gündüz Bakımevi',
  district: 'Kadıköy / Kozyatağı, İstanbul',
  stage: 'aktif_kurum_stok_pratik',
  stokPratikTenantId: 'SP-KRES-34092',
  capacity: 150,
  enrolledCount: 146,
  classes: [
    {
      id: 'cls-1',
      name: 'Minik Kalpler (0-3 Yaş Bebek & Oyun)',
      ageRange: '18-36 Ay',
      teacher: 'Ayşe Yılmaz',
      assistant: 'Merve Abla (Özbakım)',
      count: 14
    },
    {
      id: 'cls-2',
      name: 'Papatyalar Sınıfı (4 Yaş Ekoloji)',
      ageRange: '48-60 Ay',
      teacher: 'Ayşe Yılmaz',
      assistant: 'Sevgi Abla',
      count: 18
    },
    {
      id: 'cls-3',
      name: 'Yıldızlar Sınıfı (5-6 Yaş İlkokula Hazırlık)',
      ageRange: '60-72 Ay',
      teacher: 'Elif Kaya',
      assistant: 'Zehra Abla',
      count: 20
    }
  ],
  stockAlerts: [
    {
      id: 1,
      item: 'Organik Günlük Pastorize Süt (1L)',
      category: 'Mutfak & Erzak',
      remaining: '18 Litre (2 Günlük)',
      critical: true
    },
    {
      id: 2,
      item: 'Bebek Bezi (4 ve 5 Numara) & Islak Mendil',
      category: 'Özbakım & Hijyen',
      remaining: '42 Paket',
      critical: false
    },
    {
      id: 3,
      item: 'Yıkanabilir Parmak Boyası & Oyun Hamuru Seti',
      category: 'Kırtasiye & Atölye',
      remaining: '6 Set (Sipariş Önerilir)',
      critical: true
    }
  ],
  monthlyMenu: [
    {
      day: 'Pazartesi',
      breakfast: 'Haşlanmış Köy Yumurtası, Ezine Peyniri, Ceviz, Ihlamur',
      lunch: 'Sebzeli Mercimek Çorbası, Fırın Köfte, Bulgur Pilavı, Ev Yoğurdu',
      snack: 'Ev Yapımı Elmalı Tarçınlı Kek & Kefir',
      allergenWarning: 'Gluten, Süt Ürünü ve Yumurta içerir (Alerjik çocuklara özel menü hazırlanır)'
    },
    {
      day: 'Salı',
      breakfast: 'Kaşarlı Tam Buğday Tost, Zeytin, Çeri Domates, Süt',
      lunch: 'Tavuk Suyu Şehriye Çorbası, Zeytinyağlı Taze Fasulye, Pirinç Pilavı',
      snack: 'Mevsim Meyve Tabağı & Çiğ Badem/Fındık',
      allergenWarning: 'Kuruyemiş hassasiyeti olan çocuklara meyve püresi verilir'
    },
    {
      day: 'Çarşamba',
      breakfast: 'Peynirli Omlet, Pekmez-Tahin, Salatalık, Kuşburnu Çayı',
      lunch: 'Yayla Çorbası, Somon Köftesi, Fırın Patates, Mevsim Salata',
      snack: 'Ev Yapımı Sütlaç (Şekersiz Bal İle)',
      allergenWarning: 'Balık ve Süt Ürünü içerir'
    }
  ]
};
