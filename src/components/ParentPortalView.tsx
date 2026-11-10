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
  onRoleChange?: (role: IstemKidsRole) => void;
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

type TeacherSectionTab =
  | 'yoklama_teslim'
  | 'beslenme_karne'
  | 'ilac_saglik'
  | 'veli_talepleri'
  | 'kresten_gunlukler'
  | 'bireysel_kazanimlar'
  | 'sinif_servis'
  | 'duyurular_zil';

type ServisSectionTab =
  | 'aktif_rota'
  | 'rota_degisiklik'
  | 'rota_planlama'
  | 'teslim_alici'
  | 'trafik_bildirim';

type KurumSectionTab =
  | 'taksit_odeme_onay'
  | 'zil_planlama'
  | 'veli_talepleri'
  | 'kayit_sozlesme'
  | 'beslenme_yonetimi'
  | 'ilac_salgin_merkezi'
  | 'servis_denetimi'
  | 'duyuru_gunluk_kvkk'
  | 'stok_pratik_erp';

type ManagementMenuTab =
  | 'kayit_islemleri'
  | 'egitim_islemleri'
  | 'saglik_islemleri'
  | 'servis_islemleri'
  | 'raporlar_ajanda'
  | 'stok_pratik_erp'
  | 'diger_islemler';

type InstallmentStatus = 'odeme_bekliyor' | 'odeme_yapildi' | 'zamani_gelmedi';

interface TuitionInstallmentItem {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  month: string;
  dueDate: string;
  amount: number;
  status: InstallmentStatus;
  invoiceNo?: string;
  pendingNotification?: {
    method: 'Elden Ödedim' | 'Banka İle Ödedim' | 'Kurumda POS İle Ödedim';
    note?: string;
    reportedAt: string;
  };
}

const INITIAL_MONTHLY_INSTALLMENTS: TuitionInstallmentItem[] = [
  { id: 'zeynep-eylul', studentId: 'zeynep', studentName: 'Zeynep Sarı', parentName: 'Fatih Sarı', month: 'Eylül 2026', dueDate: '05.09.2026', amount: 14500, status: 'odeme_yapildi', invoiceNo: 'GIB202600049101' },
  { id: 'zeynep-ekim', studentId: 'zeynep', studentName: 'Zeynep Sarı', parentName: 'Fatih Sarı', month: 'Ekim 2026', dueDate: '05.10.2026', amount: 14500, status: 'odeme_yapildi', invoiceNo: 'GIB202600049452' },
  { id: 'zeynep-kasim', studentId: 'zeynep', studentName: 'Zeynep Sarı', parentName: 'Fatih Sarı', month: 'Kasım 2026', dueDate: '05.11.2026', amount: 14500, status: 'odeme_bekliyor' },
  { id: 'zeynep-aralik', studentId: 'zeynep', studentName: 'Zeynep Sarı', parentName: 'Fatih Sarı', month: 'Aralık 2026', dueDate: '05.12.2026', amount: 14500, status: 'zamani_gelmedi' },
  { id: 'zeynep-ocak', studentId: 'zeynep', studentName: 'Zeynep Sarı', parentName: 'Fatih Sarı', month: 'Ocak 2027', dueDate: '05.01.2027', amount: 14500, status: 'zamani_gelmedi' },
  { id: 'zeynep-subat', studentId: 'zeynep', studentName: 'Zeynep Sarı', parentName: 'Fatih Sarı', month: 'Şubat 2027', dueDate: '05.02.2027', amount: 14500, status: 'zamani_gelmedi' },
  { id: 'zeynep-mart', studentId: 'zeynep', studentName: 'Zeynep Sarı', parentName: 'Fatih Sarı', month: 'Mart 2027', dueDate: '05.03.2027', amount: 14500, status: 'zamani_gelmedi' },
  { id: 'zeynep-nisan', studentId: 'zeynep', studentName: 'Zeynep Sarı', parentName: 'Fatih Sarı', month: 'Nisan 2027', dueDate: '05.04.2027', amount: 14500, status: 'zamani_gelmedi' },
  { id: 'zeynep-mayis', studentId: 'zeynep', studentName: 'Zeynep Sarı', parentName: 'Fatih Sarı', month: 'Mayıs 2027', dueDate: '05.05.2027', amount: 14500, status: 'zamani_gelmedi' },
  { id: 'zeynep-haziran', studentId: 'zeynep', studentName: 'Zeynep Sarı', parentName: 'Fatih Sarı', month: 'Haziran 2027', dueDate: '05.06.2027', amount: 14500, status: 'zamani_gelmedi' },

  { id: 'aliefe-eylul', studentId: 'aliefe', studentName: 'Ali Efe Kaya', parentName: 'Murat Kaya', month: 'Eylül 2026', dueDate: '05.09.2026', amount: 15500, status: 'odeme_yapildi', invoiceNo: 'GIB202600049108' },
  { id: 'aliefe-ekim', studentId: 'aliefe', studentName: 'Ali Efe Kaya', parentName: 'Murat Kaya', month: 'Ekim 2026', dueDate: '05.10.2026', amount: 15500, status: 'odeme_yapildi', invoiceNo: 'GIB202600049460' },
  { id: 'aliefe-kasim', studentId: 'aliefe', studentName: 'Ali Efe Kaya', parentName: 'Murat Kaya', month: 'Kasım 2026', dueDate: '05.11.2026', amount: 15500, status: 'odeme_bekliyor' },
  { id: 'aliefe-aralik', studentId: 'aliefe', studentName: 'Ali Efe Kaya', parentName: 'Murat Kaya', month: 'Aralık 2026', dueDate: '05.12.2026', amount: 15500, status: 'zamani_gelmedi' },
  { id: 'aliefe-ocak', studentId: 'aliefe', studentName: 'Ali Efe Kaya', parentName: 'Murat Kaya', month: 'Ocak 2027', dueDate: '05.01.2027', amount: 15500, status: 'zamani_gelmedi' },
  { id: 'aliefe-subat', studentId: 'aliefe', studentName: 'Ali Efe Kaya', parentName: 'Murat Kaya', month: 'Şubat 2027', dueDate: '05.02.2027', amount: 15500, status: 'zamani_gelmedi' },
  { id: 'aliefe-mart', studentId: 'aliefe', studentName: 'Ali Efe Kaya', parentName: 'Murat Kaya', month: 'Mart 2027', dueDate: '05.03.2027', amount: 15500, status: 'zamani_gelmedi' },
  { id: 'aliefe-nisan', studentId: 'aliefe', studentName: 'Ali Efe Kaya', parentName: 'Murat Kaya', month: 'Nisan 2027', dueDate: '05.04.2027', amount: 15500, status: 'zamani_gelmedi' },
  { id: 'aliefe-mayis', studentId: 'aliefe', studentName: 'Ali Efe Kaya', parentName: 'Murat Kaya', month: 'Mayıs 2027', dueDate: '05.05.2027', amount: 15500, status: 'zamani_gelmedi' },
  { id: 'aliefe-haziran', studentId: 'aliefe', studentName: 'Ali Efe Kaya', parentName: 'Murat Kaya', month: 'Haziran 2027', dueDate: '05.06.2027', amount: 15500, status: 'zamani_gelmedi' }
];

const VELI_MENU_ITEMS: { id: VeliSectionTab; label: string; icon: string; desc: string }[] = [
  { id: 'gunluk_karne', label: '📋 Günlük Karne & Yoklama', icon: '📋', desc: 'Beslenme, Uyku ve Yoklama' },
  { id: 'kazanimlar', label: '🎯 Bireysel Kazanımlar', icon: '🎯', desc: 'Gelişim ve Beceri Tablosu' },
  { id: 'kresten_gunlukler', label: '📸 Kreşten Günlükler (Şifreli & KVKK)', icon: '📸', desc: 'Kapalı Devre Albüm & İzin' },
  { id: 'ilac_saglik', label: '💊 İlaç & Sağlık Çizelgesi', icon: '💊', desc: 'Salgın Tanısı ve İlaç Zili' },
  { id: 'beslenme_menu', label: '🍽️ Haftalık Beslenme Tablosu', icon: '🍽️', desc: 'Haftalık Yemek Listesi' },
  { id: 'servis_rota', label: '🚌 Servis Rotası ve Veli Bildirimi', icon: '🚌', desc: 'Sıralı Durak ve Veli Onayı' },
  { id: 'duyurular', label: '📢 Duyurular (Önem Sıralı)', icon: '📢', desc: 'Önemli ve Resmi Bildirimler' },
  { id: 'aidat_odeme', label: '💳 Eğitim Taksiti', icon: '💳', desc: 'Tüm Aylar Taksit ve Ödeme Takibi' }
];

const TEACHER_MENU_ITEMS: { id: TeacherSectionTab; label: string; icon: string; desc: string }[] = [
  { id: 'yoklama_teslim', label: '📋 Sınıf Yoklama & Teslim Takibi', icon: '📋', desc: 'Geldi/Gelmedi ve Alıcı Onayı' },
  { id: 'beslenme_karne', label: '🍽️ Beslenme & Günlük Karne', icon: '🍽️', desc: 'Yemeyenleri İşaretle & Uyku' },
  { id: 'ilac_saglik', label: '💊 İlaç & Sağlık Çizelgesi', icon: '💊', desc: 'İlaç Zili ve Verdim Onayı' },
  { id: 'veli_talepleri', label: '🚪 Veli Talepleri & Kapı Bildirimleri', icon: '🚪', desc: 'Erken Alma ve Görüşme Talepleri' },
  { id: 'kresten_gunlukler', label: '📸 Kreşten Günlükler (KVKK Kalkanı)', icon: '📸', desc: 'Etkinlik Paylaşımı ve KVKK Uyarısı' },
  { id: 'bireysel_kazanimlar', label: '🎯 Bireysel Kazanımlar & Gelişim Girişi', icon: '🎯', desc: 'Gelişim Derecelendirme' },
  { id: 'sinif_servis', label: '🚌 Sınıf Servis Durumu', icon: '🚌', desc: 'Velisi Alan ve Servise Binenler' },
  { id: 'duyurular_zil', label: '📢 Duyurular & Ders Zili Saatleri', icon: '📢', desc: 'Kurum Duyuruları ve Zil Planı' }
];

const SERVIS_MENU_ITEMS: { id: ServisSectionTab; label: string; icon: string; desc: string }[] = [
  { id: 'aktif_rota', label: '🚌 Servis Rotası ve Veli Bildirimi', icon: '🚌', desc: 'Sıralı Durak ve Otomatik Bildirim' },
  { id: 'rota_degisiklik', label: '🔄 Gün İçi Rota Değişiklikleri', icon: '🔄', desc: 'Velisi Aldı / Akşam Eklendi' },
  { id: 'rota_planlama', label: '🗺️ Rota ve Tahmini Saat Planlama', icon: '🗺️', desc: 'Durak Sırası ve Saat Girişi' },
  { id: 'teslim_alici', label: '👶 Öğrenci Teslim & Yetkili Alıcı Kontrolü', icon: '👶', desc: 'Güvenli Teslim Kodu Doğrulama' },
  { id: 'trafik_bildirim', label: '📢 Trafik / Gecikme Bildirimi', icon: '📢', desc: 'Velilere Matbu Gecikme İletisi' }
];

const KURUM_MENU_ITEMS: { id: KurumSectionTab; label: string; icon: string; desc: string }[] = [
  { id: 'taksit_odeme_onay', label: '💳 Eğitim Taksiti & Veli Ödeme Onayları', icon: '💳', desc: 'Ödemeyi Yaptım Onayı & Tüm Aylar' },
  { id: 'zil_planlama', label: '🔔 Kurum Ders Zili & Aylık Planlama', icon: '🔔', desc: 'Ders, Teneffüs ve Uyku Saatleri' },
  { id: 'veli_talepleri', label: '🚪 Veli Talepleri & Kapı Bildirimleri', icon: '🚪', desc: 'Veli Hızlı Talepleri ve Yanıtlar' },
  { id: 'kayit_sozlesme', label: '📝 Kayıt, Sözleşme & Yetkili Alıcılar', icon: '📝', desc: 'Öğrenci, Sınıf ve Alıcı Listesi' },
  { id: 'beslenme_yonetimi', label: '🍽️ Haftalık Beslenme Tablosu Yönetimi', icon: '🍽️', desc: 'Haftalık Menü ve Yemeyen Raporu' },
  { id: 'ilac_salgin_merkezi', label: '💊 İlaç, Sağlık & Salgın Takip Merkezi', icon: '💊', desc: 'Salgın Tanıları ve İlaç Takibi' },
  { id: 'servis_denetimi', label: '🚌 Servis Rotaları Canlı Denetimi', icon: '🚌', desc: 'Araç Durakları ve İstisnalar' },
  { id: 'duyuru_gunluk_kvkk', label: '📢 Duyuru Yönetimi & Kreşten Günlükler', icon: '📢', desc: 'Önem Sıralı Duyuru & KVKK' },
  { id: 'stok_pratik_erp', label: '📦 Stok Pratik Ön Muhasebe, Depo & e-Fatura', icon: '📦', desc: 'GİB e-Fatura, Kasa ve Stoklar' }
];

export default function ParentPortalView({
  initialInstitutionCode = 'zerdalikres',
  initialKidsRole = 'veli',
  onRoleChange,
  onNavigateTo,
  onLogout
}: ParentPortalViewProps) {
  const [activeKidsRole, setActiveKidsRole] = useState<IstemKidsRole>(() => {
    const p = typeof window !== 'undefined' ? window.location.pathname : '';
    if (p.startsWith('/portal/ogretmen')) return 'ogretmen';
    if (p.startsWith('/portal/servis')) return 'servis_gorevlisi';
    if (p.startsWith('/portal/kurum')) return 'kurum_sahibi';
    if (p.startsWith('/portal/veli')) return 'veli';
    return initialKidsRole;
  });

  useEffect(() => {
    setActiveKidsRole(initialKidsRole);
  }, [initialKidsRole]);

  const handleSwitchRole = (nextRole: IstemKidsRole) => {
    setActiveKidsRole(nextRole);
    const targetPath =
      nextRole === 'ogretmen'
        ? '/portal/ogretmen'
        : nextRole === 'servis_gorevlisi'
        ? '/portal/servis'
        : nextRole === 'kurum_sahibi'
        ? '/portal/kurum'
        : '/portal/veli';
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState({ page: 'veli-portal', kidsRole: nextRole }, '', targetPath);
    }
    if (onRoleChange) {
      onRoleChange(nextRole);
    }
  };

  const activeRolePath =
    activeKidsRole === 'ogretmen'
      ? '/portal/ogretmen'
      : activeKidsRole === 'servis_gorevlisi'
      ? '/portal/servis'
      : activeKidsRole === 'kurum_sahibi'
      ? '/portal/kurum'
      : '/portal/veli';

  // Core Shared States for İSTEM Kids
  const [students, setStudents] = useState<KidsStudentRecord[]>(INITIAL_KIDS_STUDENTS);
  const [bellSlots, setBellSlots] = useState<KidsLessonBellSlot[]>(INITIAL_LESSON_BELL_SLOTS);
  const [requests, setRequests] = useState<ParentRequestTicket[]>(INITIAL_PARENT_REQUESTS);
  const [shuttleStops, setShuttleStops] = useState<SequentialShuttleStop[]>(INITIAL_SEQUENTIAL_SHUTTLE_ROUTE);
  const [announcements, setAnnouncements] = useState<KidsAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [diaryPosts, setDiaryPosts] = useState<KidsDiaryPost[]>(INITIAL_DIARY_POSTS);
  const [pickupPersons, setPickupPersons] = useState<KidsPickupPerson[]>(INITIAL_PICKUP_PERSONS);
  const [weeklyMenu, setWeeklyMenu] = useState(INITIAL_WEEKLY_DIET_MENU);
  const [installments, setInstallments] = useState<TuitionInstallmentItem[]>(INITIAL_MONTHLY_INSTALLMENTS);
  const [openPaymentReportId, setOpenPaymentReportId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Elden Ödedim' | 'Banka İle Ödedim' | 'Kurumda POS İle Ödedim'>('Banka İle Ödedim');
  const [paymentReportNote, setPaymentReportNote] = useState<string>('');
  const [mgmtSelectedStudentForTuition, setMgmtSelectedStudentForTuition] = useState<string>('zeynep');

  // Active child in Veli view (By default only 1 child for demo parent; optional sibling toggle if parent has >1 child)
  const [selectedChildId, setSelectedChildId] = useState<string>('zeynep');
  const [showDemoSibling, setShowDemoSibling] = useState<boolean>(false);
  const [isVeliMobileMenuOpen, setIsVeliMobileMenuOpen] = useState<boolean>(false);
  const [activeVeliTab, setActiveVeliTab] = useState<VeliSectionTab>('gunluk_karne');

  const [isTeacherMobileMenuOpen, setIsTeacherMobileMenuOpen] = useState<boolean>(false);
  const [activeTeacherTab, setActiveTeacherTab] = useState<TeacherSectionTab>('yoklama_teslim');
  const [selectedTeacherClass, setSelectedTeacherClass] = useState<string>('Papatyalar Sınıfı (3-6 Yaş Anaokulu)');
  const [teacherQuickNote, setTeacherQuickNote] = useState<Record<string, string>>({});
  const [teacherSleepStatus, setTeacherSleepStatus] = useState<Record<string, string>>({
    zeynep: '13:00 - 14:20 Mışıl Mışıl Uyudu',
    aliefe: '12:45 - 14:15 Uyudu',
    mert: 'Dinlendi (Uyumadı)'
  });
  const [teacherNewSkillStudentId, setTeacherNewSkillStudentId] = useState<string>('zeynep');
  const [teacherNewSkillCategory, setTeacherNewSkillCategory] = useState<string>('İnce & Kaba Motor');
  const [teacherNewSkillTitle, setTeacherNewSkillTitle] = useState<string>('');
  const [teacherNewSkillLevel, setTeacherNewSkillLevel] = useState<'Başlangıç' | 'Gelişiyor' | 'Çok İyi'>('Çok İyi');
  const [teacherHealthStudentId, setTeacherHealthStudentId] = useState<string>('zeynep');
  const [teacherHealthNote, setTeacherHealthNote] = useState<string>('');

  const [isServisMobileMenuOpen, setIsServisMobileMenuOpen] = useState<boolean>(false);
  const [activeServisTab, setActiveServisTab] = useState<ServisSectionTab>('aktif_rota');
  const [servisShiftMode, setServisShiftMode] = useState<'Sabah Seferi (Evden Okula)' | 'Akşam Seferi (Okuldan Eve)'>('Sabah Seferi (Evden Okula)');
  const [newStopStudentName, setNewStopStudentName] = useState<string>('');
  const [newStopTime, setNewStopTime] = useState<string>('');
  const [newStopAddress, setNewStopAddress] = useState<string>('');
  const [verifyCodeInput, setVerifyCodeInput] = useState<string>('');
  const [trafficDelayNote, setTrafficDelayNote] = useState<string>('');

  const [isKurumMobileMenuOpen, setIsKurumMobileMenuOpen] = useState<boolean>(false);
  const [activeKurumTab, setActiveKurumTab] = useState<KurumSectionTab>('taksit_odeme_onay');
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
  const [medHowToGive, setMedHowToGive] = useState('');
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
          howToGive: medHowToGive.trim() || 'Su ile karıştırarak',
          durationText: medDuration,
          enteredBy: activeKidsRole === 'kurum_sahibi' ? 'Yönetim' : 'Veli',
          given: false
        }
      ]
    }));
    setMedName('');
    setMedDiseaseName('');
    setMedHowToGive('');
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
        className={`relative z-20 border-b shadow-xs transition-colors ${
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
                  İstanbul Eğitim Merkezi (İSTEM) • Özel Zerdali Kreş &amp; Anaokulu • Aktif Sayfa:{' '}
                  <strong className="font-mono underline">{activeRolePath}</strong>
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
                    onClick={() => handleSwitchRole(acc.role)}
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

            {/* MOBILE / APP SANDWICH MENU DRAWER (Alt Alta İkonlu Mobil Menü - Mavi/Lacivert Zemin) */}
            {isVeliMobileMenuOpen && (
              <div className="lg:hidden bg-linear-to-b from-[#1E3A8A] to-[#0F2452] p-4 rounded-3xl border border-indigo-900 shadow-xl space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-white/15">
                  <div>
                    <span className="font-display font-extrabold text-[11px] text-sky-200 block">
                      👨‍👩‍👧 Veli &amp; Öğrenci Menüsü
                    </span>
                    <span className="font-display font-extrabold text-sm text-white block">
                      Hızlı Erişim Modülleri
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsVeliMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl bg-white/15 text-white hover:bg-white/25 cursor-pointer"
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
                            ? 'bg-[#F97316] text-white shadow-md border border-orange-400'
                            : 'bg-white/95 text-slate-800 hover:bg-white border border-slate-200/80'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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
              <div className="lg:col-span-8 xl:col-span-9 space-y-6 order-2 lg:order-2">
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
                            placeholder="Su ile karıştırarak"
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
                          🍽️ Haftalık Beslenme Tablosu
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
                          🚌 Servis Rotası ve Veli Bildirimi
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

                {/* TAB 8: 💳 EĞİTİM TAKSİTİ (TÜM AYLAR, DURUM RENKLERİ & ÖDEMEYİ YAPTIM BİLDİRİMİ) */}
                {activeVeliTab === 'aidat_odeme' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-xs font-extrabold bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full">
                          💳 Eğitim Taksiti
                        </span>
                        <h3 className="font-display font-extrabold text-lg text-slate-900 mt-2">
                          {currentStudent.name} — 2026 / 2027 Eğitim Dönemi Tüm Aylar Taksit Çizelgesi
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Ödemenizi 3D Secure ile anında yapabilir veya elden / banka yoluyla yaptıysanız <strong>Ödemeyi Yaptım</strong> butonu ile yönetime bildirebilirsiniz.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold shrink-0">
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                          ● Ödeme Bekliyor
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ● Ödeme Yapıldı
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          ● Zamanı Gelmedi
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {installments
                        .filter(inst => inst.studentId === currentStudent.id)
                        .map(inst => {
                          const isPaid = inst.status === 'odeme_yapildi';
                          const isWaiting = inst.status === 'odeme_bekliyor';
                          const isFuture = inst.status === 'zamani_gelmedi';
                          const isReportOpen = openPaymentReportId === inst.id;

                          return (
                            <div
                              key={inst.id}
                              className={`p-4 rounded-2xl border transition space-y-3 ${
                                isPaid
                                  ? 'bg-emerald-50/50 border-emerald-200'
                                  : isWaiting
                                  ? 'bg-rose-50/60 border-rose-300 shadow-2xs'
                                  : 'bg-amber-50/40 border-amber-200'
                              }`}
                            >
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2.5 flex-wrap">
                                    <span className="font-display font-black text-sm text-slate-900">
                                      {inst.month} — 💳 Eğitim Taksiti
                                    </span>
                                    <span className="text-xs font-extrabold text-slate-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                                      ₺{inst.amount.toLocaleString('tr-TR')}
                                    </span>
                                    <span className="text-[11px] text-slate-500 font-semibold">
                                      Son Ödeme: {inst.dueDate}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap pt-0.5">
                                    {isPaid && (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                        <span>Durum: Ödeme Yapıldı</span>
                                        {inst.invoiceNo && (
                                          <span className="font-mono text-[10px] opacity-80">
                                            ({inst.invoiceNo})
                                          </span>
                                        )}
                                      </span>
                                    )}
                                    {isWaiting && (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                                        <span>Durum: Ödeme Bekliyor</span>
                                      </span>
                                    )}
                                    {isFuture && (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                                        <span>Durum: Zamanı Gelmedi</span>
                                      </span>
                                    )}

                                    {inst.pendingNotification && !isPaid && (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-indigo-100 text-indigo-900 border border-indigo-300">
                                        ⏳ Yönetime Ödeme Bildirildi ({inst.pendingNotification.method} • {inst.pendingNotification.reportedAt}) — Onay Bekleniyor
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Action Buttons: 3D Secure Şimdi Öde + Ödemeyi Yaptım */}
                                <div className="flex flex-wrap items-center gap-2 shrink-0">
                                  {!isPaid ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setInstallments(prev =>
                                          prev.map(item =>
                                            item.id === inst.id
                                              ? {
                                                  ...item,
                                                  status: 'odeme_yapildi',
                                                  invoiceNo: 'GIB2026000' + Math.floor(10000 + Math.random() * 89999),
                                                  pendingNotification: undefined
                                                }
                                              : item
                                          )
                                        );
                                        setOpenPaymentReportId(null);
                                        triggerAlert(
                                          `✅ ${inst.month} Eğitim Taksiti 3D Secure ile ödendi ve durum "Ödeme Yapıldı" (Yeşil) olarak güncellendi!`
                                        );
                                      }}
                                      className="px-4 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-white text-xs font-extrabold cursor-pointer shadow-2xs transition"
                                    >
                                      3D Secure Şimdi Öde
                                    </button>
                                  ) : (
                                    <span className="px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                                      ✅ Tahsilat Tamamlandı
                                    </span>
                                  )}

                                  {/* Ödemeyi Yaptım Button: Active Green if odeme_bekliyor or zamani_gelmedi, Passive if odeme_yapildi */}
                                  <button
                                    type="button"
                                    disabled={isPaid}
                                    onClick={() => {
                                      if (isPaid) return;
                                      setOpenPaymentReportId(isReportOpen ? null : inst.id);
                                      setSelectedPaymentMethod('Banka İle Ödedim');
                                      setPaymentReportNote('');
                                    }}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${
                                      isPaid
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-2xs'
                                    }`}
                                  >
                                    Ödemeyi Yaptım
                                  </button>
                                </div>
                              </div>

                              {/* Expandable Payment Method Options when Parent clicks "Ödemeyi Yaptım" */}
                              {isReportOpen && !isPaid && (
                                <div className="p-4 rounded-2xl bg-white border-2 border-emerald-500/40 shadow-md space-y-3 animate-fade-in">
                                  <div className="flex items-center justify-between">
                                    <span className="font-display font-extrabold text-xs text-slate-900">
                                      ✅ {inst.month} Taksiti İçin Ödeme Yönteminizi Seçin (Yönetime Bildirim Gider)
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setOpenPaymentReportId(null)}
                                      className="p-1 rounded-lg bg-slate-100 text-slate-500 cursor-pointer"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {(
                                      [
                                        'Elden Ödedim',
                                        'Banka İle Ödedim',
                                        'Kurumda POS İle Ödedim'
                                      ] as const
                                    ).map(method => (
                                      <button
                                        key={method}
                                        type="button"
                                        onClick={() => setSelectedPaymentMethod(method)}
                                        className={`p-2.5 rounded-xl border text-xs font-extrabold text-left transition cursor-pointer ${
                                          selectedPaymentMethod === method
                                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                        }`}
                                      >
                                        • {method}
                                      </button>
                                    ))}
                                  </div>

                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                      type="text"
                                      value={paymentReportNote}
                                      onChange={e => setPaymentReportNote(e.target.value)}
                                      placeholder="Dekont No veya Açıklama (İsteğe Bağlı)"
                                      className="flex-1 h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nowTime = new Date().toLocaleTimeString('tr-TR', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        });
                                        setInstallments(prev =>
                                          prev.map(item =>
                                            item.id === inst.id
                                              ? {
                                                  ...item,
                                                  pendingNotification: {
                                                    method: selectedPaymentMethod,
                                                    note: paymentReportNote.trim() || undefined,
                                                    reportedAt: nowTime
                                                  }
                                                }
                                              : item
                                          )
                                        );
                                        setOpenPaymentReportId(null);
                                        setPaymentReportNote('');
                                        triggerAlert(
                                          `📩 "${inst.month} — ${selectedPaymentMethod}" ödeme bildiriminiz Kurum Yönetimine iletildi. Yönetim doğruladığında durum "Ödeme Yapıldı" (Yeşil) olacaktır.`,
                                          'request'
                                        );
                                      }}
                                      className="px-5 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer shrink-0"
                                    >
                                      Yönetime Ödeme Bildirimi Gönder
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>

              {/* LEFT 4 COLUMNS: SOLDA ALT ALTA İKONLU VELİ & ÖĞRENCİ MENÜSÜ (MAVİ-LACİVERT ZEMİN, AÇIK ÖĞELER, SEÇİLİ TURUNCU) */}
              <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 order-1 lg:order-1 sticky top-6">
                <div className="bg-linear-to-b from-[#1E3A8A] to-[#0F2452] rounded-3xl border border-indigo-900 shadow-lg p-4 space-y-3">
                  <div className="px-3 py-2 border-b border-white/15">
                    <span className="text-[11px] font-extrabold text-sky-200 block">
                      👨‍👩‍👧 Veli &amp; Öğrenci Menüsü
                    </span>
                    <h3 className="font-display font-extrabold text-sm text-white mt-0.5">
                      Hızlı Erişim Modülleri
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2">
                    {VELI_MENU_ITEMS.map(tab => {
                      const isActive = activeVeliTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveVeliTab(tab.id)}
                          className={`w-full text-left px-3.5 py-3 rounded-2xl transition cursor-pointer flex items-center justify-between gap-2 ${
                            isActive
                              ? 'bg-[#F97316] text-white shadow-md border border-orange-400'
                              : 'bg-white/95 hover:bg-white text-slate-800 border border-slate-200/80 shadow-2xs'
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
                                  isActive ? 'text-orange-100' : 'text-slate-500'
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
            ROL 2: /portal/ogretmen — 👩‍🏫 SINIF ÖĞRETMENİ SAYFASI
            (AÇIK TEMA • SOL MENÜ ZEMİNİ HARDAL SARISI • SEÇİLİ TURUNCU)
           =================================================================== */}
        {activeKidsRole === 'ogretmen' && (
          <div className="space-y-5 animate-fade-in">
            {/* Top Row: Teacher & Class Summary Bar + Mobile Sandwich Menu Trigger */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-amber-50 border-2 border-amber-500/40">
                  <div className="w-11 h-11 rounded-2xl bg-[#C68A00] text-white flex items-center justify-center text-xl font-black shadow-xs">
                    👩‍🏫
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-sm text-slate-900">
                        Ayşe Yılmaz • Sınıf Öğretmeni
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950">
                        📍 /portal/ogretmen
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">
                      {selectedTeacherClass} • Sınıf Mevcudu: {presentClassCount}/{totalClassCount} Öğrenci Okulda
                    </p>
                  </div>
                </div>

                {/* Class Selector for Teacher */}
                <div className="flex items-center gap-1.5">
                  {[
                    'Papatyalar Sınıfı (3-6 Yaş Anaokulu)',
                    'Minik Kalpler Sınıfı (0-3 Yaş Kreş)'
                  ].map(cls => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setSelectedTeacherClass(cls)}
                      className={`px-3 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                        selectedTeacherClass === cls
                          ? 'bg-[#C68A00] text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Sandwich Menu Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTeacherMobileMenuOpen(prev => !prev)}
                  className="lg:hidden px-4 py-3 rounded-2xl bg-[#C68A00] text-white font-display font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  {isTeacherMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  <span>Menü</span>
                </button>
              </div>
            </div>

            {/* MOBILE SANDWICH MENU DRAWER FOR /portal/ogretmen (Hardal Sarısı Zemin) */}
            {isTeacherMobileMenuOpen && (
              <div className="lg:hidden bg-linear-to-b from-[#C68A00] to-[#926000] p-4 rounded-3xl border border-amber-700 shadow-xl space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-white/20">
                  <div>
                    <span className="font-display font-extrabold text-[11px] text-amber-100 block">
                      👩‍🏫 Sınıf Öğretmeni Menüsü
                    </span>
                    <span className="font-display font-extrabold text-sm text-white block">
                      Hızlı Erişim Modülleri
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTeacherMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl bg-white/15 text-white hover:bg-white/25 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {TEACHER_MENU_ITEMS.map(tab => {
                    const isActive = activeTeacherTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveTeacherTab(tab.id);
                          setIsTeacherMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between transition cursor-pointer ${
                          isActive
                            ? 'bg-[#F97316] text-white shadow-md border border-orange-300'
                            : 'bg-white/95 text-slate-800 hover:bg-white border border-slate-200/80'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =================================================================
                ÖĞRETMEN ANA YERLEŞİMİ: SOLDA HARDAL SARISI MENÜ (4 SÜTUN) + SAĞDA İÇERİK (8 SÜTUN)
               ================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT 4 COLUMNS: HARDAL SARISI ZEMİNLİ HIZLI ERİŞİM MODÜLLERİ */}
              <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 order-1 sticky top-6">
                <div className="bg-linear-to-b from-[#C68A00] to-[#926000] rounded-3xl border border-amber-700 shadow-lg p-4 space-y-3">
                  <div className="px-3 py-2 border-b border-white/20">
                    <span className="text-[11px] font-extrabold text-amber-100 block">
                      👩‍🏫 Sınıf Öğretmeni Menüsü
                    </span>
                    <h3 className="font-display font-extrabold text-sm text-white mt-0.5">
                      Hızlı Erişim Modülleri
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2">
                    {TEACHER_MENU_ITEMS.map(tab => {
                      const isActive = activeTeacherTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTeacherTab(tab.id)}
                          className={`w-full text-left px-3.5 py-3 rounded-2xl transition cursor-pointer flex items-center justify-between gap-2 ${
                            isActive
                              ? 'bg-[#F97316] text-white shadow-md border border-orange-300'
                              : 'bg-white/95 hover:bg-white text-slate-800 border border-slate-200/80 shadow-2xs'
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
                                  isActive ? 'text-orange-100' : 'text-slate-500'
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

              {/* RIGHT 8 COLUMNS: ACTIVE TEACHER MODULE CONTENT */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-6 order-2">
                {/* MODÜL 1: 📋 SINIF YOKLAMA & TESLİM TAKİBİ */}
                {activeTeacherTab === 'yoklama_teslim' && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div>
                          <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                            📋 Sınıf Yoklama &amp; Teslim Takibi
                          </span>
                          <h3 className="font-display font-extrabold text-lg text-slate-900 mt-2">
                            {selectedTeacherClass} — Günlük Öğrenci Yoklama Listesi
                          </h3>
                          <p className="text-xs text-slate-500">
                            Öğrencilerin okula geliş durumunu tek tıkla işaretleyin; işaretlenen durum anında veli ekranına yansır.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setStudents(prev => prev.map(s => ({ ...s, attendance: 'geldi' })));
                            triggerAlert('✅ Tüm sınıf "Geldi (Okulda)" olarak işaretlendi!');
                          }}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer shrink-0"
                        >
                          ✅ Tüm Sınıfı Geldi İşaretle
                        </button>
                      </div>

                      <div className="space-y-3">
                        {students.map(std => (
                          <div
                            key={std.id}
                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3.5">
                              <img
                                src={std.avatar}
                                alt={std.name}
                                className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                              />
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-display font-extrabold text-sm text-slate-900">
                                    {std.name}
                                  </h4>
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                    {std.ageGroup === '0-3' ? '0-3 Yaş Kreş' : '3-6 Yaş Anaokulu'}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  Veli: {std.parentName} ({std.parentPhone})
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {(
                                [
                                  { id: 'geldi', label: '✅ Geldi (Okulda)', activeCls: 'bg-emerald-600 text-white' },
                                  { id: 'gelmedi', label: '❌ Gelmedi', activeCls: 'bg-rose-600 text-white' },
                                  { id: 'izinli', label: '📋 İzinli', activeCls: 'bg-amber-500 text-slate-950' }
                                ] as const
                              ).map(st => (
                                <button
                                  key={st.id}
                                  type="button"
                                  onClick={() => {
                                    updateStudent(std.id, s => ({ ...s, attendance: st.id }));
                                    triggerAlert(`📋 ${std.name} yoklama durumu "${st.label}" olarak güncellendi.`);
                                  }}
                                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                                    std.attendance === st.id
                                      ? st.activeCls
                                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  {st.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Authorized Pickup Persons Box */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                      <h3 className="font-display font-extrabold text-base text-slate-900">
                        👵 Öğrenciyi Teslim Almaya Yetkili Diğer Kişiler (Teslim Kodu Kontrolü)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {pickupPersons.map(pk => (
                          <div
                            key={pk.id}
                            className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between gap-3"
                          >
                            <div>
                              <p className="font-extrabold text-slate-900 text-sm">
                                {pk.personName} ({pk.relation})
                              </p>
                              <p className="text-slate-600">
                                Öğrenci: <strong>{pk.studentName}</strong> • Tel: {pk.phone}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="px-3 py-1 rounded-xl bg-amber-200/80 text-amber-950 font-mono font-extrabold block">
                                Kod: {pk.code}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* MODÜL 2: 🍽️ BESLENME & GÜNLÜK KARNE (İSTİSNA MANTIĞI: VARSAYILAN YEDİ) */}
                {activeTeacherTab === 'beslenme_karne' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                    <div className="border-b border-slate-100 pb-4">
                      <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
                        🍽️ Beslenme &amp; Günlük Karne (İstisna Mantığı)
                      </span>
                      <h3 className="font-display font-extrabold text-lg text-slate-900 mt-2">
                        Varsayılan "Yemeğini Yedi" Kuralı — Sadece Yemeyen Öğrencileri İşaretleyin
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Öğretmen vakit kaybetmesin diye tüm öğrenciler varsayılan olarak <strong>"Yemeğini Yedi ✅"</strong> görünür. Sadece yemeyen veya az yiyen çocuklara tıklamanız yeterlidir.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {students.map(std => (
                        <div
                          key={std.id}
                          className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 text-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={std.avatar}
                                alt={std.name}
                                className="w-11 h-11 rounded-2xl object-cover"
                              />
                              <div>
                                <h4 className="font-display font-extrabold text-sm text-slate-900">
                                  {std.name}
                                </h4>
                                <p className="text-[11px] text-slate-500">
                                  Alerji Uyarısı:{' '}
                                  <strong className="text-rose-600">
                                    {std.allergies.length > 0 ? std.allergies.join(', ') : 'Yok'}
                                  </strong>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-600">Öğle Uykusu:</span>
                              <select
                                value={teacherSleepStatus[std.id] || '13:00 - 14:15 Uyudu'}
                                onChange={e => {
                                  setTeacherSleepStatus(prev => ({
                                    ...prev,
                                    [std.id]: e.target.value
                                  }));
                                  triggerAlert(`😴 ${std.name} uyku durumu güncellendi.`);
                                }}
                                className="h-9 px-3 rounded-xl bg-white border border-slate-200 font-bold text-slate-800"
                              >
                                <option value="13:00 - 14:20 Mışıl Mışıl Uyudu">😴 Mışıl Mışıl Uyudu</option>
                                <option value="Dinlendi (Uyumadı)">🛋️ Dinlendi (Uyumadı)</option>
                                <option value="Kısa Uyudu (30 Dk)">⏱️ Kısa Uyudu (30 Dk)</option>
                              </select>
                            </div>
                          </div>

                          {/* 3 Öğün Tek Tık İstisna Seçimi */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {(
                              [
                                { key: 'breakfastAte', label: '🍳 Sabah Kahvaltısı' },
                                { key: 'lunchAte', label: '🍲 Öğle Yemeği' },
                                { key: 'snackAte', label: '🍎 İkindi Kahvaltısı' }
                              ] as const
                            ).map(meal => {
                              const ateVal = std.meals[meal.key];
                              return (
                                <button
                                  key={meal.key}
                                  type="button"
                                  onClick={() => {
                                    updateStudent(std.id, s => ({
                                      ...s,
                                      meals: { ...s.meals, [meal.key]: !s.meals[meal.key] }
                                    }));
                                    triggerAlert(
                                      !ateVal
                                        ? `🍽️ ${std.name} — ${meal.label}: "Yemeğini Yedi ✅" olarak güncellendi.`
                                        : `⚠️ ${std.name} — ${meal.label}: "Yemedi" olarak işaretlendi ve veli karnesine yansıtıldı.`
                                    );
                                  }}
                                  className={`p-3 rounded-2xl border font-extrabold text-left flex items-center justify-between transition cursor-pointer ${
                                    ateVal
                                      ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950'
                                      : 'bg-rose-100 border-rose-300 text-rose-950'
                                  }`}
                                >
                                  <span>{meal.label}</span>
                                  <span>{ateVal ? 'Yedi ✅' : 'Yemedi ❌'}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Gün Sonu Öğretmen Notu (Placeholder ile) */}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={teacherQuickNote[std.id] || ''}
                              onChange={e =>
                                setTeacherQuickNote(prev => ({ ...prev, [std.id]: e.target.value }))
                              }
                              placeholder="Veliye iletilecek gün sonu karne notu yazın..."
                              className="flex-1 h-10 px-3 rounded-xl bg-white border border-slate-200 font-semibold"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const noteText = (teacherQuickNote[std.id] || '').trim();
                                if (!noteText) return;
                                updateStudent(std.id, s => ({
                                  ...s,
                                  meals: { ...s.meals, teacherMealNote: noteText }
                                }));
                                setTeacherQuickNote(prev => ({ ...prev, [std.id]: '' }));
                                triggerAlert(`📝 ${std.name} için gün sonu öğretmen notu kaydedildi!`);
                              }}
                              className="px-4 h-10 rounded-xl bg-[#C68A00] hover:bg-[#926000] text-white font-extrabold cursor-pointer shrink-0"
                            >
                              Karne Notunu Kaydet
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODÜL 3: 💊 İLAÇ & SAĞLIK ÇİZELGESİ (İLAÇ ZİLİ & VERDİM ONAYI) */}
                {activeTeacherTab === 'ilac_saglik' && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                      <div>
                        <span className="text-xs font-extrabold bg-rose-100 text-rose-900 px-3 py-1 rounded-full">
                          💊 İlaç &amp; Sağlık Çizelgesi
                        </span>
                        <h3 className="font-display font-extrabold text-lg text-slate-900 mt-2">
                          Sınıf İlaç Saatleri ve Veliye Otomatik "İlacı Verildi" Bildirimi
                        </h3>
                        <p className="text-xs text-slate-500">
                          İlaç saati geldiğinde uyarı çalar. Öğretmen <strong>"İlacı Verdim"</strong> butonuna bastığında veliye anında sesli ve yazılı bildirim gider.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {students.flatMap(std =>
                          std.medicines.map(med => ({ std, med }))
                        ).map(({ std, med }) => (
                          <div
                            key={`${std.id}-${med.id}`}
                            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                              med.given
                                ? 'bg-emerald-50/70 border-emerald-200'
                                : 'bg-rose-50/70 border-rose-300'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-black text-sm text-rose-700">
                                  ⏰ {med.time}
                                </span>
                                <span className="font-display font-extrabold text-sm text-slate-900">
                                  {std.name} — {med.medicineName}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 font-bold text-[11px]">
                                  {med.stomachStatus}
                                </span>
                              </div>
                              <p className="text-slate-600">
                                <strong>Nasıl Verilecek:</strong> {med.howToGive} • <strong>Süre:</strong> {med.durationText}
                              </p>
                              <p className="text-rose-800 font-bold">
                                🩺 Salgın / Hastalık Kaydı: {med.diseaseName}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {med.given ? (
                                <span className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold">
                                  ✅ Verildi ({med.givenAt})
                                </span>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      triggerAlert(
                                        `🔔 İLAÇ ZİLİ UYARISI: ${std.name} isimli öğrencimizin saat ${med.time} (${med.medicineName}) ilaç vakti geldi!`,
                                        'medicine'
                                      )
                                    }
                                    className="px-3 py-2.5 rounded-xl bg-amber-100 text-amber-900 font-extrabold cursor-pointer"
                                  >
                                    🔔 İlaç Zili
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleGiveMedicine(std.id, med.id, med.medicineName, std.name)
                                    }
                                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold cursor-pointer shadow-xs"
                                  >
                                    ✅ İlacı Verdim
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Health / Fever Observation Alert to Parent & Management */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3 text-xs">
                      <h3 className="font-display font-extrabold text-base text-slate-900">
                        🌡️ Sınıf İçi Sağlık / Ateş Gözlemi Bildir (Veli ve Yönetime İletilir)
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <select
                          value={teacherHealthStudentId}
                          onChange={e => setTeacherHealthStudentId(e.target.value)}
                          className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                        >
                          {students.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={teacherHealthNote}
                          onChange={e => setTeacherHealthNote(e.target.value)}
                          placeholder="Örn: Ateşi 37.6 ölçüldü, halsizlik gözlemlendi..."
                          className="sm:col-span-2 h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!teacherHealthNote.trim()) return;
                          const stObj = students.find(s => s.id === teacherHealthStudentId);
                          triggerAlert(
                            `🩺 ${stObj?.name} için sağlık gözlemi ("${teacherHealthNote.trim()}") veliye ve kurum yönetimine iletildi!`,
                            'medicine'
                          );
                          setTeacherHealthNote('');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold cursor-pointer"
                      >
                        Sağlık Bilgisini Veli ve Yönetime Gönder
                      </button>
                    </div>
                  </div>
                )}

                {/* MODÜL 4: 🚪 VELİ TALEPLERİ & KAPI BİLDİRİMLERİ */}
                {activeTeacherTab === 'veli_talepleri' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="border-b border-slate-100 pb-4">
                      <span className="text-xs font-extrabold bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full">
                        🚪 Veli Talepleri &amp; Kapı Bildirimleri
                      </span>
                      <h3 className="font-display font-extrabold text-lg text-slate-900 mt-2">
                        Velilerden Gelen "Hızlı Talebini İlet" Bildirimleri
                      </h3>
                      <p className="text-xs text-slate-500">
                        Veli kapıya geldiğinde, erken alma veya görüşme talebi ilettiğinde buradan tek tıkla yanıtlayabilirsiniz.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {requests.map(req => (
                        <div
                          key={req.id}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold">
                                {req.templateType}
                              </span>
                              <span className="font-extrabold text-slate-900 text-sm">
                                {req.studentName} (Veli: {req.parentName})
                              </span>
                              <span className="text-slate-400 font-mono">{req.createdAt}</span>
                            </div>
                            <p className="text-slate-600">{req.shortNote}</p>
                            <span className="inline-block text-[11px] font-extrabold text-emerald-700">
                              Durum: {req.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setRequests(prev =>
                                  prev.map(r =>
                                    r.id === req.id
                                      ? { ...r, status: 'Öğretmen Gördü / Hazırlanıyor 👍' }
                                      : r
                                  )
                                );
                                triggerAlert(
                                  `👍 ${req.parentName} velisine "Öğretmen bildirimizi gördü, öğrenci hazırlanıyor" bilgisi iletildi!`
                                );
                              }}
                              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold cursor-pointer"
                            >
                              👍 Gördüm, Hazırlıyorum
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODÜL 5: 📸 KREŞTEN GÜNLÜKLER (FOTOĞRAF PAYLAŞIMI & KVKK KALKANI) */}
                {activeTeacherTab === 'kresten_gunlukler' && (
                  <div className="space-y-6">
                    {/* KVKK Warning Banner for Teacher */}
                    <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 flex items-start gap-3.5 text-xs">
                      <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-display font-extrabold text-sm text-rose-950 block">
                          🛡️ KVKK Fotoğraf &amp; Sosyal Medya Kalkanı Uyarısı
                        </span>
                        <p className="text-rose-900 leading-relaxed">
                          Sınıfınızda velisi sosyal medya paylaşım izni vermeyen öğrenci bulunmaktadır:{' '}
                          <strong>Mert Demir (Veli: Burak Demir — Sosyal Medya İzni Yok ❌)</strong>. Grup fotoğraflarında bu öğrencimizin yer almamasına veya yüzünün otomatik buzlanmasına dikkat ediniz.
                        </p>
                      </div>
                    </div>

                    {/* Teacher Photo Share Form */}
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        if (!newDiaryCaption.trim()) return;
                        const created: KidsDiaryPost = {
                          id: Date.now(),
                          className: selectedTeacherClass,
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
                            ? `📸 Görsel "Kreşten Günlükler"e eklendi ve ${newDiaryScope} velilerine sosyal medya izin bildirimi gönderildi!`
                            : '📸 Görsel şifreli "Kreşten Günlükler" akışında paylaşıldı!'
                        );
                      }}
                      className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs"
                    >
                      <h3 className="font-display font-extrabold text-base text-slate-900">
                        📸 Kreşten Günlükler&apos;e Yeni Etkinlik Fotoğrafı Ekle
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={newDiaryCaption}
                          onChange={e => setNewDiaryCaption(e.target.value)}
                          placeholder="Etkinlik açıklaması yazın (Örn: Ahşap bloklarla denge kulesi yaptık)..."
                          className="md:col-span-2 h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                        />
                        <select
                          value={newDiaryScope}
                          onChange={e => setNewDiaryScope(e.target.value as any)}
                          className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                        >
                          <option value="Tek Öğrenci">Tek Öğrenci (Sadece İlgili Veliye Sor)</option>
                          <option value="Tüm Sınıf (Grup)">Tüm Sınıf (Grup Velilerine Sor)</option>
                        </select>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newDiarySocialReq}
                            onChange={e => setNewDiarySocialReq(e.target.checked)}
                          />
                          <span>
                            Bu görseli okulun resmi sosyal medyasında paylaşmak için velilerden KVKK onayı iste
                          </span>
                        </label>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-[#C68A00] hover:bg-[#926000] text-white font-extrabold cursor-pointer shrink-0"
                        >
                          📸 Albümde Paylaş
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* MODÜL 6: 🎯 BİREYSEL KAZANIMLAR & GELİŞİM GİRİŞİ */}
                {activeTeacherTab === 'bireysel_kazanimlar' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5 text-xs">
                    <div>
                      <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                        🎯 Bireysel Kazanımlar &amp; Gelişim Girişi
                      </span>
                      <h3 className="font-display font-extrabold text-lg text-slate-900 mt-2">
                        Öğrenci Gelişim ve Beceri Değerlendirme Formu
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <select
                        value={teacherNewSkillStudentId}
                        onChange={e => setTeacherNewSkillStudentId(e.target.value)}
                        className="h-10 px-3 rounded-xl bg-white border border-slate-200 font-bold"
                      >
                        {students.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={teacherNewSkillTitle}
                        onChange={e => setTeacherNewSkillTitle(e.target.value)}
                        placeholder="Kazanım başlığı yazın..."
                        className="sm:col-span-2 h-10 px-3 rounded-xl bg-white border border-slate-200 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!teacherNewSkillTitle.trim()) return;
                          updateStudent(teacherNewSkillStudentId, s => ({
                            ...s,
                            competencies: [
                              ...s.competencies,
                              {
                                category: teacherNewSkillCategory as any,
                                skill: teacherNewSkillTitle.trim(),
                                level: teacherNewSkillLevel,
                                teacherComment: 'Öğretmen tarafından değerlendirildi ve eklendi.'
                              }
                            ]
                          }));
                          setTeacherNewSkillTitle('');
                          triggerAlert('🎯 Yeni bireysel kazanım öğrenci karnesine eklendi!');
                        }}
                        className="h-10 rounded-xl bg-[#C68A00] hover:bg-[#926000] text-white font-extrabold cursor-pointer"
                      >
                        + Kazanım Ekle
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(students.find(s => s.id === teacherNewSkillStudentId)?.competencies || []).map(
                        (comp, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                          >
                            <div>
                              <span className="text-[11px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                                {comp.category}
                              </span>
                              <h4 className="font-display font-extrabold text-sm text-slate-900 mt-1">
                                {comp.skill}
                              </h4>
                              <p className="text-slate-600">{comp.teacherComment}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold">
                              {comp.level}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* MODÜL 7: 🚌 SINIF SERVİS DURUMU */}
                {activeTeacherTab === 'sinif_servis' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
                    <div>
                      <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
                        🚌 Sınıf Servis Durumu
                      </span>
                      <h3 className="font-display font-extrabold text-lg text-slate-900 mt-2">
                        Gün İçi Velisi Tarafından Alınan Öğrencileri Servis Listesinden Düşür
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {shuttleStops.map(stop => (
                        <div
                          key={stop.stopOrder}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <h4 className="font-display font-extrabold text-sm text-slate-900">
                              #{stop.stopOrder}. Durak — {stop.studentName}
                            </h4>
                            <p className="text-slate-600">
                              Durak: {stop.addressStop} • Güncel Durum: <strong>{stop.status}</strong>
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCompleteShuttleStop(
                                stop.stopOrder,
                                'Öğlen Velisi Okuldan Aldı (Akşam Serviste Yok)',
                                'Sınıf Öğretmeni'
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold cursor-pointer shrink-0"
                          >
                            🚗 Velisi Okuldan Aldı (Servise Binmeyecek)
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODÜL 8: 📢 DUYURULAR & DERS ZİLİ SAATLERİ */}
                {activeTeacherTab === 'duyurular_zil' && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                      <h3 className="font-display font-extrabold text-base text-slate-900">
                        🔔 Günlük Kurum Ders &amp; Teneffüs Zili Çizelgesi
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {bellSlots.map(slot => (
                          <div
                            key={slot.id}
                            className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                              slot.isCurrent
                                ? 'bg-amber-50 border-amber-400 font-extrabold'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span>{slot.title}</span>
                            <span className="font-mono font-bold text-slate-700">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                      <h3 className="font-display font-extrabold text-base text-slate-900">
                        📢 Kurum Duyuruları (Önem Sıralı)
                      </h3>
                      {sortedAnnouncements.map(ann => (
                        <div
                          key={ann.id}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[11px]">
                              {ann.tag}
                            </span>
                            <span className="text-slate-500 font-bold">{ann.date}</span>
                          </div>
                          <h4 className="font-display font-extrabold text-sm text-slate-900">
                            {ann.title}
                          </h4>
                          <p className="text-slate-600">{ann.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            ROL 3: /portal/servis — 🚌 SERVİS & HOSTES SAYFASI
            (AÇIK TEMA • SOL MENÜ ZEMİNİ ZÜMRÜT YEŞİLİ • SEÇİLİ TURUNCU)
           =================================================================== */}
        {activeKidsRole === 'servis_gorevlisi' && (
          <div className="space-y-5 animate-fade-in">
            {/* Top Row: Shuttle Vehicle & Crew Summary + Shift Switcher + Mobile Sandwich Button */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-emerald-50 border-2 border-emerald-600/30">
                  <div className="w-11 h-11 rounded-2xl bg-[#047857] text-white flex items-center justify-center text-xl font-black shadow-xs">
                    🚌
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-sm text-slate-900">
                        Plaka: 34 IST 01 • Şoför: Hasan Kaptan &amp; Hostes: Sevgi Abla
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-950">
                        📍 /portal/servis
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">
                      {servisShiftMode} • Sıra Atlanamaz Zincirleme Veli Bildirim Sistemi Aktif
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {(
                    [
                      'Sabah Seferi (Evden Okula)',
                      'Akşam Seferi (Okuldan Eve)'
                    ] as const
                  ).map(shift => (
                    <button
                      key={shift}
                      type="button"
                      onClick={() => setServisShiftMode(shift)}
                      className={`px-3 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                        servisShiftMode === shift
                          ? 'bg-[#047857] text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {shift}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsServisMobileMenuOpen(prev => !prev)}
                  className="lg:hidden px-4 py-3 rounded-2xl bg-[#047857] text-white font-display font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  {isServisMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  <span>Menü</span>
                </button>
              </div>
            </div>

            {/* MOBILE SANDWICH MENU DRAWER FOR /portal/servis (Zümrüt Yeşili Zemin) */}
            {isServisMobileMenuOpen && (
              <div className="lg:hidden bg-linear-to-b from-[#047857] to-[#064E3B] p-4 rounded-3xl border border-emerald-800 shadow-xl space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-white/20">
                  <div>
                    <span className="font-display font-extrabold text-[11px] text-emerald-100 block">
                      🚌 Servis &amp; Hostes Menüsü
                    </span>
                    <span className="font-display font-extrabold text-sm text-white block">
                      Hızlı Erişim Modülleri
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsServisMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl bg-white/15 text-white hover:bg-white/25 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {SERVIS_MENU_ITEMS.map(tab => {
                    const isActive = activeServisTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveServisTab(tab.id);
                          setIsServisMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between transition cursor-pointer ${
                          isActive
                            ? 'bg-[#F97316] text-white shadow-md border border-orange-300'
                            : 'bg-white/95 text-slate-800 hover:bg-white border border-slate-200/80'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =================================================================
                SERVİS ANA YERLEŞİMİ: SOLDA ZÜMRÜT YEŞİLİ MENÜ (4 SÜTUN) + SAĞDA İÇERİK (8 SÜTUN)
               ================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT 4 COLUMNS: ZÜMRÜT YEŞİLİ ZEMİNLİ HIZLI ERİŞİM MODÜLLERİ */}
              <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 order-1 sticky top-6">
                <div className="bg-linear-to-b from-[#047857] to-[#064E3B] rounded-3xl border border-emerald-800 shadow-lg p-4 space-y-3">
                  <div className="px-3 py-2 border-b border-white/20">
                    <span className="text-[11px] font-extrabold text-emerald-100 block">
                      🚌 Servis &amp; Hostes Menüsü
                    </span>
                    <h3 className="font-display font-extrabold text-sm text-white mt-0.5">
                      Hızlı Erişim Modülleri
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2">
                    {SERVIS_MENU_ITEMS.map(tab => {
                      const isActive = activeServisTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveServisTab(tab.id)}
                          className={`w-full text-left px-3.5 py-3 rounded-2xl transition cursor-pointer flex items-center justify-between gap-2 ${
                            isActive
                              ? 'bg-[#F97316] text-white shadow-md border border-orange-300'
                              : 'bg-white/95 hover:bg-white text-slate-800 border border-slate-200/80 shadow-2xs'
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
                                  isActive ? 'text-orange-100' : 'text-slate-500'
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

              {/* RIGHT 8 COLUMNS: ACTIVE SERVIS MODULE CONTENT */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-6 order-2">
                {/* MODÜL 1: 🚌 SERVİS ROTASI VE VELİ BİLDİRİMİ (SIRA ATLANAMAZ) */}
                {activeServisTab === 'aktif_rota' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
                          🚌 Servis Rotası ve Veli Bildirimi
                        </span>
                        <h3 className="font-display font-extrabold text-lg text-slate-900 mt-2">
                          {servisShiftMode} — Sıralı Öğrenci Alım / İndirim Listesi
                        </h3>
                        <p className="text-xs text-slate-500">
                          Duraklar sırasıyla ilerler, sıra atlanamaz. Mevcut durak onaylandığında bir sonraki durağın velisine otomatik bildirim gider.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShuttleStops(INITIAL_SEQUENTIAL_SHUTTLE_ROUTE)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer shrink-0"
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
                                ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                                : 'bg-slate-100/70 border-slate-200 opacity-75'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="w-11 h-11 rounded-2xl bg-[#047857] text-white font-black text-sm flex items-center justify-center shrink-0">
                                {stop.stopOrder}. Durak
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-display font-extrabold text-base text-slate-900">
                                    {stop.studentName}
                                  </h4>
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono font-bold text-xs">
                                    Planlanan: {stop.plannedTime}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600">
                                  {stop.addressStop} • Veli: {stop.parentName} ({stop.parentPhone})
                                </p>
                                <span className="text-xs font-extrabold text-emerald-800 mt-1 block">
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
                                        'Servise Bindi / Teslim Edildi 🚌',
                                        'Servis Hostesi'
                                      )
                                    }
                                    className="px-4 py-2.5 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-extrabold cursor-pointer"
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
                                </>
                              ) : (
                                <span className="px-3.5 py-2 rounded-xl bg-slate-200 text-slate-600 text-xs font-extrabold flex items-center gap-1.5">
                                  <Lock className="w-4 h-4" />
                                  <span>Sıra Atlanamaz (Önce #{firstActiveStop?.stopOrder}. Durak)</span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* MODÜL 2: 🔄 GÜN İÇİ ROTA DEĞİŞİKLİKLERİ */}
                {activeServisTab === 'rota_degisiklik' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
                    <div>
                      <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                        🔄 Gün İçi Rota Değişiklikleri
                      </span>
                      <h3 className="font-display font-extrabold text-lg text-slate-900 mt-2">
                        Velisi Okuldan Alanlar &amp; Akşam Servisine Sonradan Eklenenler
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {shuttleStops.map(stop => (
                        <div
                          key={stop.stopOrder}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <h4 className="font-display font-extrabold text-sm text-slate-900">
                              #{stop.stopOrder}. Durak — {stop.studentName}
                            </h4>
                            <p className="text-slate-600">Güncel Durum: {stop.status}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleCompleteShuttleStop(
                                  stop.stopOrder,
                                  'Öğlen Velisi Okuldan Aldı (Akşam Serviste Yok)',
                                  'Servis Hostesi'
                                )
                              }
                              className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold cursor-pointer"
                            >
                              Velisi Okuldan Aldı
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShuttleStops(prev =>
                                  prev.map(st =>
                                    st.stopOrder === stop.stopOrder
                                      ? {
                                          ...st,
                                          completed: false,
                                          status: 'Akşam Dönüş Rotasına Eklendi (Hazır Bekliyor)'
                                        }
                                      : st
                                  )
                                );
                                triggerAlert(
                                  `🚌 ${stop.studentName} akşam dönüş servis rotasına dahil edildi!`,
                                  'shuttle'
                                );
                              }}
                              className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-extrabold cursor-pointer"
                            >
                              + Akşam Servisine Ekle
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODÜL 3: 🗺️ ROTA VE TAHMİNİ SAAT PLANLAMA */}
                {activeServisTab === 'rota_planlama' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
                    <h3 className="font-display font-extrabold text-base text-slate-900">
                      🗺️ Servis Güzergahı (Root) ve Tahmini Alınış / Bırakılış Saati Ekle
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <input
                        type="text"
                        value={newStopStudentName}
                        onChange={e => setNewStopStudentName(e.target.value)}
                        placeholder="Öğrenci Adı Soyadı..."
                        className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                      />
                      <input
                        type="time"
                        value={newStopTime}
                        onChange={e => setNewStopTime(e.target.value)}
                        className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                      />
                      <input
                        type="text"
                        value={newStopAddress}
                        onChange={e => setNewStopAddress(e.target.value)}
                        placeholder="Durak / Cadde / Site Adresi..."
                        className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newStopStudentName.trim() || !newStopAddress.trim()) return;
                          const nextOrder = shuttleStops.length + 1;
                          setShuttleStops(prev => [
                            ...prev,
                            {
                              stopOrder: nextOrder,
                              studentId: 'custom-' + Date.now(),
                              studentName: newStopStudentName.trim(),
                              parentName: 'Kayıtlı Veli',
                              parentPhone: '0532 000 00 00',
                              addressStop: newStopAddress.trim(),
                              plannedTime: newStopTime || '08:35',
                              morningAboard: true,
                              eveningAboard: true,
                              status: 'Sırada Bekliyor',
                              completed: false
                            }
                          ]);
                          setNewStopStudentName('');
                          setNewStopAddress('');
                          triggerAlert('🗺️ Yeni durak ve tahmini saat servis rotasına eklendi!', 'shuttle');
                        }}
                        className="h-10 rounded-xl bg-[#047857] text-white font-extrabold cursor-pointer"
                      >
                        + Durağı Rotaya Ekle
                      </button>
                    </div>
                  </div>
                )}

                {/* MODÜL 4: 👶 ÖĞRENCİ TESLİM & YETKİLİ ALICI KONTROLÜ */}
                {activeServisTab === 'teslim_alici' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
                    <h3 className="font-display font-extrabold text-base text-slate-900">
                      👶 Durakta Yetkili Alıcı (Anneanne, Dede, Teyze) ve Teslim Kodu Doğrulama
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={verifyCodeInput}
                        onChange={e => setVerifyCodeInput(e.target.value)}
                        placeholder="Alıcının söylediği teslim kodunu girin (Örn: ZER-8492)..."
                        className="flex-1 h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const found = pickupPersons.find(
                            p => p.code.toLowerCase() === verifyCodeInput.trim().toLowerCase()
                          );
                          if (found) {
                            triggerAlert(
                              `✅ TESLİM KODU DOĞRULANDI: ${found.personName} (${found.relation}) — ${found.studentName} isimli öğrenciyi teslim almaya yetkilidir!`,
                              'shuttle'
                            );
                          } else {
                            triggerAlert('⚠️ Girilen teslim kodu sistemde bulunamadı! Lütfen veli ile iletişime geçin.');
                          }
                        }}
                        className="px-5 h-10 rounded-xl bg-[#047857] text-white font-extrabold cursor-pointer"
                      >
                        Teslim Kodunu Doğrula
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {pickupPersons.map(pk => (
                        <div
                          key={pk.id}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-extrabold text-slate-900">{pk.personName} ({pk.relation})</p>
                            <p className="text-slate-600">Öğrenci: {pk.studentName} • {pk.phone}</p>
                          </div>
                          <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-mono font-extrabold">
                            {pk.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODÜL 5: 📢 TRAFİK / GECİKME BİLDİRİMİ */}
                {activeServisTab === 'trafik_bildirim' && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
                    <h3 className="font-display font-extrabold text-base text-slate-900">
                      📢 Rotadaki Tüm Velilere Tek Tıkla Trafik / Gecikme Bildirimi Gönder
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        'Yoğun trafik nedeniyle servisimiz yaklaşık 10 dakika gecikmeli ilerlemektedir.',
                        'Hava muhalefeti nedeniyle güvenli sürüş hızında ilerliyoruz (+5 dk).',
                        'Servisimiz okuldan hareket etmiştir, durak sırasına göre bildirim gelecektir.'
                      ].map(msg => (
                        <button
                          key={msg}
                          type="button"
                          onClick={() =>
                            triggerAlert(`📢 Tüm servis velilerine iletildi: "${msg}"`, 'shuttle')
                          }
                          className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-extrabold text-left cursor-pointer"
                        >
                          • {msg}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <input
                        type="text"
                        value={trafficDelayNote}
                        onChange={e => setTrafficDelayNote(e.target.value)}
                        placeholder="Özel servis bilgilendirme notu yazın..."
                        className="flex-1 h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!trafficDelayNote.trim()) return;
                          triggerAlert(`📢 Servis Duyurusu Gönderildi: "${trafficDelayNote.trim()}"`, 'shuttle');
                          setTrafficDelayNote('');
                        }}
                        className="px-5 h-10 rounded-xl bg-[#047857] text-white font-extrabold cursor-pointer"
                      >
                        Velilere Bildirim Gönder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            ROL 4: /portal/kurum — 🏛️ KURUM & STOK PRATİK YÖNETİMİ SAYFASI
            (KOYU TEMA • SOL MENÜ ZEMİNİ BORDO/KIZIL-ANTRASİT • SEÇİLİ TURUNCU)
           =================================================================== */}
        {activeKidsRole === 'kurum_sahibi' && (
          <div className="space-y-5 animate-fade-in">
            {/* Top Row: Institution KPI Bar + Mobile Sandwich Menu Button */}
            <div className="bg-[#111827] p-4 rounded-3xl border border-slate-800 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#6B1D3E]/40 border border-rose-500/30">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-black">
                    🏛️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-sm text-white">
                        Kurum &amp; Stok Pratik Yönetim Merkezi
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                        📍 /portal/kurum
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Okuldaki Öğrenci: {presentClassCount}/{totalClassCount} • Onay Bekleyen Ödeme:{' '}
                      <strong className="text-emerald-400">
                        {installments.filter(i => i.pendingNotification && i.status !== 'odeme_yapildi').length}
                      </strong>{' '}
                      • Veli Talebi: <strong className="text-amber-400">{requests.length}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsKurumMobileMenuOpen(prev => !prev)}
                  className="lg:hidden px-4 py-3 rounded-2xl bg-[#6B1D3E] text-white font-display font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  {isKurumMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  <span>Menü</span>
                </button>
              </div>
            </div>

            {/* MOBILE SANDWICH MENU DRAWER FOR /portal/kurum (Bordo/Kızıl-Antrasit Zemin) */}
            {isKurumMobileMenuOpen && (
              <div className="lg:hidden bg-linear-to-b from-[#6B1D3E] to-[#3B0F24] p-4 rounded-3xl border border-rose-900 shadow-xl space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-white/20">
                  <div>
                    <span className="font-display font-extrabold text-[11px] text-rose-200 block">
                      🏛️ Kurum &amp; Stok Pratik Menüsü
                    </span>
                    <span className="font-display font-extrabold text-sm text-white block">
                      Hızlı Erişim Modülleri
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsKurumMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl bg-white/15 text-white hover:bg-white/25 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {KURUM_MENU_ITEMS.map(tab => {
                    const isActive = activeKurumTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveKurumTab(tab.id);
                          setIsKurumMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between transition cursor-pointer ${
                          isActive
                            ? 'bg-[#F97316] text-white shadow-md border border-orange-300'
                            : 'bg-white/95 text-slate-800 hover:bg-white border border-slate-200/80'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =================================================================
                KURUM ANA YERLEŞİMİ: SOLDA BORDO MENÜ (4 SÜTUN) + SAĞDA KOYU TEMA İÇERİK (8 SÜTUN)
               ================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT 4 COLUMNS: BORDO ZEMİNLİ HIZLI ERİŞİM MODÜLLERİ */}
              <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 order-1 sticky top-6">
                <div className="bg-linear-to-b from-[#6B1D3E] to-[#3B0F24] rounded-3xl border border-rose-900 shadow-xl p-4 space-y-3">
                  <div className="px-3 py-2 border-b border-white/20">
                    <span className="text-[11px] font-extrabold text-rose-200 block">
                      🏛️ Kurum &amp; Stok Pratik Menüsü
                    </span>
                    <h3 className="font-display font-extrabold text-sm text-white mt-0.5">
                      Hızlı Erişim Modülleri
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2">
                    {KURUM_MENU_ITEMS.map(tab => {
                      const isActive = activeKurumTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveKurumTab(tab.id)}
                          className={`w-full text-left px-3.5 py-3 rounded-2xl transition cursor-pointer flex items-center justify-between gap-2 ${
                            isActive
                              ? 'bg-[#F97316] text-white shadow-md border border-orange-300'
                              : 'bg-white/95 hover:bg-white text-slate-800 border border-slate-200/80 shadow-2xs'
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
                                  isActive ? 'text-orange-100' : 'text-slate-500'
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

              {/* RIGHT 8 COLUMNS: ACTIVE KURUM MODULE CONTENT (DARK THEME) */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-6 order-2">
                {/* 1. 💳 EĞİTİM TAKSİTİ & VELİ ÖDEME ONAYLARI */}
                {activeKurumTab === 'taksit_odeme_onay' && (
                  <div className="space-y-6">
                    <div className="bg-[#111827] border border-emerald-500/40 rounded-3xl p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold">
                            🔔 Veli &quot;Ödemeyi Yaptım&quot; Bildirimleri &amp; Doğrulama Masası
                          </span>
                          <h3 className="font-display font-extrabold text-base text-white mt-2">
                            Onay Bekleyen Veli Ödeme Bildirimleri
                          </h3>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                          Doğrulandığında Veli Ekranında Yeşil (Ödeme Yapıldı) Olur
                        </span>
                      </div>

                      {installments.filter(i => i.pendingNotification && i.status !== 'odeme_yapildi').length === 0 ? (
                        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                          Şu anda onay bekleyen yeni bir veli ödeme bildirimi bulunmuyor. Veli ekranından <strong>&quot;Ödemeyi Yaptım&quot;</strong> butonuna basıldığında burada listelenir.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {installments
                            .filter(i => i.pendingNotification && i.status !== 'odeme_yapildi')
                            .map(item => (
                              <div
                                key={item.id}
                                className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                              >
                                <div className="space-y-1">
                                  <p className="font-extrabold text-white text-sm">
                                    {item.parentName} (Öğrenci: {item.studentName}) — {item.month} Eğitim Taksiti
                                  </p>
                                  <p className="text-emerald-300 font-bold">
                                    Beyan Edilen Yöntem: {item.pendingNotification?.method} • Saat: {item.pendingNotification?.reportedAt}
                                    {item.pendingNotification?.note ? ` • Not: "${item.pendingNotification.note}"` : ''}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInstallments(prev =>
                                      prev.map(inst =>
                                        inst.id === item.id
                                          ? {
                                              ...inst,
                                              status: 'odeme_yapildi',
                                              invoiceNo: 'GIB2026000' + Math.floor(10000 + Math.random() * 89999),
                                              pendingNotification: undefined
                                            }
                                          : inst
                                      )
                                    );
                                    triggerAlert(
                                      `✅ ${item.studentName} (${item.month}) ödemesi doğrulandı! Veli ekranında durum "Ödeme Yapıldı" (Yeşil) olarak güncellendi.`
                                    );
                                  }}
                                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold cursor-pointer shrink-0"
                                >
                                  ✅ Ödemeyi Doğrula (Ödeme Yapıldı Yap)
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display font-extrabold text-base text-white">
                            💳 Eğitim Taksiti — Tüm Aylar Durum Yönetimi
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Öğrencinin tüm aylardaki taksit durumlarını (Ödeme Bekliyor / Ödeme Yapıldı / Zamanı Gelmedi) buradan yönetebilirsiniz.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {(['zeynep', 'aliefe'] as const).map(stId => {
                            const stObj = students.find(s => s.id === stId);
                            return (
                              <button
                                key={stId}
                                type="button"
                                onClick={() => setMgmtSelectedStudentForTuition(stId)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                                  mgmtSelectedStudentForTuition === stId
                                    ? 'bg-amber-500 text-slate-950'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                              >
                                {stObj?.name || stId}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="divide-y divide-slate-800 text-xs">
                        {installments
                          .filter(inst => inst.studentId === mgmtSelectedStudentForTuition)
                          .map(inst => (
                            <div
                              key={inst.id}
                              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2.5">
                                  <span className="font-extrabold text-white text-sm">
                                    {inst.month} — 💳 Eğitim Taksiti
                                  </span>
                                  <span className="font-extrabold text-amber-300">
                                    ₺{inst.amount.toLocaleString('tr-TR')}
                                  </span>
                                  <span className="text-slate-400">Vade: {inst.dueDate}</span>
                                </div>
                                {inst.pendingNotification && inst.status !== 'odeme_yapildi' && (
                                  <p className="text-emerald-400 font-bold">
                                    🔔 Veli Bildirimi Var: {inst.pendingNotification.method} ({inst.pendingNotification.reportedAt})
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`px-3 py-1 rounded-full font-extrabold ${
                                    inst.status === 'odeme_yapildi'
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                      : inst.status === 'odeme_bekliyor'
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  }`}
                                >
                                  {inst.status === 'odeme_yapildi'
                                    ? 'Durum: Ödeme Yapıldı'
                                    : inst.status === 'odeme_bekliyor'
                                    ? 'Durum: Ödeme Bekliyor'
                                    : 'Durum: Zamanı Gelmedi'}
                                </span>

                                <select
                                  value={inst.status}
                                  onChange={e => {
                                    const nextStatus = e.target.value as InstallmentStatus;
                                    setInstallments(prev =>
                                      prev.map(item =>
                                        item.id === inst.id
                                          ? {
                                              ...item,
                                              status: nextStatus,
                                              pendingNotification:
                                                nextStatus === 'odeme_yapildi'
                                                  ? undefined
                                                  : item.pendingNotification
                                            }
                                          : item
                                      )
                                    );
                                    triggerAlert(
                                      `🔄 ${inst.studentName} — ${inst.month} durumu güncellendi!`
                                    );
                                  }}
                                  className="h-9 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold cursor-pointer"
                                >
                                  <option value="odeme_bekliyor">🔴 Ödeme Bekliyor</option>
                                  <option value="odeme_yapildi">🟢 Ödeme Yapıldı</option>
                                  <option value="zamani_gelmedi">🟡 Zamanı Gelmedi</option>
                                </select>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. 🔔 KURUM DERS ZİLİ & AYLIK PLANLAMA */}
                {activeKurumTab === 'zil_planlama' && (
                  <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4">
                    <h3 className="font-display font-extrabold text-base text-white">
                      🔔 Otomatik Kurum Ders Zili ve Aylık Ders / Teneffüs Saatleri Planlama
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
                        placeholder="Ders veya Teneffüs Adı..."
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
                          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
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
                            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
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

                {/* 3. 🚪 VELİ TALEPLERİ & KAPI BİLDİRİMLERİ */}
                {activeKurumTab === 'veli_talepleri' && (
                  <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4">
                    <h3 className="font-display font-extrabold text-base text-white">
                      🚪 Velilerden Gelen Hızlı Talepler ve Görüş / Öneri Bildirimleri
                    </h3>
                    <div className="space-y-3 text-xs">
                      {requests.map(req => (
                        <div
                          key={req.id}
                          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                              {req.templateType}
                            </span>
                            <p className="font-extrabold text-white text-sm mt-1">
                              {req.studentName} (Veli: {req.parentName}) • Muhatap: {req.recipient}
                            </p>
                            <p className="text-slate-300">{req.shortNote}</p>
                            <span className="text-emerald-400 font-bold block">Durum: {req.status}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setRequests(prev =>
                                prev.map(r =>
                                  r.id === req.id ? { ...r, status: 'Yönetim Onayladı ✓' } : r
                                )
                              );
                              triggerAlert(`✅ ${req.parentName} velisinin talebi yönetim tarafından onaylandı!`);
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold cursor-pointer shrink-0"
                          >
                            ✓ Talebi Onayla
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. 📝 KAYIT, SÖZLEŞME & YETKİLİ ALICILAR */}
                {activeKurumTab === 'kayit_sozlesme' && (
                  <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-5 text-xs">
                    <h3 className="font-display font-extrabold text-base text-white">
                      📝 Öğrenci Kayıtları ve Teslim Almaya Yetkili Diğer Kişiler
                    </h3>
                    <div className="divide-y divide-slate-800">
                      {students.map(s => (
                        <div
                          key={s.id}
                          className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-3">
                            <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-xl object-cover" />
                            <div>
                              <p className="font-extrabold text-white text-sm">{s.name}</p>
                              <p className="text-slate-400">
                                {s.className} • Veli: {s.parentName} ({s.parentPhone})
                              </p>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                            Aktif Kesin Kayıt
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-800 space-y-3">
                      <h4 className="font-display font-extrabold text-sm text-amber-400">
                        👵 Çocuğu Teslim Almaya Yetkili Diğer Kişiler (Anneanne, Dede, Teyze)
                      </h4>
                      {pickupPersons.map(pk => (
                        <div
                          key={pk.id}
                          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold text-white">
                              {pk.personName} ({pk.relation}) — Öğrenci: {pk.studentName}
                            </p>
                            <p className="text-slate-400">İletişim: {pk.phone}</p>
                          </div>
                          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold">
                            Kod: {pk.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. 🍽️ HAFTALIK BESLENME TABLOSU YÖNETİMİ */}
                {activeKurumTab === 'beslenme_yonetimi' && (
                  <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
                    <h3 className="font-display font-extrabold text-base text-white">
                      🍽️ Haftalık Beslenme Tablosu Yönetimi ve Günlük Beslenme Özeti
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {weeklyMenu.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-amber-400 text-sm">{item.day}</span>
                            <span className="text-slate-400">{item.calories}</span>
                          </div>
                          <p className="text-slate-200"><strong>Kahvaltı:</strong> {item.breakfast}</p>
                          <p className="text-slate-200"><strong>Öğle:</strong> {item.lunch}</p>
                          <p className="text-slate-200"><strong>İkindi:</strong> {item.snack}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. 💊 İLAÇ, SAĞLIK & SALGIN TAKİP MERKEZİ */}
                {activeKurumTab === 'ilac_salgin_merkezi' && (
                  <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
                    <h3 className="font-display font-extrabold text-base text-white">
                      💊 Kurum Geneli İlaç, Salgın Hastalık Beyanları ve Boy-Kilo Takibi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {students.map(s => (
                        <div
                          key={s.id}
                          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"
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
                            <div key={m.id} className="p-2.5 rounded-xl bg-slate-800 text-slate-200">
                              💊 {m.time} — {m.medicineName} ({m.stomachStatus}, {m.howToGive}) •{' '}
                              <span className="text-amber-300">Salgın / Hastalık: {m.diseaseName}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. 🚌 SERVİS ROTALARI CANLI DENETİMİ */}
                {activeKurumTab === 'servis_denetimi' && (
                  <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
                    <h3 className="font-display font-extrabold text-base text-white">
                      🚌 Servis Rotaları ve Sabah / Akşam Durak Denetimi
                    </h3>
                    <div className="space-y-2.5">
                      {shuttleStops.map(st => (
                        <div
                          key={st.stopOrder}
                          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-extrabold text-white">
                              #{st.stopOrder}. Durak — {st.studentName}
                            </span>
                            <p className="text-slate-400">
                              {st.addressStop} • Planlanan Saat: {st.plannedTime}
                            </p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                            {st.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. 📢 DUYURU YÖNETİMİ & KREŞTEN GÜNLÜKLER */}
                {activeKurumTab === 'duyuru_gunluk_kvkk' && (
                  <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
                    <h3 className="font-display font-extrabold text-base text-white">
                      📢 Önem Sıralı Kurum Duyurusu Yayınla
                    </h3>
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        if (!newAnnTitle.trim() || !newAnnContent.trim()) return;
                        const weight =
                          newAnnTag === 'Önemli Duyuru'
                            ? 100
                            : newAnnTag === 'Resmi Duyuru'
                            ? 90
                            : newAnnTag === 'Hatırlatma'
                            ? 70
                            : 50;
                        setAnnouncements(prev => [
                          {
                            id: Date.now(),
                            title: newAnnTitle.trim(),
                            content: newAnnContent.trim(),
                            tag: newAnnTag,
                            priorityWeight: weight,
                            date: 'Bugün',
                            author: 'Kreş Yönetimi'
                          },
                          ...prev
                        ]);
                        setNewAnnTitle('');
                        setNewAnnContent('');
                        triggerAlert('📢 Yeni duyuru önem sırasına göre yayınlandı!');
                      }}
                      className="space-y-3"
                    >
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
                        placeholder="Duyuru içeriğini yazın..."
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
                )}

                {/* 9. 📦 STOK PRATİK ÖN MUHASEBE, DEPO & E-FATURA */}
                {activeKurumTab === 'stok_pratik_erp' && (
                  <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-extrabold text-base text-white">
                        📦 Stok Pratik Kurumsal Ön Muhasebe, Depo Stok &amp; GİB e-Fatura Özeti
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                        Sadece Kurum Sahibine Özel
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block">Tahsil Edilen Taksitler</span>
                        <span className="font-display font-black text-lg text-emerald-400 mt-1 block">
                          ₺{installments
                            .filter(i => i.status === 'odeme_yapildi')
                            .reduce((acc, cur) => acc + cur.amount, 0)
                            .toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block">Bekleyen Dönem Taksitleri</span>
                        <span className="font-display font-black text-lg text-rose-400 mt-1 block">
                          ₺{installments
                            .filter(i => i.status === 'odeme_bekliyor')
                            .reduce((acc, cur) => acc + cur.amount, 0)
                            .toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block">Mutfak &amp; Özbakım Depo Durumu</span>
                        <span className="font-display font-black text-lg text-amber-300 mt-1 block">
                          %94 Yeterli Stok
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                  Öğretmen veya Yönetime Bilgilendirme İlet
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
                  Bildirim Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
