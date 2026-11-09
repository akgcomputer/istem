import React, { useState } from 'react';
import {
  Bell, Bus, Pill, Utensils, ClipboardList, Star, Download, Heart,
  MessageCircle, Share2, Wallet, CreditCard, FileText, CheckCircle2,
  MapPin, ShieldCheck, Calendar, BookOpen, Trophy, Clock, UserCheck,
  Sparkles, ChevronRight, Phone, AlertCircle, Camera, Send, LogOut,
  Building2, Users, Receipt, Package
} from 'lucide-react';

interface ParentPortalViewProps {
  initialInstitutionCode?: string;
  initialChild?: 'zeynep' | 'mert';
  onNavigateTo: (page: string) => void;
  onLogout?: () => void;
}

export default function ParentPortalView({
  initialInstitutionCode = 'zerdalikres',
  initialChild = 'zeynep',
  onNavigateTo,
  onLogout
}: ParentPortalViewProps) {
  const [activeChild, setActiveChild] = useState<'zeynep' | 'mert'>(
    initialInstitutionCode === 'kuzeykoleji' ? 'mert' : initialChild
  );
  const [activePortalRole, setActivePortalRole] = useState<'veli' | 'kurum_yonetici'>('veli');

  // Interactive states for Kids mode (Zeynep)
  const [gateAlertOpen, setGateAlertOpen] = useState(false);
  const [gateStatusText, setGateStatusText] = useState('Kapıdayım, Hazırlayın');
  const [likedPost, setLikedPost] = useState(true);
  const [likeCount, setLikeCount] = useState(24);
  const [activeQuickModal, setActiveQuickModal] = useState<null | 'servis' | 'ilac' | 'menu' | 'odeme' | 'yorum'>(null);
  const [newMedicineNote, setNewMedicineNote] = useState('');
  const [medicines, setMedicines] = useState([
    { id: 1, time: '13:30', name: 'Antibiyotik Şurup (2.5 ml)', status: 'Verildi ✅', teacher: 'Ayşe Yılmaz' },
    { id: 2, time: '16:00', name: 'D Vitamini Damla (3 Damla)', status: 'Planlandı ⏳', teacher: 'Nöbetçi Hemşire' }
  ]);
  const [comments, setComments] = useState([
    { id: 1, author: 'Fatih Sarı (Zeynep Veli)', text: 'Ellerinize sağlık Ayşe Öğretmenim, Zeynep akşamları hep bu etkinlikleri anlatıyor ❤️', time: '14:20' },
    { id: 2, author: 'Selin Demir (Efe Veli)', text: 'Harika görünüyorlar, emeklerinize sağlık!', time: '14:35' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  const handleTriggerGateBell = () => {
    setGateAlertOpen(true);
    setGateStatusText('Sinyal İletildi 🔔');
    setTimeout(() => {
      setGateAlertOpen(false);
    }, 5000);
  };

  const handleToggleLike = () => {
    if (likedPost) {
      setLikedPost(false);
      setLikeCount(prev => prev - 1);
    } else {
      setLikedPost(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedicineNote.trim()) return;
    setMedicines(prev => [
      ...prev,
      { id: Date.now(), time: '15:00', name: newMedicineNote.trim(), status: 'Öğretmene İletildi 📩', teacher: 'Ayşe Yılmaz' }
    ]);
    setNewMedicineNote('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [
      ...prev,
      { id: Date.now(), author: 'Fatih Sarı (Veli)', text: newComment.trim(), time: 'Şimdi' }
    ]);
    setNewComment('');
  };

  return (
    <div className="bg-surface min-h-screen pb-24 text-on-surface font-sans">
      {/* Sub-header Bar for Portal Context */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/30 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center font-black font-display text-sm shadow-xs">
              İST
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-display font-extrabold text-base sm:text-lg text-on-surface leading-none">
                  İSTEM Okul &amp; Veli Portalım
                </h1>
                <ShieldCheck className="w-4 h-4 text-primary-container shrink-0" />
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                İstanbul Eğitim Merkezi • Kurum Kodu:{' '}
                <span className="font-mono font-bold text-primary">
                  {activeChild === 'zeynep' ? 'zerdalikres' : 'kuzeykoleji'}
                </span>
              </p>
            </div>
          </div>

          {/* Role & View Switcher */}
          <div className="flex items-center gap-2">
            <div className="bg-surface-container-low p-1 rounded-xl flex items-center gap-1 border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setActivePortalRole('veli')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activePortalRole === 'veli'
                    ? 'bg-primary-container text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                👨‍👩‍👧 Veli &amp; Öğrenci Görünümü
              </button>
              <button
                type="button"
                onClick={() => setActivePortalRole('kurum_yonetici')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activePortalRole === 'kurum_yonetici'
                    ? 'bg-inverse-surface text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                🏛️ Kurum &amp; Stok Pratik Yönetimi
              </button>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-2 rounded-xl bg-surface-container hover:bg-error-container hover:text-on-error-container text-on-surface-variant transition cursor-pointer"
                title="Portaldan Çık"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activePortalRole === 'kurum_yonetici' ? (
          /* ================= B2B SCHOOL OWNER / STOK PRATIK ERP DASHBOARD ================= */
          <div className="space-y-6 animate-fade-in">
            <div className="bg-inverse-surface text-inverse-on-surface rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-extrabold uppercase tracking-wider">
                  Stok Pratik Kurumsal Okul &amp; Kreş ERP Altyapısı
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                  Özel Zerdali Kreş &amp; Gündüz Bakımevi — İdare ve Muhasebe Masası
                </h2>
                <p className="text-sm text-inverse-on-surface/80 max-w-2xl">
                  İstanbul Eğitim Merkezi (İSTEM) vitrininden gelen aday veli ön kayıtlarını, sınıf içi günlük karneleri ve{' '}
                  <strong>Stok Pratik</strong> ön muhasebe, taksit sözleşmesi, e-Fatura ve kantin/kırtasiye stok süreçlerini tek ekrandan yönetin.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigateTo('school-mgmt')}
                  className="px-5 py-3 rounded-2xl bg-primary-container hover:bg-primary text-white text-xs font-extrabold transition shadow-md cursor-pointer"
                >
                  Şube &amp; Okul Bilgilerini Düzenle
                </button>
              </div>
            </div>

            {/* 4 KPI Cards for School Owner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                  <span>AKTİF ÖĞRENCİ / KAPASİTE</span>
                  <Users className="w-4 h-4 text-primary-container" />
                </div>
                <p className="text-2xl font-extrabold font-display text-on-surface mt-2">146 / 150</p>
                <span className="text-[11px] font-bold text-tertiary mt-1 block">%97.3 Doluluk • Son 4 Kontenjan</span>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                  <span>STOK PRATİK AYLIK TAHSİLAT</span>
                  <Wallet className="w-4 h-4 text-tertiary" />
                </div>
                <p className="text-2xl font-extrabold font-display text-on-surface mt-2">₺2.680.000</p>
                <span className="text-[11px] font-bold text-tertiary mt-1 block">%98.4 Tahsilat Oranı • 142 e-Fatura Kesildi</span>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                  <span>İSTEM VİTRİN ÖN KAYIT (CRM)</span>
                  <Building2 className="w-4 h-4 text-secondary" />
                </div>
                <p className="text-2xl font-extrabold font-display text-on-surface mt-2">24 Aday Veli</p>
                <span className="text-[11px] font-bold text-secondary mt-1 block">Bu hafta 6 kesin kayda dönüştü</span>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                  <span>KANTİN &amp; KIRTASİYE DEPO STOK</span>
                  <Package className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-2xl font-extrabold font-display text-on-surface mt-2">384 Kalem</p>
                <span className="text-[11px] font-bold text-amber-700 mt-1 block">Stok Pratik Depo Entegrasyonu Aktif</span>
              </div>
            </div>

            {/* Stok Pratik Accounting & Teacher Approval Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-tertiary">
                      STOK PRATİK FİNANS &amp; ÖN MUHASEBE MOTORU
                    </span>
                    <h3 className="text-lg font-extrabold font-display text-on-surface">
                      Veli Taksit Sözleşmeleri ve Otomatik e-Fatura Akışı
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold">
                    GİB e-Dönüşüm Aktif
                  </span>
                </div>

                <div className="divide-y divide-outline-variant/20 text-sm">
                  {[
                    { veli: 'Fatih Sarı (Zeynep Sarı - Papatyalar)', tutar: '₺18.500', durum: isPaid ? 'Ödendi (e-Fatura Kesildi)' : '5 Kasım Vade Bekliyor', color: isPaid ? 'text-tertiary bg-tertiary-fixed/40' : 'text-amber-800 bg-amber-100' },
                    { veli: 'Selin Demir (Efe Demir - Papatyalar)', tutar: '₺24.000', durum: 'Ödendi (e-Fatura #GIB20250941)', color: 'text-tertiary bg-tertiary-fixed/40' },
                    { veli: 'Kerem Yılmaz (Ada Yılmaz - Yıldızlar)', tutar: '₺21.500', durum: 'Ödendi (e-Fatura #GIB20250940)', color: 'text-tertiary bg-tertiary-fixed/40' },
                    { veli: 'Burcu Kaya (Mert Kaya - Kuzey Kampüs)', tutar: '₺29.000', durum: 'WhatsApp Ödeme Linki İletildi', color: 'text-secondary bg-secondary-fixed/50' }
                  ].map((row, idx) => (
                    <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-on-surface">{row.veli}</p>
                        <p className="text-xs text-on-surface-variant">Kasım Taksiti • Eğitim + Yemek + Servis</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold font-display text-base">{row.tutar}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${row.color}`}>
                          {row.durum}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs space-y-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                  İSTEM VİTRİN → KESİN KAYIT KÖPRÜSÜ
                </span>
                <h3 className="text-lg font-extrabold font-display text-on-surface">
                  Son Gelen Ön Kayıt &amp; Tanıtım Turu Talepleri
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Gökhan & Elif Arslan', child: '3.5 Yaş (Tam Gün Ekoloji)', phone: '0532 411 ** **', status: 'Tanıtım Turu: Yarın 11:00' },
                    { name: 'Zeynep Aksoy', child: '5 Yaş (Çift Dilli Anaokulu)', phone: '0544 892 ** **', status: 'Fiyat Teklifi İletildi' },
                    { name: 'Murat Çelik', child: '4 Yaş (Montessori Sınıfı)', phone: '0533 210 ** **', status: 'Stok Pratik Sözleşmesi Hazır' }
                  ].map((lead, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-sm text-on-surface">{lead.name}</p>
                        <p className="text-xs text-on-surface-variant">{lead.child} • {lead.phone}</p>
                        <span className="text-[11px] font-bold text-primary mt-1 inline-block">{lead.status}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert(`${lead.name} için Stok Pratik öğrenci cari kartı ve taksit sözleşmesi oluşturuluyor...`)}
                        className="px-3 py-2 rounded-xl bg-primary-container text-white text-xs font-bold hover:bg-primary transition shrink-0 cursor-pointer"
                      >
                        Kesin Kayda Al
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= PARENT & STUDENT PORTAL (MOBILE + WEB RESPONSIVE) ================= */
          <div className="space-y-6">
            {/* Sibling Switcher Bar (Beşikten Kariyere Tek Hesap) */}
            <div className="bg-surface-container-low p-1.5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-xs border border-outline-variant/30 max-w-2xl">
              <button
                type="button"
                onClick={() => setActiveChild('zeynep')}
                className={`flex-1 flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all text-left cursor-pointer ${
                  activeChild === 'zeynep'
                    ? 'bg-surface-container-lowest shadow-sm ring-1 ring-primary-container/30'
                    : 'hover:bg-surface-container/60 text-on-surface-variant'
                }`}
              >
                <span className="text-2xl">👶</span>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-sm text-on-surface truncate">Zeynep Sarı</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                      İSTEM Kids
                    </span>
                  </div>
                  <span className="text-xs text-primary font-semibold truncate">
                    Zerdali Kreş &amp; Gündüz Bakımevi • 4 Yaş (Papatyalar)
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveChild('mert')}
                className={`flex-1 flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all text-left cursor-pointer ${
                  activeChild === 'mert'
                    ? 'bg-surface-container-lowest shadow-sm ring-1 ring-secondary/30'
                    : 'hover:bg-surface-container/60 text-on-surface-variant'
                }`}
              >
                <span className="text-2xl">👦</span>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-sm text-on-surface truncate">Mert Sarı</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold">
                      İSTEM Kampüs
                    </span>
                  </div>
                  <span className="text-xs text-secondary font-semibold truncate">
                    Kuzey Bilim &amp; Fen Lisesi • 11-B Sayısal
                  </span>
                </div>
              </button>
            </div>

            {activeChild === 'zeynep' ? (
              /* ================= ZEYNEP (İSTEM KIDS - KREŞ & ANAOKULU MODU) ================= */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (7 cols on desktop): Child Status, Quick Actions, Daily Report Card */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Active Child Status Banner */}
                  <div className="bg-gradient-to-r from-tertiary-fixed/40 via-primary-fixed/30 to-surface-container-lowest rounded-3xl p-5 shadow-xs border border-outline-variant/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-tertiary text-white flex items-center justify-center font-display font-extrabold text-lg shadow-sm">
                          ZS
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-display font-extrabold text-lg text-on-surface truncate">Zeynep Sarı</h2>
                          <span className="px-2.5 py-0.5 rounded-full bg-tertiary/15 text-tertiary text-xs font-bold">
                            Papatyalar Sınıfı
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-on-surface-variant truncate">
                          Özel Zerdali Kreş &amp; Gündüz Bakımevi • Öğretmen: Ayşe Yılmaz
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-tertiary text-xs font-extrabold shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Sınıfta
                      </span>
                      <p className="text-[11px] text-on-surface-variant font-medium mt-1">Yoklama Girişi: 08:42</p>
                    </div>
                  </div>

                  {/* 4 Quick Actions Grid (Kurum Zili, Servis, İlaç, Menü) */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display font-extrabold text-base text-on-surface">
                        Hızlı Veli İşlemleri (İSTEM Kids)
                      </h3>
                      <span className="text-xs font-bold text-primary-container">Canlı Senkronize</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* 1. Kurum Zili */}
                      <button
                        type="button"
                        onClick={handleTriggerGateBell}
                        className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs hover:shadow-md border border-outline-variant/30 transition-all active:scale-98 text-left flex flex-col justify-between relative overflow-hidden group cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full mb-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary-container">
                            <Bell className="w-5 h-5" />
                          </div>
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-container" />
                          </span>
                        </div>
                        <div>
                          <span className="font-display font-bold text-sm text-on-surface block">Kurum Zili</span>
                          <span className="text-xs text-primary-container font-bold mt-0.5 block">
                            {gateStatusText}
                          </span>
                        </div>
                      </button>

                      {/* 2. Servis Nerede? */}
                      <button
                        type="button"
                        onClick={() => setActiveQuickModal('servis')}
                        className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs hover:shadow-md border border-outline-variant/30 transition-all active:scale-98 text-left flex flex-col justify-between cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full mb-3">
                          <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                            <Bus className="w-5 h-5" />
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold">
                            Servis 04
                          </span>
                        </div>
                        <div>
                          <span className="font-display font-bold text-sm text-on-surface block">Servis Nerede?</span>
                          <span className="text-xs text-tertiary font-bold mt-0.5 block">8 dk sonra evde</span>
                        </div>
                      </button>

                      {/* 3. İlaç & Sağlık */}
                      <button
                        type="button"
                        onClick={() => setActiveQuickModal('ilac')}
                        className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs hover:shadow-md border border-outline-variant/30 transition-all active:scale-98 text-left flex flex-col justify-between cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full mb-3">
                          <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
                            <Pill className="w-5 h-5" />
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                            Verildi ✅
                          </span>
                        </div>
                        <div>
                          <span className="font-display font-bold text-sm text-on-surface block">İlaç &amp; Sağlık</span>
                          <span className="text-xs text-on-surface-variant font-medium mt-0.5 block truncate">
                            13:30 Antibiyotik
                          </span>
                        </div>
                      </button>

                      {/* 4. Günün Menüsü */}
                      <button
                        type="button"
                        onClick={() => setActiveQuickModal('menu')}
                        className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs hover:shadow-md border border-outline-variant/30 transition-all active:scale-98 text-left flex flex-col justify-between cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full mb-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                            <Utensils className="w-5 h-5" />
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold">
                            Organik
                          </span>
                        </div>
                        <div>
                          <span className="font-display font-bold text-sm text-on-surface block">Günün Menüsü</span>
                          <span className="text-xs text-on-surface-variant font-medium mt-0.5 block truncate">
                            Sebzeli Köfte, Pilav
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Günlük Karne (Daily Report Card) */}
                  <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xs border border-outline-variant/30 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary-container">
                          <ClipboardList className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-extrabold text-lg text-on-surface">Günlük Kreş Karnesi</h3>
                          <p className="text-xs text-on-surface-variant">Papatyalar Sınıfı • Bugün</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-primary-container/10 text-primary-container text-xs font-extrabold">
                        Canlı Rapor
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-surface-container-low rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-on-surface-variant">🥣 Sabah Kahvaltısı</span>
                          <span className="text-emerald-600">%100</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                          <div className="bg-emerald-500 h-2 rounded-full w-full" />
                        </div>
                        <p className="text-xs font-semibold text-on-surface">Tamamını iştahla bitirdi 😊</p>
                      </div>

                      <div className="bg-surface-container-low rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-on-surface-variant">🍲 Öğle Yemeği</span>
                          <span className="text-amber-600">%75</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                          <div className="bg-amber-500 h-2 rounded-full w-3/4" />
                        </div>
                        <p className="text-xs font-semibold text-on-surface">Sebzeli köfte ve yoğurdunu yedi</p>
                      </div>

                      <div className="bg-surface-container-low rounded-2xl p-4 space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-on-surface-variant">😴 Öğle Uykusu</span>
                          <span className="text-secondary">120 Dakika</span>
                        </div>
                        <p className="text-sm font-bold text-on-surface">13:00 - 15:00</p>
                        <p className="text-xs text-emerald-700 font-medium">Deliksiz ve huzurlu uyudu</p>
                      </div>

                      <div className="bg-surface-container-low rounded-2xl p-4 space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-on-surface-variant">🎨 Günün Atölyesi</span>
                          <span className="text-primary-container">Çok Aktif</span>
                        </div>
                        <p className="text-sm font-bold text-on-surface">Suluboya &amp; Ritim Atölyesi</p>
                        <p className="text-xs text-on-surface-variant">İnce motor ve müzik gelişimi</p>
                      </div>
                    </div>

                    {/* Davranış Yıldızları */}
                    <div className="p-4 bg-surface-container-low/80 rounded-2xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-on-surface">⭐ Davranış &amp; Sosyal Uyum Yıldızları</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-on-surface-variant italic">
                        &ldquo;Arkadaşlarıyla oyuncaklarını cömertçe paylaştı ve grup etkinliğinde sıra beklemeyi çok güzel uyguladı.&rdquo;
                      </p>
                    </div>

                    {/* Öğretmen Gün Sonu Notu */}
                    <div className="p-4 bg-gradient-to-r from-primary-fixed/30 to-surface-container rounded-2xl flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs shrink-0">
                        AY
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-sm text-on-surface">Ayşe Yılmaz (Sınıf Öğretmeni)</span>
                          <span className="text-[11px] text-on-surface-variant font-medium">15:40</span>
                        </div>
                        <p className="text-xs sm:text-sm text-on-surface mt-1 leading-relaxed">
                          &ldquo;Zeynep bugün drama saatinde çok neşeliydi, masal kahramanını başarıyla canlandırdı. İkindi kahvaltısında meyvesini de bitirdi.&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (5 cols on desktop): Social Wall & Tuition Payment */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Papatyalar Sınıfı Sosyal Akışı */}
                  <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">📸</span>
                        <div>
                          <h3 className="font-display font-extrabold text-base text-on-surface">Papatyalar Sınıfı Akışı</h3>
                          <p className="text-xs text-on-surface-variant">Yönetici Onaylı Güvenli Okul Sosyal Ağı</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert('Zeynep Sarı\'nın yer aldığı 4 yüksek çözünürlüklü etkinlik fotoğrafı cihazınıza indiriliyor...')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Tümünü İndir
                      </button>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden bg-surface-container-high">
                      <img
                        src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80"
                        alt="Papatyalar Sınıfı Etkinlik"
                        className="w-full h-60 object-cover"
                      />
                      <span className="absolute bottom-3 right-3 bg-inverse-surface/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">
                        1 / 4 Fotoğraf
                      </span>
                    </div>

                    <p className="text-sm text-on-surface leading-relaxed">
                      Bugün renkleri karıştırarak yeni tonlar keşfettik! 🌈 Küçük sanatçılarımız dev gökkuşağı tablosunda harikalar yarattı.
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={handleToggleLike}
                          className="flex items-center gap-1.5 text-xs font-bold text-on-surface hover:text-primary-container transition cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${likedPost ? 'fill-primary-container text-primary-container' : 'text-on-surface-variant'}`} />
                          <span>{likeCount} Beğeni</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveQuickModal('yorum')}
                          className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface transition cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{comments.length} Veli Yorumu</span>
                        </button>
                      </div>
                    </div>

                    {/* Recent comments preview */}
                    <div className="space-y-2 bg-surface-container-low p-3.5 rounded-2xl text-xs">
                      {comments.slice(-2).map(c => (
                        <div key={c.id}>
                          <span className="font-bold text-on-surface">{c.author}: </span>
                          <span className="text-on-surface-variant">{c.text}</span>
                        </div>
                      ))}
                      <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                          placeholder="Öğretmene teşekkür veya yorum yazın..."
                          className="flex-1 bg-white rounded-xl px-3 py-2 text-xs border border-outline-variant/30 focus:outline-none focus:border-primary-container"
                        />
                        <button
                          type="submit"
                          className="px-3 py-2 rounded-xl bg-primary-container text-white font-bold text-xs cursor-pointer"
                        >
                          Gönder
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Aidat & Ödeme Özeti (Parent-facing clean view) */}
                  <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                          <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-extrabold text-base text-on-surface">Eğitim Aidatı &amp; Ödeme</h3>
                          <p className="text-xs text-on-surface-variant">Kasım Dönemi Taksiti</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {isPaid ? '✓ Ödendi' : '⏳ Ödeme Bekliyor'}
                      </span>
                    </div>

                    <div className="p-4 bg-surface-container-low rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-xs text-on-surface-variant block">Tam Gün Kreş + Organik Menü + Servis</span>
                        <span className="font-display font-extrabold text-2xl text-on-surface mt-0.5 block">₺18.500</span>
                        <span className="text-[11px] font-bold text-primary block mt-0.5">
                          {isPaid ? 'Tahsilat Makbuzu ve e-Fatura Hazır' : 'Son Ödeme Tarihi: 5 Kasım'}
                        </span>
                      </div>
                      <CreditCard className="w-8 h-8 text-primary-container opacity-80" />
                    </div>

                    <div className="flex flex-col gap-2">
                      {!isPaid && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsPaid(true);
                            alert('₺18.500 Kasım ayı kreş taksitiniz 3D Secure güvencesiyle ödendi ve e-Faturanız oluşturuldu!');
                          }}
                          className="w-full py-3.5 rounded-2xl bg-primary-container hover:bg-primary text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>💳 Tek Tıkla Güvenli Öde</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => alert('Resmi e-Arşiv / e-Fatura PDF belgeniz indiriliyor...')}
                        className="w-full py-3 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-display font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Resmi e-Fatura İndir (PDF)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ================= MERT (İSTEM KAMPÜS - LİSE & YKS/LGS MODU) ================= */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-gradient-to-r from-secondary-fixed/50 via-surface-container-low to-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-secondary text-white flex items-center justify-center font-display font-extrabold text-lg">
                        MS
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-display font-extrabold text-xl text-on-surface">Mert Sarı</h2>
                          <span className="px-2.5 py-0.5 rounded-full bg-secondary text-white text-xs font-bold">
                            11-B Fen &amp; Sayısal
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                          Kuzey Bilim &amp; Fen Lisesi • Akademik Danışman: Doç. Dr. Emre Yılmaz
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                        1. Ders Yoklaması: Kampüste (08:30)
                      </span>
                      <p className="text-xs text-on-surface-variant mt-1">YKS Hedef Sıralama: İlk 2.500</p>
                    </div>
                  </div>

                  {/* Academic Metrics & Exam Results */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/30 shadow-2xs">
                      <span className="text-xs font-bold text-secondary uppercase">TÜRKİYE GENELİ TYT DENEME</span>
                      <p className="text-3xl font-extrabold font-display text-on-surface mt-2">104.5 Net</p>
                      <span className="text-xs text-tertiary font-bold mt-1 block">↑ Geçen aya göre +8.25 Net artış</span>
                    </div>
                    <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/30 shadow-2xs">
                      <span className="text-xs font-bold text-primary uppercase">HAFTALIK ÖDEV &amp; SORU KAMPI</span>
                      <p className="text-3xl font-extrabold font-display text-on-surface mt-2">%92 Tamam</p>
                      <span className="text-xs text-on-surface-variant font-medium mt-1 block">1.420 / 1.500 Haftalık Soru Hedefi</span>
                    </div>
                    <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/30 shadow-2xs">
                      <span className="text-xs font-bold text-tertiary uppercase">BİREBİR ETÜT &amp; MENTORLUK</span>
                      <p className="text-3xl font-extrabold font-display text-on-surface mt-2">Perşembe</p>
                      <span className="text-xs text-on-surface-variant font-medium mt-1 block">16:30 AYT Türev &amp; İntegral Etüdü</span>
                    </div>
                  </div>

                  {/* Homework & Weak Topic Analysis */}
                  <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-extrabold text-lg text-on-surface">
                        Konu Bazlı Deneme Analizi &amp; Ödev Takibi
                      </h3>
                      <button
                        type="button"
                        onClick={() => onNavigateTo('teachers-catalog')}
                        className="px-4 py-2 rounded-full bg-primary-container text-white text-xs font-bold hover:bg-primary transition cursor-pointer"
                      >
                        Eksik Konu İçin %0 Komisyonlu Özel Ders Al →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {[
                        { subject: 'AYT Matematik — Trigonometri & Limit', score: '%94 Başarı', status: 'Tamamlandı', badge: 'bg-emerald-100 text-emerald-800' },
                        { subject: 'AYT Fizik — Elektrik ve Manyetizma', score: '%62 Başarı (Ek Etüt Önerildi)', status: '25 Soru Ödevi Bekliyor', badge: 'bg-amber-100 text-amber-800' },
                        { subject: 'TYT Türkçe — Paragraf Hız Kampı', score: '%96 Başarı', status: 'Tamamlandı', badge: 'bg-emerald-100 text-emerald-800' }
                      ].map((item, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <p className="font-bold text-sm text-on-surface">{item.subject}</p>
                            <p className="text-xs text-on-surface-variant">{item.score}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${item.badge}`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column for High School Student */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-inverse-surface text-white rounded-3xl p-6 space-y-4 shadow-md">
                    <span className="px-3 py-1 rounded-full bg-primary-container text-white text-[11px] font-bold uppercase">
                      İSTEM CHALLENGE ARENA
                    </span>
                    <h3 className="font-display font-extrabold text-lg">
                      Türkiye Geneli Python &amp; Algoritma Ligi
                    </h3>
                    <p className="text-xs text-inverse-on-surface/80 leading-relaxed">
                      Mert Sarı bu hafta okul takımıyla katıldığı algoritma maratonunda 420 öğrenci arasında 14. sırada!
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigateTo('challenges')}
                      className="w-full py-3 rounded-2xl bg-primary-container hover:bg-primary text-white text-xs font-bold transition cursor-pointer"
                    >
                      Challenge Arena&apos;ya Git
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Kurum Zili Toast Notification */}
      {gateAlertOpen && (
        <div className="fixed inset-x-4 bottom-24 sm:bottom-8 sm:right-8 sm:left-auto sm:max-w-md bg-inverse-surface text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 z-50 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display font-bold text-sm">Kurum Kapısı &amp; Sınıf Öğretmeni Uyarıldı!</p>
              <p className="text-xs text-inverse-on-surface/80">
                Papatyalar Sınıfı öğretmeni Ayşe Yılmaz Zeynep&apos;i çıkış için hazırlıyor.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setGateAlertOpen(false)}
            className="px-3 py-1.5 bg-white/15 rounded-xl text-xs font-bold cursor-pointer"
          >
            Tamam
          </button>
        </div>
      )}

      {/* Quick Action Modals (Servis, İlaç, Menü) */}
      {activeQuickModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="font-display font-extrabold text-base text-on-surface">
                {activeQuickModal === 'servis' && '🚌 Canlı Okul Servisi Takibi (Servis 04)'}
                {activeQuickModal === 'ilac' && '💊 İlaç & Sağlık Takip Çizelgesi'}
                {activeQuickModal === 'menu' && '🍽️ Diyetisyen Onaylı Günlük Beslenme Menüsü'}
                {activeQuickModal === 'yorum' && '💬 Papatyalar Sınıfı Veli Yorumları'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveQuickModal(null)}
                className="px-2.5 py-1 rounded-lg bg-surface-container text-xs font-bold cursor-pointer"
              >
                Kapat
              </button>
            </div>

            {activeQuickModal === 'servis' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-secondary-fixed/40 text-on-surface space-y-1">
                  <p className="font-bold text-sm text-secondary">Plaka: 34 IST 404 • Şoför: Hasan Kılıç</p>
                  <p>Hostes: Sevgi Demir (0532 811 ** **)</p>
                  <p className="font-bold text-tertiary pt-1">📍 Konum: Bağdat Caddesi Çatalçeşme — Tahmini Varış: 8 Dakika</p>
                </div>
              </div>
            )}

            {activeQuickModal === 'ilac' && (
              <div className="space-y-3 text-xs">
                {medicines.map(m => (
                  <div key={m.id} className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                    <div>
                      <p className="font-bold text-on-surface">{m.time} — {m.name}</p>
                      <p className="text-on-surface-variant">Sorumlu: {m.teacher}</p>
                    </div>
                    <span className="font-bold text-tertiary">{m.status}</span>
                  </div>
                ))}
                <form onSubmit={handleAddMedicine} className="pt-2 space-y-2 border-t border-outline-variant/20">
                  <label className="font-bold block text-on-surface">Yeni İlaç / Sağlık Notu Ekle:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMedicineNote}
                      onChange={e => setNewMedicineNote(e.target.value)}
                      placeholder="Örn: 14:00 Burun Spreyi (1 fıs)"
                      className="flex-1 px-3 py-2 rounded-xl border border-outline-variant/40"
                    />
                    <button type="submit" className="px-4 py-2 rounded-xl bg-primary-container text-white font-bold cursor-pointer">
                      Ekle
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeQuickModal === 'menu' && (
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-surface-container-low">
                  <span className="font-bold text-primary block">09:00 Sabah Kahvaltısı</span>
                  <span>Organik Yumurta, Ezine Peyniri, Ev Yapımı Zeytin Ezmesi, Pekmez, Tam Buğday Ekmeği</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low">
                  <span className="font-bold text-tertiary block">12:15 Öğle Yemeği</span>
                  <span>Kemik Sulu Sebze Çorbası, Fırında Sebzeli Köfte, Siyez Bulgur Pilavı, Ev Yoğurdu</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low">
                  <span className="font-bold text-secondary block">15:30 İkindi Kahvaltısı</span>
                  <span>Keçiboynuzlu Ev Kek, Mevsim Meyve Tabağı ve Ihlamur</span>
                </div>
              </div>
            )}

            {activeQuickModal === 'yorum' && (
              <div className="space-y-2.5 text-xs">
                {comments.map(c => (
                  <div key={c.id} className="p-3 rounded-xl bg-surface-container-low">
                    <span className="font-bold text-on-surface block">{c.author} ({c.time})</span>
                    <span className="text-on-surface-variant">{c.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
