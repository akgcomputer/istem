import React, { useState } from 'react';
import {
  Search, MapPin, SlidersHorizontal, ArrowRight, ShieldCheck, Bell,
  CheckCircle2, Star, Sparkles, Building2, GraduationCap, Users,
  BookOpen, Trophy, QrCode, Utensils, Bed, Pill, ThumbsUp, Code2,
  Globe, Award, Plus, Navigation
} from 'lucide-react';
import { Course, Category } from '../types';

interface HomeViewProps {
  courses: Course[];
  categories: Category[];
  onSelectCourse: (course: Course) => void;
  onNavigateTo: (page: string) => void;
  isLoggedIn: boolean;
  onSelectCategory: (categoryName: string) => void;
  onOpenAuthModal?: (mode: 'login' | 'register' | 'kurum' | 'talep', targetName?: string) => void;
}

const FEATURED_SCHOOLS = [
  {
    id: 'school-zerdali',
    category: 'kres',
    name: 'Zerdali Orman & Ekoloji Anaokulu',
    location: 'Sarıyer, İstanbul',
    ageGroup: '2 - 6 Yaş Aralığı',
    rating: '4.9',
    reviews: 84,
    price: '₺24.000',
    period: '/ ay',
    priceLabel: 'Aylık Eğitim Ücreti',
    badge1: '✓ Akredite Kurum',
    badge2: 'Ekoloji & Orman',
    statusBadge: 'Son 4 Kontenjan',
    statusColor: 'bg-error-container text-on-error-container',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
    features: [
      'Permakültür bahçesi ve günlük toprak atölyesi',
      'Native speaker eşliğinde çift dilli erken İngilizce',
      'Diyetisyen onaylı %100 organik beslenme menüsü',
      'İSTEM Veli Canlı Etkinlik Akışı & İlaç Takibi'
    ]
  },
  {
    id: 'school-ilke',
    category: 'ilkokul',
    name: 'İlke Bilim Koleji & Fen Lisesi',
    location: 'Çamlıca, Üsküdar',
    ageGroup: 'İlkokul • Ortaokul • Lise',
    rating: '4.8',
    reviews: 126,
    price: '₺290.000',
    period: '/ yıl',
    priceLabel: 'Yıllık Eğitim Paketi',
    badge1: 'LGS / YKS Derece',
    badge2: 'K-12 Kolej Kampüsü',
    statusBadge: 'Bursluluk Sınavı Açık',
    statusColor: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    features: [
      'TÜBİTAK ve Robotik Maker inovasyon laboratuvarı',
      'Yarı olimpik kapalı yüzme havuzu ve eskrim kulübü',
      '%94 Üniversite ilk 3 tercih yerleşme başarısı',
      'İSTEM Ödev & Deneme Sınavı dijital analiz masası'
    ]
  },
  {
    id: 'school-gelisim',
    category: 'kres',
    name: 'Gelişim Düşler Dünyası Kreş & Yuva',
    location: 'Ataşehir, İstanbul',
    ageGroup: '1 - 6 Yaş Gündüz Bakım',
    rating: '4.9',
    reviews: 62,
    price: '₺21.500',
    period: '/ ay',
    priceLabel: 'Aylık Tam Gün Ücret',
    badge1: 'Montessori Onaylı',
    badge2: 'Nöbetçi Sınıf',
    statusBadge: 'Kayıtlar Devam Ediyor',
    statusColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
    features: [
      'Reggio Emilia & Montessori pedagojik programı',
      'Çalışan veliler için 07:30 - 19:00 esnek saatler',
      'Tam zamanlı kurum pedagogu & gelişim testleri',
      'Canlı GPS veli servis takibi & hostes desteği'
    ]
  }
];

const FEATURED_TEACHERS = [
  {
    id: 't-selin',
    name: 'Dr. Selin Karaca',
    credentials: 'Boğaziçi Mezunu • 11 Yıl Deneyim',
    specialty: 'LGS & YKS Matematik Koçu',
    bio: 'Yeni nesil problem çözme teknikleri ve sınav kaygısı yönetimiyle netlerinizi 1.5 ayda yükseltin.',
    price: '₺750',
    rating: '5.0',
    completedLessons: 94,
    tag: 'Onaylı Diploma',
    perk: 'İlk Görüşme Ücretsiz',
    ringColor: 'ring-primary',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 't-emre',
    name: 'Emre Dağdelen',
    credentials: 'İTÜ Bilgisayar • Eski Silicon Valley',
    specialty: 'Python, Yapay Zeka & Algoritma',
    bio: '10-18 yaş gençler ve yetişkinler için pratik proje geliştirme, yapay zeka ajanları ve kodlama.',
    price: '₺850',
    rating: '4.9',
    completedLessons: 68,
    tag: 'Tech Mentor',
    perk: 'Online / Yüz Yüze',
    ringColor: 'ring-secondary',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 't-sarah',
    name: 'Sarah Jenkins',
    credentials: 'CELTA Sertifikalı • 8 Yıl Deneyim',
    specialty: 'IELTS, TOEFL & Akıcı Konuşma',
    bio: 'Aksan ve akıcılık odaklı konuşma pratikleri, okul mülakatları ve akademik sınav skor garantisi.',
    price: '₺700',
    rating: '4.9',
    completedLessons: 142,
    tag: 'Native Speaker',
    perk: 'Birebir Özel',
    ringColor: 'ring-tertiary',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 't-burak',
    name: 'Burak Yılmaz',
    credentials: 'ODTÜ Fizik • 500+ Derece Öğrenci',
    specialty: 'Fizik & Kimya YKS Hazırlık',
    bio: 'Karmaşık formülleri görselleştirerek öğreten, haftalık soru çözüm ve deneme analiz grubu dahil program.',
    price: '₺650',
    rating: '4.8',
    completedLessons: 82,
    tag: 'Derece Koçu',
    perk: 'WhatsApp Soru Grubu',
    ringColor: 'ring-primary',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  }
];

export default function HomeView({
  courses,
  categories,
  onSelectCourse,
  onNavigateTo,
  isLoggedIn,
  onSelectCategory,
  onOpenAuthModal
}: HomeViewProps) {
  const [activeStageTab, setActiveStageTab] = useState<'kids' | 'junior' | 'kampus' | 'pro' | 'erp'>('kids');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedModel, setSelectedModel] = useState('all');
  const [schoolCategoryFilter, setSchoolCategoryFilter] = useState<'all' | 'kres' | 'ilkokul' | 'lise'>('all');
  const [kapidayimTriggered, setKapidayimTriggered] = useState(false);

  // Certificate verification inside HomeView
  const [certCodeInput, setCertCodeInput] = useState('IST-2025-KID-8492');
  const [certVerified, setCertVerified] = useState(false);

  // Mobile Triad Tab
  const [mobileTriadTab, setMobileTriadTab] = useState<'veli' | 'ogrenci' | 'okul'>('veli');

  const triggerOpenAuth = (mode: 'login' | 'register' | 'kurum' | 'talep', targetName?: string) => {
    if (onOpenAuthModal) {
      onOpenAuthModal(mode, targetName);
    } else {
      onNavigateTo('veli-portal');
    }
  };

  const handleStageSelect = (stage: 'kids' | 'junior' | 'kampus' | 'pro' | 'erp') => {
    setActiveStageTab(stage);
    if (stage === 'kids') {
      setSchoolCategoryFilter('kres');
      setSearchQuery('Montessori Kreş & Anaokulu');
    } else if (stage === 'junior') {
      setSchoolCategoryFilter('ilkokul');
      setSearchQuery('İlkokul & Ortaokul Kolejleri');
    } else if (stage === 'kampus') {
      setSchoolCategoryFilter('lise');
      setSearchQuery('LGS & YKS Fen Lisesi Hazırlık');
    } else if (stage === 'pro') {
      setSearchQuery('Python, Yapay Zeka & Yabancı Dil');
    } else if (stage === 'erp') {
      triggerOpenAuth('kurum');
    }
  };

  const handleExecuteSearch = () => {
    const q = searchQuery.toLowerCase();
    if (q.includes('kreş') || q.includes('anaokulu') || q.includes('kolej') || q.includes('okul') || selectedModel === 'kres' || selectedModel === 'k12') {
      onNavigateTo('schools-catalog');
    } else if (q.includes('öğretmen') || q.includes('koç') || selectedModel === 'ders') {
      onNavigateTo('teachers-catalog');
    } else {
      onNavigateTo('katalog');
    }
  };

  const filteredSchools = FEATURED_SCHOOLS.filter(s => {
    if (schoolCategoryFilter === 'all') return true;
    if (schoolCategoryFilter === 'lise') return s.category === 'ilkokul';
    return s.category === schoolCategoryFilter;
  });

  return (
    <div className="bg-surface text-on-surface font-sans antialiased">
      {/* 1. TOP TRUST & MICRO-ANNOUNCEMENT BAR */}
      <section className="w-full bg-surface-container-low border-b border-outline-variant/30 py-2.5 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-on-surface-variant flex-wrap justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-bold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping" />
              Açık &amp; Şifresiz Keşif
            </span>
            <span className="font-bold text-on-surface">
              İstanbul Eğitim Merkezi (İSTEM) Ekosistemi:
            </span>
            <span className="text-tertiary font-bold">670+ Onaylı Eğitmen</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-secondary font-bold">140+ Akredite Okul &amp; Kreş</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-primary font-bold">%0 Komisyon Garantisi</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => onNavigateTo('veli-portal')}
              className="text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>👨‍👩‍👧 Canlı Veli &amp; Günlük Karne Önizleme</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => triggerOpenAuth('kurum')}
              className="text-secondary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>🏫 Kurum Kodu ile Giriş</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. HERO & LIFE-STAGE ECOSYSTEM HUB (Web + Mobile App Adaptive) */}
      <section className="w-full bg-gradient-to-b from-surface via-surface-container-lowest to-surface pt-8 sm:pt-12 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Headline */}
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-fixed/70 text-on-primary-fixed-variant text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-primary-container" />
              <span>İstanbul Eğitim Merkezi (İSTEM) • Giriş Duvarı Yok • Anında Karşılaştır</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] text-on-surface tracking-tight font-extrabold leading-[1.12]">
              Kreşten Kariyere, Türkiye’nin <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-secondary">
                Komisyonsuz Eğitim ve Okul
              </span>{' '}
              Ekosistemi
            </h1>

            <p className="text-sm sm:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              <strong>İstanbul Eğitim Merkezi (İSTEM)</strong> ile çocuğunuz için en doğru anaokulu ve koleji şeffaf fiyatlarla inceleyin, 670+ uzman öğretmenden <strong>%0 komisyonla</strong> özel ders alın veya okulunuzu uçtan uca yönetin.
            </p>
          </div>

          {/* Mobile App Story-Style Education Level Circles (Visible on Mobile, Pill Tabs on Desktop) */}
          <div className="mt-7 sm:hidden">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                EĞİTİM KADEMELERİ
              </span>
              <span className="text-[11px] font-bold text-primary">Yaşa Göre Seçin</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { id: 'kids' as const, emoji: '🧸', title: 'Kreş & Yuva', badge: 'İSTEM Kids', ring: 'border-emerald-500', badgeBg: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
                { id: 'junior' as const, emoji: '🎒', title: 'İlköğretim', badge: '1-8. Sınıf', ring: 'border-amber-500', badgeBg: 'bg-primary-fixed text-on-primary-fixed-variant' },
                { id: 'kampus' as const, emoji: '🎓', title: 'Lise & YKS', badge: 'Sınav', ring: 'border-indigo-500', badgeBg: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
                { id: 'pro' as const, emoji: '💻', title: 'STEM & Dil', badge: 'Akademi', ring: 'border-teal-600', badgeBg: 'bg-surface-container-high text-on-surface' }
              ].map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleStageSelect(st.id)}
                  className="flex flex-col items-center gap-1 p-1.5 rounded-2xl active:scale-95 transition cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-full bg-white border-2 ${st.ring} flex items-center justify-center text-2xl shadow-xs`}>
                    {st.emoji}
                  </div>
                  <span className="text-[11px] font-bold text-on-surface leading-tight mt-0.5">{st.title}</span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${st.badgeBg}`}>
                    {st.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop 5 Life-Stage Ecosystem Pill Tabs */}
          <div className="mt-8 max-w-5xl mx-auto hidden sm:block">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface-container-high/80 backdrop-blur-md overflow-x-auto no-scrollbar shadow-inner">
              {[
                { id: 'kids' as const, emoji: '🧸', title: 'İSTEM Kids', sub: '0-6 Yaş Kreş & Anaokulu', count: '42 Kurum', badgeClass: 'bg-primary-fixed text-on-primary-fixed-variant' },
                { id: 'junior' as const, emoji: '🎒', title: 'İSTEM Junior', sub: 'İlkokul & Ortaokul', count: 'K-8 Kolej', badgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
                { id: 'kampus' as const, emoji: '🎯', title: 'İSTEM Kampüs', sub: 'Lise & LGS/YKS', count: 'Fen & Anadolu', badgeClass: 'bg-primary-fixed text-on-primary-fixed' },
                { id: 'pro' as const, emoji: '🚀', title: 'İSTEM Akademi', sub: 'Yazılım, AI, Dil, Kariyer', count: '420+ Ders', badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
                { id: 'erp' as const, emoji: '🏛️', title: 'Kurumsal Okul Yönetimi', sub: 'Veli İletişim & Stok Pratik', count: 'İşletmeler İçin', badgeClass: 'bg-surface-container-highest text-on-surface' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleStageSelect(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
                    activeStageTab === tab.id
                      ? 'bg-surface-container-lowest text-primary shadow-sm ring-1 ring-primary-container/20'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="text-xl">{tab.emoji}</span>
                  <div className="text-left leading-tight">
                    <span className="font-display font-extrabold block text-on-surface">{tab.title}</span>
                    <span className="text-[10px] text-on-surface-variant">{tab.sub}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ml-1 ${tab.badgeClass}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Unified Smart Marketplace Search Bar */}
          <div className="mt-5 max-w-5xl mx-auto p-3 bg-surface-container-lowest rounded-3xl shadow-xl shadow-on-surface/5 border border-outline-variant/30 flex flex-col lg:flex-row items-center gap-2.5">
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-container-low focus-within:bg-surface-container transition">
              <Search className="w-5 h-5 text-primary-container shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleExecuteSearch()}
                placeholder="Ne arıyorsunuz? (Örn: Sarıyer Montessori Kreş, LGS Matematik, Python...)"
                className="w-full bg-transparent border-0 outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 lg:flex items-center gap-2 w-full lg:w-auto">
              <div className="w-full lg:w-52 flex items-center gap-2 px-3.5 py-3 rounded-2xl bg-surface-container-low">
                <MapPin className="w-4 h-4 text-secondary shrink-0" />
                <select
                  value={selectedDistrict}
                  onChange={e => setSelectedDistrict(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-xs font-bold text-on-surface cursor-pointer"
                >
                  <option value="all">İstanbul (Tüm İlçeler)</option>
                  <option value="sariyer">Sarıyer &amp; Beşiktaş</option>
                  <option value="kadikoy">Kadıköy &amp; Ataşehir</option>
                  <option value="uskudar">Üsküdar &amp; Çamlıca</option>
                  <option value="bakirkoy">Bakırköy &amp; Florya</option>
                </select>
              </div>

              <div className="w-full lg:w-48 flex items-center gap-2 px-3.5 py-3 rounded-2xl bg-surface-container-low">
                <SlidersHorizontal className="w-4 h-4 text-tertiary shrink-0" />
                <select
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-xs font-bold text-on-surface cursor-pointer"
                >
                  <option value="all">Yüz Yüze + Online</option>
                  <option value="kres">Kreş &amp; Anaokulu</option>
                  <option value="k12">Özel Okul &amp; Kolej</option>
                  <option value="ders">Birebir Özel Ders</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExecuteSearch}
              className="w-full lg:w-auto px-7 py-3.5 rounded-2xl bg-primary-container hover:bg-primary text-white font-display font-bold text-sm shadow-md shadow-primary-container/25 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Keşfet &amp; Listele</span>
            </button>
          </div>

          {/* Quick Filter Chips */}
          <div className="mt-3.5 max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar text-xs text-on-surface-variant">
            <span className="font-bold text-on-surface shrink-0">Hızlı Keşif:</span>
            {[
              { label: '🌟 Çift Dilli Kreşler', action: () => setSchoolCategoryFilter('kres') },
              { label: '📐 LGS & YKS Derece Koçluğu', action: () => onNavigateTo('teachers-catalog') },
              { label: '🤖 Robotik & Yapay Zeka Dersleri', action: () => onNavigateTo('katalog') },
              { label: '🏊 Havuzlu & Kampüs Kolejler', action: () => onNavigateTo('schools-catalog') },
              { label: '🥗 Organik Beslenmeli Yuvalar', action: () => setSchoolCategoryFilter('kres') }
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={chip.action}
                className="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-medium transition whitespace-nowrap cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* 🧸 İSTEM Kids (0-6 Yaş Kreş & Anaokulu) 4 Rol & Üyelik Hızlı Başlatıcı */}
          <div className="mt-5 max-w-5xl mx-auto p-4 rounded-3xl bg-primary-fixed/40 border border-primary-container/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-container text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
                🧸
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-extrabold text-on-surface">
                    İSTEM Kids (0-6 Yaş Kreş &amp; Anaokulu) Canlı Rol Sistemi
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-tertiary text-white">
                    4 Yetki Rolü + Tek Öğrenci Pasaportu
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Veli (Günlük Karne &amp; Kapıdayım Zili), Sınıf Öğretmeni, Kreş Sahibi (Stok Pratik ERP) ve Servis Görevlisi panellerini canlı deneyimleyin:
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => onNavigateTo('veli-portal')}
                className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-primary-container hover:bg-primary text-white text-xs font-extrabold transition cursor-pointer"
              >
                🧸 4 Rol Panelini Aç
              </button>
              <button
                type="button"
                onClick={() => triggerOpenAuth('register')}
                className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-surface-container-lowest hover:bg-white text-primary-container border border-primary-container/30 text-xs font-extrabold transition cursor-pointer"
              >
                + Yeni Kreş / Veli Üyelik
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE BENTO GRID: 4 CORE PILLARS OF İSTANBUL EĞİTİM MERKEZİ */}
      <section className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-surface">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold uppercase tracking-wider">
                İSTANBUL EĞİTİM MERKEZİ (İSTEM) MİMARİSİ
              </span>
              <h2 className="font-display text-2xl sm:text-4xl text-on-surface mt-2 font-extrabold">
                Eğitim Sürecinizin Tüm Paydaşları Tek Çatıda
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant mt-1">
                Şifre duvarı olmadan şeffaf okul fiyatlarını görün, öğretmenleri kıyaslayın veya veli bilgilendirme paneline anında geçin.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold w-fit">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              Tüm Modüller Aktif &amp; Açık Erişim
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento 1: Okul, Kreş ve Kolej Vitrinleri (7 cols) */}
            <div className="md:col-span-7 bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-lg border border-outline-variant/30 transition-all flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-2xl">
                    🏫
                  </span>
                  <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-xs font-bold">
                    140+ Doğrulanmış Kampüs
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-on-surface font-extrabold">
                  Okul, Kreş ve Kolej Şeffaf Vitrinleri
                </h3>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                  Gizli ücret yok. Kontenjan doluluk oranları, veli memnuniyet skorları, haftalık organik yemek menüleri, atölye olanakları ve eğitim ücretlerini doğrudan karşılaştırın.
                </p>

                {/* Mini Live Preview Box */}
                <div className="mt-6 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center font-bold text-sm">
                        ZO
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold text-on-surface">
                          Zerdali Ekoloji Anaokulu (Sarıyer)
                        </h4>
                        <p className="text-xs text-on-surface-variant">
                          Erken Kayıt Avantajı: ₺24.000 / ay (Organik Menü Dahil)
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
                      Son 4 Kontenjan
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-on-surface-variant font-medium">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-tertiary" /> Çift Dilli Eğitim
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-tertiary" /> Permakültür Bahçesi
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-tertiary" /> Canlı Veli Akışı
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigateTo('schools-catalog')}
                  className="px-6 py-2.5 rounded-full bg-primary-container hover:bg-primary text-white text-xs font-display font-bold transition cursor-pointer"
                >
                  Okulları İncele &amp; Karşılaştır
                </button>
                <button
                  type="button"
                  onClick={() => triggerOpenAuth('talep', 'Zerdali Ekoloji Anaokulu')}
                  className="px-5 py-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-display font-bold transition cursor-pointer"
                >
                  Ücretsiz Tanıtım Turu İste
                </button>
              </div>
            </div>

            {/* Bento 2: %0 Komisyonlu Özel Ders Pazaryeri (5 cols) */}
            <div className="md:col-span-5 bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-lg border border-outline-variant/30 transition-all flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-2xl">
                    🧑‍🏫
                  </span>
                  <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-extrabold">
                    %0 Komisyon Garantisi
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-on-surface font-extrabold">
                  Birebir Uzman Eğitmen Pazarı
                </h3>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                  Diploması ve adli sicil kaydı İstanbul Eğitim Merkezi kurulunca denetlenmiş 670+ öğretmenden doğrudan ders alın. Aracı komisyonu ödemeden bütçenizi koruyun.
                </p>

                <div className="mt-6 p-4 rounded-2xl bg-secondary-fixed/25 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-secondary uppercase">ORTALAMA DERS ÜCRETİ</span>
                    <span className="font-extrabold text-on-surface text-sm">₺450 - ₺950 / saat</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full w-3/4" />
                  </div>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1.5 pt-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-tertiary" />
                    <span>Öğrenci velilerinin %98.4’ü ilk dersten memnun kaldı.</span>
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => onNavigateTo('teachers-catalog')}
                  className="w-full py-3 rounded-full bg-secondary hover:opacity-95 text-white text-xs font-display font-bold transition cursor-pointer"
                >
                  Eğitmenleri İncele &amp; Doğrudan Mesaj At
                </button>
              </div>
            </div>

            {/* Bento 3: Günlük Karne & "Kapıdayım" Kurum Zili (6 cols) */}
            <div className="md:col-span-6 bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-lg border border-outline-variant/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-primary-fixed/60 flex items-center justify-center text-2xl">
                    📱
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold">
                    Canlı Veli Uygulaması (İSTEM Kids)
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-on-surface font-extrabold">
                  Günlük Karne &amp; &ldquo;Kapıdayım&rdquo; Kurum Zili
                </h3>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                  Kreş ve anaokulunda çocuğunuzun beslenme, uyku, etkinlik ve ilaç rutinini gerçek zamanlı izleyin. Okul kapısına yaklaştığınızda tek tıkla öğretmene bildirim gönderin.
                </p>

                <div className="mt-6 grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-3 rounded-2xl bg-surface-container-low">
                    <Utensils className="w-5 h-5 text-tertiary mx-auto" />
                    <p className="text-[11px] text-on-surface-variant mt-1">Öğle Yemeği</p>
                    <p className="font-bold text-on-surface text-xs">%100 Bitirdi</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-surface-container-low">
                    <Bed className="w-5 h-5 text-secondary mx-auto" />
                    <p className="text-[11px] text-on-surface-variant mt-1">Öğle Uykusu</p>
                    <p className="font-bold text-on-surface text-xs">1s 45dk 🟢</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-surface-container-low">
                    <Pill className="w-5 h-5 text-primary-container mx-auto" />
                    <p className="text-[11px] text-on-surface-variant mt-1">Şurup / İlaç</p>
                    <p className="font-bold text-on-surface text-xs">13:30 Verildi</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setKapidayimTriggered(true)}
                    className="px-4 py-2 rounded-full bg-error-container text-on-error-container text-xs font-bold flex items-center gap-1.5 hover:brightness-95 transition cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>&ldquo;Kapıdayım&rdquo; Zilini Dene</span>
                  </button>
                  {kapidayimTriggered && (
                    <span className="text-xs font-bold text-tertiary animate-pulse">
                      🔔 Sinyal sınıfa iletildi!
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTo('veli-portal')}
                  className="text-primary text-xs font-extrabold hover:underline cursor-pointer"
                >
                  Canlı Veli Ekranını Aç →
                </button>
              </div>
            </div>

            {/* Bento 4: Kurum Sahipleri İçin Stok Pratik Muhasebe & ERP (6 cols - Targeted strictly at School/Course Owners) */}
            <div className="md:col-span-6 bg-inverse-surface text-inverse-on-surface rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-tertiary-fixed/20 flex items-center justify-center text-2xl">
                    📊
                  </span>
                  <span className="px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-extrabold">
                    Okul &amp; Kreş Sahiplerine Özel: Stok Pratik ERP
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-white font-extrabold">
                  Okul &amp; Kurs İşletmeleri İçin Stok Pratik Ön Muhasebe
                </h3>
                <p className="text-sm text-inverse-on-surface/80 mt-2 leading-relaxed">
                  Okul, kreş ve kurs kurucuları için tam donanımlı finans yönetimi: Öğrenci taksit sözleşmeleri, GİB e-Fatura kesimi, yemekhane/servis faturalandırması ve kırtasiye/kantin stok takibi <strong>Stok Pratik</strong> güvencesiyle tek merkezde.
                </p>

                <div className="mt-6 p-4 rounded-2xl bg-white/10 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed" />
                      <span className="text-xs font-bold text-white">
                        Otomatik Taksit Hatırlatma &amp; Stok Pratik Cari Takip
                      </span>
                    </div>
                    <p className="text-xs text-inverse-on-surface/75">
                      Veli ödemeleri, öğretmen hakedişleri ve okul kantin/kitap deposu entegre çalışır.
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold text-xs shrink-0">
                    Kurumsal ERP
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/15">
                <button
                  type="button"
                  onClick={() => onNavigateTo('veli-portal')}
                  className="px-5 py-2.5 rounded-full bg-tertiary-container hover:opacity-95 text-on-tertiary-container text-xs font-display font-bold transition cursor-pointer"
                >
                  Kurum &amp; Stok Pratik Panelini İncele
                </button>
                <span className="text-xs text-inverse-on-surface/70 font-medium">
                  Mali Müşavir &amp; GİB Uyumlu
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED SCHOOLS & KINDERGARTENS SHOWCASE */}
      <section className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-surface-container-low" id="schoolsSection">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                GÜVENİLİR VE AKREDİTE EĞİTİM KURUMLARI
              </span>
              <h2 className="font-display text-2xl sm:text-4xl text-on-surface mt-1 font-extrabold">
                Öne Çıkan Okul, Kreş ve Kolejler
              </h2>
              <p className="text-sm text-on-surface-variant">
                İstanbul Eğitim Merkezi (İSTEM) tarafından fiziksel mekan denetimleri ve MEB ruhsatları doğrulanmış kurumlar.
              </p>
            </div>

            {/* Filter Pill Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              {[
                { id: 'all' as const, label: 'Tümü (142)' },
                { id: 'kres' as const, label: 'Kreş & Anaokulu (42)' },
                { id: 'ilkokul' as const, label: 'İlkokul & Kolej (55)' },
                { id: 'lise' as const, label: 'Fen & Anadolu Lisesi (45)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSchoolCategoryFilter(tab.id)}
                  className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap cursor-pointer ${
                    schoolCategoryFilter === tab.id
                      ? 'bg-primary-container text-white shadow-xs'
                      : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Detailed School Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredSchools.map(school => (
              <div
                key={school.id}
                className="group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-xs hover:shadow-xl border border-outline-variant/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 w-full bg-surface-container-high overflow-hidden">
                    <img
                      src={school.image}
                      alt={school.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-bold shadow-xs">
                        {school.badge1}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 text-on-surface text-[11px] font-bold shadow-xs">
                        {school.badge2}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/95 backdrop-blur-md text-on-surface text-xs font-bold flex items-center gap-1 shadow">
                      <span className="text-primary-container">★</span> {school.rating}{' '}
                      <span className="text-on-surface-variant font-normal">({school.reviews} Veli)</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary-container" />
                          {school.location}
                        </span>
                        <span className="text-tertiary font-bold">{school.ageGroup}</span>
                      </div>
                      <h3 className="font-display text-lg text-on-surface font-extrabold mt-1">
                        {school.name}
                      </h3>
                    </div>

                    <div className="space-y-1.5 text-xs text-on-surface-variant">
                      {school.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-tertiary shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-on-surface-variant uppercase font-extrabold block">
                          {school.priceLabel}
                        </span>
                        <p className="font-display text-lg text-on-surface font-extrabold">
                          {school.price}{' '}
                          <span className="text-xs font-normal text-on-surface-variant">{school.period}</span>
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${school.statusBadge ? school.statusColor : ''}`}>
                        {school.statusBadge}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => onNavigateTo('schools-catalog')}
                    className="flex-1 py-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-display font-bold transition cursor-pointer"
                  >
                    Detaylı İncele
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerOpenAuth('talep', school.name)}
                    className="flex-1 py-2.5 rounded-full bg-primary-container hover:bg-primary text-white text-xs font-display font-bold shadow-sm transition cursor-pointer"
                  >
                    Ön Kayıt / Teklif
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onNavigateTo('schools-catalog')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-display font-bold text-xs hover:bg-surface-container transition shadow-2xs cursor-pointer"
            >
              <span>Tüm 142 Okul, Kreş ve Kurs Merkezini Karşılaştır</span>
              <ArrowRight className="w-4 h-4 text-primary-container" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. MARKETPLACE: %0 COMMISSION VERIFIED PRIVATE TEACHERS */}
      <section className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-surface" id="teachersSection">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-tertiary uppercase tracking-wider">
                İSTANBUL EĞİTİM MERKEZİ • KOMİSYONSUZ ÖZEL DERS PAZARYERİ
              </span>
              <h2 className="font-display text-2xl sm:text-4xl text-on-surface mt-1 font-extrabold">
                670+ Onaylı Eğitmenden Doğrudan Özel Ders
              </h2>
              <p className="text-sm text-on-surface-variant">
                Öğretmenle doğrudan iletişime geçin. İSTEM komisyon kesmez, ilk tanışma dersi ücretsizdir.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateTo('teachers-catalog')}
                className="px-4 py-2.5 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white text-xs font-display font-bold transition cursor-pointer"
              >
                + Eğitmen Olarak Katıl (%0 Komisyon)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_TEACHERS.map(teacher => (
              <div
                key={teacher.id}
                className="bg-surface-container-lowest rounded-3xl p-6 shadow-xs hover:shadow-xl border border-outline-variant/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-16 h-16 rounded-full overflow-hidden bg-surface-container-high ring-2 ${teacher.ringColor} shrink-0`}>
                      <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold">
                        ✓ {teacher.tag}
                      </span>
                      <h4 className="font-display text-base font-extrabold text-on-surface mt-0.5">
                        {teacher.name}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant">{teacher.credentials}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-primary font-extrabold">{teacher.specialty}</p>
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                      {teacher.bio}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-outline-variant/20 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant">Saatlik Ücret:</span>
                      <span className="font-extrabold text-on-surface text-base">
                        {teacher.price}{' '}
                        <span className="text-[10px] text-tertiary font-bold">%0 Komisyon</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                      <span>
                        <strong className="text-primary-container">★ {teacher.rating}</strong> ({teacher.completedLessons} Ders)
                      </span>
                      <span className="text-secondary font-bold">{teacher.perk}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    type="button"
                    onClick={() => triggerOpenAuth('talep', `${teacher.name} (${teacher.specialty})`)}
                    className="w-full py-2.5 rounded-full bg-primary-container hover:bg-primary text-white text-xs font-display font-bold transition cursor-pointer"
                  >
                    Ders Talep Et / Mesaj At
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE ECOSYSTEM TRIAD: OKUL - VELİ - ÖĞRENCİ ÜÇGENİ */}
      <section className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold uppercase tracking-wider">
              360 DERECE ENTEGRE EĞİTİM ÜÇGENİ
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-on-surface font-extrabold">
              Okul, Veli ve Öğrenci Tek Bir Ekosistemde
            </h2>
            <p className="text-sm text-on-surface-variant">
              Kurum kodunuz ile bağlandığınızda veli, öğrenci ve okul yönetimi için kusursuz bir dijital dünya açılır (Örnek Kurum Kodu:{' '}
              <button
                type="button"
                onClick={() => onNavigateTo('veli-portal')}
                className="font-mono text-primary font-extrabold underline cursor-pointer"
              >
                zerdalikres
              </button>
              ).
            </p>
          </div>

          {/* Mobile Tab Switcher for Triad */}
          <div className="flex lg:hidden bg-surface-container p-1 rounded-2xl gap-1">
            {[
              { id: 'veli' as const, label: '📱 Veli Deneyimi' },
              { id: 'ogrenci' as const, label: '🎓 Öğrenci' },
              { id: 'okul' as const, label: '🏢 Okul & Stok Pratik' }
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setMobileTriadTab(t.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  mobileTriadTab === t.id
                    ? 'bg-white text-on-surface shadow-2xs'
                    : 'text-on-surface-variant'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* 3-Column Triad Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Veli Deneyimi */}
            <div className={`${mobileTriadTab === 'veli' ? 'flex' : 'hidden lg:flex'} bg-surface-container-low rounded-3xl p-6 shadow-xs border border-outline-variant/30 flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2.5 rounded-xl bg-primary-container text-white text-lg">👨‍👩‍👧</span>
                    <div>
                      <h4 className="font-display text-base text-on-surface font-extrabold">Veli Deneyimi &amp; Güven</h4>
                      <p className="text-xs text-on-surface-variant">Mobil &amp; Web Veli Bilgilendirme</p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse" />
                </div>

                <div className="mt-4 space-y-3">
                  <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
                        <Navigation className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">&ldquo;Kapıdayım&rdquo; Kurum Zili</p>
                        <p className="text-[11px] text-on-surface-variant">Okula 200m kala öğretmene otomatik hazırlık bildirimi</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-primary">Aktif</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-2xs space-y-1.5">
                    <p className="text-xs font-bold text-on-surface flex items-center justify-between">
                      <span>Günlük Kreş Karnesi &amp; Fotoğraf Akışı</span>
                      <span className="text-[10px] text-tertiary font-bold">CANLI</span>
                    </p>
                    <div className="flex items-center justify-between text-xs text-on-surface-variant">
                      <span>🥣 Kahvaltı &amp; Öğle Menüsü</span>
                      <span className="font-bold text-tertiary">%100 Yendi</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-on-surface-variant">
                      <span>🎨 Papatyalar Sınıfı Albümü</span>
                      <span className="font-bold text-primary">4 Yeni Fotoğraf</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-on-surface">Online Eğitim Aidatı &amp; Servis</p>
                      <p className="text-[11px] text-on-surface-variant">Kredi kartı ile güvenli ödeme ve e-Fatura indirme</p>
                    </div>
                    <span className="text-[11px] font-bold text-tertiary">3D Secure</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => onNavigateTo('veli-portal')}
                  className="w-full py-2.5 rounded-full bg-primary-container hover:bg-primary text-white text-xs font-display font-bold transition cursor-pointer"
                >
                  Canlı Veli Portalını Önizle
                </button>
              </div>
            </div>

            {/* Column 2: Öğrenci Dünyası */}
            <div className={`${mobileTriadTab === 'ogrenci' ? 'flex' : 'hidden lg:flex'} bg-surface-container-low rounded-3xl p-6 shadow-xs border border-outline-variant/30 flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2.5 rounded-xl bg-secondary text-white text-lg">🎒</span>
                    <div>
                      <h4 className="font-display text-base text-on-surface font-extrabold">Öğrenci Dünyası</h4>
                      <p className="text-xs text-on-surface-variant">Ödev, Deneme Karnesi &amp; Challenge</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold">
                    İlköğretim &amp; Lise
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-2xs space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-on-surface">Haftalık Matematik &amp; Fen Ödevi</span>
                      <span className="text-[11px] font-bold text-tertiary">3 / 4 Tamam</span>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full rounded-full w-3/4" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-on-surface">Türkiye Geneli Deneme Karnesi</p>
                      <p className="text-[11px] text-on-surface-variant">Konu bazlı kazanım ve zayıf halka tespiti</p>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-secondary-fixed text-secondary font-bold text-[11px]">
                      +28 Net
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-on-surface">İSTEM Challenge Arena</p>
                      <p className="text-[11px] text-on-surface-variant">Ödüllü kodlama, matematik ve tasarım yarışmaları</p>
                    </div>
                    <span className="text-[11px] font-bold text-primary">Katıl</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => onNavigateTo('challenges')}
                  className="w-full py-2.5 rounded-full bg-secondary hover:opacity-95 text-white text-xs font-display font-bold transition cursor-pointer"
                >
                  Öğrenci &amp; Challenge Arenası
                </button>
              </div>
            </div>

            {/* Column 3: Kurum Sahipleri İçin Okul & Stok Pratik ERP */}
            <div className={`${mobileTriadTab === 'okul' ? 'flex' : 'hidden lg:flex'} bg-surface-container-low rounded-3xl p-6 shadow-xs border border-outline-variant/30 flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2.5 rounded-xl bg-tertiary text-white text-lg">🏢</span>
                    <div>
                      <h4 className="font-display text-base text-on-surface font-extrabold">Okul &amp; Stok Pratik ERP</h4>
                      <p className="text-xs text-on-surface-variant">Okul-Kreş Sahipleri İçin Yönetim</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold">
                    İşletme Modülü
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-on-surface">Aday Veli CRM &amp; Ön Kayıt Havuzu</p>
                      <p className="text-[11px] text-on-surface-variant">İSTEM vitrininden gelen başvuruları kesin kayda dönüştürün</p>
                    </div>
                    <span className="text-tertiary font-bold text-xs">Canlı</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-2xs space-y-1">
                    <p className="text-xs font-bold text-on-surface flex items-center justify-between">
                      <span>Stok Pratik Taksit &amp; Otomatik e-Fatura</span>
                      <span className="text-[11px] text-tertiary font-bold">GİB Uyumlu</span>
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      Veli sözleşmeleri, senet/taksit takibi ve otomatik WhatsApp ödeme hatırlatıcıları
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-2xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-on-surface">Kantin, Kitap &amp; Kırtasiye Stok Yönetimi</p>
                      <p className="text-[11px] text-on-surface-variant">Stok Pratik ile barkodlu eğitim seti, forma ve yemekhane deposu</p>
                    </div>
                    <span className="text-on-surface font-bold text-[11px]">Stok Pratik</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => triggerOpenAuth('kurum')}
                  className="w-full py-2.5 rounded-full bg-on-surface hover:opacity-90 text-surface text-xs font-display font-bold transition cursor-pointer"
                >
                  Kurum Kodu ile Yönetim Girişi
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CERTIFICATE & ACCREDITATION VERIFICATION */}
      <section className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-inverse-surface text-inverse-on-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-white text-xs font-bold">
              <QrCode className="w-4 h-4" />
              <span>İstanbul Eğitim Merkezi Resmi Doğrulama Merkezi</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl text-white font-extrabold">
              Doğrulanabilir İSTEM Sertifikaları &amp; Karneler
            </h2>
            <p className="text-sm text-inverse-on-surface/80 max-w-xl leading-relaxed">
              İstanbul Eğitim Merkezi (İSTEM) bünyesinde tamamlanan tüm kreş gelişim raporlarını, yabancı dil yeterlilik belgelerini, yazılım ve mesleki uzmanlık sertifikalarını QR kod veya belge numarasıyla anında sorgulayın.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4">
              <label className="text-sm text-white font-bold block">
                Sertifika veya Akreditasyon Belge Kodunu Girin:
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <input
                  type="text"
                  value={certCodeInput}
                  onChange={e => setCertCodeInput(e.target.value)}
                  placeholder="Örn: IST-2025-KID-8492"
                  className="w-full px-4 py-3 rounded-2xl bg-inverse-surface/90 border border-white/25 text-white font-mono text-sm outline-none focus:border-primary-container uppercase"
                />
                <button
                  type="button"
                  onClick={() => setCertVerified(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary-container hover:bg-primary text-white font-display font-bold text-sm transition whitespace-nowrap cursor-pointer"
                >
                  Doğrula &amp; Görüntüle
                </button>
              </div>

              {certVerified && (
                <div className="p-4 rounded-2xl bg-white text-on-surface space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-bold">
                      ✓ GEÇERLİ VE ONAYLI İSTEM BELGESİ
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant">{certCodeInput.toUpperCase()}</span>
                  </div>
                  <p className="font-display text-sm font-extrabold text-on-surface">
                    Montessori Erken Çocukluk &amp; Bilişsel Gelişim Programı / İSTEM Akreditasyonu
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant pt-2 border-t border-outline-variant/30">
                    <div>Öğrenci / Uzman: <strong className="text-on-surface">Zeynep Sarı</strong></div>
                    <div>Kurum: <strong className="text-on-surface">Zerdali Anaokulu</strong></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
