import React, { useState } from 'react';
import {
  X, Eye, EyeOff, Phone, Lock, Building2, User, ShieldCheck,
  Rocket, ArrowRight, Check, Sparkles, GraduationCap, Info
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userName: string, role: string, institutionCode?: string) => void;
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
  const [activeTab, setActiveTab] = useState<'kurum' | 'bireysel' | 'talep'>(
    initialMode === 'register' ? 'talep' : initialMode === 'login' ? 'bireysel' : initialMode
  );

  // Institution (Kurum Kodu) Login State
  const [institutionCode, setInstitutionCode] = useState('zerdalikres');
  const [instUsername, setInstUsername] = useState('fatihsari');
  const [instPassword, setInstPassword] = useState('141346');
  const [showInstPwd, setShowInstPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [instRoleType, setInstRoleType] = useState<'Veli Portalı' | 'Okul Temsilcisi'>('Veli Portalı');

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
    if (initialMode === 'register' || initialMode === 'talep') {
      setActiveTab('talep');
    } else if (initialMode === 'login') {
      setActiveTab('bireysel');
    } else {
      setActiveTab('kurum');
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

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
    setMessage(`🚀 ${institutionCode.toUpperCase()} kurum portalına bağlanılıyor...`);
    setTimeout(() => {
      onLoginSuccess(instUsername, instRoleType, institutionCode.trim().toLowerCase());
      onClose();
      setMessage(null);
    }, 900);
  };

  const handleIndividualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginTel || !loginPassword) {
      setErrorMsg('Lütfen telefon numaranızı ve şifrenizi giriniz.');
      return;
    }

    // Admin check
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
    }, 1000);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) {
      setErrorMsg('Lütfen adınızı ve iletişim numaranızı giriniz.');
      return;
    }
    setErrorMsg(null);
    setMessage(`🎉 Ön kayıt ve bilgi talebiniz "${targetEntity}" yetkililerine (%0 komisyon güvencesiyle) iletildi!`);
    setTimeout(() => {
      onClose();
      setMessage(null);
      setLeadName('');
      setLeadPhone('');
      setLeadNote('');
    }, 1800);
  };

  const roles = [
    { id: 'Veli Portalı', label: 'Veli / Öğrenci Portalım' },
    { id: 'Bireysel', label: 'Bireysel Kursiyer' },
    { id: 'Öğretmen', label: 'Özel Ders Eğitmeni' },
    { id: 'Okul Temsilcisi', label: 'Okul / Kreş Yöneticisi' },
    { id: 'Kurs Temsilcisi', label: 'Kurs Merkezi Yöneticisi' },
    { id: 'Kurumsal', label: 'Şirket İK (B2B)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0f172a]/60 backdrop-blur-xs select-none">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-t-[28px] sm:rounded-3xl shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden border border-outline-variant/30 animate-fade-in">
        {/* Top Mobile Drag Handle */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-surface-dim" />
        </div>

        {/* Modal Header */}
        <div className="px-6 pt-4 pb-3 flex items-start justify-between border-b border-outline-variant/20">
          <div className="pr-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-container" />
              <span>İstanbul Eğitim Merkezi (İSTEM) Güvenli Erişim</span>
            </div>
            <h2 className="font-display font-extrabold text-xl text-on-surface leading-tight">
              İSTEM Portalı&apos;na Bağlanın
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Kayıtlı olduğunuz kreş, okul, veli bilgilendirme sistemi veya özel öğretmen paneline anında geçiş yapın.
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

        {/* Segmented Tab Switcher */}
        <div className="px-6 pt-3">
          <div className="p-1 rounded-2xl bg-surface-container-low flex gap-1 border border-outline-variant/20">
            <button
              type="button"
              onClick={() => { setActiveTab('kurum'); setErrorMsg(null); }}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-display font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'kurum'
                  ? 'bg-primary-container text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Okul / Kreş Girişi</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('bireysel'); setErrorMsg(null); }}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-display font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'bireysel'
                  ? 'bg-secondary text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Bireysel / Eğitmen</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('talep'); setErrorMsg(null); }}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-display font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'talep'
                  ? 'bg-tertiary text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hızlı Ön Kayıt</span>
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

          {/* TAB 1: KURUM KODU İLE OKUL / KREŞ / VELİ GİRİŞİ */}
          {activeTab === 'kurum' && (
            <form onSubmit={handleInstitutionSubmit} className="space-y-3.5">
              {/* Kurum Kodu Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface flex items-center gap-1">
                    <span>Kurum Kodu (ID)</span>
                    <Info className="w-3.5 h-3.5 text-outline" />
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('talep')}
                    className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    Kodumu Bilmiyorum
                  </button>
                </div>
                <div className="relative flex items-center">
                  <GraduationCap className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={institutionCode}
                    onChange={e => setInstitutionCode(e.target.value)}
                    placeholder="Örn: zerdalikres veya kuzeykoleji"
                    className="w-full h-11 pl-10 pr-4 bg-surface-container-low rounded-xl text-sm font-bold text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary-container"
                  />
                </div>
                {/* Quick Demo Institution Codes */}
                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                  <span className="text-[11px] font-bold text-outline shrink-0">Hızlı Kodlar:</span>
                  {[
                    { code: 'zerdalikres', label: 'zerdalikres (Kreş)' },
                    { code: 'kuzeykoleji', label: 'kuzeykoleji (Lise)' },
                    { code: 'mavibulut', label: 'mavibulut (Anaokulu)' }
                  ].map(item => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setInstitutionCode(item.code)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer shrink-0 ${
                        institutionCode === item.code
                          ? 'bg-primary-fixed text-on-primary-fixed ring-1 ring-primary-container/40'
                          : 'bg-surface-container text-on-surface hover:bg-primary-fixed/60'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kullanıcı Adı veya Cep Telefonu */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface block">
                  Kullanıcı Adı veya Cep Telefonu
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={instUsername}
                    onChange={e => setInstUsername(e.target.value)}
                    placeholder="fatihsari veya 5XX XXX XX XX"
                    className="w-full h-11 pl-10 pr-4 bg-surface-container-low rounded-xl text-sm font-medium text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary-container"
                  />
                </div>
              </div>

              {/* Şifre */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface">Şifre</label>
                  <span className="text-[11px] text-secondary font-semibold">Demo Şifre: 141346</span>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
                  <input
                    type={showInstPwd ? 'text' : 'password'}
                    value={instPassword}
                    onChange={e => setInstPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-10 bg-surface-container-low rounded-xl text-sm font-medium text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary-container"
                  />
                  <button
                    type="button"
                    onClick={() => setShowInstPwd(!showInstPwd)}
                    className="absolute right-3 text-outline hover:text-on-surface p-1 cursor-pointer"
                  >
                    {showInstPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Giriş Türü (Veli vs Okul İdaresi) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setInstRoleType('Veli Portalı')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition cursor-pointer ${
                    instRoleType === 'Veli Portalı'
                      ? 'border-primary-container bg-primary-fixed/40 text-on-primary-fixed'
                      : 'border-outline-variant/30 bg-white text-on-surface-variant'
                  }`}
                >
                  👨‍👩‍👧 Veli / Öğrenci Ekranı
                </button>
                <button
                  type="button"
                  onClick={() => setInstRoleType('Okul Temsilcisi')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition cursor-pointer ${
                    instRoleType === 'Okul Temsilcisi'
                      ? 'border-primary-container bg-primary-fixed/40 text-on-primary-fixed'
                      : 'border-outline-variant/30 bg-white text-on-surface-variant'
                  }`}
                >
                  🏛️ Kurum İdare &amp; Muhasebe
                </button>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-on-surface">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="accent-[#FF6600] w-4 h-4 rounded"
                  />
                  <span>Beni Bu Cihazda Hatırla</span>
                </label>
                <span className="text-[11px] font-bold text-tertiary">✓ Biyometrik Hazır</span>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-primary-container hover:bg-primary text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                <span>Kurum Paneline Bağlan</span>
              </button>

              <div className="text-center text-[11px] text-outline flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-tertiary" />
                <span>256-Bit SSL Uçtan Uca Şifreli İstanbul Eğitim Merkezi Portalı</span>
              </div>
            </form>
          )}

          {/* TAB 2: BİREYSEL / EĞİTMEN / YÖNETİCİ GİRİŞİ */}
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

          {/* TAB 3: HIZLI ÖN KAYIT & RANDEVU / DERS TALEBİ */}
          {activeTab === 'talep' && (
            <form onSubmit={handleLeadSubmit} className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-tertiary-fixed/30 text-xs text-on-tertiary-fixed-variant font-medium">
                Şifre veya üyelik gerekmeden doğrudan okuldan randevu/fiyat teklifi alabilir veya özel ders eğitmenine mesaj bırakabilirsiniz.
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface block">İlgilendiğiniz Okul, Kreş veya Eğitmen</label>
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
                <label className="text-xs font-bold text-on-surface block">Notunuz (Çocuğunuzun Yaşı / Sınıfı)</label>
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
