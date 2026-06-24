import { useState } from 'react';
import { 
  Search, Code2, BrainCircuit, Figma, Languages, Cloud, Sparkles, 
  ArrowRight, Users, Award, Play, CheckCircle2, ChevronRight,
  Plus, GraduationCap, Building2, X, ShieldCheck, Trophy, ArrowUpRight
} from 'lucide-react';
import { Course, Category } from '../types';

interface HomeViewProps {
  courses: Course[];
  categories: Category[];
  onSelectCourse: (course: Course) => void;
  onNavigateTo: (page: string) => void;
  isLoggedIn: boolean;
  onSelectCategory: (categoryName: string) => void;
}

export default function HomeView({ 
  courses, 
  categories, 
  onSelectCourse, 
  onNavigateTo, 
  isLoggedIn,
  onSelectCategory
}: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  const showHeroBannerSetting = localStorage.getItem('showHeroBannerSetting') !== 'false';
  const showSearchBarsSetting = localStorage.getItem('showSearchBarsSetting') !== 'false';
  const showChallengeSetting = localStorage.getItem('showChallengeSetting') !== 'false';
  const showCertificateSetting = localStorage.getItem('showCertificateSetting') !== 'false';

  // Guided skill representation for "Fark" when user types "yazılım" or related keywords
  const isDeveloperRelated = searchQuery.toLowerCase().includes('yaz') || searchQuery.toLowerCase().includes('kod') || searchQuery.toLowerCase().includes('dev');
  const isAiRelated = searchQuery.toLowerCase().includes('yap') || searchQuery.toLowerCase().includes('ai') || searchQuery.toLowerCase().includes('gem');

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-zinc-900 font-sans antialiased">
      
      {/* 1. Şerit Zemin (Türkiye'nin Komisyonsuz İlk Eğitim Pazaryeri) */}
      <div className="bg-white text-zinc-950 py-5 border-b border-zinc-250 shadow-xs relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Yanıp sönen kırmızı nokta */}
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-650 bg-red-600"></span>
            </span>
            <span className="text-base sm:text-lg font-black tracking-widest font-display text-zinc-950 uppercase">
              TÜRKİYE'NİN KOMİSYONSUZ İLK EĞİTİM PAZARYERİ
            </span>
          </div>
          <p className="text-xs text-zinc-600 font-mono font-extrabold text-red-650 animate-pulse">
            (*Kredi Kartı Komisyonları Hariçtir.)
          </p>
        </div>
      </div>

      {/* 2. Üç Eşit Büyüklükte ve Farklı Renklerde Kartlar */}
      <div className="bg-zinc-900/95 py-10 border-b border-zinc-850 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Kart 1: Zemin Koyu Pembe (Preply renkleri esintili) */}
            <div className="bg-[#E01A4F] text-white p-7 sm:p-8 rounded-3xl shadow-lg border border-rose-700/20 flex flex-col justify-between min-h-[310px] transition duration-200 hover:scale-[1.01] hover:shadow-2xl relative overflow-hidden group">
              <div className="absolute top-1/2 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-4 -translate-y-4" />
              <div>
                <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider block w-fit mb-4">
                  BİREBİR ÖZEL EĞİTİM
                </span>
                <h3 className="text-2xl font-black font-display mb-2 text-white">
                  Özel Öğretmen Bul
                </h3>
                <p className="text-[12px] sm:text-xs font-semibold text-rose-50 leading-relaxed">
                  Özel ders veren öğretmenlerin özgeçmişlerini ve tecrübelerini detaylıca inceleyip seçiminizi yapın ve hemen anlaşın. İster yüz yüze ister uzaktan online olarak eğitim alın! Ekonomik olmasını tercih ederseniz kendi arkadaş grubunuzu kurarak eğitim ücretini hemen düşürebilirsiniz.
                </p>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2">
                <button 
                  onClick={() => {
                    onSelectCategory('Yazılım');
                    onNavigateTo('katalog');
                  }}
                  className="bg-white hover:bg-zinc-100 text-[#E01A4F] font-black text-xs py-3 px-4 rounded-xl transition shadow-xs"
                >
                  Öğretmen Ara
                </button>
                <button 
                  onClick={() => onNavigateTo('egitmen')}
                  className="bg-zinc-950 hover:bg-zinc-900 text-white font-black text-xs py-3 px-4 rounded-xl transition shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E01A4F]" />
                  <GraduationCap className="w-3.5 h-3.5 text-white" />
                  Öğretmen Misin? Kaydol
                </button>
              </div>
            </div>

            {/* Kart 2: Zemin Hardal */}
            <div className="bg-[#D97706] text-white p-7 sm:p-8 rounded-3xl shadow-lg border border-amber-800/20 flex flex-col justify-between min-h-[310px] transition duration-200 hover:scale-[1.01] hover:shadow-2xl relative overflow-hidden group">
              <div className="absolute top-1/2 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-4 -translate-y-4" />
              <div>
                <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider block w-fit mb-4">
                  ÖZEL KURUMLAR
                </span>
                <h3 className="text-2xl font-black font-display mb-2 text-white">
                  Özel Okul Ara
                </h3>
                <p className="text-[12px] sm:text-xs font-semibold text-amber-50 leading-relaxed">
                  Anaokulu, ilkokul ve lise düzeyindeki özel okulların konumlarını, kapasitelerini, akademik öğretmen kadrolarını, sunulan tüm hizmetleri, ders saatlerini, okul giriş-çıkış programlarını ve detaylı veli yorumlarını inceleyip kıyaslayın.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button 
                  onClick={() => {
                    onSelectCategory('Genel');
                    onNavigateTo('katalog');
                  }}
                  className="bg-white hover:bg-zinc-100 text-[#D97706] font-black text-xs py-3 px-4 rounded-xl transition shadow-xs"
                >
                  Okul Bul
                </button>
                <button 
                  onClick={() => onNavigateTo('kurumsal')}
                  className="bg-zinc-950 hover:bg-zinc-900 text-white font-black text-xs py-3 px-4 rounded-xl transition shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D97706]" />
                  <Building2 className="w-3.5 h-3.5 text-white" />
                  Okulunu Kaydet
                </button>
              </div>
            </div>

            {/* Kart 3: Zemin Fosforlu Yeşil (Yüksek kontrast için siyah yazı) */}
            <div className="bg-[#39FF14] text-zinc-950 p-7 sm:p-8 rounded-3xl shadow-lg border border-lime-500/20 flex flex-col justify-between min-h-[310px] transition duration-200 hover:scale-[1.01] hover:shadow-2xl relative overflow-hidden group">
              <div className="absolute top-1/2 right-0 w-24 h-24 bg-zinc-950/5 rounded-full translate-x-4 -translate-y-4" />
              <div>
                <span className="text-[10px] bg-zinc-950/10 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider block w-fit mb-4 text-zinc-900">
                  ÖZEL KURSLAR
                </span>
                <h3 className="text-2xl font-black font-display mb-2 text-zinc-950">
                  Kurs Ara
                </h3>
                <p className="text-[12px] sm:text-xs font-extrabold text-zinc-900 leading-relaxed">
                  Liseye geçiş (LGS), üniversiteye hazırlık (YKS), yetenek sınavları, özel eğitim kurumları ya da sürücü kursları. Kurumların konumlarını, kapasitelerini, uzman kadrolarını, verilen dersleri, ders saatlerini ve veli yorumlarını kolayca inceleyin ve kıyaslayın.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button 
                  onClick={() => {
                    onSelectCategory('Tasarım');
                    onNavigateTo('katalog');
                  }}
                  className="bg-white hover:bg-zinc-100 text-zinc-900 font-black text-xs py-3 px-4 rounded-xl transition shadow-xs"
                >
                  Kurs Bul
                </button>
                <button 
                  onClick={() => onNavigateTo('kurumsal')}
                  className="bg-zinc-950 hover:bg-zinc-900 text-white font-black text-xs py-3 px-4 rounded-xl transition shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#39FF14]" />
                  <Building2 className="w-3.5 h-3.5 text-white" />
                  Kursunu Kaydet
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. "Challenge'a Var Mısın?!" Çarpıcı Banner Alanı */}
      {showChallengeSetting && (
        <div className="bg-zinc-950 text-white border-b border-indigo-950/60 relative overflow-hidden group">
          {/* Futuristic background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          {/* Glowing visual backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-400 mb-6 uppercase tracking-widest animate-pulse">
              <span className="w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
              🏆 Challenge Arena
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 font-display leading-[1.15] text-white">
              Challenge'a <span className="bg-gradient-to-r from-pink-500 via-[#39FF14] to-cyan-400 bg-clip-text text-transparent italic">Var Mısın?!</span>
            </h2>
            
            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto mb-8 font-semibold leading-relaxed">
              ⚔️ Kapışma Zamanı; Yeteneğini kanıtla, liderlik tablosunda yüksel, sponsor firmaların özel ödüllerini kazan. Kapılar sana açılıyor.
            </p>

            <div className="flex justify-center items-center">
              <button
                onClick={() => onNavigateTo('challenges')}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black text-sm px-10 py-4.5 rounded-full transition duration-200 transform hover:scale-[1.02] shadow-xl shadow-red-600/20 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Trophy className="w-5 h-5 text-white animate-bounce" />
                Detaylı Tanıtım Sayfasını İncele &amp; Katıl
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic HERO SECTION */}
      {showHeroBannerSetting && (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F2ECE0]/50 to-[#FAF9F5] pt-14 pb-20 border-b border-zinc-200/60">
          <div className="absolute inset-0 bg-[radial-gradient(#FF6600_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            {/* Tagline */}
            <span className="inline-flex items-center gap-1.5 bg-amber-100/70 border border-amber-200/60 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#8C3F03] mb-6 animate-fade-in animate-pulse">
              <Sparkles className="w-4 h-4 text-[#FF6600] shrink-0" />
              Eğitmen Komisyonu Yok. Sınırsız Sektörel Yetkinlik Burada.
            </span>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-zinc-950 max-w-4xl mx-auto leading-[1.12] mb-6">
              Eğitmen Komisyonu Yok. <br/>
              <span className="text-[#FF6600] underline decoration-wavy decoration-amber-300 underline-offset-6 font-display">Sınırsız Sektörel Yetkinlik</span> Burada.
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Gelirin %100'ü doğrudan doğrulanmış eğitmene aktarılır. Canlı kilitli kohort dersleri, capstone projeleri ve sertifika kanıtları ile yeni kariyerinizi başlatın.
            </p>

            {/* Interactive Guided Search Bar ("FARK" implementation) */}
            {showSearchBarsSetting && (
              <div className="max-w-2xl mx-auto mb-12">
                <div className="bg-white p-2 rounded-2xl border border-zinc-200/80 shadow-md focus-within:ring-2 focus-within:ring-[#FF6600] flex items-center gap-2 transition duration-200">
                  <div className="pl-3 text-zinc-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input 
                    type="text"
                    value={searchQuery}
                    onFocus={() => setShowGuide(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Gitar mı? Matematik mi? Flutter mı arıyorsun? PHP mi?"
                    className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-sm py-2.5 text-zinc-800 placeholder-zinc-400"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-zinc-405 hover:text-zinc-650 px-2 font-semibold"
                    >
                      Sıfırla
                    </button>
                  )}
                  <button 
                    onClick={() => onNavigateTo('katalog')}
                    className="bg-[#FF6600] hover:bg-[#CC5200] text-white px-5 py-3 rounded-xl text-xs font-bold transition duration-150 shrink-0 shadow-sm"
                  >
                    Keşfet
                  </button>
                </div>

                {/* Smart guidance system (AI suggestions based on "yazılım" / "ai" / empty query triggers) */}
                {showGuide && (
                  <div className="mt-4 text-left bg-white border border-zinc-205 rounded-2xl p-5 shadow-lg max-w-2xl mx-auto transition-all animate-slide-up">
                    
                    {isDeveloperRelated ? (
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#FF6600] mb-2 flex items-center gap-1">
                          <Code2 className="w-4 h-4" /> Yazılım Sektörü Rehberi (En İstenen 5 Yetkinlik)
                        </h4>
                        <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
                          Sistemimizdeki yazılım iş ortaklarından toplanan anlık raporlara göre, bir geliştiricide en çok aranan 5 ana başlık:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <span className="text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 font-medium">
                            ✦ React 19 &amp; Server Components Uzmanlığı
                          </span>
                          <span className="text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 font-medium">
                            ✦ Dockerized Deployment &amp; Edge Middleware
                          </span>
                          <span className="text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 font-medium">
                            ✦ TypeScript Strict Mode Uyumluluğu
                          </span>
                          <span className="text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 font-medium">
                            ✦ İlişkisel SQL ve Drizzle/Prisma ORM
                          </span>
                          <span className="text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 font-medium col-span-1 sm:col-span-2">
                            ✦ API Güvenliği (JWT, CSRF korumaları ve rate-limiting)
                          </span>
                        </div>
                      </div>
                    ) : isAiRelated ? (
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-amber-800 mb-2 flex items-center gap-1">
                          <BrainCircuit className="w-4 h-4 text-[#FF6600]" /> Yapay Zeka Sektörü Rehberi (En Popüler Araçlar)
                        </h4>
                        <p className="text-xs text-zinc-500 mb-2">
                          RAG mimarileri ve Prompt mühendisliği şu anda şirketlerin en çok bütçe ayırdığı alanlardandır:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1.5 rounded-md font-medium">Vector DBs (Pinecone, pgvector)</span>
                          <span className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1.5 rounded-md font-medium">Gemini 2.5 &amp; Claude 3.5 API</span>
                          <span className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1.5 rounded-md font-medium">LangChain &amp; CrewAI Ajanları</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 mb-2.5">
                          <span className="text-[11px] font-black tracking-widest text-zinc-400 uppercase">Önerilen Arama Terimleri</span>
                          <span className="text-[10px] text-zinc-400">İpucu: "Yazılım" yazarak canlı yetkinlik raporunu görün!</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['Next.js', 'Figma Variables', 'RAG Yapay Zeka', 'Siber Güvenlik', 'Python'].map(keyword => (
                            <button 
                              key={keyword}
                              onClick={() => setSearchQuery(keyword)}
                              className="text-xs bg-zinc-100 hover:bg-[#FF6600] hover:text-white text-zinc-700 px-3 py-1.5 rounded-xl transition duration-150 border border-zinc-200/50"
                            >
                              {keyword}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                  </div>
                )}
              </div>
            )}

            {/* Social Proof Success Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto border-t border-zinc-200/70 pt-8">
              <div className="p-3 bg-white/40 border border-zinc-200/50 rounded-2xl">
                <span className="text-3xl font-extrabold text-[#FF6600] font-mono block">1,500+</span>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Doğrulanmış Eğitmen</span>
              </div>
              <div className="p-3 bg-white/40 border border-zinc-200/50 rounded-2xl">
                <span className="text-3xl font-extrabold text-zinc-950 font-mono block">8,000+</span>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Mezun Öğrenci</span>
              </div>
              <div className="p-3 bg-white/40 border border-zinc-200/50 rounded-2xl">
                <span className="text-3xl font-extrabold text-zinc-950 font-mono block">%0</span>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Platform Komisyonu</span>
              </div>
              <div className="p-3 bg-white/40 border border-zinc-200/50 rounded-2xl">
                <span className="text-3xl font-extrabold text-[#FF6600] font-mono block">%92</span>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Kurs Tamamlama</span>
              </div>
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
