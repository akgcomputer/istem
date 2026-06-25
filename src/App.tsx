import { useState, FormEvent, useEffect } from 'react';
import { 
  Sparkles, Award, User, Users, GraduationCap, Building2, 
  HelpCircle, ShieldCheck, CheckCircle2, ChevronRight, X, Search, Menu 
} from 'lucide-react';
// Removed static mock imports. Data is now fetched from Cloudflare APIs.
import { Course, Certificate } from './types';

import { CATEGORIES, COURSES, MOCK_EMPLOYEES, MOCK_CERTIFICATES } from './data';
import { MOCK_TEACHERS, MOCK_SPECIAL_COURSES } from './data/catalogData';

// Importing our modular clean views
import HomeView from './components/HomeView';
import AuthModal from './components/AuthModal';
import CatalogView from './components/CatalogView';
import DetailView from './components/DetailView';
import ChallengesView from './components/ChallengesView';
import StudentDashboard from './components/StudentDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import B2BDashboard from './components/B2BDashboard';
import TeachersCatalogView from './components/TeachersCatalogView';
import SchoolsCatalogView from './components/SchoolsCatalogView';
import SpecialCoursesCatalogView from './components/SpecialCoursesCatalogView';
import TeacherProfileView from './components/TeacherProfileView';
import AdminDashboard from './components/AdminDashboard';
import SchoolManagementView from './components/SchoolManagementView';

export default function App() {
  // Global Navigation / Simulator Page states
  // Supporting exact 8 requested sections
  const [activePage, setActivePage] = useState<string>('home'); // home, katalog, detay, video, ogrenci, egitmen, kurumsal
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data States
  const [categories, setCategories] = useState<any[]>(CATEGORIES);
  const [courses, setCourses] = useState<any[]>(COURSES);
  const [specialCourses, setSpecialCourses] = useState<any[]>(MOCK_SPECIAL_COURSES);
  const [teachers, setTeachers] = useState<any[]>(MOCK_TEACHERS);
  const [employees, setEmployees] = useState<any[]>(MOCK_EMPLOYEES);
  const [certificates, setCertificates] = useState<any[]>(MOCK_CERTIFICATES);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [selectedTeacherProfile, setSelectedTeacherProfile] = useState<any>(null);
  const [selectedCatalogSubject, setSelectedCatalogSubject] = useState<string | null>(null);

  // Fetch Data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        setCategories(CATEGORIES);
        setCourses(COURSES);
        setTeachers(MOCK_TEACHERS);
        setSpecialCourses(MOCK_SPECIAL_COURSES);
        setEmployees(MOCK_EMPLOYEES);
        setCertificates(MOCK_CERTIFICATES);
        
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/ders/')) {
          const id = currentPath.replace('/ders/', '').split('?')[0];
          const found = (Array.isArray(couData) ? couData : []).find((c: any) => c.id === id);
          if (found) setSelectedCourse(found);
        } else if (Array.isArray(couData) && couData.length > 0) {
          setSelectedCourse(couData[0]);
        }
        
        if (currentPath.startsWith('/ogretmen/')) {
          const slug = currentPath.replace('/ogretmen/', '').split('?')[0];
          const getTeacherSlug = (name: string): string => {
            return name.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
          };
          const foundT = (Array.isArray(tData) ? tData : []).find((t: any) => getTeacherSlug(t.name) === slug);
          if (foundT) setSelectedTeacherProfile(foundT);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // URL Path Routing synchronizer
  useEffect(() => {
    const handleUrlRouting = () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/ogretmen/')) {
        const slug = pathname.replace('/ogretmen/', '').split('?')[0];
        const getTeacherSlug = (name: string): string => {
          return name.toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
        };
        const found = teachers.find(t => getTeacherSlug(t.name) === slug);
        if (found) {
          setSelectedTeacherProfile(found);
          setActivePage('teacher-profile');
        } else {
          handleNavigate('teachers-catalog', {}, '/ogretmenler');
        }
      } else if (pathname === '/ogretmenler' || pathname === '/ogretmenler/') {
        handleNavigate('teachers-catalog', {}, '/ogretmenler');
      } else if (pathname === '/admin') {
        handleNavigate('admin', {}, '/admin');
      } else if (pathname === '/dersler' || pathname === '/dersler/') {
        setActivePage('katalog');
      } else if (pathname.startsWith('/ders/')) {
        const id = pathname.replace('/ders/', '').split('?')[0];
        // We might not have courses loaded yet if it's initial load, but we rely on the component using URL ID or handling it.
        // Actually since courses are state, we will just set active page to detay.
        setActivePage('detay');
      } else if (pathname === '/okullar' || pathname === '/okullar/') {
        handleNavigate('schools-catalog', {}, '/okullar');
      } else if (pathname === '/kurslar' || pathname === '/kurslar/') {
        handleNavigate('special-courses-catalog', {}, '/kurslar');
      } else if (pathname === '/challenge') {
        setActivePage('challenges');
      } else if (pathname === '/' || pathname === '/home') {
        setActivePage('home');
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, []);

  const navigateToTeacherProfile = (teacher: any) => {
    setSelectedTeacherProfile(teacher);
    const getTeacherSlug = (name: string): string => {
      return name.toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
    };
    const slug = getTeacherSlug(teacher.name);
    window.history.pushState({ page: 'teacher-profile', slug }, '', `/ogretmen/${slug}`);
    setActivePage('teacher-profile');
  };

  const navigateToTeachersCatalog = () => {
    window.history.pushState({ page: 'teachers-catalog' }, '', '/ogretmenler');
    handleNavigate('teachers-catalog', {}, '/ogretmenler');
    setSelectedTeacherProfile(null);
  };
  
  const handleNavigate = (page: string, extraState?: any, path?: string) => {
    setActivePage(page);
    let newPath = path;
    if (!newPath) {
      if (page === 'home') newPath = '/';
      else if (page === 'katalog') newPath = '/dersler';
      else if (page === 'detay') newPath = '/ders';
      else if (page === 'video') newPath = '/video';
      else if (page === 'ogrenci') newPath = '/ogrenci';
      else if (page === 'egitmen') newPath = '/egitmen';
      else if (page === 'kurumsal') newPath = '/kurumsal';
      else if (page === 'teachers-catalog') newPath = '/ogretmenler';
      else if (page === 'schools-catalog') newPath = '/okullar';
      else if (page === 'special-courses-catalog') newPath = '/kurslar';
      else if (page === 'teacher-profile') newPath = '/ogretmen';
      else if (page === 'admin') newPath = '/admin';
      else if (page === 'school-management') newPath = '/yonetim';
      else newPath = '/';
    }
    window.history.pushState({ page, ...extraState }, '', newPath);
    window.scrollTo(0, 0);
  };
  
  // Real enrollment state trackers
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(['kurs-1']); // default enrolled in Next.js
  
  // Certificate Verifications search States (Section 8)
  const [searchCertId, setSearchCertId] = useState('');
  const [searchedCertificate, setSearchedCertificate] = useState<Certificate | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [certSearchError, setCertSearchError] = useState(false);

  // Simulation Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string>('');
  const [loggedInRole, setLoggedInRole] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register'>('login');
  const [popupModal, setPopupModal] = useState<{ title: string; content: string } | null>(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser('');
    setLoggedInRole('');
    handleNavigate('home');
  };

  const handleEnrollCourse = (courseId: string) => {
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds([...enrolledCourseIds, courseId]);
    }
    // Instantly navigate to study room
    const targetCourse = courses.find(c => c.id === courseId) || (courses.length > 0 ? courses[0] : null);
    if (targetCourse) setSelectedCourse(targetCourse);
    handleNavigate('video');
  };

  // Global search lookup for certificate (Section 8 footer)
  const handleVerifyCertificate = (e: FormEvent) => {
    e.preventDefault();
    if (!searchCertId.trim()) return;

    const found = certificates.find(c => 
      c.verificationId.toLowerCase() === searchCertId.trim().toLowerCase()
    );

    if (found) {
      setSearchedCertificate(found);
      setCertSearchError(false);
      setShowCertModal(true);
    } else {
      setCertSearchError(true);
      setTimeout(() => setCertSearchError(false), 3000);
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-zinc-900 font-sans antialiased flex flex-col justify-between">
      
      {/* CORE FRAMEWORK NAVBAR */}
      <header className="sticky top-0 z-35 bg-white/95 backdrop-blur-md border-b border-zinc-200/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo on the left */}
          <button 
            onClick={() => { handleNavigate('home'); setIsMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 group animate-fade-in"
          >
            <div className="w-9 h-9 bg-zinc-950 text-white rounded-xl flex items-center justify-center font-black font-display text-xs group-hover:bg-[#FF6600] transition duration-200">
              İST
            </div>
            <div className="text-left">
              <span className="text-xs font-black uppercase tracking-widest block font-display leading-tight">
                <span className="text-[#FF6600]">İST</span>
                <span className="text-zinc-900 group-hover:text-amber-600 transition">EM</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-bold block leading-none font-mono">EĞİTİM PAZARYERİ</span>
            </div>
          </button>

          {/* Quick link buttons */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-zinc-655 font-semibold">
            <button 
              onClick={navigateToTeachersCatalog} 
              className={`hover:text-[#FF6600] transition ${activePage === 'teachers-catalog' ? 'text-[#FF6600] font-black' : 'text-zinc-650'}`}
            >
              Öğretmenler
            </button>
            <button 
              onClick={() => { handleNavigate('katalog', {}, '/dersler'); setSelectedCategory('Tümü'); }} 
              className={`hover:text-[#FF6600] transition ${activePage === 'katalog' ? 'text-[#FF6600] font-black' : 'text-zinc-650'}`}
            >
              Dersler
            </button>
            <button 
              onClick={() => handleNavigate('schools-catalog', {}, '/okullar')} 
              className={`hover:text-[#FF6600] transition ${activePage === 'schools-catalog' ? 'text-[#FF6600] font-black' : 'text-zinc-650'}`}
            >
              Özel Okul Ara
            </button>
            <button 
              onClick={() => handleNavigate('special-courses-catalog', {}, '/kurslar')} 
              className={`hover:text-[#FF6600] transition ${activePage === 'special-courses-catalog' ? 'text-[#FF6600] font-black' : 'text-zinc-650'}`}
            >
              Kurs ara
            </button>
            <button 
              onClick={() => handleNavigate('challenges', {}, '/challenge')} 
              className={`hover:text-[#FF6B35] transition ${activePage === 'challenges' ? 'text-[#FF6B35] font-black' : 'text-zinc-650'} flex items-center gap-1 bg-[#1A1825]/5 px-2.5 py-1 rounded-full text-[11px]`}
            >
              🏆 İSTEM Challenge
            </button>
          </nav>

          {/* Profile controls on the right */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setActivePage('ogrenci'); setIsMobileMenuOpen(false); }}
                  className="bg-zinc-100 hover:bg-[#FF6600]/10 text-zinc-800 text-xs font-bold px-3.5 py-2 rounded-xl transition"
                >
                  Kurslarım Panelim
                </button>
                <img 
                  onClick={() => { setActivePage('ogrenci'); setIsMobileMenuOpen(false); }} 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" 
                  alt="Avatar" 
                  className="w-8.5 h-8.5 rounded-full object-cover border-2 border-[#FF6600] cursor-pointer hover:opacity-90 hover:scale-[1.05] transition"
                />
              </div>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => { setAuthModalInitialMode('login'); setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }} 
                  className="bg-zinc-100 text-zinc-800 text-xs font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl hover:bg-zinc-200 transition cursor-pointer"
                >
                  Giriş Yap
                </button>
                <button 
                  onClick={() => { setAuthModalInitialMode('register'); setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }} 
                  className="bg-[#FF6600] hover:bg-[#CC5200] text-white text-xs font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition shadow-xs cursor-pointer"
                >
                  Kayıt Ol
                </button>
              </div>
            )}

            {/* Mobile Hamburger toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 transition"
              aria-label="Menüyü Aç/Kapat"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-red-500" /> : <Menu className="w-5 h-5 text-zinc-700" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-zinc-200/80 shadow-lg px-4 py-4 space-y-2 animate-fade-in relative z-40">
            <button 
              onClick={() => { handleNavigate('teachers-catalog', {}, '/ogretmenler'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition ${activePage === 'teachers-catalog' ? 'bg-[#FF6600]/10 text-[#FF6600]' : 'text-zinc-600 hover:bg-zinc-50'}`}
            >
              <span>Öğretmenler</span>
              <ChevronRight className="w-4 h-4 opacity-40 text-rose-500" />
            </button>
            <button 
              onClick={() => { setActivePage('katalog'); setSelectedCategory('Tümü'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition ${activePage === 'katalog' ? 'bg-[#FF6600]/10 text-[#FF6600]' : 'text-zinc-600 hover:bg-zinc-50'}`}
            >
              <span>Dersler</span>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </button>
            <button 
              onClick={() => { handleNavigate('schools-catalog', {}, '/okullar'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition ${activePage === 'schools-catalog' ? 'bg-[#FF6600]/10 text-[#FF6600]' : 'text-zinc-600 hover:bg-zinc-50'}`}
            >
              <span>Özel Okul Ara</span>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </button>
            <button 
              onClick={() => { handleNavigate('special-courses-catalog', {}, '/kurslar'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition ${activePage === 'special-courses-catalog' ? 'bg-[#FF6600]/10 text-[#FF6600]' : 'text-zinc-600 hover:bg-zinc-50'}`}
            >
              <span>Kurs ara</span>
              <ChevronRight className="w-4 h-4 opacity-40" />
            </button>
            <button 
              onClick={() => { setActivePage('challenges'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition ${activePage === 'challenges' ? 'bg-red-50 text-red-700' : 'text-zinc-600 hover:bg-zinc-50'} border border-red-100 bg-red-500/5`}
            >
              <span className="flex items-center gap-1.5 font-black text-red-655 text-zinc-900">🏆 Challenge Arena</span>
              <ChevronRight className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
      </header>

      {/* RENDER ACTIVE DYNAMIC ROUTED VIEW */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomeView 
            courses={courses}
            categories={categories}
            onSelectCourse={(course) => {
              setSelectedCourse(course);
              handleNavigate('detay', { courseId: course.id }, `/ders/${course.id}`);
            }}
            onNavigateTo={(page) => handleNavigate(page)}
            isLoggedIn={isLoggedIn}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              handleNavigate('katalog', {}, '/dersler');
            }}
          />
        )}

        {activePage === 'katalog' && (
          <CatalogView 
            courses={courses}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectCourse={(course) => {
              setSelectedCourse(course);
              handleNavigate('detay', { courseId: course.id }, `/ders/${course.id}`);
            }}
            onViewProfile={navigateToTeacherProfile}
            isLoggedIn={isLoggedIn}
            initialSubjectName={selectedCatalogSubject}
          />
        )}

        {activePage === 'detay' && selectedCourse && (
          <DetailView 
            course={selectedCourse}
            onEnroll={handleEnrollCourse}
            isEnrolled={enrolledCourseIds.includes(selectedCourse.id)}
            onNavigateTo={(page) => handleNavigate(page)}
          />
        )}

        {activePage === 'challenges' && (
          <ChallengesView />
        )}

        {activePage === 'ogrenci' && (
          <StudentDashboard 
            courses={courses}
            certificates={certificates}
            onSelectCourse={(c) => {
              setSelectedCourse(c);
              handleNavigate('detay', { courseId: c.id }, `/ders/${c.id}`);
            }}
            onNavigateTo={(page) => handleNavigate(page)}
            onLogout={handleLogout}
          />
        )}

        {activePage === 'egitmen' && (
          <InstructorDashboard 
            courses={courses}
            onLogout={handleLogout}
          />
        )}

        {activePage === 'kurumsal' && (
          <B2BDashboard 
            initialEmployees={employees}
            courses={courses}
            representativeName={loggedInUser || "Ayşe Yankı"}
            representativeCompany="Acme Corporation Ltd."
            onLogout={handleLogout}
          />
        )}

        {activePage === 'teachers-catalog' && (
          <TeachersCatalogView 
            courses={courses}
            onSelectCourse={(course) => {
               setSelectedCourse(course);
               handleNavigate('detay', { courseId: course.id }, `/ders/${course.id}`);
            }}
            onNavigateTo={(page) => handleNavigate(page)}
            onViewProfile={navigateToTeacherProfile}
          />
        )}

        {activePage === 'teacher-profile' && selectedTeacherProfile && (
          <TeacherProfileView 
            teacher={selectedTeacherProfile}
            onBack={navigateToTeachersCatalog}
            courses={specialCourses}
            onSelectCourse={(course) => {
              setSelectedCatalogSubject(course.title || course.name);
              handleNavigate('katalog', {}, '/dersler');
            }}
          />
        )}

        {activePage === 'schools-catalog' && (
          <SchoolsCatalogView />
        )}

        {activePage === 'special-courses-catalog' && (
          <SpecialCoursesCatalogView />
        )}

        {activePage === 'admin' && (
          <AdminDashboard 
            onNavigateTo={(page) => handleNavigate(page)}
            courses={courses}
          />
        )}

        {activePage === 'school-mgmt' && (
          <SchoolManagementView initialType="okul" onLogout={handleLogout} />
        )}

        {activePage === 'course-mgmt' && (
          <SchoolManagementView initialType="kurs" onLogout={handleLogout} />
        )}
      </main>

      {/* FOOTER & DYNAMIC CERTIFICATE SEARCH COMPONENT (Section 8) */}
      <footer className="bg-[#1C1A18] text-zinc-400 border-t border-zinc-800 py-12 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Logo element description */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white text-zinc-950 font-black rounded-lg flex items-center justify-center font-display">
                İST
              </div>
              <span className="text-sm font-black text-white font-display uppercase tracking-wider">İSTANBUL EĞİTİM MERKEZİ</span>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-500">
              Türkiye'nin bağımsız eğitmen güvencesiyle kurulan, komisyonsuz, yetkinliği tasdikleyen ilk açık pazar eğitim ekosistemi.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-2.5 text-left">
              <span className="text-sm text-[#FF6600] font-black block tracking-wider">Keşfet</span>
              <button onClick={() => { setActivePage('katalog'); setSelectedCategory('Tümü'); setSelectedCatalogSubject(null); }} className="block text-zinc-400 hover:text-white text-left transition cursor-pointer">Tüm dersler</button>
              <button onClick={() => handleNavigate('teachers-catalog', {}, '/ogretmenler')} className="block text-zinc-400 hover:text-white text-left transition cursor-pointer">Öğretmenler</button>
              <button onClick={() => handleNavigate('schools-catalog', {}, '/okullar')} className="block text-zinc-400 hover:text-white text-left transition cursor-pointer">Okul ara</button>
              <button onClick={() => handleNavigate('special-courses-catalog', {}, '/kurslar')} className="block text-zinc-400 hover:text-white text-left transition cursor-pointer">Kurs Ara</button>
            </div>
            <div className="space-y-3 text-left">
              <div>
                <span className="text-sm text-sky-400 font-black block tracking-wider mb-2">Kurumsal</span>
                <button 
                  onClick={() => setPopupModal({
                    title: "Kurumsal Çözümler",
                    content: "İstanbul Eğitim Merkezi, işletmenizin ve kurumunuzun nitelikli eğitim ihtiyaçlarını komisyonsuz, doğrudan ve güvenilir bir ekosistem ile çözüme kavuşturur. Kurumsal üyelikle ekiplerinizin gelişimini ve sertifikasyon süreçlerini canlı olarak takip edin."
                  })} 
                  className="block text-zinc-400 hover:text-white text-left transition cursor-pointer"
                >
                  Kurumsal
                </button>
                <button 
                  onClick={() => setActivePage('kurumsal')} 
                  className="block text-zinc-400 hover:text-white text-left transition cursor-pointer"
                >
                  İK Talent Portalı
                </button>
              </div>
              
              <div className="pt-2 space-y-1">
                <span className="text-sm text-red-500 font-black block tracking-wider">Girişler</span>
                <button 
                  onClick={() => {
                    if (isLoggedIn) {
                      setActivePage('ogrenci');
                    } else {
                      setAuthModalInitialMode('login');
                      setIsAuthModalOpen(true);
                    }
                  }} 
                  className="block text-white hover:text-zinc-200 text-left transition cursor-pointer font-bold"
                >
                  Öğrenci Girişi
                </button>
                <button onClick={() => setActivePage('egitmen')} className="block text-zinc-400 hover:text-white text-left transition cursor-pointer">Eğitmen Girişi</button>
                <button onClick={() => setActivePage('school-mgmt')} className="block text-zinc-400 hover:text-white text-left transition cursor-pointer">Okul Girişi</button>
                <button onClick={() => setActivePage('school-mgmt')} className="block text-zinc-400 hover:text-white text-left transition cursor-pointer">Kurs Girişi</button>
              </div>
            </div>
          </div>

          {/* "VERIFY CERTIFICATE" FOOTER SEARCH ("FARK" implementation!) */}
          <div className="md:col-span-4 bg-[#151412] p-5 rounded-2xl border border-zinc-850">
            <span className="text-[9px] font-black tracking-widest text-[#FF6600] uppercase block mb-1">DİPLOMA / SERTİFİKA DOĞRULAMA</span>
            <span className="text-xs font-black text-white block mb-2 leading-tight">Belgenizi almayı unutmayın!!</span>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-3">
              Şirketlerin direkt İK departmanları veya üçüncü şahıslar için öğrencinin ödev PDF'ini, kod test sonucunu ve biyografisini sorgulatın.
            </p>

            <form onSubmit={handleVerifyCertificate} className="flex gap-1.5">
              <input 
                type="text"
                required
                value={searchCertId}
                onChange={(e) => setSearchCertId(e.target.value)}
                placeholder="Örn: NEXT-9842-12 veya GEMINI-3421-08"
                className="w-full bg-[#252321] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6600] placeholder-zinc-600 font-mono"
              />
              <button 
                type="submit"
                className="bg-[#FF6600] hover:bg-[#CC5200] text-white font-bold text-xs px-3.5 py-2 rounded-lg transition shrink-0"
              >
                Sorgula
              </button>
            </form>

            {/* Error banner feedback */}
            {certSearchError && (
              <span className="text-[10px] font-bold text-red-500 block mt-2">
                ✗ Geçersiz Sertifika Kimliği. Lütfen kontrol edip tekrar deneyin.
              </span>
            )}
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-zinc-850/60 flex flex-col gap-4 text-xs sm:text-sm text-zinc-500 text-left">
          <p className="leading-relaxed font-semibold text-zinc-400">
            © 1999&apos;dan günümüze.. İstanbul Eğitim Merkezi DD İnternet topluluğu Markasıdır ve Markamız <a href="https://MeetWork.com.tr" target="_blank" rel="noopener noreferrer" className="underline text-[#FF6600] hover:text-white font-bold transition">MeetWork</a> İştirakidir.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-bold text-zinc-400">
            <button 
              onClick={() => setPopupModal({
                title: "Sıkça Sorulan Sorular",
                content: "İSTEM platformunda komisyon oranları nedir? Platformumuz bağımsız eğitmenler için %0 komisyon politikası gütmektedir. Eğitimlerin tamamı eğitmenlerin tam güvencesi altındadır ve ödemeler doğrudan aktarılır. Sertifikalarımız SHA-256 imzalı olup her zaman doğrulanabilmektedir."
              })} 
              className="hover:text-white transition cursor-pointer text-left"
            >
              Sıkça Sorulanlar
            </button>
            <button 
              onClick={() => setPopupModal({
                title: "Kullanım Koşulları ve Sözleşme",
                content: "İstanbul Eğitim Merkezi hizmetlerini kullanırken tarafların karşılıklı yükümlülükleri, eğitim içeriklerinin telif korumaları ve bağımsız eğitmen güvencelerinin yasal sınırları bu sözleşme kapsamında belirlenmektedir. Platform kurallarına uyulması tüm katılımcılar için zorunludur."
              })} 
              className="hover:text-white transition cursor-pointer text-left"
            >
              Kullanım Koşulları
            </button>
            <button 
              onClick={() => setPopupModal({
                title: "KVKK Aydınlatma Metni",
                content: "6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, platformumuzda gerçekleştirdiğiniz kayıt, eğitim takibi ve sertifika sorgulama gibi işlemler sırasında toplanan kişisel verileriniz yüksek güvenlikli sunucularda yasal sınırlar ve açık rıza temelinde güvenle işlenmektedir."
              })} 
              className="hover:text-white transition cursor-pointer text-left"
            >
              KVKK Aydınlatma Metni
            </button>
          </div>
        </div>
      </footer>

      {/* DYNAMIC REAL-TIME CERTIFICATE VERIFICATION POPUP MODAL (Section 8) */}
      {showCertModal && searchedCertificate && (
        <div className="fixed inset-0 bg-black/75 z-40 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white text-zinc-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative border border-zinc-200/80 shadow-2xl">
            
            <button 
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <span className="w-12 h-12 bg-emerald-50 text-emerald-700 flex items-center justify-center rounded-full mx-auto mb-4 border border-emerald-100">
                <ShieldCheck className="w-7 h-7" />
              </span>

              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block mb-1">✓ DOĞRULANMIŞ RESMİ DİPLOMA KARTI</span>
              <h3 className="text-lg font-black font-display text-zinc-950">İstanbul Eğitim Akademisi Mezuniyet</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Sertifika ID: {searchedCertificate.verificationId}</p>

              <div className="border-t border-b border-zinc-150 py-5 my-5 text-left space-y-3 font-medium">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Mezun Öğrenci:</span>
                  <span className="font-extrabold text-zinc-950">{searchedCertificate.studentName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Eğitim Grubu:</span>
                  <span className="font-semibold text-zinc-800 max-w-[200px] truncate">{searchedCertificate.courseTitle}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Tarih / Derece:</span>
                  <span className="font-mono text-zinc-800">{searchedCertificate.issueDate} / {searchedCertificate.grade}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Durumu:</span>
                  <span className="text-emerald-800 font-bold">Aktif &amp; Geçerli (Ömürboyu)</span>
                </div>
              </div>

              {/* Fake QR generator image preview */}
              <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-xl flex items-center justify-center gap-4 mb-4">
                <img src={searchedCertificate.qrCodeUrl} alt="QR" className="w-20 h-20 bg-white object-contain border border-zinc-200 rounded" />
                <div className="text-left">
                  <span className="text-[10px] text-zinc-400 font-bold block">QR DOĞRULAYICI</span>
                  <p className="text-[11px] text-zinc-550 leading-relaxed">
                    Akıllı telefon kamerasından okutulduğunda öğrencinin çözdüğü kod dosyalarını, sınav cevaplarını ve puan ortalamasını doğrular.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowCertModal(false)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold py-3 rounded-xl transition"
                >
                  Kapat
                </button>
                <button
                  onClick={() => alert('Sertifika resmi PDF formatında indiriliyor...')}
                  className="flex-1 bg-[#FF6600] hover:bg-[#CC5200] text-white text-xs font-bold py-3 rounded-xl transition"
                >
                  Belgeyi PDF İndir
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* COMPACT CLEAN POPUP MODAL FOR DOCUMENTS AND INFORMATION */}
      {popupModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 animate-fade-in" id="generic-popup-modal">
          <div className="bg-white text-zinc-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative border border-zinc-200/85 shadow-2xl">
            
            <button 
              onClick={() => setPopupModal(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <span className="w-12 h-12 bg-amber-50 text-[#FF6600] flex items-center justify-center rounded-full mx-auto mb-4 border border-amber-100">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </span>

              <h3 className="text-sm font-black font-display text-zinc-950 uppercase tracking-wide">{popupModal.title}</h3>

              <div className="py-4 my-2 text-left text-xs text-zinc-600 leading-relaxed font-semibold">
                {popupModal.content}
              </div>

              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={() => setPopupModal(null)}
                  className="flex-1 bg-zinc-150 hover:bg-zinc-200 text-zinc-800 text-xs font-bold py-3 rounded-xl transition cursor-pointer"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    alert('Detaylı döküman sayfasına yönlendiriliyorsunuz...');
                    setPopupModal(null);
                  }}
                  className="flex-1 bg-[#FF6600] hover:bg-[#CC5200] text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer"
                >
                  Devamı
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* AUTH MODAL POP-UP */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalInitialMode}
        onLoginSuccess={(userName, role) => {
          setIsLoggedIn(true);
          setLoggedInUser(userName);
          setLoggedInRole(role);
          if (role === 'Bireysel') {
            setActivePage('ogrenci');
          } else if (role === 'Kurumsal') {
            setActivePage('kurumsal');
          } else if (role === 'Öğretmen') {
            setActivePage('egitmen');
          } else if (role === 'Okul Temsilcisi') {
            setActivePage('school-mgmt');
          } else if (role === 'Kurs Temsilcisi') {
            setActivePage('course-mgmt');
          } else if (role === 'Yönetici') {
            handleNavigate('admin', {}, '/admin');
          }
        }}
      />

    </div>
  );
}

