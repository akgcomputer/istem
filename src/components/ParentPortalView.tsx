import React, { useState, useEffect } from 'react';
import {
  Bell, Bus, Pill, Utensils, ClipboardList, Star, Download, Heart,
  MessageCircle, Share2, Wallet, CreditCard, FileText, CheckCircle2,
  MapPin, ShieldCheck, Calendar, BookOpen, Trophy, Clock, UserCheck,
  Sparkles, ChevronRight, Phone, AlertCircle, Camera, Send, LogOut,
  Building2, Users, Receipt, Package, Baby, QrCode, Check, Plus,
  KeyRound, Smile, Moon, ShieldAlert, ArrowUpRight
} from 'lucide-react';
import {
  IstemKidsRole,
  KidsStudentRecord,
  KidsFeedPost,
  KidsInstitutionTenant,
  INITIAL_KIDS_STUDENTS,
  INITIAL_KIDS_POSTS,
  INITIAL_KIDS_INSTITUTION,
  ISTEM_KIDS_DEMO_ACCOUNTS
} from '../data/istemKidsData';

interface ParentPortalViewProps {
  initialInstitutionCode?: string;
  initialChild?: 'zeynep' | 'mert';
  initialKidsRole?: IstemKidsRole;
  onNavigateTo: (page: string) => void;
  onLogout?: () => void;
}

export default function ParentPortalView({
  initialInstitutionCode = 'zerdalikres',
  initialChild = 'zeynep',
  initialKidsRole = 'veli',
  onNavigateTo,
  onLogout
}: ParentPortalViewProps) {
  // Active Role in İSTEM Kids (Veli, Öğretmen, Kurum Sahibi, Servis/Kapı Görevlisi)
  const [activeKidsRole, setActiveKidsRole] = useState<IstemKidsRole>(initialKidsRole);

  // Sync when prop changes (e.g. login via AuthModal)
  useEffect(() => {
    setActiveKidsRole(initialKidsRole);
  }, [initialKidsRole]);

  // Shared reactive state for İSTEM Kids
  const [students, setStudents] = useState<KidsStudentRecord[]>(() => {
    try {
      const savedNewChild = localStorage.getItem('istem_kids_new_child');
      if (savedNewChild) {
        const parsed = JSON.parse(savedNewChild);
        const exists = INITIAL_KIDS_STUDENTS.some(s => s.id === parsed.id);
        if (!exists) {
          return [parsed, ...INITIAL_KIDS_STUDENTS];
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_KIDS_STUDENTS;
  });

  const [posts, setPosts] = useState<KidsFeedPost[]>(INITIAL_KIDS_POSTS);
  const [institution, setInstitution] = useState<KidsInstitutionTenant>(() => {
    try {
      const savedStage = localStorage.getItem('istem_kids_institution_stage');
      if (savedStage) {
        const parsed = JSON.parse(savedStage);
        return {
          ...INITIAL_KIDS_INSTITUTION,
          name: parsed.name || INITIAL_KIDS_INSTITUTION.name,
          code: parsed.code || INITIAL_KIDS_INSTITUTION.code,
          district: parsed.district || INITIAL_KIDS_INSTITUTION.district,
          stage: parsed.stage || INITIAL_KIDS_INSTITUTION.stage
        };
      }
    } catch {
      // ignore
    }
    return INITIAL_KIDS_INSTITUTION;
  });

  // Selected child in Veli view ('zeynep' | 'aliefe' | custom child id | 'mert' for high school)
  const [selectedChildId, setSelectedChildId] = useState<string>(
    initialInstitutionCode === 'kuzeykoleji' ? 'mert' : students[0]?.id || initialChild
  );

  // Toast / Banner alert state
  const [toastBanner, setToastBanner] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastBanner(msg);
    setTimeout(() => setToastBanner(null), 4500);
  };

  // Veli Quick Modals
  const [activeVeliModal, setActiveVeliModal] = useState<
    null | 'ilac' | 'teslim_kodu' | 'menu' | 'sabah_notu' | 'pasaport'
  >(null);
  const [newMedName, setNewMedName] = useState('');
  const [newMedTime, setNewMedTime] = useState('14:00');
  const [newMedDose, setNewMedDose] = useState('1 Ölçek (5 ml)');

  // Safe Pickup Code Form
  const [pickupPerson, setPickupPerson] = useState('Hatice Sarı');
  const [pickupRelation, setPickupRelation] = useState('Anneannesi');
  const [pickupPhone, setPickupPhone] = useState('0533 612 44 19');

  // Morning Note Form
  const [morningNoteInput, setMorningNoteInput] = useState('');

  // Teacher Panel States
  const [teacherClassFilter, setTeacherClassFilter] = useState<string>('Tümü');
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newDiaperType, setNewDiaperType] = useState<'Islak' | 'Normal' | 'Krem Uygulandı'>('Islak');

  // Owner Panel States
  const [newClassName, setNewClassName] = useState('');
  const [newClassAge, setNewClassAge] = useState('36-48 Ay (3-4 Yaş)');
  const [newClassTeacher, setNewClassTeacher] = useState('');
  const [leads, setLeads] = useState([
    {
      id: 'lead-1',
      name: 'Gökhan & Elif Arslan',
      childName: 'Kerem Arslan',
      ageGroup: '3-6' as const,
      childDesc: '3.5 Yaş (Tam Gün Ekoloji)',
      phone: '0532 411 80 90',
      status: 'Tanıtım Turu Tamamlandı'
    },
    {
      id: 'lead-2',
      name: 'Zeynep Aksoy',
      childName: 'Nil Aksoy',
      ageGroup: '0-3' as const,
      childDesc: '2 Yaş (Minik Kalpler Oyun Grubu)',
      phone: '0544 892 10 22',
      status: 'Fiyat Teklifi Onaylandı'
    }
  ]);

  // Shuttle / Gate Staff Verification State
  const [verifyCodeInput, setVerifyCodeInput] = useState('ZR-8492');
  const [verifyResult, setVerifyResult] = useState<string | null>(null);

  // Current active Kids student record (if not Mert high school)
  const currentKidsStudent =
    students.find(s => s.id === selectedChildId) || students[0];

  // Helper to update a specific student record
  const updateStudent = (
    studentId: string,
    updater: (prev: KidsStudentRecord) => KidsStudentRecord
  ) => {
    setStudents(prev => prev.map(s => (s.id === studentId ? updater(s) : s)));
  };

  // Veli Action: Trigger Gate Bell ("Kapıdayım")
  const handlePressGateBell = (studentId: string) => {
    const nowTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    updateStudent(studentId, s => ({
      ...s,
      gateBellActive: true,
      gateBellTime: nowTime,
      gateBellPrepared: false
    }));
    triggerToast(
      '🔔 "Kapıdayım" sinyali Sınıf Öğretmenine ve Kapı Görevlisine sesli bildirim olarak iletildi!'
    );
  };

  // Veli Action: Toggle Today's Shuttle ("Bugün Servise Binmeyecek")
  const handleToggleShuttleToday = (studentId: string) => {
    updateStudent(studentId, s => {
      const isSelfPickup = s.shuttleStatus === 'Bugün Servise Binmeyecek (Veli Alacak)';
      const nextStatus = isSelfPickup
        ? 'Sabah Okula Teslim Edildi (08:35)'
        : 'Bugün Servise Binmeyecek (Veli Alacak)';
      triggerToast(`🚌 Servis durumu güncellendi: "${nextStatus}"`);
      return { ...s, shuttleStatus: nextStatus };
    });
  };

  // Veli Action: Add Medicine Notification
  const handleAddMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim() || !currentKidsStudent) return;
    updateStudent(currentKidsStudent.id, s => ({
      ...s,
      medicines: [
        ...s.medicines,
        {
          id: Date.now(),
          time: newMedTime,
          name: newMedName.trim(),
          dose: newMedDose.trim(),
          given: false
        }
      ]
    }));
    setNewMedName('');
    setActiveVeliModal(null);
    triggerToast(
      `💊 "${newMedName}" ilaç bildirimi sınıf öğretmeni ekranına (${newMedTime}) eklendi.`
    );
  };

  // Veli Action: Generate Safe Pickup Code (QR)
  const handleCreatePickupCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupPerson.trim() || !currentKidsStudent) return;
    const generated = `ZR-${Math.floor(1000 + Math.random() * 9000)}`;
    updateStudent(currentKidsStudent.id, s => ({
      ...s,
      pickupAuth: {
        code: generated,
        personName: pickupPerson.trim(),
        relation: pickupRelation.trim(),
        phone: pickupPhone.trim(),
        createdAt: 'Az Önce Oluşturuldu',
        verified: false
      }
    }));
    setVerifyCodeInput(generated);
    triggerToast(
      `🔐 ${pickupPerson} (${pickupRelation}) için tek kullanımlık Teslim Kodu (${generated}) oluşturuldu!`
    );
  };

  // Veli Action: Pay Tuition
  const handlePayStudentTuition = (studentId: string) => {
    const inv = `GIB2026000${Math.floor(10000 + Math.random() * 89999)}`;
    updateStudent(studentId, s => ({
      ...s,
      tuitionPaid: true,
      invoiceNo: inv
    }));
    triggerToast(
      `✅ Eğitim taksiti ödendi! Kurum muhasebe ekranında tahsilat işlendi ve e-Fatura (${inv}) oluşturuldu.`
    );
  };

  // Teacher Action: Approve Medicine Given
  const handleTeacherGiveMedicine = (studentId: string, medId: number) => {
    const nowTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    updateStudent(studentId, s => ({
      ...s,
      medicines: s.medicines.map(m =>
        m.id === medId
          ? { ...m, given: true, givenBy: 'Ayşe Yılmaz', givenAt: nowTime }
          : m
      )
    }));
    triggerToast('💊 İlaç içirildi olarak işaretlendi ve veliye anlık bildirim gönderildi!');
  };

  // Teacher Action: Add Diaper / Self-care Log for 0-3 Age Group
  const handleTeacherAddDiaperLog = (studentId: string) => {
    const nowTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    updateStudent(studentId, s => ({
      ...s,
      diaperLogs: [
        ...s.diaperLogs,
        {
          id: Date.now(),
          time: nowTime,
          type: newDiaperType,
          note: `${nowTime} itibarıyla özbakım / bez kontrolü (${newDiaperType}) tamamlandı.`
        }
      ]
    }));
    triggerToast('🍼 0-3 Yaş özbakım/bez kaydı velinin günlük karnesine eklendi.');
  };

  // Teacher Action: Bulk Mark All Class Ate Lunch or Slept
  const handleBulkTeacherUpdate = (mode: 'yemek' | 'uyku' | 'yoklama') => {
    setStudents(prev =>
      prev.map(s => {
        if (mode === 'yoklama') return { ...s, attendance: 'geldi' };
        if (mode === 'yemek') return { ...s, breakfast: 'Hepsini Yedi', lunch: 'Hepsini Yedi' };
        return { ...s, sleepStatus: 'Mışıl Mışıl Uyudu (13:00-14:30)' };
      })
    );
    triggerToast(
      mode === 'yoklama'
        ? '✅ Tüm sınıf "Geldi" olarak yoklamaya işlendi!'
        : mode === 'yemek'
        ? '🍲 Tüm sınıfın kahvaltı ve öğle yemeği karnesi "Hepsini Yedi" olarak güncellendi!'
        : '😴 Tüm sınıfın öğle uykusu karnesi "Mışıl Mışıl Uyudu" olarak güncellendi!'
    );
  };

  // Teacher Action: Share Classroom Album Story
  const handleTeacherCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostCaption.trim()) return;
    const created: KidsFeedPost = {
      id: Date.now(),
      className: 'Papatyalar Sınıfı (4 Yaş)',
      teacherName: 'Ayşe Yılmaz',
      teacherRole: 'Sınıf Öğretmeni',
      timeAgo: 'Az önce',
      caption: newPostCaption.trim(),
      images: [
        'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=700&q=80'
      ],
      likes: 1,
      approvedByOwner: true,
      comments: []
    };
    setPosts([created, ...posts]);
    setNewPostCaption('');
    triggerToast('📸 Sınıf albümü fotoğrafı velilerin ekranında paylaşıldı!');
  };

  // Owner Action: Convert Lead to Enrolled Student & Create Stok Pratik Contract
  const handleOwnerConvertLead = (leadId: string) => {
    const target = leads.find(l => l.id === leadId);
    if (!target) return;
    const passportId = `IST-PAS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudent: KidsStudentRecord = {
      id: `std-${Date.now()}`,
      passportId,
      name: target.childName,
      ageLabel: target.childDesc,
      ageGroup: target.ageGroup,
      className:
        target.ageGroup === '0-3'
          ? 'Minik Kalpler Sınıfı (0-3 Yaş)'
          : 'Papatyalar Sınıfı (4 Yaş)',
      avatar:
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80',
      parentName: target.name,
      parentPhone: target.phone,
      parentUsername: target.name.toLowerCase().replace(/\s+/g, ''),
      allergies: [],
      attendance: 'geldi',
      breakfast: 'Hepsini Yedi',
      lunch: 'Hepsini Yedi',
      snack: 'Hepsini Yedi',
      sleepStatus: 'Mışıl Mışıl Uyudu (13:00-14:30)',
      mood: 'Çok Neşeli & Paylaşımcı 😊',
      activities: ['Oryantasyon & Tanışma Etkinliği'],
      diaperLogs: [],
      teacherDailyNote: `${target.childName} bugün aramıza katıldı, hoş geldi!`,
      parentMorningNote: 'İlk günümüz.',
      shuttleStatus: 'Sabah Okula Teslim Edildi (08:35)',
      gateBellActive: false,
      pickupAuth: {
        code: `ZR-${Math.floor(1000 + Math.random() * 9000)}`,
        personName: target.name,
        relation: 'Velisi',
        phone: target.phone,
        createdAt: 'Yeni Kayıt',
        verified: true
      },
      medicines: [],
      tuitionAmount: 19500,
      tuitionPaid: false
    };
    setStudents(prev => [newStudent, ...prev]);
    setLeads(prev => prev.filter(l => l.id !== leadId));
    setInstitution(prev => ({ ...prev, enrolledCount: prev.enrolledCount + 1 }));
    triggerToast(
      `🎉 "${target.childName}" kesin kayda alındı! Öğrenci Pasaportu (${passportId}) ve Stok Pratik taksit sözleşmesi oluşturuldu.`
    );
  };

  // Owner Action: Add New Class
  const handleOwnerAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !newClassTeacher.trim()) return;
    setInstitution(prev => ({
      ...prev,
      classes: [
        ...prev.classes,
        {
          id: `cls-${Date.now()}`,
          name: newClassName.trim(),
          ageRange: newClassAge,
          teacher: newClassTeacher.trim(),
          assistant: 'Yardımcı Öğretmen Atandı',
          count: 1
        }
      ]
    }));
    setNewClassName('');
    setNewClassTeacher('');
    triggerToast(`🏫 "${newClassName}" sınıfı ve öğretmeni başarıyla tanımlandı!`);
  };

  // Shuttle / Gate Action: Verify Pickup Code
  const handleVerifyPickupCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = verifyCodeInput.trim().toUpperCase();
    const matchedStudent = students.find(s => s.pickupAuth.code.toUpperCase() === cleaned);
    if (!matchedStudent) {
      setVerifyResult('❌ Geçersiz veya süresi dolmuş teslim kodu! Lütfen veliden teyit alınız.');
      return;
    }
    updateStudent(matchedStudent.id, s => ({
      ...s,
      gateBellActive: false,
      shuttleStatus: 'Veliye Güvenle Teslim Edildi ✅',
      pickupAuth: { ...s.pickupAuth, verified: true }
    }));
    setVerifyResult(
      `✅ DOĞRULANDI: ${matchedStudent.name} -> Alıcı: ${matchedStudent.pickupAuth.personName} (${matchedStudent.pickupAuth.relation} - ${matchedStudent.pickupAuth.phone}). Güvenle teslim edebilirsiniz.`
    );
    triggerToast(`✅ ${matchedStudent.name} güvenli teslim kodu doğrulandı!`);
  };

  // Active Gate Bell Students (for Teacher & Gate Staff notification bar)
  const gateBellStudents = students.filter(s => s.gateBellActive);

  return (
    <div className="bg-surface min-h-screen pb-24 text-on-surface font-sans">
      {/* Global Live Toast Notification */}
      {toastBanner && (
        <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 bg-inverse-surface text-white px-5 py-4 rounded-2xl shadow-2xl border border-primary-container flex items-center gap-3 animate-fade-in">
          <Sparkles className="w-5 h-5 text-secondary shrink-0" />
          <p className="text-xs font-bold leading-snug">{toastBanner}</p>
        </div>
      )}

      {/* TOP PORTAL HEADER & 4-ROLE SWITCHER BAR */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/30 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center font-black font-display text-sm shadow-xs">
                🧸
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="font-display font-extrabold text-base sm:text-lg text-on-surface leading-none">
                    İSTEM Kids (0-6 Yaş Kreş &amp; Anaokulu) Portalı
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-extrabold uppercase">
                    İstanbul Eğitim Merkezi
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Kurum: <strong>{institution.name}</strong> • Kod:{' '}
                  <span className="font-mono font-bold text-primary">{institution.code}</span>
                </p>
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="lg:hidden p-2 rounded-xl bg-surface-container text-on-surface-variant"
                title="Çıkış"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 4-ROLE INTERACTIVE SWITCHER */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            <div className="bg-surface-container-low p-1 rounded-2xl flex items-center gap-1 border border-outline-variant/30 shrink-0">
              {ISTEM_KIDS_DEMO_ACCOUNTS.map(roleAcc => (
                <button
                  key={roleAcc.role}
                  type="button"
                  onClick={() => setActiveKidsRole(roleAcc.role)}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    activeKidsRole === roleAcc.role
                      ? 'bg-primary-container text-white shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span>{roleAcc.roleLabel}</span>
                  {roleAcc.role === 'ogretmen' && gateBellStudents.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                  )}
                </button>
              ))}
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="hidden lg:flex p-2.5 rounded-xl bg-surface-container hover:bg-error-container hover:text-on-error-container text-on-surface-variant transition cursor-pointer"
                title="Portaldan Çık"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LIVE GATE BELL ALARM BANNER (Visible across roles when a parent presses "Kapıdayım") */}
      {gateBellStudents.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-secondary text-white rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded-full">
                  CANLI KAPI ZİLİ UYARISI ({gateBellStudents.length} VELİ KAPIDA)
                </span>
                <p className="text-sm font-extrabold mt-0.5">
                  {gateBellStudents.map(s => `${s.name} (${s.className} - Saat ${s.gateBellTime})`).join(', ')} velisi kapıda bekliyor!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {gateBellStudents.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    updateStudent(s.id, prev => ({
                      ...prev,
                      gateBellActive: false,
                      shuttleStatus: 'Veliye Güvenle Teslim Edildi ✅'
                    }));
                    triggerToast(`✅ ${s.name} kapıda velisine güvenle teslim edildi!`);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white text-secondary font-extrabold text-xs hover:bg-surface-container-low transition cursor-pointer"
                >
                  {s.name} Teslim Edildi İşaretle ✓
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN ROLE-BASED BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* =====================================================================
            ROL 1: 👨‍👩‍👧 VELİ EKRANI (ANNE / BABA / YETKİLİ ALICI)
           ===================================================================== */}
        {activeKidsRole === 'veli' && (
          <div className="space-y-6 animate-fade-in">
            {/* Sibling & Life-Stage Switcher (0-3 Yaş Bebek, 3-6 Yaş Anaokulu, Lise Kardeş) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="bg-surface-container-low p-1.5 rounded-2xl flex flex-wrap items-center gap-1.5 border border-outline-variant/30">
                {students
                  .filter(s => s.parentUsername === 'fatihsari' || s.id.startsWith('child-'))
                  .map(child => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => setSelectedChildId(child.id)}
                      className={`flex items-center gap-2.5 py-2 px-3.5 rounded-xl transition-all text-left cursor-pointer ${
                        selectedChildId === child.id
                          ? 'bg-surface-container-lowest shadow-sm ring-1 ring-primary-container/40'
                          : 'opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={child.avatar}
                        alt={child.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-container/30"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-extrabold text-on-surface leading-tight">{child.name}</p>
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed">
                            {child.ageGroup === '0-3' ? '0-3 Yaş Kreş' : '3-6 Yaş Anaokulu'}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-primary mt-0.5">{child.className}</p>
                      </div>
                    </button>
                  ))}

                {/* High School Brother (Beşikten Kariyere Tek Hesap) */}
                <button
                  type="button"
                  onClick={() => setSelectedChildId('mert')}
                  className={`flex items-center gap-2.5 py-2 px-3.5 rounded-xl transition-all text-left cursor-pointer ${
                    selectedChildId === 'mert'
                      ? 'bg-surface-container-lowest shadow-sm ring-1 ring-primary-container/40'
                      : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center font-extrabold text-xs">
                    MS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-extrabold text-on-surface leading-tight">Mert Sarı (Abi)</p>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed">
                        İSTEM Kampüs
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-on-surface-variant mt-0.5">Kuzey Fen Lisesi • 11-B</p>
                  </div>
                </button>
              </div>

              {/* Single Student Passport & Level Transition Button */}
              <button
                type="button"
                onClick={() => setActiveVeliModal('pasaport')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary-fixed/60 hover:bg-primary-fixed text-on-primary-fixed text-xs font-extrabold transition cursor-pointer shrink-0"
              >
                <ShieldCheck className="w-4 h-4 text-primary-container" />
                <span>
                  Öğrenci Pasaportu &amp; Seviye Geçişi ({currentKidsStudent?.passportId || 'IST-PAS'})
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {selectedChildId === 'mert' ? (
              /* High school brother summary card */
              <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary-fixed px-2.5 py-1 rounded-full">
                      🎯 İSTEM KAMPÜS (LİSE &amp; YKS MODÜLÜ)
                    </span>
                    <h2 className="text-xl font-extrabold font-display text-on-surface mt-2">
                      Mert Sarı — Kuzey Fen Lisesi 11-B Akademik Takip Ekranı
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Aynı veli hesabınızdan kreşteki çocuklarınızla birlikte lisedeki çocuğunuzun YKS deneme karnesini ve etütlerini takip edebilirsiniz.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedChildId('zeynep')}
                    className="px-4 py-2.5 rounded-xl bg-primary-container text-white text-xs font-bold cursor-pointer"
                  >
                    🧸 Kreş Ekranına Dön
                  </button>
                </div>
              </div>
            ) : (
              /* ================= 🧸 İSTEM KIDS VELİ PANELİ (ZEYNEP 4 YAŞ & ALİ EFE 2 YAŞ) ================= */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT 5 COLUMNS: QUICK ACTIONS, DAILY REPORT CARD, 0-3 DIAPER LOGS, MEDICINES, PICKUP QR */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Child Header Status Banner */}
                  <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/30 shadow-2xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={currentKidsStudent.avatar}
                        alt={currentKidsStudent.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-container/30"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-display font-extrabold text-base text-on-surface">
                            {currentKidsStudent.name}
                          </h2>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                            Okulda • {currentKidsStudent.attendance.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                          {currentKidsStudent.className} • Öğretmen: <strong>Ayşe Yılmaz</strong>
                        </p>
                        {currentKidsStudent.allergies.length > 0 && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-[10px] font-extrabold border border-red-200">
                            ⚠️ Alerji Uyarısı: {currentKidsStudent.allergies.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4 ACİL VELİ BUTONU (Kapıdayım, İlaç, Servis, Güvenli Teslim Kodu) */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* 1. Kapıdayım Zili */}
                    <button
                      type="button"
                      onClick={() => handlePressGateBell(currentKidsStudent.id)}
                      className="flex flex-col items-start justify-between p-4 rounded-2xl bg-gradient-to-br from-secondary to-secondary-container text-white shadow-md active:scale-[0.98] transition text-left relative overflow-hidden cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-2.5">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-extrabold uppercase tracking-wider mb-1">
                          Kurum Zili
                        </span>
                        <p className="font-display font-extrabold text-sm leading-tight">
                          {currentKidsStudent.gateBellActive
                            ? 'Sinyal İletildi 🔔'
                            : 'Kapıdayım (Çocuğu Alacağım)'}
                        </p>
                      </div>
                    </button>

                    {/* 2. Güvenli Teslim Kodu (QR - Anneanne / Teyze) */}
                    <button
                      type="button"
                      onClick={() => setActiveVeliModal('teslim_kodu')}
                      className="flex flex-col items-start justify-between p-4 rounded-2xl bg-primary-container text-white shadow-md active:scale-[0.98] transition text-left cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-2.5">
                        <QrCode className="w-5 h-5 text-tertiary-fixed" />
                      </div>
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-white/15 text-[9px] font-extrabold uppercase tracking-wider mb-1">
                          Kod: {currentKidsStudent.pickupAuth.code}
                        </span>
                        <p className="font-display font-extrabold text-sm leading-tight">
                          Güvenli Teslim Kodu (Kim Alacak?)
                        </p>
                      </div>
                    </button>

                    {/* 3. İlaç Bildirimi */}
                    <button
                      type="button"
                      onClick={() => setActiveVeliModal('ilac')}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/30 shadow-2xs transition text-left cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-xs text-on-surface">İlaç Bildirimi</p>
                        <p className="text-[11px] font-semibold text-secondary mt-0.5">
                          {currentKidsStudent.medicines.filter(m => m.given).length}/
                          {currentKidsStudent.medicines.length} Verildi ✅
                        </p>
                      </div>
                    </button>

                    {/* 4. Servis Takibi & Bugün Binmeyecek */}
                    <button
                      type="button"
                      onClick={() => handleToggleShuttleToday(currentKidsStudent.id)}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/30 shadow-2xs transition text-left cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center shrink-0">
                        <Bus className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-xs text-on-surface">Servis Durumu</p>
                        <p className="text-[10px] font-bold text-tertiary mt-0.5 line-clamp-1">
                          {currentKidsStudent.shuttleStatus === 'Bugün Servise Binmeyecek (Veli Alacak)'
                            ? 'Binmeyecek (Veli Alacak)'
                            : 'Aktif (Değiştir)'}
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Veli Sabah Teslim Notu & Aylık Menü Butonları */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setMorningNoteInput(currentKidsStudent.parentMorningNote);
                        setActiveVeliModal('sabah_notu');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-xs font-bold text-on-surface hover:border-primary-container flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-primary-container" />
                      <span>Öğretmene Sabah Notu</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveVeliModal('menu')}
                      className="py-2.5 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-xs font-bold text-on-surface hover:border-primary-container flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Utensils className="w-3.5 h-3.5 text-secondary" />
                      <span>Aylık Menü &amp; Alerjen</span>
                    </button>
                  </div>

                  {/* CANLI GÜNLÜK KARNE KARTI */}
                  <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-2xs border border-outline-variant/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display font-extrabold text-base text-on-surface">
                          Günlük Gelişim &amp; Özbakım Karnesi
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                          Sınıf öğretmeni tarafından canlı güncellenir
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-extrabold">
                        Bugün Canlı
                      </span>
                    </div>

                    {/* Yemek Öğünleri (Kahvaltı, Öğle, İkindi) */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 rounded-2xl bg-surface-container-low text-center">
                        <span className="text-[10px] font-bold text-on-surface-variant block">Kahvaltı</span>
                        <span className="text-xs font-extrabold text-tertiary mt-1 block">
                          🍲 {currentKidsStudent.breakfast}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-surface-container-low text-center">
                        <span className="text-[10px] font-bold text-on-surface-variant block">Öğle Yemeği</span>
                        <span className="text-xs font-extrabold text-tertiary mt-1 block">
                          🍛 {currentKidsStudent.lunch}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-surface-container-low text-center">
                        <span className="text-[10px] font-bold text-on-surface-variant block">İkindi Öğünü</span>
                        <span className="text-xs font-extrabold text-secondary mt-1 block">
                          🍎 {currentKidsStudent.snack}
                        </span>
                      </div>
                    </div>

                    {/* Uyku & Duygu Durumu */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center gap-3">
                        <Moon className="w-5 h-5 text-primary-container shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-on-surface-variant block">Öğle Uykusu</span>
                          <span className="text-xs font-extrabold text-on-surface">
                            {currentKidsStudent.sleepStatus}
                          </span>
                        </div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center gap-3">
                        <Smile className="w-5 h-5 text-secondary shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-on-surface-variant block">Duygu &amp; Katılım</span>
                          <span className="text-xs font-extrabold text-on-surface">
                            {currentKidsStudent.mood}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Katıldığı Atölyeler */}
                    <div>
                      <span className="text-[11px] font-bold text-on-surface-variant block mb-1.5">
                        Bugün Katıldığı Atölye &amp; Etkinlikler:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentKidsStudent.activities.map((act, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-full bg-primary-fixed/60 text-on-primary-fixed text-[11px] font-bold"
                          >
                            🎨 {act}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 0-3 YAŞ ÖZEL: ÖZBAKIM VE BEZ DEĞİŞİM TAKİBİ */}
                    {currentKidsStudent.ageGroup === '0-3' && (
                      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                            <Baby className="w-4 h-4 text-amber-700" />
                            0-3 Yaş Özbakım &amp; Bez Değişim Çizelgesi
                          </span>
                          <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full text-amber-800">
                            {currentKidsStudent.diaperLogs.length} Kayıt
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {currentKidsStudent.diaperLogs.map(log => (
                            <div
                              key={log.id}
                              className="bg-white p-2.5 rounded-xl flex items-center justify-between text-xs border border-amber-100"
                            >
                              <div>
                                <span className="font-extrabold text-amber-900 mr-2">{log.time}</span>
                                <span className="text-on-surface-variant">{log.note}</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold shrink-0">
                                {log.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Öğretmenin Günlük Notu & Velinin Sabah Notu */}
                    <div className="p-3.5 rounded-2xl bg-primary-fixed/30 border border-primary-container/15 space-y-1.5">
                      <p className="text-xs text-on-surface">
                        <strong className="text-primary-container">👩‍🏫 Öğretmen Notu:</strong>{' '}
                        {currentKidsStudent.teacherDailyNote}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        <strong>💬 Sizin Sabah Notunuz:</strong> {currentKidsStudent.parentMorningNote}
                      </p>
                    </div>
                  </div>

                  {/* İlaç Takip Listesi */}
                  <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-sm text-on-surface flex items-center gap-2">
                        <Pill className="w-4 h-4 text-secondary" />
                        <span>Günlük İlaç &amp; Vitamin Takibi</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveVeliModal('ilac')}
                        className="text-xs font-extrabold text-primary hover:underline cursor-pointer"
                      >
                        + Yeni İlaç Ekle
                      </button>
                    </div>
                    {currentKidsStudent.medicines.length === 0 ? (
                      <p className="text-xs text-on-surface-variant">Bugün için tanımlı ilaç bulunmuyor.</p>
                    ) : (
                      <div className="space-y-2">
                        {currentKidsStudent.medicines.map(med => (
                          <div
                            key={med.id}
                            className="p-3 rounded-2xl bg-surface-container-low flex items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <p className="font-bold text-on-surface">
                                {med.time} — {med.name}
                              </p>
                              <p className="text-[11px] text-on-surface-variant">{med.dose}</p>
                            </div>
                            {med.given ? (
                              <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-extrabold shrink-0">
                                Verildi ✅ ({med.givenAt})
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold shrink-0">
                                Saat Bekleniyor ⏳
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT 7 COLUMNS: CLASSROOM PHOTO STREAM & PARENT TUITION CARD */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Classroom Social Feed */}
                  {posts
                    .filter(p => p.approvedByOwner)
                    .map(post => (
                      <article
                        key={post.id}
                        className="bg-surface-container-lowest rounded-3xl shadow-2xs border border-outline-variant/30 overflow-hidden"
                      >
                        <div className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs">
                              AY
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-display font-bold text-sm text-on-surface">
                                  {post.teacherName}
                                </h4>
                                <CheckCircle2 className="w-4 h-4 text-primary-container" />
                              </div>
                              <p className="text-xs text-on-surface-variant">
                                {post.className} • {post.timeAgo}
                              </p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                            Sınıf Albümü (Sadece Veliler)
                          </span>
                        </div>

                        <div className="px-5 pb-3">
                          <p className="text-sm text-on-surface leading-relaxed">{post.caption}</p>
                        </div>

                        <div className="px-5 pb-4">
                          <div
                            className={`grid ${
                              post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
                            } gap-2 rounded-2xl overflow-hidden`}
                          >
                            {post.images.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt="Sınıf Etkinliği"
                                className="w-full h-56 object-cover"
                              />
                            ))}
                          </div>
                        </div>

                        <div className="px-5 py-3.5 bg-surface-container-low/60 flex items-center justify-between border-t border-outline-variant/20">
                          <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                            <Heart className="w-4 h-4 fill-current" /> {post.likes} Veli Beğendi
                          </span>
                          <span className="text-xs font-semibold text-on-surface-variant">
                            🔒 KVKK Korumalı Kapalı Sınıf Akışı
                          </span>
                        </div>
                      </article>
                    ))}

                  {/* Parent Tuition Payment Card (No SP abbreviation or B2B jargon shown to parent) */}
                  <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e1b4b] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-tertiary-fixed" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 block">
                              OKUL &amp; KREŞ AİDAT BİLGİLENDİRME
                            </span>
                            <h4 className="font-display font-bold text-base text-white">
                              {currentKidsStudent.name} — Eğitim, Yemek &amp; Servis Taksiti
                            </h4>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            currentKidsStudent.tuitionPaid
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                          }`}
                        >
                          {currentKidsStudent.tuitionPaid ? 'Ödendi ✓' : 'Kasım Taksiti'}
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-slate-300">Kasım 2026 Dönem Taksiti</p>
                          <p className="font-display font-extrabold text-2xl text-white mt-0.5">
                            ₺{currentKidsStudent.tuitionAmount.toLocaleString('tr-TR')},00
                          </p>
                          {currentKidsStudent.invoiceNo && (
                            <p className="text-[11px] text-emerald-300 mt-0.5">
                              Resmi Fatura No: {currentKidsStudent.invoiceNo}
                            </p>
                          )}
                        </div>
                        {!currentKidsStudent.tuitionPaid ? (
                          <button
                            type="button"
                            onClick={() => handlePayStudentTuition(currentKidsStudent.id)}
                            className="px-5 py-3 rounded-xl bg-secondary hover:opacity-95 text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>3D Secure İle Hızlı Öde</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              triggerToast(
                                `📄 ${currentKidsStudent.invoiceNo} numaralı resmi eğitim faturanız PDF olarak indirildi.`
                              )
                            }
                            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-display font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Fatura Dekontunu İndir</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            ROL 2: 👩‍🏫 SINIF ÖĞRETMENİ MOBİL HIZLI PANELİ
           ===================================================================== */}
        {activeKidsRole === 'ogretmen' && (
          <div className="space-y-6 animate-fade-in">
            {/* Teacher Header & 1-Click Bulk Action Toolbar */}
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary-fixed px-3 py-1 rounded-full">
                  👩‍🏫 İSTEM KIDS ÖĞRETMEN MASASI • AYŞE YILMAZ
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold font-display text-on-surface mt-2">
                  Hızlı Sınıf Yoklama, Günlük Karne &amp; İlaç Onay Ekranı
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Yaptığınız her değişiklik aynı saniyede velilerin "Günlük Karne" ekranına düşer.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBulkTeacherUpdate('yoklama')}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition cursor-pointer"
                >
                  ✓ Tüm Sınıf Geldi
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkTeacherUpdate('yemek')}
                  className="px-3.5 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-white text-xs font-extrabold transition cursor-pointer"
                >
                  🍲 Tüm Sınıf Yemeğini Yedi
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkTeacherUpdate('uyku')}
                  className="px-3.5 py-2.5 rounded-xl bg-secondary hover:opacity-95 text-white text-xs font-extrabold transition cursor-pointer"
                >
                  😴 Tüm Sınıf Uyudu
                </button>
              </div>
            </div>

            {/* Class Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {['Tümü', 'Papatyalar Sınıfı (4 Yaş)', 'Minik Kalpler Sınıfı (0-3 Yaş)'].map(cls => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setTeacherClassFilter(cls)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer shrink-0 ${
                    teacherClassFilter === cls
                      ? 'bg-primary-container text-white'
                      : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            {/* Student Cards Grid for Teacher Quick Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {students
                .filter(s => teacherClassFilter === 'Tümü' || s.className === teacherClassFilter)
                .map(student => (
                  <div
                    key={student.id}
                    className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30 shadow-2xs space-y-4"
                  >
                    {/* Student Top Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-12 h-12 rounded-2xl object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-display font-extrabold text-base text-on-surface">
                              {student.name}
                            </h3>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">
                              {student.ageGroup === '0-3' ? '0-3 Yaş Bebek' : '3-6 Yaş'}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant">{student.className}</p>
                          {student.allergies.length > 0 && (
                            <span className="text-[10px] font-extrabold text-red-700 bg-red-50 px-2 py-0.5 rounded mt-1 inline-block">
                              ⚠️ Alerji: {student.allergies.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Attendance Toggle */}
                      <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
                        {(['geldi', 'izinli', 'gelmedi'] as const).map(att => (
                          <button
                            key={att}
                            type="button"
                            onClick={() =>
                              updateStudent(student.id, s => ({ ...s, attendance: att }))
                            }
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase cursor-pointer ${
                              student.attendance === att
                                ? att === 'geldi'
                                  ? 'bg-emerald-600 text-white'
                                  : att === 'izinli'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-red-600 text-white'
                                : 'text-on-surface-variant'
                            }`}
                          >
                            {att}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Parent Morning Note Alert */}
                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-950">
                      <strong>👨‍👩‍👧 Veli Sabah Notu:</strong> &ldquo;{student.parentMorningNote}&rdquo;
                    </div>

                    {/* Quick Meal & Sleep Selectors */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-on-surface-variant block mb-1">
                          Kahvaltı
                        </label>
                        <select
                          value={student.breakfast}
                          onChange={e =>
                            updateStudent(student.id, s => ({
                              ...s,
                              breakfast: e.target.value as any
                            }))
                          }
                          className="w-full p-2 rounded-xl bg-surface-container-low font-bold text-xs border border-outline-variant/30"
                        >
                          <option value="Hepsini Yedi">Hepsini Yedi</option>
                          <option value="Yarısını Yedi">Yarısını Yedi</option>
                          <option value="Az Yedi">Az Yedi</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-on-surface-variant block mb-1">
                          Öğle Yemeği
                        </label>
                        <select
                          value={student.lunch}
                          onChange={e =>
                            updateStudent(student.id, s => ({
                              ...s,
                              lunch: e.target.value as any
                            }))
                          }
                          className="w-full p-2 rounded-xl bg-surface-container-low font-bold text-xs border border-outline-variant/30"
                        >
                          <option value="Hepsini Yedi">Hepsini Yedi</option>
                          <option value="Yarısını Yedi">Yarısını Yedi</option>
                          <option value="Az Yedi">Az Yedi</option>
                        </select>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-[10px] font-bold text-on-surface-variant block mb-1">
                          Öğle Uykusu
                        </label>
                        <select
                          value={student.sleepStatus}
                          onChange={e =>
                            updateStudent(student.id, s => ({
                              ...s,
                              sleepStatus: e.target.value as any
                            }))
                          }
                          className="w-full p-2 rounded-xl bg-surface-container-low font-bold text-xs border border-outline-variant/30"
                        >
                          <option value="Mışıl Mışıl Uyudu (13:00-14:30)">Mışıl Mışıl Uyudu</option>
                          <option value="Kısa Uyudu (45 dk)">Kısa Uyudu (45 dk)</option>
                          <option value="Dinlendi (Uyumadı)">Dinlendi (Uyumadı)</option>
                        </select>
                      </div>
                    </div>

                    {/* 0-3 Age Diaper Quick Entry */}
                    {student.ageGroup === '0-3' && (
                      <div className="p-3 rounded-2xl bg-surface-container-low flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-on-surface">
                          🍼 0-3 Yaş Bez / Özbakım Ekle ({student.diaperLogs.length} Kayıt):
                        </span>
                        <div className="flex items-center gap-1.5">
                          <select
                            value={newDiaperType}
                            onChange={e => setNewDiaperType(e.target.value as any)}
                            className="p-1.5 rounded-lg bg-white text-xs font-bold border border-outline-variant/30"
                          >
                            <option value="Islak">Islak Bez</option>
                            <option value="Normal">Normal Bez</option>
                            <option value="Krem Uygulandı">Pişik Kremi</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleTeacherAddDiaperLog(student.id)}
                            className="px-3 py-1.5 rounded-lg bg-primary-container text-white text-xs font-bold cursor-pointer"
                          >
                            + Kaydet
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Medicine Approval List for Teacher */}
                    {student.medicines.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-extrabold text-secondary block">
                          💊 Veli İlaç Bildirimleri (İçirince Onaylayın):
                        </span>
                        {student.medicines.map(med => (
                          <div
                            key={med.id}
                            className="p-2.5 rounded-xl bg-secondary-fixed/30 flex items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <span className="font-extrabold">{med.time}</span> — {med.name} ({med.dose})
                            </div>
                            {med.given ? (
                              <span className="text-[11px] font-extrabold text-tertiary">
                                Verildi ✅ ({med.givenAt})
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleTeacherGiveMedicine(student.id, med.id)}
                                className="px-3 py-1 rounded-lg bg-secondary text-white text-[11px] font-extrabold cursor-pointer"
                              >
                                İçirildi İşaretle ✓
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Teacher Daily Note */}
                    <div>
                      <label className="text-[10px] font-bold text-on-surface-variant block mb-1">
                        Veliye Gidecek Günlük Karne Notu:
                      </label>
                      <input
                        type="text"
                        value={student.teacherDailyNote}
                        onChange={e =>
                          updateStudent(student.id, s => ({ ...s, teacherDailyNote: e.target.value }))
                        }
                        className="w-full p-2.5 rounded-xl bg-surface-container-low text-xs font-medium border border-outline-variant/30"
                      />
                    </div>
                  </div>
                ))}
            </div>

            {/* Teacher Classroom Photo Share Form */}
            <form
              onSubmit={handleTeacherCreatePost}
              className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-2xs space-y-3"
            >
              <h3 className="font-display font-extrabold text-base text-on-surface flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary-container" />
                <span>Sınıf Albümüne Yeni Etkinlik Fotoğrafı / Hikaye Paylaş</span>
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newPostCaption}
                  onChange={e => setNewPostCaption(e.target.value)}
                  placeholder="Örn: Bugün bahçe saatimizde sonbahar yapraklarını inceledik..."
                  className="flex-1 h-11 px-4 rounded-xl bg-surface-container-low text-xs font-medium border border-outline-variant/30"
                />
                <button
                  type="submit"
                  className="px-6 h-11 rounded-xl bg-primary-container hover:bg-primary text-white text-xs font-extrabold cursor-pointer shrink-0"
                >
                  Velilerle Paylaş 📸
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =====================================================================
            ROL 3: 🏢 KREŞ SAHİBİ / KURUM MÜDÜRÜ (İDARE + STOK PRATİK ERP)
           ===================================================================== */}
        {activeKidsRole === 'kurum_sahibi' && (
          <div className="space-y-6 animate-fade-in">
            {/* 2-Stage Institution & Stok Pratik Status Header */}
            <div className="bg-inverse-surface text-inverse-on-surface rounded-3xl p-6 sm:p-8 shadow-lg space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-extrabold uppercase tracking-wider">
                      🏢 İSTEM KIDS KURUM SAHİBİ &amp; MÜDÜR PANELİ
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold">
                      {institution.stage === 'aktif_kurum_stok_pratik'
                        ? `2. Aşama: Stok Pratik ERP Aktif (${institution.stokPratikTenantId})`
                        : '1. Aşama: Sadece Ücretsiz Vitrin (Stok Pratik Kapalı)'}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                    {institution.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-inverse-on-surface/80 max-w-3xl">
                    Kreşinizin sınıf/öğretmen atamalarını, veli ön kayıtlarını ve{' '}
                    <strong>Stok Pratik</strong> ön muhasebe, aidat sözleşmesi, GİB e-Fatura ve mutfak/özbakım stoklarını tek merkezden yönetin.
                  </p>
                </div>

                {/* Stage Switcher to demonstrate 2-tier Stok Pratik account logic */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const nextStage =
                        institution.stage === 'aktif_kurum_stok_pratik'
                          ? 'vitrin_ucretsiz'
                          : 'aktif_kurum_stok_pratik';
                      setInstitution(prev => ({ ...prev, stage: nextStage }));
                      triggerToast(
                        nextStage === 'aktif_kurum_stok_pratik'
                          ? '🚀 Stok Pratik Kurumsal Hesabı (SP-KRES-34092) ve Otomatik e-Fatura motoru aktifleştirildi!'
                          : 'ℹ️ Kurum 1. Aşama (Sadece Ücretsiz Vitrin) görünümüne alındı.'
                      );
                    }}
                    className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold transition cursor-pointer border border-white/15"
                  >
                    {institution.stage === 'aktif_kurum_stok_pratik'
                      ? '🔄 1. Aşama (Vitrin) Modunu Test Et'
                      : '🚀 Stok Pratik Hesabını Aktifleştir (2. Aşama)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTo('school-mgmt')}
                    className="px-5 py-3 rounded-2xl bg-primary-container hover:bg-primary text-white text-xs font-extrabold transition shadow-md cursor-pointer"
                  >
                    Vitrin &amp; Şube Bilgilerini Düzenle
                  </button>
                </div>
              </div>
            </div>

            {institution.stage === 'vitrin_ucretsiz' ? (
              /* Stage 1: Free Vitrin Only Notice */
              <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/40 text-center space-y-4">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
                  1. AŞAMA: ÜCRETSİZ VİTRİN &amp; ÖN KAYIT ÜYESİ
                </span>
                <h3 className="text-xl font-extrabold font-display text-on-surface">
                  Şu Anda Sadece İSTEM Rehber Vitrinindesiniz (Stok Pratik Hesabı Açılmadı)
                </h3>
                <p className="text-xs text-on-surface-variant max-w-xl mx-auto leading-relaxed">
                  Vitrin başvurularında otomatik Stok Pratik muhasebe hesabı açılmaz. Velilere Günlük Karne sunmak, aidat/taksit tahsilatı yapmak, otomatik GİB e-Fatura kesmek ve mutfak/erzak stoklarınızı yönetmek için tek tıkla 2. Aşamaya geçebilirsiniz.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setInstitution(prev => ({ ...prev, stage: 'aktif_kurum_stok_pratik' }));
                    triggerToast('🎉 Stok Pratik Kurumsal Hesabınız (SP-KRES-34092) açıldı!');
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-tertiary text-white text-xs font-extrabold shadow-md cursor-pointer"
                >
                  🚀 Şimdi Stok Pratik &amp; İSTEM Kids Tam Paketi Aktifleştir
                </button>
              </div>
            ) : (
              /* Stage 2: Full İSTEM Kids + Stok Pratik ERP Dashboard */
              <>
                {/* 4 KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                      <span>AKTİF ÖĞRENCİ / KAPASİTE</span>
                      <Users className="w-4 h-4 text-primary-container" />
                    </div>
                    <p className="text-2xl font-extrabold font-display text-on-surface mt-2">
                      {institution.enrolledCount} / {institution.capacity}
                    </p>
                    <span className="text-[11px] font-bold text-tertiary mt-1 block">
                      {institution.classes.length} Aktif Sınıf • Son {institution.capacity - institution.enrolledCount} Kontenjan
                    </span>
                  </div>

                  <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                      <span>STOK PRATİK AYLIK TAHSİLAT</span>
                      <Wallet className="w-4 h-4 text-tertiary" />
                    </div>
                    <p className="text-2xl font-extrabold font-display text-on-surface mt-2">
                      ₺
                      {students
                        .filter(s => s.tuitionPaid)
                        .reduce((acc, s) => acc + s.tuitionAmount, 2620000)
                        .toLocaleString('tr-TR')}
                    </p>
                    <span className="text-[11px] font-bold text-tertiary mt-1 block">
                      GİB e-Fatura &amp; Cari Senkronize
                    </span>
                  </div>

                  <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                      <span>BEKLEYEN ÖN KAYIT TALEBİ</span>
                      <Building2 className="w-4 h-4 text-secondary" />
                    </div>
                    <p className="text-2xl font-extrabold font-display text-on-surface mt-2">
                      {leads.length} Aday Veli
                    </p>
                    <span className="text-[11px] font-bold text-secondary mt-1 block">
                      Tek tıkla kesin kayda &amp; sözleşmeye dönüştürün
                    </span>
                  </div>

                  <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                      <span>MUTFAK &amp; ÖZBAKIM STOK</span>
                      <Package className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="text-2xl font-extrabold font-display text-on-surface mt-2">
                      {institution.stockAlerts.filter(a => a.critical).length} Kritik Uyarı
                    </p>
                    <span className="text-[11px] font-bold text-amber-700 mt-1 block">
                      Stok Pratik Erzak &amp; Bez Depo Takibi
                    </span>
                  </div>
                </div>

                {/* Row 1: Stok Pratik Tuition & Lead Conversion */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-tertiary">
                          STOK PRATİK FİNANS &amp; ÖN MUHASEBE MOTORU
                        </span>
                        <h3 className="text-lg font-extrabold font-display text-on-surface">
                          Öğrenci Taksitleri ve GİB e-Fatura Durumu
                        </h3>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold">
                        Tenant: {institution.stokPratikTenantId}
                      </span>
                    </div>

                    <div className="divide-y divide-outline-variant/20 text-sm">
                      {students.map(std => (
                        <div
                          key={std.id}
                          className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div>
                            <p className="font-bold text-on-surface">
                              {std.parentName} ({std.name} — {std.className})
                            </p>
                            <p className="text-xs text-on-surface-variant">
                              Pasaport: {std.passportId} • Eğitim + Yemek
                            </p>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-extrabold font-display text-sm">
                              ₺{std.tuitionAmount.toLocaleString('tr-TR')}
                            </span>
                            {std.tuitionPaid ? (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold text-tertiary bg-tertiary-fixed/40">
                                Ödendi ({std.invoiceNo || 'e-Fatura Kesildi'})
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handlePayStudentTuition(std.id)}
                                className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 hover:bg-amber-200 cursor-pointer"
                              >
                                Tahsilat İşle &amp; e-Fatura Kes
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lead to Student Contract Conversion */}
                  <div className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs space-y-4">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                      İSTEM VİTRİN → STOK PRATİK SÖZLEŞME KÖPRÜSÜ
                    </span>
                    <h3 className="text-lg font-extrabold font-display text-on-surface">
                      Bekleyen Ön Kayıt Başvuruları
                    </h3>
                    {leads.length === 0 ? (
                      <p className="text-xs text-on-surface-variant">
                        Tüm aday veliler kesin kayda dönüştürüldü!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {leads.map(lead => (
                          <div
                            key={lead.id}
                            className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between gap-3"
                          >
                            <div>
                              <p className="font-bold text-sm text-on-surface">
                                {lead.name} ({lead.childName})
                              </p>
                              <p className="text-xs text-on-surface-variant">
                                {lead.childDesc} • {lead.phone}
                              </p>
                              <span className="text-[11px] font-bold text-primary mt-1 inline-block">
                                {lead.status}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOwnerConvertLead(lead.id)}
                              className="px-3 py-2 rounded-xl bg-primary-container text-white text-xs font-bold hover:bg-primary transition shrink-0 cursor-pointer"
                            >
                              Kesin Kayda Al
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Kitchen & Hygiene Stock Alerts */}
                    <div className="pt-3 border-t border-outline-variant/20 space-y-2">
                      <span className="text-xs font-extrabold text-on-surface block">
                        📦 Stok Pratik Mutfak, Erzak &amp; Özbakım Depo Uyarıları:
                      </span>
                      {institution.stockAlerts.map(st => (
                        <div
                          key={st.id}
                          className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-bold text-on-surface">{st.item}</p>
                            <span className="text-[10px] text-on-surface-variant">{st.category}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              st.critical
                                ? 'bg-red-100 text-red-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {st.remaining}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Row 2: Class & Teacher Assignment + Photo Approval */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 space-y-4">
                    <h3 className="text-base font-extrabold font-display text-on-surface">
                      🏫 Sınıf, Yaş Grubu ve Öğretmen Atama Masası
                    </h3>
                    <div className="space-y-2">
                      {institution.classes.map(c => (
                        <div
                          key={c.id}
                          className="p-3 rounded-2xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="font-extrabold text-on-surface">{c.name}</span>{' '}
                            <span className="text-on-surface-variant">({c.ageRange})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-primary">👩‍🏫 {c.teacher}</span>
                            <span className="text-on-surface-variant">• {c.assistant}</span>
                            <span className="px-2 py-0.5 rounded-full bg-white font-extrabold">
                              {c.count} Öğrenci
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleOwnerAddClass} className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                      <input
                        type="text"
                        value={newClassName}
                        onChange={e => setNewClassName(e.target.value)}
                        placeholder="Yeni Sınıf Adı (Örn: Kelebekler)"
                        className="h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                      />
                      <input
                        type="text"
                        value={newClassTeacher}
                        onChange={e => setNewClassTeacher(e.target.value)}
                        placeholder="Sınıf Öğretmeni Adı"
                        className="h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                      />
                      <button
                        type="submit"
                        className="h-10 rounded-xl bg-primary-container text-white text-xs font-extrabold cursor-pointer"
                      >
                        + Sınıf &amp; Öğretmen Ata
                      </button>
                    </form>
                  </div>

                  {/* Owner Photo Approval Box */}
                  <div className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 space-y-3">
                    <h3 className="text-base font-extrabold font-display text-on-surface">
                      📸 Öğretmen Albüm Paylaşım Denetimi
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Öğretmenlerin yüklediği sınıf fotoğraflarını velilere görünür kılabilir veya gizleyebilirsiniz.
                    </p>
                    <div className="space-y-2.5">
                      {posts.map(p => (
                        <div
                          key={p.id}
                          className="p-3 rounded-2xl bg-surface-container-low flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="line-clamp-2">
                            <strong>{p.teacherName}:</strong> {p.caption}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setPosts(prev =>
                                prev.map(item =>
                                  item.id === p.id
                                    ? { ...item, approvedByOwner: !item.approvedByOwner }
                                    : item
                                )
                              )
                            }
                            className={`px-3 py-1.5 rounded-xl font-extrabold shrink-0 cursor-pointer ${
                              p.approvedByOwner
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {p.approvedByOwner ? 'Yayında ✓' : 'Onayla'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* =====================================================================
            ROL 4: 🚌 SERVİS HOSTESİ & KAPI TESLİM GÖREVLİSİ MİNİ PANELİ
           ===================================================================== */}
        {activeKidsRole === 'servis_gorevlisi' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-tertiary bg-tertiary-fixed px-3 py-1 rounded-full">
                  🚌 SERVİS HOSTESİ &amp; KAPI GÜVENLİK EKRANI (34 IST 424)
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold font-display text-on-surface mt-2">
                  Öğrenci Servise Bindi/İndi &amp; Güvenli Teslim Kodu Doğrulama
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Bu kısıtlı rol sadece öğrencilerin güvenli ulaşım ve kapı teslim durumlarını görür; muhasebe veya özel sağlık verilerine erişemez.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 5 Cols: Safe Pickup Code (QR) Verifier */}
              <div className="lg:col-span-5 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary-container flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-base text-on-surface">
                      Güvenli Teslim Kodu (QR) Doğrulama
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Anne-baba dışındaki alıcının (anneanne/teyze) kodunu sorgulayın
                    </p>
                  </div>
                </div>

                <form onSubmit={handleVerifyPickupCode} className="flex gap-2">
                  <input
                    type="text"
                    value={verifyCodeInput}
                    onChange={e => setVerifyCodeInput(e.target.value)}
                    placeholder="Örn: ZR-8492"
                    className="flex-1 h-11 px-4 rounded-xl bg-surface-container-low font-mono font-extrabold text-sm uppercase border border-outline-variant/30"
                  />
                  <button
                    type="submit"
                    className="px-5 h-11 rounded-xl bg-primary-container text-white text-xs font-extrabold cursor-pointer"
                  >
                    Kodu Doğrula
                  </button>
                </form>

                {verifyResult && (
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-xs font-bold leading-relaxed">
                    {verifyResult}
                  </div>
                )}

                <div className="pt-2 border-t border-outline-variant/20 space-y-2">
                  <span className="text-[11px] font-extrabold text-on-surface-variant block">
                    Aktif Tanımlı Alıcı Kodları:
                  </span>
                  {students.map(s => (
                    <div
                      key={s.id}
                      className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong>{s.name}:</strong> {s.pickupAuth.personName} ({s.pickupAuth.relation})
                      </div>
                      <button
                        type="button"
                        onClick={() => setVerifyCodeInput(s.pickupAuth.code)}
                        className="font-mono font-extrabold text-primary underline cursor-pointer"
                      >
                        {s.pickupAuth.code}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 7 Cols: Shuttle Boarding / Dropoff List */}
              <div className="lg:col-span-7 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 space-y-4">
                <h3 className="font-display font-extrabold text-base text-on-surface">
                  🚌 Öğrenci Servis &amp; Kapı Teslim Listesi
                </h3>
                <div className="space-y-3">
                  {students.map(s => (
                    <div
                      key={s.id}
                      className="p-4 rounded-2xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img src={s.avatar} alt={s.name} className="w-11 h-11 rounded-xl object-cover" />
                        <div>
                          <p className="font-extrabold text-sm text-on-surface">{s.name}</p>
                          <p className="text-xs text-on-surface-variant">
                            {s.className} • Veli: {s.parentPhone}
                          </p>
                          <span className="text-[11px] font-extrabold text-primary mt-0.5 inline-block">
                            Durum: {s.shuttleStatus}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            updateStudent(s.id, prev => ({
                              ...prev,
                              shuttleStatus: 'Servise Bindi - Eve Dönüyor 🚌'
                            }));
                            triggerToast(`🚌 ${s.name} servise bindi bildirimi veliye gönderildi!`);
                          }}
                          className="px-3 py-2 rounded-xl bg-primary-container text-white text-[11px] font-extrabold cursor-pointer"
                        >
                          Servise Bindi 🚌
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateStudent(s.id, prev => ({
                              ...prev,
                              gateBellActive: false,
                              shuttleStatus: 'Veliye Güvenle Teslim Edildi ✅'
                            }));
                            triggerToast(`✅ ${s.name} velisine güvenle teslim edildi!`);
                          }}
                          className="px-3 py-2 rounded-xl bg-tertiary text-white text-[11px] font-extrabold cursor-pointer"
                        >
                          Teslim Edildi ✅
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= VELİ MODALLARI (İLAÇ, TESLİM KODU QR, AYLIK MENÜ, SABAH NOTU, PASAPORT) ================= */}
      {activeVeliModal && currentKidsStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            {activeVeliModal === 'ilac' && (
              <form onSubmit={handleAddMedicineSubmit} className="space-y-3.5">
                <h3 className="font-display font-extrabold text-base text-on-surface">
                  💊 {currentKidsStudent.name} İçin İlaç / Vitamin Bildirimi
                </h3>
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">İlaç / Vitamin Adı *</label>
                  <input
                    type="text"
                    required
                    value={newMedName}
                    onChange={e => setNewMedName(e.target.value)}
                    placeholder="Örn: Calpol Şurup veya Sambucol"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">Verilecek Saat</label>
                    <input
                      type="time"
                      value={newMedTime}
                      onChange={e => setNewMedTime(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">Ölçek / Not</label>
                    <input
                      type="text"
                      value={newMedDose}
                      onChange={e => setNewMedDose(e.target.value)}
                      placeholder="1 Ölçek (Tok)"
                      className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveVeliModal(null)}
                    className="flex-1 py-2.5 rounded-xl bg-surface-container text-xs font-bold cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-secondary text-white text-xs font-extrabold cursor-pointer"
                  >
                    Öğretmene İlet
                  </button>
                </div>
              </form>
            )}

            {activeVeliModal === 'teslim_kodu' && (
              <form onSubmit={handleCreatePickupCode} className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-extrabold text-base text-on-surface">
                    🔐 Güvenli Teslim Kodu (Kim Alacak?)
                  </h3>
                  <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-primary-container font-mono font-extrabold text-xs">
                    {currentKidsStudent.pickupAuth.code}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Çocuğunuzu bugün sizden başka biri (anneanne, dede, teyze) alacaksa bilgilerini girip tek kullanımlık teslim kodu oluşturun.
                </p>
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Teslim Alacak Kişi Adı Soyadı</label>
                  <input
                    type="text"
                    value={pickupPerson}
                    onChange={e => setPickupPerson(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">Yakınlık Derecesi</label>
                    <input
                      type="text"
                      value={pickupRelation}
                      onChange={e => setPickupRelation(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">Telefonu</label>
                    <input
                      type="text"
                      value={pickupPhone}
                      onChange={e => setPickupPhone(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveVeliModal(null)}
                    className="flex-1 py-2.5 rounded-xl bg-surface-container text-xs font-bold cursor-pointer"
                  >
                    Kapat
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-primary-container text-white text-xs font-extrabold cursor-pointer"
                  >
                    Yeni Kod Üret
                  </button>
                </div>
              </form>
            )}

            {activeVeliModal === 'sabah_notu' && (
              <div className="space-y-3.5">
                <h3 className="font-display font-extrabold text-base text-on-surface">
                  💬 Öğretmene Sabah Teslim Notu
                </h3>
                <textarea
                  rows={3}
                  value={morningNoteInput}
                  onChange={e => setMorningNoteInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface-container-low text-xs border border-outline-variant/30"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveVeliModal(null)}
                    className="flex-1 py-2.5 rounded-xl bg-surface-container text-xs font-bold cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateStudent(currentKidsStudent.id, s => ({
                        ...s,
                        parentMorningNote: morningNoteInput
                      }));
                      setActiveVeliModal(null);
                      triggerToast('💬 Sabah notunuz sınıf öğretmeninin ekranına iletildi.');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-primary-container text-white text-xs font-extrabold cursor-pointer"
                  >
                    Notu Kaydet
                  </button>
                </div>
              </div>
            )}

            {activeVeliModal === 'menu' && (
              <div className="space-y-3.5">
                <h3 className="font-display font-extrabold text-base text-on-surface">
                  🍽️ Haftalık Beslenme &amp; Alerjen Menüsü
                </h3>
                <div className="space-y-2.5 max-h-80 overflow-y-auto">
                  {institution.monthlyMenu.map((m, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-surface-container-low text-xs space-y-1">
                      <span className="font-extrabold text-primary block">{m.day}</span>
                      <p><strong>Kahvaltı:</strong> {m.breakfast}</p>
                      <p><strong>Öğle:</strong> {m.lunch}</p>
                      <p><strong>İkindi:</strong> {m.snack}</p>
                      <p className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                        ⚠️ {m.allergenWarning}
                      </p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVeliModal(null)}
                  className="w-full py-2.5 rounded-xl bg-primary-container text-white text-xs font-extrabold cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            )}

            {activeVeliModal === 'pasaport' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-extrabold text-base text-on-surface">
                    🌱 Yaşam Boyu Tek Öğrenci Pasaportu
                  </h3>
                  <span className="font-mono font-bold text-xs text-primary">
                    {currentKidsStudent.passportId}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Çocuğunuz büyüdükçe yeni hesap açılmaz; <strong>Öğrenci Pasaport ID</strong> sabit kalır ve geçmiş gelişim/karne arşivi korunarak bir üst seviye modülü açılır:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-2xl bg-primary-fixed/50 border border-primary-container/30">
                    <span className="font-extrabold text-on-primary-fixed block">
                      1. 🧸 İSTEM Kids (0-6 Yaş Kreş &amp; Anaokulu) — ŞU AN AKTİF
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      %100 Veli kontrolü + Öğretmen günlük karne, uyku, yemek, ilaç ve güvenli teslim kodu.
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-surface-container-low">
                    <span className="font-extrabold text-on-surface block">
                      2. 🎒 İSTEM Junior (İlkokul &amp; Ortaokul K-8)
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      İlkokul 3-4. sınıftan itibaren <strong>&ldquo;Çocuk Modu&rdquo;</strong> açılır; çocuk kendi ödevlerini, okuduğu kitapları ve rozetlerini takip etmeye başlar.
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-surface-container-low">
                    <span className="font-extrabold text-on-surface block">
                      3. 🎯 İSTEM Kampüs (Lise &amp; YKS) &amp; 🚀 İSTEM Akademi
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Öğrenci kendi etüt/özel ders randevusunu ve sınav hedefini yönetir; yetişkinlikte kariyer ve sertifika portfolyosuna dönüşür.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVeliModal(null)}
                  className="w-full py-2.5 rounded-xl bg-primary-container text-white text-xs font-extrabold cursor-pointer"
                >
                  Anladım, Kapat
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
