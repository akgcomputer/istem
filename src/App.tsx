import { useState, FormEvent, useEffect } from 'react';
import {
  Sparkles, Award, User, Users, GraduationCap, Building2,
  HelpCircle, ShieldCheck, CheckCircle2, ChevronRight, X, Search, Menu,
  Compass, BookOpen, QrCode, Phone
} from 'lucide-react';
import { Course, Certificate } from './types';

import { CATEGORIES, COURSES, MOCK_EMPLOYEES, MOCK_CERTIFICATES } from './data';
import { MOCK_TEACHERS, MOCK_SPECIAL_COURSES } from './data/catalogData';

// Importing modular clean views
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
import InstructorSelectionView from './components/InstructorSelectionView';
import ParentPortalView from './components/ParentPortalView';
import { IstemKidsRole } from './data/istemKidsData';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
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
  const [activeInstitutionCode, setActiveInstitutionCode] = useState<string>('zerdalikres');
  const [activeKidsRole, setActiveKidsRole] = useState<IstemKidsRole>('veli');

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
          const found = (Array.isArray(COURSES) ? COURSES : []).find((c: any) => c.id === id);
          if (found) setSelectedCourse(found);
        } else if (Array.isArray(COURSES) && COURSES.length > 0) {
          setSelectedCourse(COURSES[0]);
        }

        if (currentPath.startsWith('/ogretmen/')) {
          const slug = currentPath.replace('/ogretmen/', '').split('?')[0];
          const getTeacherSlug = (name: string): string => {
            return name
              .toLowerCase()
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
          const foundT = (Array.isArray(MOCK_TEACHERS) ? MOCK_TEACHERS : []).find(
            (t: any) => getTeacherSlug(t.name) === slug
          );
          if (foundT) setSelectedTeacherProfile(foundT);
        }
      } catch (error) {
        console.error('Error fetching data', error);
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
          return name
            .toLowerCase()
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
      } else if (pathname === '/portal/veli' || pathname === '/portal/veli/') {
        setActiveKidsRole('veli');
        setActivePage('veli-portal');
      } else if (pathname === '/portal/ogretmen' || pathname === '/portal/ogretmen/') {
        setActiveKidsRole('ogretmen');
        setActivePage('veli-portal');
      } else if (pathname === '/portal/servis' || pathname === '/portal/servis/') {
        setActiveKidsRole('servis_gorevlisi');
        setActivePage('veli-portal');
      } else if (pathname === '/portal/kurum' || pathname === '/portal/kurum/') {
        setActiveKidsRole('kurum_sahibi');
        setActivePage('veli-portal');
      } else if (pathname === '/portal' || pathname === '/portal/' || pathname === '/veli-portal') {
        setActiveKidsRole('veli');
        setActivePage('veli-portal');
        window.history.replaceState({ page: 'veli-portal', kidsRole: 'veli' }, '', '/portal/veli');
      } else if (pathname === '/dersler' || pathname === '/dersler/') {
        setActivePage('katalog');
      } else if (pathname.startsWith('/ders/')) {
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
      return name
        .toLowerCase()
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
      else if (page === 'school-mgmt') newPath = '/yonetim';
      else if (page === 'veli-portal') newPath = '/portal/veli';
      else newPath = '/';
    }
    window.history.pushState({ page, ...extraState }, '', newPath);
    window.scrollTo(0, 0);
  };

  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(['kurs-1']);

  // Certificate Verifications search States
  const [searchCertId, setSearchCertId] = useState('');
  const [searchedCertificate, setSearchedCertificate] = useState<Certificate | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [certSearchError, setCertSearchError] = useState(false);

  // Auth & Modal States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string>('');
  const [loggedInRole, setLoggedInRole] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register' | 'kurum' | 'talep'>('kurum');
  const [authModalTargetName, setAuthModalTargetName] = useState<string>('Özel Zerdali Orman & Ekoloji Anaokulu');
  const [popupModal, setPopupModal] = useState<{ title: string; content: string } | null>(null);

  const openAuthModalWithMode = (mode: 'login' | 'register' | 'kurum' | 'talep', targetName?: string) => {
    setAuthModalInitialMode(mode);
    if (targetName) setAuthModalTargetName(targetName);
    setIsAuthModalOpen(true);
  };

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
    const targetCourse = courses.find(c => c.id === courseId) || (courses.length > 0 ? courses[0] : null);
    if (targetCourse) setSelectedCourse(targetCourse);
    handleNavigate('video');
  };

  const handleVerifyCertificate = (e: FormEvent) => {
    e.preventDefault();
    if (!searchCertId.trim()) return;

    const found = certificates.find(
      c => c.verificationId.toLowerCase() === searchCertId.trim().toLowerCase()
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
    <div className="bg-surface min-h-screen text-on-surface font-sans antialiased flex flex-col justify-between pb-16 md:pb-0">
      {/* TOP ANNOUNCEMENT RIBBON */}
      <div className="bg-primary-fixed text-on-primary-fixed-variant border-b border-outline-variant/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-[11px] font-bold">
          <div className="flex items-center gap-2 truncate">
            <span className="flex h-2 w-2 rounded-full bg-primary-container animate-pulse shrink-0" />
            <span className="truncate">
              🎓 <strong>İstanbul Eğitim Merkezi (İSTEM)</strong> — Beşikten Kariyere Okul, Kreş, Kurs ve %0 Komisyonlu Özel Ders Ekosistemi
            </span>
          </div>
          <div className="hidden md:flex items-center gap-5 shrink-0">
            <button
              type="button"
              onClick={() => handleNavigate('veli-portal', {}, '/portal')}
              className="hover:text-primary transition cursor-pointer"
            >
              Veli &amp; Günlük Karne Portalı
            </button>
            <a href="tel:08503004783" className="hover:text-primary transition flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>0850 300 İSTEM</span>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
          {/* Brand Logo: İSTEM + İstanbul Eğitim Merkezi */}
          <button
            type="button"
            onClick={() => { handleNavigate('home'); setIsMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 group text-left cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 bg-primary-container text-white rounded-xl flex items-center justify-center font-black font-display text-sm shadow-xs group-hover:bg-primary transition">
              İST
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black uppercase tracking-tight font-display leading-none text-on-surface">
                  <span className="text-primary-container">İST</span>EM
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[9px] font-extrabold uppercase">
                  Eğitim
                </span>
              </div>
              <span className="text-[10px] text-on-surface-variant font-bold block leading-tight mt-0.5">
                İstanbul Eğitim Merkezi
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-display font-bold">
            <button
              type="button"
              onClick={() => handleNavigate('schools-catalog', {}, '/okullar')}
              className={`hover:text-primary-container transition cursor-pointer ${
                activePage === 'schools-catalog' ? 'text-primary-container font-extrabold' : 'text-on-surface-variant'
              }`}
            >
              Okul &amp; Kreş Bul
            </button>
            <button
              type="button"
              onClick={navigateToTeachersCatalog}
              className={`hover:text-primary-container transition flex items-center gap-1.5 cursor-pointer ${
                activePage === 'teachers-catalog' ? 'text-primary-container font-extrabold' : 'text-on-surface-variant'
              }`}
            >
              <span>Özel Ders &amp; Öğretmenler</span>
              <span className="px-1.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-extrabold">
                %0 Komisyon
              </span>
            </button>
            <button
              type="button"
              onClick={() => { handleNavigate('katalog', {}, '/dersler'); setSelectedCategory('Tümü'); }}
              className={`hover:text-primary-container transition cursor-pointer ${
                activePage === 'katalog' ? 'text-primary-container font-extrabold' : 'text-on-surface-variant'
              }`}
            >
              Dersler &amp; Akademi
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('special-courses-catalog', {}, '/kurslar')}
              className={`hover:text-primary-container transition cursor-pointer ${
                activePage === 'special-courses-catalog' ? 'text-primary-container font-extrabold' : 'text-on-surface-variant'
              }`}
            >
              Kurs Merkezleri
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('challenges', {}, '/challenge')}
              className={`hover:text-primary-container transition flex items-center gap-1 cursor-pointer ${
                activePage === 'challenges' ? 'text-primary-container font-extrabold' : 'text-on-surface-variant'
              }`}
            >
              <span>🏆 Challenge Arena</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('veli-portal', {}, '/portal')}
              className={`hover:text-secondary transition flex items-center gap-1 cursor-pointer ${
                activePage === 'veli-portal' ? 'text-secondary font-extrabold' : 'text-on-surface-variant'
              }`}
            >
              <span>👨‍👩‍👧 Okul &amp; Veli Portalı</span>
            </button>
          </nav>

          {/* Right Action Controls (No Forced Login Wall) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                window.history.pushState({ openSchoolForm: true }, '', '/okullar');
                handleNavigate('schools-catalog', {}, '/okullar');
              }}
              className="hidden sm:inline-flex items-center gap-1 px-3.5 py-2 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white text-xs font-display font-bold transition cursor-pointer"
            >
              <span>+ Eğitmen / Okul Ekle</span>
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNavigate('veli-portal', {}, '/portal')}
                  className="bg-primary-container text-white text-xs font-display font-bold px-4 py-2 rounded-full shadow-xs hover:bg-primary transition cursor-pointer"
                >
                  🏫 Portalım ({loggedInUser})
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModalWithMode('kurum')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary-container hover:bg-primary text-white text-xs font-display font-bold shadow-sm transition cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kurum / Veli Portalı Girişi</span>
                <span className="sm:hidden">Portal Girişi</span>
              </button>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface transition cursor-pointer"
              aria-label="Menüyü Aç/Kapat"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-error" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-surface-container-lowest border-t border-outline-variant/30 shadow-lg px-4 py-4 space-y-2 relative z-40">
            <button
              type="button"
              onClick={() => { handleNavigate('schools-catalog', {}, '/okullar'); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between text-on-surface hover:bg-surface-container-low"
            >
              <span>🏫 Okul &amp; Kreş Vitrinleri</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
            <button
              type="button"
              onClick={() => { handleNavigate('teachers-catalog', {}, '/ogretmenler'); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between text-on-surface hover:bg-surface-container-low"
            >
              <span>🧑‍🏫 Özel Ders Öğretmenleri (%0 Komisyon)</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
            <button
              type="button"
              onClick={() => { handleNavigate('veli-portal', {}, '/portal'); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between bg-primary-fixed/40 text-on-primary-fixed"
            >
              <span>👶 Veli Günlük Karne &amp; Kurum Zili Portalı</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => { handleNavigate('katalog', {}, '/dersler'); setSelectedCategory('Tümü'); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between text-on-surface hover:bg-surface-container-low"
            >
              <span>📚 Tüm Dersler &amp; Akademi (420+)</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
            <button
              type="button"
              onClick={() => { handleNavigate('special-courses-catalog', {}, '/kurslar'); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between text-on-surface hover:bg-surface-container-low"
            >
              <span>🎯 Kurs Merkezleri (LGS / YKS / Dil)</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
            <button
              type="button"
              onClick={() => { handleNavigate('challenges', {}, '/challenge'); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between text-on-surface hover:bg-surface-container-low"
            >
              <span>🏆 İSTEM Challenge Arena</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
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
            onSelectCourse={course => {
              setSelectedCourse(course);
              handleNavigate('detay', { courseId: course.id }, `/ders/${course.id}`);
            }}
            onNavigateTo={page => handleNavigate(page)}
            isLoggedIn={isLoggedIn}
            onSelectCategory={cat => {
              setSelectedCategory(cat);
              handleNavigate('katalog', {}, '/dersler');
            }}
            onOpenAuthModal={openAuthModalWithMode}
          />
        )}

        {activePage === 'veli-portal' && (
          <ParentPortalView
            initialInstitutionCode={activeInstitutionCode}
            initialKidsRole={activeKidsRole}
            onRoleChange={nextRole => {
              setActiveKidsRole(nextRole);
              const targetPath =
                nextRole === 'ogretmen'
                  ? '/portal/ogretmen'
                  : nextRole === 'servis_gorevlisi'
                  ? '/portal/servis'
                  : nextRole === 'kurum_sahibi'
                  ? '/portal/kurum'
                  : '/portal/veli';
              window.history.pushState({ page: 'veli-portal', kidsRole: nextRole }, '', targetPath);
              window.scrollTo(0, 0);
            }}
            onNavigateTo={page => handleNavigate(page)}
            onLogout={handleLogout}
          />
        )}

        {activePage === 'katalog' && (
          <CatalogView
            courses={courses}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectCourse={course => {
              setSelectedCourse(course);
              setActivePage('instructor-selection');
            }}
            onViewProfile={navigateToTeacherProfile}
            isLoggedIn={isLoggedIn}
            initialSubjectName={selectedCatalogSubject}
          />
        )}

        {activePage === 'instructor-selection' && selectedCourse && (
          <InstructorSelectionView
            course={selectedCourse}
            onSelectTeacher={course => {
              handleNavigate('detay', { courseId: course.id }, `/ders/${course.id}`);
            }}
            onBack={() => setActivePage('katalog')}
          />
        )}

        {activePage === 'detay' && selectedCourse && (
          <DetailView
            course={selectedCourse}
            onEnroll={handleEnrollCourse}
            isEnrolled={enrolledCourseIds.includes(selectedCourse.id)}
            onNavigateTo={page => handleNavigate(page)}
          />
        )}

        {activePage === 'challenges' && <ChallengesView />}

        {activePage === 'ogrenci' && (
          <StudentDashboard
            courses={courses}
            certificates={certificates}
            onSelectCourse={c => {
              setSelectedCourse(c);
              handleNavigate('detay', { courseId: c.id }, `/ders/${c.id}`);
            }}
            onNavigateTo={page => handleNavigate(page)}
            onLogout={handleLogout}
          />
        )}

        {activePage === 'egitmen' && (
          <InstructorDashboard courses={courses} onLogout={handleLogout} />
        )}

        {activePage === 'kurumsal' && (
          <B2BDashboard
            initialEmployees={employees}
            courses={courses}
            representativeName={loggedInUser || 'Ayşe Yankı'}
            representativeCompany="Acme Corporation Ltd."
            onLogout={handleLogout}
          />
        )}

        {activePage === 'teachers-catalog' && (
          <TeachersCatalogView
            courses={courses}
            onSelectCourse={course => {
              setSelectedCourse(course);
              handleNavigate('detay', { courseId: course.id }, `/ders/${course.id}`);
            }}
            onNavigateTo={page => handleNavigate(page)}
            onViewProfile={navigateToTeacherProfile}
          />
        )}

        {activePage === 'teacher-profile' && selectedTeacherProfile && (
          <TeacherProfileView
            teacher={selectedTeacherProfile}
            onBack={navigateToTeachersCatalog}
            courses={specialCourses}
            onSelectCourse={course => {
              setSelectedCatalogSubject(course.title || course.name);
              handleNavigate('katalog', {}, '/dersler');
            }}
          />
        )}

        {activePage === 'schools-catalog' && <SchoolsCatalogView />}

        {activePage === 'special-courses-catalog' && <SpecialCoursesCatalogView />}

        {activePage === 'admin' && (
          <AdminDashboard onNavigateTo={page => handleNavigate(page)} courses={courses} />
        )}

        {activePage === 'school-mgmt' && (
          <SchoolManagementView initialType="okul" onLogout={handleLogout} />
        )}

        {activePage === 'course-mgmt' && (
          <SchoolManagementView initialType="kurs" onLogout={handleLogout} />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#1C1A18] text-zinc-400 border-t border-zinc-800 py-12 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Info */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary-container text-white font-black rounded-xl flex items-center justify-center font-display">
                İST
              </div>
              <div>
                <span className="text-sm font-black text-white font-display uppercase tracking-wider block">
                  İSTANBUL EĞİTİM MERKEZİ (İSTEM)
                </span>
                <span className="text-[10px] text-zinc-400 font-bold">
                  Beşikten Kariyere Komisyonsuz Eğitim Ekosistemi
                </span>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              <strong>İstanbul Eğitim Merkezi (İSTEM)</strong>; kreş ve anaokullarından ilköğretim ve liseye, %0 komisyonlu özel ders öğretmenlerinden mesleki gelişim akademilerine kadar tüm eğitim paydaşlarını tek çatıda buluşturur.
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-zinc-300">
              🏢 <strong>Okul, Kreş ve Kurs Sahipleri İçin:</strong> Kurumsal ön muhasebe, öğrenci taksit sözleşmeleri, GİB e-Fatura ve kantin/kırtasiye stok süreçleri <strong>Stok Pratik</strong> altyapısıyla entegre çalışmaktadır.
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 text-xs">
            <div className="space-y-2.5 text-left">
              <span className="text-xs text-[#FF6600] font-black uppercase tracking-wider block">
                İSTEM Ekosistemi
              </span>
              <button
                type="button"
                onClick={() => handleNavigate('schools-catalog', {}, '/okullar')}
                className="block text-zinc-400 hover:text-white text-left transition cursor-pointer"
              >
                İSTEM Kids (Kreş &amp; Anaokulu)
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('schools-catalog', {}, '/okullar')}
                className="block text-zinc-400 hover:text-white text-left transition cursor-pointer"
              >
                İSTEM Junior &amp; Kampüs (Okullar)
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('teachers-catalog', {}, '/ogretmenler')}
                className="block text-zinc-400 hover:text-white text-left transition cursor-pointer"
              >
                Özel Ders Öğretmenleri
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('special-courses-catalog', {}, '/kurslar')}
                className="block text-zinc-400 hover:text-white text-left transition cursor-pointer"
              >
                Kurs Merkezleri Ara
              </button>
              <button
                type="button"
                onClick={() => { setActivePage('katalog'); setSelectedCategory('Tümü'); }}
                className="block text-zinc-400 hover:text-white text-left transition cursor-pointer"
              >
                İSTEM Akademi (420+ Ders)
              </button>
            </div>

            <div className="space-y-2.5 text-left">
              <span className="text-xs text-emerald-400 font-black uppercase tracking-wider block">
                Portallar &amp; İşletme
              </span>
              <button
                type="button"
                onClick={() => handleNavigate('veli-portal', {}, '/portal')}
                className="block text-white font-bold hover:text-primary-container text-left transition cursor-pointer"
              >
                Veli &amp; Günlük Karne Portalı
              </button>
              <button
                type="button"
                onClick={() => openAuthModalWithMode('kurum')}
                className="block text-zinc-400 hover:text-white text-left transition cursor-pointer"
              >
                Kurum Kodu ile Okul Girişi
              </button>
              <button
                type="button"
                onClick={() => setActivePage('school-mgmt')}
                className="block text-zinc-400 hover:text-white text-left transition cursor-pointer"
              >
                Okul &amp; Stok Pratik ERP Paneli
              </button>
              <button
                type="button"
                onClick={() => setActivePage('egitmen')}
                className="block text-zinc-400 hover:text-white text-left transition cursor-pointer"
              >
                Eğitmen Paneli
              </button>
              <button
                type="button"
                onClick={() => setActivePage('kurumsal')}
                className="block text-zinc-400 hover:text-white text-left transition cursor-pointer"
              >
                Şirket İK (B2B) Akademi
              </button>
            </div>
          </div>

          {/* Certificate Verification Box */}
          <div className="md:col-span-4 bg-[#151412] p-5 rounded-2xl border border-zinc-800">
            <span className="text-[10px] font-black tracking-widest text-[#FF6600] uppercase block mb-1">
              İSTANBUL EĞİTİM MERKEZİ BELGE SORGULAMA
            </span>
            <span className="text-xs font-black text-white block mb-2 leading-tight">
              QR Doğrulamalı Sertifika &amp; Karne Sorgula
            </span>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
              İSTEM bünyesinde verilen tüm sertifikaları, öğrenci projelerini ve akreditasyon belgelerini doğrulayın.
            </p>

            <form onSubmit={handleVerifyCertificate} className="flex gap-1.5">
              <input
                type="text"
                required
                value={searchCertId}
                onChange={e => setSearchCertId(e.target.value)}
                placeholder="Örn: NEXT-9842-12"
                className="w-full bg-[#252321] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6600] placeholder-zinc-500 font-mono"
              />
              <button
                type="submit"
                className="bg-[#FF6600] hover:bg-[#CC5200] text-white font-bold text-xs px-3.5 py-2 rounded-lg transition shrink-0 cursor-pointer"
              >
                Sorgula
              </button>
            </form>

            {certSearchError && (
              <span className="text-[10px] font-bold text-red-500 block mt-2">
                ✗ Geçersiz Sertifika Kimliği. Örnek: NEXT-9842-12
              </span>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p className="leading-relaxed font-semibold">
            © 1999&apos;dan günümüze <strong>İstanbul Eğitim Merkezi (İSTEM)</strong> • DD İnternet Topluluğu Markası ve{' '}
            <a
              href="https://MeetWork.com.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#FF6600] hover:text-white font-bold transition"
            >
              MeetWork
            </a>{' '}
            İştirakidir. Okul muhasebe altyapısı <strong>Stok Pratik</strong> tarafından sağlanmaktadır.
          </p>
        </div>
      </footer>

      {/* MOBILE APP BOTTOM NAVIGATION BAR (Stitch Super-App Bar) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] pb-safe">
        <div className="flex items-center justify-around h-16 px-2 relative">
          <button
            type="button"
            onClick={() => handleNavigate('home', {}, '/')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] cursor-pointer ${
              activePage === 'home' ? 'text-primary-container font-extrabold' : 'text-on-surface-variant'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px]">Keşfet</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('schools-catalog', {}, '/okullar')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] cursor-pointer ${
              activePage === 'schools-catalog' ? 'text-primary-container font-extrabold' : 'text-on-surface-variant'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-[10px]">Okullar</span>
          </button>

          {/* Center Floating Portal Button */}
          <div className="relative -top-4 flex flex-col items-center">
            <button
              type="button"
              onClick={() => handleNavigate('veli-portal', {}, '/portal')}
              className="w-13 h-13 rounded-full bg-primary-container text-white flex items-center justify-center shadow-[0_8px_20px_rgba(255,102,0,0.4)] active:scale-95 transition cursor-pointer"
            >
              <QrCode className="w-6 h-6" />
            </button>
            <span
              className={`text-[10px] mt-0.5 font-bold ${
                activePage === 'veli-portal' ? 'text-primary-container' : 'text-on-surface-variant'
              }`}
            >
              Portalım
            </span>
          </div>

          <button
            type="button"
            onClick={navigateToTeachersCatalog}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] cursor-pointer ${
              activePage === 'teachers-catalog' ? 'text-primary-container font-extrabold' : 'text-on-surface-variant'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px]">Özel Ders</span>
          </button>

          <button
            type="button"
            onClick={() => openAuthModalWithMode('kurum')}
            className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] text-on-surface-variant cursor-pointer"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Giriş</span>
          </button>
        </div>
      </nav>

      {/* CERTIFICATE MODAL */}
      {showCertModal && searchedCertificate && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white text-zinc-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative border border-zinc-200/80 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <span className="w-12 h-12 bg-emerald-50 text-emerald-700 flex items-center justify-center rounded-full mx-auto mb-4 border border-emerald-100">
                <ShieldCheck className="w-7 h-7" />
              </span>
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block mb-1">
                ✓ DOĞRULANMIŞ RESMİ İSTANBUL EĞİTİM MERKEZİ DİPLOMA KARTI
              </span>
              <h3 className="text-lg font-black font-display text-zinc-950">
                İstanbul Eğitim Merkezi (İSTEM) Mezuniyet Belgesi
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Sertifika ID: {searchedCertificate.verificationId}
              </p>
              <div className="border-t border-b border-zinc-100 py-5 my-5 text-left space-y-3 font-medium text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Mezun Öğrenci:</span>
                  <span className="font-extrabold text-zinc-950">{searchedCertificate.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Eğitim Grubu:</span>
                  <span className="font-semibold text-zinc-800">{searchedCertificate.courseTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Tarih / Derece:</span>
                  <span className="font-mono text-zinc-800">
                    {searchedCertificate.issueDate} / {searchedCertificate.grade}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                className="w-full bg-[#FF6600] hover:bg-[#CC5200] text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTH & INSTITUTION PORTAL MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalInitialMode}
        initialTargetName={authModalTargetName}
        onLoginSuccess={(userName, role, institutionCode, kidsRole) => {
          setIsLoggedIn(true);
          setLoggedInUser(userName);
          setLoggedInRole(role);
          if (institutionCode) {
            setActiveInstitutionCode(institutionCode);
          }
          const getRolePath = (r: string) =>
            r === 'ogretmen'
              ? '/portal/ogretmen'
              : r === 'servis_gorevlisi'
              ? '/portal/servis'
              : r === 'kurum_sahibi'
              ? '/portal/kurum'
              : '/portal/veli';

          if (kidsRole) {
            setActiveKidsRole(kidsRole);
            handleNavigate('veli-portal', { kidsRole }, getRolePath(kidsRole));
            return;
          }
          if (role === 'Veli Portalı') {
            setActiveKidsRole('veli');
            handleNavigate('veli-portal', { kidsRole: 'veli' }, '/portal/veli');
          } else if (role === 'Sınıf Öğretmeni') {
            setActiveKidsRole('ogretmen');
            handleNavigate('veli-portal', { kidsRole: 'ogretmen' }, '/portal/ogretmen');
          } else if (role === 'Servis Görevlisi') {
            setActiveKidsRole('servis_gorevlisi');
            handleNavigate('veli-portal', { kidsRole: 'servis_gorevlisi' }, '/portal/servis');
          } else if (role === 'Bireysel') {
            setActivePage('ogrenci');
          } else if (role === 'Kurumsal') {
            setActivePage('kurumsal');
          } else if (role === 'Öğretmen') {
            setActivePage('egitmen');
          } else if (role === 'Okul Temsilcisi') {
            setActiveKidsRole('kurum_sahibi');
            handleNavigate('veli-portal', { kidsRole: 'kurum_sahibi' }, '/portal/kurum');
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
