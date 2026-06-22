import { useState, FormEvent } from 'react';
import { 
  DollarSign, Users, Award, TrendingUp, Plus, Trash2, HelpCircle, 
  Send, Sparkles, Settings, ClipboardCheck, PlayCircle, LogOut, BookOpen, 
  Gem, Check, AlertCircle, ChevronDown, ChevronUp, UserCheck
} from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { Course } from '../types';

interface InstructorDashboardProps {
  courses: Course[];
  onLogout?: () => void;
}

interface CustomAddedCourse {
  id: string;
  title: string;
  description: string;
  whyTake: string;
  careerAreas: string;
  requirements: string;
  price: string;
  sessionType: string;
  participantsCount: number;
  totalEarnings: string;
}

export default function InstructorDashboard({ courses, onLogout }: InstructorDashboardProps) {
  // Financial withdraw states simulating true SaaS outcomes
  const [balance, setBalance] = useState(84300);
  const [withdrawnStatus, setWithdrawnStatus] = useState<'idle' | 'processing' | 'done'>('idle');

  // Multi-step custom course creator toggle
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [newCourseInput, setNewCourseInput] = useState({
    title: '',
    description: '',
    whyTake: '',
    careerAreas: '',
    requirements: '',
    price: '₺825',
    sessionType: '8 Canlı & Özel Birebir'
  });

  // Track expanded course student lists
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Instructor courses list with stats
  const [myCourses, setMyCourses] = useState<CustomAddedCourse[]>([
    {
      id: 'inst-c-1',
      title: 'Autocad İle Tasarım',
      description: 'Mühendislik ve iç mimari standartlarında 2D/3D kapsamlı Autocad eğitimi.',
      whyTake: 'Sektörün en köklü ve geçerli tasarım standartlarına sıfırdan hakim olacaksınız.',
      careerAreas: 'Makine Mühendisliği Çalışmaları, Mimarlık Ofisleri, Tasarı Ofis Yönetimi',
      requirements: 'Temel bilgisayar bilgisi yeterlidir.',
      price: '₺825',
      sessionType: '8 Canlı & Özel Birebir',
      participantsCount: 41,
      totalEarnings: '450.000₺'
    },
    {
      id: 'inst-c-2',
      title: 'Python ile Sıfırdan İleri Seviye Programlama',
      description: 'Veri analizi, yapay zeka algoritma temelleri ve mikroservis otomasyonları.',
      whyTake: 'Python kullanarak geleceğin yapay zeka entegrasyonlarını kendi başınıza kodlayabileceksiniz.',
      careerAreas: 'Veri Bilimci, Yapay Zeka Geliştiricisi, Yazılım Geliştirici, Test Otomasyonu',
      requirements: 'Herhangi bir kodlama geçmişi aranmamaktadır.',
      price: '₺950',
      sessionType: '8 Canlı & Özel Birebir',
      participantsCount: 21,
      totalEarnings: '650.000₺'
    }
  ]);

  // Interactive curriculum builder state ("FARK" implementation!)
  const [curriculum, setCurriculum] = useState<string[]>([
    'Bölüm 1: Kurs Oryantasyonu ve Beklentiler',
    'Bölüm 2: Proje Şemasının Çıkarılması',
    'Bölüm 3: API Entegrasyon Testleri ve Hata İnceleme',
  ]);
  const [newLectureText, setNewLectureText] = useState('');

  // Sample students data listing who completed/registered the course
  const SAMPLE_STUDENTS = [
    { name: 'Ahmet Yılmaz', email: 'ahmet.y@gmail.com', progress: '%100', year: '2026', testScore: '98/100' },
    { name: 'Ayşe Kaya', email: 'ayse.k@outlook.com', progress: '%100', year: '2026', testScore: '95/100' },
    { name: 'Mehmet Demir', email: 'mehmet.d@trendyol.com', progress: '%92', year: '2026', testScore: '92/100' },
    { name: 'Zeynep Arslan', email: 'zeynep.a@gmail.com', progress: '%100', year: '2026', testScore: '99/100' },
    { name: 'Caner Şahin', email: 'caner.s@getir.com', progress: '%85', year: '2026', testScore: '88/100' },
    { name: 'Melisa Öztürk', email: 'melisa.o@hotmail.com', progress: '%100', year: '2026', testScore: '94/100' },
    { name: 'Burak Solak', email: 'burak.s@softtech.com.tr', progress: '%100', year: '2026', testScore: '96/100' },
    { name: 'Gizem Yalçın', email: 'gizem.y@yarp.com', progress: '%70', year: '2026', testScore: 'Devam' },
    { name: 'Ozan Doğan', email: 'ozan.d@gmail.com', progress: '%100', year: '2026', testScore: '90/100' },
    { name: 'Selin Güler', email: 'selin.g@gmail.com', progress: '%100', year: '2026', testScore: '97/100' },
  ];

  // Sektörel Analytics data representing "where students Pause or Struggle" inside the course videos ("Fark" implementation!)
  const ANALYTICS_DATA = [
    { name: 'Giriş', tamamlayan: 95, duraksayan_zorlanan: 5 },
    { name: 'Modül 1 (React)', tamamlayan: 86, duraksayan_zorlanan: 14 },
    { name: 'Modül 2 (SQL)', tamamlayan: 72, duraksayan_zorlanan: 28 }, // SQL is the peak struggle!
    { name: 'Modül 3 (Actions)', tamamlayan: 68, duraksayan_zorlanan: 32 },
    { name: 'Modül 4 (Deploy)', tamamlayan: 60, duraksayan_zorlanan: 40 },
  ];

  // Handle funds withdraw (simulated)
  const handleWithdraw = () => {
    setWithdrawnStatus('processing');
    setTimeout(() => {
      setWithdrawnStatus('done');
      setBalance(0);
    }, 2000);
  };

  // Add chapter to curriculum list
  const handleAddLecture = (e: FormEvent) => {
    e.preventDefault();
    if (!newLectureText.trim()) return;
    setCurriculum([...curriculum, newLectureText]);
    setNewLectureText('');
  };

  // Remove chapter from curriculum list
  const handleRemoveLecture = (idx: number) => {
    setCurriculum(curriculum.filter((_, i) => i !== idx));
  };

  // Add custom course submission
  const handleAddCourseSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newCourseInput.title || !newCourseInput.description) {
      alert('Lütfen temel alanları doldurunuz.');
      return;
    }

    const newCourseObj: CustomAddedCourse = {
      id: `inst-c-${Date.now()}`,
      title: newCourseInput.title,
      description: newCourseInput.description,
      whyTake: newCourseInput.whyTake || 'Öğrencilerimiz bu eğitimi alarak sektörel pratiklik kazanacaktır.',
      careerAreas: newCourseInput.careerAreas || 'Serbest Çalışan, Tasarım ve Kodlama Pozisyonları',
      requirements: newCourseInput.requirements || 'Herhangi bir ön bilgi gereksinimi yoktur.',
      price: newCourseInput.price,
      sessionType: newCourseInput.sessionType,
      participantsCount: 0,
      totalEarnings: '0₺'
    };

    setMyCourses([newCourseObj, ...myCourses]);
    alert(`Tebrikler! "${newCourseInput.title}" eğitiminiz başarıyla havuza eklenmiş ve onay sürecine gönderilmiştir.`);
    
    // Clear and toggle off
    setNewCourseInput({
      title: '',
      description: '',
      whyTake: '',
      careerAreas: '',
      requirements: '',
      price: '₺825',
      sessionType: '8 Canlı & Özel Birebir'
    });
    setShowAddCourseForm(false);
  };

  const toggleExpandCourse = (courseId: string) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
    } else {
      setExpandedCourseId(courseId);
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10 text-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* UPPER TITLE HEADER WITH DECENT LOGOUT */}
        <div className="mb-8 border-b border-zinc-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-[10px] tracking-widest font-black text-[#E58F49] uppercase block">EĞİTMEN PANELİ SAAS</span>
            <h1 className="text-3xl font-extrabold font-display text-zinc-950 mt-1">Eğitmen Yönetim Paneli</h1>
            <p className="text-xs text-zinc-500 mt-1">Ders açtığınız, komisyonsuz tahsil edilen bakiye durumunuzu yönettiğiniz ve müfredat programladığınız eğitmen portalı.</p>
          </div>

          <div className="flex justify-center sm:justify-end shrink-0">
            {onLogout && (
              <button 
                onClick={onLogout}
                className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-150 text-red-700 hover:text-red-900 px-5 py-2.5 rounded-2xl border border-red-200 font-extrabold text-xs transition duration-150 cursor-pointer shadow-3xs"
              >
                <LogOut className="w-4 h-4 text-red-650" />
                Oturumu Kapat
              </button>
            )}
          </div>
        </div>

        {/* FINANCIALS & TOP CARDS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Funds withdraw widget */}
          <div className="bg-[#1A1815] text-white p-6 rounded-3xl border border-zinc-800 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-widest font-black text-[#E58F49] block text-left">HAZIR BAKİYE / KAZANÇLAR</span>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-black font-mono text-white">₺{balance.toLocaleString('tr-TR')}</span>
                <span className="text-xs text-zinc-400">Net Gelir</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-2 text-left">Komisyonsuz eğitim pazarında kesinti oranı %0'dır. Havuzdaki tüm para doğrudan banka hesabınıza aktarılabilir.</p>
            </div>

            <div className="mt-5">
              {withdrawnStatus === 'idle' && (
                <button 
                  onClick={handleWithdraw}
                  className="w-full bg-[#E58F49] hover:bg-[#D4803A] text-white text-xs font-bold py-3 rounded-xl transition shadow-xs hover:scale-102 cursor-pointer"
                >
                  Kazancı Banka Hesabıma Çek (Withdraw)
                </button>
              )}
              {withdrawnStatus === 'processing' && (
                <button 
                  disabled
                  className="w-full bg-zinc-800 text-zinc-400 text-xs font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                  Banka Kontrolü Yapılıyor...
                </button>
              )}
              {withdrawnStatus === 'done' && (
                <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold p-2.5 rounded-xl text-center">
                  ✓ Para Transferi Tamamlandı! (%0 Platform Kesintisi)
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-zinc-200/60 p-6 rounded-3xl shadow-xs flex flex-col justify-between text-left">
            <div>
              <span className="text-[9px] uppercase tracking-widest font-black text-zinc-400 block">SİSTEMDEKİ AKTİF ÖĞRENCİLERİM</span>
              <span className="text-3xl font-black font-mono text-zinc-950 mt-1 block">4,180 Öğrenci</span>
              <p className="text-[10px] text-zinc-550 mt-1.5">Şu ana kadar Next.js, AI ve UI ana gruplarınızda mezuniyetini onayladığınız toplam öğrenci topluluğudur.</p>
            </div>
            <div className="mt-4 pt-3.5 border-t border-zinc-100 flex justify-between text-[11px] text-zinc-500 font-semibold font-mono">
              <span>✓ 142 Canlı Mentorluk</span>
              <span>✓ %92 Ödev Teslim</span>
            </div>
          </div>

          <div className="bg-white border border-zinc-200/60 p-6 rounded-3xl shadow-xs flex flex-col justify-between text-left">
            <div>
              <span className="text-[9px] uppercase tracking-widest font-black text-zinc-400 block">GENEL PUAN ORTALAMASI</span>
              <span className="text-3xl font-black font-mono text-[#E58F49] mt-1 block">★ 4.92 / 5.0</span>
              <p className="text-[10px] text-zinc-550 mt-1.5">Platformdaki 1.500+ doğrulanmış eğitmen arasında %3'lük en başarılı elit eğitmen dilimindesiniz.</p>
            </div>
            <div className="mt-4 pt-3.5 border-t border-zinc-100 flex justify-between text-[11px] text-zinc-500 font-semibold font-mono">
              <span>✓ Elit Eğitmen Rozeti</span>
              <span>✓ %0 Şikayet Oranı</span>
            </div>
          </div>

        </div>

        {/* 2 COLUMN CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2 COLUMNS: COURSES LIST, "+ADD COURSE" FORM */}
          <div className="lg:col-span-2 flex flex-col gap-8 text-left">
            
            {/* VERDİĞİM DERSLER & DERS EKLE BÖLÜMÜ */}
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4 mb-4">
                <div>
                  <h3 className="text-base font-black text-zinc-950 flex items-center gap-1.5">
                    <BookOpen className="w-5 h-5 text-[#E58F49]" /> Verdiğim Dersler
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Sistemde onaylı bulunan ve yayına aldığınız uzmanlık programları.</p>
                </div>
                
                <button
                  onClick={() => setShowAddCourseForm(!showAddCourseForm)}
                  className="bg-[#E58F49] hover:bg-[#D4803A] text-white text-xs font-black px-4 py-2.5 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-3xs"
                >
                  {showAddCourseForm ? 'Vazgeç' : '+ Ders Ekle'}
                </button>
              </div>

              {/* Course Creator Form if turned on */}
              {showAddCourseForm && (
                <form onSubmit={handleAddCourseSubmit} className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl space-y-4 mb-6">
                  <h4 className="text-xs font-black text-zinc-900 border-b border-zinc-200 pb-1 uppercase tracking-wider">Ders Tanımlama Formu</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Ders Adı</label>
                      <input 
                        type="text"
                        required
                        value={newCourseInput.title}
                        onChange={(e) => setNewCourseInput({...newCourseInput, title: e.target.value})}
                        placeholder="Örn: Autocad İle Tasarım"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#E58F49] focus:outline-none text-zinc-800 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Seans Tipi</label>
                      <input 
                        type="text"
                        required
                        value={newCourseInput.sessionType}
                        onChange={(e) => setNewCourseInput({...newCourseInput, sessionType: e.target.value})}
                        placeholder="Örn: 8 Canlı & Özel Birebir"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#E58F49] focus:outline-none text-zinc-800 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Eğitim İçeriği (Açıklama)</label>
                    <textarea 
                      required
                      rows={2}
                      value={newCourseInput.description}
                      onChange={(e) => setNewCourseInput({...newCourseInput, description: e.target.value})}
                      placeholder="Bu ders kapsamında bilgisayar destekli teknik tasarım modellemelerinin püf noktalarını öğreneceksiniz..."
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#E58F49] focus:outline-none text-zinc-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Neden Almalısınız?</label>
                      <textarea 
                        required
                        rows={2}
                        value={newCourseInput.whyTake}
                        onChange={(e) => setNewCourseInput({...newCourseInput, whyTake: e.target.value})}
                        placeholder="Sektördeki tüm kurumsal ofislerin aradığı 2D tasarım standartlarına doğrudan egemen olmak için."
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#E58F49] focus:outline-none text-zinc-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">İstihdam Alanları</label>
                      <textarea 
                        required
                        rows={2}
                        value={newCourseInput.careerAreas}
                        onChange={(e) => setNewCourseInput({...newCourseInput, careerAreas: e.target.value})}
                        placeholder="İç Mimari Tasarımcı, Konsept Geliştirme Uzmanı, Yapı Analiz Lideri"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#E58F49] focus:outline-none text-zinc-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Gereksinimler</label>
                      <input 
                        type="text"
                        required
                        value={newCourseInput.requirements}
                        onChange={(e) => setNewCourseInput({...newCourseInput, requirements: e.target.value})}
                        placeholder="Örn: Temel Windows veya macOS deneyimi"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#E58F49] focus:outline-none text-zinc-800 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Fiyat (₺)</label>
                      <input 
                        type="text"
                        required
                        value={newCourseInput.price}
                        onChange={(e) => setNewCourseInput({...newCourseInput, price: e.target.value})}
                        placeholder="Örn: ₺825"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#E58F49] focus:outline-none text-zinc-800 font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs py-3 rounded-xl transition cursor-pointer shadow-sm"
                  >
                    Yeni Dersi Havuza Kaydet
                  </button>
                </form>
              )}

              {/* DERS LİSTEM TABULAR DRAWERS WITH (+) EXPAND ACTION OF THE LAST 10 STUDENTS */}
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">Ders Listem ve Harici Gelirler</span>
                
                <div className="overflow-hidden border border-zinc-200 rounded-2xl bg-white">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAF9F5] border-b border-zinc-150 text-zinc-450 uppercase tracking-widest font-black text-[9px] sm:text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4 w-1/2">Ders Adı</th>
                        <th className="py-2.5 px-4 text-center">Katılımcı Sayısı</th>
                        <th className="py-2.5 px-4 text-right">Toplam Tahsil Edilen Para</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-xs text-zinc-800">
                      {myCourses.map((c) => {
                        const isExpanded = expandedCourseId === c.id;
                        return (
                          <>
                            <tr key={c.id} className="hover:bg-zinc-50 transition">
                              <td className="py-3 px-4 font-extrabold text-zinc-950">
                                {c.title}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => toggleExpandCourse(c.id)}
                                  className="inline-flex items-center gap-1 bg-amber-50 hover:bg-[#E58F49]/20 border border-amber-200 text-[#8C3F03] font-black font-mono text-[11px] px-2.5 py-1 rounded-lg transition scale-102 cursor-pointer"
                                  title="Son 10 Öğrenciyi Göster"
                                >
                                  <span>{c.participantsCount}(+)</span>
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              </td>
                              <td className="py-3 px-4 text-right font-black font-mono text-emerald-800">
                                {c.totalEarnings}
                              </td>
                            </tr>

                            {/* EXPANDED SATE SHOWING LAST 10 STUDENTS OF THIS LESSON */}
                            {isExpanded && (
                              <tr className="bg-zinc-50/70">
                                <td colSpan={3} className="p-4 border-t border-b border-zinc-200">
                                  <div className="space-y-2 border-l-2 border-[#E58F49] pl-3.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-black text-[#E58F49] uppercase tracking-wider inline-flex items-center gap-1">
                                        <UserCheck className="w-3.5 h-3.5" /> Son Katılım Sağlayan 10 Öğrenci (Güncel Sınıf)
                                      </span>
                                      <span className="text-[10px] text-zinc-400 font-semibold">Tarih Aralığı: 2026 Güz</span>
                                    </div>

                                    <div className="overflow-x-auto rounded-xl border border-zinc-150">
                                      <table className="w-full text-left text-[11px] bg-white text-zinc-650">
                                        <thead className="bg-[#FAF9F5] border-b border-zinc-150 font-bold text-zinc-500">
                                          <tr>
                                            <th className="py-1.5 px-2.5">Öğrenci Adı Soyadı</th>
                                            <th className="py-1.5 px-2.5">E-posta Adresi</th>
                                            <th className="py-1.5 px-2.5 text-center">İlerleme %</th>
                                            <th className="py-1.5 px-2.5 text-right">Sınav Notu</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100 font-medium">
                                          {SAMPLE_STUDENTS.map((st, idx) => (
                                            <tr key={idx} className="hover:bg-zinc-50">
                                              <td className="py-1.5 px-2.5 font-bold text-zinc-900">{st.name}</td>
                                              <td className="py-1.5 px-2.5 font-mono text-zinc-400">{st.email}</td>
                                              <td className="py-1.5 px-2.5 text-center text-[#E58F49] font-black font-mono">{st.progress}</td>
                                              <td className="py-1.5 px-2.5 text-right font-bold text-zinc-800">{st.testScore}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* CURRICULUM SCHEDULER WIDGET */}
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-xs">
              <div className="flex justify-between items-center border-b border-zinc-100 pb-3 mb-5">
                <h3 className="text-base font-black text-zinc-950 flex items-center gap-1.5">
                  <Plus className="w-5 h-5 text-[#E58F49]" /> İnteraktif Müfredat Oluşturucu
                </h3>
                <span className="text-[10px] bg-amber-50 text-[#8C3F03] border border-amber-200 font-bold px-2.5 py-0.5 rounded">Hızlı Planlayıcı</span>
              </div>

              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                Öğrencilerin video akışını yapıp, sonundaki testlere katılacakları ana müfredatı bu kısımdan anlık düzenleyebilir, silip yenisini ekleyebilirsiniz.
              </p>

              {/* List render with interactive removal tool */}
              <div className="flex flex-col gap-2.5 mb-5 max-h-64 overflow-y-auto no-scrollbar">
                {curriculum.map((lecture, i) => (
                  <div 
                    key={i}
                    className="bg-zinc-50 border border-zinc-200/60 p-3 rounded-xl flex justify-between items-center text-xs group"
                  >
                    <div className="flex items-center gap-2.5 text-left">
                      <span className="font-mono text-zinc-400 font-bold">1.{i+1}</span>
                      <span className="font-semibold text-zinc-800">{lecture}</span>
                    </div>
                    <button 
                      onClick={() => handleRemoveLecture(i)}
                      className="text-zinc-400 hover:text-red-600 transition p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Adding form */}
              <form onSubmit={handleAddLecture} className="flex gap-2">
                <input 
                  type="text"
                  required
                  value={newLectureText}
                  onChange={(e) => setNewLectureText(e.target.value)}
                  placeholder="Örn: Bölüm 4: Cloudflare D1 SQL Entegrasyon Testleri"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#E58F49] focus:outline-none placeholder-zinc-400 text-zinc-850 font-bold"
                />
                <button 
                  type="submit"
                  className="bg-[#E58F49] hover:bg-[#D4803A] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition duration-150 shrink-0 cursor-pointer"
                >
                  Ekle
                </button>
              </form>
            </div>

          </div>

          {/* RIGHT COLUMN: GRAPHS & REPORT PANEL */}
          <div className="lg:col-span-1 flex flex-col gap-8 text-left">
            
            {/* PERFORMANCE STUDENT ANALYSIS GRAPH */}
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[350px]">
              <div>
                <div className="flex justify-between items-center border-b border-zinc-100 pb-3 mb-4">
                  <h3 className="text-sm font-black font-display tracking-tight text-zinc-950 flex items-center gap-1.5">
                    <TrendingUp className="w-5 h-5 text-indigo-650 animate-pulse" /> Öğrenci Zorlanma Noktaları
                  </h3>
                  <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded uppercase">Isı Haritası</span>
                </div>
                
                <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                  Eğitimlerinizdeki videoların hangi bölümlerinde veya ders sorularında öğrencilerin durdurduğunu ya da yanlış cevap kilitleriyle zorlandığını gösteren sistem raporu.
                </p>
              </div>

              {/* Recharts Bar graph demonstrating students struggling areas */}
              <div className="w-full h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ANALYTICS_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
                    <XAxis dataKey="name" tick={{ fill: '#3F3F46', fontSize: 10, fontWeight: 500 }} />
                    <YAxis tick={{ fill: '#3F3F46', fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="tamamlayan" fill="#E58F49" radius={[4, 4, 0, 0]} name="Bitiren %" />
                    <Bar dataKey="duraksayan_zorlanan" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Zorlanan / Duraklayan %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <span className="text-[10px] text-zinc-400 font-medium leading-relaxed mt-2 text-center block">
                💡 SQL Modülünde yanlış cevap oranı %28'e ulaştığı için sisteme 10 saniye otomatik sarma limiti tetiklenmiştir.
              </span>
            </div>

            {/* PLATFORM ALERTS GUIDELINES */}
            <div className="bg-amber-50/50 border border-amber-150 p-4 rounded-3xl text-xs space-y-2.5">
              <span className="text-[10px] font-black uppercase text-[#E58F49] tracking-wider block">🛡️ SAAS Eğitmen Kılavuzu</span>
              <p className="text-zinc-800 font-medium leading-relaxed">
                Her verdiğiniz ders için %0 komisyon politikası bakiye cüzdanınıza yansıtılır. Para çekme (Withdraw) butonuna basarak banka havalenizi hemen tetikleyebilirsiniz.
              </p>
              <div className="pt-2 border-t border-amber-200/60 text-[10px] text-zinc-400 font-bold block">
                Müfredatta yapılan değişiklikler aktif tüm öğrencilere ve kurumsal İK partnerlerine gerçek zamanlı güncellenir.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
