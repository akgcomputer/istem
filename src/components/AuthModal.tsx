import React, { useState } from 'react';
import {
  X, Eye, EyeOff, Phone, Lock, Building2, User, ShieldCheck,
  Rocket, ArrowRight, Check, Sparkles, GraduationCap, Info,
  Baby, Bus, UserCheck, CheckCircle2
} from 'lucide-react';
import { ISTEM_KIDS_DEMO_ACCOUNTS, IstemKidsRole } from '../data/istemKidsData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (
    userName: string,
    role: string,
    institutionCode?: string,
    kidsRole?: IstemKidsRole
  ) => void;
  initialMode?: 'login' | 'register' | 'kurum' | 'talep';
  initialTargetName?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'kurum',
  initialTargetName = 'Özel Zerdali Orman & Ekoloji Anaokulu'
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'kurum' | 'uyelik' | 'bireysel' | 'talep'>(
    initialMode === 'register' ? 'uyelik' : initialMode === 'login' ? 'bireysel' : initialMode
  );

  // Institution (Kurum Kodu) Login State - İSTEM Kids 4-Role Support
  const [institutionCode, setInstitutionCode] = useState('zerdalikres');
  const [instUsername, setInstUsername] = useState('fatihsari');
  const [instPassword, setInstPassword] = useState('141346');
  const [showInstPwd, setShowInstPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedKidsRole, setSelectedKidsRole] = useState<IstemKidsRole>('veli');

  // Membership (Yeni Kreş / Veli Üyelik Yapısı) State
  const [regType, setRegType] = useState<'veli_kayit' | 'kres_kayit'>('veli_kayit');
  // Parent Registration Fields
  const [regParentName, setRegParentName] = useState('');
  const [regParentPhone, setRegParentPhone] = useState('');
  const [regInstCode, setRegInstCode] = useState('zerdalikres');
  const [regChildName, setRegChildName] = useState('');
  const [regChildAgeGroup, setRegChildAgeGroup] = useState<'0-3' | '3-6'>('3-6');
  const [regChildAllergy, setRegChildAllergy] = useState('');
  // Kindergarten / School Owner Registration Fields (2-Tier Model)
  const [regSchoolName, setRegSchoolName] = useState('');
  const [regSchoolDistrict, setRegSchoolDistrict] = useState('');
  const [regOwnerName, setRegOwnerName] = useState('');
  const [regOwnerPhone, setRegOwnerPhone] = useState('');
  const [regSchoolTier, setRegSchoolTier] = useState<'vitrin_ucretsiz' | 'aktif_kurum_stok_pratik'>('aktif_kurum_stok_pratik');

  // Individual (Bireysel / Yönetici / Öğretmen) Login State
  const [loginTel, setLoginTel] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginRole, setLoginRole] = useState('Bireysel');

  // Lead / Pre-registration (Ön Kayıt & Teklif) State
  const [targetEntity, setTargetEntity] = useState(initialTargetName);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadNote, setLeadNote] = useState('');

  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialTargetName) {
      setTargetEntity(initialTargetName);
    }
  }, [initialTargetName]);

  React.useEffect(() => {
    if (initialMode === 'register') {
      setActiveTab('uyelik');
    } else if (initialMode === 'talep') {
      setActiveTab('talep');
    } else if (initialMode === 'login') {
      setActiveTab('bireysel');
    } else {
      setActiveTab('kurum');
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSelectDemoKidsRole = (role: IstemKidsRole) => {
    const found = ISTEM_KIDS_DEMO_ACCOUNTS.find(a => a.role === role);
    if (found) {
      setSelectedKidsRole(found.role);
      setInstitutionCode(found.institutionCode);
      setInstUsername(found.username);
      setInstPassword(found.password);
      setErrorMsg(null);
    }
  };

  const handlePhoneChange = (inputVal: string, setter: (val: string) => void) => {
    const cleaned = inputVal.replace(/\D/g, '').slice(0, 10);
    let formatted = cleaned;
    if (cleaned.length > 3 && cleaned.length <= 6) {
      formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    } else if (cleaned.length > 6 && cleaned.length <= 8) {
      formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else if (cleaned.length > 8) {
      formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
    }
    setter(formatted);
  };

  const handleInstitutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionCode.trim() || !instUsername.trim() || !instPassword.trim()) {
      setErrorMsg('Lütfen Kurum Kodu, Kullanıcı Adı ve Şifre alanlarını doldurun.');
      return;
    }
    setErrorMsg(null);

    // Determine role from username if user typed one of the demo usernames
    let resolvedKidsRole: IstemKidsRole = selectedKidsRole;
    const matchedDemo = ISTEM_KIDS_DEMO_ACCOUNTS.find(
      a => a.username.toLowerCase() === instUsername.trim().toLowerCase()
    );
    if (matchedDemo) {
      resolvedKidsRole = matchedDemo.role;
    }

    const roleTitleMap: Record<IstemKidsRole, string> = {
      veli: 'Veli Portalı',
      ogretmen: 'Sınıf Öğretmeni',
      kurum_sahibi: 'Okul Temsilcisi',
      servis_gorevlisi: 'Servis Görevlisi'
    };

    setMessage(
      `🚀 ${institutionCode.toUpperCase()} İSTEM Kids portalına (${roleTitleMap[resolvedKidsRole]}) bağlanılıyor...`
    );
    setTimeout(() => {
      onLoginSuccess(
        instUsername,
        roleTitleMap[resolvedKidsRole],
        institutionCode.trim().toLowerCase(),
        resolvedKidsRole
      );
      onClose();
      setMessage(null);
    }, 700);
  };

  const handleMembershipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (regType === 'veli_kayit') {
      if (!regParentName.trim() || !regChildName.trim()) {
        setErrorMsg('Lütfen veli ad-soyadını ve çocuğunuzun adını giriniz.');
        return;
      }
      const passportCode = `IST-PAS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      // Save custom registered child to localStorage so ParentPortalView picks it up
      try {
        const newChildObj = {
          id: `child-${Date.now()}`,
          passportId: passportCode,
          name: regChildName.trim(),
          ageLabel: regChildAgeGroup === '0-3' ? '2 Yaş (Oyun & Bebek Grubu)' : '4 Yaş (Okul Öncesi)',
          ageGroup: regChildAgeGroup,
          className: regChildAgeGroup === '0-3' ? 'Minik Kalpler Sınıfı (0-3 Yaş)' : 'Papatyalar Sınıfı (4 Yaş)',
          avatar: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=300&q=80',
          parentName: regParentName.trim(),
          parentPhone: regParentPhone || '0532 000 00 00',
          parentUsername: regParentName.trim().toLowerCase().replace(/\s+/g, ''),
          allergies: regChildAllergy.trim() ? [regChildAllergy.trim()] : [],
          attendance: 'geldi',
          breakfast: 'Hepsini Yedi',
          lunch: 'Hepsini Yedi',
          snack: 'Hepsini Yedi',
          sleepStatus: 'Mışıl Mışıl Uyudu (13:00-14:30)',
          mood: 'Çok Neşeli & Paylaşımcı 😊',
          activities: ['Oryantasyon & Tanışma Oyunu', 'Ekoloji Bahçesi Gezisi'],
          diaperLogs:
            regChildAgeGroup === '0-3'
              ? [{ id: 1, time: '11:00', type: 'Normal', note: 'İlk gün özbakım kontrolü tamamlandı.' }]
              : [],
          teacherDailyNote: `${regChildName.trim()} bugün sınıfımıza harika uyum sağladı!`,
          parentMorningNote: 'İlk günümüz, heyecanlıyız.',
          shuttleStatus: 'Bugün Servise Binmeyecek (Veli Alacak)',
          gateBellActive: false,
          pickupAuth: {
            code: `ZR-${Math.floor(1000 + Math.random() * 9000)}`,
            personName: regParentName.trim(),
            relation: 'Velisi',
            phone: regParentPhone || '0532 000 00 00',
            createdAt: 'Yeni Kayıt',
            verified: true
          },
          medicines: [],
          tuitionAmount: 18500,
          tuitionPaid: false
        };
        localStorage.setItem('istem_kids_new_child', JSON.stringify(newChildObj));
      } catch {
        // ignore storage errors
      }

      setMessage(
        `🎉 Veli üyeliğiniz ve "${regChildName}" için Tek Öğrenci Pasaportu (${passportCode}) oluşturuldu! Portala yönlendiriliyorsunuz...`
      );
      setTimeout(() => {
        onLoginSuccess(regParentName.trim(), 'Veli Portalı', regInstCode.trim().toLowerCase(), 'veli');
        onClose();
        setMessage(null);
      }, 1200);
    } else {
      if (!regSchoolName.trim() || !regOwnerName.trim()) {
        setErrorMsg('Lütfen kurum adını ve yetkili ad-soyadını giriniz.');
        return;
      }
      const generatedCode = regSchoolName
        .toLowerCase()
        .replace(/[ğ]/g, 'g')
        .replace(/[ü]/g, 'u')
        .replace(/[ş]/g, 's')
        .replace(/[ı]/g, 'i')
        .replace(/[ö]/g, 'o')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 12) || 'yenikres';

      if (regSchoolTier === 'vitrin_ucretsiz') {
        setMessage(
          `✅ "${regSchoolName}" için Aşama 1 (Ücretsiz Vitrin & Ön Kayıt) üyeliği açıldı! (Stok Pratik muhasebe hesabı açılmadı, dilediğiniz zaman panelden aktifleştirebilirsiniz.)`
        );
      } else {
        setMessage(
          `🚀 "${regSchoolName}" (${generatedCode}) için İSTEM Kids Kurum Paneli + Stok Pratik Ön Muhasebe & e-Fatura Hesabı otomatik açıldı!`
        );
      }

      try {
        localStorage.setItem(
          'istem_kids_institution_stage',
          JSON.stringify({
            name: regSchoolName.trim(),
            code: generatedCode,
            district: regSchoolDistrict.trim() || 'İstanbul',
            stage: regSchoolTier
          })
        );
      } catch {
        // ignore
      }

      setTimeout(() => {
        onLoginSuccess(regOwnerName.trim(), 'Okul Temsilcisi', generatedCode, 'kurum_sahibi');
        onClose();
        setMessage(null);
      }, 1400);
    }
  };

  const handleIndividualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginTel || !loginPassword) {
      setErrorMsg('Lütfen telefon numaranızı ve şifrenizi giriniz.');
      return;
    }

    if (loginTel.replace(/\D/g, '') === '5325000999' && loginPassword === 'Akg1453akg!!') {
      onLoginSuccess('Admin', 'Yönetici');
      onClose();
      return;
    }

    if (loginTel.replace(/\D/g, '').length !== 10) {
      setErrorMsg('Lütfen 10 haneli geçerli bir telefon numarası giriniz (5XX XXX XX XX).');
      return;
    }

    setErrorMsg(null);
    setMessage(`🔓 Başarıyla ${loginRole} olarak giriş yapıldı!`);
    setTimeout(() => {
      onLoginSuccess(loginTel, loginRole);
      onClose();
      setMessage(null);
    }, 900);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) {
      setErrorMsg('Lütfen adınızı ve iletişim numaranızı giriniz.');
      return;
    }
    setErrorMsg(null);
    setMessage(
      `🎉 Ön kayıt ve bilgi talebiniz "${targetEntity}" yetkililerine (%0 komisyon güvencesiyle) iletildi!`
    );
    setTimeout(() => {
      onClose();
      setMessage(null);
      setLeadName('');
      setLeadPhone('');
      setLeadNote('');
    }, 1600);
  };

  const roles = [
    { id: 'Veli Portalı', label: 'Veli / Öğrenci Portalım' },
    { id: 'Bireysel', label: 'Bireysel Kursiyer' },
    { id: 'Öğretmen', label: 'Özel Ders Eğitmeni' },
    { id: 'Okul Temsilcisi', label: 'Okul / Kreş Yöneticisi' },
    { id: 'Kurs Temsilcisi', label: 'Kurs Merkezi Yöneticisi' },
    { id: 'Kurumsal', label: 'Şirket İK (B2B)' }
  ];

  const activeDemoInfo = ISTEM_KIDS_DEMO_ACCOUNTS.find(a => a.role === selectedKidsRole);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0f172a]/60 backdrop-blur-xs select-none">
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-t-[28px] sm:rounded-3xl shadow-2xl relative flex flex-col max-h-[94vh] overflow-hidden border border-outline-variant/30 animate-fade-in">
        {/* Top Mobile Drag Handle */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-surface-dim" />
        </div>

        {/* Modal Header */}
        <div className="px-6 pt-4 pb-3 flex items-start justify-between border-b border-outline-variant/20">
          <div className="pr-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-container" />
              <span>İstanbul Eğitim Merkezi (İSTEM) • İSTEM Kids &amp; Kampüs Erişimi</span>
            </div>
            <h2 className="font-display font-extrabold text-xl text-on-surface leading-tight">
              İSTEM Portalı &amp; Üyelik Sistemi
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Kreş/Okul rolünüzle (Veli, Öğretmen, Kurum Sahibi, Servis) giriş yapın veya yeni üyelik oluşturun.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4-Way Segmented Tab Switcher */}
        <div className="px-6 pt-3">
          <div className="p-1 rounded-2xl bg-surface-container-low grid grid-cols-2 sm:grid-cols-4 gap-1 border border-outline-variant/20">
            <button
              type="button"
              onClick={() => { setActiveTab('kurum'); setErrorMsg(null); }}
              className={`py-2 px-2 rounded-xl text-[11px] font-display font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'kurum'
                  ? 'bg-primary-container text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>Kreş / Okul Girişi</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('uyelik'); setErrorMsg(null); }}
              className={`py-2 px-2 rounded-xl text-[11px] font-display font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'uyelik'
                  ? 'bg-tertiary text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Baby className="w-3.5 h-3.5 shrink-0" />
              <span>Yeni Üyelik Aç</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('bireysel'); setErrorMsg(null); }}
              className={`py-2 px-2 rounded-xl text-[11px] font-display font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'bireysel'
                  ? 'bg-secondary text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>Bireysel / Eğitmen</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('talep'); setErrorMsg(null); }}
              className={`py-2 px-2 rounded-xl text-[11px] font-display font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'talep'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Şifresiz Ön Kayıt</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {message && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl p-3.5 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-2xl p-3.5">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* TAB 1: İSTEM KIDS 4 ROLLÜ KURUM / KREŞ GİRİŞİ */}
          {activeTab === 'kurum' && (
            <form onSubmit={handleInstitutionSubmit} className="space-y-3.5">
              {/* 4 Role Quick Selector for İSTEM Kids */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-on-surface">
                    🧸 İSTEM Kids (0-6 Yaş Kreş &amp; Anaokulu) Rol Seçimi:
                  </span>
                  <span className="text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
                    4 Yetki Seviyesi Hazır
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ISTEM_KIDS_DEMO_ACCOUNTS.map(acc => (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleSelectDemoKidsRole(acc.role)}
                      className={`p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                        selectedKidsRole === acc.role
                          ? 'border-primary-container bg-primary-fixed/40 ring-1 ring-primary-container/40'
                          : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-extrabold text-on-surface">{acc.roleLabel}</span>
                        {selectedKidsRole === acc.role && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary-container shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-primary block mt-0.5">{acc.badge}</span>
                    </button>
                  ))}
                </div>
                {activeDemoInfo && (
                  <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-[11px] text-on-surface-variant flex items-start gap-2">
                    <UserCheck className="w-4 h-4 text-primary-container shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-on-surface">{activeDemoInfo.fullName}:</strong>{' '}
                      {activeDemoInfo.summary}
                    </div>
                  </div>
                )}
              </div>

              {/* Kurum Kodu Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface flex items-center gap-1">
                    <span>Kurum Kodu (ID)</span>
                    <Info className="w-3.5 h-3.5 text-outline" />
                  </label>
                  <div className="flex items-center gap-1">
                    {[
                      { code: 'zerdalikres', label: 'zerdalikres' },
                      { code: 'mavibulut', label: 'mavibulut' },
                      { code: 'kuzeykoleji', label: 'kuzeykoleji' }
                    ].map(item => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setInstitutionCode(item.code)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                          institutionCode === item.code
                            ? 'bg-primary-container text-white'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative flex items-center">
                  <GraduationCap className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={institutionCode}
                    onChange={e => setInstitutionCode(e.target.value)}
                    placeholder="Örn: zerdalikres"
                    className="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-xl text-sm font-bold text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary-container"
                  />
                </div>
              </div>

              {/* Kullanıcı Adı & Şifre Yan Yana */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface block">Kullanıcı Adı</label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={instUsername}
                      onChange={e => setInstUsername(e.target.value)}
                      placeholder="fatihsari"
                      className="w-full h-10 pl-10 pr-3 bg-surface-container-low rounded-xl text-xs font-bold text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary-container"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-on-surface">Şifre</label>
                    <span className="text-[10px] text-secondary font-bold">Demo: 141346</span>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                    <input
                      type={showInstPwd ? 'text' : 'password'}
                      value={instPassword}
                      onChange={e => setInstPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 pl-10 pr-9 bg-surface-container-low rounded-xl text-xs font-bold text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary-container"
                    />
                    <button
                      type="button"
                      onClick={() => setShowInstPwd(!showInstPwd)}
                      className="absolute right-2.5 text-outline hover:text-on-surface p-1 cursor-pointer"
                    >
                      {showInstPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-on-surface">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="accent-[#FF6600] w-4 h-4 rounded"
                  />
                  <span>Beni Bu Cihazda Hatırla</span>
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTab('uyelik')}
                  className="text-[11px] font-extrabold text-primary hover:underline cursor-pointer"
                >
                  + Yeni Kreş veya Veli Üyeliği Aç
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-primary-container hover:bg-primary text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                <span>
                  {activeDemoInfo ? `${activeDemoInfo.roleLabel} Olarak Bağlan` : 'Kurum Paneline Bağlan'}
                </span>
              </button>
            </form>
          )}

          {/* TAB 2: YENİ ÜYELİK YAPISI (VELİ ÖĞRENCİ PASAPORTU VEYA 2 AŞAMALI KREŞ BAŞVURUSU) */}
          {activeTab === 'uyelik' && (
            <form onSubmit={handleMembershipSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container rounded-2xl">
                <button
                  type="button"
                  onClick={() => setRegType('veli_kayit')}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    regType === 'veli_kayit'
                      ? 'bg-white text-primary-container shadow-xs'
                      : 'text-on-surface-variant'
                  }`}
                >
                  👨‍👩‍👧 Veli &amp; Çocuk Kaydı
                </button>
                <button
                  type="button"
                  onClick={() => setRegType('kres_kayit')}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    regType === 'kres_kayit'
                      ? 'bg-white text-primary-container shadow-xs'
                      : 'text-on-surface-variant'
                  }`}
                >
                  🏫 Kreş / Anaokulu Başvurusu
                </button>
              </div>

              {regType === 'veli_kayit' ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-primary-fixed/40 border border-primary-container/20 text-xs text-on-primary-fixed">
                    <strong>Yaşam Boyu Tek Öğrenci Pasaportu:</strong> Çocuğunuz için şimdi açılan İSTEM Kids (0-6 Yaş) hesabı, ilkokul (İSTEM Junior) ve lisede (İSTEM Kampüs) veri kaybı olmadan büyüyerek devam eder.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-bold text-on-surface block mb-1">Veli Adı Soyadı *</label>
                      <input
                        type="text"
                        required
                        value={regParentName}
                        onChange={e => setRegParentName(e.target.value)}
                        placeholder="Örn: Esra Sarı"
                        className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-on-surface block mb-1">Veli Cep Telefonu *</label>
                      <input
                        type="tel"
                        required
                        value={regParentPhone}
                        onChange={e => setRegParentPhone(e.target.value)}
                        placeholder="0532 XXX XX XX"
                        className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-bold text-on-surface block mb-1">Çocuğunuzun Adı Soyadı *</label>
                      <input
                        type="text"
                        required
                        value={regChildName}
                        onChange={e => setRegChildName(e.target.value)}
                        placeholder="Örn: Defne Sarı"
                        className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-on-surface block mb-1">Kreş Kurum Kodu</label>
                      <input
                        type="text"
                        value={regInstCode}
                        onChange={e => setRegInstCode(e.target.value)}
                        placeholder="zerdalikres"
                        className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegChildAgeGroup('0-3')}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold cursor-pointer ${
                        regChildAgeGroup === '0-3'
                          ? 'border-primary-container bg-primary-fixed/40 text-on-primary-fixed'
                          : 'border-outline-variant/30 bg-white text-on-surface-variant'
                      }`}
                    >
                      🍼 0-3 Yaş Kreş / Bebek
                      <span className="block text-[10px] font-normal mt-0.5">Özbakım, Bez &amp; Uyku Takibi Açık</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegChildAgeGroup('3-6')}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold cursor-pointer ${
                        regChildAgeGroup === '3-6'
                          ? 'border-primary-container bg-primary-fixed/40 text-on-primary-fixed'
                          : 'border-outline-variant/30 bg-white text-on-surface-variant'
                      }`}
                    >
                      🎨 3-6 Yaş Anaokulu
                      <span className="block text-[10px] font-normal mt-0.5">Atölye, Yemek &amp; İlkokula Hazırlık</span>
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">
                      Varsa Besin Alerjisi / Hassasiyet Notu
                    </label>
                    <input
                      type="text"
                      value={regChildAllergy}
                      onChange={e => setRegChildAllergy(e.target.value)}
                      placeholder="Örn: Laktoz hassasiyeti, yer fıstığı alerjisi vb."
                      className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs border border-outline-variant/30"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-2xl bg-tertiary hover:opacity-95 text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <span>Veli Hesabımı &amp; Öğrenci Pasaportunu Oluştur</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* KREŞ / ANAOKULU 2 AŞAMALI KURUM BAŞVURUSU */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-bold text-on-surface block mb-1">Kreş / Anaokulu Adı *</label>
                      <input
                        type="text"
                        required
                        value={regSchoolName}
                        onChange={e => setRegSchoolName(e.target.value)}
                        placeholder="Örn: Özel Güneş Kreş ve Anaokulu"
                        className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-on-surface block mb-1">İlçe / Semt *</label>
                      <input
                        type="text"
                        required
                        value={regSchoolDistrict}
                        onChange={e => setRegSchoolDistrict(e.target.value)}
                        placeholder="Örn: Ataşehir, İstanbul"
                        className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-bold text-on-surface block mb-1">Kurucu / Müdür Adı *</label>
                      <input
                        type="text"
                        required
                        value={regOwnerName}
                        onChange={e => setRegOwnerName(e.target.value)}
                        placeholder="Örn: Selma Karahan"
                        className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-on-surface block mb-1">İletişim Telefonu *</label>
                      <input
                        type="tel"
                        required
                        value={regOwnerPhone}
                        onChange={e => setRegOwnerPhone(e.target.value)}
                        placeholder="0532 XXX XX XX"
                        className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs font-bold border border-outline-variant/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-on-surface block">
                      Kurum Paket Tercihi (Stok Pratik Entegrasyon Seçimi):
                    </label>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setRegSchoolTier('vitrin_ucretsiz')}
                        className={`w-full p-3 rounded-2xl border text-left transition cursor-pointer ${
                          regSchoolTier === 'vitrin_ucretsiz'
                            ? 'border-primary-container bg-primary-fixed/40'
                            : 'border-outline-variant/30 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-on-surface">
                            1. Aşama: Sadece Vitrin &amp; Ön Kayıt Üyesi (Ücretsiz)
                          </span>
                          <span className="text-[10px] font-bold bg-surface-container px-2 py-0.5 rounded-full">
                            Stok Pratik Açılmaz
                          </span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant mt-1">
                          Kurumunuz İSTEM rehberinde listelenir ve velilerden randevu/ön kayıt talebi toplar. Ön muhasebe hesabı açılmaz.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegSchoolTier('aktif_kurum_stok_pratik')}
                        className={`w-full p-3 rounded-2xl border text-left transition cursor-pointer ${
                          regSchoolTier === 'aktif_kurum_stok_pratik'
                            ? 'border-tertiary bg-tertiary-fixed/30 ring-1 ring-tertiary'
                            : 'border-outline-variant/30 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-on-surface">
                            2. Aşama: Tam Kurum Paketi (Günlük Karne + Stok Pratik ERP)
                          </span>
                          <span className="text-[10px] font-extrabold bg-tertiary text-white px-2 py-0.5 rounded-full">
                            Önerilen • Otomatik Tenant
                          </span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant mt-1">
                          Veli Günlük Karne Portalı + öğretmen paneli açılır; arka planda kuruma özel <strong>Stok Pratik</strong> ön muhasebe, aidat tahsilatı, GİB e-Fatura ve mutfak/erzak stok hesabı tanımlanır.
                        </p>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-2xl bg-primary-container hover:bg-primary text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <span>Kreş / Anaokulu Hesabını Şimdi Aç</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </form>
          )}

          {/* TAB 3: BİREYSEL / EĞİTMEN / YÖNETİCİ GİRİŞİ */}
          {activeTab === 'bireysel' && (
            <form onSubmit={handleIndividualSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface block">Cep Telefonu Numaranız</label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    maxLength={13}
                    value={loginTel}
                    onChange={e => handlePhoneChange(e.target.value, setLoginTel)}
                    placeholder="5XX XXX XX XX"
                    className="w-full h-11 pl-10 pr-4 bg-surface-container-low rounded-xl text-sm font-mono font-bold text-on-surface border border-outline-variant/30 focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface block">Şifreniz</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-10 bg-surface-container-low rounded-xl text-sm font-bold text-on-surface border border-outline-variant/30 focus:outline-none focus:border-secondary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 text-outline hover:text-on-surface p-1 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-on-surface block">Giriş Yapılacak Profil:</span>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setLoginRole(r.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer ${
                        loginRole === r.id
                          ? 'border-secondary bg-secondary-fixed/40 text-on-secondary-fixed'
                          : 'border-outline-variant/30 bg-white text-on-surface-variant'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-secondary hover:opacity-95 text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <span>Giriş Yap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 4: HIZLI ÖN KAYIT & RANDEVU / DERS TALEBİ */}
          {activeTab === 'talep' && (
            <form onSubmit={handleLeadSubmit} className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-tertiary-fixed/30 text-xs text-on-tertiary-fixed-variant font-medium">
                Şifre veya üyelik gerekmeden doğrudan okuldan randevu/fiyat teklifi alabilir veya özel ders eğitmenine mesaj bırakabilirsiniz.
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface block">
                  İlgilendiğiniz Okul, Kreş veya Eğitmen
                </label>
                <input
                  type="text"
                  value={targetEntity}
                  onChange={e => setTargetEntity(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-sm font-bold text-on-surface border border-outline-variant/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface block">Adınız Soyadınız *</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={e => setLeadName(e.target.value)}
                    placeholder="Örn: Ahmet Yılmaz"
                    className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-sm text-on-surface border border-outline-variant/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface block">Telefon Numaranız *</label>
                  <input
                    type="tel"
                    required
                    value={leadPhone}
                    onChange={e => setLeadPhone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-sm text-on-surface border border-outline-variant/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface block">
                  Notunuz (Çocuğunuzun Yaşı / Sınıfı)
                </label>
                <textarea
                  rows={2}
                  value={leadNote}
                  onChange={e => setLeadNote(e.target.value)}
                  placeholder="Örn: 4 yaş kreş tam gün fiyat bilgisi ve tanıtım randevusu rica ediyorum."
                  className="w-full p-3 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-2xl bg-tertiary hover:opacity-95 text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <span>Ücretsiz Ön Başvuru &amp; Randevu Gönder</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Dismiss link for open discovery */}
          <div className="pt-2 border-t border-outline-variant/20 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-on-surface-variant hover:text-primary transition cursor-pointer"
            >
              Şifre girmeden açık pazaryerini gezmeye devam et ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
