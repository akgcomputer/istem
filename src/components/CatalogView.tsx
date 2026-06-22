import { useState, FormEvent, useEffect } from 'react';
import { 
  SlidersHorizontal, ChevronDown, Award, Target, Sparkles, Code2, 
  Search, BookOpen, Star, Clock, Laptop, Play, Plus, X, ShieldCheck,
  MapPin, DollarSign, Briefcase, GraduationCap, ArrowLeft, Building2, AppWindow,
  MessageCircle, Phone
} from 'lucide-react';
import { Course } from '../types';
import { MOCK_TEACHERS, Teacher } from '../data/catalogData';

interface CatalogViewProps {
  courses: Course[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectCourse: (course: Course) => void;
  isLoggedIn: boolean;
  onViewProfile?: (teacher: any) => void;
}

interface Subject {
  name: string;
  category: string;
  description: string;
  image: string;
  minPrice: number;
  maxPrice: number;
  teachersCount: number;
  teachersList: Teacher[];
}

const SUBJECTS_METADATA: { [key: string]: { description: string; image: string; category: string } } = {
  'Python ile Sıfırdan İleri Seviye': {
    description: 'Sıfırdan başlayarak veri analizi, web geliştirme ve yapay zeka temellerini Python ile uygulamalı öğrenin.',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80',
    category: 'Bilişim'
  },
  'Yapay Zeka Destekli Mobil Uygulamaları': {
    description: 'Yapay zeka API\'lerini mobil projelere entegre ederek akıllı çözümler geliştirmeyi öğrenin.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    category: 'Bilişim'
  },
  'Konuşma Odaklı Mesleki İngilizce': {
    description: 'İş dünyasında ve mülakatlarda akıcı, profesyonel İngilizce konuşarak kariyerinizi zirveye taşıyın.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    category: 'Dil'
  },
  'IELTS / TOEFL Nokta Atışı Hazırlık': {
    description: 'Sınav formatına sıfırdan uyum sağlayın ve hedef skorunuza ulaştıracak pratik teknikleri kapın.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    category: 'Dil'
  },
  'Lise İleri Matematik ve Geometri': {
    description: 'Türev, integral ve analitik geometri konularını mantığıyla kavrayıp sınavlara eksiksiz hazırlanın.',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    category: 'Lise/Sınav'
  },
  'LGS Derece Garantili Matematik Kampı': {
    description: 'Yeni nesil LGS matematik sorularını pratik akıl yürütme teknikleriyle saniyeler içinde çözün.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
    category: 'Lise/Sınav'
  },
  'Figma ile Dijital Karakter Çizimi': {
    description: 'Yaratıcı karakter çizimlerini ve UI/UX tasarım temellerini Figma kullanarak profesyonelce öğrenin.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    category: 'Sanat'
  },
  'Temel Yağlı Boya Teknikleri Atölyesi': {
    description: 'Renk teorisinden başlayarak hayalinizdeki manzarayı tuvale aktaracak teknikleri keşfedin.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    category: 'Sanat'
  },
  'Kardiyo ve Duruş Bozukluğu Terapisi': {
    description: 'Duruş bozukluklarını düzeltici fizyoterapi hareketleriyle daha zinde ve dik bir postüre kavuşun.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    category: 'Spor'
  },
  'Masa Başı Çalışanlar İçin Postür Atölyesi': {
    description: 'Ekran karşısında geçen saatler sebebiyle oluşan sırt, boyun ve omuz ağrılarını egzersizlerle aşın.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    category: 'Spor'
  },
  'İlköğretim Hızlı Okuma Eğitimi': {
    description: 'Çocukların okuma hızını, odaklanma süresini ve sınavlardaki anlama yüzdesini ikiye katlayın.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    category: 'İlköğretim'
  },
  'Çocuklar İçin Yaratıcı Drama': {
    description: 'Çocukların kendilerini özgürce ifade etmelerini, empati kurmalarını ve hayal güçlerini drama ile canlandırın.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    category: 'İlköğretim'
  },
  'Zaman Yönetimi Metotları': {
    description: 'Pomodoro ve eisenhower matrisi gibi zaman yönetimi araçlarıyla çalışma veriminizi zirveye ulaştırın.',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
    category: 'Kişisel'
  },
  'Finansal Okuryazarlık ve Yatırım': {
    description: 'Temel finans kavramlarını, tasarruf yapmayı ve akıllı yatırım yöntemlerinin temellerini kavrayın.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    category: 'Kişisel'
  }
};

const LESSON_OPTIONS_MAP: { [key: string]: string[] } = {
  'Bilişim': ['Python ile Sıfırdan İleri Seviye', 'Yapay Zeka Destekli Mobil Uygulamaları', 'C#', 'Java'],
  'Dil': ['Konuşma Odaklı Mesleki İngilizce', 'IELTS / TOEFL Nokta Atışı Hazırlık'],
  'İlköğretim': ['İlköğretim Hızlı Okuma Eğitimi', 'Çocuklar İçin Yaratıcı Drama'],
  'Lise/Sınav': ['Lise İleri Matematik ve Geometri', 'LGS Derece Garantili Matematik Kampı'],
  'Spor': ['Kardiyo ve Duruş Bozukluğu Terapisi', 'Masa Başı Çalışanlar İçin Postür Atölyesi'],
  'Sanat': ['Figma ile Dijital Karakter Çizimi', 'Temel Yağlı Boya Teknikleri Atölyesi'],
  'Kişisel': ['Zaman Yönetimi Metotları', 'Finansal Okuryazarlık ve Yatırım']
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

export default function CatalogView({ 
  selectedCategory, 
  onSelectCategory, 
  isLoggedIn,
  onViewProfile 
}: CatalogViewProps) {
  
  // Teachers state initialized with MOCK_TEACHERS so registered mentors accumulate here
  const [teachersList, setTeachersList] = useState<Teacher[]>(MOCK_TEACHERS);

  // Form simulation state for registration (Siz de Katılın Portal)
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    bio: '',
    preferredLocation: '',
    tags: '',
    category: 'Bilişim' as any,
    canOnline: true,
    canCorporate: true,
    canFaceToFace: true
  });

  const [registeredSessions, setRegisteredSessions] = useState<{ category: string; name: string; price: string }[]>([
    { category: 'Bilişim', name: 'Python ile Sıfırdan İleri Seviye', price: '' }
  ]);

  const handleRegisterTeacherSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name) return;

    // Filter valid registered sessions
    const sessionList = registeredSessions
      .filter(s => s.name && s.price)
      .map(s => ({
        name: s.name,
        price: Number(s.price) || 500,
        category: s.category
      }));

    if (sessionList.length === 0) {
      sessionList.push({ name: 'Genel Mentörlük Seansı', price: 600, category: 'Bilişim' });
    }

    const newRegisteredTeacher: Teacher = {
      id: `dynamic-teacher-${Date.now()}`,
      name: newTeacher.name,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      rating: 5.0,
      commentsCount: 1,
      experienceYears: 4,
      experienceLabel: '1-5 Yıl',
      bio: newTeacher.bio || 'Onaylı eğitmenimiz.',
      preferredLocation: newTeacher.preferredLocation || 'İstanbul',
      canOnline: newTeacher.canOnline,
      canFaceToFace: newTeacher.canFaceToFace,
      canCorporate: newTeacher.canCorporate,
      tags: newTeacher.tags.split(',').map(t => t.trim()),
      category: newTeacher.category,
      sessions: sessionList.map(s => ({
        name: s.name,
        price: Number(s.price),
      }))
    };

    // Register into the courses local list
    setTeachersList([newRegisteredTeacher, ...teachersList]);

    setSuccessMessage('🎉 Başvurunuz başarıyla site yönetimine (admin paneli) iletildi! Başvurunuz onaylandığında yayına alınacaktır.');
    setTimeout(() => {
      setSuccessMessage('');
      setShowRegisterForm(false);
      // Reset form fields
      setNewTeacher({
        name: '',
        bio: '',
        preferredLocation: '',
        tags: '',
        category: 'Bilişim',
        canOnline: true,
        canCorporate: true,
        canFaceToFace: true
      });
      setRegisteredSessions([{ category: 'Bilişim', name: 'Python ile Sıfırdan İleri Seviye', price: '' }]);
    }, 3000);
  };

  // Compile list of unique lesson/subject names
  const allUniqueLessonNames = Array.from(new Set([
    ...Object.keys(SUBJECTS_METADATA),
    ...teachersList.flatMap(t => t.sessions.map(s => s.name))
  ]));

  // Build the unified Subject dataset by matching/synthesizing educators
  const subjects: Subject[] = allUniqueLessonNames.map(lessonName => {
    const directTeachers = teachersList.filter(t => t.sessions.some(s => s.name === lessonName));
    
    const meta = SUBJECTS_METADATA[lessonName] || {
      description: 'Uzman eğitmen eşliğinde birebir gelişim, pratik ödevler ve canlı mentörlük seansları.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      category: 'Bilişim'
    };

    // Fill up to 4 educators to simulate a vibrant, rich catalog
    let teachersWhoTeach = [...directTeachers];
    if (teachersWhoTeach.length < 4) {
      const otherSameCategoryTeachers = teachersList.filter(
        t => t.category === meta.category && !teachersWhoTeach.some(ex => ex.id === t.id)
      );
      
      for (const t of otherSameCategoryTeachers) {
        if (teachersWhoTeach.length >= 4) break;
        const baseMin = lessonName.includes('Python') ? 825 : (meta.category === 'Spor' ? 1000 : 650);
        const experienceMultiplier = t.experienceLabel === '+10 Yıldan Fazla' ? 1.4 : (t.experienceLabel === '+5 Yıldan Fazla' ? 1.25 : 1.0);
        const synthPrice = Math.round((baseMin * experienceMultiplier) / 25) * 25;
        
        teachersWhoTeach.push({
          ...t,
          sessions: [
            ...t.sessions,
            { name: lessonName, price: synthPrice }
          ]
        });
      }
    }

    const prices = teachersWhoTeach.map(t => {
      const match = t.sessions.find(s => s.name === lessonName);
      return match ? match.price : 825;
    });

    const minPrice = prices.length > 0 ? Math.min(...prices) : 825;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 2250;

    return {
      name: lessonName,
      category: meta.category,
      description: meta.description,
      image: meta.image,
      minPrice,
      maxPrice,
      teachersCount: teachersWhoTeach.length,
      teachersList: teachersWhoTeach
    };
  });

  // Layout and Detail view states
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Filters State
  const [searchName, setSearchName] = useState('');
  const [filterLocation, setFilterLocation] = useState('Tümü');
  const [filterCategory, setFilterCategory] = useState(selectedCategory || 'Tümü');
  const [filterSpecificLesson, setFilterSpecificLesson] = useState('Tümü');
  const [filterExperience, setFilterExperience] = useState('Tümü');
  const [filterMaxPrice, setFilterMaxPrice] = useState<string>(''); // empty = no limit
  const [filterModel, setFilterModel] = useState('Tümü'); // Tümü, Online, Yüz Yüze, Kurumsal

  // Clear filters helper
  const handleClearFilters = () => {
    setSearchName('');
    setFilterLocation('Tümü');
    setFilterCategory('Tümü');
    setFilterSpecificLesson('Tümü');
    setFilterExperience('Tümü');
    setFilterMaxPrice('');
    setFilterModel('Tümü');
    onSelectCategory('Tümü'); // Reset category switcher prop
  };

  // Keep filterCategory in sync if parent prop changes
  if (selectedCategory && selectedCategory !== 'Tümü' && filterCategory !== selectedCategory) {
    setFilterCategory(selectedCategory);
  }

  // Filter application logic
  const filteredSubjects = subjects.filter(sub => {
    // 1. Search by Lesson Name
    if (searchName && !sub.name.toLowerCase().includes(searchName.toLowerCase())) return false;

    // 2. Filter by Category
    if (filterCategory !== 'Tümü' && sub.category !== filterCategory) return false;

    // 3. Filter by Specific Lesson
    if (filterSpecificLesson !== 'Tümü' && sub.name !== filterSpecificLesson) return false;

    // 4. Max Price check
    if (filterMaxPrice) {
      const maxLimit = Number(filterMaxPrice);
      if (maxLimit > 0 && sub.minPrice > maxLimit) return false;
    }

    // Filter educators sublists inside matches
    let matchingTeachers = sub.teachersList;

    // Filter by location
    if (filterLocation !== 'Tümü') {
      matchingTeachers = matchingTeachers.filter(t => 
        t.preferredLocation.toLowerCase().includes(filterLocation.toLowerCase()) ||
        filterLocation.toLowerCase().includes(t.preferredLocation.toLowerCase())
      );
    }

    // Filter by Experience
    if (filterExperience !== 'Tümü') {
      matchingTeachers = matchingTeachers.filter(t => {
        if (filterExperience === 'Yeni') return t.experienceLabel === 'Yeni';
        if (filterExperience === '1-5 Yıl') return t.experienceLabel === '1-5 Yıl';
        if (filterExperience === '5+ Yıl') return t.experienceLabel === '+5 Yıldan Fazla' || t.experienceLabel === '+10 Yıldan Fazla';
        if (filterExperience === '10+ Yıl') return t.experienceLabel === '+10 Yıldan Fazla';
        return true;
      });
    }

    // Filter by delivery model
    if (filterModel !== 'Tümü') {
      if (filterModel === 'Online') matchingTeachers = matchingTeachers.filter(t => t.canOnline);
      if (filterModel === 'Yüz Yüze') matchingTeachers = matchingTeachers.filter(t => t.canFaceToFace);
      if (filterModel === 'Kurumsal') matchingTeachers = matchingTeachers.filter(t => t.canCorporate);
    }

    // If no matching teachers are left, exclude subject
    if (matchingTeachers.length === 0) return false;

    return true;
  });

  // Infinite scroll states
  const [visibleCount, setVisibleCount] = useState(6);

  // Reset pagination when any filter changes
  useEffect(() => {
    setVisibleCount(6);
  }, [searchName, filterLocation, filterCategory, filterSpecificLesson, filterExperience, filterMaxPrice, filterModel]);

  // Scroll handler for infinite load
  useEffect(() => {
    const handleScroll = () => {
      if (visibleCount >= filteredSubjects.length) return;

      const scrollThreshold = 250; // pixels from the bottom
      const currentScroll = window.innerHeight + window.scrollY;
      const totalHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

      if (totalHeight - currentScroll <= scrollThreshold) {
        setVisibleCount(prev => Math.min(prev + 6, filteredSubjects.length));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, filteredSubjects.length]);

  const displayedSubjects = filteredSubjects.slice(0, visibleCount);

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner with "+ Eğitmen Olarak Katılın" and header */}
        {!selectedSubject && (
          <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E11A4F]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="max-w-xl">
              <span className="text-[10px] tracking-widest font-black text-[#E58F49] uppercase block leading-tight">KOMİSYONSUZ PAZARYERİ KATALOĞU</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-zinc-950 mt-1">Eğitim Kataloğu</h1>
              <p className="text-xs text-zinc-550 mt-1.5 leading-relaxed">Eğitmenlerden kesintisiz, komisyonsuz doğrudan seanslarla yayında olan güncel özel dersler ve eğitim alanları.</p>
            </div>

            <div className="shrink-0">
              <button 
                onClick={() => setShowRegisterForm(true)}
                className="w-full sm:w-auto shrink-0 bg-zinc-950 hover:bg-zinc-900 text-[#39FF14] hover:scale-[1.02] active:scale-98 text-xs font-black px-6 py-4 rounded-2xl transition shadow-md flex items-center justify-center gap-2 border border-zinc-850 cursor-pointer text-center"
              >
                <Plus className="w-4 h-4 text-[#39FF14]" />
                + Eğitmen Olarak Katılın!
              </button>
            </div>
          </div>
        )}

        {/* PAGE BODY VIEW ROUTER: DETAYLAR SAYFASI VS KATALOG */}
        {selectedSubject ? (
          /* --- DERS DETAYLARI SAYFASI --- */
          <div className="space-y-8 animate-fade-in">
            {/* Header / Back Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button 
                onClick={() => setSelectedSubject(null)}
                className="flex items-center gap-2 hover:text-[#E58F49] text-zinc-700 text-xs font-bold transition cursor-pointer w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                Ders Kataloğuna Geri Dön
              </button>
              
              <span className="text-xs text-zinc-500 font-extrabold bg-zinc-100 px-3.5 py-1.5 rounded-full w-fit flex items-center gap-1">
                <span>Bilişim Eğitimi</span>
                <span className="text-zinc-400 font-normal">&gt;</span>
                <span className="text-[#E58F49] uppercase tracking-wide">{selectedSubject.category === 'Bilişim' ? 'Yazılım' : selectedSubject.category}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT CARD: SUBJECT PHOTO & DETAILS */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white border border-zinc-200/60 rounded-3xl overflow-hidden shadow-sm">
                  <div className="aspect-video w-full relative">
                    <img src={selectedSubject.image} alt={selectedSubject.name} className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <h2 className="text-xl font-extrabold text-zinc-900 leading-snug">
                      {selectedSubject.name}
                    </h2>
                    
                    <p className="text-xs text-zinc-550 leading-relaxed">
                      {selectedSubject.description}
                    </p>

                    <div className="bg-zinc-50 border border-zinc-200/50 rounded-2xl p-4 space-y-3">
                      <span className="text-[10px] text-zinc-400 font-extrabold tracking-wider uppercase block">DERS DETAYLARI</span>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-medium">Birebir Eğitmen Sayısı:</span>
                        <span className="text-zinc-900 font-bold">{selectedSubject.teachersCount} Öğretmen</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-medium">Fiyat Aralığı:</span>
                        <span className="text-[#E58F49] font-black font-mono">₺{selectedSubject.minPrice} - ₺{selectedSubject.maxPrice}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-medium">Seans Tipi:</span>
                        <span className="text-zinc-900 font-bold">Canlı &amp; Özel Birebir</span>
                      </div>
                    </div>

                    <div className="pt-2 text-center text-[10px] text-zinc-400 font-mono leading-relaxed">
                      Sözleşme yok, komisyon yok. Doğrudan dilediğiniz öğretmene ulaşarak hemen başlayabilirsiniz.
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT CARD: LIST OF PLENTIFUL TEACHERS OFFERING THIS LESSON */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  
                  <div className="flex items-center gap-2 border-b border-zinc-150 pb-4">
                    <span className="text-xl">⭐</span>
                    <h3 className="text-lg font-black text-zinc-950">Eğitmenler ve Ücretler</h3>
                  </div>

                  <div className="space-y-4">
                    {selectedSubject.teachersList.map((teacher, idx) => {
                      const educatorSession = teacher.sessions.find(s => s.name === selectedSubject.name);
                      const displayPrice = educatorSession ? educatorSession.price : selectedSubject.minPrice;

                      return (
                        <div 
                          key={teacher.id || idx}
                          className="bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-200/60 p-5 rounded-2xl transition duration-150 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                        >
                          <div className="flex items-start gap-4">
                            <img 
                              src={teacher.avatar} 
                              alt={teacher.name} 
                              className="w-14 h-14 rounded-full object-cover border border-zinc-250 cursor-pointer hover:opacity-90 shrink-0"
                              onClick={() => { if (onViewProfile) onViewProfile(teacher); }}
                            />
                            
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  onClick={() => { if (onViewProfile) onViewProfile(teacher); }}
                                  className="text-sm font-extrabold text-zinc-950 hover:text-[#E58F49] text-left transition"
                                >
                                  {teacher.name}
                                </button>
                                <span className="bg-zinc-200/70 text-zinc-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  {teacher.experienceLabel}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
                                <span className="text-zinc-800 font-bold">{teacher.rating.toFixed(1)}</span>
                                <span className="text-zinc-400">({teacher.commentsCount} Yorum)</span>
                                <span className="text-zinc-300">|</span>
                                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                <span className="line-clamp-1">{teacher.preferredLocation}</span>
                              </div>

                              <p className="text-[11px] text-zinc-550 leading-relaxed max-w-lg line-clamp-2 font-medium">
                                {teacher.bio}
                              </p>

                              {/* Delivery badges */}
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {teacher.canOnline && (
                                  <span className="text-[9px] bg-blue-50 border border-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">Online</span>
                                )}
                                {teacher.canFaceToFace && (
                                  <span className="text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">Yüz Yüze</span>
                                )}
                                {teacher.canCorporate && (
                                  <span className="text-[9px] bg-purple-50 border border-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">Kurumsal</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex md:flex-col items-end justify-between md:justify-center w-full md:w-auto p-3 md:p-0 bg-white md:bg-transparent rounded-xl border md:border-0 border-zinc-200 leading-none shrink-0 gap-2">
                            <div className="mb-1 md:mb-0">
                              <span className="text-[9px] text-zinc-400 font-bold block text-left md:text-right uppercase">SEANS ÜCRETİ</span>
                              <span className="text-lg font-black text-[#E58F49] font-mono whitespace-nowrap block mt-1">₺{displayPrice} <strong className="text-[10px] text-zinc-400 font-medium font-sans">/ Seans</strong></span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => { if (onViewProfile) onViewProfile(teacher); }}
                                className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                              >
                                Profili İncele
                              </button>
                              
                              <button 
                                onClick={() => { 
                                  alert(`🎉 ${teacher.name} eşliğinde "${selectedSubject.name}" eğitim seansına kaydoluyorsunuz! Tebrikler!`);
                                }}
                                className="bg-[#E58F49] hover:bg-[#D4803A] text-white text-[11px] font-black px-3 py-2 rounded-xl transition cursor-pointer shadow-sm hover:scale-102 active:scale-98"
                              >
                                Eğitim Al
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                  {/* WhatsApp'tan Bilgi Al & Bizi Arayın Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-zinc-150">
                    <a
                      href={`https://wa.me/${(localStorage.getItem('whatsapp_number') || '905551234567').replace(/\s+/g, '')}?text=${encodeURIComponent(`Merhaba, ${selectedSubject.name} hakkında bilgi almak istiyorum.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 font-extrabold text-xs py-3 px-4 rounded-xl border border-emerald-200/50 transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      WhatsApp'tan Bilgi Al
                    </a>
                    
                    <a
                      href={`tel:${(localStorage.getItem('hotline_number') || '902129999999').replace(/\s+/g, '')}`}
                      className="bg-zinc-50 hover:bg-zinc-100 text-zinc-800 font-extrabold text-xs py-3 px-4 rounded-xl border border-zinc-200 transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                    >
                      <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                      Bizi Arayın
                    </a>
                  </div>

                </div>

                {/* DETAYLAR GRUBU */}
                <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
                  <h3 className="text-base font-extrabold text-zinc-950 pb-2 border-b border-zinc-150">Detaylar</h3>

                  <div className="space-y-4 text-xs">
                    
                    {/* 1. Eğitim Hakkında */}
                    <div className="border border-zinc-150 rounded-2xl p-4 space-y-2">
                      <h4 className="font-extrabold text-zinc-900 text-sm">📖 Eğitim Hakkında</h4>
                      <p className="text-zinc-600 leading-relaxed font-semibold">
                        {selectedSubject.name.toLowerCase().includes('python') || selectedSubject.category === 'Bilişim' ? (
                          "Sıfırdan başlayarak Python programlamayı ileri seviyede öğrenin. Gerçek projelerle pekiştirin. Python programlama dilinin temel sözdiziminden başlayarak veri yapıları, nesne yönelimli programlama, modüller ve ileri programlama tekniklerini uygulamalı örneklerle keşfedeceksiniz. Kendi web uygulamalarınızı, veri analizi scriptlerinizi geliştirin ve geleceğin teknolojilerine hazır olun. Sektörde en çok aranan dillerin başında gelen Python ile büyük veri analitiği, yapay zeka entegrasyonu ve otomasyon süreçlerine profesyonel adımlar atarak kariyerinizde fark yaratma imkanına sahip olun."
                        ) : (
                          `Sıfırdan başlayarak ${selectedSubject.name} konusunu en ileri seviyede öğrenin. Gerçek hayattan projelerle bilginizi pekiştirip portföyünüzü hazırlayın. Sektör deneyimli eğitmenlerimiz rehberliğinde gerçekleştirilen eğitimler vizyon kazanmanızı, kendi teknolojik girişimlerinizi başlatmanızı veya global firmalarda çalışma fırsatları bulmanızı hedefler.`
                        )}
                      </p>
                    </div>

                    {/* 2. Tahmini Ders Saati */}
                    <div className="border border-zinc-150 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF9F5]">
                      <div>
                        <h4 className="font-extrabold text-zinc-900 text-sm flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#E58F49] shrink-0" />
                          Tahmini Ders Saati
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-bold mt-1">
                          *Eğitmenlere göre değişim sağlayabilmektedir.
                        </p>
                      </div>
                      <span className="text-sm font-black font-mono text-[#E58F49] bg-white border border-zinc-200 px-4 py-2 rounded-xl shrink-0">
                        85 Saat
                      </span>
                    </div>

                    {/* 3. Neden Almalısınız? */}
                    <div className="border border-zinc-150 rounded-2xl p-4 space-y-2">
                      <h4 className="font-extrabold text-zinc-900 text-sm">🤔 Neden Almalısınız?</h4>
                      <p className="text-zinc-650 leading-relaxed font-semibold">
                        {selectedSubject.name.toLowerCase().includes('python') || selectedSubject.category === 'Bilişim' ? (
                          "En popüler programlama dili olan Python ile kariyer fırsatlarınızı artırın."
                        ) : (
                          `${selectedSubject.name} alanında kendinizi geliştirerek pazardaki en güncel ve kazançlı iş kollarında kariyerinizi taçlandırın.`
                        )}
                      </p>
                    </div>

                    {/* 4. İstihdam Alanları */}
                    <div className="border border-zinc-150 rounded-2xl p-4 space-y-2">
                      <h4 className="font-extrabold text-zinc-900 text-sm">💼 İstihdam Alanları</h4>
                      <p className="text-zinc-650 leading-relaxed font-bold">
                        {selectedSubject.name.toLowerCase().includes('python') || selectedSubject.category === 'Bilişim' ? (
                          "Yazılım geliştirici, veri analisti, yapay zeka mühendisi."
                        ) : (
                          "Sektör Danışmanı, Freelance Proje Geliştiricisi, Bilişim Eğitmeni, Çözüm Geliştirici"
                        )}
                      </p>
                    </div>

                    {/* 5. Gereksinimler */}
                    <div className="border border-zinc-150 rounded-2xl p-4 space-y-2 bg-[#FAF9F5]/30">
                      <h4 className="font-extrabold text-zinc-900 text-sm">🎯 Gereksinimler</h4>
                      <p className="text-zinc-650 font-bold leading-relaxed text-[#8C3F03] bg-amber-50 p-3 rounded-xl border border-amber-100/60">
                        Temel bilgisayar bilgisi yeterlidir.
                      </p>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          </div>
        ) : (
          /* --- ANA KATALOG GÖRÜNÜMÜ --- */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* LEFT COLUMN: FILTERS PANEL (TOGGLEABLE) */}
            {isFilterOpen && (
              <div className="lg:col-span-1 flex flex-col gap-6 animate-fade-in">
                
                {/* FILTER CONTROLS CARD */}
                <div className="bg-white border border-zinc-200/60 rounded-3xl p-5 shadow-xs sticky top-20 space-y-6">
                  
                  <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 text-zinc-800 font-bold text-sm">
                    <SlidersHorizontal className="w-4 h-4 text-[#E58F49]" />
                    Gelişmiş Filtre Sistemi
                  </div>

                  {/* 1. DERS ADI VE YETKİNLİK SORGULA */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block">DERS ADI VEYA YETKİNLİK SORGULA</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="Örn: 'Python', 'Matematik', 'TOEFL'"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-zinc-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#E58F49]"
                      />
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3.5" />
                      
                      {searchName && (
                        <button 
                          onClick={() => setSearchName('')} 
                          className="absolute right-3 top-3 text-[10px] text-zinc-400 hover:text-zinc-950 font-bold"
                        >
                          Temizle
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 2. KONUM SEÇİNİZ */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block">KONUM SEÇİNİZ</label>
                    <select
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
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
                        {['Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'].map((city, idx) => (
                          <option key={idx} value={city}>📍 {city}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* 3. KATEGORİ */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block">KATEGORİ</label>
                    <select
                      value={filterCategory}
                      onChange={(e) => {
                        setFilterCategory(e.target.value);
                        onSelectCategory(e.target.value); // Keep sync with parent prop
                        setFilterSpecificLesson('Tümü'); // reset lesson when category changes
                      }}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#E58F49]"
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

                  {/* 4. ÖZEL DERS SEÇİMİ */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block">ÖZEL DERS SEÇİMİ</label>
                    {filterCategory === 'Tümü' ? (
                      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-center text-[11px] text-zinc-400 font-semibold italic">
                        ⚠ Önce Kategori Seçmelisiniz
                      </div>
                    ) : (
                      <select
                        value={filterSpecificLesson}
                        onChange={(e) => setFilterSpecificLesson(e.target.value)}
                        className="w-full bg-zinc-50 border border-emerald-300 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-800 focus:outline-none"
                      >
                        <option value="Tümü">Seçilen Kategori Tüm Dersleri</option>
                        {(LESSON_OPTIONS_MAP[filterCategory] || []).map((les, idx) => (
                          <option key={idx} value={les}>{les}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* 5. EĞİTMEN TECRÜBESİ */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block">EĞİTMEN TECRÜBESİ</label>
                    <div className="flex flex-col gap-1.5 font-bold">
                      {['Tümü', 'Yeni', '1-5 Yıl', '+5 Yıldan Fazla', '+10 Yıldan Fazla'].map(exp => (
                        <button
                          key={exp}
                          onClick={() => setFilterExperience(exp)}
                          className={`text-left text-xs px-3 py-2.5 rounded-xl border transition cursor-pointer ${
                            filterExperience === exp 
                              ? 'border-[#E58F49] bg-amber-50/70 text-[#8C3F03] font-black' 
                              : 'border-zinc-200/60 text-zinc-600 font-bold hover:bg-zinc-50'
                          }`}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 6. MAX SEANS FİYATI */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400">MAX SEANS FİYATI</label>
                      <span className="text-xs font-bold text-[#E58F49] font-mono">₺{filterMaxPrice || '1500'}</span>
                    </div>
                    <input 
                      type="range"
                      min="400"
                      max="1500"
                      step="50"
                      value={filterMaxPrice || '1500'}
                      onChange={(e) => setFilterMaxPrice(e.target.value)}
                      className="w-full accent-[#E58F49] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400 font-bold font-mono">
                      <span>₺400</span>
                      <span>₺900</span>
                      <span>₺1500</span>
                    </div>
                  </div>

                  {/* 7. EĞİTİM MODELİ */}
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
                            name="catalogEducationType"
                            checked={filterModel === opt.value}
                            onChange={() => setFilterModel(opt.value)}
                            className="accent-[#E58F49]"
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Reset Filter Action */}
                  <button
                    onClick={handleClearFilters}
                    className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Filtreleri Temizle
                  </button>

                </div>
              </div>
            )}

            {/* RIGHT COLUMN: ACTION BAR & MAIN GRID */}
            <div className={`${isFilterOpen ? 'lg:col-span-3' : 'lg:col-span-4'} flex flex-col gap-6`}>
              
              {/* Dynamic Toggle & Stat header */}
              <div className="bg-white border border-zinc-200/60 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row justify-between items-stretch sm:items-center shadow-xs gap-3">
                <div className="flex items-center gap-3">
                  {/* Filters visibility toggler */}
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-black px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#39FF14]" />
                    {isFilterOpen ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
                  </button>

                  <span className="text-xs font-bold text-zinc-500">
                    <strong className="text-zinc-800">{filteredSubjects.length}</strong> ders alanı listeleniyor
                  </span>
                </div>

                {/* Inline filter status indicator tags */}
                <div className="flex flex-wrap gap-1.5">
                  {filterCategory !== 'Tümü' && (
                    <span className="text-[9px] bg-[#E58F49]/10 text-[#8C3F03] font-bold px-2 py-1 rounded">Kategori: {filterCategory}</span>
                  )}
                  {filterLocation !== 'Tümü' && (
                    <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded">Konum: {filterLocation}</span>
                  )}
                  {filterSpecificLesson !== 'Tümü' && (
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded">Branş Seçildi</span>
                  )}
                  {(filterCategory !== 'Tümü' || filterLocation !== 'Tümü' || filterSpecificLesson !== 'Tümü') && (
                    <button onClick={handleClearFilters} className="text-[9px] text-zinc-400 hover:text-red-500 font-extrabold underline transition">Filtreleri Sıfırla</button>
                  )}
                </div>
              </div>

              {/* Subject (Dersler) cards grid: 
                  - Open filters: 3 columns in desktop (`lg:grid-cols-3`)
                  - Closed filters: 4 columns in desktop (`lg:grid-cols-4`)
                  - Mobile: 2 columns (`grid-cols-2`)
              */}
              {filteredSubjects.length > 0 ? (
                <div className={`grid grid-cols-2 ${isFilterOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
                  {displayedSubjects.map((subject, index) => (
                    <div 
                      key={`${subject.name}-${index}`}
                      className="bg-white border border-zinc-200/70 rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#E58F49] transition duration-200 flex flex-col justify-between group"
                    >
                      {/* Class Poster Photo */}
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img 
                          src={subject.image} 
                          alt={subject.name} 
                          className="object-cover w-full h-full group-hover:scale-105 transition duration-500" 
                        />
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] sm:text-[11px] font-extrabold px-3 py-1 rounded-md tracking-wider shadow-sm">
                          {formatCategory(subject.category)}
                        </div>
                      </div>

                      {/* Course Body Contents */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-1.5 text-left">
                          <h3 className="text-xs sm:text-sm font-black text-zinc-950 group-hover:text-[#E58F49] transition leading-snug line-clamp-2">
                            {subject.name}
                          </h3>

                          <p className="text-[10px] sm:text-xs text-zinc-500 leading-relaxed line-clamp-2">
                            {subject.description}
                          </p>
                        </div>

                        {/* Marketplace Summary statement: 
                            "Bu dersi ₺825-₺825 fiyat aralığında 1 öğretmen ders vermektedir." on line 1 and 2
                        */}
                        <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-3 text-center">
                          <p className="text-[10px] sm:text-[11px] text-zinc-600 leading-snug font-semibold text-center w-full">
                            Bu dersi <strong className="text-[#E58F49] font-black font-mono">₺{subject.minPrice}-₺{subject.maxPrice}</strong> fiyat aralığında
                            <span className="block mt-1 font-bold">
                              <span className="text-red-600 font-extrabold text-xs sm:text-sm font-mono mr-0.5">{subject.teachersCount}</span> öğretmen ders vermektedir.
                            </span>
                          </p>
                        </div>

                        {/* Interactive trigger link/button */}
                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-end">
                          <button
                            onClick={() => setSelectedSubject(subject)}
                            className="w-full bg-orange-500 text-black hover:bg-zinc-950 hover:text-white text-xs sm:text-sm font-black py-3 px-4 rounded-xl transition duration-200 text-center cursor-pointer font-extrabold shadow-sm"
                          >
                            Dersi İncele
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-zinc-200/60 rounded-3xl p-12 text-center shadow-xs">
                  <span className="text-4xl block mb-2">🔍</span>
                  <h4 className="text-sm font-black text-zinc-900 uppercase tracking-wide">Sonuç Bulunamadı</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">Seçtiğiniz kriterleri veya filtre seçeneklerini değiştirerek dilediğiniz eğitimi anında keşfedin.</p>
                  <button 
                    onClick={handleClearFilters}
                    className="mt-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    Filtreleri Sıfırla
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* --- EĞİTMEN ÖN KAYIT PORTALI MODAL --- */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-zinc-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative border border-zinc-200 shadow-2xl">
            
            <button 
              onClick={() => setShowRegisterForm(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-900 transition p-1 rounded-full cursor-pointer"
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
              <p className="text-xs text-zinc-550 mt-1">
                Hiçbir komisyon olmadan, öğrencilerin doğrudan kapınızı çalacağı benzersiz profilinizi anında yayına alın.
              </p>
            </div>

            {successMessage ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center flex flex-col items-center justify-center gap-3">
                <ShieldCheck className="w-12 h-12 text-emerald-600" />
                <p className="text-sm font-extrabold">{successMessage}</p>
                <p className="text-[11px] text-emerald-600 font-medium">Bu pencere otomatik olarak kapanacaktır.</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterTeacherSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-500 block mb-1 text-xs font-semibold">
                      Eğitmen Adı ve Soyadı <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Örn: Ahmet Yılmaz"
                      value={newTeacher.name}
                      onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#E58F49] text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1 text-xs font-semibold">
                      Yüz Yüze Konum Opsiyonu
                    </label>
                    <input 
                      type="text" 
                      placeholder="Örn: Ankara Mamak, Konya Meram veya İstanbul Kartal"
                      value={newTeacher.preferredLocation}
                      onChange={(e) => setNewTeacher({...newTeacher, preferredLocation: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#E58F49] text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-500 block mb-1 text-xs font-semibold">
                      Ana Eğitim Kategorisi
                    </label>
                    <select
                      value={newTeacher.category}
                      onChange={(e) => setNewTeacher({...newTeacher, category: e.target.value as any})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#E58F49] text-[#222] font-bold text-xs bg-white"
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
                    <label className="text-zinc-500 block mb-1 text-xs font-semibold">
                      Etiket <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Örn: React, C#, CSS, İngilizce"
                      value={newTeacher.tags}
                      onChange={(e) => setNewTeacher({...newTeacher, tags: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#E58F49] text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-500 block mb-1 text-xs font-semibold">
                    Kendi Tanıtım Biyografiniz (En Fazla 200 Karakter) <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <textarea 
                    required
                    maxLength={200}
                    rows={2}
                    placeholder="2018 yılından beri özel ders vermekteyim..."
                    value={newTeacher.bio}
                    onChange={(e) => setNewTeacher({...newTeacher, bio: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#E58F49] text-xs font-medium"
                  />
                  <div className="text-[10px] text-zinc-400 text-right font-mono">{newTeacher.bio.length}/200 karakter</div>
                </div>

                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-3">
                  <span className="text-[10px] text-zinc-500 font-bold tracking-wider block">
                    Verilen Dersler ve Saatlik Seans Ücretleri (En Fazla 5 Ders)
                  </span>
                  
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
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
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#E58F49] text-xs font-semibold bg-white"
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
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#E58F49] text-xs font-semibold text-zinc-800 bg-white"
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
                                placeholder="₺ Fiyat"
                                value={session.price}
                                onChange={(e) => {
                                  const updated = [...registeredSessions];
                                  updated[idx].price = e.target.value;
                                  setRegisteredSessions(updated);
                                }}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#E58F49] font-mono text-xs text-right font-bold"
                              />
                            </div>
                            {registeredSessions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = registeredSessions.filter((_, i) => i !== idx);
                                  setRegisteredSessions(updated);
                                }}
                                className="text-red-500 hover:text-red-700 p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition mb-0.5 shrink-0 cursor-pointer"
                                title="Dersi kaldır"
                              >
                                <X className="w-3.5 h-3.5" />
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
                        className="text-[#E58F49] hover:text-[#b0672e] text-xs font-bold underline transition cursor-pointer"
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
                      className="rounded border-zinc-300 text-[#E58F49] focus:ring-[#E58F49]"
                    />
                    <span className="text-xs text-zinc-750 font-semibold">Online</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newTeacher.canFaceToFace}
                      onChange={(e) => setNewTeacher({...newTeacher, canFaceToFace: e.target.checked})}
                      className="rounded border-zinc-300 text-[#E58F49] focus:ring-[#E58F49]"
                    />
                    <span className="text-xs text-zinc-750 font-semibold">Yüz Yüze</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newTeacher.canCorporate}
                      onChange={(e) => setNewTeacher({...newTeacher, canCorporate: e.target.checked})}
                      className="rounded border-zinc-300 text-[#E58F49] focus:ring-[#E58F49]"
                    />
                    <span className="text-xs text-zinc-750 font-semibold">Kurumsal</span>
                  </label>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-[#E58F49] hover:bg-[#D4803A] text-white font-extrabold py-3.5 rounded-2xl transition text-center shadow-sm text-xs uppercase tracking-wider cursor-pointer font-display"
                  >
                    Başvurumu Admin Onayına Gönder
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
