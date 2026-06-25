import React, { useState, FormEvent, useMemo } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, ClipboardCheck, Sparkles, Award, 
  CreditCard, Settings, BarChart3, HelpCircle, Palette, Plus, Trash2, 
  Edit, Check, X, Search, Mail, Phone, Shield, TrendingUp, Briefcase, 
  Calendar, Building, Save, FileText, Lock, PlusCircle, CheckCircle, AlertCircle, RefreshCw,
  FileSpreadsheet, Download, Upload, GraduationCap
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Course } from '../types';
import ApplicationsTab from './admin/ApplicationsTab';
import ReportsTab from './admin/ReportsTab';
import SchoolsTab from './admin/SchoolsTab';
import AdminContentTab from './admin/AdminContentTab';

interface BulkLesson {
  id: string;
  code: string;
  name: string;
  hours: number;
  category: string;
  type: string;
}

interface BulkTeacher {
  id: string;
  name: string;
  branch: string;
  phone: string;
  email: string;
  assignedBranch: string;
}

interface BulkSchool {
  id: string;
  name: string;
  location: string;
  capacity: number;
  teachersCount: number;
  type: 'okul';
}

interface BulkCourse {
  id: string;
  name: string;
  location: string;
  educationLevel: string;
  lessonsIntensity: string;
  hours: string;
}

interface AdminDashboardProps {
  onNavigateTo: (page: string) => void;
  courses: Course[];
}

// Initial Mock Datasets
const INITIAL_USERS = [
  { id: 'usr-1', name: 'Ali Ekin', tel: '532 999 11 22', role: 'Bireysel', regDate: '2026-06-15', status: 'Aktif', email: 'ali@ekin.com' },
  { id: 'usr-2', name: 'Buse Solak', tel: '505 444 33 22', role: 'Öğretmen', regDate: '2026-06-14', status: 'Aktif', email: 'buse@istem.com' },
  { id: 'usr-3', name: 'Canberk Yalçın', tel: '554 111 22 33', role: 'Kurumsal', regDate: '2026-06-11', status: 'Aktif', email: 'canberk@firma.co' },
  { id: 'usr-4', name: 'Deniz Aksu', tel: '542 333 44 55', role: 'Okul Temsilcisi', regDate: '2026-06-16', status: 'Beklemede', email: 'deniz@kolej.k12.tr' },
  { id: 'usr-5', name: 'Elif Mutlu', tel: '533 777 88 99', role: 'Kurs Temsilcisi', regDate: '2026-06-18', status: 'Aktif', email: 'elif@kursakademi.com' },
];

const INITIAL_APPLICATIONS = [
  { id: 'app-1', type: 'Eğitmen', applicant: 'Dr. Mert Yılmaz', details: 'Figma ile İleri Seviye UI/UX Tasarım Kulvarı', date: '2026-06-18', status: 'Beklemede' },
  { id: 'app-2', type: 'Okul', applicant: 'Özel Kadıköy Bilim Koleji', details: '25 Öğretmen Lisansı & Lab Akreditasyonu', date: '2026-06-17', status: 'Beklemede' },
  { id: 'app-3', type: 'Kurs', applicant: 'Alfa Robotik Kodlama Kursu', details: 'MEB Onaylı Kurs Entegrasyon Talebi', date: '2026-06-19', status: 'Beklemede' },
  { id: 'app-4', type: 'Challenge', applicant: 'Zeynep Kaya', details: 'Gemini AI Prompt Challenge Katılım Çözümü', date: '2026-06-19', status: 'Beklemede' },
  { id: 'app-5', type: 'Rapor', applicant: 'İhbar Eden: Can T.', details: 'Kültür Sanat Kursu İçin Yanıltıcı Reklam Şikayeti', date: '2026-06-15', status: 'İnceleniyor' }
];

const INITIAL_CHALLENGES = [
  { id: 'ch-1', title: 'Gemini AI Prompt Mühendisliği Maratonu', date: '2026-06-10', limit: '200 Katılımcı', status: 'Aktif', category: 'Yapay Zeka', premium: true, sponsor: 'Google Cloud' },
  { id: 'ch-2', title: 'Figma ile Tasarım Sistemi Mimarlık Yarışı', date: '2026-06-25', limit: '100 Katılımcı', status: 'Draft', category: 'Tasarım', premium: false, sponsor: 'İSTEM Bilişim' },
  { id: 'ch-3', title: 'React 19 & Next.js Performans Optimizasyonu', date: '2026-06-05', limit: '500 Katılımcı', status: 'Completed', category: 'Yazılım', premium: true, sponsor: 'Vercel Turkey' }
];

const INITIAL_CERT_LOGS = [
  { id: 'log-1', certId: 'NEXT-9842-12', date: '2026-06-19 12:44', ip: '176.43.22.105', result: '✓ Başarılı (Mezun: Aslı Şen)' },
  { id: 'log-2', certId: 'GEMINI-3421-08', date: '2026-06-19 11:30', ip: '85.105.99.12', result: '✓ Başarılı (Mezun: Kerem Solak)' },
  { id: 'log-3', certId: 'FAKE-1234-99', date: '2026-06-19 09:15', ip: '46.2.140.222', result: '✗ Başarısız (Geçersiz ID)' },
];

const INITIAL_FINANCES = [
  { id: 'tx-101', student: 'Ali Öztürk', amount: 4500, date: '2026-06-19', course: 'İleri Seviye Next.js 15 Eğitim Grubu', status: 'Tamamlandı' },
  { id: 'tx-102', student: 'Zeynep Ak', amount: 3200, date: '2026-06-18', course: 'Sıfırdan Figma UI/UX Tasarım', status: 'Tamamlandı' },
  { id: 'tx-103', student: 'Melih Demir', amount: 6000, date: '2026-06-18', course: 'Gemini API ile Kurumsal AI Uygulamaları', status: 'Tamamlandı' },
];

const INITIAL_TICKETS = [
  { id: 't-1', name: 'Mustafa Çelik', topic: 'Ödeme Sorunu', text: 'Kredi kartı ile taksit işleminde hata alıyorum.', status: 'Açık', reply: '' },
  { id: 't-2', name: 'Ayşe Kaya', topic: 'Eğitmen Onayı', text: 'Evraklarımı yükledim fakat onay süreci hakkında bilgi almak istiyorum.', status: 'Cevaplandı', reply: 'Evraklarınız inceleme aşamasındadır, gün içinde onay mesajı iletilecektir.' }
];

export default function AdminDashboard({ onNavigateTo, courses }: AdminDashboardProps) {
  // Admin Login State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Sidebar Tabs State
  const [activeTab, setActiveTab] = useState<string>('dashboard'); // matches requested menus 1 - 11

  // Generic data states supporting true backend simulators
  const [users, setUsers] = useState(INITIAL_USERS);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [certLogs, setCertLogs] = useState(INITIAL_CERT_LOGS);
  const [finances, setFinances] = useState(INITIAL_FINANCES);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);

  // Search filter states
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('Tümü');
  const [visibleUsersCount, setVisibleUsersCount] = useState(10);

  // New Sub-module Filter States
  const [searchContentQuery, setSearchContentQuery] = useState('');
  const [searchAppQuery, setSearchAppQuery] = useState('');
  const [searchChallengeQuery, setSearchChallengeQuery] = useState('');
  const [searchCertQuery, setSearchCertQuery] = useState('');
  const [searchPaymentQuery, setSearchPaymentQuery] = useState('');

  // UI Customizer values
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('brandColor') || 'orange');
  const [showHeroBannerSetting, setShowHeroBannerSetting] = useState(() => localStorage.getItem('showHeroBannerSetting') !== 'false');
  const [showSearchBarsSetting, setShowSearchBarsSetting] = useState(() => localStorage.getItem('showSearchBarsSetting') !== 'false');
  const [showChallengeSetting, setShowChallengeSetting] = useState(() => localStorage.getItem('showChallengeSetting') !== 'false');
  const [showCertificateSetting, setShowCertificateSetting] = useState(() => localStorage.getItem('showCertificateSetting') !== 'false');

  // Dynamic style settings synchronization
  React.useEffect(() => {
    localStorage.setItem('brandColor', activeTheme);
    localStorage.setItem('showHeroBannerSetting', String(showHeroBannerSetting));
    localStorage.setItem('showSearchBarsSetting', String(showSearchBarsSetting));
    localStorage.setItem('showChallengeSetting', String(showChallengeSetting));
    localStorage.setItem('showCertificateSetting', String(showCertificateSetting));
    
    const root = document.documentElement;
    if (activeTheme === 'carbon') {
      root.style.setProperty('--primary-theme', '#181614');
      root.style.setProperty('--primary-theme-hover', '#2d2a26');
    } else if (activeTheme === 'green') {
      root.style.setProperty('--primary-theme', '#047857');
      root.style.setProperty('--primary-theme-hover', '#065f46');
    } else if (activeTheme === 'purple') {
      root.style.setProperty('--primary-theme', '#6d28d9');
      root.style.setProperty('--primary-theme-hover', '#5b21b6');
    } else {
      root.style.setProperty('--primary-theme', '#FF6600');
      root.style.setProperty('--primary-theme-hover', '#CC5200');
    }
    
    window.dispatchEvent(new Event('brandColorChange'));
  }, [activeTheme, showHeroBannerSetting, showSearchBarsSetting, showChallengeSetting, showCertificateSetting]);

  // Input States for Adding New User
  const [modalNewUser, setModalNewUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserTel, setNewUserTel] = useState('');
  const [newUserRole, setNewUserRole] = useState('Bireysel');

  // Input States for New Challenge
  const [modalNewChallenge, setModalNewChallenge] = useState(false);
  const [newChalTitle, setNewChalTitle] = useState('');
  const [newChalCat, setNewChalCat] = useState('Yazılım');
  const [newChalSponsor, setNewChalSponsor] = useState('');
  const [newChalLimit, setNewChalLimit] = useState('250 Katılımcı');

  // Settings State variables
  const [siteName, setSiteName] = useState('İstanbul Eğitim Pazaryeri (İSTEM)');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=150&q=80');
  const [smtpServer, setSmtpServer] = useState('smtp.istem.org.tr');
  const [commissionRate, setCommissionRate] = useState(0); // Commision stays zero currently
  const [ytApiKey, setYtApiKey] = useState('AIzaSyD_yt_mock_72a819b');
  const [ghClientSecret, setGhClientSecret] = useState('ghs_8192mock_secretkeys_112');
  const [whatsappNumber, setWhatsappNumber] = useState(() => localStorage.getItem('whatsapp_number') || '905551234567');
  const [hotlineNumber, setHotlineNumber] = useState(() => localStorage.getItem('hotline_number') || '902129999999');

  // Help support input
  const [broadcastingText, setBroadcastingText] = useState('');
  const [supportReplyText, setSupportReplyText] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Excel Bulk Import States
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const [lessonsList, setLessonsList] = useState<BulkLesson[]>([
    { id: 'l-1', code: 'MAT101', name: 'Matematik', hours: 6, category: 'Sayısal', type: 'Zorunlu' },
    { id: 'l-2', code: 'FZK101', name: 'Fizik', hours: 4, category: 'Sayısal', type: 'Zorunlu' },
    { id: 'l-3', code: 'EDB101', name: 'Türk Dili ve Edebiyatı', hours: 5, category: 'Sözel', type: 'Zorunlu' }
  ]);

  const [teachersList, setTeachersList] = useState<BulkTeacher[]>([
    { id: 't-1', name: 'Selin Yılmaz', branch: 'Matematik', phone: '+90 (555) 123 45 67', email: 'selin.yilmaz@istanbul-egitimi.gov.tr', assignedBranch: 'Ataköy Şube' },
    { id: 't-2', name: 'Can Demir', branch: 'Fizik', phone: '+90 (555) 765 43 21', email: 'can.demir@istanbul-egitimi.gov.tr', assignedBranch: 'Merkez' }
  ]);

  const [schoolsList, setSchoolsList] = useState<BulkSchool[]>([
    { id: 's-1', name: 'Kuzey Bahçeşehir Koleji ve Fen Lisesi', location: 'Sarıyer, İstanbul', capacity: 200, teachersCount: 24, type: 'okul' },
    { id: 's-2', name: 'İstanbul Bilim Koleji', location: 'Beşiktaş, İstanbul', capacity: 500, teachersCount: 45, type: 'okul' }
  ]);

  const [coursesList, setCoursesList] = useState<BulkCourse[]>([
    { id: 'c-1', name: 'Lisan Teknoloji Akademisi', location: 'Bakırköy, İstanbul', educationLevel: 'Kodlama Atölyesi', lessonsIntensity: 'Haftalık 24 Saat', hours: '17:00-21:30' }
  ]);

  // Track the previous counts to show "how many before, how many after"
  const [lessonsPrevCount, setLessonsPrevCount] = useState<number>(3);
  const [teachersPrevCount, setTeachersPrevCount] = useState<number>(2);
  const [schoolsPrevCount, setSchoolsPrevCount] = useState<number>(2);
  const [coursesPrevCount, setCoursesPrevCount] = useState<number>(1);

  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: { loading: boolean; progress: number } }>({
    lessons: { loading: false, progress: 0 },
    teachers: { loading: false, progress: 0 },
    schools: { loading: false, progress: 0 },
    courses: { loading: false, progress: 0 },
  });

  const handleDownloadTemplate = (fileName: string) => {
    let content = '';
    // Use standard CSV format so Microsoft Excel splits rows perfectly without errors
    if (fileName === 'toplu-ders.csv') {
      content = "Ders Kodu;Ders Adı;Haftalık Saat;Kategori;Zorunlu/Seçmeli\n" +
                "MAT101;Matematik;6;Sayısal;Zorunlu\n" +
                "FZK101;Fizik;4;Sayısal;Zorunlu\n" +
                "EDB101;Türk Dili ve Edebiyatı;5;Sözel;Zorunlu\n" +
                "ING101;İngilizce;4;Dil;Zorunlu\n" +
                "ROB101;Robotik Kodlama;2;Uygulamalı;Seçmeli";
    } else if (fileName === 'toplu-ogretmen.csv') {
      content = "Ad Soyad;Branş;Telefon;E-posta;Şube\n" +
                "Selin Yılmaz;Matematik;+90 (555) 123 45 67;selin.yilmaz@istanbul-egitimi.gov.tr;Ataköy Şube\n" +
                "Can Demir;Fizik;+90 (555) 765 43 21;can.demir@istanbul-egitimi.gov.tr;Merkez\n" +
                "Aylin Kaya;Kimya;+90 (555) 987 65 43;aylin.kaya@istanbul-egitimi.gov.tr;Kadıköy Şube\n" +
                "Mert Çelik;Tarih;+90 (555) 234 56 78;mert.celik@istanbul-egitimi.gov.tr;Bebek Şube";
    } else if (fileName === 'toplu-okul.csv') {
      content = "Kurum Adı;Lokasyon;Mevcut Kapasite;Öğretmen Sayısı;Yönetici Ünvanı\n" +
                "İstanbul Bilim Koleji;Beşiktaş, İstanbul;500;45;Genel Koordinatör\n" +
                "Yıldızlar Anadolu Lisesi;Fatih, İstanbul;350;28;Müdür Yardımcısı\n" +
                "Avrasya Koleji;Üsküdar, İstanbul;480;40;Kurucu Ortak";
    } else if (fileName === 'toplu-kurs.csv') {
      content = "Kurs Adı;Lokasyon;Eğitim Kademesi;Haftalık Yoğunluk;Ders Saatleri\n" +
                "Lisan Teknoloji Akademisi;Bakırköy, İstanbul;Kodlama Atölyesi, Yabancı Dil Kursu;Haftalık 24 Saat;17:00-21:30\n" +
                "Metropol LGS-YKS Hazırlık;Kadıköy, İstanbul;LGS-YKS Hazırlık;Haftalık 30 Saat;09:00-16:00\n" +
                "Kreatif Sanat ve Müzik Akademisi;Beşiktaş, İstanbul;Anaokulu (3-6 yaş), İlkokul;Haftalık 16 Saat;10:30-18:00";
    }

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`Örnek ${fileName} şablon dosyası indirildi! Excel veya başka bir e-tablo programıyla açıp inceleyebilirsiniz.`);
  };

  const parseCSVLines = (text: string): string[][] => {
    // Normalise any escaped newline sequences and split by actual carriage return/line feeds
    const normalized = text.replaceAll('\\n', '\n').replaceAll('\r\n', '\n');
    return normalized.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        if (line.includes(';')) {
          return line.split(';');
        }
        return line.split(',');
      });
  };

  const handleActualUpload = async (type: 'lessons' | 'teachers' | 'schools' | 'courses', customTextContent?: string) => {
    setUploadStatus(prev => ({
      ...prev,
      [type]: { loading: true, progress: 10 }
    }));

    let progressInterval = setInterval(() => {
      setUploadStatus(prev => {
        const current = prev[type];
        if (current.progress >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return {
          ...prev,
          [type]: { ...current, progress: current.progress + 15 }
        };
      });
    }, 200);

    try {
      const rows = parseCSVLines(customTextContent || '');
      if (rows.length < 2) throw new Error("Geçerli veri bulunamadı.");
      const dataRows = rows.slice(1);

      let endpoint = '';
      let payload: any[] = [];

      if (type === 'teachers') {
        endpoint = '/api/teachers/bulk';
        payload = dataRows.map((r, i) => ({
          name: r[0] || 'İsimsiz Eğitmen',
          category: r[1] || 'Diğer',
          phone: r[2] || '',
          email: r[3] || '',
          preferredLocation: r[4] || ''
        }));
      } else if (type === 'schools') {
        endpoint = '/api/private_schools/bulk';
        payload = dataRows.map((r, i) => ({
          name: r[0] || 'Yeni Okul',
          location: r[1] || '',
          capacity: parseInt(r[2]) || 0,
          teachersCount: parseInt(r[3]) || 0,
          reviewerName: r[4] || ''
        }));
      } else if (type === 'courses') {
        endpoint = '/api/special_courses/bulk';
        payload = dataRows.map((r, i) => ({
          name: r[0] || 'Yeni Kurs',
          location: r[1] || '',
          type: r[2] || 'Kurs',
          hoursPerWeek: r[3] || '',
          priceRange: r[4] || ''
        }));
      }

      if (endpoint && payload.length > 0) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Yükleme hatası");

        showNotification(`${result.count} adet kayıt başarıyla D1 Veritabanına aktarıldı!`);
      }
    } catch (err: any) {
      alert("Toplu yükleme sırasında hata oluştu: " + err.message);
    } finally {
      clearInterval(progressInterval);
      setUploadStatus(prev => ({
        ...prev,
        [type]: { loading: false, progress: 100 }
      }));
    }
  };

  const handleFileSystemUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'lessons' | 'teachers' | 'schools' | 'courses') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        handleActualUpload(type, text);
      }
    };
    reader.readAsText(file);
  };

  // Performance simulation: dynamic counters using states
  const totalUserCount = users.length + 420; // adding constant for realistic scale
  const activeChallengesCount = challenges.filter(c => c.status === 'Aktif').length;
  const pendingApplicationsCount = applications.filter(a => a.status === 'Beklemede').length;

  // Chart data setup using recharts representing 7 days activity (Section 1 and 9)
  const REGISTRATION_CHART_DATA = [
    { label: 'Pzt', Ogrenci: 12, Egitmen: 2, Kurum: 1 },
    { label: 'Sal', Ogrenci: 18, Egitmen: 3, Kurum: 0 },
    { label: 'Çar', Ogrenci: 25, Egitmen: 1, Kurum: 2 },
    { label: 'Per', Ogrenci: 15, Egitmen: 4, Kurum: 1 },
    { label: 'Cum', Ogrenci: 30, Egitmen: 5, Kurum: 3 },
    { label: 'Cmt', Ogrenci: 42, Egitmen: 2, Kurum: 1 },
    { label: 'Paz', Ogrenci: 38, Egitmen: 6, Kurum: 2 },
  ];

  const POPULAR_COURSES = [
    { name: 'React/Next.js 15', enrolls: 480, rating: 4.9 },
    { name: 'Figma UI/UX Systems', enrolls: 320, rating: 4.8 },
    { name: 'Gemini AI Prompt Eng', enrolls: 640, rating: 4.95 },
    { name: 'Kültür ve Sanat Kulvarı', enrolls: 150, rating: 4.7 },
  ];

  // Actions handler
  const handleApproveApplication = (id: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'Onaylandı' } : app
    ));
  };

  const handleRejectApplication = (id: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'Reddedildi' } : app
    ));
  };

  const handleAddSchool = (newSch: Omit<BulkSchool, 'id'>) => {
    const schObj: BulkSchool = {
      ...newSch,
      id: `s-${Date.now()}`
    };
    setSchoolsList(prev => [...prev, schObj]);
    showNotification(`"${newSch.name}" başarıyla sisteme eklendi!`);
  };

  const handleDeleteSchool = (id: string) => {
    setSchoolsList(prev => prev.filter(s => s.id !== id));
    showNotification("Okul kaydı başarıyla silindi.");
  };

  const handleCreateUserSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserTel) return;

    const newUser = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail || `${newUserName.toLowerCase().replace(/\s+/g, '')}@istem-domain.com`,
      tel: newUserTel,
      role: newUserRole,
      regDate: new Date().toISOString().split('T')[0],
      status: 'Aktif'
    };

    setUsers([newUser, ...users]);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserTel('');
    setModalNewUser(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleCreateChallenge = (e: FormEvent) => {
    e.preventDefault();
    if (!newChalTitle) return;

    const newChal = {
      id: `ch-${Date.now()}`,
      title: newChalTitle,
      date: new Date().toISOString().split('T')[0],
      limit: newChalLimit,
      status: 'Aktif',
      category: newChalCat,
      premium: true,
      sponsor: newChalSponsor || 'İSTEM Sponsor'
    };

    setChallenges([newChal, ...challenges]);
    setNewChalTitle('');
    setNewChalSponsor('');
    setModalNewChallenge(false);
  };

  const handleToggleChallengeStatus = (id: string, newStatus: string) => {
    setChallenges(challenges.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ));
  };

  const handleSendBroadcast = (e: FormEvent) => {
    e.preventDefault();
    if (!broadcastingText.trim()) return;
    alert(`📢 Toplu Duyuru Başarıyla Gönderildi:\n\n"${broadcastingText}"\n\nTüm öğrencilere, eğitmenlere ve kurumlara e-posta ve uygulama-içi bildirim olarak kuyruğa alındı.`);
    setBroadcastingText('');
  };

  const handleSendReply = (e: FormEvent) => {
    e.preventDefault();
    if (!supportReplyText.trim() || !selectedTicketId) return;

    setTickets(tickets.map(t => 
      t.id === selectedTicketId ? { ...t, status: 'Cevaplandı', reply: supportReplyText } : t
    ));
    setSupportReplyText('');
    setSelectedTicketId(null);
  };

  // Filter users based on input
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchQuery = u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) || 
                         u.tel.includes(searchUserQuery) ||
                         u.email.toLowerCase().includes(searchUserQuery.toLowerCase());
      const matchRole = userRoleFilter === 'Tümü' || u.role === userRoleFilter;
      return matchQuery && matchRole;
    });
  }, [users, searchUserQuery, userRoleFilter]);

  if (!isAuthenticated) {
    return (
      <div className="bg-[#FAF9F5] min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FF6600]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="bg-white text-zinc-900 rounded-3xl p-8 sm:p-10 max-w-md w-full relative border border-zinc-200 shadow-2xl z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-zinc-950 text-white rounded-2xl flex items-center justify-center font-black font-display text-xl mx-auto mb-4 shadow-lg shadow-zinc-900/20">
              İST
            </div>
            <h2 className="text-2xl font-black font-display text-zinc-900">Sistem Yönetimi</h2>
            <p className="text-xs text-zinc-500 mt-2 font-semibold">Lütfen yetkili yönetici bilgilerinizi giriniz.</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (adminUsername === 'admin' && adminPassword === 'istem123') {
              setIsAuthenticated(true);
              setLoginError('');
            } else {
              setLoginError('Geçersiz kullanıcı adı veya şifre.');
            }
          }} className="space-y-4">
            
            {loginError && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {loginError}
              </div>
            )}

            <div>
              <label className="text-[10px] font-black tracking-widest text-zinc-400 uppercase block mb-1.5 ml-1">Kullanıcı Adı</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#FF6600] focus:border-[#FF6600] text-sm font-semibold transition"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black tracking-widest text-zinc-400 uppercase block mb-1.5 ml-1">Parola</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#FF6600] focus:border-[#FF6600] text-sm font-semibold transition"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#FF6600] hover:bg-[#CC5200] text-white font-black py-3.5 rounded-xl transition shadow-lg shadow-[#FF6600]/20 flex items-center justify-center gap-2 mt-6"
            >
              <span>Sisteme Giriş Yap</span>
              <Shield className="w-4 h-4" />
            </button>

            <button 
              type="button"
              onClick={() => onNavigateTo('home')}
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold py-3.5 rounded-xl transition mt-3 text-sm"
            >
              Ana Sayfaya Dön
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="bg-[#1A1815] text-white py-12 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#FF6600] text-white text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded">SİSTEM YÖNETİCİSİ</span>
              <span className="text-zinc-400 text-xs">• Port 3000 Güvenli Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white flex items-center gap-2.5">
              <Shield className="w-8 h-8 text-[#FF6600]" />
              <span>İSTEM Admin Kontrol Merkezi</span>
            </h1>
            <p className="text-xs text-zinc-405 text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
              İstanbul Eğitim Pazaryeri'nin derslerini, eğitmenlerini, üyelik tip başvurularını, 
              challenge jürilerini ve sertifika sorgulama günlüklerini merkezi olarak denetleyin.
            </p>
          </div>
          <button 
            onClick={() => onNavigateTo('home')}
            className="bg-white/10 hover:bg-[#FF6600] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer self-start md:self-auto border border-white/10"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TOP LEVEL METRICS ROW - REAL TIME DATA */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#FF6600] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 font-bold block uppercase leading-none">TOPLAM KULLANICI</span>
              <span className="text-xl font-bold font-mono text-zinc-900 mt-1 block">{totalUserCount}</span>
              <span className="text-[9px] text-emerald-600 font-bold font-mono">+12 Bugün</span>
            </div>
          </div>

          <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 font-bold block uppercase leading-none">BEKLEYEN BAŞVURU</span>
              <span className="text-xl font-bold font-mono text-zinc-900 mt-1 block">{pendingApplicationsCount} Onay</span>
              <span className="text-[9px] text-amber-655 text-[#FF6600] font-bold">Lütfen inceleyin</span>
            </div>
          </div>

          <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 font-bold block uppercase leading-none">AKTİF CHALLENGE</span>
              <span className="text-xl font-bold font-mono text-zinc-900 mt-1 block">{activeChallengesCount} Arena</span>
              <span className="text-[9px] text-zinc-500 font-bold">Jüri puanlamalı</span>
            </div>
          </div>

          <div className="bg-white border border-zinc-200/60 p-5 rounded-2xl shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-655 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 font-bold block uppercase leading-none">DOĞRULAMA LOGU</span>
              <span className="text-xl font-bold font-mono text-zinc-900 mt-1 block">{certLogs.length} Sorgu</span>
              <span className="text-[9px] text-emerald-600 font-bold font-mono">Sistem aktif</span>
            </div>
          </div>

        </div>

        {/* 11 MENUS MAIN GRID WRAPPER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR TABS - Left list */}
          <div className="lg:col-span-3 space-y-2 bg-white border border-zinc-200/60 p-4 rounded-2xl shadow-2xs">
            <span className="text-[10px] font-black tracking-widest text-[#FF6600] uppercase block mb-3 px-2">YÖNETİM MENÜLERİ</span>
            
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer border ${activeTab === 'dashboard' ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-sm' : 'bg-blue-50/50 text-blue-700 hover:bg-blue-100/80 border-blue-100'}`}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600 shrink-0" />
              <span>1. Genel Bakış (Dashboard)</span>
            </button>

            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer border ${activeTab === 'users' ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-sm' : 'bg-purple-50/50 text-purple-700 hover:bg-purple-100/80 border-purple-100'}`}
            >
              <Users className="w-4 h-4 text-purple-600 shrink-0" />
              <span>2. Kullanıcı Yönetimi (Users)</span>
            </button>

            <button 
              onClick={() => setActiveTab('content')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer border ${activeTab === 'content' ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-sm' : 'bg-amber-50/50 text-amber-700 hover:bg-amber-100/80 border-amber-100'}`}
            >
              <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
              <span>3. İçerik Yönetimi (Content)</span>
            </button>

            <button 
              onClick={() => setActiveTab('applications')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer border ${activeTab === 'applications' ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-sm' : 'bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100/80 border-indigo-100'}`}
            >
              <ClipboardCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="flex-1 flex justify-between items-center">
                <span>4. Başvuru Yönetimi</span>
                {pendingApplicationsCount > 0 && (
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{pendingApplicationsCount}</span>
                )}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('challenge_mgmt')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer border ${activeTab === 'challenge_mgmt' ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-sm' : 'bg-rose-50/50 text-rose-700 hover:bg-rose-100/80 border-rose-100'}`}
            >
              <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
              <span>5. Challenge Özel Yönetimi</span>
            </button>

            <button 
              onClick={() => setActiveTab('certifications')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer border ${activeTab === 'certifications' ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-sm' : 'bg-cyan-50/50 text-cyan-700 hover:bg-cyan-100/80 border-cyan-100'}`}
            >
              <Award className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>6. Sertifika ve Doğrulama</span>
            </button>

            <button 
              onClick={() => setActiveTab('payments')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer border ${activeTab === 'payments' ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-sm' : 'bg-teal-50/50 text-teal-700 hover:bg-teal-100/80 border-teal-100'}`}
            >
              <CreditCard className="w-4 h-4 text-teal-600 shrink-0" />
              <span>7. Ödeme &amp; Finans</span>
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer border ${activeTab === 'settings' ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-sm' : 'bg-zinc-100/70 text-zinc-700 hover:bg-zinc-200/80 border-zinc-200'}`}
            >
              <Settings className="w-4 h-4 text-zinc-650 shrink-0" />
              <span>8. Site Ayarları</span>
            </button>

            <button 
              onClick={() => setActiveTab('reports')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer border ${activeTab === 'reports' ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-sm' : 'bg-lime-50/50 text-lime-800 hover:bg-lime-100/80 border-lime-100'}`}
            >
              <BarChart3 className="w-4 h-4 text-lime-700 shrink-0" />
              <span>9. İstatistik &amp; Raporlar</span>
            </button>

            <button 
              onClick={() => setActiveTab('support')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer border ${activeTab === 'support' ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-sm' : 'bg-fuchsia-50/50 text-fuchsia-700 hover:bg-fuchsia-100/80 border-fuchsia-100'}`}
            >
              <HelpCircle className="w-4 h-4 text-fuchsia-600 shrink-0" />
              <span>10. Yardım &amp; Destek</span>
            </button>

            <button 
              onClick={() => setActiveTab('uicustomize')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer border ${activeTab === 'uicustomize' ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-sm' : 'bg-violet-50/50 text-violet-750 hover:bg-violet-100/80 border-violet-100'}`}
            >
              <Palette className="w-4 h-4 text-violet-600 shrink-0" />
              <span>11. Görünüm Özelleştirme</span>
            </button>

            <button 
              onClick={() => setActiveTab('bulk_import')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer border ${activeTab === 'bulk_import' ? 'bg-[#FF6600] text-white border-[#FF6600]' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 border-emerald-100'}`}
              id="btn-admin-bulk-import"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>12. Toplu Şablon Yükleme</span>
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab('schools_mgmt')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer border ${activeTab === 'schools_mgmt' ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-sm' : 'bg-sky-50 text-sky-800 hover:bg-sky-100/80 border-sky-100'}`}
              id="btn-admin-schools-mgmt"
            >
              <Building className="w-4 h-4 text-sky-600 shrink-0" />
              <span>13. Özel Okul Yönetimi</span>
            </button>

          </div>

          {/* DYNAMIC CONTENT SPACE (Right body) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 1. GENEL BAKIŞ TAB PANEL */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Visual Chart Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Daily registration graph */}
                  <div className="bg-white p-5 border border-zinc-200/60 rounded-2xl shadow-2xs">
                    <span className="text-[10px] text-zinc-400 font-bold block uppercase mb-3">Son 7 Gün Yeni Kayıtlar Grafik</span>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={REGISTRATION_CHART_DATA}>
                          <defs>
                            <linearGradient id="colorOgrenci" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FF6600" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#FF6600" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="label" stroke="#888888" fontSize={11} tickLine={false} />
                          <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                          <Tooltip />
                          <Area type="monotone" dataKey="Ogrenci" stroke="#FF6600" fillOpacity={1} fill="url(#colorOgrenci)" name="Yeni Kayıt" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* System statistics widget summaries */}
                  <div className="bg-white p-5 border border-zinc-200/60 rounded-2xl shadow-2xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-[#FF6600] font-black uppercase tracking-wider block">SİSTEM ÖNEMLİ VERİLERİ</span>
                      <h4 className="text-base font-extrabold font-display text-zinc-950 mt-1">Platform Altyapı Aktifliği</h4>
                      <p className="text-xs text-zinc-500 mt-1">Sertifika ID doğrulayıcı, YouTube API entegrasyonu ve komisyon havuzu aktiftir.</p>
                      
                      <div className="space-y-3 mt-4">
                        <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-100">
                          <span className="text-zinc-550 font-medium">Toplam Başarılı Dersler:</span>
                          <span className="font-mono font-bold text-zinc-900">{courses.length} Ders</span>
                        </div>
                        <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-100">
                          <span className="text-zinc-550 font-medium">Müşteri Destek Biletleri:</span>
                          <span className="font-bold text-[#FF6600]">{tickets.filter(t => t.status === 'Açık').length} Bekleyen</span>
                        </div>
                        <div className="flex justify-between items-center text-xs pb-2">
                          <span className="text-zinc-550 font-medium">Platform Komisyon Oranı:</span>
                          <span className="text-emerald-700 font-extrabold">%0 (Komisyonsuz Model)</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-semibold font-mono">
                      <span>✓ Server Status: Online</span>
                      <span>✓ DB Connections: Active</span>
                    </div>
                  </div>

                </div>

                {/* Son Eklenen Eğitmen & Dersler and Certificate Logs side-by-side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Latest Cert Logs (last 5 inquiries) */}
                  <div className="bg-white p-5 border border-zinc-200/60 rounded-2xl shadow-2xs">
                    <span className="text-[10px] text-zinc-400 font-bold block uppercase mb-3">Sertifika Doğrulama Sorgulama Logu</span>
                    <div className="space-y-3">
                      {certLogs.map(log => (
                        <div key={log.id} className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs flex justify-between items-center">
                          <div>
                            <span className="font-mono font-black text-zinc-900 block">{log.certId}</span>
                            <span className="text-[10px] text-zinc-400 font-medium block mt-0.5">{log.date} • IP {log.ip}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${log.result.includes('✓') ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                            {log.result}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Popular Content in Arena */}
                  <div className="bg-white p-5 border border-zinc-200/60 rounded-2xl shadow-2xs">
                    <span className="text-[10px] text-[#FF6600] font-black uppercase block mb-3">Son Eklenen ve Popüler İçerikler</span>
                    <div className="space-y-3">
                      {POPULAR_COURSES.map((course, idx) => (
                        <div key={idx} className="p-3 bg-[#FAF9F5] rounded-xl border border-zinc-100 text-xs flex justify-between items-center">
                          <div>
                            <span className="font-bold text-zinc-950 block">{course.name}</span>
                            <span className="text-[10px] text-zinc-400 mt-0.5 block">Kayıt: {course.enrolls} Öğrenci</span>
                          </div>
                          <span className="text-amber-500 font-extrabold text-[11px] font-mono">★ {course.rating}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. KULLANICI YÖNETİMİ TAB PANEL */}
            {activeTab === 'users' && (
              <div className="bg-white p-6 border border-zinc-200/60 rounded-2xl shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold font-display text-zinc-950">Kullanıcı Yönetimi</h3>
                    <p className="text-xs text-zinc-500">Öğrencileri, öğretmenleri ve kurumsal temsilcileri yönetin, manuel kullanıcı ekleyin.</p>
                  </div>
                  <button 
                    onClick={() => setModalNewUser(true)}
                    className="bg-[#FF6600] hover:bg-[#CC5200] text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer self-start"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Yeni Kullanıcı Ekle</span>
                  </button>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                    <input 
                      type="text" 
                      placeholder="Adı Soyadı, Telefon veya E-posta İle Ara..."
                      value={searchUserQuery}
                      onChange={(e) => setSearchUserQuery(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#FF6600] font-medium"
                    />
                  </div>
                  <select 
                    value={userRoleFilter} 
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="bg-[#FAF9F5] border border-zinc-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  >
                    <option value="Tümü">Tüm Roller</option>
                    <option value="Bireysel">Öğrenci (Bireysel)</option>
                    <option value="Öğretmen">Eğitmen / Öğretmen</option>
                    <option value="Kurumsal">Kurum Yetkilisi (Firma)</option>
                    <option value="Okul Temsilcisi">Okul Temsilcisi</option>
                    <option value="Kurs Temsilcisi">Kurs Temsilcisi</option>
                  </select>
                </div>

                {/* Users list table layout */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50 font-bold text-zinc-650">
                        <th className="p-3">Kullanıcı / E-posta</th>
                        <th className="p-3">Telefon No</th>
                        <th className="p-3">Rol / Üyelik</th>
                        <th className="p-3">Kayıt Tarihi</th>
                        <th className="p-3">Durum</th>
                        <th className="p-3 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 font-medium">
                      {filteredUsers.slice(0, visibleUsersCount).map(user => (
                        <tr key={user.id} className="hover:bg-zinc-50/50">
                          <td className="p-3">
                            <span className="font-extrabold text-zinc-950 block">{user.name}</span>
                            <span className="text-[10px] text-zinc-400 block">{user.email}</span>
                          </td>
                          <td className="p-3 font-mono text-zinc-700">{user.tel}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border font-sans tracking-wide leading-none ${
                              user.role === 'Bireysel' ? 'bg-blue-50/80 text-blue-700 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50' :
                              user.role === 'Öğretmen' ? 'bg-emerald-50/80 text-emerald-800 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50' :
                              user.role === 'Kurumsal' ? 'bg-purple-50/80 text-purple-700 border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50' :
                              user.role === 'Okul Temsilcisi' ? 'bg-amber-50/80 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50' :
                              'bg-pink-50/80 text-pink-700 border-pink-200/60 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-850/50'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3 text-zinc-500 font-mono">{user.regDate}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-black uppercase ${user.status === 'Aktif' ? 'text-emerald-700' : 'text-amber-700'}`}>
                              ● {user.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            <button 
                              onClick={() => {
                                alert(`🔒 ${user.name} için şifre sıfırlama talebi tetiklendi. SMS geçici şifresi gönderildi.`);
                              }} 
                              className="text-[10px] bg-zinc-105 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold px-2 py-1 rounded transition cursor-pointer font-sans"
                            >
                              Şifre Sıfırla
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-[10px] bg-red-50 hover:bg-red-100 text-red-700 font-bold p-1 rounded transition cursor-pointer inline-flex items-center"
                              title="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-zinc-400">
                            Arama kriterlerine uygun kullanıcı bulunamadı.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Load More Trigger for user search */}
                {filteredUsers.length > visibleUsersCount && (
                  <div className="pt-4 pb-2 border-t border-zinc-100 flex flex-col items-center justify-center gap-1.5">
                    <button 
                      onClick={() => setVisibleUsersCount(prev => prev + 10)}
                      className="bg-zinc-900 text-white hover:bg-[#FF6600] text-[11px] font-extrabold tracking-wider uppercase px-4 py-2 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                      <span>Daha Fazla Sonuç Getir ({filteredUsers.length - visibleUsersCount} Kişi Gizli)</span>
                    </button>
                    <span className="text-[10px] text-zinc-450 text-zinc-400 font-mono">10 / {filteredUsers.length} kişi gösteriliyor • Arama tüm listede etkindir</span>
                  </div>
                )}

                {/* MODAL WINDOW: Create User Form */}
                {modalNewUser && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleCreateUserSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full border border-zinc-200/80 shadow-xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                        <h4 className="text-sm font-black text-zinc-950">Manuel Yeni Kullanıcı Ekle</h4>
                        <button type="button" onClick={() => setModalNewUser(false)} className="text-zinc-400 hover:text-zinc-950">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-zinc-400 mb-1">Adı Soyadı *</label>
                          <input 
                            type="text" required placeholder="Ör. Bülent Ersoy"
                            value={newUserName} onChange={(e) => setNewUserName(e.target.value)}
                            className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-3 py-2 outline-none font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-zinc-400 mb-1">E-posta Adresi (İsteğe Bağlı)</label>
                          <input 
                            type="email" placeholder="bulent@istem.com"
                            value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)}
                            className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-3 py-2 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-zinc-400 mb-1">Telefon No *</label>
                          <input 
                            type="text" required placeholder="5XX XXX XX XX"
                            value={newUserTel} onChange={(e) => setNewUserTel(e.target.value)}
                            className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-3 py-2 outline-none font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-zinc-400 mb-1">Rol ve Yetkilendirme Tipi *</label>
                          <select 
                            value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}
                            className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-3 py-2 outline-none text-xs font-bold"
                          >
                            <option value="Bireysel">Öğrenci (Bireysel)</option>
                            <option value="Öğretmen">Eğitmen / Öğretmen</option>
                            <option value="Kurumsal">Kurum Yetkilisi (Firma)</option>
                            <option value="Okul Temsilcisi">Okul Temsilcisi</option>
                            <option value="Kurs Temsilcisi">Kurs Temsilcisi</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => setModalNewUser(false)} className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition">
                          İptal
                        </button>
                        <button type="submit" className="flex-1 py-2.5 bg-[#FF6600] hover:bg-[#CC5200] text-white text-xs font-bold rounded-xl transition">
                          Ekle (Sistem Kaydı)
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            )}

            {/* 3. İÇERİK YÖNETİMİ TAB PANEL */}
            {activeTab === 'content' && (
              <AdminContentTab />
            )}

            {/* 4. BAŞVURU YÖNETİMİ TAB PANEL */}
            {activeTab === 'applications' && (
              <ApplicationsTab 
                applications={applications} 
                onApprove={handleApproveApplication} 
                onReject={handleRejectApplication} 
              />
            )}

            {/* 5. CHALLENGE ÖZEL YÖNETİMİ TAB PANEL */}
            {activeTab === 'challenge_mgmt' && (() => {
              const filteredChallengesList = challenges.filter(c => 
                c.title.toLowerCase().includes(searchChallengeQuery.toLowerCase()) ||
                c.category.toLowerCase().includes(searchChallengeQuery.toLowerCase()) ||
                c.sponsor.toLowerCase().includes(searchChallengeQuery.toLowerCase())
              );

              return (
                <div className="bg-white p-6 border border-zinc-200/60 rounded-2xl shadow-2xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-base font-extrabold font-display text-zinc-950">Challenge Özel Yönetimi (Challenge Arena)</h3>
                      <p className="text-xs text-zinc-500 font-medium">Mevcut aktif ve taslak turnuvaları listeleyin, jüri üyelerini ve ödülleri atayın.</p>
                    </div>
                    <button 
                      onClick={() => setModalNewChallenge(true)}
                      className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer self-start shrink-0"
                    >
                      <Plus className="w-4 h-4 text-[#FF6600]" />
                      <span>Yeni Challenge Başlat</span>
                    </button>
                  </div>

                  {/* Search box working similarly to user/membership search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                    <input 
                      type="text" 
                      placeholder="Challenge Başlığı, Kategori veya Sponsor İle Ara..."
                      value={searchChallengeQuery}
                      onChange={(e) => setSearchChallengeQuery(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#FF6600] font-medium"
                    />
                  </div>

                  {/* Smaller compact cards grid (4 columns layout) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredChallengesList.map(c => (
                      <div key={c.id} className="p-3 bg-[#FAF9F5] border border-zinc-150 rounded-xl flex flex-col justify-between gap-3 hover:shadow-xs transition duration-150 text-xs">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start gap-1">
                            <span className="bg-[#FF6600]/10 text-[#FF6600] text-[8px] font-black px-2 py-0.5 rounded uppercase font-sans">
                              {c.category}
                            </span>
                            <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded ${
                              c.status === 'Aktif' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100/55' :
                              c.status === 'Draft' ? 'bg-zinc-100 text-zinc-650' : 'bg-indigo-50 text-indigo-700'
                            }`}>
                              {c.status}
                            </span>
                          </div>
                          
                          <h4 className="text-[11px] font-extrabold text-zinc-900 leading-snug line-clamp-2 min-h-[32px]">{c.title}</h4>
                          
                          <div className="space-y-0.5 text-[9.5px] text-zinc-455 text-zinc-400 font-medium">
                            <div>Sponsor: <span className="font-bold text-zinc-600">{c.sponsor}</span></div>
                            <div>Başlangıç: <span className="text-zinc-600 font-mono">{c.date}</span></div>
                            <div>Limit: <span className="text-zinc-650 font-sans">{c.limit}</span></div>
                          </div>
                        </div>

                        {/* Actions block */}
                        <div className="pt-2 border-t border-zinc-150 flex flex-col gap-1 text-[10px]">
                          <button 
                            onClick={() => {
                              const score = prompt('Jüri Kör Değerlendirme Bölümü:\n\nKatılımacı Zeynep Kaya için puan giriniz (0-100):', '85');
                              if (score) alert(`✓ Jüri Puanı ${score}/100 olarak kaydedildi. Canlı liderlik tablosu güncellendi.`);
                            }}
                            className="w-full text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1 rounded font-bold transition cursor-pointer"
                          >
                            ⚖ Jüri Kör Değerlendirmesi
                          </button>
                          
                          <div className="flex gap-1.5 mt-0.5">
                            {c.status !== 'Completed' && (
                              <button 
                                onClick={() => handleToggleChallengeStatus(c.id, 'Completed')}
                                className="flex-1 text-center bg-emerald-500 hover:bg-emerald-600 text-white py-1 rounded font-black transition cursor-pointer"
                              >
                                Tamamla
                              </button>
                            )}
                            {c.status === 'Draft' && (
                              <button 
                                onClick={() => handleToggleChallengeStatus(c.id, 'Aktif')}
                                className="flex-1 text-center bg-zinc-950 hover:bg-zinc-850 text-white py-1 rounded font-black transition cursor-pointer"
                              >
                                Yayına Al
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredChallengesList.length === 0 && (
                      <div className="col-span-full py-8 text-center text-zinc-400 text-xs font-medium">
                        Arama kriterlerine uygun challenge bulunamadı.
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

                {/* MODAL WINDOW: Create Challenge Form */}
                {modalNewChallenge && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleCreateChallenge} className="bg-white rounded-3xl p-6 max-w-md w-full border border-zinc-200/80 shadow-xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                        <h4 className="text-sm font-black text-zinc-950">Yeni Challenge Oluştur</h4>
                        <button type="button" onClick={() => setModalNewChallenge(false)} className="text-zinc-400 hover:text-zinc-950">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-zinc-400 mb-1">Challenge Başlığı *</label>
                          <input 
                            type="text" required placeholder="Ör. Strava ile Koşu Maratonu veya Github Commits"
                            value={newChalTitle} onChange={(e) => setNewChalTitle(e.target.value)}
                            className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-3 py-2 outline-none font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-zinc-400 mb-1">Kategori</label>
                          <select 
                            value={newChalCat} onChange={(e) => setNewChalCat(e.target.value)}
                            className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-3 py-2 outline-none font-bold"
                          >
                            <option value="Yazılım">Yazılım</option>
                            <option value="Tasarım">Tasarım / Figma</option>
                            <option value="Yapay Zeka">Yapay Zeka / AI</option>
                            <option value="Bilişim">Genel Bilişim</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-zinc-400 mb-1">Sponsor / Ortak Firma Name</label>
                          <input 
                            type="text" placeholder="Ör. Google Cloud, Vercel Turkey"
                            value={newChalSponsor} onChange={(e) => setNewChalSponsor(e.target.value)}
                            className="w-full bg-[#FAF9F5] border border-[#CCCCCC] rounded-xl px-3 py-2 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-zinc-400 mb-1">Katılım Sınırı</label>
                          <input 
                            type="text" placeholder="Örn: 200 Katılımcı"
                            value={newChalLimit} onChange={(e) => setNewChalLimit(e.target.value)}
                            className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-3 py-2 outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => setModalNewChallenge(false)} className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-805 text-xs font-bold rounded-xl transition">
                          İptal
                        </button>
                        <button type="submit" className="flex-1 py-2.5 bg-[#FF6600] hover:bg-[#CC5200] text-white text-xs font-bold rounded-xl transition">
                          Challenge Başlat (Canlı)
                        </button>
                      </div>
                    </form>
                  </div>
                )}

            {/* 6. SERTİFİKA VE DOĞRULAMA TAB PANEL */}
            {activeTab === 'certifications' && (() => {
              const filteredCertLogs = certLogs.filter(log => 
                log.certId.toLowerCase().includes(searchCertQuery.toLowerCase()) ||
                log.result.toLowerCase().includes(searchCertQuery.toLowerCase()) ||
                log.ip.toLowerCase().includes(searchCertQuery.toLowerCase())
              );

              return (
                <div className="bg-white p-6 border border-zinc-200/60 rounded-2xl shadow-2xs space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold font-display text-zinc-950">Sertifika ve Doğrulama Yapılandırıcı</h3>
                    <p className="text-xs text-zinc-500 font-medium">Sorgulama log'larını izleyin, manuel olarak sisteme doğrulama kodu ekleyerek yeni sertifika atamaları oluşturun.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-zinc-150">
                    <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl space-y-2">
                      <span className="text-[10px] text-[#FF6600] font-black uppercase tracking-wider block">Manuel Sertifika Atama Paneli</span>
                      <p className="text-[11px] text-zinc-650 leading-relaxed">Başarı puanını, mezuniyet tarihini ve öğrencinin bilgilerini girerek anında QR onaylı sertifika şablonu üretin.</p>
                      <button 
                        onClick={() => {
                          const sName = prompt('Öğrenci Adı Soyadı:');
                          const sCode = prompt('Sertifika ID Formatı (Örn: NEXT-1122-88):');
                          if (sName && sCode) {
                            alert(`✓ Başarıyla ${sName} adlı öğrenciye ${sCode} ID'li doğrulama sertifikası üretildi.`);
                          }
                        }}
                        className="bg-[#FF6600] hover:bg-[#CC5200] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition mt-1 cursor-pointer"
                      >
                        Yeni Sertifika Şablonu Üret
                      </button>
                    </div>

                    <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
                      <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Doğrulama Ayarları</span>
                      <p className="text-[11px] text-zinc-500">Sertifika sorgulamaları blockchain tabanlı veya standart dijital imza şeklinde mühürlenir.</p>
                      <div className="text-[11px] text-zinc-805 font-semibold space-y-1 text-zinc-700">
                        <div>• İmza Formatı: QR Entegre Dijital Mühür</div>
                        <div>• Algoritma: SHA-256 Şifreli Doğrulama</div>
                      </div>
                    </div>
                  </div>

                  {/* Query Log list */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                      <span className="text-xs font-black text-zinc-750 font-display">Sorgulama Günlük Detayı • {filteredCertLogs.length} Log</span>
                      
                      {/* Search box working similarly to user membership query */}
                      <div className="relative flex-1 sm:max-w-xs">
                        <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-400" />
                        <input 
                          type="text" 
                          placeholder="Sertifika ID, Sonuç veya IP ile ara..."
                          value={searchCertQuery}
                          onChange={(e) => setSearchCertQuery(e.target.value)}
                          className="w-full bg-[#FAF9F5] border border-zinc-150 rounded-lg pl-7 pr-3 py-1 text-[11px] focus:outline-none focus:border-[#FF6600] font-medium"
                        />
                      </div>
                    </div>

                    {/* Smaller compact cards grid in 4 columns row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {filteredCertLogs.map(log => (
                        <div key={log.id} className="p-3 bg-[#FAF9F5] border border-zinc-150 rounded-xl flex flex-col justify-between gap-2.5 hover:shadow-xs transition">
                          <div className="space-y-1">
                            <span className="font-mono font-black text-xs text-zinc-900 block truncate">{log.certId}</span>
                            <div className="text-[9.5px] text-zinc-450 leading-tight space-y-0.5 text-zinc-500">
                              <div>IP: <span className="font-mono">{log.ip}</span></div>
                              <div>Tarih: <span className="font-mono">{log.date}</span></div>
                            </div>
                          </div>
                          <span className={`text-[9.5px] font-black text-center py-1 rounded block ${
                            log.result.includes('Doğrulandı') ? 'text-emerald-800 bg-emerald-500/10' : 'text-amber-800 bg-amber-500/10'
                          }`}>
                            {log.result}
                          </span>
                        </div>
                      ))}
                      {filteredCertLogs.length === 0 && (
                        <div className="col-span-full py-8 text-center text-zinc-400 text-xs font-medium">
                          Arama kriterlerine uygun doğrulama günlüğü bulunamadı.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 7. ÖDEME & FİNANS TAB PANEL */}
            {activeTab === 'payments' && (() => {
              const filteredFinances = finances.filter(tx => 
                tx.student.toLowerCase().includes(searchPaymentQuery.toLowerCase()) ||
                tx.course.toLowerCase().includes(searchPaymentQuery.toLowerCase()) ||
                tx.id.toLowerCase().includes(searchPaymentQuery.toLowerCase())
              );

              return (
                <div className="bg-white p-6 border border-zinc-200/60 rounded-2xl shadow-2xs space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold font-display text-zinc-950">Ödeme &amp; Finans Yönetimi</h3>
                    <p className="text-xs text-zinc-500 font-medium">Platform üzerindeki finansal işlem akışlarını, eğitmenlere yapılan ödemeleri (commission hold) ve indirim kuponlarını yönetin.</p>
                  </div>

                  {/* Highlight Commission Settings info for İSTEM */}
                  <div className="p-4 bg-zinc-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-[#FF6600] font-black uppercase tracking-widest block">KOMİSYON YAPILANDIRMASI</span>
                      <h4 className="text-sm font-black text-white mt-1">Platform Hizmet Payı Oranı</h4>
                      <p className="text-[11px] text-zinc-400">Şu anda İSTEM bağımsız pazarında komisyon sıfır (%0) olarak uygulanmakta, tüm gelir eğitmene gitmektedir.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black font-mono text-emerald-500">%0</span>
                      <button 
                        onClick={() => {
                          const rate = prompt('Yeni komisyon oranını giriniz (%):', '0');
                          if (rate) {
                            setCommissionRate(Number(rate));
                            alert(`Platform komisyon oranı %${rate} olarak ayarlandı.`);
                          }
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer"
                      >
                        Oranı Değiştir
                      </button>
                    </div>
                  </div>

                  {/* Sub-menu features list of transactions */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                      <span className="text-xs font-black text-zinc-750 font-display">Mevcut Gelir Hareketleri ({filteredFinances.length} İşlem)</span>
                      
                      {/* Search box working similarly to user membership query */}
                      <div className="relative flex-1 sm:max-w-xs">
                        <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-400" />
                        <input 
                          type="text" 
                          placeholder="Öğrenci, ders adı veya sipariş ID ile ara..."
                          value={searchPaymentQuery}
                          onChange={(e) => setSearchPaymentQuery(e.target.value)}
                          className="w-full bg-[#FAF9F5] border border-zinc-150 rounded-lg pl-7 pr-3 py-1 text-[11px] focus:outline-none focus:border-[#FF6600] font-medium"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-zinc-150 rounded-xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-zinc-50 border-b border-zinc-150 font-bold text-zinc-650">
                            <th className="p-3">Sipariş / Öğrenci</th>
                            <th className="p-3">Ders</th>
                            <th className="p-3">Tarih</th>
                            <th className="p-3 text-right">Net Tutar</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 font-semibold text-zinc-800">
                          {filteredFinances.map(tx => (
                            <tr key={tx.id} className="hover:bg-zinc-50">
                              <td className="p-3">
                                <span className="block text-zinc-900 font-extrabold">{tx.student}</span>
                                <span className="text-[10px] text-zinc-400 block font-mono">{tx.id}</span>
                              </td>
                              <td className="p-3 text-zinc-600 truncate max-w-[200px]">{tx.course}</td>
                              <td className="p-3 text-zinc-500 font-mono">{tx.date}</td>
                              <td className="p-3 text-right text-emerald-800 font-mono text-xs">₺{tx.amount.toLocaleString('tr-TR')}</td>
                            </tr>
                          ))}
                          {filteredFinances.length === 0 && (
                            <tr>
                              <td colSpan={4} className="p-8 text-center text-zinc-455 text-zinc-400 text-xs font-medium">
                                Arama kriterlerine uygun ödeme kaydı bulunamadı.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 8. SİTE AYARLARI TAB PANEL */}
            {activeTab === 'settings' && (
              <div className="bg-white p-6 border border-zinc-200/60 rounded-2xl shadow-2xs space-y-6">
                <div>
                  <h3 className="text-base font-extrabold font-display text-zinc-950">Site Genel Ayarları</h3>
                  <p className="text-xs text-zinc-500">Sözleşmeleri, API entegrasyonlarını, YouTube ve diğer harici veri bağlantı anahtarlarını yapılandırın.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Platform İsmi</label>
                    <input 
                      type="text" 
                      value={siteName} 
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-3 py-2.5 outline-none text-zinc-[900]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Logo Görsel Linki</label>
                    <input 
                      type="text" 
                      value={logoUrl} 
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-3 py-2.5 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">SMTP Sunucu Adresi (E-posta)</label>
                    <input 
                      type="text" 
                      value={smtpServer} 
                      onChange={(e) => setSmtpServer(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-3 py-2.5 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">YouTube Entegrasyon API Anahtarı</label>
                    <input 
                      type="text" 
                      value={ytApiKey} 
                      onChange={(e) => setYtApiKey(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-3 py-2.5 outline-none font-mono text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">WhatsApp İrtibat Numarası</label>
                    <input 
                      type="text" 
                      value={whatsappNumber} 
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-3 py-2.5 outline-none font-sans text-zinc-900"
                      placeholder="Ör. 905551234567"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Bizi Arayın Telefon Numarası</label>
                    <input 
                      type="text" 
                      value={hotlineNumber} 
                      onChange={(e) => setHotlineNumber(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-3 py-2.5 outline-none font-sans text-zinc-900"
                      placeholder="Ör. 902129999999"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">GitHub Client OAuth Secret</label>
                    <input 
                      type="password" 
                      value={ghClientSecret} 
                      onChange={(e) => setGhClientSecret(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-3 py-2.5 outline-none font-mono text-zinc-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-150 flex justify-end">
                  <button 
                    onClick={() => {
                      localStorage.setItem('whatsapp_number', whatsappNumber);
                      localStorage.setItem('hotline_number', hotlineNumber);
                      alert('✓ Site ayarları ve entegrasyon anahtarları başarıyla veritabanına kaydedildi.');
                    }}
                    className="bg-[#FF6600] hover:bg-[#CC5200] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Değişiklikleri Kaydet</span>
                  </button>
                </div>
              </div>
            )}

            {/* 9. İSTATİSTİK & RAPORLAR TAB PANEL */}
            {activeTab === 'reports' && (
              <ReportsTab />
            )}

            {/* 10. YARDIM & DESTEK TAB PANEL */}
            {activeTab === 'support' && (
              <div className="bg-white p-6 border border-zinc-200/60 rounded-2xl shadow-2xs space-y-6">
                
                {/* Send Bulk E-mail / Push form */}
                <div className="pb-6 border-b border-zinc-150">
                  <h3 className="text-base font-extrabold font-display text-zinc-950 mb-1">Toplu Duyuru &amp; Bildirim Gönderimi</h3>
                  <p className="text-xs text-zinc-500 mb-3">Tüm kayıtlı kullanıcılara e-posta, SMS ve uygulama-içi in-app modal bildirim göndererek gelişmeleri haber verin.</p>
                  
                  <form onSubmit={handleSendBroadcast} className="flex gap-2 text-xs">
                    <input 
                      type="text" 
                      required
                      placeholder="Ör. İSTEM Challenge Liderlik Tablosu Güncellendi! Detaylar Arenada..."
                      value={broadcastingText}
                      onChange={(e) => setBroadcastingText(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-[#FF6600]"
                    />
                    <button 
                      type="submit"
                      className="bg-[#FF6600] hover:bg-[#CC5200] text-white text-xs font-bold px-4 rounded-xl transition shrink-0 cursor-pointer"
                    >
                      Duyuru Yayınla
                    </button>
                  </form>
                </div>

                {/* Support Tickets list */}
                <div className="space-y-4">
                  <h3 className="text-base font-extrabold font-display text-zinc-950">Kullanıcı Destek Talepleri</h3>
                  <div className="space-y-4">
                    {tickets.map(ticket => (
                      <div key={ticket.id} className="p-4 bg-[#FAF9F5] border border-zinc-150 rounded-2xl text-xs space-y-3">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <span className="font-extrabold text-zinc-950 block">{ticket.name} • <span className="text-zinc-400">{ticket.topic}</span></span>
                            <p className="text-zinc-650 mt-1">{ticket.text}</p>
                          </div>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            ticket.status === 'Açık' ? 'bg-amber-50 text-amber-800' : 'bg-zinc-120 text-zinc-500 bg-zinc-100'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>

                        {ticket.reply && (
                          <div className="p-3 bg-white border border-zinc-100 rounded-xl text-zinc-550 leading-relaxed font-mono mt-2">
                            <span className="font-bold text-[#FF6600] block text-[10px] uppercase font-sans mb-1">✓ Admin Cevabı:</span>
                            {ticket.reply}
                          </div>
                        )}

                        {ticket.status === 'Açık' && (
                          <div className="pt-2 border-t border-zinc-150/60">
                            {selectedTicketId === ticket.id ? (
                              <form onSubmit={handleSendReply} className="flex gap-2">
                                <input 
                                  type="text" 
                                  required
                                  placeholder="Cevabınızı buraya yazın..."
                                  value={supportReplyText}
                                  onChange={(e) => setSupportReplyText(e.target.value)}
                                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-1 text-xs outline-none"
                                />
                                <button type="submit" className="bg-[#FF6600] text-white font-bold px-3 py-1.5 rounded-xl text-[11px]">Gönder</button>
                                <button type="button" onClick={() => setSelectedTicketId(null)} className="text-zinc-400 font-bold px-2 py-1">Vazgeç</button>
                              </form>
                            ) : (
                              <button 
                                onClick={() => setSelectedTicketId(ticket.id)}
                                className="text-[10px] bg-zinc-950 hover:bg-zinc-850 text-white font-bold px-3 py-1 rounded transition cursor-pointer"
                              >
                                Talebi Cevapla
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 11. GÖRÜNÜM ÖZELLEŞTİRME TAB PANEL */}
            {activeTab === 'uicustomize' && (
              <div className="bg-white p-6 border border-zinc-200/60 rounded-2xl shadow-2xs space-y-6">
                <div>
                  <h3 className="text-base font-extrabold font-display text-zinc-950">Görünüm Özelleştirme &amp; UI Modifikasyonu</h3>
                  <p className="text-xs text-zinc-500">Site renk paletini fırçalayın, ana sayfadaki modül görünürlük sıralarını dinamik olarak ayarlayın.</p>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase">Renk Teması ve Buton Stilleri</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-zinc-800">
                    <button 
                      onClick={() => { setActiveTheme('orange'); alert('🎨 Sıcak Turuncu teması aktif edildi.'); }}
                      className={`p-3 bg-white border rounded-xl text-center font-bold hover:bg-zinc-50 cursor-pointer transition ${
                        activeTheme === 'orange' ? 'border-[#FF6600] ring-2 ring-[#FF6600]/40' : 'border-zinc-200'
                      }`}
                    >
                      <span className="w-3 h-3 bg-[#FF6600] rounded-full inline-block mr-1.5 align-middle" />
                      Sıcak Turuncu
                    </button>
                    <button 
                      onClick={() => { setActiveTheme('carbon'); alert('🎨 Asil Karbon teması aktif edildi.'); }}
                      className={`p-3 bg-white border rounded-xl text-center font-bold hover:bg-zinc-50 cursor-pointer transition ${
                        activeTheme === 'carbon' ? 'border-zinc-950 ring-2 ring-zinc-950/20' : 'border-zinc-200'
                      }`}
                    >
                      <span className="w-3 h-3 bg-zinc-950 rounded-full inline-block mr-1.5 align-middle" />
                      Asil Karbon
                    </button>
                    <button 
                      onClick={() => { setActiveTheme('green'); alert('🎨 Doğa Yeşili teması aktif edildi.'); }}
                      className={`p-3 bg-white border rounded-xl text-center font-bold hover:bg-zinc-50 cursor-pointer transition ${
                        activeTheme === 'green' ? 'border-emerald-700 ring-2 ring-emerald-700/20' : 'border-zinc-200'
                      }`}
                    >
                      <span className="w-3 h-3 bg-emerald-700 rounded-full inline-block mr-1.5 align-middle" />
                      Doğa Yeşili
                    </button>
                    <button 
                      onClick={() => { setActiveTheme('purple'); alert('🎨 Lavanta Moru teması aktif edildi.'); }}
                      className={`p-3 bg-white border rounded-xl text-center font-bold hover:bg-zinc-50 cursor-pointer transition ${
                        activeTheme === 'purple' ? 'border-violet-750 border-violet-700 ring-2 ring-violet-700/20' : 'border-zinc-200'
                      }`}
                    >
                      <span className="w-3 h-3 bg-violet-700 rounded-full inline-block mr-1.5 align-middle" />
                      Lavanta Moru
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-150 space-y-3">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase">Ana Sayfada Yayınlanacak Modüller</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <label className="flex items-center gap-2.5 p-3 bg-[#FAF9F5] border border-zinc-150 rounded-xl cursor-pointer transition hover:bg-zinc-50">
                      <input 
                        type="checkbox" 
                        checked={showHeroBannerSetting} 
                        onChange={(e) => setShowHeroBannerSetting(e.target.checked)} 
                        className="rounded border-zinc-350 text-[#FF6600] focus:ring-[#FF6600] cursor-pointer" 
                      />
                      <span>Kahraman Giriş Modülü (Hero Banner)</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-3 bg-[#FAF9F5] border border-zinc-150 rounded-xl cursor-pointer transition hover:bg-zinc-50">
                      <input 
                        type="checkbox" 
                        checked={showSearchBarsSetting} 
                        onChange={(e) => setShowSearchBarsSetting(e.target.checked)} 
                        className="rounded border-zinc-350 text-[#FF6600] focus:ring-[#FF6600] cursor-pointer" 
                      />
                      <span>Özel Okul / Kurs Seçim Arama Çubukları</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-3 bg-[#FAF9F5] border border-zinc-150 rounded-xl cursor-pointer transition hover:bg-zinc-50">
                      <input 
                        type="checkbox" 
                        checked={showChallengeSetting} 
                        onChange={(e) => setShowChallengeSetting(e.target.checked)} 
                        className="rounded border-zinc-350 text-[#FF6600] focus:ring-[#FF6600] cursor-pointer" 
                      />
                      <span>Challenge Arena Sıralaması Tablosu</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-3 bg-[#FAF9F5] border border-zinc-150 rounded-xl cursor-pointer transition hover:bg-zinc-50">
                      <input 
                        type="checkbox" 
                        checked={showCertificateSetting} 
                        onChange={(e) => setShowCertificateSetting(e.target.checked)} 
                        className="rounded border-zinc-350 text-[#FF6600] focus:ring-[#FF6600] cursor-pointer" 
                      />
                      <span>Sertifika Sorgulama Form Paneli</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 12. TOPLU ŞABLON YÜKLEME (BULK IMPORT) TAB PANEL */}
            {activeTab === 'bulk_import' && (
              <div className="space-y-6">
                
                {/* Notification toast if active */}
                {successMessage && (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl font-bold text-xs flex items-center gap-2 animate-bounce">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <div className="bg-[#1A1815] text-white p-6 rounded-2xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-500 text-white font-black text-[9px] px-2 py-0.5 rounded-lg uppercase tracking-wider">PREMIUM SEEDER</span>
                      <span className="text-zinc-400 text-xs font-mono">• Excel &amp; UTF-8 CSV Düzeni</span>
                    </div>
                    <h3 className="text-lg font-extrabold font-display">12. Excel Toplu Müfredat &amp; Kurum Veri Seeding Paneli</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                      Müfredat derslerini, öğretmen kadrosunu, özel okul yerleşkelerini ve takviye kurslarını Excel veya CSV şablonlarıyla sisteme saniyeler içinde aktarın.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-[#2D2A26] border border-zinc-700 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-zinc-400 font-bold block uppercase leading-none">TOPLAM MATRİS VERİ</span>
                      <span className="text-lg font-mono font-bold text-white mt-1 block">
                        {lessonsList.length + teachersList.length + schoolsList.length + coursesList.length} Satır
                      </span>
                    </div>
                  </div>
                </div>

                {/* BENTO GRID: DOWNLOAD & IMPORT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">

                  {/* CARD 1: TOPLU DERS */}
                  <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-zinc-300 transition-all group relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-20 h-24 bg-gradient-to-br from-indigo-50/20 to-transparent rounded-bl-full pointer-events-none" />
                    <div className="space-y-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 transition shadow-xs">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-zinc-900 group-hover:text-indigo-600 transition">Toplu Ders Ekleme</h4>
                        <p className="text-[9px] text-zinc-400 font-bold font-mono mt-0.5">Dosya: toplu-ders.csv</p>
                        <p className="text-[11px] text-zinc-600 mt-1.5 leading-relaxed">
                          Müfredata ait ders kodları, haftalık saatler ve kategorileri topluca yükleyin veya simüle edin.
                        </p>
                      </div>

                      <div className="bg-[#FAF9F5] p-2 rounded-lg border border-zinc-150 space-y-1 text-[9px] text-zinc-500 font-semibold font-mono">
                        <span className="text-zinc-400 uppercase tracking-wider block font-bold text-[8px] mb-0.5">Mecbur Kolonlar</span>
                        <div>Ders Kodu;Ders Adı;Haftalık Saat;Kategori;Zorunlu/Seçmeli</div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      {uploadStatus.lessons.loading ? (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-black text-zinc-500 font-mono">
                            <span className="animate-pulse text-indigo-600">Yükleniyor...</span>
                            <span>%{uploadStatus.lessons.progress}</span>
                          </div>
                          <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-1 rounded-full transition-all duration-300" style={{ width: `${uploadStatus.lessons.progress}%` }} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDownloadTemplate('toplu-ders.csv')}
                            className="w-full bg-[#FAF9F5] hover:bg-zinc-100 text-zinc-800 border border-zinc-250 font-black text-[10px] py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            Şablon İndir
                          </button>

                          <div className="grid grid-cols-2 gap-1.5">
                            <label className="bg-indigo-600 hover:bg-indigo-705 bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-[10px] py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 shadow-sm text-center">
                              <Upload className="w-3 h-3 shrink-0" />
                              Dosya Seç
                              <input
                                type="file"
                                accept=".csv,.xlsx,.xls,.txt"
                                onChange={(e) => handleFileSystemUpload(e, 'lessons')}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleSimulateUpload('lessons')}
                              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-extrabold text-[10px] py-2 rounded-lg transition cursor-pointer text-center text-[10px]"
                            >
                              Simüle Et
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* CARD 2: TOPLU ÖĞRETMEN */}
                  <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-zinc-300 transition-all group relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-20 h-24 bg-gradient-to-br from-emerald-50/20 to-transparent rounded-bl-full pointer-events-none" />
                    <div className="space-y-4">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 transition shadow-xs">
                        <Users className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-zinc-900 group-hover:text-emerald-600 transition">Toplu Öğretmen Kadrosu</h4>
                        <p className="text-[9px] text-zinc-400 font-bold font-mono mt-0.5">Dosya: toplu-ogretmen.csv</p>
                        <p className="text-[11px] text-zinc-600 mt-1.5 leading-relaxed">
                          Eğitmen kadronuzun branşlarını, telefonlarını, e-postalarını ve şubelerini topluca sisteme yükleyin.
                        </p>
                      </div>

                      <div className="bg-[#FAF9F5] p-2 rounded-lg border border-zinc-150 space-y-1 text-[9px] text-zinc-500 font-semibold font-mono">
                        <span className="text-zinc-400 uppercase tracking-wider block font-bold text-[8px] mb-0.5">Mecbur Kolonlar</span>
                        <div>Ad Soyad;Branş;Telefon;E-posta;Şube</div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      {uploadStatus.teachers.loading ? (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-black text-zinc-500 font-mono">
                            <span className="animate-pulse text-emerald-600">Yükleniyor...</span>
                            <span>%{uploadStatus.teachers.progress}</span>
                          </div>
                          <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-1 rounded-full transition-all duration-300" style={{ width: `${uploadStatus.teachers.progress}%` }} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDownloadTemplate('toplu-ogretmen.csv')}
                            className="w-full bg-[#FAF9F5] hover:bg-zinc-100 text-zinc-800 border border-zinc-250 font-black text-[10px] py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            Şablon İndir
                          </button>

                          <div className="grid grid-cols-2 gap-1.5">
                            <label className="bg-emerald-650 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 shadow-sm text-center">
                              <Upload className="w-3 h-3 shrink-0" />
                              Dosya Seç
                              <input
                                type="file"
                                accept=".csv,.xlsx,.xls,.txt"
                                onChange={(e) => handleFileSystemUpload(e, 'teachers')}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleSimulateUpload('teachers')}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-[10px] py-2 rounded-lg transition cursor-pointer text-center text-[10px]"
                            >
                              Simüle Et
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* CARD 3: TOPLU OKUL */}
                  <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-zinc-300 transition-all group relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-20 h-24 bg-gradient-to-br from-sky-50/20 to-transparent rounded-bl-full pointer-events-none" />
                    <div className="space-y-4">
                      <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center border border-sky-100 transition shadow-xs">
                        <Building className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-zinc-900 group-hover:text-sky-600 transition">Toplu Özel Okul Ekleme</h4>
                        <p className="text-[9px] text-zinc-400 font-bold font-mono mt-0.5">Dosya: toplu-okul.csv</p>
                        <p className="text-[11px] text-zinc-600 mt-1.5 leading-relaxed">
                          Sisteme entegre edilecek kolej, fen lisesi ve yabancı okulların temel kapasite ve lokasyonlarını yükleyin.
                        </p>
                      </div>

                      <div className="bg-[#FAF9F5] p-2 rounded-lg border border-zinc-150 space-y-1 text-[9px] text-zinc-500 font-semibold font-mono">
                        <span className="text-zinc-400 uppercase tracking-wider block font-bold text-[8px] mb-0.5">Mecbur Kolonlar</span>
                        <div>Kurum Adı;Lokasyon;Kapasite;Eğitmen Sayısı</div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      {uploadStatus.schools.loading ? (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-black text-zinc-500 font-mono">
                            <span className="animate-pulse text-sky-600">Yükleniyor...</span>
                            <span>%{uploadStatus.schools.progress}</span>
                          </div>
                          <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                            <div className="bg-sky-600 h-1 rounded-full transition-all duration-300" style={{ width: `${uploadStatus.schools.progress}%` }} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDownloadTemplate('toplu-okul.csv')}
                            className="w-full bg-[#FAF9F5] hover:bg-zinc-100 text-zinc-800 border border-zinc-250 font-black text-[10px] py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            Şablon İndir
                          </button>

                          <div className="grid grid-cols-2 gap-1.5">
                            <label className="bg-sky-650 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-[10px] py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 shadow-sm text-center">
                              <Upload className="w-3 h-3 shrink-0" />
                              Dosya Seç
                              <input
                                type="file"
                                accept=".csv,.xlsx,.xls,.txt"
                                onChange={(e) => handleFileSystemUpload(e, 'schools')}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleSimulateUpload('schools')}
                              className="bg-sky-50 hover:bg-sky-100 text-sky-800 font-extrabold text-[10px] py-2 rounded-lg transition cursor-pointer text-center text-[10px]"
                            >
                              Simüle Et
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* CARD 4: TOPLU KURS */}
                  <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-zinc-300 transition-all group relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-20 h-24 bg-gradient-to-br from-amber-50/20 to-transparent rounded-bl-full pointer-events-none" />
                    <div className="space-y-4">
                      <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 transition shadow-xs">
                        <GraduationCap className="w-5 h-5 text-amber-600 font-bold" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-zinc-900 group-hover:text-amber-600 transition">Toplu Özel Kurs Ekleme</h4>
                        <p className="text-[9px] text-zinc-400 font-bold font-mono mt-0.5">Dosya: toplu-kurs.csv</p>
                        <p className="text-[11px] text-zinc-600 mt-1.5 leading-relaxed">
                          İstanbul geneli teknoloji, robotik ve yabancı dil hazırlık kurslarının temel müfredat saatlerini ve lokasyonlarını yükleyin.
                        </p>
                      </div>

                      <div className="bg-[#FAF9F5] p-2 rounded-lg border border-zinc-150 space-y-1 text-[9px] text-zinc-500 font-semibold font-mono">
                        <span className="text-zinc-400 uppercase tracking-wider block font-bold text-[8px] mb-0.5">Mecbur Kolonlar</span>
                        <div>Kurs Adı;Lokasyon;Yıllık Yoğunluk;Mesai Saatleri</div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      {uploadStatus.courses.loading ? (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-black text-zinc-500 font-mono">
                            <span className="animate-pulse text-amber-600">Yükleniyor...</span>
                            <span>%{uploadStatus.courses.progress}</span>
                          </div>
                          <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                            <div className="bg-amber-600 h-1 rounded-full transition-all duration-300" style={{ width: `${uploadStatus.courses.progress}%` }} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDownloadTemplate('toplu-kurs.csv')}
                            className="w-full bg-[#FAF9F5] hover:bg-zinc-100 text-zinc-800 border border-zinc-250 font-black text-[10px] py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            Şablon İndir
                          </button>

                          <div className="grid grid-cols-2 gap-1.5">
                            <label className="bg-[#FF6600] hover:bg-[#CC5200] text-white font-extrabold text-[10px] py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 shadow-sm text-center">
                              <Upload className="w-3 h-3 shrink-0" />
                              Dosya Seç
                              <input
                                type="file"
                                accept=".csv,.xlsx,.xls,.txt"
                                onChange={(e) => handleFileSystemUpload(e, 'courses')}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleSimulateUpload('courses')}
                              className="bg-[#FAF9F5] hover:bg-zinc-100 text-[#FF6600] font-extrabold text-[10px] py-2 rounded-lg transition cursor-pointer text-center text-[10px]"
                            >
                              Simüle Et
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                </div>

                {/* TOPLU YÜKLEME DURUM & ÖNCE - SONRA SAYI TAKİP EKRANI */}
                <div id="bulk-import-stats-board" className="bg-white border border-[#FF6600]/40 rounded-2xl p-6 shadow-2xs space-y-6 text-left">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-4 border-b border-zinc-100">
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#FF6600] shrink-0" />
                        <span>Sayısal Sayaç Takip Ekranı (Önceki vs Sonraki)</span>
                      </h4>
                      <p className="text-[11px] text-zinc-500 font-semibold leading-relaxed">
                        Toplu veri yüklemeleri öncesinde kaç adet kayıt olduğu ve yükleme gerçekleştikten sonra kaç adete ulaştığı canlı olarak aşağıda listelenmiştir.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => {
                          setLessonsList([
                            { id: 'l-1', code: 'MAT101', name: 'Matematik', hours: 6, category: 'Sayısal', type: 'Zorunlu' },
                            { id: 'l-2', code: 'FZK101', name: 'Fizik', hours: 4, category: 'Sayısal', type: 'Zorunlu' },
                            { id: 'l-3', code: 'EDB101', name: 'Türk Dili ve Edebiyatı', hours: 5, category: 'Sözel', type: 'Zorunlu' }
                          ]);
                          setTeachersList([
                            { id: 't-1', name: 'Selin Yılmaz', branch: 'Matematik', phone: '+90 (555) 123 45 67', email: 'selin.yilmaz@istanbul-egitimi.gov.tr', assignedBranch: 'Ataköy Şube' },
                            { id: 't-2', name: 'Can Demir', branch: 'Fizik', phone: '+90 (555) 765 43 21', email: 'can.demir@istanbul-egitimi.gov.tr', assignedBranch: 'Merkez' }
                          ]);
                          setSchoolsList([
                            { id: 's-1', name: 'Kuzey Bahçeşehir Koleji ve Fen Lisesi', location: 'Sarıyer, İstanbul', capacity: 200, teachersCount: 24, type: 'okul' },
                            { id: 's-2', name: 'İstanbul Bilim Koleji', location: 'Beşiktaş, İstanbul', capacity: 500, teachersCount: 45, type: 'okul' }
                          ]);
                          setCoursesList([
                            { id: 'c-1', name: 'Lisan Teknoloji Akademisi', location: 'Bakırköy, İstanbul', educationLevel: 'Kodlama Atölyesi', lessonsIntensity: 'Haftalık 24 Saat', hours: '17:00-21:30' }
                          ]);
                          
                          setLessonsPrevCount(3);
                          setTeachersPrevCount(2);
                          setSchoolsPrevCount(2);
                          setCoursesPrevCount(1);
                          showNotification("Bütün listeler ve sayaçlar varsayılan değerlere sıfırlandı!");
                        }}
                        className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10px] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer shadow-2xs"
                      >
                        Sayaçları Sıfırla
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* CARD 1: DERS SAYISI */}
                    <div id="stat-card-lessons" className="bg-indigo-50/25 border border-indigo-100/60 p-4 rounded-xl flex flex-col justify-between space-y-4 shadow-3xs">
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] bg-indigo-100 text-indigo-850 font-black px-1.5 py-0.5 rounded uppercase font-mono">MÜFREDAT DERS</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 font-bold block uppercase leading-none">Toplam Ders Sayısı</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-sm font-bold font-mono text-zinc-400" title="Yüklemeden Önceki Adet">{lessonsPrevCount} Ders</span>
                          <span className="text-zinc-300 text-xs">➔</span>
                          <span className="text-xl font-black font-mono text-indigo-700" title="Yüklemeden Sonraki Aktif Adet">{lessonsList.length} Ders</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-indigo-600 pt-1 border-t border-indigo-100/40">
                        {lessonsList.length > lessonsPrevCount ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded font-black font-mono">+{lessonsList.length - lessonsPrevCount} YENİ VERİ EKLENDİ</span>
                        ) : (
                          <span className="text-zinc-500 font-mono">Değişiklik yok</span>
                        )}
                      </div>
                    </div>

                    {/* CARD 2: ÖĞRETMEN SAYISI */}
                    <div id="stat-card-teachers" className="bg-emerald-50/25 border border-emerald-100/60 p-4 rounded-xl flex flex-col justify-between space-y-4 shadow-3xs">
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] bg-emerald-100 text-emerald-850 font-black px-1.5 py-0.5 rounded uppercase font-mono font-bold">KADRO</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 font-bold block uppercase leading-none">Toplam Öğretmen Sayısı</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-sm font-bold font-mono text-zinc-400" title="Yüklemeden Önceki Adet">{teachersPrevCount} Eğitmen</span>
                          <span className="text-zinc-300 text-xs">➔</span>
                          <span className="text-xl font-black font-mono text-emerald-700" title="Yüklemeden Sonraki Aktif Adet">{teachersList.length} Eğitmen</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-605 pt-1 border-t border-emerald-100/40">
                        {teachersList.length > teachersPrevCount ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded font-black font-mono">+{teachersList.length - teachersPrevCount} YENİ VERİ EKLENDİ</span>
                        ) : (
                          <span className="text-zinc-500 font-mono">Değişiklik yok</span>
                        )}
                      </div>
                    </div>

                    {/* CARD 3: OKUL SAYISI */}
                    <div id="stat-card-schools" className="bg-sky-50/25 border border-sky-100/60 p-4 rounded-xl flex flex-col justify-between space-y-4 shadow-3xs">
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                          <Building className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] bg-sky-100 text-sky-855 font-black px-1.5 py-0.5 rounded uppercase font-mono font-bold">KURUM</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 font-bold block uppercase leading-none">Okul/Kolej Sayısı</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-sm font-bold font-mono text-zinc-400" title="Yüklemeden Önceki Adet">{schoolsPrevCount} Kampüs</span>
                          <span className="text-zinc-300 text-xs">➔</span>
                          <span className="text-xl font-black font-mono text-sky-700" title="Yüklemeden Sonraki Aktif Adet">{schoolsList.length} Kampüs</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-sky-605 pt-1 border-t border-sky-100/40">
                        {schoolsList.length > schoolsPrevCount ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded font-black font-mono">+{schoolsList.length - schoolsPrevCount} YENİ VERİ EKLENDİ</span>
                        ) : (
                          <span className="text-zinc-500 font-mono">Değişiklik yok</span>
                        )}
                      </div>
                    </div>

                    {/* CARD 4: KURS SAYISI */}
                    <div id="stat-card-courses" className="bg-amber-50/25 border border-amber-100/60 p-4 rounded-xl flex flex-col justify-between space-y-4 shadow-3xs">
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] bg-amber-100 text-amber-850 font-black px-1.5 py-0.5 rounded uppercase font-mono font-bold">KURS</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 font-bold block uppercase leading-none">Özel Kurs Sayısı</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-sm font-bold font-mono text-zinc-400" title="Yüklemeden Önceki Adet">{coursesPrevCount} Kurs</span>
                          <span className="text-zinc-300 text-xs">➔</span>
                          <span className="text-xl font-black font-mono text-amber-700" title="Yüklemeden Sonraki Aktif Adet">{coursesList.length} Kurs</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-amber-605 pt-1 border-t border-amber-100/40">
                        {coursesList.length > coursesPrevCount ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded font-black font-mono">+{coursesList.length - coursesPrevCount} YENİ VERİ EKLENDİ</span>
                        ) : (
                          <span className="text-zinc-500 font-mono">Değişiklik yok</span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {activeTab === 'schools_mgmt' && (
              <SchoolsTab 
                schools={schoolsList} 
                onAddSchool={handleAddSchool}
                onDeleteSchool={handleDeleteSchool}
              />
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
