import React, { useState, FormEvent } from 'react';
import { X, Eye, EyeOff, User, Phone, Lock, Calendar, Briefcase, Building, Sparkles, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userName: string, role: string) => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  
  // Login State
  const [loginTel, setLoginTel] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginRole, setLoginRole] = useState('Bireysel');

  // Forgot Password State
  const [forgotTel, setForgotTel] = useState('');

  // Phone input validator to only allow numbers, format to 5XX XXX XX XX, and limit to 10 digits
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

  // Register State
  const [regName, setRegName] = useState('');
  const [regTel, setRegTel] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regBirthYear, setRegBirthYear] = useState('');
  const [regProfession, setRegProfession] = useState('');
  const [regWorkplace, setRegWorkplace] = useState('');
  const [regRole, setRegRole] = useState('Bireysel');
  const [regCorpName, setRegCorpName] = useState('');
  
  // Custom toast notification style
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginTel || !loginPassword) {
      setErrorMsg('Lütfen telefon numaranızı ve şifrenizi giriniz.');
      return;
    }
    
    if (loginTel.replace(/\D/g, '').length !== 10) {
      setErrorMsg('Lütfen 10 haneli geçerli bir telefon numarası giriniz (5XX XXX XX XX).');
      return;
    }
    
    setErrorMsg(null);
    setMessage(`🔓 Başarıyla ${loginRole} olarak giriş yapıldı! Hoş geldiniz.`);
    setTimeout(() => {
      onLoginSuccess(loginTel, loginRole);
      onClose();
      setMessage(null);
    }, 1500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regTel || !regPassword || !regPasswordConfirm || !regBirthYear || !regProfession) {
      setErrorMsg('Lütfen zorunlu (*) alanların tamamını doldurunuz.');
      return;
    }

    if (regTel.replace(/\D/g, '').length !== 10) {
      setErrorMsg('Lütfen 10 haneli geçerli bir telefon numarası giriniz (5XX XXX XX XX).');
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setErrorMsg('Şifreniz ve şifre tekrarınız uyuşmuyor.');
      return;
    }

    if (regRole === 'Kurumsal' && !regCorpName) {
      setErrorMsg('Lütfen kurum adını giriniz.');
      return;
    }

    setErrorMsg(null);
    setMessage('✨ Üyeliğiniz başarıyla oluşturuldu! Giriş yapılıyor...');
    
    setTimeout(() => {
      onLoginSuccess(regName, regRole);
      onClose();
      setMessage(null);
    }, 1500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotTel) {
      setErrorMsg('Lütfen telefon numaranızı giriniz.');
      return;
    }

    if (forgotTel.replace(/\D/g, '').length !== 10) {
      setErrorMsg('Lütfen 10 haneli geçerli bir telefon numarası giriniz (5XX XXX XX XX).');
      return;
    }

    setErrorMsg(null);
    setMessage('📲 Şifre sıfırlama kodu SMS olarak telefonunuza gönderildi.');
    setTimeout(() => {
      setMode('login');
      setMessage(null);
    }, 3000);
  };

  const roles = [
    { id: 'Bireysel', label: 'Bireysel Kullanıcıyım' },
    { id: 'Kurumsal', label: 'Kurumsal Kullanıcıyım' },
    { id: 'Öğretmen', label: 'Öğretmenim' },
    { id: 'Okul Temsilcisi', label: 'Okul Temsilcisiyim' },
    { id: 'Kurs Temsilcisi', label: 'Kurs Temsilcisiyim' },
    { id: 'Yönetici', label: 'Yönetici (Sistem Yöneticisi)' }
  ];

  const registerRoles = [
    { id: 'Bireysel', label: 'Bireysel kullanıcıyım' },
    { id: 'Kurumsal', label: 'Kurumsal kullanıcıyım' },
    { id: 'Öğretmen', label: 'Öğretmenim' },
    { id: 'Okul Temsilcisi', label: 'Okul Temsilcisiyim' },
    { id: 'Kurs Temsilcisi', label: 'Kurs Temsilcisiyim' },
    { id: 'Yönetici', label: 'Yönetici (Sistem Yöneticisi)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs select-none">
      <div className="bg-[#FAF9F5] border border-zinc-200 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh] animate-fade-in">
        
        {/* Brand Header */}
        <div className="bg-zinc-950 px-6 py-5 shrink-0 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF6600] text-white rounded-lg flex items-center justify-center font-black text-xs font-display">
              İST
            </div>
            <div>
              <span className="text-[14px] font-black uppercase tracking-widest font-display">
                <span className="text-[#FF6600]">İST</span>EM
              </span>
              <span className="text-[9px] text-zinc-400 font-bold block leading-none font-mono">EĞİTİM PAZARYERİ</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white rounded-full p-1.5 hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Custom Notification/Toast */}
          {message && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl p-3.5 flex items-center gap-2.5 animate-bounce">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-2xl p-3.5">
              ⚠️ {errorMsg}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-[15px] font-black font-display text-zinc-900 leading-tight">Giriş Yap (Hesabınıza güvenli bir şekilde erişin)</h3>
              </div>

              {/* Tel No */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-zinc-700 block">Telefon No</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={13}
                    placeholder="5XX XXX XX XX"
                    value={loginTel}
                    onChange={(e) => handlePhoneChange(e.target.value, setLoginTel)}
                    className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 font-mono focus:border-[#FF6600] outline-hidden shadow-2xs font-bold"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-zinc-700 block">Şifre</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="***"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-zinc-900 placeholder-zinc-100 focus:border-[#FF6600] outline-hidden shadow-2xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Şifre Göster Checkbox */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={showLoginPassword}
                    onChange={() => setShowLoginPassword(!showLoginPassword)}
                    className="rounded border-zinc-350 text-[#FF6600] focus:ring-[#FF6600] w-4 h-4 cursor-pointer" 
                  />
                  <span className="text-xs font-bold text-zinc-600">Şifre Göster</span>
                </label>
              </div>

              {/* Roles radio controls */}
              <div className="space-y-2 pt-1 border-t border-zinc-100">
                <span className="text-xs font-extrabold text-zinc-750 block">Giriş yapılacak rol:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {roles.map((r) => (
                    <label 
                      key={r.id} 
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left cursor-pointer transition select-none ${
                        loginRole === r.id 
                          ? 'border-[#FF6600] bg-amber-50/40 text-zinc-900 shadow-3xs' 
                          : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="loginRole"
                        value={r.id}
                        checked={loginRole === r.id}
                        onChange={() => setLoginRole(r.id)}
                        className="text-[#FF6600] focus:ring-[#FF6600] w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-bold">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit & Swap link */}
              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  className="w-full bg-[#FF6600] hover:bg-[#CC5200] text-white text-xs font-extrabold py-3 rounded-xl transition duration-150 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Giriş Yap</span>
                </button>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold pt-2 border-t border-zinc-200/50">
                  <button 
                    type="button" 
                    onClick={() => setMode('register')}
                    className="text-amber-700 hover:text-amber-800 underline cursor-pointer"
                  >
                    Üye değilseniz tıklayın
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setMode('forgot')}
                    className="text-zinc-500 hover:text-zinc-750 underline cursor-pointer"
                  >
                    Şifremi unuttum
                  </button>
                </div>
              </div>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-[15px] font-black font-display text-zinc-900 leading-tight">Üye Kayıt (İSTEM ekosistemine katılın)</h3>
              </div>

              {/* Required fields notice */}
              <div className="text-[10px] text-zinc-500 font-extrabold italic bg-zinc-100 p-2.5 rounded-lg border border-zinc-200">
                ⚠️ * Yıldız ile işaretliler doldurulması zorunludur.
              </div>

              {/* Adı Soyadı * */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-zinc-700 block">Adı Soyadı *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ör. Ali Ekin"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 focus:border-[#FF6600] outline-hidden shadow-2xs font-bold"
                  />
                </div>
              </div>

              {/* Telefon No * */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-zinc-700 block">Telefon No *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={13}
                    placeholder="5XX XXX XX XX"
                    value={regTel}
                    onChange={(e) => handlePhoneChange(e.target.value, setRegTel)}
                    className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 font-mono focus:border-[#FF6600] outline-hidden shadow-2xs font-bold"
                  />
                </div>
              </div>

              {/* Şifre * */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-zinc-700 block">Şifre *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="***"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-100 focus:border-[#FF6600] outline-hidden shadow-2xs font-bold"
                  />
                </div>
              </div>

              {/* Şifre Tekrar * */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-zinc-700 block">Şifre Tekrar *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="***"
                    value={regPasswordConfirm}
                    onChange={(e) => setRegPasswordConfirm(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-100 focus:border-[#FF6600] outline-hidden shadow-2xs font-bold"
                  />
                </div>
              </div>

              {/* Şifre Göster checkbox */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={showRegPassword}
                    onChange={() => setShowRegPassword(!showRegPassword)}
                    className="rounded border-zinc-350 text-[#FF6600] focus:ring-[#FF6600] w-4 h-4 cursor-pointer" 
                  />
                  <span className="text-xs font-bold text-zinc-600">Şifre Göster</span>
                </label>
              </div>

              {/* Doğum Yılı * */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-zinc-700 block">Doğum Yılı *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    required
                    min="1940"
                    max="2026"
                    placeholder="Örn. 1995"
                    value={regBirthYear}
                    onChange={(e) => setRegBirthYear(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 font-mono focus:border-[#FF6600] outline-hidden shadow-2xs font-bold"
                  />
                </div>
              </div>

              {/* Mesleğiniz * */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-zinc-700 block">Mesleğiniz *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Briefcase className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Örn. Öğrenci, Psikolog, Hemşire gibi.."
                    value={regProfession}
                    onChange={(e) => setRegProfession(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 focus:border-[#FF6600] outline-hidden shadow-2xs font-bold"
                  />
                </div>
              </div>

              {/* Çalıştığım Kurum */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-zinc-700 block">Çalıştığım Kurum</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Building className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Örn. İşletme adı, Çalışmıyorum, Öğrenciyim gibi"
                    value={regWorkplace}
                    onChange={(e) => setRegWorkplace(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 focus:border-[#FF6600] outline-hidden shadow-2xs font-bold"
                  />
                </div>
              </div>

              {/* Register Role choices */}
              <div className="space-y-2 pt-1 border-t border-zinc-100">
                <span className="text-xs font-extrabold text-zinc-750 block">Üyelik tipi:</span>
                <div className="grid grid-cols-1 gap-2">
                  {registerRoles.map((r) => (
                    <div key={r.id} className="space-y-2">
                      <label 
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left cursor-pointer transition select-none ${
                          regRole === r.id 
                            ? 'border-[#FF6600] bg-amber-50/40 text-zinc-900 shadow-3xs' 
                            : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="regRole"
                          value={r.id}
                          checked={regRole === r.id}
                          onChange={() => setRegRole(r.id)}
                          className="text-[#FF6600] focus:ring-[#FF6600] w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs font-bold">{r.label}</span>
                      </label>

                      {/* Special role output instructions */}
                      {regRole === r.id && r.id === 'Kurumsal' && (
                        <div className="pl-4 pr-1 py-1.5 space-y-1.5 animate-slide-down">
                          <label className="text-xs font-extrabold text-red-700 block">Kurum Adı Giriniz *</label>
                          <input
                            type="text"
                            required
                            placeholder="Kurumsal Şirket / Okul / Kurs Adı"
                            value={regCorpName}
                            onChange={(e) => setRegCorpName(e.target.value)}
                            className="w-full bg-white border border-red-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:border-red-500 outline-hidden font-bold"
                          />
                        </div>
                      )}

                      {regRole === r.id && r.id === 'Öğretmen' && (
                        <p className="text-[10.5px] text-zinc-500 font-extrabold italic bg-zinc-100 p-2.5 rounded-lg border border-zinc-200 pl-4 animate-slide-down">
                          💡 Giriş yaptıktan sonra profilinizi tamamlamayı unutmayın
                        </p>
                      )}

                      {regRole === r.id && r.id === 'Okul Temsilcisi' && (
                        <p className="text-[10.5px] text-zinc-500 font-extrabold italic bg-zinc-100 p-2.5 rounded-lg border border-zinc-200 pl-4 animate-slide-down">
                          💡 Giriş yaptıktan sonra profilinizi tamamlamayı unutmayın
                        </p>
                      )}

                      {regRole === r.id && r.id === 'Kurs Temsilcisi' && (
                        <p className="text-[10.5px] text-zinc-500 font-extrabold italic bg-zinc-100 p-2.5 rounded-lg border border-zinc-200 pl-4 animate-slide-down">
                          💡 Giriş yaptıktan sonra profilinizi tamamlamayı unutmayın
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit / back */}
              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  className="w-full bg-[#FF6600] hover:bg-[#CC5200] text-white text-xs font-extrabold py-3 rounded-xl transition duration-150 shadow-md cursor-pointer"
                >
                  Kaydol
                </button>

                <div className="text-center pt-2">
                  <button 
                    type="button" 
                    onClick={() => setMode('login')}
                    className="text-xs font-bold text-zinc-500 hover:text-zinc-850 underline cursor-pointer"
                  >
                    Zaten üye misiniz? Giriş Yapın
                  </button>
                </div>
              </div>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-black font-display text-zinc-900">Şifremi Unuttum</h3>
                <p className="text-xs text-zinc-500">Şifre sıfırlama talimatı almak için telefon numaranızı girin</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-zinc-700 block">Kayıtlı Telefon No</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={13}
                    placeholder="5XX XXX XX XX"
                    value={forgotTel}
                    onChange={(e) => handlePhoneChange(e.target.value, setForgotTel)}
                    className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 font-mono focus:border-[#FF6600] outline-hidden shadow-2xs font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  className="w-full bg-[#FF6600] hover:bg-[#CC5200] text-white text-xs font-extrabold py-3 rounded-xl transition shadow-md cursor-pointer"
                >
                  Sıfırlama Kodu Gönder
                </button>

                <div className="text-center pt-2">
                  <button 
                    type="button" 
                    onClick={() => setMode('login')}
                    className="text-xs font-bold text-zinc-500 hover:text-zinc-850 underline cursor-pointer"
                  >
                    Geri Dön
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>

        {/* Modal footer back to closure */}
        <div className="bg-zinc-100 border-t border-zinc-200 px-6 py-4 flex items-center justify-end shrink-0">
          <button 
            onClick={onClose}
            className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
}
