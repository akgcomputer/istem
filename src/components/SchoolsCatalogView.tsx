import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, Users, BookOpen, Clock, Heart, Star, Plus, X, Search, SlidersHorizontal, ChevronDown, ChevronUp, Eye, EyeOff
} from 'lucide-react';
import { PrivateSchool } from '../data/catalogData';
import ShareButtons from './ShareButtons';

const LESSON_OPTIONS_MAP: { [key: string]: string[] } = {
  'Bilişim': ['Frontend Web Tasarımı', 'Python Programlama', 'Yapay Zeka & Prompt Mühendisliği', 'Unity Mobil Oyun Geliştirme'],
  'Dil': ['Gramer ve Temel Konuşma', 'IELTS / TOEFL Hazırlığı', 'Almanca A1-A2 Başlangıç', 'Pratik Konuşma Kulübü'],
  'İlköğretim': ['İlköğretim Okuma-Yazma', 'Duyu Gelişimi & Montessori', 'Temel Matematik & Sayılar', 'Türkçe Güzel Konuşma'],
  'Lise/Sınav': ['YKS Matematik Derece Hazırlık', 'LGS Fen Bilgisi Soru Kampı', 'Geometri Pratik Çözümler', 'Edebiyat Soru Yakalama Tahmini'],
  'Spor': ['Birebir Fitness & Pilates', 'Çocuklar İçin Temel Jimnastik', 'Yüzme Teknikleri Eğitimi', 'Kişisel Antrenman Koçluğu'],
  'Sanat': ['Karakalem & Portre Çizimi', 'Temel Piyano Metodolojisi', 'Keman & Yaylı Sazlar', 'Temel Fotoğrafçılık Teknikleri'],
  'Kişisel': ['Zaman Yönetimi & Planlama', 'Diksiyon & Güzel Konuşma', 'Sosyal Medya Yönetimi', 'Excel & Üretkenlik Araçları']
};

const formatSchoolType = (type: string) => {
  if (!type) return '';
  const lower = type.toLowerCase().trim();
  if (lower === 'lise') return 'Lise';
  if (lower === 'ilkokul') return 'İlkokul';
  if (lower === 'ortaokul') return 'Ortaokul';
  if (lower === 'anaokulu') return 'Anaokulu';
  if (lower === 'kolej') return 'Kolej';
  if (lower === 'yabancı dil') return 'Yabancı Dil';
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

const isLocationMatch = (schoolLocation: string, selected: string) => {
  if (selected === 'Tümü') return true;
  
  const normSchool = schoolLocation.toLowerCase()
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

  if (normSelected === 'istanbul avrupa') {
    if (normSchool.includes('anadolu') || normSchool.includes('kadikoy') || normSchool.includes('uskudar') || normSchool.includes('maltepe') || normSchool.includes('umraniye')) return false;
    return normSchool.includes('istanbul') || normSchool.includes('avrupa') || normSchool.includes('besiktas') || normSchool.includes('bebek') || normSchool.includes('sisli');
  }
  if (normSelected === 'istanbul anadolu') {
    if (normSchool.includes('avrupa') || normSchool.includes('besiktas') || normSchool.includes('bebek') || normSchool.includes('sisli')) return false;
    return normSchool.includes('istanbul') || normSchool.includes('anadolu') || normSchool.includes('uskudar') || normSchool.includes('kadikoy') || normSchool.includes('maltepe') || normSchool.includes('kisikli') || normSchool.includes('kucukyali');
  }

  return normSchool.includes(normSelected);
};

export default function SchoolsCatalogView() {
  const [selectedSchool, setSelectedSchool] = useState<PrivateSchool | null>(null);
  const [showRegForm, setShowRegForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Create School Form State
  const [newSchool, setNewSchool] = useState({
    name: '',
    location: '',
    capacity: '',
    teachersCount: '',
    type: 'Lise' as any,
    lessons: '',
    lessonHours: '',
    schoolHours: '',
    parentReviewText: '',
    reviewerName: '',
    sector: 'Özel Okul' as any,
    averageClassSize: '16',
    branchesCount: '1',
    monthlyPrice: '8000',
    deals: '%10 İndirim, Kampanya'
  });

  // Gelişmiş Filtre Sistemi States
  const [showFilters, setShowFilters] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [filterLocation, setFilterLocation] = useState('Tümü');

  // Okul Spesifik Filtreleri
  const [filterSector, setFilterSector] = useState('Hepsi'); // Hepsi, Devlet Okulu, Özel Okul
  const [filterSchoolCategory, setFilterSchoolCategory] = useState('Hepsi'); // Hepsi, Anaokulu, İlkokul, Ortaokul, Lise
  const [filterMonthlyPrice, setFilterMonthlyPrice] = useState(20000); // Aylık Ortalama Fiyat Barı (0-20000)
  const [filterClassSize, setFilterClassSize] = useState('Hepsi'); // Hepsi, 1-5 kişilik, 1-10 kişilik...

  // Okul İmkanları (dropdown / toggle menus with "Daha Fazla Göster")
  const [filterEducationSystem, setFilterEducationSystem] = useState('Hepsi');
  const [filterPhysicalFacilities, setFilterPhysicalFacilities] = useState('Hepsi');
  const [filterServices, setFilterServices] = useState('Hepsi');
  const [filterActivities, setFilterActivities] = useState('Hepsi');
  const [filterLanguages, setFilterLanguages] = useState('Hepsi');

  // Collapse / Expand Toggles for İmkanlar lists:
  const [showMoreEduc, setShowMoreEduc] = useState(false);
  const [showMorePhys, setShowMorePhys] = useState(false);
  const [showMoreServ, setShowMoreServ] = useState(false);
  const [showMoreAct, setShowMoreAct] = useState(false);
  const [showMoreLang, setShowMoreLang] = useState(false);

  // Filtration logic
  const [schools, setSchools] = useState<PrivateSchool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/private_schools')
      .then(res => res.json())
      .then(data => {
        setSchools(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const randomWeights = React.useMemo(() => {
    const weights: Record<string, number> = {};
    schools.forEach(s => weights[s.id] = Math.random());
    return weights;
  }, [schools]);

  const filteredSchools = [...schools].sort((a, b) => (randomWeights[a.id] || 0) - (randomWeights[b.id] || 0)).filter(school => {
    // 1. DERS ADI VEYA YETKİNLİK SORGULA / Keyword Search
    if (searchName.trim()) {
      const q = searchName.toLowerCase();
      const matchName = (school.name || '').toLowerCase().includes(q);
      const matchLoc = (school.location || '').toLowerCase().includes(q);
      const matchLessons = (school.lessons || []).some(l => (l || '').toLowerCase().includes(q));
      if (!matchName && !matchLoc && !matchLessons) return false;
    }

    // 2. KONUM SEÇİNİZ
    if (filterLocation !== 'Tümü') {
      if (!isLocationMatch(school.location, filterLocation)) {
        return false;
      }
    }

    // 4. Okul Sektörü: Hepsi, Devlet Okulu, Özel Okul
    if (filterSector !== 'Hepsi' && school.sector !== filterSector) {
      return false;
    }

    // 5. Okul Kategorisi (School Category): Hepsi, Anaokulu, İlkokul, Ortaokul, Lise, Kolej
    if (filterSchoolCategory !== 'Hepsi') {
      if (filterSchoolCategory === 'Kolej') {
        const schoolNameLower = (school.name || '').toLowerCase();
        if (!schoolNameLower.includes('kolej')) return false;
      } else {
        if (school.type !== filterSchoolCategory) return false;
      }
    }

    // 6. Aylık Ortalama Fiyat: range bar from 0 to 20000
    if (school.monthlyPrice && school.monthlyPrice > filterMonthlyPrice) {
      return false;
    }

    // 7. Sınıf Mevcudu: Hepsi, 1-5 kişilik, 1-10 kişilik, 1-15 Kişilik, 1-20 Kişilik, +20 Kişilik
    if (filterClassSize !== 'Hepsi' && school.classSizeCategory !== filterClassSize) {
      return false;
    }

    // 8. Eğitim Sistemi (dropdown)
    if (filterEducationSystem !== 'Hepsi' && school.educationSystem !== filterEducationSystem) {
      return false;
    }

    // 9. Fiziksel İmkanlar (dropdown)
    if (filterPhysicalFacilities !== 'Hepsi' && (!school.physicalFacilities || !school.physicalFacilities.includes(filterPhysicalFacilities))) {
      return false;
    }

    // 10. Servisler (dropdown)
    if (filterServices !== 'Hepsi' && (!school.services || !school.services.includes(filterServices))) {
      return false;
    }

    // 11. Aktiviteler (dropdown)
    if (filterActivities !== 'Hepsi' && (!school.activities || !school.activities.includes(filterActivities))) {
      return false;
    }

    // 12. Yabancı Diller (dropdown)
    if (filterLanguages !== 'Hepsi' && (!school.languages || !school.languages.includes(filterLanguages))) {
      return false;
    }

    return true;
  });

  const handleClearFilters = () => {
    setSearchName('');
    setFilterLocation('Tümü');
    setFilterSector('Hepsi');
    setFilterSchoolCategory('Hepsi');
    setFilterMonthlyPrice(20000);
    setFilterClassSize('Hepsi');
    setFilterEducationSystem('Hepsi');
    setFilterPhysicalFacilities('Hepsi');
    setFilterServices('Hepsi');
    setFilterActivities('Hepsi');
    setFilterLanguages('Hepsi');
  };

  // Submit registration form
  const handleRegisterSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchool.name || !newSchool.location) return;

    const created: PrivateSchool = {
      id: `school-${Date.now()}`,
      name: newSchool.name,
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
      location: newSchool.location,
      capacity: Number(newSchool.capacity) || 200,
      teachersCount: Number(newSchool.teachersCount) || 15,
      type: newSchool.type,
      lessons: newSchool.lessons.split(',').map(l => l.trim()).filter(Boolean),
      lessonHours: newSchool.lessonHours || 'Haftalık 35 Ders Saati',
      schoolHours: newSchool.schoolHours || '08:30 - 16:00',
      parentReviewText: newSchool.parentReviewText || 'Eğitim kadrosu çok cana yakın.',
      reviewerName: newSchool.reviewerName || 'Misafir Veli',
      rating: 5.0,
      sector: newSchool.sector || 'Özel Okul',
      averageClassSize: Number(newSchool.averageClassSize) || 16,
      branchesCount: Number(newSchool.branchesCount) || 1,
      reviewsCount: 1,
      imagesCount: 4,
      deals: newSchool.deals ? newSchool.deals.split(',').map(d => d.trim()).filter(Boolean) : [],
      monthlyPrice: Number(newSchool.monthlyPrice) || 8000,
      classSizeCategory: '1-20 Kişilik',
      educationSystem: 'MEB Odaklı Eğitim',
      physicalFacilities: ['Yemekhane', 'Kapalı Spor Salonu'],
      services: ['Güvenlik', 'Rehberlik'],
      activities: ['Futbol', 'Voleybol'],
      languages: ['İngilizce']
    };

    setSchools([created, ...schools]);
    setSuccessMsg('🎉 Özel okul kaydı başarıyla pazaryerine eklendi! Bilgileri anında kontrol edebilirsiniz.');
    setTimeout(() => {
      setSuccessMsg('');
      setShowRegForm(false);
    }, 4000);

    // reset fields
    setNewSchool({
      name: '',
      location: '',
      capacity: '',
      teachersCount: '',
      type: 'Lise',
      lessons: '',
      lessonHours: '',
      schoolHours: '',
      parentReviewText: '',
      reviewerName: '',
      sector: 'Özel Okul',
      averageClassSize: '16',
      branchesCount: '1',
      monthlyPrice: '8000',
      deals: '%10 İndirim, Kampanya'
    });
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BANNER ROW */}
        <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
          <div>
            <span className="text-[10px] tracking-widest font-black text-[#FF6600] uppercase block">
              GÜVENİLİR RESMİ ÖZEL OKULLAR VE LİSELER
            </span>
            <h1 id="schools-catalog-title" className="text-2xl sm:text-3.5xl font-extrabold font-display text-zinc-950 mt-1 leading-tight">
              Özel Okul Ara
            </h1>
            <p className="text-xs text-zinc-550 mt-1 max-w-2xl">
              Özel kolejlerin, Anadolu liselerinin ve yabancı dilde eğitim veren prestijli okulların ders saatlerini, öğretmen sayılarını ve akredite veli yorumlarını inceleyip doğrudan irtibat kurun.
            </p>
          </div>

          <button 
            onClick={() => setShowRegForm(true)}
            className="w-full sm:w-auto bg-zinc-950 hover:bg-zinc-900 hover:scale-[1.02] active:scale-98 text-white text-xs font-black px-6 py-4 rounded-2xl transition shadow-md flex items-center justify-center gap-2 border border-zinc-850"
          >
            <Plus className="text-[#39FF14] w-4 h-4" />
            + Okulunu Pazaryerine Kaydet
          </button>
        </div>

        {/* DOUBLE COLUMN GRID */}
        {(() => {
          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT FILTERS */}
              {showFilters && (
                <div className="lg:col-span-3 bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-md space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                    <h3 className="text-sm font-black text-zinc-900 flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-[#FF6600]" /> Gelişmiş filtre sistemi
                    </h3>
                    <button 
                      onClick={handleClearFilters}
                      className="text-[10px] bg-zinc-100 hover:bg-zinc-200 text-zinc-650 font-extrabold px-2.5 py-1 rounded-md transition"
                    >
                      Filtreleri temizle
                    </button>
                  </div>

                {/* Keyword Search */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black tracking-wider text-zinc-400 block">Okul adı ile ara</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="Okul adı"
                      className="w-full bg-zinc-50 border border-zinc-250 rounded-xl pl-9 pr-3 py-3 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#FF6600] font-bold"
                    />
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                {/* Location Select with Groups */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black tracking-wider text-zinc-400 block font-sans">Konum seçiniz</label>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-250 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-700 focus:ring-1 focus:ring-[#FF6600]"
                  >
                    <option value="Tümü">📍 Tüm Konumlar</option>
                    <optgroup label="Büyük şehirler">
                      <option value="İstanbul Anadolu">📍 İstanbul Anadolu</option>
                      <option value="İstanbul Avrupa">📍 İstanbul Avrupa</option>
                      <option value="Ankara">📍 Ankara</option>
                      <option value="İzmir">📍 İzmir</option>
                      <option value="Antalya">📍 Antalya</option>
                      <option value="Bursa">📍 Bursa</option>
                      <option value="Adana">📍 Adana</option>
                    </optgroup>
                    <optgroup label="81 şehrin tamamı">
                      {['Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'].map((city, idx) => (
                        <option key={idx} value={city}>📍 {city}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Okul Sektörü */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black tracking-wider text-zinc-400 block">Okul sektörü</label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                    {[
                      { key: 'Hepsi', label: 'Hepsi' },
                      { key: 'Devlet Okulu', label: 'Devlet' },
                      { key: 'Özel Okul', label: 'Özel Okul' }
                    ].map((sec) => (
                      <button
                        key={sec.key}
                        type="button"
                        onClick={() => setFilterSector(sec.key)}
                        className={`py-2 px-1 text-center rounded-xl border transition ${
                          filterSector === sec.key 
                            ? 'border-[#FF6600] bg-orange-50 text-[#8C3F03]' 
                            : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50 text-zinc-650'
                        }`}
                      >
                        {sec.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Okul Kategorisi */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black tracking-wider text-zinc-400 block">Okul kategorisi</label>
                  <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                    {['Hepsi', 'Anaokulu', 'İlkokul', 'Ortaokul', 'Lise', 'Kolej'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFilterSchoolCategory(cat)}
                        className={`py-1.5 px-3 rounded-lg border transition ${
                          filterSchoolCategory === cat 
                            ? 'border-[#FF6600] bg-orange-50 text-[#8C3F03]' 
                            : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50 text-zinc-650'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

              {/* Aylık Ortalama Fiyat */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-black tracking-wider text-zinc-400">
                  <span>Aylık ortalama fiyat</span>
                  <span className="text-[#FF6600] font-mono">₺{filterMonthlyPrice}</span>
                </div>
                <input 
                  type="range"
                  min="400"
                  max="20000"
                  step="500"
                  value={filterMonthlyPrice}
                  onChange={(e) => setFilterMonthlyPrice(Number(e.target.value))}
                  className="w-full accent-red-650 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-zinc-400 font-bold font-mono">
                  <span>₺400</span>
                  <span>₺10.000</span>
                  <span>₺20.000</span>
                </div>
              </div>

              {/* Sınıf Mevcudu */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black tracking-wider text-zinc-400 block">Sınıf mevcudu</label>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                  {['Hepsi', '1-5 kişilik', '1-10 kişilik', '1-15 Kişilik', '1-20 Kişilik', '+20 Kişilik'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFilterClassSize(size)}
                      className={`py-2 px-2 text-left rounded-xl border transition flex items-center justify-between ${
                        filterClassSize === size 
                          ? 'border-[#FF6600] bg-orange-50 text-[#8C3F03]' 
                          : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50 text-zinc-650'
                      }`}
                    >
                      <span>{size}</span>
                      {filterClassSize === size && <span className="text-[9px] bg-amber-500 text-white px-1 rounded">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Okul İmkanları Accordion/Dropdown lists */}
              <div className="space-y-3.5">
                <span className="text-[11px] font-black tracking-wider text-zinc-400 block">Okul imkanları</span>
                
                {/* 1. Eğitim Sistemi (dropdown) */}
                <div className="border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50/50">
                  <button 
                    type="button"
                    onClick={() => setShowMoreEduc(!showMoreEduc)}
                    className="w-full flex items-center justify-between p-3 text-xs font-bold text-zinc-700 bg-zinc-50 hover:bg-zinc-100 transition"
                  >
                    <span>Eğitim Sistemi: <b className="text-orange-655">{filterEducationSystem}</b></span>
                    {showMoreEduc ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
                  </button>
                  {showMoreEduc && (
                    <div className="p-3 bg-white border-t border-zinc-150 space-y-1 text-[11px] font-semibold text-zinc-650">
                      {['Hepsi', 'MEB Odaklı Eğitim', 'Montessori Eğitimi', 'Klasik Sistem', 'Eklektik Yaklaşım', 'Çoklu Zeka Modeli'].map((system) => (
                        <button
                          key={system}
                          type="button"
                          onClick={() => setFilterEducationSystem(system)}
                          className={`w-full text-left px-2 py-1.5 rounded transition ${
                            filterEducationSystem === system ? 'bg-orange-50 text-[#8C3F03] font-bold' : 'hover:bg-zinc-50'
                          }`}
                        >
                          {system}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Fiziksel İmkanlar (dropdown) */}
                <div className="border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50/50">
                  <button 
                    type="button"
                    onClick={() => setShowMorePhys(!showMorePhys)}
                    className="w-full flex items-center justify-between p-3 text-xs font-bold text-zinc-700 bg-zinc-50 hover:bg-zinc-100 transition"
                  >
                    <span>Fiziksel İmkanlar: <b className="text-orange-655">{filterPhysicalFacilities}</b></span>
                    {showMorePhys ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
                  </button>
                  {showMorePhys && (
                    <div className="p-3 bg-white border-t border-zinc-150 space-y-1 text-[11px] font-semibold text-zinc-650">
                      {['Hepsi', 'Yemekhane', 'Havuz', 'Bilgisayar Laboratuvarı', 'Kapalı Spor Salonu', 'Futbol Sahası', 'Konferans Salonu'].map((fac) => (
                        <button
                          key={fac}
                          type="button"
                          onClick={() => setFilterPhysicalFacilities(fac)}
                          className={`w-full text-left px-2 py-1.5 rounded transition ${
                            filterPhysicalFacilities === fac ? 'bg-orange-50 text-[#8C3F03] font-bold' : 'hover:bg-zinc-50'
                          }`}
                        >
                          {fac}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Servisler (dropdown) */}
                <div className="border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50/50">
                  <button 
                    type="button"
                    onClick={() => setShowMoreServ(!showMoreServ)}
                    className="w-full flex items-center justify-between p-3 text-xs font-bold text-zinc-700 bg-zinc-50 hover:bg-zinc-100 transition"
                  >
                    <span>Servisler: <b className="text-orange-655">{filterServices}</b></span>
                    {showMoreServ ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
                  </button>
                  {showMoreServ && (
                    <div className="p-3 bg-white border-t border-zinc-150 space-y-1 text-[11px] font-semibold text-zinc-650">
                      {['Hepsi', 'Güvenlik', 'Rehberlik', 'Yaz Okulu', 'Servis', 'Hafta sonu Eğitim', 'Organik Beslenme'].map((ser) => (
                        <button
                          key={ser}
                          type="button"
                          onClick={() => setFilterServices(ser)}
                          className={`w-full text-left px-2 py-1.5 rounded transition ${
                            filterServices === ser ? 'bg-orange-50 text-[#8C3F03] font-bold' : 'hover:bg-zinc-50'
                          }`}
                        >
                          {ser}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Aktiviteler (dropdown) */}
                <div className="border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50/50">
                  <button 
                    type="button"
                    onClick={() => setShowMoreAct(!showMoreAct)}
                    className="w-full flex items-center justify-between p-3 text-xs font-bold text-zinc-700 bg-zinc-50 hover:bg-zinc-100 transition"
                  >
                    <span>Aktiviteler: <b className="text-orange-655">{filterActivities}</b></span>
                    {showMoreAct ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
                  </button>
                  {showMoreAct && (
                    <div className="p-3 bg-white border-t border-zinc-150 space-y-1 text-[11px] font-semibold text-zinc-650">
                      {['Hepsi', 'Futbol', 'Voleybol', 'Basketbol', 'Judo', 'Masa Tenisi', 'Su Topu'].map((act) => (
                        <button
                          key={act}
                          type="button"
                          onClick={() => setFilterActivities(act)}
                          className={`w-full text-left px-2 py-1.5 rounded transition ${
                            filterActivities === act ? 'bg-orange-50 text-[#8C3F03] font-bold' : 'hover:bg-zinc-50'
                          }`}
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. Yabancı Diller (dropdown) */}
                <div className="border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50/50">
                  <button 
                    type="button"
                    onClick={() => setShowMoreLang(!showMoreLang)}
                    className="w-full flex items-center justify-between p-3 text-xs font-bold text-zinc-700 bg-zinc-50 hover:bg-zinc-100 transition"
                  >
                    <span>Yabancı Diller: <b className="text-orange-655">{filterLanguages}</b></span>
                    {showMoreLang ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
                  </button>
                  {showMoreLang && (
                    <div className="p-3 bg-white border-t border-zinc-150 space-y-1 text-[11px] font-semibold text-zinc-650">
                      {['Hepsi', 'İngilizce', 'Arapça', 'İspanyolca', 'İtalyanca', 'Almanca', 'Fransızca', 'Çince', 'Japonca'].map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setFilterLanguages(lang)}
                          className={`w-full text-left px-2 py-1.5 rounded transition ${
                            filterLanguages === lang ? 'bg-orange-50 text-[#8C3F03] font-bold' : 'hover:bg-zinc-50'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* RIGHT COLUMN LISTING */}
          <div className={`${showFilters ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-6`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 border border-zinc-200/60 rounded-2xl gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100/80 hover:bg-zinc-200 hover:scale-[1.02] active:scale-98 text-zinc-950 text-xs font-extrabold rounded-xl transition duration-150 border border-zinc-200 cursor-pointer"
                  title={showFilters ? "Filtreleri Gizle" : "Filtreleri Göster"}
                >
                  {showFilters ? <EyeOff className="w-3.5 h-3.5 text-zinc-650" /> : <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6600]" />}
                  <span>{showFilters ? "Filtreleri Gizle" : "Filtreleri Göster"}</span>
                </button>
                <span className="text-xs font-extrabold text-zinc-500">
                  🔍 Toplam <b className="text-zinc-950 font-black">{filteredSchools.length}</b> uyumlu okul listeleniyor
                </span>
              </div>
              <span className="text-[10px] bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg font-black uppercase tracking-wider self-stretch sm:self-auto text-center">
                GÜNCEL FİYAT GARANTİSİ
              </span>
            </div>

            {filteredSchools.length > 0 ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${showFilters ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
                {filteredSchools.map((school) => (
                  <div 
                    key={school.id}
                    className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg hover:border-[#FF6600] transition duration-300 flex flex-col justify-between group"
                  >
                    
                    {/* Cover Image */}
                    <div className="relative aspect-video">
                      <img 
                        src={school.image} 
                        alt={school.name} 
                        className="object-cover w-full h-full group-hover:scale-[1.03] transition duration-500" 
                      />
                      <span className="absolute top-3 left-3 bg-[#E11A4F] text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider shadow">
                        {formatSchoolType(school.type)}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-zinc-950/90 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                        ⭐ {school.rating.toFixed(1)} / 5.0
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      
                      <div>
                        {/* Title & Branch Row alongside review counters without static word labels */}
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-1">
                          <h3 className="text-base font-extrabold text-zinc-950 group-hover:text-[#FF6600] transition leading-snug line-clamp-2">
                            {school.name}
                          </h3>
                          <span className="text-xs font-semibold text-zinc-500 whitespace-nowrap">
                            💬 {school.reviewsCount || 44} | 🖼️ {school.imagesCount || 12}
                          </span>
                        </div>

                        {/* Location written directly: "İstanbul / Üsküdar / Kısıklı" format */}
                        <p className="text-[12px] font-bold text-zinc-600 mb-2 flex items-center gap-1">
                          📍 {school.location}
                        </p>

                        {/* Metadata Count Tray with Aligned Values */}
                        <div className="flex flex-col gap-1.5 text-xs text-zinc-650 border-t border-b border-zinc-100 py-3 mb-3">
                          {school.branchesCount && (
                            <div className="grid grid-cols-[20px_130px_8px_1fr] items-center gap-x-1 font-bold">
                              <span>🏢</span>
                              <span className="text-zinc-500 font-semibold">Şube Sayısı</span>
                              <span className="text-zinc-400 font-normal">:</span>
                              <span className="text-zinc-950 font-black">{school.branchesCount}</span>
                            </div>
                          )}
                          <div className="grid grid-cols-[20px_130px_8px_1fr] items-center gap-x-1 font-bold">
                            <span>👥</span>
                            <span className="text-zinc-550 font-semibold">Ort. Sınıf Mevcudu</span>
                            <span className="text-zinc-400 font-normal">:</span>
                            <span className="text-zinc-950 font-black">{school.averageClassSize || 16} Kişilik</span>
                          </div>
                          <div className="grid grid-cols-[20px_130px_8px_1fr] items-center gap-x-1 font-bold">
                            <span>💰</span>
                            <span className="text-zinc-550 font-semibold">Aylık Ort. Ücret</span>
                            <span className="text-zinc-400 font-normal">:</span>
                            <span className="text-[#FF6600] font-black">₺{school.monthlyPrice || 8000}</span>
                          </div>
                        </div>

                        {/* Fırsatlar yan yana yaz (buton gibi) */}
                        {school.deals && school.deals.length > 0 && (
                           <div className="space-y-1 mt-2.5 mb-2">
                             <span className="text-[9px] font-black uppercase text-[#FF6600] tracking-wider block">🎁 Güncel Fırsatlar &amp; Kampanyalar:</span>
                             <div className="flex flex-wrap gap-1">
                               {school.deals.map((deal, idx) => (
                                 <span 
                                   key={idx} 
                                   className="bg-red-50 text-red-650 border border-red-100 text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-lg"
                                 >
                                   {deal}
                                 </span>
                               ))}
                             </div>
                           </div>
                        )}

                        {/* Lessons / Programs */}
                        <div className="space-y-1 mt-3">
                          <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">🔬 Öne Çıkan Atölye Programları:</span>
                          <div className="flex flex-wrap gap-1">
                            {school.lessons.map((les, index) => (
                              <span key={index} className="bg-zinc-100 font-bold text-zinc-700 px-2 py-0.5 text-[10px] rounded">
                                ✓ {les}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* CTA Buttons */}
                      <div className="pt-2 flex flex-col gap-2">
                        <button 
                          onClick={() => {
                            alert(`"${school.name}" için randevu talebiniz İstanbul Eğitim Pazaryeri güvencesiyle sıraya alındı! Okul temsilcisi sizinle en kısa sürede iletişime geçecektir.`);
                          }}
                          className="w-full bg-red-600 hover:bg-zinc-950 text-white text-xs font-black py-3 px-4 rounded-xl transition duration-200 text-center cursor-pointer shadow-md"
                        >
                          Randevu Al
                        </button>
                        <button
                          onClick={() => setSelectedSchool(school)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>İncele (Profil Sayfası)</span>
                        </button>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-zinc-200/60 rounded-3xl p-12 text-center">
                <span className="text-4xl">🏢</span>
                <h4 className="text-sm font-bold text-zinc-900 mt-4">Kriterlere Uygun Özel Okul Bulunamadı</h4>
                <p className="text-xs text-zinc-500 mt-1">Lütfen filtre aramalarını genişletmeyi veya temizlemeyi deneyin.</p>
              </div>
            )}
          </div>

        </div>
          );
        })()}

      </div>

      {/* --- REGESTRATION REGISTRATION OKUL KAYDET FORM MODAL --- */}
      {showRegForm && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-zinc-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative border border-zinc-200 shadow-2xl">
            
            <button 
              onClick={() => setShowRegForm(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-900 transition p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-extrabold uppercase tracking-widest block w-fit mb-1">
                Kolej / Okul Başvuru Paneli
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display text-zinc-950">
                Özel Okulunuzu Sisteme Ekleyin
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Kurumunuzu binlerce arayan veli ve öğrencimize en şeffaf verilerle sergileyin.
              </p>
            </div>

            {successMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-emerald-800 text-center font-bold">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleRegisterSchool} className="space-y-4 text-xs font-semibold">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-500 block mb-1">Kurum/Okul Resmi Adı *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Örn: Kuzey Bahçeşehir Koleji ve Fen Lisesi"
                      value={newSchool.name}
                      onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#FF6600]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">İlçe / Lokasyon *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Örn: Sarıyer, İstanbul"
                      value={newSchool.location}
                      onChange={(e) => setNewSchool({...newSchool, location: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#FF6600]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-zinc-500 block mb-1">Kapasite Sayısı</label>
                    <input 
                      type="number" 
                      placeholder="Örn: 200"
                      value={newSchool.capacity}
                      onChange={(e) => setNewSchool({...newSchool, capacity: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Öğretmen Sayısı</label>
                    <input 
                      type="number" 
                      placeholder="Örn: 24"
                      value={newSchool.teachersCount}
                      onChange={(e) => setNewSchool({...newSchool, teachersCount: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1 font-bold">Şube Sayısı *</label>
                    <input 
                      type="number" 
                      required
                      placeholder="Örn: 3"
                      value={newSchool.branchesCount}
                      onChange={(e) => setNewSchool({...newSchool, branchesCount: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#FF6600]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Eğitim Kademesi</label>
                    <select
                      value={newSchool.type}
                      onChange={(e) => setNewSchool({...newSchool, type: e.target.value as any})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#FF6600] text-zinc-700 font-bold"
                    >
                      <option value="Anaokulu">Anaokulu</option>
                      <option value="İlkokul">İlkokul</option>
                      <option value="Ortaokul">Ortaokul</option>
                      <option value="Lise">Lise</option>
                      <option value="Kolej">Kolej</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-zinc-500 block mb-1">Fark Yaratan Atölyeler (Virgülle Ayırın)</label>
                    <input 
                      type="text" 
                      placeholder="Drama, Kodlama, Ekoloji, Piyano"
                      value={newSchool.lessons}
                      onChange={(e) => setNewSchool({...newSchool, lessons: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Haftalık Ders Yoğunluğu</label>
                    <input 
                      type="text" 
                      placeholder="Örn: Haftalık 42 Ders Saati"
                      value={newSchool.lessonHours}
                      onChange={(e) => setNewSchool({...newSchool, lessonHours: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Okul Giriş-Çıkış Saatleri</label>
                    <input 
                      type="text" 
                      placeholder="Örn: 08:30 - 16:30"
                      value={newSchool.schoolHours}
                      onChange={(e) => setNewSchool({...newSchool, schoolHours: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-zinc-950 hover:bg-zinc-900 text-[#39FF14] font-black py-3.5 rounded-xl transition text-center shadow-lg cursor-pointer"
                  >
                    Kaydet &amp; Yayınla
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
       )}

      {/* DETAYLI ÖZEL OKUL PROFİL MODAL (PROFIL SAYFASI ALTYAPISI) */}
      {selectedSchool && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs select-none">
          <div className="bg-[#FAF9F5] border border-zinc-200 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] animate-fade-in animate-duration-200">
            
            {/* Header / Cover */}
            <div className="relative aspect-video w-full h-48 sm:h-60 shrink-0 select-none">
              <img src={selectedSchool.image} alt={selectedSchool.name} className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
              <button 
                onClick={() => setSelectedSchool(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">
                  {selectedSchool.type} Okul Profili
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-display leading-tight">{selectedSchool.name}</h2>
                <p className="text-xs text-zinc-300 font-semibold mt-1 flex items-center gap-1">
                  📍 {selectedSchool.location}
                </p>
              </div>
            </div>

            {/* Content Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 select-none">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-zinc-200 p-3 rounded-2xl text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase font-mono">Şubeler</span>
                  <span className="text-sm font-black text-zinc-900 mt-1 block">{selectedSchool.branchesCount || 1} Şube</span>
                </div>
                <div className="bg-white border border-zinc-200 p-3 rounded-2xl text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase font-mono">Sınıf Mevcudu</span>
                  <span className="text-sm font-black text-zinc-900 mt-1 block">~{selectedSchool.averageClassSize || 16} Kişi</span>
                </div>
                <div className="bg-white border border-zinc-200 p-3 rounded-2xl text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase font-mono">Aylık Ücret</span>
                  <span className="text-sm font-black text-[#FF6600] mt-1 block font-mono">₺{selectedSchool.monthlyPrice || 8000}</span>
                </div>
                <div className="bg-white border border-zinc-200 p-3 rounded-2xl text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase font-mono">Eğitim Sistemi</span>
                  <span className="text-[11px] font-bold text-zinc-800 mt-1 block leading-tight">{selectedSchool.educationSystem}</span>
                </div>
              </div>

              {/* Atölyeler / Programlar */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#FF6600]">🔬 Öne Çıkan Atölye Programları</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedSchool.lessons.map((les, index) => (
                    <span key={index} className="bg-zinc-100/90 border border-zinc-200 text-zinc-850 px-2.5 py-1 text-xs rounded-xl font-bold">
                      ✓ {les}
                    </span>
                  ))}
                </div>
              </div>

              {/* Veli Yorumu */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#8C3F03] block">🏆 Akredite Öğrenci/Veli Görüşü:</span>
                <p className="text-xs text-zinc-700 italic font-semibold">
                  "{selectedSchool.parentReviewText || 'Eğitim kadrosu çok ilgili ve cana yakın.'}"
                </p>
                <span className="text-[10px] text-zinc-400 font-bold block text-right">— Veli {selectedSchool.reviewerName || 'Misafir Veli'}</span>
              </div>

              {/* SOCIAL MEDIA SHARE COMPONENT IN THE PROFILE MODAL */}
              <div className="pt-2 border-t border-zinc-200">
                <ShareButtons title={selectedSchool.name} type="özel okul" />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="bg-zinc-50 border-t border-zinc-200 px-6 py-4 flex items-center justify-between shrink-0">
              <button 
                onClick={() => setSelectedSchool(null)}
                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-xs font-black px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                Kapat
              </button>
              <button 
                onClick={() => {
                  alert(`"${selectedSchool.name}" için randevu talebiniz İstanbul Eğitim Pazaryeri güvencesiyle sıraya alındı! Okul temsilcisi sizinle en kısa sürede iletişime geçecektir.`);
                }}
                className="bg-red-600 hover:bg-zinc-950 text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow-md cursor-pointer"
              >
                Randevu Al
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

