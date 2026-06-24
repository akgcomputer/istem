import { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Lock, CheckCircle, Smartphone, Globe, 
  Clock, Play, HelpCircle, Star, Sparkles, ShoppingCart, ArrowRight,
  Phone, MessageCircle, X
} from 'lucide-react';
import { Course } from '../types';
import ShareButtons from './ShareButtons';

interface DetailViewProps {
  course: Course;
  onEnroll: (courseId: string) => void;
  isEnrolled: boolean;
  onNavigateTo: (page: string) => void;
}

export default function DetailView({ course, onEnroll, isEnrolled, onNavigateTo }: DetailViewProps) {
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    'acc-0': true, // Keep first open by default
  });
  const [selectedInstructorProfile, setSelectedInstructorProfile] = useState<any | null>(null);

  const instructorsList = [
    {
      id: 'i-1',
      name: 'Mehmet Ali Öztürk',
      title: 'Prof. Dr. • Kıdemli Yazılım Mimarı & Danışman',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      rating: '4.9',
      reviewCount: 342,
      bio: '20 yılı aşkın süredir akademik ve kurumsal seviyede ileri düzey yazılım mühendisliği, büyük veri mimarileri ve yapay zeka eğitimleri vermektedir.',
      specialties: ['Python', 'Makine Öğrenmesi', 'Algoritmalar', 'Sistem Mimarisi']
    },
    {
      id: 'i-2',
      name: 'Can Yavuz',
      title: 'Yazılım Mimarı & Geliştirici Temsilcisi',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      rating: '4.8',
      reviewCount: 219,
      bio: 'Önde gelen teknoloji firmalarında full-stack mimar olarak görev almış, pratik odaklı canlı eğitim deneyimleriyle öğrencilerini sıfırdan zirveye taşımaktadır.',
      specialties: ['Next.js', 'React', 'TypeScript', 'Node.js']
    },
    {
      id: 'i-3',
      name: 'Merve Aydoğan',
      title: 'Yapay Zeka Araştırmacısı & Kıdemli Eğitmen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      rating: '4.9',
      reviewCount: 184,
      bio: 'Bilişim akademilerinde 1000\'den fazla yazılımcı yetiştiren Merve Hoca, sade anlatımı ve zengin kod örnekleriyle projeli öğrenim sunmaktadır.',
      specialties: ['Veri Yapıları', 'Algoritmalar', 'Gereksinim Modelleme', 'UI/UX']
    }
  ];

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* UPPER BREADCRUMB */}
        <div className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <span>Katalog</span>
          <span>/</span>
          <span>Bilişim Eğitimi &gt; {course.category}</span>
          <span>/</span>
          <span className="text-[#FF6600]">{course.title}</span>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLUMNS: DESCRIPTION, CURRICULUM, CAPSTONE FARK */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Header visual panel */}
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 shadow-xs">
              <span className="inline-flex items-center gap-1 bg-amber-100 text-[#8C3F03] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                {course.level} Seviye
              </span>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-zinc-950 mb-4 leading-tight">
                {course.title}
              </h1>

              {/* General details */}
              <div className="flex flex-wrap items-center gap-5 text-xs text-zinc-500 border-b border-zinc-100 pb-5 mb-5">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <strong className="text-zinc-800">{course.rating}</strong>
                  <span>({course.enrolledCount} kayıtlı öğrenci)</span>
                </div>
                <div>✦</div>
                <div>Süre: <strong className="text-zinc-800">{course.duration}</strong></div>
                <div>✦</div>
                <div>Ders Sayısı: <strong className="text-zinc-800">{course.lessonsCount} Bölüm</strong></div>
              </div>

              {/* Instructor introduction row */}
              <div className="flex items-center gap-3">
                <img src={course.instructorAvatar?.includes('ui-avatars.com') && !course.instructorAvatar.includes('size=') ? course.instructorAvatar + '&size=256' : course.instructorAvatar} alt={course.instructorName} className="w-12 h-12 rounded-full object-cover border-2 border-amber-200" />
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">EĞİTMEN</span>
                  <h3 className="text-sm font-black text-zinc-900">{course.instructorName}</h3>
                  <p className="text-xs text-zinc-500">{course.instructorBio}</p>
                </div>
              </div>
            </div>

            {/* VIDEO PREVIEW OR IMAGE BANNER */}
            <div className="relative bg-black rounded-3xl overflow-hidden aspect-video shadow-md border border-zinc-900 group">
              <img src={course.image} alt={course.title} className="object-cover w-full h-full opacity-70 group-hover:scale-102 transition duration-350" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-6">
                
                <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md self-start uppercase">
                  MÜFREDAT TANITIM VİDEOSU
                </span>

                <div className="flex items-center gap-4 text-white">
                  <button className="w-14 h-14 bg-[#FF6600] hover:bg-[#CC5200] text-white flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition shrink-0 active:scale-95">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </button>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-snug">Bu Kursun İçeriği ve Katkısı</h4>
                    <p className="text-xs text-zinc-300">Eğitmen Canlı Anlatımı ile İlk Ders (3:45 Ücretsiz Önizleme)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* "FARK" IMPLEMENTATION: CAPSTONE PROJECTS PREVIEW */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200 rounded-3xl p-6 sm:p-8 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 bg-indigo-650 text-white flex items-center justify-center rounded-xl shadow-xs">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </span>
                <div>
                  <span className="text-[9px] font-black tracking-widest text-[#FF6600] uppercase">BU KURSTA YAPILACAK BİTİRME PROJESİ</span>
                  <h3 className="text-base sm:text-lg font-black text-indigo-950">Capstone Project (Uygulamalı Portfoy)</h3>
                </div>
              </div>

              <div className="bg-white border border-indigo-150 p-5 rounded-2xl shadow-xs mt-2">
                <h4 className="text-sm font-extrabold text-indigo-900 flex items-center gap-2">
                  🚀 {course.capstoneTitle}
                </h4>
                <p className="text-xs text-zinc-650 mt-2.5 leading-relaxed">
                  {course.capstoneDesc}
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-indigo-900 font-semibold font-mono">
                  <span>✓ Doğrulanabilir Link</span>
                  <span>✓ Github Entegrasyonu</span>
                  <span>✓ Eğitmenden Puanlandırma</span>
                </div>
              </div>
            </div>

            {/* CURRICULUM ACCORDION */}
            <div>
              <h3 className="text-lg font-bold font-display text-zinc-950 mb-4">Eğitim Müfredatı</h3>
              
              <div className="flex flex-col gap-3">
                {(course.lessons || []).map((lesson, index) => {
                  const accordionId = `acc-${index}`;
                  const isOpen = !!openAccordions[accordionId];

                  return (
                    <div 
                      key={lesson.id}
                      className="bg-white border border-zinc-200/60 rounded-2xl overflow-hidden shadow-xs"
                    >
                      {/* Accordion trigger header */}
                      <button
                        onClick={() => toggleAccordion(accordionId)}
                        className="w-full text-left px-5 py-4 flex justify-between items-center bg-zinc-50/50 hover:bg-zinc-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-zinc-400 bg-zinc-200/60 px-2 py-0.5 rounded">
                            {index + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-zinc-800 line-clamp-1">{lesson.title}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs font-bold text-zinc-500 shrink-0">
                          <span>{lesson.duration}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                        </div>
                      </button>

                      {/* Accordion Content */}
                      {isOpen && (
                        <div className="p-5 border-t border-zinc-100 flex flex-col gap-3.5 bg-white">
                          <p className="text-xs text-zinc-550 leading-relaxed">
                            Bu modülde eğitmenle konuyu detaylarıyla ele alacak ve ders sonrasında {lesson.hasQuiz ? 'gömülü interaktif testi' : 'pratik kod egzersizlerini'} yapacaksınız.
                          </p>

                          <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-xl border border-zinc-150 text-[11px]">
                            <div className="flex items-center gap-1.5 text-zinc-600 font-medium">
                              {lesson.isLocked && !isEnrolled ? (
                                <span className="flex items-center gap-1 text-red-700">
                                  <Lock className="w-3.5 h-3.5" /> Gerekli: Kurs Üyeliği Kilitli
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-emerald-800">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Erişebilir: Aktif
                                </span>
                              )}
                            </div>
                            {lesson.hasQuiz && (
                              <span className="bg-amber-100 text-[#8C3F03] font-bold px-2 py-0.5 rounded">Quiz Var (Zaman Ayarlı)</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ⭐ EĞİTMENLER VE ÜCRETLER */}
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-2 border-b border-zinc-150 pb-4">
                <span className="text-xl">⭐</span>
                <h3 className="text-lg font-extrabold font-display text-zinc-950">Eğitmenler ve Ücretler</h3>
              </div>
              
              <div className="divide-y divide-zinc-150 space-y-5 flex flex-col">
                {instructorsList.map((inst, index) => (
                  <div key={inst.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${index > 0 ? 'pt-5 border-t border-zinc-150' : ''}`}>
                    <div className="flex items-center gap-3">
                      <img src={inst.avatar?.includes('ui-avatars.com') && !inst.avatar.includes('size=') ? inst.avatar + '&size=256' : inst.avatar} alt={inst.name} className="w-12 h-12 rounded-full object-cover border border-zinc-150 shrink-0" />
                      <div>
                        <h4 className="text-sm font-black text-zinc-900">{inst.name}</h4>
                        <p className="text-xs text-zinc-500 font-medium">{inst.title}</p>
                        <div className="flex items-center gap-1 mt-0.5 text-[11px] text-zinc-500">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                          <span className="font-extrabold text-[#FF6600]">{inst.rating}</span>
                          <span>({inst.reviewCount} değerlendirme)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedInstructorProfile(inst)}
                        className="bg-zinc-950 hover:bg-zinc-850 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                      >
                        Profili İncele
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          alert(`🎉 ${inst.name} eşliğinde ${course.title} eğitimine kaydoluyorsunuz! Tebrikler!`);
                          onEnroll(course.id);
                        }}
                        className="bg-[#FF6600] hover:bg-[#CC5200] text-white text-[11px] font-black px-4 py-2 rounded-xl transition cursor-pointer shadow-sm hover:scale-102 active:scale-98"
                      >
                        Eğitim Al
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* WHATSAPP & PHONE ACTION BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-zinc-150">
                <a
                  href={`https://wa.me/${(localStorage.getItem('whatsapp_number') || '905551234567').replace(/\s+/g, '')}?text=${encodeURIComponent(`Merhaba, ${course.title} hakkında bilgi almak istiyorum.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 font-extrabold text-xs py-3 px-4 rounded-xl border border-emerald-200/50 transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  WhatsApp'tan Bilgi Al
                </a>
                <a
                  href={`tel:${(localStorage.getItem('hotline_number') || '902129999999').replace(/\s+/g, '')}`}
                  className="bg-zinc-50 hover:bg-zinc-100 text-zinc-800 font-extrabold text-xs py-3 px-4 rounded-xl border border-zinc-200 transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                  Bizi Arayın
                </a>
              </div>
            </div>

            {/* DETAYLAR */}
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-lg font-extrabold font-display text-zinc-950 pb-2 border-b border-zinc-150">Detaylar</h3>
              
              <div className="space-y-4 text-xs">
                
                {/* 1. Eğitim Hakkında */}
                <div className="border border-zinc-150 rounded-2xl p-4 space-y-2">
                  <h4 className="font-extrabold text-zinc-900 text-sm">📖 Eğitim Hakkında</h4>
                  <p className="text-zinc-650 leading-relaxed font-semibold">
                    {course.category === 'Yazılım' || course.title.toLowerCase().includes('python') ? (
                      "Sıfırdan başlayarak Python programlamayı ileri seviyede öğrenin. Gerçek projelerle pekiştirin. Python programlama dilinin temel sözdiziminden başlayarak veri yapıları, nesne yönelimli programlama ve modüler geliştirme gibi kilit konuları derinlemesine öğrenin. Bu kapsamlı eğitimde modern geliştirme araçlarını kullanmayı, veritabanı bağlantılarını ve gelişmiş kütüphaneler ile veri işlemeyi uygulamalı olarak deneyimleyeceksiniz. Profesyonel projelerle portföyünüzü güçlendirerek sektörde öne çıkın."
                    ) : (
                      `Sıfırdan başlayarak ${course.title} konusunu en ileri seviyede öğrenin. Gerçek hayattan projelerle bilginizi pekiştirip portföyünüzü hazırlayın. Sektör deneyimli eğitmenlerimiz rehberliğinde gerçekleştirilen eğitimler vizyon kazanmanızı, kendi teknolojik girişimlerinizi başlatmanızı veya global firmalarda uzaktan çalışma fırsatları bulmanızı hedefler.`
                    )}
                  </p>
                </div>

                {/* 2. Tahmini Ders Saati */}
                <div className="border border-zinc-150 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#FAF9F5]">
                  <div>
                    <h4 className="font-extrabold text-zinc-900 text-sm flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#FF6600] shrink-0" />
                      Tahmini Ders Saati
                    </h4>
                    <p className="text-[11px] text-zinc-500 font-bold mt-1">
                      *Eğitmenlere göre değişim sağlayabilmektedir.
                    </p>
                  </div>
                  <span className="text-sm font-black font-mono text-[#FF6600] bg-white border border-zinc-200 px-4 py-2.5 rounded-xl shrink-0">
                    85 Saat
                  </span>
                </div>

                {/* 3. Neden Almalısınız? */}
                <div className="border border-zinc-150 rounded-2xl p-4 space-y-2">
                  <h4 className="font-extrabold text-zinc-900 text-sm">🤔 Neden Almalısınız?</h4>
                  <p className="text-zinc-650 leading-relaxed font-semibold">
                    {course.category === 'Yazılım' || course.title.toLowerCase().includes('python') ? (
                      "En popüler programlama dili olan Python ile kariyer fırsatlarınızı artırın."
                    ) : (
                      `${course.title} alanında kendinizi geliştirerek pazardaki en güncel ve kazançlı iş kollarında kariyerinizi taçlandırın.`
                    )}
                  </p>
                </div>

                {/* 4. İstihdam Alanları */}
                <div className="border border-zinc-150 rounded-2xl p-4 space-y-2">
                  <h4 className="font-extrabold text-zinc-900 text-sm">💼 İstihdam Alanları</h4>
                  <p className="text-zinc-650 leading-relaxed font-bold">
                    {course.category === 'Yazılım' || course.title.toLowerCase().includes('python') ? (
                      "Yazılım geliştirici, veri analisti, yapay zeka mühendisi."
                    ) : (
                      "Sektör Danışmanı, Freelance Proje Geliştiricisi, Bilişim Eğitmeni, Çözüm Geliştirici"
                    )}
                  </p>
                </div>

                {/* 5. Gereksinimler */}
                <div className="border border-zinc-150 rounded-2xl p-4 space-y-2 bg-[#FAF9F5]/30">
                  <h4 className="font-extrabold text-zinc-900 text-sm">🎯 Gereksinimler</h4>
                  <p className="text-zinc-650 font-bold leading-relaxed text-[#8C3F03] bg-amber-50 p-3 rounded-xl border border-amber-100/60">
                    Temel bilgisayar bilgisi yeterlidir.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: THE PURCHASE CARD SIDEBAR */}
          <div className="lg:col-span-4 sticky top-6">
            <div className="bg-white border border-zinc-250/60 rounded-3xl p-6 shadow-md flex flex-col gap-6">
              
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">KURS SEPET KARTI</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-zinc-950 font-mono">₺{course.price.toLocaleString('tr-TR')}</span>
                  <span className="text-xs text-zinc-400 line-through">₺{(course.price * 1.4).toLocaleString('tr-TR')}</span>
                </div>
                <span className="text-[10px] text-red-600 font-bold block mt-1.5">⏰ Sınırlı Fiyat Sezonu (Bağımsız Satıcı Komisyonsuz)</span>
              </div>

              {/* Action buttons */}
              {isEnrolled ? (
                <div className="flex flex-col gap-2">
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold p-3 rounded-xl text-center">
                    ✓ Bu Kursa Zaten Kayıtlısınız
                  </div>
                  <button
                    onClick={() => onNavigateTo('video')}
                    className="w-full bg-[#FF6600] hover:bg-[#CC5200] text-white text-xs font-bold py-3.5 rounded-xl transition duration-150 flex items-center justify-center gap-1.5"
                  >
                    Ders Çalışmaya Başla <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onEnroll(course.id)}
                  className="w-full bg-[#FF6600] hover:bg-[#CC5200] text-white text-xs font-bold py-3.5 rounded-xl transition duration-150 flex items-center justify-center gap-1.5 shadow-sm hover:scale-102 active:scale-98"
                >
                  Hemen Satın Al / Sepete Ekle <ShoppingCart className="w-4 h-4 shrink-0" />
                </button>
              )}

              {/* Premium packet mention */}
              {course.isPremiumIncluded && (
                <div className="bg-amber-50/60 border border-amber-200 p-3.5 rounded-2xl flex items-start gap-2 text-[10px] leading-relaxed text-[#7E5E3D]">
                  <Sparkles className="w-4 h-4 text-[#FF6600] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-955 block font-bold mb-0.5">Premium Üyeliğe Dahil Kurs!</strong>
                    Eğer aylık Premium Pakete üyeyseniz bu kurs için ayrıca bir sepet ücreti ödemezsiniz!
                  </div>
                </div>
              )}

              {/* Details table */}
              <div className="space-y-3.5 border-t border-zinc-100 pt-5">
                <div className="flex justify-between text-xs text-zinc-650">
                  <span className="font-medium text-zinc-400">Dosya/Not Paylaşımı:</span>
                  <span className="font-bold text-zinc-800">Sınırsız PDF/Kod</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-650">
                  <span className="font-medium text-zinc-400">Erişim Türü:</span>
                  <span className="font-bold text-zinc-800">Ömür Boyu Güncelleme</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-650">
                  <span className="font-medium text-zinc-400">Sertifika:</span>
                  <span className="font-bold text-zinc-800">QR / Doğrulama Kodu</span>
                </div>
              </div>

              {/* SOCIAL MEDIA SHARE COMPONENT */}
              <div className="border-t border-zinc-100 pt-4">
                <ShareButtons title={course.title} type="ders" />
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* INSTRUCTOR DETAIL MODAL */}
      {selectedInstructorProfile && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-200 text-left">
            
            {/* Header / Avatar Banner */}
            <div className="bg-[#FAF9F5] p-6 border-b border-zinc-150 relative">
              <button 
                type="button"
                onClick={() => setSelectedInstructorProfile(null)}
                className="absolute top-4 right-4 bg-white/85 hover:bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-800 p-1.5 rounded-full transition shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4">
                <img 
                  src={selectedInstructorProfile.avatar?.includes('ui-avatars.com') && !selectedInstructorProfile.avatar.includes('size=') ? selectedInstructorProfile.avatar + '&size=256' : selectedInstructorProfile.avatar} 
                  alt={selectedInstructorProfile.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#FF6600] shrink-0" 
                />
                <div>
                  <span className="text-[9px] bg-[#FF6600]/10 text-[#FF6600] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                    AKADEMİ EĞİTMENİ
                  </span>
                  <h3 className="text-base font-black text-zinc-950 mt-1">{selectedInstructorProfile.name}</h3>
                  <p className="text-xs text-zinc-500 font-semibold">{selectedInstructorProfile.title}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div>
                <h4 className="font-extrabold text-[#FF6600] uppercase tracking-wider text-[10px] mb-1.5 text-zinc-400">ÖZGEÇMİŞ / BİYOGRAFİ</h4>
                <p className="text-zinc-650 leading-relaxed font-semibold">
                  {selectedInstructorProfile.bio}
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-[#FF6600] uppercase tracking-wider text-[10px] mb-2 text-zinc-400">UZMANLIK ALANLARI</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedInstructorProfile.specialties || selectedInstructorProfile.tags || []).map((spec: string) => (
                    <span key={spec} className="bg-zinc-100 text-zinc-700 font-extrabold px-2.5 py-1 rounded-xl border border-zinc-250">
                      #{spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-150">
                <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-zinc-150 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase leading-none">Eğitmen Skoru</span>
                  <div className="flex items-center justify-center gap-1 mt-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-lg font-black font-mono text-zinc-900">{selectedInstructorProfile.rating}</span>
                  </div>
                </div>
                <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-zinc-150 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase leading-none">Toplam Değerlendirme</span>
                  <span className="text-lg font-black font-mono text-zinc-900 mt-1.5 block">
                    {selectedInstructorProfile.reviewCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-150 flex justify-end gap-2">
              <button 
                type="button"
                onClick={() => setSelectedInstructorProfile(null)}
                className="bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 border border-zinc-200 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Kapat
              </button>
              <button 
                type="button"
                onClick={() => {
                  alert(`🎉 ${selectedInstructorProfile.name} eşliğinde ${course.title} eğitimine kaydoluyorsunuz! Tebrikler!`);
                  onEnroll(course.id);
                  setSelectedInstructorProfile(null);
                }}
                className="bg-red-650 hover:bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-xs"
              >
                Eğitim Al
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
