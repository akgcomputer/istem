import React, { useState, useEffect } from 'react';
import {
  Bell, Bus, Pill, Utensils, ClipboardList, CheckCircle2,
  ShieldCheck, Calendar, Clock, UserCheck, Sparkles, Phone,
  AlertCircle, Camera, Send, LogOut, Building2, Users,
  Package, Baby, QrCode, Volume2, Lock, Megaphone, Award,
  FileText, CreditCard, Wallet, Activity, Gift, ShieldAlert,
  HelpCircle, Check, X, DoorOpen, ChevronRight, Menu
} from 'lucide-react';
import {
  IstemKidsRole,
  KidsStudentRecord,
  KidsLessonBellSlot,
  ParentRequestTicket,
  SequentialShuttleStop,
  KidsAnnouncement,
  KidsDiaryPost,
  KidsPickupPerson,
  INITIAL_KIDS_STUDENTS,
  INITIAL_LESSON_BELL_SLOTS,
  INITIAL_PARENT_REQUESTS,
  INITIAL_SEQUENTIAL_SHUTTLE_ROUTE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_DIARY_POSTS,
  INITIAL_PICKUP_PERSONS,
  INITIAL_WEEKLY_DIET_MENU,
  ISTEM_KIDS_DEMO_ACCOUNTS,
  playMelodicChime
} from '../data/istemKidsData';

interface ParentPortalViewProps {
  initialInstitutionCode?: string;
  initialChild?: 'zeynep' | 'mert';
  initialKidsRole?: IstemKidsRole;
  onNavigateTo: (page: string) => void;
  onLogout?: () => void;
}

type VeliSectionTab =
  | 'gunluk_karne'
  | 'kazanimlar'
  | 'kresten_gunlukler'
  | 'ilac_saglik'
  | 'beslenme_menu'
  | 'servis_rota'
  | 'duyurular'
  | 'aidat_odeme';

type ManagementMenuTab =
  | 'kayit_islemleri'
  | 'egitim_islemleri'
  | 'saglik_islemleri'
  | 'servis_islemleri'
  | 'raporlar_ajanda'
  | 'stok_pratik_erp'
  | 'diger_islemler';

const VELI_MENU_ITEMS: { id: VeliSectionTab; label: string; icon: string; desc: string }[] = [
  { id: 'gunluk_karne', label: '📋 Günlük Karne & Yoklama', icon: '📋', desc: 'Beslenme, Uyku ve Yoklama' },
  { id: 'kazanimlar', label: '🎯 Bireysel Kazanımlar', icon: '🎯', desc: 'Gelişim ve Beceri Tablosu' },
  { id: 'kresten_gunlukler', label: '📸 Kreşten Günlükler (Şifreli & KVKK)', icon: '📸', desc: 'Kapalı Devre Albüm & İzin' },
  { id: 'ilac_saglik', label: '💊 İlaç & Sağlık Çizelgesi', icon: '💊', desc: 'Salgın Tanısı ve İlaç Zili' },
  { id: 'beslenme_menu', label: '🍽️ Diyetisyen Beslenme Menüsü', icon: '🍽️', desc: 'Haftalık Onaylı Yemek Listesi' },
  { id: 'servis_rota', label: '🚌 Sıralı Servis Rotası (Root)', icon: '🚌', desc: 'Sıralı Durak ve Veli Onayı' },
  { id: 'duyurular', label: '📢 Duyurular (Önem Sıralı)', icon: '📢', desc: 'Önemli ve Resmi Bildirimler' },
  { id: 'aidat_odeme', label: '💳 Aidat & Fatura', icon: '💳', desc: 'Eğitim Taksiti ve e-Fatura' }
];

export default function ParentPortalView({
  initialInstitutionCode = 'zerdalikres',
  initialKidsRole = 'veli',
  onNavigateTo,
  onLogout
}: ParentPortalViewProps) {
  const [activeKidsRole, setActiveKidsRole] = useState<IstemKidsRole>(initialKidsRole);

  useEffect(() => {
    setActiveKidsRole(initialKidsRole);
  }, [initialKidsRole]);

  // Core Shared States for İSTEM Kids
  const [students, setStudents] = useState<KidsStudentRecord[]>(INITIAL_KIDS_STUDENTS);
  const [bellSlots, setBellSlots] = useState<KidsLessonBellSlot[]>(INITIAL_LESSON_BELL_SLOTS);
  const [requests, setRequests] = useState<ParentRequestTicket[]>(INITIAL_PARENT_REQUESTS);
  const [shuttleStops, setShuttleStops] = useState<SequentialShuttleStop[]>(INITIAL_SEQUENTIAL_SHUTTLE_ROUTE);
  const [announcements, setAnnouncements] = useState<KidsAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [diaryPosts, setDiaryPosts] = useState<KidsDiaryPost[]>(INITIAL_DIARY_POSTS);
  const [pickupPersons, setPickupPersons] = useState<KidsPickupPerson[]>(INITIAL_PICKUP_PERSONS);
  const [weeklyMenu, setWeeklyMenu] = useState(INITIAL_WEEKLY_DIET_MENU);

  // Active child in Veli view (By default only 1 child for demo parent; optional sibling toggle if parent has >1 child)
  const [selectedChildId, setSelectedChildId] = useState<string>('zeynep');
  const [showDemoSibling, setShowDemoSibling] = useState<boolean>(false);
  const [isVeliMobileMenuOpen, setIsVeliMobileMenuOpen] = useState<boolean>(false);
  const [activeVeliTab, setActiveVeliTab] = useState<VeliSectionTab>('gunluk_karne');
  const [activeMgmtTab, setActiveMgmtTab] = useState<ManagementMenuTab>('kayit_islemleri');
  const [activeMgmtSubTab, setActiveMgmtSubTab] = useState<string>('Ön Kayıt');

  // Live countdown timer for Lesson Bell (Otomatik Kurum Ders Zili)
  const [bellSecondsLeft, setBellSecondsLeft] = useState<number>(14 * 60 + 25);
  useEffect(() => {
    const timer = setInterval(() => {
      setBellSecondsLeft(prev => {
        if (prev <= 1) {
          playMelodicChime('lesson');
          return 15 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m} dk ${s < 10 ? '0' : ''}${s} sn`;
  };

  // Global Toast with optional Chime
  const [toastBanner, setToastBanner] = useState<string | null>(null);
  const triggerAlert = (
    msg: string,
    sound?: 'lesson' | 'medicine' | 'shuttle' | 'request'
  ) => {
    if (sound) {
      playMelodicChime(sound);
    }
    setToastBanner(msg);
    setTimeout(() => setToastBanner(null), 5500);
  };

  // 2. Aşama: Kapı Çalma / Veli Hızlı Talep & Bilgilendirme Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [reqTemplate, setReqTemplate] = useState<ParentRequestTicket['templateType']>(
    'Kapıdayım, öğrenciyi teslim alacağım'
  );
  const [reqRecipient, setReqRecipient] = useState<ParentRequestTicket['recipient']>(
    'Ayşe Yılmaz (Sınıf Öğretmeni)'
  );
  const [reqShortNote, setReqShortNote] = useState('');

  // Medicine Form State (Salgın kontrolü + detaylı kullanım)
  const [medDiseaseName, setMedDiseaseName] = useState('');
  const [medHideDisease, setMedHideDisease] = useState(false);
  const [medName, setMedName] = useState('');
  const [medTime, setMedTime] = useState('13:00');
  const [medStomach, setMedStomach] = useState<'Tok Karnına' | 'Aç Karnına'>('Tok Karnına');
  const [medHowToGive, setMedHowToGive] = useState('Su ile karıştırarak');
  const [medDuration, setMedDuration] = useState('İlaç bitene kadar');

  // Teacher States
  const [newDiaryCaption, setNewDiaryCaption] = useState('');
  const [newDiaryScope, setNewDiaryScope] = useState<'Tek Öğrenci' | 'Tüm Sınıf (Grup)'>('Tüm Sınıf (Grup)');
  const [newDiarySocialReq, setNewDiarySocialReq] = useState(true);

  // Management States
  const [newBellTitle, setNewBellTitle] = useState('');
  const [newBellStart, setNewBellStart] = useState('11:15');
  const [newBellEnd, setNewBellEnd] = useState('12:00');
  const [newBellType, setNewBellType] = useState<'ders' | 'teneffus' | 'yemek' | 'uyku'>('ders');

  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnTag, setNewAnnTag] = useState<KidsAnnouncement['tag']>('Önemli Duyuru');

  // Helper to update a student
  const currentStudent = students.find(s => s.id === selectedChildId) || students[0];
  const updateStudent = (
    id: string,
    updater: (prev: KidsStudentRecord) => KidsStudentRecord
  ) => {
    setStudents(prev => prev.map(s => (s.id === id ? updater(s) : s)));
  };

  // Current Lesson Bell Slot
  const currentBellSlot = bellSlots.find(b => b.isCurrent) || bellSlots[1];

  // Sequential Shuttle Logic: Find the first incomplete stop (Sıra Atlanamaz!)
  const firstActiveStop = shuttleStops.find(st => !st.completed);

  const handleCompleteShuttleStop = (
    stopOrder: number,
    newStatus: SequentialShuttleStop['status'],
    actorLabel: string
  ) => {
    const idx = shuttleStops.findIndex(s => s.stopOrder === stopOrder);
    if (idx === -1) return;
    const currentStop = shuttleStops[idx];

    // Find next incomplete stop to notify its parent
    const nextStop = shuttleStops.slice(idx + 1).find(s => !s.completed);

    setShuttleStops(prev =>
      prev.map((item, i) => {
        if (item.stopOrder === stopOrder) {
          return { ...item, status: newStatus, completed: true };
        }
        if (nextStop && item.stopOrder === nextStop.stopOrder) {
          return {
            ...item,
            status: 'Önceki Durak Tamamlandı — Hazırlanın 🔔'
          };
        }
        return item;
      })
    );

    if (nextStop) {
      triggerAlert(
        `🚌 ${currentStop.stopOrder}. Durak (${currentStop.studentName}) "${actorLabel}" tarafından tamamlandı! Sıradaki ${nextStop.stopOrder}. Durak (${nextStop.studentName} - Veli: ${nextStop.parentName}) için otomatik hazırlık bildirimi gönderildi!`,
        'shuttle'
      );
    } else {
      triggerAlert(
        `✅ Servis rotasındaki tüm duraklar (${currentStop.studentName}) tamamlandı!`,
        'shuttle'
      );
    }
  };

  // Handle Parent 2. Aşama Request / Door Knock Submit
  const handleSendParentRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ParentRequestTicket = {
      id: Date.now(),
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      parentName: currentStudent.parentName,
      templateType: reqTemplate,
      recipient: reqRecipient,
      shortNote: reqShortNote.trim().slice(0, 140) || reqTemplate,
      createdAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      status: 'Yeni İletildi'
    };
    setRequests(prev => [created, ...prev]);
    setReqShortNote('');
    setIsRequestModalOpen(false);
    triggerAlert(
      `🚪 "${reqTemplate}" bildiriminiz ${reqRecipient} ekranına sesli uyarı ile iletildi!`,
      'request'
    );
  };

  // Handle Medicine Submit (with Epidemic Disease Rule)
  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;
    const finalDisease =
      medHideDisease || !medDiseaseName.trim()
        ? 'Hastalığın adı girilmedi'
        : medDiseaseName.trim();

    updateStudent(currentStudent.id, s => ({
      ...s,
      medicines: [
        ...s.medicines,
        {
          id: Date.now(),
          diseaseName: finalDisease,
          medicineName: medName.trim(),
          time: medTime,
          stomachStatus: medStomach,
          howToGive: medHowToGive,
          durationText: medDuration,
          enteredBy: activeKidsRole === 'kurum_sahibi' ? 'Yönetim' : 'Veli',
          given: false
        }
      ]
    }));
    setMedName('');
    setMedDiseaseName('');
    triggerAlert(
      `💊 "${medName}" (${medTime} • ${medStomach} • ${medHowToGive}) çizelgeye eklendi ve ilaç zili kuruldu!`,
      'medicine'
    );
  };

  // Teacher gives medicine -> triggers audio + visual notification to Parent
  const handleGiveMedicine = (studentId: string, medId: number, medTitle: string, childName: string) => {
    const nowStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    updateStudent(studentId, s => ({
      ...s,
      medicines: s.medicines.map(m =>
        m.id === medId ? { ...m, given: true, givenBy: 'Ayşe Yılmaz', givenAt: nowStr } : m
      )
    }));
    triggerAlert(
      `✅ VELİYE SESLİ & YAZILI BİLDİRİM İLETİLDİ: "${childName} isimli öğrencimizin ${medTitle} ilacı saat ${nowStr} itibarıyla öğretmeni tarafından verildi!"`,
      'medicine'
    );
  };

  // Sorted Announcements (Önemli & Resmi always on top)
  const sortedAnnouncements = [...announcements].sort(
    (a, b) => b.priorityWeight - a.priorityWeight
  );

  // Numerical Attendance Summary (Veli only sees numbers, not other children's names!)
  const totalClassCount = 18;
  const absentClassCount = students.filter(s => s.attendance !== 'geldi').length + 1;
  const presentClassCount = totalClassCount - absentClassCount;

  // THEME DISTINCTION:
  // Kurum & Stok Pratik Yönetimi = KOYU TEMA (Dark Mode)
  // Veli / Öğretmen / Servis = AÇIK TEMA (Light Mode)
  const isDarkManagement = activeKidsRole === 'kurum_sahibi';

  return (
    <div
      className={`min-h-screen pb-24 font-sans transition-colors duration-300 ${
        isDarkManagement
          ? 'bg-[#0B1120] text-slate-100'
          : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Global Live Toast Notification */}
      {toastBanner && (
        <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-lg z-50 bg-amber-500 text-slate-950 px-5 py-4 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-3 animate-fade-in">
          <Volume2 className="w-6 h-6 text-slate-950 shrink-0 animate-bounce" />
          <p className="text-xs font-extrabold leading-snug">{toastBanner}</p>
        </div>
      )}

      {/* =====================================================================
          TOP HEADER BAR: THEME INDICATOR + 4 ROLE SWITCHER
         ===================================================================== */}
      <div
        className={`sticky top-16 z-30 border-b shadow-xs transition-colors ${
          isDarkManagement
            ? 'bg-[#111827]/95 border-slate-800 text-white'
            : 'bg-white/95 border-slate-200 text-slate-900'
        } backdrop-blur-md`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                  isDarkManagement
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-primary-container text-white'
                }`}
              >
                🧸
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-black text-base sm:text-lg leading-none">
                    İSTEM Kids • 0-6 Yaş Kreş &amp; Anaokulu Sistemi
                  </h1>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                      isDarkManagement
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                        : 'bg-sky-100 text-sky-900 border border-sky-200'
                    }`}
                  >
                    {isDarkManagement
                      ? '🌙 Koyu Tema • Kurum & Stok Pratik Yönetimi'
                      : '☀️ Açık Tema • Veli & Öğrenci / Öğretmen / Servis Portalı'}
                  </span>
                </div>
                <p
                  className={`text-xs mt-1 ${
                    isDarkManagement ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  İstanbul Eğitim Merkezi (İSTEM) • Özel Zerdali Kreş &amp; Anaokulu (Kurum Kodu:{' '}
                  <strong className="font-mono">{initialInstitutionCode}</strong>)
                </p>
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="lg:hidden p-2 rounded-xl bg-slate-200/20"
                title="Çıkış"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Role Switcher (Active during demo/testing; in live mode only the logged-in user's role opens) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <div
              className={`p-1 rounded-2xl flex items-center gap-1 border ${
                isDarkManagement
                  ? 'bg-slate-900 border-slate-700'
                  : 'bg-slate-100 border-slate-200'
              }`}
            >
              {ISTEM_KIDS_DEMO_ACCOUNTS.map(acc => {
                const isSelected = activeKidsRole === acc.role;
                const isMgmtBtn = acc.role === 'kurum_sahibi';
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => setActiveKidsRole(acc.role)}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? isMgmtBtn
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-primary-container text-white shadow-sm'
                        : isDarkManagement
                        ? 'text-slate-300 hover:text-white'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    <span>{acc.roleLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =====================================================================
            OTOMATİK KURUM DERS ZİLİ BANDI (3 SATIR ALT ALTA + HIZLI TALEBİNİ İLET)
           ===================================================================== */}
        <div
          className={`border-t px-4 sm:px-6 lg:px-8 py-3 text-xs ${
            isDarkManagement
              ? 'bg-[#0F172A] border-slate-800 text-slate-200'
              : 'bg-indigo-50/90 border-indigo-100 text-indigo-950'
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* 3 Satır Alt Alta Kurum Ders Zili Alanı */}
            <div className="flex flex-col items-start gap-1.5">
              {/* 1. Satır */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs">
                <Bell className="w-3.5 h-3.5" />
                <span>Otomatik Kurum Ders Zili</span>
              </span>

              {/* 2. Satır */}
              <div className="font-extrabold text-xs sm:text-sm">
                Şu An: {currentBellSlot.title} ({currentBellSlot.startTime} - {currentBellSlot.endTime})
              </div>

              {/* 3. Satır */}
              <div
                className={`px-3 py-1 rounded-xl font-mono font-extrabold text-xs inline-flex items-center gap-1.5 ${
                  isDarkManagement
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-amber-200/80 text-amber-950'
                }`}
              >
                <span>
                  ⏳ {currentBellSlot.type === 'ders' ? 'Ders Bitiş Ziline:' : 'Teneffüs Bitişine:'}{' '}
                  {formatCountdown(bellSecondsLeft)}
                </span>
              </div>
            </div>

            {activeKidsRole !== 'kurum_sahibi' && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <DoorOpen className="w-4 h-4" />
                  <span>Hızlı Talebini İlet</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          MAIN BODY CONTAINER
         ===================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* ===================================================================
            ROL 1: 👨‍👩‍👧 VELİ & ÖĞRENCİ (AÇIK TEMA - LIGHT MODE)
           =================================================================== */}
        {activeKidsRole === 'veli' && (
          <div className="space-y-5 animate-fade-in">
            {/* Top Row: Veli Child Card (Only 1 child shown by default; 2nd child only if sibling exists) */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                {students
                  .filter(
                    s =>
                      s.parentUsername === 'fatihsari' ||
                      (showDemoSibling && s.id === 'aliefe')
                  )
                  .map(child => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => setSelectedChildId(child.id)}
                      className={`flex items-center gap-3 p-2.5 pr-4 rounded-2xl border transition cursor-pointer text-left ${
                        selectedChildId === child.id
                          ? 'bg-indigo-50/70 border-primary-container ring-1 ring-primary-container/30'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <img
                        src={child.avatar}
                        alt={child.name}
                        className="w-11 h-11 rounded-xl object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-extrabold text-sm text-slate-900">
                            {child.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-primary-container text-white text-[10px] font-bold">
                            {child.ageGroup === '0-3' ? '0-3 Yaş Kreş' : '3-6 Yaş Anaokulu'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                          {child.className} • Boy: {child.heightCm} cm / Kilo: {child.weightKg} kg
                        </p>
                      </div>
                    </button>
                  ))}

                {/* Optional Toggle to test multi-child parent view */}
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !showDemoSibling;
                    setShowDemoSibling(nextVal);
                    if (!nextVal && selectedChildId === 'aliefe') {
                      setSelectedChildId('zeynep');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold cursor-pointer"
                  title="Velinin birden fazla çocuğu olduğunda nasıl göründüğünü test edin"
                >
                  {showDemoSibling
                    ? 'Tek Çocuk Görünümüne Dön'
                    : '+ Kardeş Varsa Göster (Çoklu Çocuk Testi)'}
                </button>
              </div>

              {/* Hızlı Talebini İlet & Mobil Sandwich Menü Tetikleyici */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReqTemplate('Kapıdayım, öğrenciyi teslim alacağım');
                    setIsRequestModalOpen(true);
                  }}
                  className="px-4 py-3 rounded-2xl bg-secondary hover:opacity-95 text-white font-display font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <DoorOpen className="w-4 h-4" />
                  <span>Hızlı Talebini İlet</span>
                </button>

                {/* Mobile / App Sandwich Menu Button (Visible on screens < lg) */}
                <button
                  type="button"
                  onClick={() => setIsVeliMobileMenuOpen(prev => !prev)}
                  className="lg:hidden px-4 py-3 rounded-2xl bg-primary-container text-white font-display font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  {isVeliMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  <span>Menü</span>
                </button>
              </div>
            </div>

            {/* MOBILE / APP SANDWICH MENU DRAWER (Alt Alta İkonlu Mobil Menü) */}
            {isVeliMobileMenuOpen && (
              <div className="lg:hidden bg-white p-4 rounded-3xl border-2 border-primary-container/20 shadow-xl space-y-2 animate-fade-in">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
                  <span className="font-display font-extrabold text-xs text-slate-900">
                    👨‍👩‍👧 Veli &amp; Öğrenci Menüsü
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsVeliMobileMenuOpen(false)}
                    className="p-1 rounded-lg bg-slate-100 text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {VELI_MENU_ITEMS.map(tab => {
                    const isActive = activeVeliTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveVeliTab(tab.id);
                          setIsVeliMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between transition cursor-pointer ${
                          isActive
                            ? 'bg-primary-container text-white shadow-sm'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <ChevronRight className="w-4 h-4 shrink-0 opacity-75" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =================================================================
                VELİ ANA YERLEŞİMİ: SOLDA İÇERİK (8 SÜTUN) + SAĞDA ALT ALTA İKONLU MENÜ (4 SÜTUN)
               ================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT 8 COLUMNS: ACTIVE VELI TAB CONTENT */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-6 order-2 lg:order-1">
                {/* TAB 1: GÜNLÜK KARNE & SAYISAL YOKLAMA ÖZETİ */}
                {activeVeliTab === 'gunluk_karne' && (
                  <div className="space-y-5">
                    {/* Numerical Class Attendance Box (Names Hidden for Privacy) */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-base shrink-0">
                          {presentClassCount}/{totalClassCount}
                        </div>
                        <div>
                          <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                            Günlük Sınıf Yoklama Özeti (Sayısal)
                          </span>
                          <h3 className="font-display font-extrabold text-sm text-slate-900 mt-1">
                            {currentStudent.className}: Bugün {presentClassCount} öğrenci okulda,{' '}
                            <span className="text-red-600">{absentClassCount} öğrenci gelmedi</span>
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Çocuğunuz ({currentStudent.name}):{' '}
                            <strong className="text-emerald-700">
                              {currentStudent.attendance === 'geldi' ? 'Okulda (Geldi ✅)' : 'Gelmedi'}
                            </strong>{' '}
                            • KVKK gereği diğer öğrencilerin isimleri gösterilmez.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Daily Activities, Meals (Default Ate Rule), Sleep & Diaper Logs */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display font-extrabold text-base text-slate-900">
                            {currentStudent.name} — Günlük Aktivite, Yemek ve Uyku Özeti
                          </h3>
                          <p className="text-xs text-slate-500">
                            Gün içerisinde öğretmen işledikçe canlı güncellenir
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                          Canlı Karne
                        </span>
                      </div>

                      {/* Meal Status Cards (Default: Yemeğini Yedi unless teacher marked exception) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-extrabold text-slate-700">
                            🍽️ Günlük Beslenme Takibi (Varsayılan: Yemeğini Yedi)
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">
                            Öğretmen sadece yemeyen öğrenciyi işaretler
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: 'Sabah Kahvaltısı', ate: currentStudent.ateBreakfast },
                            { label: 'Öğle Yemeği', ate: currentStudent.ateLunch },
                            { label: 'İkindi Ara Öğünü', ate: currentStudent.ateSnack }
                          ].map((m, i) => (
                            <div
                              key={i}
                              className={`p-3.5 rounded-2xl border text-center ${
                                m.ate
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                  : 'bg-red-50 border-red-200 text-red-900'
                              }`}
                            >
                              <span className="text-[11px] font-bold block opacity-80">{m.label}</span>
                              <span className="text-xs font-black mt-1 block">
                                {m.ate ? 'Yemeğini Yedi ✅' : 'Yemedi / Az Yedi ⚠️'}
                              </span>
                            </div>
                          ))}
                        </div>
                        {currentStudent.mealExceptionNote && (
                          <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl mt-2 font-semibold">
                            Not: {currentStudent.mealExceptionNote}
                          </p>
                        )}
                      </div>

                      {/* Sleep & Mood */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-500 block">
                            😴 Öğle Uykusu &amp; Dinlenme
                          </span>
                          <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">
                            {currentStudent.sleepStatus}
                          </span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-500 block">
                            😊 Gün İçi Duygu &amp; Uyum
                          </span>
                          <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">
                            {currentStudent.mood}
                          </span>
                        </div>
                      </div>

                      {/* Completed Daily Lessons & Workshops */}
                      <div>
                        <span className="text-xs font-extrabold text-slate-700 block mb-2">
                          🎨 Bugün Yapılan Dersler ve Etkinlikler:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {currentStudent.activities.map((act, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-200/60 text-xs font-bold"
                            >
                              ✓ {act}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 0-3 Age Diaper & Self-Care Logs */}
                      {currentStudent.ageGroup === '0-3' && (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                          <span className="text-xs font-extrabold text-amber-950 block">
                            🍼 0-3 Yaş Özbakım &amp; Bez Değişim Saatleri:
                          </span>
                          {currentStudent.diaperLogs.map(log => (
                            <div
                              key={log.id}
                              className="bg-white p-2.5 rounded-xl flex items-center justify-between text-xs border border-amber-100"
                            >
                              <span>
                                <strong>{log.time}:</strong> {log.note}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                                {log.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs">
                        <strong className="text-primary-container">👩‍🏫 Sınıf Öğretmeni Günlük Özeti:</strong>{' '}
                        {currentStudent.teacherDailyNote}
                      </div>
                    </div>

                    {/* Daily Bell Schedule & Active Parent Requests */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary-container" />
                            <span>Günlük Ders &amp; Teneffüs Zili Çizelgesi</span>
                          </h4>
                          <span className="text-[10px] font-bold text-slate-500">Yönetim Aylık Planı</span>
                        </div>
                        <div className="space-y-2">
                          {bellSlots.map(slot => (
                            <div
                              key={slot.id}
                              className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                                slot.isCurrent
                                  ? 'bg-emerald-50 border-emerald-300 font-extrabold text-emerald-950'
                                  : 'bg-slate-50 border-slate-200/70 text-slate-700'
                              }`}
                            >
                              <div>
                                <span className="block">{slot.title}</span>
                                <span className="text-[10px] opacity-75">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                              </div>
                              {slot.isCurrent && (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                                  Şu An Aktif • {formatCountdown(bellSecondsLeft)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-2">
                            <DoorOpen className="w-4 h-4 text-secondary" />
                            <span>İlettiğiniz Hızlı Talepler</span>
                          </h4>
                          <button
                            type="button"
                            onClick={() => setIsRequestModalOpen(true)}
                            className="text-xs font-extrabold text-primary-container hover:underline cursor-pointer"
                          >
                            + Hızlı Talebini İlet
                          </button>
                        </div>
                        <div className="space-y-2">
                          {requests
                            .filter(r => r.studentId === currentStudent.id)
                            .map(r => (
                              <div
                                key={r.id}
                                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-slate-900">{r.templateType}</span>
                                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                                    {r.status}
                                  </span>
                                </div>
                                <p className="text-slate-600">{r.shortNote}</p>
                                <span className="text-[10px] text-slate-400 block">
                                  Muhatap: {r.recipient} • Saat: {r.createdAt}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: 🎯 BİREYSEL KAZANIMLAR */}
                {activeVeliTab === 'kazanimlar' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-extrabold text-primary-container bg-indigo-50 px-3 py-1 rounded-full">
                          🎯 Bireysel Gelişim &amp; Beceri Kazanımları Karnesi
                        </span>
                        <h3 className="text-lg font-extrabold font-display text-slate-900 mt-2">
                          {currentStudent.name} — Dönem İçi Kazanım ve Beceri Tablosu
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentStudent.competencies.map(comp => (
                        <div
                          key={comp.id}
                          className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900">
                              {comp.category}
                            </span>
                            <span className="text-xs font-extrabold text-emerald-700">{comp.status}</span>
                          </div>
                          <h4 className="font-display font-extrabold text-sm text-slate-900">
                            {comp.skillTitle}
                          </h4>
                          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-container rounded-full"
                              style={{ width: `${comp.progressPercent}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-600">
                            <strong>Öğretmen Gözlemi:</strong> {comp.teacherNote}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: 📸 KREŞTEN GÜNLÜKLER (ŞİFRELİ KAPALI AĞ + KVKK SOSYAL MEDYA İZNİ) */}
                {activeVeliTab === 'kresten_gunlukler' && (
                  <div className="space-y-5">
                    <div className="bg-indigo-950 text-white p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Lock className="w-6 h-6 text-amber-400 shrink-0" />
                        <div>
                          <h3 className="font-display font-extrabold text-sm sm:text-base">
                            🔒 Kreşten Günlükler (Şifreli Kapalı Devre Okul Ağı)
                          </h3>
                          <p className="text-xs text-indigo-200 mt-0.5">
                            Burada paylaşılanlar sadece okul içerisinde kalır; veliler sadece kendi çocuğunun sınıf akışını görür (beğeni ve yorum kapalıdır).
                          </p>
                        </div>
                      </div>
                    </div>

                    {diaryPosts
                      .filter(post => post.consents.some(c => c.studentId === currentStudent.id))
                      .map(post => {
                        const myConsent = post.consents.find(c => c.studentId === currentStudent.id);
                        return (
                          <div
                            key={post.id}
                            className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden p-6 space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs font-extrabold text-primary-container">
                                  👩‍🏫 {post.teacherName} • {post.className}
                                </span>
                                <p className="text-[11px] text-slate-400">{post.timeAgo}</p>
                              </div>
                              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-extrabold">
                                🔒 Şifreli Sınıf Akışı ({post.scope})
                              </span>
                            </div>

                            <p className="text-sm text-slate-800 leading-relaxed">{post.caption}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl overflow-hidden">
                              {post.images.map((img, i) => (
                                <img
                                  key={i}
                                  src={img}
                                  alt="Kreş Günlüğü"
                                  className="w-full h-60 object-cover rounded-2xl"
                                />
                              ))}
                            </div>

                            {/* KVKK Social Media Permission Request Banner */}
                            {post.socialMediaRequested && myConsent && (
                              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <span className="text-[11px] font-extrabold bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full">
                                    📲 Resmi Sosyal Medya (Instagram / YouTube) Paylaşım İzni Talebi
                                  </span>
                                  <p className="text-xs font-bold text-slate-900 mt-1">
                                    Yönetim/Öğretmen bu görseli kurumun herkese açık resmi sosyal medya hesabında paylaşmak için onayınızı istiyor ({post.scope}).
                                  </p>
                                  <p className="text-[11px] text-slate-600 mt-0.5">
                                    Mevcut Kararınız ({currentStudent.name}):{' '}
                                    <strong>{myConsent.decision}</strong>
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDiaryPosts(prev =>
                                        prev.map(p =>
                                          p.id === post.id
                                            ? {
                                                ...p,
                                                consents: p.consents.map(c =>
                                                  c.studentId === currentStudent.id
                                                    ? { ...c, decision: 'İzin Veriyorum ✅' }
                                                    : c
                                                )
                                              }
                                            : p
                                        )
                                      );
                                      triggerAlert(
                                        '✅ Sosyal medya paylaşım izniniz ("İzin Veriyorum") yönetime kaydedildi.'
                                      );
                                    }}
                                    className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold cursor-pointer"
                                  >
                                    ✅ İzin Veriyorum
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDiaryPosts(prev =>
                                        prev.map(p =>
                                          p.id === post.id
                                            ? {
                                                ...p,
                                                consents: p.consents.map(c =>
                                                  c.studentId === currentStudent.id
                                                    ? { ...c, decision: 'İzin Vermiyorum ❌' }
                                                    : c
                                                )
                                              }
                                            : p
                                        )
                                      );
                                      triggerAlert(
                                        '❌ Sosyal medya paylaşım izni reddedildi ("İzin Vermiyorum"). Görsel dışarıda paylaşılmayacaktır.'
                                      );
                                    }}
                                    className="px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-extrabold cursor-pointer"
                                  >
                                    ❌ İzin Vermiyorum
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* TAB 4: 💊 İLAÇ & SAĞLIK TAKİP ÇİZELGESİ (SALGIN KONTROLÜ + İLAÇ ZİLİ) */}
                {activeVeliTab === 'ilac_saglik' && (
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    <div className="xl:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                      <span className="text-xs font-extrabold bg-rose-100 text-rose-900 px-3 py-1 rounded-full">
                        💊 Veli İlaç &amp; Salgın Bildirim Formu
                      </span>
                      <h3 className="font-display font-extrabold text-base text-slate-900">
                        Yeni İlaç / Vitamin ve Hastalık Tanısı Girin
                      </h3>
                      <form onSubmit={handleAddMedicine} className="space-y-3 text-xs">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-bold text-slate-700">
                              Salgın Kontrolü: Hastalık Adı (Belliyse)
                            </label>
                            <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={medHideDisease}
                                onChange={e => setMedHideDisease(e.target.checked)}
                              />
                              <span>Adı yok / Belirtmek istemiyorum</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            disabled={medHideDisease}
                            value={medDiseaseName}
                            onChange={e => setMedDiseaseName(e.target.value)}
                            placeholder={
                              medHideDisease
                                ? 'Hastalığın adı girilmedi olarak kaydedilecek'
                                : 'Örn: Mevsimsel Grip, Alerjik Rinit, Suçiçeği...'
                            }
                            className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">İlaç / Vitamin Adı *</label>
                            <input
                              type="text"
                              required
                              value={medName}
                              onChange={e => setMedName(e.target.value)}
                              placeholder="Örn: D Vitamini Damla"
                              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Verilecek Saat *</label>
                            <input
                              type="time"
                              value={medTime}
                              onChange={e => setMedTime(e.target.value)}
                              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Aç / Tok Durumu</label>
                            <select
                              value={medStomach}
                              onChange={e => setMedStomach(e.target.value as any)}
                              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                            >
                              <option value="Tok Karnına">Tok Alınmalı</option>
                              <option value="Aç Karnına">Aç Alınmalı</option>
                            </select>
                          </div>
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Kullanım Süresi</label>
                            <select
                              value={medDuration}
                              onChange={e => setMedDuration(e.target.value)}
                              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                            >
                              <option value="İlaç bitene kadar">İlaç bitene kadar</option>
                              <option value="3 Gün Boyunca">3 Gün Boyunca</option>
                              <option value="5 Gün Boyunca">5 Gün Boyunca</option>
                              <option value="7 Gün Boyunca">7 Gün Boyunca</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Nasıl Verileceği</label>
                          <input
                            type="text"
                            value={medHowToGive}
                            onChange={e => setMedHowToGive(e.target.value)}
                            placeholder="Örn: Su ile karıştırarak / Meyve püresiyle / 1 ölçek"
                            className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full h-11 rounded-xl bg-primary-container text-white font-display font-extrabold text-xs cursor-pointer shadow-sm"
                        >
                          💊 İlaç Zili Kur &amp; Öğretmene İlet
                        </button>
                      </form>
                    </div>

                    <div className="xl:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                      <h3 className="font-display font-extrabold text-base text-slate-900">
                        {currentStudent.name} — Aktif İlaç &amp; Sağlık Çizelgesi
                      </h3>
                      <div className="space-y-3">
                        {currentStudent.medicines.map(med => (
                          <div
                            key={med.id}
                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-black text-sm text-primary-container">
                                  ⏰ {med.time}
                                </span>
                                <span className="font-extrabold text-slate-900 text-sm">
                                  {med.medicineName}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-bold text-[10px]">
                                  {med.stomachStatus}
                                </span>
                              </div>
                              <p className="text-slate-600">
                                <strong>Veriliş Şekli:</strong> {med.howToGive} • <strong>Süre:</strong>{' '}
                                {med.durationText}
                              </p>
                              <p className="text-[11px] text-rose-800 font-bold">
                                🩺 Salgın / Hastalık Kaydı: {med.diseaseName}
                              </p>
                            </div>

                            <div className="shrink-0">
                              {med.given ? (
                                <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-extrabold text-xs block">
                                  ✅ İlaç Verildi ({med.givenAt} - {med.givenBy})
                                </span>
                              ) : (
                                <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 font-extrabold text-xs block">
                                  ⏳ İlaç Saati Bekleniyor ({med.time})
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: 🍽️ DİYETİSYEN ONAYLI GÜNLÜK BESLENME MENÜSÜ */}
                {activeVeliTab === 'beslenme_menu' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
                          🍽️ Diyetisyen Onaylı Haftalık Beslenme Tablosu
                        </span>
                        <h3 className="text-lg font-extrabold font-display text-slate-900 mt-2">
                          Haftalık Kahvaltı, Öğle Yemeği ve İkindi Menüsü
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setReqTemplate('Beslenme menüsü görüş / öneri / şikayet');
                          setReqRecipient('Yönetim');
                          setIsRequestModalOpen(true);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-secondary text-white text-xs font-extrabold cursor-pointer shrink-0"
                      >
                        💬 Menü Görüş / Öneri İlet
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {weeklyMenu.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-display font-black text-sm text-primary-container">
                              {item.day}
                            </span>
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                              {item.calories} • {item.dietitian}
                            </span>
                          </div>
                          <p>
                            <strong>🍳 Kahvaltı:</strong> {item.breakfast}
                          </p>
                          <p>
                            <strong>🍲 Öğle:</strong> {item.lunch}
                          </p>
                          <p>
                            <strong>🍎 İkindi:</strong> {item.snack}
                          </p>
                          <p className="text-[10px] font-bold text-amber-900 bg-amber-100/80 p-2 rounded-lg">
                            ⚠️ {item.allergenNote}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 6: 🚌 SIRALI SERVİS ROTASI (ROOT - SIRA ATLANAMAZ, DİĞER ÇOCUKLAR GİZLİ) */}
                {activeVeliTab === 'servis_rota' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-extrabold bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full">
                          🚌 Sıralı Servis Rotası (Root) &amp; Zincirleme Veli Bildirimi
                        </span>
                        <h3 className="text-lg font-extrabold font-display text-slate-900 mt-2">
                          {currentStudent.name} — Canlı Durak Sırası (Öğrenciler Atlanarak İlerlenemez)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Bir önceki durak tamamlandığında sıradaki veliye otomatik hazırlık zili çalar. KVKK gereği diğer velilerin çocuk isimleri gizlidir.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {shuttleStops.map(stop => {
                        const isCurrentActiveStop =
                          firstActiveStop && firstActiveStop.stopOrder === stop.stopOrder;
                        const isMyChildStop =
                          stop.studentId === currentStudent.id ||
                          (showDemoSibling && stop.studentId === 'aliefe');
                        return (
                          <div
                            key={stop.stopOrder}
                            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              stop.completed
                                ? 'bg-emerald-50/60 border-emerald-200'
                                : isCurrentActiveStop
                                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/40'
                                : 'bg-slate-50 border-slate-200 opacity-75'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-primary-container text-white font-black text-xs flex items-center justify-center shrink-0">
                                #{stop.stopOrder}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-sm text-slate-900">
                                    {isMyChildStop
                                      ? `${stop.studentName} (Çocuğunuzun Durağı)`
                                      : `${stop.stopOrder}. Durak (Diğer Öğrenci — KVKK Gizli)`}
                                  </span>
                                  <span className="text-xs font-mono font-bold text-primary-container">
                                    Tahmini: {stop.plannedTime}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600">
                                  {isMyChildStop ? stop.addressStop : 'Güzergah Üzeri Ara Durak'}
                                </p>
                                <span className="text-[11px] font-extrabold text-indigo-900 mt-0.5 block">
                                  Durum: {stop.status}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              {stop.completed ? (
                                <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold">
                                  ✓ Tamamlandı
                                </span>
                              ) : isCurrentActiveStop && isMyChildStop ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCompleteShuttleStop(
                                        stop.stopOrder,
                                        'Veli: Çocuğu Servise Verdim / Teslim Aldım ✅',
                                        'Veli'
                                      )
                                    }
                                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
                                  >
                                    👨‍👩‍👧 Veli: Servise Verdim / Aldım ✓
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCompleteShuttleStop(
                                        stop.stopOrder,
                                        'Bugün Gelmedi (Atlandı)',
                                        'Veli'
                                      )
                                    }
                                    className="px-3 py-2 rounded-xl bg-rose-600 text-white text-xs font-extrabold cursor-pointer"
                                  >
                                    Bugün Binmeyecek
                                  </button>
                                </>
                              ) : (
                                <span className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1">
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>
                                    {isCurrentActiveStop
                                      ? 'Servis Görevlisi Onayı Bekleniyor'
                                      : `Önce #${firstActiveStop?.stopOrder}. Durak Tamamlanmalı`}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 7: 📢 ÖNCELİK SIRALI DUYURULAR */}
                {activeVeliTab === 'duyurular' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                    <h3 className="font-display font-extrabold text-base text-slate-900">
                      📢 Kurum Duyuruları (Önemli ve Resmi Duyurular En Üstte Sabittir)
                    </h3>
                    <div className="space-y-3">
                      {sortedAnnouncements.map(ann => (
                        <div
                          key={ann.id}
                          className={`p-4 rounded-2xl border space-y-1.5 ${
                            ann.tag === 'Önemli Duyuru'
                              ? 'bg-rose-50/70 border-rose-300'
                              : ann.tag === 'Resmi Duyuru'
                              ? 'bg-indigo-50/70 border-indigo-300'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                                ann.tag === 'Önemli Duyuru'
                                  ? 'bg-rose-600 text-white'
                                  : ann.tag === 'Resmi Duyuru'
                                  ? 'bg-indigo-700 text-white'
                                  : ann.tag === 'Hatırlatma'
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-slate-200 text-slate-800'
                              }`}
                            >
                              {ann.tag}
                            </span>
                            <span className="text-xs text-slate-500 font-bold">{ann.date}</span>
                          </div>
                          <h4 className="font-display font-extrabold text-sm text-slate-900">
                            {ann.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 8: 💳 AİDAT & FATURA */}
                {activeVeliTab === 'aidat_odeme' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-extrabold bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full">
                        💳 Kreş Eğitim &amp; Beslenme Taksiti
                      </span>
                      <h3 className="font-display font-extrabold text-lg text-slate-900 mt-2">
                        {currentStudent.name} — Kasım 2026 Dönem Ödemesi: ₺
                        {currentStudent.tuitionAmount.toLocaleString('tr-TR')}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Durum: {currentStudent.tuitionPaid ? 'Ödendi ✅' : 'Ödeme Bekliyor'}
                      </p>
                    </div>
                    {!currentStudent.tuitionPaid && (
                      <button
                        type="button"
                        onClick={() => {
                          updateStudent(currentStudent.id, s => ({
                            ...s,
                            tuitionPaid: true,
                            invoiceNo: 'GIB202600049881'
                          }));
                          triggerAlert('✅ Eğitim taksiti ödendi ve resmi e-Faturanız oluşturuldu!');
                        }}
                        className="px-5 py-3 rounded-2xl bg-primary-container text-white text-xs font-extrabold cursor-pointer"
                      >
                        3D Secure İle Şimdi Öde
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT 4 COLUMNS: SAĞDA ALT ALTA İKONLU VELİ & ÖĞRENCİ MENÜSÜ (DESKTOP) */}
              <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 order-1 lg:order-2 sticky top-40">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-4 space-y-2">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-[11px] font-extrabold text-primary-container block">
                      👨‍👩‍👧 Veli &amp; Öğrenci Menüsü
                    </span>
                    <h3 className="font-display font-extrabold text-sm text-slate-900">
                      Hızlı Erişim Modülleri
                    </h3>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {VELI_MENU_ITEMS.map(tab => {
                      const isActive = activeVeliTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveVeliTab(tab.id)}
                          className={`w-full text-left px-3.5 py-3 rounded-2xl transition cursor-pointer flex items-center justify-between gap-2 ${
                            isActive
                              ? 'bg-primary-container text-white shadow-sm'
                              : 'bg-slate-50/80 hover:bg-indigo-50/60 text-slate-700 border border-slate-200/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-base shrink-0">{tab.icon}</span>
                            <div className="truncate">
                              <span className="text-xs font-extrabold block truncate">
                                {tab.label.replace(/^[^\s]+\s/, '')}
                              </span>
                              <span
                                className={`text-[10px] block truncate ${
                                  isActive ? 'text-indigo-100' : 'text-slate-400'
                                }`}
                              >
                                {tab.desc}
                              </span>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-white' : 'text-slate-400'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* ===================================================================
            ROL 2: 👩‍🏫 SINIF ÖĞRETMENİ EKRANI (AÇIK TEMA - İSTİSNA YÖNETİMİ)
           =================================================================== */}
        {activeKidsRole === 'ogretmen' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full">
                  👩‍🏫 Öğretmen Hızlı Sınıf Paneli • Ayşe Yılmaz
                </span>
                <h2 className="text-xl font-extrabold font-display text-slate-900 mt-2">
                  Sadece Yemeyen/Gelmeyen Öğrenciyi İşaretleyin &amp; İlaç Saatlerini Onaylayın
                </h2>
                <p className="text-xs text-slate-500">
                  Hiçbir şeye dokunmazsanız sistem tüm öğrencileri varsayılan olarak <strong>&ldquo;Okulda ve Yemeğini Yedi ✅&rdquo;</strong> gösterir.
                </p>
              </div>
            </div>

            {/* Incoming Parent Hızlı Talepler for Teacher */}
            <div className="bg-amber-50/90 p-5 rounded-3xl border border-amber-300 space-y-3">
              <h3 className="font-display font-extrabold text-sm text-amber-950 flex items-center gap-2">
                <DoorOpen className="w-4 h-4 text-amber-700" />
                <span>Velilerden Gelen Hızlı Talepler</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {requests.map(req => (
                  <div
                    key={req.id}
                    className="bg-white p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-extrabold text-slate-900 block">
                        {req.studentName} ({req.templateType})
                      </span>
                      <p className="text-slate-600">{req.shortNote}</p>
                      <span className="text-[10px] text-slate-400">Saat: {req.createdAt}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setRequests(prev =>
                          prev.map(r =>
                            r.id === req.id ? { ...r, status: 'Tamamlandı ✅' } : r
                          )
                        );
                        triggerAlert(`✅ ${req.studentName} veli talebi onaylandı!`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-[11px] shrink-0 cursor-pointer"
                    >
                      {req.status === 'Tamamlandı ✅' ? 'Onaylandı ✓' : 'Onayla'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher Student Grid (Exception-based Meal & Medicine Bell) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {students.map(std => (
                <div
                  key={std.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={std.avatar} alt={std.name} className="w-12 h-12 rounded-2xl object-cover" />
                      <div>
                        <h3 className="font-display font-extrabold text-sm text-slate-900">
                          {std.name}
                        </h3>
                        <p className="text-xs text-slate-500">{std.className}</p>
                      </div>
                    </div>

                    {/* Attendance Exception Button */}
                    <button
                      type="button"
                      onClick={() =>
                        updateStudent(std.id, s => ({
                          ...s,
                          attendance: s.attendance === 'geldi' ? 'gelmedi' : 'geldi'
                        }))
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                        std.attendance === 'geldi'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {std.attendance === 'geldi' ? 'Okulda (Geldi ✅)' : 'Gelmedi İşaretli ❌'}
                    </button>
                  </div>

                  {/* Exception-Only Meal Toggles ("Varsayılan Yedi - Sadece Yemeyeni İşaretle") */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-extrabold text-slate-700 block">
                      🍽️ Beslenme (Dokunulmazsa &ldquo;Yedi ✅&rdquo; Görünür — Yemeyene Tıklayın):
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'ateBreakfast' as const, label: 'Kahvaltı', val: std.ateBreakfast },
                        { key: 'ateLunch' as const, label: 'Öğle', val: std.ateLunch },
                        { key: 'ateSnack' as const, label: 'İkindi', val: std.ateSnack }
                      ].map(m => (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() =>
                            updateStudent(std.id, s => ({ ...s, [m.key]: !s[m.key] }))
                          }
                          className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition cursor-pointer ${
                            m.val
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white'
                          }`}
                        >
                          {m.label}: {m.val ? 'Yedi ✓' : 'Yemedi ⚠️'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Medicine Bell & Give Confirmation */}
                  {std.medicines.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                      <span className="text-[11px] font-black text-rose-950 block">
                        💊 İlaç Saati Zili &amp; Uygulama Onayı:
                      </span>
                      {std.medicines.map(med => (
                        <div
                          key={med.id}
                          className="bg-white p-2.5 rounded-xl border border-rose-100 flex items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="font-extrabold text-rose-900">
                              ⏰ {med.time} — {med.medicineName}
                            </span>
                            <span className="block text-[10px] text-slate-500">
                              {med.stomachStatus} • {med.howToGive} • Tanı: {med.diseaseName}
                            </span>
                          </div>
                          {med.given ? (
                            <span className="text-[11px] font-extrabold text-emerald-700 shrink-0">
                              Verildi ✅ ({med.givenAt})
                            </span>
                          ) : (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  triggerAlert(
                                    `⏰ İlaç Zili: ${std.name} isimli öğrencinin saat ${med.time} "${med.medicineName}" (${med.howToGive}) ilaç vakti geldi!`,
                                    'medicine'
                                  )
                                }
                                className="p-1.5 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-bold cursor-pointer"
                                title="İlaç Zilini Çal"
                              >
                                🔔 Zil
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleGiveMedicine(std.id, med.id, med.medicineName, std.name)
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-[11px] font-extrabold cursor-pointer"
                              >
                                İlacı Verdim ✓
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Teacher: Share Encrypted Diary Post & Request KVKK Social Media Permission */}
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!newDiaryCaption.trim()) return;
                const created: KidsDiaryPost = {
                  id: Date.now(),
                  className: 'Papatyalar Sınıfı (4 Yaş)',
                  teacherName: 'Ayşe Yılmaz',
                  timeAgo: 'Az önce',
                  caption: newDiaryCaption.trim(),
                  images: [
                    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=700&q=80'
                  ],
                  scope: newDiaryScope,
                  socialMediaRequested: newDiarySocialReq,
                  socialMediaPlatform: 'Instagram & YouTube Resmi Hesabı',
                  consents: students.map(s => ({
                    studentId: s.id,
                    studentName: s.name,
                    parentName: s.parentName,
                    decision: 'Bekliyor'
                  }))
                };
                setDiaryPosts([created, ...diaryPosts]);
                setNewDiaryCaption('');
                triggerAlert(
                  newDiarySocialReq
                    ? `📸 Görsel "Kreşten Günlükler"e eklendi ve ${newDiaryScope} velilerine Instagram/YouTube paylaşım izni bildirimi gönderildi!`
                    : '📸 Görsel şifreli "Kreşten Günlükler" akışında paylaşıldı!'
                );
              }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3"
            >
              <h3 className="font-display font-extrabold text-sm text-slate-900">
                📸 Kreşten Günlükler&apos;e Kare Ekle &amp; Sosyal Medya Veli İzni İste
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <input
                  type="text"
                  value={newDiaryCaption}
                  onChange={e => setNewDiaryCaption(e.target.value)}
                  placeholder="Etkinlik açıklaması yazın..."
                  className="md:col-span-2 h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
                <select
                  value={newDiaryScope}
                  onChange={e => setNewDiaryScope(e.target.value as any)}
                  className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                >
                  <option value="Tek Öğrenci">Tek Öğrenci (Sadece İlgili Veliye Sor)</option>
                  <option value="Tüm Sınıf (Grup)">Çoklu / Tüm Sınıf (Tüm Velilere Sor)</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDiarySocialReq}
                    onChange={e => setNewDiarySocialReq(e.target.checked)}
                  />
                  <span>
                    Bu görseli resmi sosyal medyada (Instagram/YouTube) paylaşmak için velilerden izin iste
                  </span>
                </label>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary-container text-white text-xs font-extrabold cursor-pointer"
                >
                  Paylaş &amp; İzin Sor
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================
            ROL 3: 🚌 SERVİS & HOSTES EKRANI (AÇIK TEMA - SIRALI ROTA ROOT)
           =================================================================== */}
        {activeKidsRole === 'servis_gorevlisi' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
                  🚌 Servisçi &amp; Hostes Sıralı Rota (Root) Paneli
                </span>
                <h2 className="text-xl font-extrabold font-display text-slate-900 mt-2">
                  Sıralı Öğrenci Alım / İndirim ve Sabah-Akşam İstisna Takibi
                </h2>
                <p className="text-xs text-slate-500">
                  Öğrencileri atlayarak işlem yapılamaz. Mevcut durak onaylandığında bir sonraki veliye otomatik bildirim gider.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShuttleStops(INITIAL_SEQUENTIAL_SHUTTLE_ROUTE)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                🔄 Rotayı Sıfırla (Demo)
              </button>
            </div>

            <div className="space-y-3">
              {shuttleStops.map(stop => {
                const isCurrentActiveStop =
                  firstActiveStop && firstActiveStop.stopOrder === stop.stopOrder;
                return (
                  <div
                    key={stop.stopOrder}
                    className={`p-5 rounded-3xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                      stop.completed
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : isCurrentActiveStop
                        ? 'bg-white border-primary-container ring-2 ring-primary-container/25 shadow-md'
                        : 'bg-slate-100/70 border-slate-200 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-primary-container text-white font-black text-sm flex items-center justify-center shrink-0">
                        {stop.stopOrder}. Durak
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display font-extrabold text-base text-slate-900">
                            {stop.studentName}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-mono font-bold text-xs">
                            Planlanan: {stop.plannedTime}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {stop.addressStop} • Veli: {stop.parentName} ({stop.parentPhone})
                        </p>
                        <span className="text-xs font-extrabold text-primary-container mt-1 block">
                          Durum: {stop.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {stop.completed ? (
                        <span className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold">
                          ✓ İşlem Tamamlandı
                        </span>
                      ) : isCurrentActiveStop ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleCompleteShuttleStop(
                                stop.stopOrder,
                                'Servise Bindi (Okula Gidiyor / Eve Dönüyor) 🚌',
                                'Servis Hostesi'
                              )
                            }
                            className="px-4 py-2.5 rounded-xl bg-primary-container text-white text-xs font-extrabold cursor-pointer"
                          >
                            🚌 Aldım / İndirdim (Sıradaki Veliye Bildir)
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleCompleteShuttleStop(
                                stop.stopOrder,
                                'Bugün Gelmedi (Atlandı)',
                                'Servis Hostesi'
                              )
                            }
                            className="px-3.5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-extrabold cursor-pointer"
                          >
                            Gelmedi İşaretle
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleCompleteShuttleStop(
                                stop.stopOrder,
                                'Öğlen Velisi Okuldan Aldı (Akşam Serviste Yok)',
                                'Yönetim/Hostes'
                              )
                            }
                            className="px-3.5 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold cursor-pointer"
                          >
                            Velisi Okuldan Aldı
                          </button>
                        </>
                      ) : (
                        <span className="px-3.5 py-2 rounded-xl bg-slate-200 text-slate-600 text-xs font-extrabold flex items-center gap-1.5">
                          <Lock className="w-4 h-4" />
                          <span>Sıra Atlanamaz (Önce {firstActiveStop?.stopOrder}. Durak)</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            ROL 4: 🏛️ KURUM & STOK PRATİK YÖNETİMİ (KOYU TEMA - DARK MODE)
            Görseldeki Sol Menü Ağacı + Raporlar + Ajanda + Stok Pratik ERP
           =================================================================== */}
        {activeKidsRole === 'kurum_sahibi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            {/* LEFT SIDEBAR NAVIGATION (Matching Screenshot Tree in Dark Mode) */}
            <aside className="lg:col-span-3 space-y-2">
              <div className="bg-[#111827] border border-slate-800 rounded-3xl p-4 space-y-1.5">
                <div className="px-3 py-2 border-b border-slate-800 mb-2">
                  <span className="text-[11px] font-extrabold text-amber-400 block">
                    🌙 Koyu Tema Yönetim Ağacı
                  </span>
                  <h3 className="font-display font-extrabold text-sm text-white mt-0.5">
                    İSTEM Kids Kurum Menüsü
                  </h3>
                </div>

                {[
                  {
                    id: 'kayit_islemleri' as const,
                    label: '📁 Kayıt İşlemleri',
                    subs: ['Ön Kayıt', 'Öğrenci Listesi', 'Öğretmen Listesi', 'Sınıf Listesi', 'Ders Listesi', 'Diğer Kişiler (Alıcılar)']
                  },
                  {
                    id: 'egitim_islemleri' as const,
                    label: '🎓 Eğitim İşlemleri',
                    subs: ['Yoklama İşlemleri', 'Kurum Zili & Aylık Plan', 'İzin / Onay İşlemleri (KVKK)', 'Anket İşlemleri']
                  },
                  {
                    id: 'saglik_islemleri' as const,
                    label: '🩺 Sağlık İşlemleri',
                    subs: ['İlaç & Salgın Listesi', 'Boy-Kilo Takibi', 'Beslenme Menüsü Hazırla']
                  },
                  {
                    id: 'servis_islemleri' as const,
                    label: '🚌 Servis İşlemleri',
                    subs: ['Sıralı Servis Rotası (Root)', 'Servis Yoklamaları', 'Servis Konumları']
                  },
                  {
                    id: 'raporlar_ajanda' as const,
                    label: '📊 Raporlar & Ajanda',
                    subs: ['Doğum Günü & Alerji Raporu', 'Ajanda & Özel Günler', 'Duyuru Yönetimi']
                  },
                  {
                    id: 'stok_pratik_erp' as const,
                    label: '💳 Stok Pratik Muhasebe',
                    subs: ['Aidat & GİB e-Fatura', 'Mutfak & Özbakım Stok']
                  },
                  {
                    id: 'diger_islemler' as const,
                    label: 'ℹ️ Diğer İşlemler',
                    subs: ['Teknik Destek', 'Erişilebilirlik']
                  }
                ].map(group => {
                  const isGroupActive = activeMgmtTab === group.id;
                  return (
                    <div key={group.id} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMgmtTab(group.id);
                          setActiveMgmtSubTab(group.subs[0]);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-between transition cursor-pointer ${
                          isGroupActive
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800/70'
                        }`}
                      >
                        <span>{group.label}</span>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isGroupActive ? 'rotate-90' : ''
                          }`}
                        />
                      </button>

                      {isGroupActive && (
                        <div className="pl-3 space-y-1 py-1">
                          {group.subs.map(sub => (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => setActiveMgmtSubTab(sub)}
                              className={`w-full text-left px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                                activeMgmtSubTab === sub
                                  ? 'bg-slate-800 text-amber-400 border-l-2 border-amber-400'
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              • {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* RIGHT 9 COLUMNS: DARK MODE MANAGEMENT WORKSPACE */}
            <div className="lg:col-span-9 space-y-6">
              {/* Top Executive Dark Banner */}
              <div className="bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#111827] border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold text-amber-400 block">
                    Aktif Yönetim Modülü • {activeMgmtSubTab}
                  </span>
                  <h2 className="font-display font-black text-xl text-white mt-1">
                    Özel Zerdali Kreş &amp; Anaokulu — Kurum ve Stok Pratik Yönetim Masası
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold">
                    Stok Pratik Senkronize ✓
                  </span>
                </div>
              </div>

              {/* 1. KAYIT İŞLEMLERİ */}
              {activeMgmtTab === 'kayit_islemleri' && (
                <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
                    {[
                      'Ön Kayıt',
                      'Öğrenci Listesi',
                      'Öğretmen Listesi',
                      'Sınıf Listesi',
                      'Ders Listesi',
                      'Diğer Kişiler (Alıcılar)'
                    ].map(sub => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setActiveMgmtSubTab(sub)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                          activeMgmtSubTab === sub
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>

                  {activeMgmtSubTab === 'Diğer Kişiler (Alıcılar)' ? (
                    <div className="space-y-3">
                      <h3 className="font-display font-extrabold text-sm text-white">
                        Çocuğu Teslim Almaya Yetkili Diğer Kişiler (Anneanne, Dede, Teyze)
                      </h3>
                      {pickupPersons.map(pk => (
                        <div
                          key={pk.id}
                          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-bold text-white">
                              {pk.personName} ({pk.relation}) — Öğrenci: {pk.studentName}
                            </p>
                            <p className="text-slate-400">İletişim: {pk.phone}</p>
                          </div>
                          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold">
                            Teslim Kodu: {pk.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="font-display font-extrabold text-sm text-white">
                        {activeMgmtSubTab} Kayıtları ({students.length} Aktif Kayıt)
                      </h3>
                      <div className="divide-y divide-slate-800 text-xs">
                        {students.map(s => (
                          <div
                            key={s.id}
                            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={s.avatar}
                                alt={s.name}
                                className="w-10 h-10 rounded-xl object-cover"
                              />
                              <div>
                                <p className="font-bold text-white">
                                  {s.name} ({s.ageLabel})
                                </p>
                                <p className="text-slate-400">
                                  {s.className} • Veli: {s.parentName} ({s.parentPhone})
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-slate-800 text-amber-300 font-mono text-[11px]">
                              {s.passportId}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. EĞİTİM İŞLEMLERİ (YOKLAMA, KURUM DERS ZİLİ PLANI, KVKK İZİN/ONAY) */}
              {activeMgmtTab === 'egitim_islemleri' && (
                <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-5">
                  <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
                    {[
                      'Kurum Zili & Aylık Plan',
                      'Yoklama İşlemleri',
                      'İzin / Onay İşlemleri (KVKK)',
                      'Anket İşlemleri'
                    ].map(sub => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setActiveMgmtSubTab(sub)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                          activeMgmtSubTab === sub
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>

                  {activeMgmtSubTab === 'İzin / Onay İşlemleri (KVKK)' ? (
                    <div className="space-y-3">
                      <h3 className="font-display font-extrabold text-sm text-white">
                        📸 Resmi Sosyal Medya (Instagram / YouTube) Veli Paylaşım İzin Durumları
                      </h3>
                      {diaryPosts.map(post => (
                        <div
                          key={post.id}
                          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
                        >
                          <p className="font-bold text-white">
                            {post.className} — &ldquo;{post.caption}&rdquo; ({post.scope})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {post.consents.map((c, idx) => (
                              <span
                                key={idx}
                                className={`px-3 py-1 rounded-xl font-bold ${
                                  c.decision.includes('İzin Veriyorum')
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : c.decision.includes('İzin Vermiyorum')
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {c.parentName} ({c.studentName}): {c.decision}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Kurum Ders & Teneffüs Zili Aylık Plan Girişi */
                    <div className="space-y-4">
                      <h3 className="font-display font-extrabold text-sm text-white">
                        🔔 Otomatik Kurum Ders Başlangıç, Bitiş ve Ara (Teneffüs) Saatleri Tanımlama
                      </h3>
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          if (!newBellTitle.trim()) return;
                          setBellSlots(prev => [
                            ...prev,
                            {
                              id: `slot-${Date.now()}`,
                              title: newBellTitle.trim(),
                              type: newBellType,
                              startTime: newBellStart,
                              endTime: newBellEnd,
                              remainingMinutes: 30,
                              isCurrent: false
                            }
                          ]);
                          setNewBellTitle('');
                          triggerAlert(
                            '🔔 Yeni ders/teneffüs zili saati eklendi ve veli/öğretmen ekranlarına yayınlandı!',
                            'lesson'
                          );
                        }}
                        className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs"
                      >
                        <input
                          type="text"
                          value={newBellTitle}
                          onChange={e => setNewBellTitle(e.target.value)}
                          placeholder="Ders veya Mola Adı..."
                          className="h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                        />
                        <input
                          type="time"
                          value={newBellStart}
                          onChange={e => setNewBellStart(e.target.value)}
                          className="h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                        />
                        <input
                          type="time"
                          value={newBellEnd}
                          onChange={e => setNewBellEnd(e.target.value)}
                          className="h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                        />
                        <button
                          type="submit"
                          className="h-10 rounded-xl bg-amber-500 text-slate-950 font-extrabold cursor-pointer"
                        >
                          + Zil Planına Ekle
                        </button>
                      </form>

                      <div className="space-y-2">
                        {bellSlots.map(slot => (
                          <div
                            key={slot.id}
                            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-bold text-white">{slot.title}</span>{' '}
                              <span className="text-amber-400 font-mono">
                                ({slot.startTime} - {slot.endTime})
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setBellSlots(prev =>
                                  prev.map(b => ({ ...b, isCurrent: b.id === slot.id }))
                                );
                                triggerAlert(
                                  `🔔 Aktif kurum zili "${slot.title}" olarak değiştirildi!`,
                                  'lesson'
                                );
                              }}
                              className={`px-3 py-1 rounded-xl font-bold cursor-pointer ${
                                slot.isCurrent
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {slot.isCurrent ? 'Şu An Aktif ✓' : 'Aktif Saat Yap'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. SAĞLIK İŞLEMLERİ (İLAÇ/SALGIN & BOY-KİLO TAKİBİ) */}
              {activeMgmtTab === 'saglik_islemleri' && (
                <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4">
                  <h3 className="font-display font-extrabold text-base text-white">
                    🩺 Öğrenci Boy-Kilo Gelişim Takibi, Alerji ve Salgın / İlaç Listesi
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {students.map(s => (
                      <div
                        key={s.id}
                        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-white text-sm">{s.name}</span>
                          <span className="text-amber-400 font-bold">
                            📏 {s.heightCm} cm • ⚖️ {s.weightKg} kg
                          </span>
                        </div>
                        <p className="text-slate-400">
                          Alerji:{' '}
                          <strong className="text-rose-400">
                            {s.allergies.length > 0 ? s.allergies.join(', ') : 'Yok'}
                          </strong>
                        </p>
                        {s.medicines.map(m => (
                          <div key={m.id} className="p-2 rounded-xl bg-slate-800 text-slate-200">
                            💊 {m.time} — {m.medicineName} ({m.stomachStatus}, {m.howToGive}) •{' '}
                            <span className="text-amber-300">Tanı: {m.diseaseName}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. SERVİS İŞLEMLERİ */}
              {activeMgmtTab === 'servis_islemleri' && (
                <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4">
                  <h3 className="font-display font-extrabold text-base text-white">
                    🚌 Sıralı Servis Rotası (Root) ve Sabah/Akşam İstisna Durumları
                  </h3>
                  <div className="space-y-2.5">
                    {shuttleStops.map(st => (
                      <div
                        key={st.stopOrder}
                        className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="text-amber-400 font-bold mr-2">
                            #{st.stopOrder}. Durak ({st.plannedTime})
                          </span>
                          <strong className="text-white">{st.studentName}</strong> — {st.addressStop}
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-slate-800 text-emerald-300 font-bold">
                          {st.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. RAPORLAR & AJANDA (GÖRSELDEKİ 4 KART + TAKVİM AJANDA + DUYURU) */}
              {activeMgmtTab === 'raporlar_ajanda' && (
                <div className="space-y-6">
                  {/* 4 Cards from User's Uploaded Screenshot: Doğum günü listesi, Alerji raporu, Giriş yapan kullanıcılar, Kullanım bilgileri */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      {
                        icon: Gift,
                        title: 'Doğum Günü Listesi',
                        desc: 'Kasım ayında 2 öğrenci (Ali Efe - 10 Kasım, Ada - 3 Kasım)'
                      },
                      {
                        icon: ShieldAlert,
                        title: 'Alerji & Salgın Raporu',
                        desc: '3 öğrencide besin hassasiyeti (Yer fıstığı, Yumurta, Laktoz)'
                      },
                      {
                        icon: UserCheck,
                        title: 'Giriş Yapan Kullanıcılar',
                        desc: 'Bugün 142 Veli, 14 Öğretmen ve 3 Servis Görevlisi aktif'
                      },
                      {
                        icon: Activity,
                        title: 'Kullanım Bilgileri',
                        desc: '%98.6 Günlük Karne okunma ve bildirim etkileşimi'
                      }
                    ].map((card, i) => (
                      <div
                        key={i}
                        className="bg-[#111827] border border-slate-800 rounded-3xl p-5 text-center space-y-2 hover:border-amber-500/50 transition"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto">
                          <card.icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-display font-extrabold text-sm text-white">
                          {card.title}
                        </h4>
                        <p className="text-[11px] text-slate-400">{card.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Ajanda (Kasım 2026 - 10-16 Kasım Atatürk Haftası) & Yeni Duyuru Ekleme */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display font-extrabold text-base text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-rose-400" />
                            <span>Ajanda — Kasım 2026</span>
                          </h3>
                          <p className="text-xs text-slate-400">Bugüne ait 1 özel hafta kaydınız var</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => (
                          <span key={d} className="text-slate-500 font-bold py-1">
                            {d}
                          </span>
                        ))}
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(day => (
                          <div
                            key={day}
                            className={`py-2 rounded-xl font-bold ${
                              day === 10
                                ? 'bg-rose-500 text-white ring-2 ring-rose-300'
                                : [2, 3, 12, 14].includes(day)
                                ? 'bg-slate-800 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="p-3.5 rounded-2xl bg-sky-500/15 border border-sky-400/30 text-xs text-sky-200">
                        <strong>🏫 Atatürk Haftası (10-16 Kasım):</strong> Tüm sınıflarda anma köşesi ve sanat etkinlikleri.
                      </div>
                    </div>

                    {/* Add Priority Announcement */}
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        if (!newAnnTitle.trim()) return;
                        const weightMap: Record<KidsAnnouncement['tag'], number> = {
                          'Önemli Duyuru': 4,
                          'Resmi Duyuru': 3,
                          Hatırlatma: 2,
                          'Normal Duyuru': 1
                        };
                        setAnnouncements(prev => [
                          ...prev,
                          {
                            id: Date.now(),
                            title: newAnnTitle.trim(),
                            content: newAnnContent.trim() || newAnnTitle.trim(),
                            date: 'Bugün',
                            tag: newAnnTag,
                            priorityWeight: weightMap[newAnnTag]
                          }
                        ]);
                        setNewAnnTitle('');
                        setNewAnnContent('');
                        triggerAlert(`📢 "${newAnnTag}" yayınlandı ve önem sırasına göre en üste sabitlendi!`);
                      }}
                      className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-3 text-xs"
                    >
                      <h3 className="font-display font-extrabold text-base text-white">
                        📢 Öncelik Etiketli Yeni Duyuru Yayınla
                      </h3>
                      <select
                        value={newAnnTag}
                        onChange={e => setNewAnnTag(e.target.value as any)}
                        className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                      >
                        <option value="Önemli Duyuru">🔴 Önemli Duyuru (En Üstte Sabit)</option>
                        <option value="Resmi Duyuru">🏛️ Resmi Duyuru (Üstte Sabit)</option>
                        <option value="Hatırlatma">⏰ Hatırlatma</option>
                        <option value="Normal Duyuru">📌 Normal Duyuru</option>
                      </select>
                      <input
                        type="text"
                        value={newAnnTitle}
                        onChange={e => setNewAnnTitle(e.target.value)}
                        placeholder="Duyuru Başlığı..."
                        className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                      />
                      <textarea
                        rows={2}
                        value={newAnnContent}
                        onChange={e => setNewAnnContent(e.target.value)}
                        placeholder="Duyuru içeriği..."
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                      <button
                        type="submit"
                        className="w-full h-10 rounded-xl bg-amber-500 text-slate-950 font-extrabold cursor-pointer"
                      >
                        Duyuruyu Yayınla
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* 6. STOK PRATİK MUHASEBE & DEPO */}
              {activeMgmtTab === 'stok_pratik_erp' && (
                <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-extrabold text-base text-white">
                      💳 Stok Pratik Kurumsal Ön Muhasebe, Aidat Tahsilatı &amp; GİB e-Fatura
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                      Sadece İşletme Sahiplerine Özel
                    </span>
                  </div>
                  <div className="divide-y divide-slate-800 text-xs">
                    {students.map(s => (
                      <div
                        key={s.id}
                        className="py-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-white">
                            {s.parentName} ({s.name})
                          </p>
                          <p className="text-slate-400">{s.className}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-white">
                            ₺{s.tuitionAmount.toLocaleString('tr-TR')}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full font-bold ${
                              s.tuitionPaid
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {s.tuitionPaid
                              ? `Ödendi (${s.invoiceNo || 'e-Fatura'})`
                              : 'Vade Bekliyor'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. DİĞER İŞLEMLER */}
              {activeMgmtTab === 'diger_islemler' && (
                <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-3 text-xs text-slate-300">
                  <h3 className="font-display font-extrabold text-base text-white">
                    ℹ️ Teknik Destek &amp; Erişilebilirlik Ayarları
                  </h3>
                  <p>
                    İSTEM Kids ve Stok Pratik 7/24 Kurumsal Destek Hattı: <strong>0850 300 İSTEM</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          HIZLI TALEBİNİ İLET MODALI
         ===================================================================== */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white text-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold bg-secondary-fixed text-secondary px-2.5 py-0.5 rounded-full">
                  Hızlı Talebini İlet
                </span>
                <h3 className="font-display font-extrabold text-base text-slate-900 mt-1">
                  Öğretmen veya Yönetime Hazır Şablonlu Bilgilendirme İlet
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendParentRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1.5">
                  1. Matbu Bilgilendirme Konusu Seçin:
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {(
                    [
                      'Kapıdayım, öğrenciyi teslim alacağım',
                      'Öğrenciyi erken alma talebi',
                      'Öğrenciyi geç alacağım / geç getireceğim',
                      'Öğretmen / Yönetim görüşme talebi',
                      'Beslenme menüsü görüş / öneri / şikayet'
                    ] as const
                  ).map(tpl => (
                    <button
                      key={tpl}
                      type="button"
                      onClick={() => setReqTemplate(tpl)}
                      className={`p-2.5 rounded-xl border text-left font-bold transition cursor-pointer ${
                        reqTemplate === tpl
                          ? 'bg-indigo-50 border-primary-container text-primary-container'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      • {tpl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  2. İletilecek Muhatap (Yönetim veya Öğretmen):
                </label>
                <select
                  value={reqRecipient}
                  onChange={e => setReqRecipient(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                >
                  <option value="Ayşe Yılmaz (Sınıf Öğretmeni)">
                    👩‍🏫 Ayşe Yılmaz (Papatyalar Sınıf Öğretmeni)
                  </option>
                  <option value="Elif Kaya (Sınıf Öğretmeni)">
                    👩‍🏫 Elif Kaya (Yıldızlar Sınıf Öğretmeni)
                  </option>
                  <option value="Yönetim">🏛️ Kreş Yönetimi / Müdür</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-extrabold text-slate-700">
                    3. Özel Notunuz (Sınırlı Karakter):
                  </label>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    {reqShortNote.length} / 140 karakter
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={140}
                  value={reqShortNote}
                  onChange={e => setReqShortNote(e.target.value.slice(0, 140))}
                  placeholder="Varsa kısa açıklamanızı yazınız (maksimum 140 karakter)..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 font-bold cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary-container text-white font-extrabold cursor-pointer"
                >
                  🔔 Sesli Bildirimle Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
