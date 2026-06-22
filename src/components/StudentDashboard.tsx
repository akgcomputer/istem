import { useState, useEffect, useMemo, FormEvent } from 'react';
import { 
  Award, BookOpen, Clock, Wallet, CheckCircle2, Star, Sparkles, 
  Linkedin, QrCode, ClipboardList, Send, ShieldCheck, X, FileDown, 
  MessageSquare, Calendar, LogOut, ArrowRight, BookMarked
} from 'lucide-react';
import { Course, Certificate } from '../types';

interface StudentDashboardProps {
  courses: Course[];
  certificates: Certificate[];
  onSelectCourse: (course: Course) => void;
  onNavigateTo: (page: string) => void;
  onLogout?: () => void;
}

interface StudentProgram {
  id: string;
  title: string;
  image: string;
  teacherName: string;
  status: 'Bitti' | 'Devam';
  grade?: string;
  year: number; // Yıl bilgisi sadece yıl (2026 gibi)
}

interface FriendBulkRequest {
  courseTitle: string;
  reason: string;
  personCount: number;
  selectedDays: string[];
  selectedHour: string;
  inviteCode: string;
}

// 12 popular courses for randomizing
const POPULAR_COURSES_POOL = [
  { id: 'p-1', title: 'Next.js ile Modern Web ve Server Actions', category: 'Software', instructor: 'Selin Yılmaz', price: '₺850', rating: '4.9' },
  { id: 'p-2', title: 'Sıfırdan İleri Seviye Python ve Veri Analizi', category: 'Software', instructor: 'Ali Efe Yalçın', price: '₺750', rating: '4.8' },
  { id: 'p-3', title: 'Autocad ile Tasarım ve Proje Modelleme', category: 'Design', instructor: 'Can Demir', price: '₺825', rating: '4.7' },
  { id: 'p-4', title: '3D Modelleme ve Unreal Engine Kodlama', category: '3D/Game', instructor: 'Buse Tan', price: '₺950', rating: '4.9' },
  { id: 'p-5', title: 'Figma Autolayout ve Design System Kurulumu', category: 'Design', instructor: 'Eren Kaya', price: '₺650', rating: '4.8' },
  { id: 'p-6', title: 'TypeScript ve API Güvenlik Standartları', category: 'Software', instructor: 'Okan Şahin', price: '₺780', rating: '4.9' },
  { id: 'p-7', title: 'Docker ve Kubernetes ile Edge Deploy Teknikleri', category: 'DevOps', instructor: 'Selin Yılmaz', price: '₺920', rating: '4.7' },
  { id: 'p-8', title: 'React Native ile iOS & Android Geliştirme', category: 'Software', instructor: 'Hakan Demir', price: '₺880', rating: '4.8' },
  { id: 'p-9', title: 'SQL Veritabanı Tasarımı ve PostgreSQL Modelleme', category: 'Data', instructor: 'Zeynep Solak', price: '₺690', rating: '4.6' },
  { id: 'p-10', title: 'Yapay Zeka RAG Sistemleri ve LLM Fine-tuning', category: 'AI', instructor: 'Can Demir', price: '₺1,200', rating: '4.95' },
  { id: 'p-11', title: 'AWS Cloud Mimarı ve DevOps Yol Haritası', category: 'Cloud', instructor: 'Kerem Atasoy', price: '₺1,100', rating: '4.8' },
  { id: 'p-12', title: 'Offensive Cyber Security & Penetration Testing', category: 'Security', instructor: 'Murat Arslan', price: '₺1,150', rating: '4.9' }
];

export default function StudentDashboard({ 
  courses, 
  certificates, 
  onSelectCourse, 
  onNavigateTo,
  onLogout
}: StudentDashboardProps) {
  
  // Local success story variables
  const [storySubmitted, setStorySubmitted] = useState(false);
  const [successStory, setSuccessStory] = useState({
    title: '',
    company: '',
    body: ''
  });

  // Get 10 random courses on component load
  const popularCourses = useMemo(() => {
    const shuffled = [...POPULAR_COURSES_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, []); // Run once on mount

  const handleSubmitStory = (e: FormEvent) => {
    e.preventDefault();
    if (!successStory.title || !successStory.body) return;
    setStorySubmitted(true);
  };

  // Student programs list data with only year info (2026 gibi)
  const [studentPrograms, setStudentPrograms] = useState<StudentProgram[]>([
    {
      id: 'sp-1',
      title: 'Matematik ve Analitik Düşünme',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=150&q=80',
      teacherName: 'Ali Efe Yalçın',
      status: 'Bitti',
      grade: 'Pekiyi (98/100)',
      year: 2026
    },
    {
      id: 'sp-2',
      title: 'Yapay Zeka ve Makine Öğrenmesi',
      image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=150&q=80',
      teacherName: 'Can Demir',
      status: 'Bitti',
      grade: 'Pekiyi (95/100)',
      year: 2026
    },
    {
      id: 'sp-3',
      title: 'Next.js & React İleri Seviye Geliştirme',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=150&q=80',
      teacherName: 'Selin Yılmaz',
      status: 'Devam',
      year: 2026
    }
  ]);

  // Bulk requests list for Friends
  const [bulkRequestsList, setBulkRequestsList] = useState<FriendBulkRequest[]>([
    {
      courseTitle: 'React Native ile Mobil Proje Geliştirme',
      reason: 'Arkadaşlarımızla beraber ortak bir startup fikrini hayata geçirmek istiyoruz.',
      personCount: 5,
      selectedDays: ['Pazartesi', 'Çarşamba'],
      selectedHour: 'Akşam-19.00-22.00',
      inviteCode: 'ISTM-FRND-8A'
    }
  ]);

  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkRequest, setBulkRequest] = useState({
    courseTitle: '',
    reason: '',
    personCount: 5,
    selectedDays: [] as string[],
    selectedHour: 'Sabah-09.00-12.00'
  });

  const [evaluatingCourse, setEvaluatingCourse] = useState<StudentProgram | null>(null);
  const [evalRating, setEvalRating] = useState<number>(5.0);
  const [evalComment, setEvalComment] = useState<string>('');
  const [evaluatedIds, setEvaluatedIds] = useState<string[]>([]);
  const [selectedQrCourse, setSelectedQrCourse] = useState<StudentProgram | null>(null);

  const toggleDaySelection = (day: string) => {
    if (bulkRequest.selectedDays.includes(day)) {
      setBulkRequest({
        ...bulkRequest,
        selectedDays: bulkRequest.selectedDays.filter(d => d !== day)
      });
    } else {
      setBulkRequest({
        ...bulkRequest,
        selectedDays: [...bulkRequest.selectedDays, day]
      });
    }
  };

  const handleBulkRequestSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!bulkRequest.courseTitle || !bulkRequest.reason) {
      alert('Lütfen tüm alanları doldurunuz.');
      return;
    }
    if (bulkRequest.selectedDays.length === 0) {
      alert('Lütfen en az bir müsait gün seçiniz.');
      return;
    }

    const newCode = `ISTM-FRND-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: FriendBulkRequest = {
      courseTitle: bulkRequest.courseTitle,
      reason: bulkRequest.reason,
      personCount: bulkRequest.personCount,
      selectedDays: bulkRequest.selectedDays,
      selectedHour: bulkRequest.selectedHour,
      inviteCode: newCode
    };

    setBulkRequestsList([newRequest, ...bulkRequestsList]);
    alert(`Tebrikler! Arkadaş grubunuza özel "${bulkRequest.courseTitle}" kapalı sınıf talebiniz oluşturuldu. Davet kodunu arkadaşlarınızla paylaşabilirsiniz.`);
    
    setBulkRequest({
      courseTitle: '',
      reason: '',
      personCount: 5,
      selectedDays: [],
      selectedHour: 'Sabah-09.00-12.00'
    });
    setShowBulkForm(false);
  };

  const handleEvaluateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!evaluatingCourse) return;
    
    setEvaluatedIds([...evaluatedIds, evaluatingCourse.id]);
    alert(`Teşekkürler! Değerlendirmeniz (${evalRating} yıldız • "${evalComment}") eğitmenimiz ${evaluatingCourse.teacherName} için başarıyla kaydedildi.`);
    setEvaluatingCourse(null);
    setEvalComment('');
    setEvalRating(5.0);
  };

  const handleDownloadCertificatePdf = (courseName: string) => {
    alert(`${courseName} eğitimi için .pdf formatında mezuniyet sertifikanız hazırlanıyor ve indiriliyor...`);
  };

  const ratingOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-6 sm:py-10 text-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP PANEL HEADER WITH LOGOUT */}
        <div className="mb-8 border-b border-zinc-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-[10px] tracking-widest font-black text-[#E58F49] uppercase block">ÖĞRENCİ PORTALI</span>
            <h1 className="text-3xl font-extrabold font-display text-zinc-950 mt-1">Öğrenci Kontrol Paneli</h1>
            <p className="text-xs text-zinc-500 mt-1">Derslerinizin, başarılarınızın ve yetkinliklerinizin listelendiği yönetim alanındasınız.</p>
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

        {/* STATS RAMP CARDS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          <div className="bg-white border border-zinc-200/60 p-4 sm:p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">Kayıtlı Kurslar</span>
              <BookOpen className="w-5 h-5 text-[#E58F49]" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-zinc-950 font-mono">3 Kurs</span>
            <span className="text-[10px] text-zinc-400 block mt-1">1 devam eden, 2 tamamlanan</span>
          </div>

          <div className="bg-white border border-zinc-200/60 p-4 sm:p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">Kazanılan Rozetler</span>
              <Award className="w-5 h-5 text-[#E58F49]" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-zinc-950 font-mono">4 Rozet</span>
            <span className="text-[10px] text-[#E58F49] font-bold block mt-1 truncate">✓ Başlangıç • ANALİTİK Zeka</span>
          </div>

          <div className="bg-white border border-zinc-200/60 p-4 sm:p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">Bakiye Cüzdanı</span>
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-zinc-950 font-mono">₺2,450</span>
            <span className="text-[10px] text-zinc-400 block mt-1">İndirim bonus bakiye aktif</span>
          </div>

          <div className="bg-white border border-[#E58F49]/30 p-4 sm:p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">Mezuniyet QR</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-zinc-950 font-mono">2 Belgeli</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-1">Doğrulanabilir SHA-256</span>
          </div>

        </div>

        {/* COMPREHENSIVE RESTRUCTURE: INLINE OR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2 COLUMNS: EDUCATION PROGRAMS, BATCH CLASS TICKET REQUESTS, & STORIES */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* EDUCATION PROGRAMS (EĞİTİM PROGRAMLARIM) LIST SECTION */}
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-4 sm:p-6 shadow-xs">
              <h3 className="text-base font-black text-zinc-950 mb-4 flex items-center gap-1.5 border-b border-zinc-100 pb-3">
                <Clock className="w-5 h-5 text-[#E58F49]" /> Eğitim Programlarım
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-zinc-150">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-extrabold text-[10px]">
                      <th className="py-3 px-4">Eğitim</th>
                      <th className="py-3 px-4">Eğitmen</th>
                      <th className="py-3 px-4">Kayıt Yılı</th>
                      <th className="py-3 px-4 text-center">Durum</th>
                      <th className="py-3 px-4 text-center">Belge / İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs">
                    {studentPrograms.map((program) => (
                      <tr key={program.id} className="hover:bg-zinc-50/70 transition">
                        {/* Ders Resmi & Ders Adı */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={program.image} 
                              alt={program.title} 
                              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-zinc-200" 
                            />
                            <span className="font-extrabold text-zinc-900 md:max-w-xs block leading-tight">{program.title}</span>
                          </div>
                        </td>
                        
                        {/* Öğretmen adı */}
                        <td className="py-4 px-4 font-bold text-zinc-700">
                          {program.teacherName}
                        </td>

                        {/* Tarih Yıl sütunu */}
                        <td className="py-4 px-4 font-extrabold text-zinc-500 text-[11px] font-mono">
                          {program.year || "2026"}
                        </td>
                        
                        {/* Durumu */}
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                            program.status === 'Bitti' 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-250' 
                              : 'bg-amber-50 text-amber-800 border border-amber-250'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${program.status === 'Bitti' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            {program.status}
                          </span>
                        </td>
                        
                        {/* QR / Değerlendir butonu */}
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            {program.status === 'Bitti' ? (
                              <button
                                type="button"
                                onClick={() => setSelectedQrCourse(program)}
                                className="bg-zinc-100 hover:bg-[#E58F49]/10 text-zinc-850 hover:text-[#E58F49] p-2 rounded-lg transition border border-zinc-200 flex items-center justify-center gap-1 cursor-pointer"
                                title="QR Mezuniyet Belgesini Görüntüle"
                              >
                                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-[10px] font-extrabold hidden md:inline">Sertifika</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-zinc-400 font-bold block italic px-2">Devam ediyor</span>
                            )}
                            
                            <button
                              type="button"
                              onClick={() => {
                                if (evaluatedIds.includes(program.id)) {
                                  alert('Bu eğitimi zaten değerlendirdiniz.');
                                } else {
                                  setEvaluatingCourse(program);
                                }
                              }}
                              disabled={evaluatedIds.includes(program.id)}
                              className={`text-[10px] font-black py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                                evaluatedIds.includes(program.id)
                                  ? 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                                  : 'bg-[#E58F49] hover:bg-[#D4803A] text-white shadow-3xs'
                              }`}
                            >
                              {evaluatedIds.includes(program.id) ? 'Değerlendirildi' : 'Değerlendir'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* NEW ADDITION: BIREYSEL TOPLU EGITIM TALEP BOLUMU (ARKADASLARINLA BERABER!) */}
            <div className="bg-white border border-zinc-200/65 rounded-3xl p-6 shadow-3xs text-left">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4 mb-4">
                <div>
                  <h3 className="text-base font-black text-zinc-950 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#E58F49]" /> Toplu Eğitim Talep Bölümü
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">Kendin ve Arkadaşlarına özel, kapalı sınıflı toplu eğitim paketleri talep edebilirsiniz.</p>
                  <p className="text-xs text-red-600 font-extrabold mt-1 animate-pulse">
                    ★ Eğitimin ücretini düşür, arkadaşlarınla beraber kazan!
                  </p>
                </div>
                <button
                  onClick={() => setShowBulkForm(!showBulkForm)}
                  className="bg-[#E58F49] hover:bg-[#D4803A] text-white text-xs font-black px-4 py-2.5 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-3xs"
                >
                  {showBulkForm ? 'Kapat' : '+ Arkadaşlarım İçin Sınıf İste'}
                </button>
              </div>

              {showBulkForm && (
                <form onSubmit={handleBulkRequestSubmit} className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl space-y-4 animate-fade-in">
                  <h4 className="text-xs font-extrabold text-zinc-900 border-b border-zinc-200 pb-1.5 uppercase tracking-wider">Arkadaş Grubu Sınıf Talep Formu</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Soru 1 */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-zinc-750 block">Arkadaşların için düşündüğünüz eğitimin adı nedir?</label>
                      <input 
                        type="text" 
                        required
                        value={bulkRequest.courseTitle}
                        onChange={(e) => setBulkRequest({...bulkRequest, courseTitle: e.target.value})}
                        placeholder="Örn: React Native ile Mobil Proje Geliştirme (Eğitim adını bilmiyorsanız tarif edin)"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E58F49] font-bold text-zinc-800 placeholder-zinc-400"
                      />
                    </div>

                    {/* Soru 3 */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-750 block">Bu eğitimi kaç kişi alacak?</label>
                      <input 
                        type="number"
                        min={2}
                        required
                        value={bulkRequest.personCount}
                        onChange={(e) => setBulkRequest({...bulkRequest, personCount: parseInt(e.target.value) || 5})}
                        placeholder="Örn: 5 kişi"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E58F49] font-bold text-zinc-800"
                      />
                    </div>

                  </div>

                  {/* Soru 2 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-zinc-750 block">Arkadaşların için düşündüğünüz eğitimi almak istemenizdeki neden nedir?</label>
                      <span className="text-[10px] font-mono text-zinc-400">{250 - bulkRequest.reason.length} karakter</span>
                    </div>
                    <textarea 
                      required
                      maxLength={250}
                      value={bulkRequest.reason}
                      onChange={(e) => setBulkRequest({...bulkRequest, reason: e.target.value})}
                      rows={3}
                      placeholder="Ortak bir mobil oyun üzerinde çalışıp bitirme projesi tasarlamak istiyoruz..."
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E58F49] font-bold text-zinc-800 placeholder-zinc-400"
                    />
                  </div>

                  {/* Soru 4 ve 5: Müsait Günler (Birden çok seçilebilir ve zemin daha belirgin!) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-zinc-750 block">📅 Eğitim için düşünülen müsait günler (Birden fazla seçilebilir)</label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { key: 'Pazartesi', label: 'PZT' },
                          { key: 'Salı', label: 'SAL' },
                          { key: 'Çarşamba', label: 'ÇAR' },
                          { key: 'Perşembe', label: 'PER' },
                          { key: 'Cuma', label: 'CUM' },
                          { key: 'Cumartesi', label: 'CMT' },
                          { key: 'Pazar', label: 'PAZ' }
                        ].map((day) => {
                          const isSelected = bulkRequest.selectedDays.includes(day.key);
                          return (
                            <button
                              type="button"
                              key={day.key}
                              onClick={() => toggleDaySelection(day.key)}
                              className={`px-3 py-2 text-xs font-black rounded-lg border transition select-none cursor-pointer ${
                                isSelected
                                  ? 'bg-[#E58F49] text-white border-[#E58F49] shadow-md scale-105 font-extrabold ring-2 ring-amber-300'
                                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-150'
                              }`}
                              title={day.key}
                            >
                              {day.label}
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-zinc-400 block">* Tercih edilen tüm müsait günleri işaretleyebilirsiniz.</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-zinc-750 block">⏰ Eğitim için düşünülen saatler (Seçim yapın)</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: 'Sabah-09.00-12.00', label: 'Sabah', sub: '09.00-12.00', red: false },
                          { key: 'Öğlen-13.00-16.00', label: 'Öğlen', sub: '13.00-16.00', red: false },
                          { key: 'Akşam-19.00-22.00', label: 'Akşam', sub: '19.00-22.00', red: true }
                        ].map((slot) => (
                          <label 
                            key={slot.key}
                            className={`p-2 rounded-xl text-center border text-[10.5px] font-bold cursor-pointer transition select-none flex flex-col items-center justify-center ${
                              bulkRequest.selectedHour === slot.key
                                ? slot.red 
                                  ? 'bg-red-50 text-red-600 border-red-500 font-extrabold ring-1 ring-red-400' 
                                  : 'bg-amber-50 text-amber-900 border-[#E58F49] font-extrabold ring-1 ring-amber-400'
                                : slot.red 
                                  ? 'bg-red-50/20 text-red-500 border-red-200 hover:bg-red-100/30' 
                                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                            }`}
                          >
                            <input 
                              type="radio"
                              name="selectedHourRadio"
                              value={slot.key}
                              checked={bulkRequest.selectedHour === slot.key}
                              onChange={() => setBulkRequest({...bulkRequest, selectedHour: slot.key})}
                              className="sr-only"
                            />
                            <span>{slot.label}</span>
                            <span className="text-[8.5px] opacity-75 font-mono">{slot.sub}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                  </div>

                  <div className="pt-3 border-t border-zinc-200/60 flex flex-col gap-3">
                    
                    {/* DAHA BUYUK YAZILAN ACIKLAMA NOTU */}
                    <p className="text-xs sm:text-sm md:text-base font-bold text-[#8C3F03] bg-amber-50/80 p-4 rounded-xl border border-amber-200/60 leading-relaxed">
                      * Eğitim saatleri ve günleri eğitmenlere iletilir, müfredat ve takvim müsaitlik durumuna göre en uygun yetkin eğitmen ile irtibat kurmanız sağlanır.
                    </p>

                    <button
                      type="submit"
                      className="bg-[#E58F49] hover:bg-[#D4803A] text-white text-xs font-black px-6 py-3 rounded-xl transition duration-150 self-end cursor-pointer shadow-sm"
                    >
                      Eğitim Talebi Oluştur
                    </button>
                  </div>
                </form>
              )}

              {/* LISTING REQUESTS LIST BELOW FORM */}
              <div className="mt-6 pt-5 border-t border-zinc-150">
                <span className="text-[10px] font-extrabold text-[#E58F49] tracking-wider block uppercase mb-3">Toplu Eğitim Talep Edilen Eğitimler</span>
                
                <div className="overflow-x-auto rounded-xl border border-zinc-200">
                  <table className="w-full text-left text-xs text-zinc-700 bg-white">
                    <thead className="bg-[#FAF9F5] text-[10px] uppercase font-black tracking-wider text-zinc-500 border-b border-zinc-200">
                      <tr>
                        <th className="py-2.5 px-3">Ders adı</th>
                        <th className="py-2.5 px-3">Kaç kişi katılacak</th>
                        <th className="py-2.5 px-3">Davet Kodu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-150">
                      {bulkRequestsList.map((req, index) => (
                        <tr key={index} className="hover:bg-zinc-50">
                          <td className="py-3 px-3 font-extrabold text-zinc-950">{req.courseTitle}</td>
                          <td className="py-3 px-3 font-mono font-bold text-zinc-650">{req.personCount} Kişi</td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-250 px-2.5 py-0.5 rounded font-mono font-black text-[11px]">
                              {req.inviteCode}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* DYNAMIC FORM: SHARE SUCCESS STORY ("FARK" implementation) */}
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-xs text-left">
              <h3 className="text-base font-black text-zinc-950 mb-3 flex items-center gap-1.5 border-b border-zinc-100 pb-3">
                <ClipboardList className="w-5 h-5 text-[#E58F49]" /> Başarı Hikayeni Paylaş, Burs/Kupon Kazanın!
              </h3>
              
              <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
                Bu eğitim sonucunda yeni bir işe girdiyseniz bunu İK partnerlerimize iletiyoruz. Hikayenizi yazın, topluluğa katkı vererek sonraki eğitim bakiye kuponunu kazanın!
              </p>

              {storySubmitted ? (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-300 p-6 rounded-2xl text-center">
                  <span className="text-3xl">🎉</span>
                  <h4 className="text-base font-bold text-zinc-950 mt-2">Hikayeniz Başarıyla Alındı!</h4>
                  <p className="text-xs text-zinc-650 mt-1 font-semibold">Eğitmeniniz ve İK ekibimiz hikayenizi onayladıktan sonra cüzdanınıza bakiye hediye edilecektir.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitStory} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Hangi Pozisyonu Aldınız?</label>
                      <input 
                        type="text" 
                        required
                        value={successStory.title}
                        onChange={(e) => setSuccessStory(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Örn: Frontend Developer"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E58F49] font-bold text-zinc-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Şirket Adı veya Proje Linki</label>
                      <input 
                        type="text"
                        required
                        value={successStory.company}
                        onChange={(e) => setSuccessStory(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Örn: Trendyol Teknoloji"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E58F49] font-bold text-zinc-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Eğitimin Katkısını Kısaca Anlatın</label>
                    <textarea 
                      required
                      value={successStory.body}
                      onChange={(e) => setSuccessStory(prev => ({ ...prev, body: e.target.value }))}
                      rows={3}
                      placeholder="Buradaki eğitim bitirme projem sayesinde mülakatlardaki teknik canlı kod klon testini doğrudan geçtim..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E58F49] font-bold text-zinc-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#E58F49] hover:bg-[#D4803A] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-3xs"
                  >
                    Gönder ve Kuponu Al <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: RADAR REPLACED WITH EN POPULER EGITIMLER (10 RANDOM COURSES) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-5 shadow-xs flex flex-col h-full text-left">
              <div className="border-b border-zinc-100 pb-3 mb-4">
                <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-[#E58F49] mb-1.5">
                  <Sparkles className="w-3 h-3 text-[#E58F49] animate-pulse" /> Keşfetmeye Değer Katgösterenler
                </span>
                
                <h3 className="text-base font-black font-display tracking-tight text-zinc-950">
                  En Popüler Eğitimler
                </h3>
                
                <p className="text-[10.5px] text-zinc-500 mt-0.5">
                  Kullanıcılardan en tam puan almış ve her girişte random sıralanan güncel popüler popüler 10 uzman sınıf.
                </p>
              </div>

              {/* Grid of 10 items */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1 select-none max-h-[560px]">
                {popularCourses.map((pc, index) => (
                  <div 
                    key={pc.id}
                    className="p-3 bg-zinc-50 rounded-2xl border border-zinc-150 hover:border-[#E58F49]/40 hover:bg-amber-50/20 transition group flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-black text-[#E58F49] bg-[#E58F49]/10 px-1.5 py-0.5 rounded">
                          {index + 1}. {pc.category}
                        </span>
                        <h4 className="text-[11.5px] font-black text-zinc-950 mt-1 lines-clamp-2 leading-snug group-hover:text-[#E58F49] transition">
                          {pc.title}
                        </h4>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">Eğitmen: <strong className="text-zinc-650">{pc.instructor}</strong></span>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-black text-emerald-800 block font-mono">{pc.price}</span>
                        <span className="text-[9px] text-[#E58F49] font-bold block mt-0.5">★ {pc.rating}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-zinc-150 flex items-center justify-between text-[10px]">
                      <span className="text-zinc-400 font-semibold">%100 Memnuniyet</span>
                      <button 
                        type="button" 
                        onClick={() => alert(`"${pc.title}" eğitim detayları ve kayıt ekranına yönlendiriliyorsunuz...`)}
                        className="text-[#E58F49] hover:text-[#D4803A] font-extrabold inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        İncele <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50/50 border border-amber-150 p-3 rounded-2xl text-[10px] text-amber-900 mt-4 leading-relaxed font-semibold">
                🔔 Eğitimler rastgele listelenir. Arkadaş topluluğunuzla sınıf başlatmak istediğiniz dersi seçip formdan talep gönderebilirsiniz.
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* --- EVALUATION MODAL POP-UP --- */}
      {evaluatingCourse && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-zinc-200 rounded-3xl w-full max-w-md p-6 relative shadow-2xl animate-fade-in text-left">
            <button
              onClick={() => setEvaluatingCourse(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-base font-black font-display text-zinc-950 mb-1">Eğitimi Değerlendir</h3>
            <p className="text-xs text-zinc-500 mb-4"><strong>{evaluatingCourse.title}</strong> eğitimi ve eğitmeniniz <strong>{evaluatingCourse.teacherName}</strong> hakkında görüşünüzü belirtin.</p>
            
            <form onSubmit={handleEvaluateSubmit} className="space-y-4">
              
              {/* Star Rating select box style radiobutton scale */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-zinc-700 block">🌟 Puan Ver (5 üzerinden seçim yapın)</label>
                <div className="grid grid-cols-5 gap-1.5 bg-white p-3 rounded-xl border border-zinc-200">
                  {ratingOptions.map((rating) => (
                    <label 
                      key={rating}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition select-none ${
                        evalRating === rating
                          ? 'border-[#E58F49] bg-amber-50/40 text-amber-900 font-extrabold font-black'
                          : 'border-zinc-150 bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      <input 
                        type="radio"
                        name="ratingRadio"
                        value={rating}
                        checked={evalRating === rating}
                        onChange={() => setEvalRating(rating)}
                        className="sr-only"
                      />
                      <Star className={`w-3.5 h-3.5 mb-1 ${evalRating >= rating ? 'text-[#E58F49] fill-[#E58F49]' : 'text-zinc-300'}`} />
                      <span>{rating}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 250 characters comment area */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold text-zinc-700 block">💬 Yorum Yaz</label>
                  <span className="text-[10px] font-mono text-zinc-400">{250 - evalComment.length} karakter</span>
                </div>
                <textarea
                  required
                  rows={4}
                  maxLength={250}
                  value={evalComment}
                  onChange={(e) => setEvalComment(e.target.value)}
                  placeholder="Ders anlatımı ve materyal yararlılığı ile ilgili görüşlerinizi ekleyin..."
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E58F49] font-bold text-zinc-800 placeholder-zinc-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEvaluatingCourse(null)}
                  className="flex-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-xs font-bold py-2.5 rounded-xl transition pointer-events-auto cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#E58F49] hover:bg-[#D4803A] text-white text-xs font-bold py-2.5 rounded-xl transition pointer-events-auto cursor-pointer"
                >
                  Gönder
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- QR CERTIFICATE POP-UP --- */}
      {selectedQrCourse && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-zinc-200 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl animate-fade-in text-center">
            <button
              onClick={() => setSelectedQrCourse(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="w-12 h-12 bg-emerald-50 text-emerald-700 flex items-center justify-center rounded-full mx-auto mb-3 border border-emerald-100">
              <ShieldCheck className="w-7 h-7" />
            </span>

            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block mb-1">✓ DOĞRULANMIŞ RESMİ MEZUNİYET BELGESİ</span>
            <h3 className="text-base font-black font-display text-zinc-950">İstanbul Eğitim Merkez (İSTEM) Diploma</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Sertifika SHA-256 Hash Doğrulama Sistemi</p>

            <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 my-4 text-left space-y-2.5 font-bold">
              <div className="flex justify-between text-xs pb-2 border-b border-zinc-100">
                <span className="text-zinc-400 font-semibold">Mezun Öğrenci:</span>
                <span className="text-zinc-800">Seçkin Kullanıcı</span>
              </div>
              <div className="flex justify-between text-xs pb-2 border-b border-zinc-100">
                <span className="text-zinc-400 font-semibold font-bold">Eğitim Grubu:</span>
                <span className="text-zinc-800 text-right max-w-[220px] truncate">{selectedQrCourse.title}</span>
              </div>
              <div className="flex justify-between text-xs pb-2 border-b border-zinc-100">
                <span className="text-zinc-400 font-semibold font-bold">Eğitmen Sorumlusu:</span>
                <span className="text-zinc-800">{selectedQrCourse.teacherName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-semibold font-bold">Derece ve Başarı Oranı:</span>
                <span className="text-emerald-700 font-mono">{selectedQrCourse.grade || 'Pekiyi (%96)'}</span>
              </div>
            </div>

            {/* Fake QR generator image preview */}
            <div className="bg-white border border-zinc-150 p-4 rounded-xl flex items-center justify-center gap-4 mb-4">
              <QrCode className="w-16 h-16 text-zinc-850 shrink-0" />
              <div className="text-left font-semibold">
                <span className="text-[10px] text-[#E58F49] font-black block">KAREKOD GÜVENLİK ALGORİTMASI</span>
                <p className="text-[10.5px] text-zinc-500 leading-relaxed">
                  Bu karekod, şirketler veya İK uzmanları tarafından sorgulandığında öğrencinin bitirme ödevlerini ve eğitmen not detayını gösterir.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedQrCourse(null)}
                className="flex-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-750 text-xs font-bold py-3 rounded-xl transition cursor-pointer"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => handleDownloadCertificatePdf(selectedQrCourse.title)}
                className="flex-1 bg-[#E58F49] hover:bg-[#D4803A] text-white text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                Sertifikayı PDF İndir
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
