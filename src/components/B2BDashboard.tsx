import { useState, useMemo, FormEvent } from 'react';
import { 
  Building2, Users, FilePlus, Code, CheckCircle, ShieldCheck, 
  Send, UserPlus, Trash2, GraduationCap, ArrowUpRight, QrCode, X, 
  FileDown, Calendar, Clock, LogOut, ArrowRight, Sparkles, Briefcase
} from 'lucide-react';
import { Employee, Course } from '../types';

interface B2BDashboardProps {
  initialEmployees: Employee[];
  courses: Course[];
  representativeName?: string;
  representativeCompany?: string;
  onLogout?: () => void;
}

interface CorporateTrainingRecord {
  id: string;
  courseTitle: string;
  courseImage: string;
  studentName: string;
  teacherName: string;
  status: 'Bitti' | 'Devam';
  grade?: string;
  year: number; // Sadece yıl: 2026 gibi
  verificationId?: string;
}

interface BulkTrainingRequest {
  id: string;
  courseTitle: string;
  reason: string;
  personCount: number;
  selectedDays: string[];
  selectedHour: string;
  inviteCode: string;
}

interface RecruitmentCampaign {
  id: string;
  jobTitle: string;
  selectedCourseIds: string[];
  campaignType: 'mevcut_mezunlar' | 'guncel_adaylar';
  description: string;
  createdYear: number;
}

// 12 popular courses for randomizing
const POPULAR_COURSES_POOL = [
  { id: 'p-1', title: 'Next.js ile Modern Web ve Server Actions', category: 'Software', instructor: 'Selin Yılmaz', price: 'Kurumsal Paket', rating: '4.9' },
  { id: 'p-2', title: 'Sıfırdan İleri Seviye Python ve Veri Analizi', category: 'Software', instructor: 'Ali Efe Yalçın', price: 'Kurumsal Paket', rating: '4.8' },
  { id: 'p-3', title: 'Autocad ile Tasarım ve Proje Modelleme', category: 'Design', instructor: 'Can Demir', price: 'Kurumsal Paket', rating: '4.7' },
  { id: 'p-4', title: '3D Modelleme ve Unreal Engine Kodlama', category: '3D/Game', instructor: 'Buse Tan', price: 'Kurumsal Paket', rating: '4.9' },
  { id: 'p-5', title: 'Figma Autolayout ve Design System Kurulumu', category: 'Design', instructor: 'Eren Kaya', price: 'Kurumsal Paket', rating: '4.8' },
  { id: 'p-6', title: 'TypeScript ve API Güvenlik Standartları', category: 'Software', instructor: 'Okan Şahin', price: 'Kurumsal Paket', rating: '4.9' },
  { id: 'p-7', title: 'Docker ve Kubernetes ile Edge Deploy Teknikleri', category: 'DevOps', instructor: 'Selin Yılmaz', price: 'Kurumsal Paket', rating: '4.7' },
  { id: 'p-8', title: 'React Native ile iOS & Android Geliştirme', category: 'Software', instructor: 'Hakan Demir', price: 'Kurumsal Paket', rating: '4.8' },
  { id: 'p-9', title: 'SQL Veritabanı Tasarımı ve PostgreSQL Modelleme', category: 'Data', instructor: 'Zeynep Solak', price: 'Kurumsal Paket', rating: '4.6' },
  { id: 'p-10', title: 'Yapay Zeka RAG Sistemleri ve LLM Fine-tuning', category: 'AI', instructor: 'Can Demir', price: 'Kurumsal Paket', rating: '4.95' },
  { id: 'p-11', title: 'AWS Cloud Mimarı ve DevOps Yol Haritası', category: 'Cloud', instructor: 'Kerem Atasoy', price: 'Kurumsal Paket', rating: '4.8' },
  { id: 'p-12', title: 'Offensive Cyber Security & Penetration Testing', category: 'Security', instructor: 'Murat Arslan', price: 'Kurumsal Paket', rating: '4.9' }
];

export default function B2BDashboard({ 
  initialEmployees, 
  courses, 
  representativeName = "Ayşe Yankı", 
  representativeCompany = "Acme Corporation Ltd.",
  onLogout
}: B2BDashboardProps) {
  
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  // Get 10 random popular courses on component load
  const popularCourses = useMemo(() => {
    const shuffled = [...POPULAR_COURSES_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, []); // Run once on mount

  // Corporate bulk requests tracker
  const [bulkRequestsList, setBulkRequestsList] = useState<BulkTrainingRequest[]>([
    {
      id: 'b-1',
      courseTitle: 'Yapay Zeka ve Makine Öğrenmesi',
      reason: 'Ekiplerimizin yeni devreye alacağımız mikroservis analizlerinde yapay zeka entegrasyonu tecrübe etmesi için.',
      personCount: 15,
      selectedDays: ['Pazartesi', 'Salı'],
      selectedHour: 'Sabah-09.00-12.00',
      inviteCode: 'ISTM-CORP-915'
    }
  ]);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkRequest, setBulkRequest] = useState({
    courseTitle: '',
    reason: '',
    personCount: 15,
    selectedDays: [] as string[],
    selectedHour: 'Sabah-09.00-12.00'
  });

  // Recruitment / Hiring Campaigns list
  const [recruitmentCampaigns, setRecruitmentCampaigns] = useState<RecruitmentCampaign[]>([
    {
      id: 'rc-1',
      jobTitle: 'Mimarlık ofisinde görevlendirmek üzere ilgili dersleri almış adaylar ile görüşme sağlayacağız.',
      selectedCourseIds: ['autocad-1', '3d-model-2'],
      campaignType: 'mevcut_mezunlar',
      description: 'Autocad İle Tasarım ve 3D Modelleme ve Kodlama derslerini bitirmiş tüm mezunlarımızın CV dosyaları taranacaktır.',
      createdYear: 2026
    }
  ]);

  const [campaignInput, setCampaignInput] = useState({
    jobTitle: 'Mimarlık ofisinde görevlendirmek üzere ilgili dersleri almış adaylar ile görüşme sağlayacağız.',
    selectedCourseIds: [] as string[],
    campaignType: 'mevcut_mezunlar' as 'mevcut_mezunlar' | 'guncel_adaylar',
  });

  // Corporate Training records list with year columns (2026)
  const [corporateTrainings, setCorporateTrainings] = useState<CorporateTrainingRecord[]>([
    {
      id: 'ct-1',
      courseTitle: 'Yapay Zeka ve Makine Öğrenmesi',
      courseImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=150&q=80',
      studentName: 'Ahmet Yılmaz',
      teacherName: 'Ali Efe Yalçın',
      status: 'Bitti',
      grade: 'Derece (98/100)',
      year: 2026,
      verificationId: 'AI-IK-8402'
    },
    {
      id: 'ct-2',
      courseTitle: 'Siber Güvenlik ve Ağ Güvenliği',
      courseImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=150&q=80',
      studentName: 'Ayşe Kaya',
      teacherName: 'Can Demir',
      status: 'Devam',
      year: 2026
    },
    {
      id: 'ct-3',
      courseTitle: 'Next.js & React İleri Seviye Geliştirme',
      courseImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=150&q=80',
      studentName: 'Mehmet Demir',
      teacherName: 'Selin Yılmaz',
      status: 'Bitti',
      grade: 'Derece (92/100)',
      year: 2026,
      verificationId: 'NEX-IK-3912'
    }
  ]);

  const [selectedCertificate, setSelectedCertificate] = useState<CorporateTrainingRecord | null>(null);

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
      alert('Lütfen gerekli alanları doldurunuz.');
      return;
    }
    if (bulkRequest.selectedDays.length === 0) {
      alert('Lütfen en az bir müsait gün seçiniz.');
      return;
    }

    const newCode = `ISTM-CORP-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: BulkTrainingRequest = {
      id: `b-${Date.now()}`,
      courseTitle: bulkRequest.courseTitle,
      reason: bulkRequest.reason,
      personCount: bulkRequest.personCount,
      selectedDays: bulkRequest.selectedDays,
      selectedHour: bulkRequest.selectedHour,
      inviteCode: newCode
    };

    setBulkRequestsList([newRecord, ...bulkRequestsList]);
    alert(`Tebrikler! "${bulkRequest.courseTitle}" kurumsal kapalı sınıf talebiniz 15 saniyede oluşturuldu ve eğitmen havuzumuza dağıtıldı.`);
    
    setBulkRequest({
      courseTitle: '',
      reason: '',
      personCount: 15,
      selectedDays: [],
      selectedHour: 'Sabah-09.00-12.00'
    });
    setShowBulkForm(false);
  };

  // Add recruitment campaign
  const handleAddCampaign = (e: FormEvent) => {
    e.preventDefault();
    if (!campaignInput.jobTitle) {
      alert('Lütfen iş / ilan açıklamasını yazın.');
      return;
    }

    const newCampaign: RecruitmentCampaign = {
      id: `rc-${Date.now()}`,
      jobTitle: campaignInput.jobTitle,
      selectedCourseIds: campaignInput.selectedCourseIds,
      campaignType: campaignInput.campaignType,
      description: campaignInput.campaignType === 'mevcut_mezunlar' 
        ? 'Seçilen dersleri tamamlayan mezunlarımıza iş daveti ve detayları otomatik olarak iletilmiştir.'
        : 'Seçilen dersleri henüz almamış yetenek havuzu adaylarına indirim/burs bilgilendirmesi iletildi.',
      createdYear: 2026
    };

    setRecruitmentCampaigns([newCampaign, ...recruitmentCampaigns]);
    alert('Tebrikler, işe alım / eğitim planı kampanyanız başarıyla oluşturuldu ve eşleşen adayların e-posta adreslerine davetiyeler gönderildi!');
    
    setCampaignInput({
      jobTitle: '',
      selectedCourseIds: [],
      campaignType: 'mevcut_mezunlar'
    });
  };

  const toggleCourseInCampaign = (courseId: string) => {
    if (campaignInput.selectedCourseIds.includes(courseId)) {
      setCampaignInput({
        ...campaignInput,
        selectedCourseIds: campaignInput.selectedCourseIds.filter(id => id !== courseId)
      });
    } else {
      setCampaignInput({
        ...campaignInput,
        selectedCourseIds: [...campaignInput.selectedCourseIds, courseId]
      });
    }
  };

  const handleRemoveEmployee = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-6 sm:py-10 text-zinc-900 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* UPPER BANNER WITH ACTIVE LOGOUT BUTTON */}
        <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xs">
          <div>
            <span className="text-[10px] tracking-widest font-black text-[#E58F49] uppercase block mb-1">KURUMSAL B2B PORTALI</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-zinc-950 mt-1 flex items-center gap-2">
              <Building2 className="w-8 h-8 text-[#E58F49] shrink-0" /> İK &amp; Şirket Yönetim Paneli
            </h1>
            <p className="text-xs text-zinc-500 mt-1 font-semibold">Ekiplerinizin Next.js, Yapay Zeka ve Matematik eğitim süreçlerini canlı olarak denetleyin ve toplu eğitim planlayın.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="bg-[#FAF9F5] border border-[#E58F49]/20 p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E58F49]/10 text-[#E58F49] rounded-xl flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 font-black" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Tanımlı Yetkili Şirket</span>
                <span className="text-xs sm:text-sm font-extrabold text-zinc-900 block">{representativeCompany}</span>
                <span className="text-[10px] font-semibold text-zinc-500 block">Temsilci: <strong className="text-[#E58F49] font-extrabold">{representativeName}</strong></span>
              </div>
            </div>

            {onLogout && (
              <button 
                onClick={onLogout}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-150 text-red-700 hover:text-red-900 px-4 py-2.5 rounded-xl border border-red-200 text-xs font-black transition duration-150 cursor-pointer shadow-3xs"
              >
                <LogOut className="w-4 h-4 text-red-655" />
                Çıkış Yap
              </button>
            )}
          </div>
        </div>

        {/* 2 COLUMN MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2 COLUMNS: ALL BULK FORMS, TABLES, CAMPAIGNS */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* TOPLU EĞİTİM TALEP BÖLÜMÜ */}
            <div className="bg-white border border-zinc-200/65 rounded-3xl p-6 shadow-3xs text-left">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4 mb-4">
                <div>
                  <h3 className="text-base font-black text-zinc-950 flex items-center gap-2">
                    <FilePlus className="w-5 h-5 text-[#E58F49]" /> Toplu Eğitim Talep Bölümü
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">Şirket personeline özel, kapalı sınıflı toplu eğitim paketleri talep edebilirsiniz.</p>
                </div>
                <button
                  onClick={() => setShowBulkForm(!showBulkForm)}
                  className="bg-[#E58F49] hover:bg-[#D4803A] text-white text-xs font-black px-4 py-2.5 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-3xs"
                >
                  {showBulkForm ? 'Kapat' : '+ Kurumsal Sınıf İstiyorum'}
                </button>
              </div>

              {showBulkForm && (
                <form onSubmit={handleBulkRequestSubmit} className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl space-y-4 animate-fade-in">
                  <h4 className="text-xs font-extrabold text-zinc-900 border-b border-zinc-200 pb-1.5 uppercase tracking-wider">Toplu Sınıf Talep Formu</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Soru 1 */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-zinc-750 block">Kurum için düşündüğünüz eğitimin adı nedir?</label>
                      <input 
                        type="text" 
                        required
                        value={bulkRequest.courseTitle}
                        onChange={(e) => setBulkRequest({...bulkRequest, courseTitle: e.target.value})}
                        placeholder="Örn: Yapay Zeka Entegrasyon Eğitimi (Başlık olarak tarif edebilirsiniz)"
                        className="w-full bg-white border border-zinc-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E58F49] font-bold text-zinc-800 placeholder-zinc-400"
                      />
                    </div>

                    {/* Soru 3 */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-750 block">Bu eğitimi kaç kişi alacak?</label>
                      <input 
                        type="number"
                        min={1}
                        required
                        value={bulkRequest.personCount}
                        onChange={(e) => setBulkRequest({...bulkRequest, personCount: parseInt(e.target.value) || 15})}
                        placeholder="Eğitilecek kişi sayısı"
                        className="w-full bg-white border border-zinc-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E58F49] font-bold text-zinc-800"
                      />
                    </div>

                  </div>

                  {/* Soru 2 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-zinc-750 block">Kurum için düşündüğünüz eğitimi almak istemenizdeki neden nedir?</label>
                      <span className="text-[10px] font-mono text-zinc-400">{250 - bulkRequest.reason.length} karakter sınırı</span>
                    </div>
                    <textarea 
                      required
                      maxLength={250}
                      value={bulkRequest.reason}
                      onChange={(e) => setBulkRequest({...bulkRequest, reason: e.target.value})}
                      rows={3}
                      placeholder="Ekiplerimizin yeni devreye alacağımız mikroservis analizlerinde yapay zeka entegrasyonu tecrübe etmesi için..."
                      className="w-full bg-white border border-zinc-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#E58F49] font-bold text-zinc-800 placeholder-zinc-400"
                    />
                  </div>

                  {/* Soru 4 ve 5: Müsait Günler (Multi-select) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-zinc-750 block">📅 Eğitim için düşünülen müsait günler (Seçim yapın - Çoklu seçilebilir)</label>
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
                                  ? 'bg-[#E58F49] text-white border-[#E58F49] shadow-md ring-2 ring-amber-300 scale-105 font-black'
                                  : 'bg-white text-zinc-700 border-zinc-150 hover:bg-zinc-100'
                              }`}
                              title={day.key}
                            >
                              {day.label}
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-zinc-400 block">* Uygun olan tüm günleri işaretleyin.</span>
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
                                  : 'bg-white text-zinc-650 border-zinc-200 hover:bg-zinc-100'
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
                    <p className="text-xs sm:text-sm md:text-base font-bold text-[#8C3F03] bg-amber-50/75 p-4 rounded-xl border border-amber-200/60 leading-relaxed">
                      * Eğitim saatleri ve günleri eğitmenlere iletilir, takvim ve müfredat müsaitlik durumuna göre en uygun yetkin eğitmen ile irtibat kurmanız sağlanır.
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

              {/* LISTING OF ACTIVE REQUESTS */}
              <div className="mt-5 pt-4 border-t border-zinc-100">
                <span className="text-[10px] font-extrabold text-[#E58F49] tracking-wider block uppercase mb-3.5">Toplu Eğitim Talep Edilen Eğitimler</span>
                
                <div className="overflow-x-auto rounded-xl border border-zinc-200">
                  <table className="w-full text-left text-xs bg-white text-zinc-700">
                    <thead className="bg-[#FAF9F5] border-b border-zinc-200 text-zinc-450 uppercase font-black text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Ders adı</th>
                        <th className="py-2.5 px-3">Kaç kişi katılacak</th>
                        <th className="py-2.5 px-3 text-center">Davet Kodu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {bulkRequestsList.map((req, idx) => (
                        <tr key={req.id || idx} className="hover:bg-zinc-50">
                          <td className="py-3 px-3 font-extrabold text-zinc-900">{req.courseTitle}</td>
                          <td className="py-3 px-3 font-mono font-bold text-zinc-600">{req.personCount} Personel</td>
                          <td className="py-3 px-3 text-center">
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

            {/* NEW SECTION: İŞ ALIMI İÇİN EĞİTİM PLANLA */}
            <div className="bg-white border border-zinc-250/60 rounded-3xl p-6 shadow-xs text-left">
              <h3 className="text-base font-black text-zinc-950 mb-1 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-700" /> İş Alımı İçin Eğitim Planla
              </h3>
              <p className="text-xs text-zinc-500 mb-4">Kurumsal üye statüsünde yeni iş ilanları açıp adayların eğitim durumlarına göre filtreleme planlayabilirsiniz.</p>

              {/* Recruitment campaign builder form */}
              <form onSubmit={handleAddCampaign} className="bg-[#FAF9F5] border border-zinc-200 p-4 rounded-2xl space-y-4">
                <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-900 font-extrabold px-2 py-0.5 rounded uppercase">Yeni İlan Kampanyası</span>
                
                {/* Options list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className={`p-3.5 rounded-xl border cursor-pointer select-none transition ${
                    campaignInput.campaignType === 'mevcut_mezunlar' 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-black shadow-3xs' 
                      : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-bold'
                  }`}>
                    <input 
                      type="radio"
                      name="campaignTypeRadio"
                      checked={campaignInput.campaignType === 'mevcut_mezunlar'}
                      onChange={() => setCampaignInput({...campaignInput, campaignType: 'mevcut_mezunlar'})}
                      className="sr-only"
                    />
                    <div className="text-xs font-black">🎓 Mevcut eğitim almışlardan alım planla</div>
                    <p className="text-[10px] text-zinc-400 font-semibold mt-1">Ders(ler) seç, İş başlığını yaz bu dersi daha önce almışlara ilet.</p>
                  </label>

                  <label className={`p-3.5 rounded-xl border cursor-pointer select-none transition ${
                    campaignInput.campaignType === 'guncel_adaylar' 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-black shadow-3xs' 
                      : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-bold'
                  }`}>
                    <input 
                      type="radio"
                      name="campaignTypeRadio"
                      checked={campaignInput.campaignType === 'guncel_adaylar'}
                      onChange={() => setCampaignInput({...campaignInput, campaignType: 'guncel_adaylar'})}
                      className="sr-only"
                    />
                    <div className="text-xs font-black">📢 Güncel olarak dersi alınsın</div>
                    <p className="text-[10px] text-zinc-400 font-semibold mt-1">Ders(ler) seç, İş başlığını yaz bu dersi henüz almamış kişilere bilgilendirme iletilsin.</p>
                  </label>
                </div>

                {/* Course Selection list checks */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block">Kriter Ders Grubu Seçin (Çoklu Seçim):</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-zinc-200 max-h-36 overflow-y-auto">
                    {[
                      { id: 'autocad-1', title: 'Autocad İle Tasarım' },
                      { id: '3d-model-2', title: '3D Modelleme ve Kodlama' },
                      { id: 'python-3', title: 'Python ve Robotik Yapay Zeka' },
                      { id: 'nextjs-4', title: 'Next.js 15 Web Geliştirme' },
                      { id: 'math-5', title: 'Analitik Matematik I' },
                    ].map(item => {
                      const isSelected = campaignInput.selectedCourseIds.includes(item.id);
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => toggleCourseInCampaign(item.id)}
                          className={`text-left p-2 rounded-lg text-xs border font-bold transition flex items-center justify-between cursor-pointer ${
                            isSelected 
                              ? 'bg-[#E58F49]/10 text-[#E58F49] border-[#E58F49]' 
                              : 'bg-zinc-50 border-zinc-150 text-zinc-700 hover:bg-zinc-100'
                          }`}
                        >
                          <span>{item.title}</span>
                          <span className="text-[9px] font-bold uppercase opacity-80">
                            {isSelected ? '✓ Seçildi' : '+ Ekle'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Job Title and Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-750 block">İş İlan Başlığı ve Görevlendirme Detayı:</label>
                  <textarea 
                    required
                    value={campaignInput.jobTitle}
                    onChange={(e) => setCampaignInput({...campaignInput, jobTitle: e.target.value})}
                    rows={2}
                    placeholder="Mimarlık ofisinde görevlendirmek üzere ilgili dersleri almış adaylar ile görüşme sağlayacağız."
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#E58F49] focus:outline-none placeholder-zinc-400 text-zinc-800 font-bold"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-sm transition"
                  >
                    İş Alımı Kampanyası Oluştur
                  </button>
                </div>
              </form>

              {/* Show created campaigns */}
              <div className="mt-5 space-y-3.5">
                <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider block">Aktif Rekrutman &amp; İşe Alım Kampanyalarınız</span>
                {recruitmentCampaigns.map((camp) => (
                  <div key={camp.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100 mt-0.5">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-indigo-800 bg-indigo-100/60 px-2 py-0.5 rounded">
                        {camp.campaignType === 'mevcut_mezunlar' ? '✓ Mevcut Mezun Filtrasyonu' : '📢 Yetişen Aday Takibi'}
                      </span>
                      <p className="text-xs font-black text-zinc-900 leading-tight mt-1">{camp.jobTitle}</p>
                      <p className="text-[10.5px] italic text-zinc-550 mt-1">"{camp.description}"</p>
                      <span className="text-[9px] font-mono text-zinc-400 block mt-1.5">* Kayıt Yılı: {camp.createdYear}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EĞİTİM PROGRAMLARIM (TABULAR LIST OF CORPORATE STUDENTS) */}
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-5 shadow-xs">
              <h3 className="text-base font-black text-zinc-950 mb-4 flex items-center gap-1.5 border-b border-zinc-100 pb-3">
                <GraduationCap className="w-5 h-5 text-[#E58F49]" /> Eğitim Programlarım (Kurumsal İlerleme Listesi)
              </h3>

              <div className="overflow-hidden border border-zinc-150 rounded-2xl bg-white">
                <table className="w-full text-left bg-white">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-450 uppercase tracking-wider font-extrabold text-[9px] sm:text-[10px]">
                      <th className="py-3 px-4">Eğitim</th>
                      <th className="py-3 px-4">Öğrenci Sorumlusu</th>
                      <th className="py-3 px-4">Öğretmen</th>
                      <th className="py-3 px-4">Kayıt Yılı</th>
                      <th className="py-3 px-4">Durum</th>
                      <th className="py-3 px-4 text-center">Belge / QR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs text-zinc-800">
                    {corporateTrainings.map((record) => (
                      <tr key={record.id} className="hover:bg-zinc-50/75 transition">
                        {/* Ders Resmi & Ders adı */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={record.courseImage} 
                              alt={record.courseTitle} 
                              className="w-10 h-10 rounded-lg object-cover border border-zinc-150 shrink-0" 
                            />
                            <span className="font-extrabold text-zinc-900 leading-tight">{record.courseTitle}</span>
                          </div>
                        </td>

                        {/* Öğrenci adı */}
                        <td className="py-3.5 px-4 font-bold text-zinc-850">
                          {record.studentName}
                        </td>

                        {/* Öğretmen adı */}
                        <td className="py-3.5 px-4 text-zinc-650 font-black">
                          {record.teacherName}
                        </td>

                        {/* Yıl kolonu */}
                        <td className="py-3.5 px-4 font-mono font-extrabold text-zinc-500 text-[11px]">
                          {record.year || "2026"}
                        </td>

                        {/* Durumu */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                            record.status === 'Bitti' 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-250' 
                              : 'bg-amber-50 text-amber-800 border border-amber-250'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${record.status === 'Bitti' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            {record.status}
                          </span>
                        </td>

                        {/* QR Sertifika Popup Trigger */}
                        <td className="py-3.5 px-4 text-center">
                          {record.status === 'Bitti' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedCertificate(record)}
                              className="bg-zinc-100 hover:bg-[#E58F49]/10 text-emerald-700 hover:text-[#E58F49] p-2 rounded-lg transition border border-zinc-200 cursor-pointer inline-flex items-center justify-center gap-1.5"
                              title="QR Mezuniyet Belgesini Aç"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-black hidden sm:inline">Belge</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-mono text-zinc-400 font-bold block italic">Devam Ediyor</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: REPLACED WITH EN POPULER EGITIMLER (10 RANDOM COURSES) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-5 shadow-xs flex flex-col h-full text-left">
              <div className="border-b border-zinc-100 pb-3 mb-4">
                <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-[#E58F49] mb-1.5">
                  <Sparkles className="w-3 h-3 text-[#E58F49] animate-pulse" /> Kurumsal Fırsatlar
                </span>
                
                <h3 className="text-base font-black font-display tracking-tight text-zinc-950">
                  En Popüler Eğitimler
                </h3>
                
                <p className="text-[10.5px] text-zinc-550 mt-0.5">
                  Kullanıcılardan en yüksek puan almış ve her girişte rastgele sıralanan güncel popüler 10 kurumsal sınıf.
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
                        <span className="text-[10.5px] font-black text-emerald-800 block font-mono">{pc.price}</span>
                        <span className="text-[9px] text-[#E58F49] font-bold block mt-0.5">★ {pc.rating}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-zinc-150 flex items-center justify-between text-[10px]">
                      <span className="text-zinc-400 font-semibold">%100 Kurumsal Altyapı</span>
                      <button 
                        type="button" 
                        onClick={() => alert(`"${pc.title}" kurumsal sınıf detayına yönlendiriliyorsunuz...`)}
                        className="text-[#E58F49] hover:text-[#D4803A] font-extrabold inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        Teklif Al <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50/50 border border-amber-150 p-3 rounded-2xl text-[10px] text-amber-900 mt-4 leading-relaxed font-semibold">
                🛡️ Kurumsal sınıflar isteğe özel tasarlanır, bitirme belgesi SHA-256 karekod ile sisteme kaydedilir.
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* --- CORPORATE GRADUATION QR POP-UP --- */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-zinc-200 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl animate-fade-in text-center">
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="w-12 h-12 bg-emerald-50 text-emerald-700 flex items-center justify-center rounded-full mx-auto mb-3 border border-emerald-100">
              <ShieldCheck className="w-7 h-7" />
            </span>

            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block mb-1">✓ DOĞRULANMIŞ RESMİ MEZUNİYET BELGESİ</span>
            <h3 className="text-base font-black font-display text-zinc-950">İstanbul Eğitim Merkezi (İSTEM) Diploma</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Sertifika SHA-255 Hash Doğrulama Sistemi</p>

            <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 my-4 text-left space-y-2.5 font-bold">
              <div className="flex justify-between text-xs pb-2 border-b border-zinc-100">
                <span className="text-zinc-400 font-semibold">Temsilci Şirket:</span>
                <span className="text-zinc-850 font-black">{representativeCompany}</span>
              </div>
              <div className="flex justify-between text-xs pb-2 border-b border-zinc-100">
                <span className="text-zinc-400 font-semibold">Öğrenci Personel:</span>
                <span className="text-zinc-800">{selectedCertificate.studentName}</span>
              </div>
              <div className="flex justify-between text-xs pb-2 border-b border-zinc-100">
                <span className="text-zinc-400 font-semibold">Eğitim Programı:</span>
                <span className="text-zinc-800 text-right max-w-[220px] truncate">{selectedCertificate.courseTitle}</span>
              </div>
              <div className="flex justify-between text-xs pb-2 border-b border-zinc-100">
                <span className="text-zinc-400 font-semibold">Sorumlu Eğitmen:</span>
                <span className="text-zinc-800">{selectedCertificate.teacherName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-semibold">Derece ve Başarı Oranı:</span>
                <span className="text-emerald-700 font-mono">{selectedCertificate.grade || 'Pekiyi (%94)'}</span>
              </div>
            </div>

            {/* Fake QR generator image preview */}
            <div className="bg-white border border-zinc-150 p-4 rounded-xl flex items-center justify-center gap-4 mb-4">
              <QrCode className="w-16 h-16 text-zinc-800 shrink-0" />
              <div className="text-left font-semibold">
                <span className="text-[10px] text-[#E58F49] font-black block">KAREKOD GÜVENLİK ANALİZİ</span>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  Bu karekod, şirketler veya İK uzmanları tarafından sorgulandığında personelin bitirme çalışmalarını, ders devamlılık durumunu ve eğitmen not detayını gösterir.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedCertificate(null)}
                className="flex-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-750 text-xs font-bold py-3 rounded-xl transition cursor-pointer"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`"${selectedCertificate.courseTitle}" eğitimi için .pdf formatındaki diploma dosyası indiriliyor...`);
                }}
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
