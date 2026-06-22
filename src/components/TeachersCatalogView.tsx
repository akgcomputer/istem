import React, { useState } from 'react';
import { 
  Star, MapPin, Sparkles, Laptop, Building2, Search, Award, 
  SlidersHorizontal, ArrowRight, Plus, Trophy, MessageSquare, Check, X
} from 'lucide-react';
import { MOCK_TEACHERS, Teacher } from '../data/catalogData';
import { Course } from '../types';

const TURKEY_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın',
  'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
  'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş',
  'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli',
  'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
  'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon',
  'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

const isLocationMatch = (teacherLocation: string, selected: string) => {
  if (selected === 'Tümü') return true;
  
  const normTeacher = teacherLocation.toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
    
  const normSelected = selected.toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');

  if (normSelected === 'online') {
    return true; 
  }

  // Support İstanbul sides:
  if (normSelected === 'istanbul avrupa') {
    if (normTeacher.includes('anadolu') || normTeacher.includes('kadikoy') || normTeacher.includes('uskudar')) return false;
    return normTeacher.includes('avrupa') || 
           normTeacher.includes('beyoglu') || 
           normTeacher.includes('besiktas') || 
           normTeacher.includes('sisli') || 
           normTeacher.includes('fatih') || 
           normTeacher.includes('sariyer') || 
           normTeacher.includes('avcilar') || 
           normTeacher.includes('mecidiyekoy') || 
           normTeacher.includes('taksim') ||
           normTeacher.includes('istanbul');
  }

  if (normSelected === 'istanbul anadolu') {
    if (normTeacher.includes('avrupa') || normTeacher.includes('beyoglu') || normTeacher.includes('besiktas')) return false;
    return normTeacher.includes('anadolu') || 
           normTeacher.includes('kadikoy') || 
           normTeacher.includes('uskudar') || 
           normTeacher.includes('kartal') || 
           normTeacher.includes('maltepe') || 
           normTeacher.includes('atasehir') || 
           normTeacher.includes('pendik') || 
           normTeacher.includes('beykoz') || 
           normTeacher.includes('bostanci') ||
           normTeacher.includes('istanbul');
  }

  // Exact sub-strings match:
  if (normTeacher.includes(normSelected) || normSelected.includes(normTeacher)) {
    return true;
  }

  return false;
};

const formatCategory = (cat: string) => {
  if (!cat) return '';
  const lower = cat.toLowerCase();
  if (lower === 'dil') return 'Dil';
  if (lower === 'bilişim') return 'Bilişim';
  if (lower === 'sanat') return 'Sanat';
  if (lower === 'spor') return 'Spor';
  if (lower === 'kişisel') return 'Kişisel';
  if (lower === 'ilköğretim') return 'İlköğretim';
  if (lower === 'lise/sınav') return 'Lise/Sınav';
  return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
};

interface TeachersCatalogViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onNavigateTo: (page: string) => void;
  onViewProfile?: (teacher: Teacher) => void;
}

export default function TeachersCatalogView({ 
  courses, 
  onSelectCourse, 
  onNavigateTo,
  onViewProfile
}: TeachersCatalogViewProps) {
  
  // Teachers state (To support "+ Siz de Öğretmen Olun" simulation)
  const [teachersList, setTeachersList] = useState<Teacher[]>(MOCK_TEACHERS);
  
  // Hide/Show filters state & Pagination states
  const [showFilters, setShowFilters] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  
  // Form simulation state for registration
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Create Teacher State
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    bio: '',
    preferredLocation: '',
    session1Name: '',
    session1Price: '',
    session2Name: '',
    session2Price: '',
    session3Name: '',
    session3Price: '',
    session4Name: '',
    session4Price: '',
    session5Name: '',
    session5Price: '',
    tags: '',
    category: 'Bilişim' as any,
    canOnline: true,
    canCorporate: true,
    canFaceToFace: true
  });

  const [registeredSessions, setRegisteredSessions] = useState<{ category: string; name: string; price: string }[]>([
    { category: 'Bilişim', name: 'Python ile Sıfırdan İleri Seviye', price: '' }
  ]);

  // Suggestion list items database
  const SEARCH_SUGGESTIONS = [
    'Python ile Sıfırdan İleri Seviye',
    'Yapay Zeka Destekli Mobil Uygulamaları',
    'Figma ile Dijital Karakter Çizimi',
    'Konuşma Odaklı Mesleki İngilizce',
    'IELTS / TOEFL Hazırlık',
    'Lise İleri Matematik',
    'Çocuklar İçin Yaratıcı Drama',
    'Kardiyo ve Postür Terapisi',
    'C#', 'Java', 'React'
  ];

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortOption, setSortOption] = useState<string>('populer'); // populer, ucuz, pahali
  const [selectedExperience, setSelectedExperience] = useState<string>('Tümü'); // Tümü, Yeni, 1-5 Yıl, +5 Yıldan Fazla, +10 Yıldan Fazla
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [selectedType, setSelectedType] = useState<string>('Tümü'); // Tümü, Kurumsal, Online, Yüz Yüze
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü'); // Tümü, Bilişim, Dil, İlköğretim, Lise/Sınav, Spor, Sanat, Kişisel
  const [selectedLesson, setSelectedLesson] = useState<string>('Tümü'); // Filter by specific lesson
  const [selectedLocation, setSelectedLocation] = useState<string>('Tümü'); // City / district selection filter

  // Specific lessons per category database map
  const LESSON_OPTIONS_MAP: { [key: string]: string[] } = {
    'Bilişim': ['Python ile Sıfırdan İleri Seviye', 'Yapay Zeka Destekli Mobil Uygulamaları', 'C#', 'Java'],
    'Dil': ['Konuşma Odaklı Mesleki İngilizce', 'IELTS / TOEFL Nokta Atışı Hazırlık'],
    'İlköğretim': ['İlköğretim Hızlı Okuma Eğitimi', 'Çocuklar İçin Yaratıcı Drama'],
    'Lise/Sınav': ['Lise İleri Matematik ve Geometri', 'LGS Derece Garantili Matematik Kampı'],
    'Spor': ['Kardiyo ve Duruş Bozukluğu Terapisi', 'Masa Başı Çalışanlar İçin Postür Atölyesi'],
    'Sanat': ['Figma ile Dijital Karakter Çizimi', 'Temel Yağlı Boya Teknikleri Atölyesi'],
    'Kişisel': ['Zaman Yönetimi Metotları', 'Finansal Okuryazarlık ve Yatırım']
  };

  // Live Auto Suggestions filtration
  const filteredSuggestions = searchQuery.trim().length >= 1 
    ? SEARCH_SUGGESTIONS.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Filter teachers logic
  const filteredTeachers = teachersList.filter(teacher => {
    // 1. Text Search on bio, name, tags, or lessons
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = teacher.name.toLowerCase().includes(q);
      const matchBio = teacher.bio.toLowerCase().includes(q);
      const matchTags = teacher.tags.some(tag => tag.toLowerCase().includes(q));
      const matchLectures = teacher.sessions.some(s => s.name.toLowerCase().includes(q));
      if (!matchName && !matchBio && !matchTags && !matchLectures) return false;
    }

    // 2. Experience Filter
    if (selectedExperience !== 'Tümü' && teacher.experienceLabel !== selectedExperience) {
      return false;
    }

    // 3. Price Filter (matches any session that is <= maxPrice)
    const hasAffordableSession = teacher.sessions.some(s => s.price <= maxPrice);
    if (!hasAffordableSession) return false;

    // 4. Education Type (radio buttons)
    if (selectedType === 'Kurumsal' && !teacher.canCorporate) return false;
    if (selectedType === 'Online' && !teacher.canOnline) return false;
    if (selectedType === 'Yüz Yüze' && !teacher.canFaceToFace) return false;

    // 5. Category checklist
    if (selectedCategory !== 'Tümü' && teacher.category !== selectedCategory) return false;

    // 6. Lesson check (Only valid if category selected)
    if (selectedCategory !== 'Tümü' && selectedLesson !== 'Tümü') {
      const teachesLesson = teacher.sessions.some(s => s.name.includes(selectedLesson) || teacher.tags.includes(selectedLesson));
      if (!teachesLesson) return false;
    }

    // 7. Location Filter (online option or match text)
    if (selectedLocation !== 'Tümü') {
      if (selectedLocation === 'Online') {
        if (!teacher.canOnline) return false;
      } else {
        const matchesLoc = isLocationMatch(teacher.preferredLocation, selectedLocation);
        if (!matchesLoc) return false;
      }
    }

    return true;
  });

  // Sort logic based on first session or rating
  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    if (sortOption === 'ucuz') {
      const minA = Math.min(...a.sessions.map(s => s.price));
      const minB = Math.min(...b.sessions.map(s => s.price));
      return minA - minB;
    }
    if (sortOption === 'pahali') {
      const maxA = Math.max(...a.sessions.map(s => s.price));
      const maxB = Math.max(...b.sessions.map(s => s.price));
      return maxB - maxA;
    }
    // Default popular based on ratings & comments
    return b.rating * b.commentsCount - a.rating * a.commentsCount;
  });

  // Reset pagination when criteria changes
  React.useEffect(() => {
    setVisibleCount(6);
  }, [searchQuery, selectedExperience, maxPrice, selectedType, selectedCategory, selectedLesson, selectedLocation, sortOption]);

  // Submit new teacher simulation
  const handleRegisterTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name) return;

    // Build the dynamic session list
    const sessionList = registeredSessions
      .filter(s => s.name && s.price)
      .map(s => ({
        name: s.name,
        price: Number(s.price) || 500
      }));

    if (sessionList.length === 0) {
      sessionList.push({ name: 'Genel Mentörlük Seansı', price: 600 });
    }

    const created: Teacher = {
      id: `teacher-${Date.now()}`,
      name: newTeacher.name,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: 5.0,
      commentsCount: 1,
      experienceYears: 2,
      experienceLabel: '1-5 Yıl',
      bio: newTeacher.bio || 'Yeni kaydolmuş bağımsız öğretmenimiz.',
      sessions: sessionList,
      preferredLocation: newTeacher.preferredLocation || 'Sadece Online',
      canCorporate: newTeacher.canCorporate,
      canOnline: newTeacher.canOnline,
      canFaceToFace: newTeacher.canFaceToFace,
      tags: newTeacher.tags.split(',').map(t => t.trim()).filter(Boolean),
      category: newTeacher.category
    };

    setTeachersList([created, ...teachersList]);
    setSuccessMessage('🎉 Başvurunuz başarıyla site yönetimine (admin paneli) iletildi! Başvurunuz onaylandığında yayına alınacaktır.');
    setTimeout(() => {
      setSuccessMessage('');
      setShowRegisterForm(false);
    }, 4500);

    // Reset fields
    setNewTeacher({
      name: '',
      bio: '',
      preferredLocation: '',
      session1Name: '',
      session1Price: '',
      session2Name: '',
      session2Price: '',
      session3Name: '',
      session3Price: '',
      session4Name: '',
      session4Price: '',
      session5Name: '',
      session5Price: '',
      tags: '',
      category: 'Bilişim',
      canOnline: true,
      canCorporate: true,
      canFaceToFace: true
    });
    setRegisteredSessions([{ category: 'Bilişim', name: 'Python ile Sıfırdan İleri Seviye', price: '' }]);
  };

  // Detailed Modal for Reviewing Teacher Profile
  const [selectedProfileTeacher, setSelectedProfileTeacher] = useState<Teacher | null>(null);

  // Quick navigation link to course description page
  const handleCourseLinkClick = (sessionName: string, linkedCourseId?: string) => {
    setSelectedProfileTeacher(null); // Close modal
    if (linkedCourseId) {
      const target = courses.find(c => c.id === linkedCourseId);
      if (target) {
        onSelectCourse(target);
        return;
      }
    }
    // Fallback: match by search tag or send to first
    const match = courses.find(c => 
      c.title.toLowerCase().includes(sessionName.toLowerCase().slice(0, 10)) ||
      c.category.toLowerCase().includes(sessionName.toLowerCase().slice(0, 10))
    );
    onSelectCourse(match || courses[0]);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* UPPER BANNER ROW */}
        <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E11A4F]/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <span className="text-[10px] tracking-widest font-black text-[#E58F49] uppercase block">
              TÜRKİYE'NİN İLK KİŞİSELLEŞTİRİLMİŞ BAĞIMSIZ ÖĞRETMEN EKOSİSTEMİ
            </span>
            <h1 id="teachers-catalog-title" className="text-2xl sm:text-3.5xl font-extrabold font-display text-zinc-950 mt-1 leading-tight">
              Öğretmenler Kataloğu
            </h1>
            <p className="text-xs text-zinc-550 mt-1.5 max-w-2xl">
              Komisyon kesilmeden doğrudan anlaştığınız, lisanslı ve canlı değerlendirilmiş uzman eğitmen havuzu. Şeffaf saatlik seans ücretleri ve tescilli mezuniyet referansları.
            </p>
          </div>

          <button 
            onClick={() => setShowRegisterForm(true)}
            className="w-full sm:w-auto shrink-0 bg-zinc-950 hover:bg-zinc-900 text-[#39FF14] hover:scale-[1.02] active:scale-98 text-xs font-black px-5 py-3.5 rounded-2xl transition shadow-md flex items-center justify-center gap-2 border border-zinc-850"
          >
            <Plus className="w-4 h-4 text-[#39FF14]" />
            + Siz de Öğretmen Olun!
          </button>
        </div>

        {/* DOUBLE COLUMN GRID: LEFT FILTER, RIGHT LISTING */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SEARCH & FILTERS ON LEFT (Col span 4 or 3) */}
          {showFilters && (
            <div className="lg:col-span-3 bg-white border border-zinc-200/60 rounded-3xl p-5 shadow-xs space-y-6">
            
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 text-zinc-800 font-bold text-sm">
              <SlidersHorizontal className="w-4 h-4 text-[#E58F49]" />
              Gelişmiş Filtre Sistemi
            </div>

            {/* 1. DERS ADI İLE ARA (With auto-suggestion recommended drops) */}
            <div className="space-y-2 relative">
              <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block">DERS ADI VEYA YETKİNLİK SORGULA</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Örn: 'Python', 'Matematik', 'TOEFL'"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-zinc-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#E58F49]"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-3.5" />
                
                {searchQuery && (
                  <button 
                    onClick={() => { setSearchQuery(''); setShowSuggestions(false); }} 
                    className="absolute right-3 top-3 text-[10px] text-zinc-400 hover:text-zinc-950 font-bold"
                  >
                    Temizle
                  </button>
                )}
              </div>

              {/* Suggestions Panel */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-zinc-200/80 rounded-xl shadow-lg z-25 max-h-48 overflow-y-auto divide-y divide-zinc-50">
                  <span className="text-[9px] font-bold text-zinc-400 px-3 py-1.5 block bg-zinc-50 tracking-wider">ARAMA ÖNERİLERİ</span>
                  {filteredSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-zinc-50 text-zinc-700 block transition"
                    >
                      💡 {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* KONUM SEÇ DROPDOWN */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block">KONUM SEÇİNİZ</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#E58F49]"
              >
                <option value="Tümü">📍 Tüm Konumlar</option>
                <option value="Online">💻 Online Ders</option>
                <optgroup label="Büyük Şehirler">
                  <option value="İstanbul Anadolu">📍 İstanbul Anadolu</option>
                  <option value="İstanbul Avrupa">📍 İstanbul Avrupa</option>
                  <option value="Ankara">📍 Ankara</option>
                  <option value="İzmir">📍 İzmir</option>
                </optgroup>
                <optgroup label="81 Şehrin Tamamı (Alfabetik)">
                  {TURKEY_CITIES.map((city, idx) => (
                    <option key={idx} value={city}>📍 {city}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* 2. DERS KATEGORİSİ SEÇ */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block">KATEGORİ</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedLesson('Tümü'); // reset lesson when category changes
                }}
                className="w-full bg-zinc-55 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold text-zinc-755 focus:outline-none focus:ring-1 focus:ring-[#E58F49] text-zinc-700"
              >
                <option value="Tümü">Tüm Kategoriler</option>
                <option value="Bilişim">💻 Bilişim &amp; Yazılım</option>
                <option value="Dil">🌐 Dil &amp; Lisans</option>
                <option value="İlköğretim">📚 İlköğretim Okutmanlığı</option>
                <option value="Lise/Sınav">🎯 Lise / LGS-YKS Hazırlık</option>
                <option value="Spor">⚽ Spor &amp; Fitness</option>
                <option value="Sanat">🎨 Sanat &amp; Tasarım</option>
                <option value="Kişisel">🌱 Kişisel Gelişim</option>
              </select>
            </div>

            {/* 3. DERS SEÇ (Kategori seçilmemişse boş kalacak veya kilitli olacak) */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block">ÖZEL DERS SEÇİMİ</label>
              {selectedCategory === 'Tümü' ? (
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-center text-[11px] text-zinc-400 font-semibold italic">
                  ⚠ Önce Kategori Seçmelisiniz
                </div>
              ) : (
                <select
                  value={selectedLesson}
                  onChange={(e) => setSelectedLesson(e.target.value)}
                  className="w-full bg-zinc-50 border border-emerald-300 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-755 focus:outline-none text-zinc-800"
                >
                  <option value="Tümü">Seçilen Kategori Tüm Dersleri</option>
                  {(LESSON_OPTIONS_MAP[selectedCategory] || []).map((les, idx) => (
                    <option key={idx} value={les}>{les}</option>
                  ))}
                </select>
              )}
            </div>

            {/* 4. ÖĞRETMENİN TECRÜBESİ */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block">EĞİTMEN TECRÜBESİ</label>
              <div className="flex flex-col gap-1.5">
                {['Tümü', 'Yeni', '1-5 Yıl', '+5 Yıldan Fazla', '+10 Yıldan Fazla'].map(exp => (
                  <button
                    key={exp}
                    onClick={() => setSelectedExperience(exp)}
                    className={`text-left text-xs px-3 py-2 rounded-xl border transition ${
                      selectedExperience === exp 
                        ? 'border-[#E58F49] bg-amber-50/70 text-[#8C3F03] font-black' 
                        : 'border-zinc-200/60 text-zinc-600 font-bold hover:bg-zinc-50'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. FİYAT ARALIĞI SLIDER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400">MAX SEANS FİYATI</label>
                <span className="text-xs font-bold text-[#E58F49] font-mono">₺{maxPrice}</span>
              </div>
              <input 
                type="range"
                min="400"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#E58F49] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-bold font-mono">
                <span>₺400</span>
                <span>₺900</span>
                <span>₺1500</span>
              </div>
            </div>

            {/* 6. EĞİTİM TÜRÜ RADIO BUTTONS */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block">EĞİTİM MODELİ</label>
              <div className="space-y-1.5">
                {[
                  { value: 'Tümü', label: '✓ Tümü (Kısıtlama Yok)' },
                  { value: 'Kurumsal', label: '✓ Sadece Kurumsal Eğitimler' },
                  { value: 'Online', label: '✓ Sadece Online Eğitimler' },
                  { value: 'Yüz Yüze', label: '✓ Sadece Yüz Yüze Eğitimler' }
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 border border-zinc-100 rounded-lg p-2 hover:bg-zinc-50 cursor-pointer text-xs font-bold text-zinc-700">
                    <input 
                      type="radio" 
                      name="educationType"
                      checked={selectedType === opt.value}
                      onChange={() => setSelectedType(opt.value)}
                      className="accent-[#E58F49]"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Filter Action */}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedExperience('Tümü');
                setMaxPrice(1500);
                setSelectedType('Tümü');
                setSelectedCategory('Tümü');
                setSelectedLesson('Tümü');
                setSelectedLocation('Tümü');
              }}
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold py-2.5 rounded-xl transition"
            >
              Filtreleri Temizle
            </button>

          </div>
          )}

          {/* RIGHT COLUMN: LISTING */}
          <div className={`${showFilters ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-6`}>
            
            {/* SORT HEADER */}
            <div className="bg-white border border-zinc-200/60 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-black rounded-xl transition duration-150"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#E58F49]" />
                  {showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
                </button>
                <span className="text-xs font-bold text-zinc-500 text-center sm:text-left">
                  Kriterlere Uyan <strong className="text-zinc-800 text-sm font-black">{sortedTeachers.length} Uzman Eğitmen</strong> Bulundu
                </span>
              </div>

              {/* Sort controls */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">SIRALA:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none text-zinc-750"
                >
                  <option value="populer">En Popüler &amp; Değerlendirme</option>
                  <option value="ucuz">Fiyat (Düşükten Yükseğe)</option>
                  <option value="pahali">Fiyat (Yüksekten Düşüğe)</option>
                </select>
              </div>
            </div>

            {/* TEACHERS MULTI-COLUMN RESPONSIVE LAYOUT */}
            {sortedTeachers.length > 0 ? (
              <>
                <div className={`grid grid-cols-2 gap-3 sm:gap-6 ${
                  showFilters 
                    ? 'md:grid-cols-2 lg:grid-cols-3' 
                    : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                  {sortedTeachers.slice(0, visibleCount).map((teacher) => (
                  <div 
                    key={teacher.id}
                    className="bg-white border border-zinc-200 rounded-2xl md:rounded-3xl p-3 sm:p-5 shadow-xs hover:shadow-md hover:border-[#E58F49] transition flex flex-col justify-between gap-3 sm:gap-4 group"
                  >
                    
                    {/* Header: Photo and Badges */}
                    <div className="flex items-start justify-between gap-1.5 sm:gap-3 flex-wrap sm:flex-nowrap">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative">
                          <img 
                            src={teacher.avatar} 
                            alt={teacher.name} 
                            className="w-11 sm:w-13 h-11 sm:h-13 rounded-xl sm:rounded-2xl object-cover border-2 border-zinc-100"
                          />
                          <span className="absolute -bottom-1.5 -right-1.5 bg-amber-400 text-zinc-950 px-1.5 py-0.5 rounded-lg text-[9px] font-black border border-amber-500/20 whitespace-nowrap shadow-xs">
                            {teacher.experienceLabel === '+10 Yıldan Fazla' ? '+10 Yıl' : teacher.experienceLabel === '+5 Yıldan Fazla' ? '+5 Yıl' : teacher.experienceLabel}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-black text-zinc-950 line-clamp-1 group-hover:text-[#E58F49] transition">
                            {teacher.name}
                          </h3>
                          
                          {/* Rating details: Yellow background rating badge with black text */}
                          <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-[11px] font-black flex-wrap">
                            <span className="bg-amber-400 text-zinc-950 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-2xs font-extrabold text-[9px] sm:text-[10px]">
                              ★ {teacher.rating.toFixed(1)}
                            </span>
                            <span className="bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 text-[10px] sm:text-[11px] font-extrabold">
                              💬 {teacher.commentsCount}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] sm:text-[11px] font-extrabold bg-[#E11A4F] text-white px-2.5 py-0.5 rounded-md shrink-0 shadow-xs">
                        {formatCategory(teacher.category)}
                      </span>
                    </div>

                    {/* Biography (Max 200 chars limit applied) */}
                    <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-relaxed font-semibold line-clamp-3">
                      {teacher.bio.slice(0, 200)}
                    </p>

                    {/* INTERACTIVE COURSES GRID IN CARDS */}
                    <div className="space-y-1.5 bg-[#FAF9F5] border border-zinc-150/70 p-2.5 rounded-xl sm:rounded-2xl">
                      <span className="text-[10px] sm:text-[11px] font-black tracking-tight text-zinc-950 flex items-center gap-1">
                        📚 Verdiği dersler ve ücretleri:
                      </span>
                      <div className="space-y-1">
                        {teacher.sessions.slice(0, 2).map((sess, idx) => (
                          <div 
                            key={idx}
                            onClick={() => handleCourseLinkClick(sess.name, sess.courseId)}
                            className="bg-white hover:bg-amber-50/40 border border-zinc-150/80 px-2 py-1.5 rounded-lg flex items-center justify-between gap-1.5 cursor-pointer transition text-[10px] sm:text-[11px]"
                          >
                            <span className="font-bold text-[#E58F49] hover:underline truncate line-clamp-1">
                              {sess.name}
                            </span>
                            <span className="font-black text-zinc-900 font-mono shrink-0">
                              {sess.price}₺
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & details meta list */}
                    <div className="space-y-1 border-t border-zinc-100 pt-2 text-[9px] sm:text-[10px] text-zinc-650">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-zinc-400 mt-0.5 shrink-0" />
                        <span className="font-semibold text-zinc-700 leading-tight">
                          Konum: <strong className="text-zinc-900 font-extrabold">{teacher.preferredLocation}</strong>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1 mt-1 border-t border-zinc-55 pt-1.5 font-bold">
                        <div className="flex items-center gap-1 text-[9px]">
                          <span className={`w-1.5 h-1.5 rounded-full ${teacher.canCorporate ? 'bg-emerald-500' : 'bg-red-400'}`} />
                          <span className={teacher.canCorporate ? 'text-emerald-800' : 'text-zinc-400 line-through'}>
                            Kurumsal: {teacher.canCorporate ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px]">
                          <span className={`w-1.5 h-1.5 rounded-full ${teacher.canOnline ? 'bg-emerald-500' : 'bg-red-400'}`} />
                          <span className={teacher.canOnline ? 'text-emerald-800' : 'text-zinc-400 line-through'}>
                            Online ders: {teacher.canOnline ? '✓' : '✗'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tags row */}
                    <div className="flex flex-wrap gap-1">
                      {teacher.tags.map((tag, i) => (
                        <span key={i} className="text-[8px] sm:text-[9px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-mono font-bold">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-zinc-100">
                      <button
                        onClick={() => {
                          if (onViewProfile) {
                            onViewProfile(teacher);
                          } else {
                            setSelectedProfileTeacher(teacher);
                          }
                        }}
                        className="w-full bg-[#E58F49] hover:bg-zinc-950 text-zinc-950 hover:text-white font-black text-xs sm:text-sm py-3 px-4 rounded-xl transition duration-200 text-center hover:scale-[1.01] active:scale-95 shadow-md cursor-pointer"
                      >
                        Öğretmeni İncele
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {sortedTeachers.length > visibleCount && (
                <div className="pt-8 text-center flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="flex justify-center items-center gap-2 px-8 py-3 bg-white hover:bg-zinc-50 text-zinc-950 border border-zinc-200/60 hover:border-zinc-300 rounded-2xl font-black text-xs transition duration-200 active:scale-95 shadow-xs"
                  >
                    Daha Fazla Öğretmen Yükle
                  </button>
                </div>
              )}
            </>
            ) : (
              <div className="bg-white border border-zinc-200/60 rounded-3xl p-12 text-center">
                <span className="text-4xl">🔍</span>
                <h4 className="text-base font-bold text-zinc-900 mt-4">Kriterlere Uygun Öğretmen Bulunamadı</h4>
                <p className="text-xs text-zinc-500 mt-1">Lütfen kategori veya tecrübe kriterlerinizi kaldırmayı deneyin.</p>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* --- SİZ DE ÖĞRETMEN OLUN MODAL SIMULATOR --- */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-zinc-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative border border-zinc-200 shadow-2xl">
            
            <button 
              onClick={() => setShowRegisterForm(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-900 transition p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] bg-[#E58F49]/10 text-[#8C3F03] px-2.5 py-1 rounded-full font-extrabold tracking-widest block w-fit mb-1">
                Eğitmen Ön Kayıt Portalı
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display text-rose-600">
                Eğitmen Olarak Katılın!
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Hiçbir komisyon olmadan, öğrencilerin doğrudan kapınızı çalacağı benzersiz profilinizi anında yayına alın.
              </p>
            </div>

            {successMessage ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-emerald-800 text-center font-bold">
                {successMessage}
              </div>
            ) : (
              <form onSubmit={handleRegisterTeacherSubmit} className="space-y-4 text-xs font-semibold">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-500 block mb-1">
                      Eğitmen Adı ve Soyadı <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Örn: Serdar Yılmaz"
                      value={newTeacher.name}
                      onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#E58F49]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Yüz Yüze Konum Opsiyonu</label>
                    <input 
                      type="text" 
                      placeholder="Örn: Ankara Mamak, Konya Meram veya İstanbul Kartal"
                      value={newTeacher.preferredLocation}
                      onChange={(e) => setNewTeacher({...newTeacher, preferredLocation: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#E58F49]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-500 block mb-1">Ana Eğitim Kategorisi</label>
                    <select
                      value={newTeacher.category}
                      onChange={(e) => setNewTeacher({...newTeacher, category: e.target.value as any})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#E58F49] text-zinc-700 font-bold"
                    >
                      <option value="Bilişim">Bilişim &amp; Yazılım</option>
                      <option value="Dil">Dil &amp; Lisans</option>
                      <option value="İlköğretim">İlköğretim Okutmanlığı</option>
                      <option value="Lise/Sınav">Lise / Sınav Grubu</option>
                      <option value="Spor">Spor &amp; Rekreasyon</option>
                      <option value="Sanat">Sanat &amp; Tasarım</option>
                      <option value="Kişisel">Kişisel Gelişim</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">
                      Etiket <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Örn: React, C#, CSS, İngilizce"
                      value={newTeacher.tags}
                      onChange={(e) => setNewTeacher({...newTeacher, tags: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#E58F49]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-500 block mb-1">
                    Kendi Tanıtım Biyografiniz (En Fazla 200 Karakter) <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <textarea 
                    required
                    maxLength={200}
                    rows={2}
                    placeholder="2018 yılından beri özel ders vermekteyim..."
                    value={newTeacher.bio}
                    onChange={(e) => setNewTeacher({...newTeacher, bio: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#E58F49]"
                  />
                  <div className="text-[10px] text-zinc-400 text-right font-mono">{newTeacher.bio.length}/200 karakter</div>
                </div>

                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-3">
                  <span className="text-[10px] text-zinc-500 font-bold tracking-wider block">Verilen Dersler ve Saatlik Seans Ücretleri (En Fazla 5 Ders)</span>
                  
                  <div className="space-y-3">
                    {registeredSessions.map((session, idx) => {
                      const lessonsForCategory = LESSON_OPTIONS_MAP[session.category] || [];
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-white p-3 rounded-xl border border-zinc-200">
                          <div className="w-full sm:w-1/3">
                            <label className="text-[9px] text-zinc-400 block mb-0.5">Kategori ({idx + 1}. Ders)</label>
                            <select
                              value={session.category}
                              onChange={(e) => {
                                const updated = [...registeredSessions];
                                updated[idx].category = e.target.value;
                                const options = LESSON_OPTIONS_MAP[e.target.value] || [];
                                updated[idx].name = options[0] || '';
                                setRegisteredSessions(updated);
                              }}
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#E58F49] text-xs font-semibold"
                            >
                              {Object.keys(LESSON_OPTIONS_MAP).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          <div className="w-full sm:w-5/12">
                            <label className="text-[9px] text-zinc-400 block mb-0.5">
                              Ders Seçiniz <span className="text-rose-500 font-bold">*</span>
                            </label>
                            <select
                              required
                              value={session.name}
                              onChange={(e) => {
                                const updated = [...registeredSessions];
                                updated[idx].name = e.target.value;
                                setRegisteredSessions(updated);
                              }}
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#E58F49] text-xs font-semibold text-zinc-800"
                            >
                              <option value="">Ders Seçiniz *</option>
                              {lessonsForCategory.map(lesson => (
                                <option key={lesson} value={lesson}>{lesson}</option>
                              ))}
                            </select>
                          </div>

                          <div className="w-full sm:w-3/12 flex gap-1 items-end">
                            <div className="flex-1">
                              <label className="text-[9px] text-zinc-400 block mb-0.5">
                                Fiyat <span className="text-rose-500 font-bold">*</span>
                              </label>
                              <input 
                                type="number" 
                                required
                                placeholder="₺ Fiyat Seansı"
                                value={session.price}
                                onChange={(e) => {
                                  const updated = [...registeredSessions];
                                  updated[idx].price = e.target.value;
                                  setRegisteredSessions(updated);
                                }}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#E58F49] font-mono text-xs text-right"
                              />
                            </div>
                            {registeredSessions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = registeredSessions.filter((_, i) => i !== idx);
                                  setRegisteredSessions(updated);
                                }}
                                className="text-red-550 text-red-500 hover:text-red-700 p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition mb-0.5 shrink-0"
                                title="Lersi Kaldır"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {registeredSessions.length < 5 && (
                    <div className="text-right pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const firstCat = Object.keys(LESSON_OPTIONS_MAP)[0];
                          const defaultLesson = LESSON_OPTIONS_MAP[firstCat][0];
                          setRegisteredSessions([
                            ...registeredSessions,
                            { category: firstCat, name: defaultLesson, price: '' }
                          ]);
                        }}
                        className="text-[#E58F49] hover:text-[#b0672e] text-xs font-bold underline transition"
                      >
                        + Ders Ekle
                      </button>
                    </div>
                  )}
                </div>

                {/* Delivery format checklist */}
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 flex flex-wrap gap-4 items-center">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Çalışma Şekilleri:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newTeacher.canOnline} 
                      onChange={(e) => setNewTeacher({...newTeacher, canOnline: e.target.checked})}
                      className="accent-[#E58F49]" 
                    />
                    <span>Online Sınıflar</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newTeacher.canFaceToFace} 
                      onChange={(e) => setNewTeacher({...newTeacher, canFaceToFace: e.target.checked})}
                      className="accent-[#E58F49]" 
                    />
                    <span>Yüz Yüze Konum</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newTeacher.canCorporate} 
                      onChange={(e) => setNewTeacher({...newTeacher, canCorporate: e.target.checked})}
                      className="accent-[#E58F49]" 
                    />
                    <span>Kurumsal Davet</span>
                  </label>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-[#E58F49] hover:bg-[#D4803A] text-white font-extrabold py-3 rounded-xl transition text-center shadow-sm text-sm"
                  >
                    Başvur
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* --- INSTRUCTOR PROFILE MODAL FOR DETAILS "ÖĞRETMENİ İNCELE" --- */}
      {selectedProfileTeacher && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-zinc-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full relative border border-zinc-200 shadow-2xl">
            
            <button 
              onClick={() => setSelectedProfileTeacher(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-900 transition p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 border-b border-zinc-100 pb-4 mb-4">
              <img 
                src={selectedProfileTeacher.avatar} 
                alt={selectedProfileTeacher.name} 
                className="w-16 h-16 rounded-2xl object-cover border border-zinc-150"
              />
              <div>
                <span className="text-[10px] bg-zinc-950 text-[#39FF14] px-2.5 py-0.5 rounded-full font-bold uppercase block w-fit mb-1 tracking-wider">
                  ✓ DOĞRULANMIŞ LİSANSLI EĞİTMEN
                </span>
                <h3 className="text-xl font-black text-zinc-950">{selectedProfileTeacher.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold mt-1">
                  <span className="text-amber-500 flex items-center">★ {selectedProfileTeacher.rating.toFixed(1)}</span>
                  <span>({selectedProfileTeacher.commentsCount} tescilli veli yorumu)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm font-semibold leading-relaxed">
              <div>
                <b className="text-zinc-400 uppercase text-[10px] tracking-wider block mb-1">Eğitmen Biyografisi:</b>
                <p className="text-zinc-750 font-medium bg-zinc-50 p-3 rounded-xl border border-zinc-200/50">
                  {selectedProfileTeacher.bio}
                </p>
              </div>

              <div>
                <b className="text-zinc-400 uppercase text-[10px] tracking-wider block mb-2">📚 Hazır Ders Başlıkları ve Seans Ücretleri:</b>
                <div className="space-y-2">
                  {selectedProfileTeacher.sessions.map((sess, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleCourseLinkClick(sess.name, sess.courseId)}
                      className="bg-zinc-50 hover:bg-amber-50/50 border border-zinc-200 rounded-xl p-3 flex justify-between items-center transition cursor-pointer"
                    >
                      <div className="text-left font-bold text-[#E58F49] hover:underline">
                        📚 {sess.name}
                        {sess.courseId && <span className="ml-1.5 text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Müfredatı Gör</span>}
                      </div>
                      <div className="font-extrabold text-zinc-900 font-mono text-sm">{sess.price}₺ / saat</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-4 text-xs font-semibold">
                <div>
                  <span className="text-zinc-400 text-[10px] tracking-wider block">Yüz Yüze Konum:</span>
                  <span className="text-zinc-800">{selectedProfileTeacher.preferredLocation}</span>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] tracking-wider block">Eğitim Grubu:</span>
                  <span className="text-zinc-800">{selectedProfileTeacher.category} Grubu</span>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] tracking-wider block">Online Eğitim:</span>
                  <span className="text-zinc-800">{selectedProfileTeacher.canOnline ? '✓ Destekliyor' : '✗ Sadece Yüz Yüze'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] tracking-wider block">Kurumsal Eğitim:</span>
                  <span className="text-zinc-800">{selectedProfileTeacher.canCorporate ? '✓ Şirket İçi Verebilir' : '✗ Sadece Bireysel'}</span>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-5 border-t border-zinc-100 flex gap-3">
              <button
                onClick={() => setSelectedProfileTeacher(null)}
                className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold py-3.5 rounded-xl transition text-center"
              >
                Pencereyi Kapat
              </button>
              <button
                onClick={() => {
                  setSelectedProfileTeacher(null);
                  alert(`Teklif alındı! ${selectedProfileTeacher.name} sizinle doğrudan sisteme kayıtlı mail/telefon numaranız üzerinden iletişime geçecektir.`);
                }}
                className="flex-1 bg-[#E58F49] hover:bg-[#D4803A] text-white font-extrabold py-3.5 rounded-xl transition text-center"
              >
                Hemen İletişim Kur
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
