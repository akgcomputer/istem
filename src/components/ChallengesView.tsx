import React, { useState, useEffect, FormEvent } from 'react';
import { 
  Trophy, Target, Play, Calendar, Users, Eye, ArrowDown, HelpCircle, 
  ChevronDown, ChevronUp, Plus, Code, Palette, Dumbbell, Music, 
  MessageSquare, GraduationCap, Briefcase, Utensils, Gamepad2, 
  FlaskConical, Sparkles, Send, Activity, Share2, Heart, MessageCircle, 
  AlertTriangle, ArrowRight, UserCheck, Check, UploadCloud, X, ArrowUpRight
} from 'lucide-react';

interface Challenge {
  id: string;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  title: string;
  timeLeft: { hours: number; minutes: number; seconds: number };
  participants: number;
  prizePool: string;
  prizeDetail: string;
  rules: string;
  platformAllowed: string[];
  owner: string;
  hashtag: string;
  feed: Array<{
    id: string;
    userName: string;
    userAvatar: string;
    submittedLink: string;
    embedTitle: string;
    likes: number;
    hasLiked?: boolean;
    comments: Array<{ author: string; text: string }>;
    submittedAt: string;
  }>;
}

export default function ChallengesView() {
  // Current tab or scroll state triggers
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [isInstructorSim, setIsInstructorSim] = useState<boolean>(true); // For testing Challenge Launch wizard

  // Modals & Wizard state
  const [showLaunchWizard, setShowLaunchWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [showJoinModal, setShowJoinModal] = useState<Challenge | null>(null);
  const [showFeedModal, setShowFeedModal] = useState<Challenge | null>(null);

  // States for Accordion (FAQ)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Submission State inside Join Modal
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('GitHub');

  // Dynamic state for New Challenge wizard
  const [newChallengeForm, setNewChallengeForm] = useState({
    title: '',
    category: 'Yazılım & Teknoloji',
    description: '',
    rules: '',
    durationDays: 3,
    maxParticipants: 'Sınırsız',
    platformAllowed: ['GitHub', 'YouTube'],
    rewards: {
      first: '10.000 TL + Özel Plaket',
      second: '5.000 TL + Mentorluk Seansı',
      third: '3.000 TL',
      popChoice: 'Sponsor Firmada Staj Görüşmesi + Özel Rozet'
    },
    sponsorName: '',
    sponsorLogo: ''
  });

  // Mock initial challenge database in state for interactive simulation
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'ch-1',
      category: 'Yazılım & Teknoloji',
      categoryIcon: '💻',
      categoryColor: '#38BDF8',
      title: '48 Saatlik API Tasarım Maratonu',
      timeLeft: { hours: 14, minutes: 22, seconds: 59 },
      participants: 234,
      prizePool: '20.000 TL + Mentorluk',
      prizeDetail: '🥇 Birincilik: 12.000 TL + Sponsor Ödülü | 🥈 İkincilik: 5.000 TL | 🥉 Üçüncülük: 3.000 TL',
      rules: 'Tasarlanan API en az 3 farklı servisi (örneğin hava durumu, ödeme, harita) entegre etmelidir. Kod standartları, dökümantasyon kalitesi (Swagger/Postman) ve yanıt hızı (%99 uptime) esastır. Proje açık kaynak olarak GitHub\'da teslim edilmelidir.',
      platformAllowed: ['GitHub', 'GitLab'],
      owner: 'İSTEM Akademi & Trendyol Sponsorluğu',
      hashtag: '#API-Maratonu',
      feed: [
        {
          id: 'sub-1-1',
          userName: 'Canberk Özcan',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          submittedLink: 'https://github.com/canberkoz/nexus-unified-api',
          embedTitle: 'Nexus Unified Commerce API Gateway',
          likes: 42,
          hasLiked: false,
          comments: [
            { author: 'Erdem Şen', text: 'Özellikle Redis caching katmanı çok temiz kurgulanmış.' },
            { author: 'Selin Yılmaz', text: 'API response süreleri harika görünüyor, başarılar.' }
          ],
          submittedAt: '3 saat önce'
        },
        {
          id: 'sub-1-2',
          userName: 'Zehra Polat',
          userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
          submittedLink: 'https://github.com/zehrap/geo-analytics-pipeline',
          embedTitle: 'Geo-Location Analytics Core API Engine',
          likes: 38,
          hasLiked: false,
          comments: [
            { author: 'Hasan Kaya', text: 'PostgreSQL GIS uzantılarını entegre etmen çok akıllıca.' }
          ],
          submittedAt: '5 saat önce'
        }
      ]
    },
    {
      id: 'ch-2',
      category: 'Spor & Fitness',
      categoryIcon: '🏃',
      categoryColor: '#FF6B35',
      title: '10K Haftalık Koşu ve Dayanıklılık Yarışı',
      timeLeft: { hours: 41, minutes: 0, seconds: 0 },
      participants: 189,
      prizePool: 'Özel Ekipman Seti + Premium Üyelik',
      prizeDetail: '🥇 Birincilik: Garmin Koşu Saati | 🥈 İkincilik: Nike Air Zoom Run Ayakkabı | 🥉 Üçüncülük: 6 Aylık Spor Salonu Üyeliği',
      rules: 'Yarış süresince en az bir kez aralıksız 10 KM düz koşu gerçekleştirilmelidir. Koşu aktivitesi resmi Strava hesabı üzerinden kaydedilerek platformumuzdaki Strava entegrasyonu ile doğrulanmalıdır.',
      platformAllowed: ['Strava', 'Adidas Running', 'Nike Run Club'],
      owner: 'MacFit & Decathlon',
      hashtag: '#10K-MacFit',
      feed: [
        {
          id: 'sub-2-1',
          userName: 'Murat Arslan',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
          submittedLink: 'https://strava.app.link/run/muratarslan-10k-record-run',
          embedTitle: 'Belgrad Ormanı 10.2K Sabah Koşusu - 44 dk 12 sn',
          likes: 56,
          hasLiked: false,
          comments: [
            { author: 'Ebru Tan', text: 'Harika bir tempo! 4:20 pace korumuşsunuz, inanılmaz.' }
          ],
          submittedAt: '1 gün önce'
        }
      ]
    },
    {
      id: 'ch-3',
      category: 'Tasarım & Sanat',
      categoryIcon: '🎨',
      categoryColor: '#8B5CF6',
      title: 'Yenilikçi Kripto Cüzdan Mobil UI/UX Tasarımı',
      timeLeft: { hours: 68, minutes: 12, seconds: 0 },
      participants: 312,
      prizePool: 'Wacom Grafik Tablet + Figma Pro',
      prizeDetail: '🥇 Birincilik: Wacom Intuos Pro Tablet | 🥈 İkincilik: 1 Yıllık Bireysel Figma Pro Lisansı | 🥉 Üçüncülük: Özel Portfolyo İnceleme Oturumu',
      rules: 'Kripto dünyasına yeni giren kullanıcılar için onboarding, cüzdan transfer ve NFT galerisi ekranlarından oluşan en az 5 sayfalık bir interaktif mobil prototip tasarlanmalıdır. Çalışma Figma Linki olarak paylaşılmalıdır.',
      platformAllowed: ['Figma', 'Behance'],
      owner: 'Paribu Tech Hub',
      hashtag: '#UI-Wallet-Design',
      feed: [
        {
          id: 'sub-3-1',
          userName: 'Zeynep Kaya',
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
          submittedLink: 'https://figma.com/file/zeynep-crypto-wallet-design-challenge',
          embedTitle: 'Aura Wallet - Seamless Web3 Gateway Prototype',
          likes: 95,
          hasLiked: false,
          comments: [
            { author: 'Murat Kara', text: 'Renk paleti ve mikro etkileşimler çok yenilikçi olmuş, eline sağlık.' },
            { author: 'Ceren Ay', text: 'Bunu kesinlikle telefonumda kullanmak isterdim, mükemmel!' }
          ],
          submittedAt: '2 gün önce'
        }
      ]
    }
  ]);

  // Live seconds countdown simulation ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setChallenges(prev => 
        prev.map(ch => {
          let s = ch.timeLeft.seconds - 1;
          let m = ch.timeLeft.minutes;
          let h = ch.timeLeft.hours;
          if (s < 0) {
            s = 59;
            m -= 1;
            if (m < 0) {
              m = 59;
              h -= 1;
            }
          }
          if (h < 0) {
            h = 0; m = 0; s = 0;
          }
          return {
            ...ch,
            timeLeft: { hours: h, minutes: m, seconds: s }
          };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle Like submission
  const handleLikeSubmission = (challengeId: string, subId: string) => {
    setChallenges(prev => 
      prev.map(ch => {
        if (ch.id === challengeId) {
          return {
            ...ch,
            feed: ch.feed.map(sub => {
              if (sub.id === subId) {
                const liked = !sub.hasLiked;
                return {
                  ...sub,
                  hasLiked: liked,
                  likes: liked ? sub.likes + 1 : sub.likes - 1
                };
              }
              return sub;
            })
          };
        }
        return ch;
      })
    );
  };

  // Handle comment submit
  const [commentTextState, setCommentTextState] = useState<{ [subId: string]: string }>({});
  const handleAddComment = (challengeId: string, subId: string) => {
    const text = commentTextState[subId] || '';
    if (!text.trim()) return;

    setChallenges(prev => 
      prev.map(ch => {
        if (ch.id === challengeId) {
          return {
            ...ch,
            feed: ch.feed.map(sub => {
              if (sub.id === subId) {
                return {
                  ...sub,
                  comments: [...sub.comments, { author: 'Siz (Öğrenci)', text: text.trim() }]
                };
              }
              return sub;
            })
          };
        }
        return ch;
      })
    );

    setCommentTextState(prev => ({ ...prev, [subId]: '' }));
  };

  // Submit link simulation
  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionLink.trim()) return;

    if (showJoinModal) {
      const challengeId = showJoinModal.id;
      const newSubmission = {
        id: `sub-${challengeId}-${Date.now()}`,
        userName: 'Siz (Eğitimci Adayı)',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        submittedLink: submissionLink,
        embedTitle: `Bağlantı Doğrulandı: İstanbul Eğitim Pazaryeri üzerinden ${selectedPlatform} teslimatı`,
        likes: 1,
        comments: [],
        submittedAt: 'Şimdi gönderildi'
      };

      setChallenges(prev => 
        prev.map(ch => {
          if (ch.id === challengeId) {
            return {
              ...ch,
              participants: ch.participants + 1,
              feed: [newSubmission, ...ch.feed]
            };
          }
          return ch;
        })
      );

      setSubmissionSuccess(true);
      setTimeout(() => {
        setSubmissionSuccess(false);
        setSubmissionLink('');
        setShowJoinModal(null);
      }, 2500);
    }
  };

  // Complete wizard
  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const createdChallenge: Challenge = {
      id: `ch-${Date.now()}`,
      category: newChallengeForm.category,
      categoryIcon: newChallengeForm.category === 'Yazılım & Teknoloji' ? '💻' 
                  : newChallengeForm.category === 'Tasarım & Sanat' ? '🎨'
                  : newChallengeForm.category === 'Spor & Fitness' ? '🏃'
                  : newChallengeForm.category === 'Müzik & Ses' ? '🎵'
                  : newChallengeForm.category === 'Dil & Akademik' ? '🗣️'
                  : newChallengeForm.category === 'Okul Dersleri & Sınav' ? '📚' : '🎖️',
      categoryColor: '#38BDF8',
      title: newChallengeForm.title || 'Haftalık Yenilikçi Çözüm Yarışı',
      timeLeft: { hours: newChallengeForm.durationDays * 24, minutes: 0, seconds: 0 },
      participants: 1,
      prizePool: newChallengeForm.rewards.first,
      prizeDetail: `🥇 1.lik: ${newChallengeForm.rewards.first} | 🥈 2.lik: ${newChallengeForm.rewards.second} | 🥉 3.lük: ${newChallengeForm.rewards.third}`,
      rules: newChallengeForm.rules || 'Kendine has özgün yaklaşım getirilmelidir. Herhangi bir hazır şablon kullanılması durumunda diskalifiye uygulanacaktır.',
      platformAllowed: newChallengeForm.platformAllowed,
      owner: newChallengeForm.sponsorName || 'İSTEM Eğitmeni',
      hashtag: `#${(newChallengeForm.title || 'challenge').toLowerCase().replace(/\s+/g, '-')}`,
      feed: []
    };

    setChallenges([createdChallenge, ...challenges]);
    setShowLaunchWizard(false);
    setWizardStep(1);
    alert('🎉 Tebrikler! İSTEM Challenge turnuvası başarıyla oluşturuldu ve davet bağlantınız yayınlandı.');
  };

  // Categories definition
  const CATEGORIES_LIST = [
    { name: 'Yazılım & Teknoloji', icon: '💻', desc: 'Kod maratonları, algoritma kapışmaları, hackathon’lar, açık kaynak projeleri.', accent: 'border-cyan-500/20 text-[#38BDF8] hover:border-cyan-400' },
    { name: 'Tasarım & Sanat', icon: '🎨', desc: 'UI/UX, logo, illüstrasyon, video kurgu, fotoğraf yarışmaları.', accent: 'border-purple-500/20 text-[#8B5CF6] hover:border-purple-400' },
    { name: 'Spor & Fitness', icon: '🏃', desc: 'Koşu, bisiklet, fitness challenge’ları (Strava entegrasyonu).', accent: 'border-orange-500/20 text-[#FF6B35] hover:border-orange-400' },
    { name: 'Müzik & Ses', icon: '🎵', desc: 'Enstrüman performansları, cover yorumları, beste yarışmaları.', accent: 'border-pink-500/20 text-pink-400 hover:border-pink-300' },
    { name: 'Dil & Akademik', icon: '🗣️', desc: 'Yabancı dil konuşma, ikna etme, yazma, çeviri, okuma maratonları.', accent: 'border-emerald-500/20 text-emerald-400 hover:border-emerald-300' },
    { name: 'Okul Dersleri & Sınav', icon: '📚', desc: 'LGS, YKS, yazılı soruları çözüm maratonları, proje ödevleri.', accent: 'border-yellow-500/20 text-yellow-400 hover:border-yellow-300' },
    { name: 'İşletme & Girişimcilik', icon: '💼', desc: 'İş planı yarışmaları, pazarlama stratejileri, girişim fikirleri.', accent: 'border-indigo-500/20 text-indigo-400 hover:border-indigo-350' },
    { name: 'Yemek & Mutfak', icon: '🍳', desc: 'Yemek tarifi yarışmaları, sunum, fotoğrafçılık, mutfak sanatları.', accent: 'border-red-500/20 text-red-400 hover:border-red-300' },
    { name: 'Eğlence & Oyun', icon: '🎮', desc: 'Video oyunu tasarımı, oyun içi yetenekler, e-spor, yaratıcı oyun fikirleri.', accent: 'border-teal-500/20 text-teal-400 hover:border-teal-350' },
    { name: 'Bilim & Keşif', icon: '🔬', desc: 'Deneyler, araştırmalar, doğa gözlemleri, astronomi, bilimsel projeler.', accent: 'border-blue-500/20 text-blue-400 hover:border-blue-350' }
  ];

  // Accordion FAQs data
  const FAQS = [
    { q: 'Challenge\'a kimler katılabilir?', a: 'Platforma üye olan herkes katılabilir. Turnuvalar tamamen ücretsizdir ve her yaştan, her kademeden yeteneklere açıktır.' },
    { q: 'Katılım ücretli mi?', a: 'Hayır, İE ekosistemindeki tüm canlı challenge turnuvaları ve meydan okumalar tamamen ücretsizdir.' },
    { q: 'Eserimi nasıl göndereceğim?', a: 'Çalışmanızı YouTube, GitHub, Figma, Strava, Spotify gibi dış platformlarda herkese açık olarak yayınlayın ve linkini teslim et butonuna basarak yapıştırın. Sunucu depolama alanı doldurmadan, hızlıca teslim edin.' },
    { q: 'Ödüller nasıl veriliyor?', a: 'Challenge süresi bittikten sonra sonuçlar şeffaf liderlik tablosu kurallarına göre belirlenir. Kazananlarla iletişime geçilerek sponsor kurum veya eğitmen güvencesiyle ödüller şeffafça teslim edilir.' },
    { q: 'Bir challenge\'ya birden fazla eser gönderebilir miyim?', a: 'Genellikle her kullanıcının tek bir çalışmayla kalıcı listeye katılmasına izin verilir. Detaylı katılım kurallarını aktif meydan okuma kartından kontrol edebilirsiniz.' },
    { q: 'Hile nasıl engelleniyor?', a: 'Akıllı doğrulama algoritmalarımız, topluluk ihbar kanalları, puanlama modüllerimiz ve jüri oylaması sistemiyle tam şeffaflık sağlanır.' }
  ];

  // Smooth scroll helper
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="challenge-section-root" className="bg-[#0F172A] text-slate-100 min-h-screen relative overflow-hidden font-sans">
      
      {/* GLOWING SPOTLIGHT EFFECTS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#38BDF8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#FF6B35]/5 rounded-full blur-[150px] pointer-events-none" />

      {/* 1. HEADER - "ARENA'YA HOŞ GELDİN" */}
      <header className="relative border-b border-slate-800 bg-slate-950/85 backdrop-blur-md overflow-hidden py-16 sm:py-24">
        {/* Abstract Stadium Background Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf806_1px,transparent_1px),linear-gradient(to_bottom,#38bdf806_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0F172A] to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-[#38BDF8]/10 border border-[#38BDF8]/30 px-4 py-1.5 rounded-full text-xs font-black text-[#38BDF8] uppercase tracking-widest mb-6 leading-none">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            İSTEM CHALLENGE ARENASI AKTİF
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Branding Details & Buttons */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight leading-none text-white">
                <span className="text-[#38BDF8] block text-lg font-mono tracking-widest uppercase mb-2">🏆 İSTEM CHALLENGE</span>
                Yeteneğini Göster, <br />
                <span className="bg-gradient-to-r from-[#FF6B35] via-amber-400 to-[#8B5CF6] bg-clip-text text-transparent italic">Kürsüye Çık, Ödülü Kap!</span>
              </h1>
              
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-semibold">
                Yazılım, tasarım, spor, müzik, dil veya okul dersleri... Haftalık ve aylık turnuvalarda binlerce yetenekle kapış. Sponsor şirketlerin ödüllerini kazan, portfolyona tescilli başarılar ekleyerek sektörde fark yarat.
              </p>

              {/* 3 Interactive Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button 
                  onClick={() => scrollToId('arena-live-board')}
                  className="bg-gradient-to-r from-[#38BDF8] to-[#8B5CF6] hover:opacity-95 text-slate-950 font-black text-sm px-7 py-3.5 rounded-full transition duration-200 shadow-lg shadow-[#38BDF8]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-slate-950 shrink-0" />
                  🔹 Mevcut Challenge'ları Keşfet
                </button>

                {isInstructorSim && (
                  <button 
                    onClick={() => {
                      setWizardStep(1);
                      setShowLaunchWizard(true);
                    }}
                    className="bg-[#FF6B35] hover:bg-[#ff8554] text-white font-black text-sm px-6 py-3.5 rounded-full transition duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Target className="w-4 h-4 text-white shrink-0" />
                    🎯 Challenge Başlat
                  </button>
                )}

                <button 
                  onClick={() => scrollToId('how-it-works-steps')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm px-6 py-3.5 rounded-full transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  📖 Nasıl Çalışır?
                </button>
              </div>

            </div>

            {/* Stadium Visual Silhouette */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[320px] aspect-square rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between overflow-hidden shadow-2xl shadow-[#38BDF8]/10 group">
                <div className="absolute inset-0 bg-[#38BDF8]/5 opacity-30 group-hover:opacity-40 transition pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#8B5CF6]/15 rounded-full blur-2xl pointer-events-none animate-pulse" />
                
                <div className="flex justify-between items-center z-10">
                  <span className="text-[10px] bg-slate-950 border border-slate-800 text-cyan-400 px-3 py-1 rounded-full font-bold font-mono">ARENA_LIVE v1.0</span>
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                </div>

                <div className="z-10 text-center py-6">
                  <span className="text-5xl block mb-2">⚡</span>
                  <p className="text-xs uppercase font-mono tracking-widest text-slate-400">AKTİF YARIŞMACILAR</p>
                  <p className="text-3xl font-black text-white tracking-tight mt-1">1,240 <span className="text-xs text-[#38BDF8] block mt-0.5">Kişi Şu An Kodluyor/Yarışıyor</span></p>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-[10px] font-mono text-cyan-300 z-10 flex gap-2 items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#FF6B35] animate-pulse" />
                    $ listen --event-bus
                  </span>
                  <span className="text-slate-400">Oturumlar Aktif</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* 2. CANLI CHALLENGE PANOSU - "⚡ ŞU ANDA ARENA SICAK!" */}
      <section id="arena-live-board" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mb-3">
            ⚡ Şu Anda Arena Sıcak!
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto font-semibold">
            Hemen katıl, dış platform yayın bağlantını gönder, liderlik tablosundaki gerçek zamanlı tescil puanını yükselt!
          </p>
        </div>

        {/* Challenge Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {challenges.map((ch) => (
            <div 
              key={ch.id}
              className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-thin border-slate-800 p-6 flex flex-col justify-between group hover:border-[#38BDF8]/40 transition duration-300 relative overflow-hidden shadow-lg"
            >
              {/* Corner accent glow */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#38BDF8]/10 to-transparent pointer-events-none" />

              <div>
                {/* Category Badge & Code ID */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-950 text-[#38BDF8] tracking-wide border border-slate-800">
                    {ch.categoryIcon} {ch.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {ch.hashtag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-extrabold text-white leading-snug group-hover:text-[#38BDF8] transition mb-3">
                  {ch.title}
                </h3>

                {/* Live Countdown Clock */}
                <div className="bg-slate-950/70 py-2.5 px-3.5 rounded-2xl border border-slate-850 flex items-center justify-between gap-2.5 mb-4 mb-5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6B35] font-black">Kalan Süre:</span>
                  <span className="text-xs font-mono font-black text-white shrink-0 tracking-widest bg-red-950/30 px-2 py-0.5 rounded border border-red-900/10">
                    {ch.timeLeft.hours.toString().padStart(2, '0')}:{ch.timeLeft.minutes.toString().padStart(2, '0')}:{ch.timeLeft.seconds.toString().padStart(2, '0')}
                  </span>
                </div>

                {/* Meta details list */}
                <div className="space-y-2.5 text-xs font-medium text-slate-400 mb-6 bg-slate-900/20 p-3 rounded-xl">
                  <div className="flex justify-between">
                    <span>Katılımcı Sayısı:</span>
                    <span className="text-white font-extrabold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#38BDF8]" /> {ch.participants} Kişi
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ödül Havuzu:</span>
                    <span className="text-emerald-400 font-extrabold">{ch.prizePool}</span>
                  </div>
                  <div className="flex justify-between text-[11px] leading-tight border-t border-slate-800/40 pt-1.5">
                    <span>Sponsor/Koordinatör:</span>
                    <span className="text-slate-300 font-bold text-right">{ch.owner}</span>
                  </div>
                </div>
              </div>

              {/* CTA Action buttons */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button
                  onClick={() => {
                    setSubmissionLink('');
                    setShowJoinModal(ch);
                  }}
                  className="w-full bg-[#38BDF8] hover:bg-[#4dd2ff] text-slate-950 font-black text-xs py-3 rounded-xl transition duration-150 text-center cursor-pointer shadow-md"
                >
                  Turnuvaya Katıl
                </button>
                <button
                  onClick={() => setShowFeedModal(ch)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3 rounded-xl transition duration-150 text-center cursor-pointer border border-slate-750 flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                  Canlı Akış
                </button>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* 3. CHALLENGE’A KATILIM - “⚙️ 3 ADIMDA ARENADASIN” */}
      <section id="how-it-works-steps" className="border-t border-b border-slate-850 bg-slate-950/40 py-16 sm:py-24 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-black text-[#8B5CF6] uppercase tracking-widest block mb-2">⚙️ BASİT TESLİMAT SİSTEMİ</span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
              ⚙️ Challenge'a Katılmak Bu Kadar Kolay
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left relative">
            
            {/* Step 1 */}
            <div className="space-y-4 group">
              <div className="w-12 h-12 bg-cyan-950 text-[#38BDF8] flex items-center justify-center rounded-2xl font-black text-lg border border-cyan-800/20 group-hover:border-[#38BDF8]/40 transition">
                01
              </div>
              <h3 className="text-lg font-extrabold text-white">Adım 1: Challenge'ı Seç</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-semibold">
                Yazılım, tasarım, spor, müzik, dil veya okul dersleri kategorilerinden sana en uygun olan güncel turnuvayı veya ödevi bul.
              </p>
              
              {/* Micro icons row decoration */}
              <div className="flex gap-2.5 pt-2 opacity-60">
                <span className="bg-slate-900 p-1.5 rounded-lg border border-slate-800 text-xs">💻</span>
                <span className="bg-slate-900 p-1.5 rounded-lg border border-slate-800 text-xs">🎨</span>
                <span className="bg-slate-900 p-1.5 rounded-lg border border-slate-800 text-xs">🏃</span>
                <span className="bg-slate-900 p-1.5 rounded-lg border border-slate-800 text-xs">🗣️</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 group">
              <div className="w-12 h-12 bg-purple-950 text-[#8B5CF6] flex items-center justify-center rounded-2xl font-black text-lg border border-purple-800/20 group-hover:border-[#8B5CF6]/40 transition">
                02
              </div>
              <h3 className="text-lg font-extrabold text-white">Adım 2: Eserini Getir (Link ile)</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-semibold">
                Çalışmanı YouTube, GitHub, Figma, Strava, Spotify gibi popüler platformlarda yayınla ve linkini yapıştır. Sunucuda dosya yükleme derdi yok!
              </p>
              
              {/* Popular platforms visual logos */}
              <div className="flex flex-wrap gap-2 pt-2 text-[10px] font-mono font-bold text-slate-400">
                <span className="bg-[#181717] px-2 py-1 rounded border border-slate-800">GitHub</span>
                <span className="bg-[#F24E1E]/10 px-2 py-1 rounded border border-slate-800 text-[#F24E1E]">Figma</span>
                <span className="bg-[#FC642D]/10 px-2 py-1 rounded border border-slate-800 text-[#FC642D]">Strava</span>
                <span className="bg-[#1DB954]/10 px-2 py-1 rounded border border-[#1DB954]/20 text-[#1DB954]">Spotify</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 group">
              <div className="w-12 h-12 bg-orange-950 text-[#FF6B35] flex items-center justify-center rounded-2xl font-black text-lg border border-orange-850/20 group-hover:border-[#FF6B35]/40 transition">
                03
              </div>
              <h3 className="text-lg font-extrabold text-white">Adım 3: Kapış ve Liderlikte Yüksel</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-semibold">
                Topluluk beğenileri, jüri puanları ve akıllı doğrulama modülümüz sayesinde puan kazan. Liderlik tablosunda zirveye çıkarak ödülleri kap.
              </p>
              
              <div className="flex items-center gap-2 pt-2 text-[#FF6B35] font-bold text-xs">
                <span>🏆 Kupa ve Rozet tescili</span>
              </div>
            </div>

          </div>

          {/* Centered CTA */}
          <div className="text-center pt-12">
            <button
              onClick={() => scrollToId('arena-live-board')}
              className="bg-transparent hover:bg-slate-900 text-[#38BDF8] border border-[#38BDF8]/40 hover:border-[#38BDF8] transition px-8 py-3.5 rounded-full text-xs font-black tracking-wider uppercase cursor-pointer"
            >
              [ Hemen Challenge'ını Seç ]
            </button>
          </div>

        </div>
      </section>

      {/* 4. CHALLENGE TÜRLERİ (Genişletilmiş) - “🎯 HER YETENEĞE BİR ARENA” */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-black text-cyan-400 uppercase tracking-widest block mb-2">🎯 HER ALANDAN TURNUVA</span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
            🎯 Her Yeteneğe Bir Arena
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto font-semibold mt-2.5">
            Sadece kodlama değil; spor, sanat, mutfak ve akademik alanlardaki tüm turnuvalar için optimize edilmiştir.
          </p>
        </div>

        {/* 10 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {CATEGORIES_LIST.map((cat, i) => (
            <div 
              key={i}
              className={`bg-slate-900/50 p-5 rounded-3xl border ${cat.accent} transition duration-200 text-left flex flex-col justify-between`}
            >
              <div>
                <span className="text-3xl block mb-3 leading-none">{cat.icon}</span>
                <h3 className="text-sm font-black text-white tracking-wide mb-1.5">{cat.name}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">{cat.desc}</p>
              </div>
              <div className="pt-4 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
                Özelleştirilebilir Arena
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 5. ÖDÜLLER VE SPONSORLAR - “💰 BU TURNUVALARDA ÖDÜLLER BÜYÜK” */}
      <section className="border-t border-slate-850 bg-slate-950/30 py-16 sm:py-24 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-black text-[#FF6B35] uppercase tracking-widest block mb-2">💰 TURNUVA PRESTİJ MEKANİZMASI</span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-white col-span-12">
              💰 Bu Turnuvalarda Ödüller Büyük
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2.5 font-semibold">
              Eğitmenlerin veya sponsorların koyduğu büyük teşvikler sizi geleceğe tesciller.
            </p>
          </div>

          {/* Prize Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-16">
            
            {/* Prize 1 */}
            <div className="bg-slate-900/70 p-6 rounded-3xl border border-yellow-500/10 text-left">
              <span className="text-5xl block mb-4">🥇</span>
              <h3 className="text-base font-black text-white mb-2">Birincilik Ödülü</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Challenge’ı başlatan kurum veya sponsorun belirlediği ana maddi ödül ve kupa rozeti.
              </p>
            </div>

            {/* Prize 2 */}
            <div className="bg-slate-900/70 p-6 rounded-3xl border border-slate-700/20 text-left">
              <span className="text-5xl block mb-4">🥈</span>
              <h3 className="text-base font-black text-white mb-2">İkincilik Ödülü</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Sponsorların katkılarıyla şekillenen ikinci kademe teşvik, ürün veya staj katkıları.
              </p>
            </div>

            {/* Prize 3 */}
            <div className="bg-slate-900/70 p-6 rounded-3xl border border-amber-800/10 text-left">
              <span className="text-5xl block mb-4">🥉</span>
              <h3 className="text-base font-black text-white mb-2">Üçüncülük Ödülü</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Başarıyı taçlandıran üçüncülük ödülü, özel dijital sertifika ve tescil eklemesi.
              </p>
            </div>

            {/* Prize 4 */}
            <div className="bg-slate-900/70 p-6 rounded-3xl border border-purple-500/10 text-left">
              <span className="text-5xl block mb-4">❤️</span>
              <h3 className="text-base font-black text-white mb-2">Halkın Seçimi Ödülü</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                En çok beğeni alan çalışmaya özel, Özel Rozet + Sponsor Firmada Staj Görüşmesi kazanımı.
              </p>
            </div>

          </div>

          {/* Sponsor Logos Section */}
          <div className="border-t border-slate-800/60 pt-16 text-center">
            <p className="text-[10px] font-mono font-black tracking-widest text-slate-500 uppercase mb-8">SPONSOR KURULUŞLAR VE AKADEMİ GRUPLARI</p>
            
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
              <span className="text-white font-extrabold text-lg tracking-widest font-mono border border-slate-800 px-4 py-2 rounded-xl bg-slate-950">TRENDYOL</span>
              <span className="text-white font-extrabold text-lg tracking-widest font-mono border border-slate-800 px-4 py-2 rounded-xl bg-slate-950">PARIBU</span>
              <span className="text-white font-extrabold text-[#38BDF8] text-lg tracking-widest font-mono border border-slate-800 px-4 py-2 rounded-xl bg-slate-950">MACFIT</span>
              <span className="text-white font-extrabold text-lg tracking-widest font-mono border border-slate-800 px-4 py-2 rounded-xl bg-slate-950">DECATHLON</span>
              <span className="text-white font-extrabold text-sm tracking-widest font-mono border border-slate-800 px-4 py-2 rounded-xl bg-slate-950">TURKCELL</span>
            </div>

            <div className="mt-12">
              <p className="text-xs text-slate-400 font-bold mb-4">Sen de sponsor olmak ve kendi challenge\'ını yayınlamak ister misin?</p>
              <button 
                onClick={() => alert('Sponsorluk talebiniz İSTEM operasyon ekibine bildirilmiştir. Temsilcimiz 24 saat içinde bilgi.mediastore2@gmail.com adresinden iletişime geçecektir.')}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black uppercase px-6 py-3 rounded-full transition cursor-pointer"
              >
                📢 Sponsor Ol
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 6. BAŞARI HİKAYELERİ - “🌟 CHALLENGER'LAR KAZANDI, SIRA SENDE!” */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-black text-yellow-400 uppercase tracking-widest block mb-2">🌟 MEZUN BAŞARILARI</span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
            🌟 Challenger'lar Kazandı, Sıra Sende!
          </h2>
        </div>

        {/* Stories Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-slate-900/45 p-6 rounded-3xl border border-slate-800/80 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" 
                  alt="Ayşe Yılmaz" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400"
                />
                <div>
                  <h4 className="text-white font-black text-sm">Ayşe Yılmaz</h4>
                  <span className="text-[10px] text-zinc-400 block font-bold">API Tasarım Maratonu Birincisi!</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
                "Uygulamanın şeffaf API kurgu turnuvasına katıldım. Geliştirdiğim GitHub linkini sisteme girip test suiti tescil aldım. Bu sayede ilk iş mülakatı teklifimi aldım. Çok mutluyum!"
              </p>
            </div>
            
            <div className="border-t border-slate-800/60 pt-3 mt-4 text-[11px] text-[#38BDF8] font-bold flex justify-between items-center bg-slate-900/20 px-3 py-1.5 rounded-lg">
              <span>🏆 Ödül: 5.000 TL + Özel Rozet</span>
              <span className="text-slate-500">Trendyol Sponsor</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/45 p-6 rounded-3xl border border-slate-800/80 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" 
                  alt="Mehmet Demir" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-400"
                />
                <div>
                  <h4 className="text-white font-black text-sm">Mehmet Demir</h4>
                  <span className="text-[10px] text-zinc-400 block font-bold">10K Strava Yarışı Birincisi!</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
                "Her hafta koşularımı paylaşıp, buradaki gerçek zamanlı tabloda sıralamamı görmek muazzam bir rekabet ruhu oluşturdu. Kazandığım Garmin saati gururla takıyorum."
              </p>
            </div>
            
            <div className="border-t border-slate-800/60 pt-3 mt-4 text-[11px] text-[#FF6B35] font-bold flex justify-between items-center bg-slate-900/20 px-3 py-1.5 rounded-lg">
              <span>👟 Ödül: Garmin Spor Seti</span>
              <span className="text-slate-500">MacFit Sponsor</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/45 p-6 rounded-3xl border border-slate-800/80 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                  alt="Zeynep Kaya" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
                />
                <div>
                  <h4 className="text-white font-black text-sm">Zeynep Kaya</h4>
                  <span className="text-[10px] text-zinc-400 block font-bold">Wallet UI/UX Maratonu Birincisi!</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
                "Tasarımımı Figma üzerinden link vererek gönderdim. Tüm topluluk oylarıyla birinci seçilmek güven kazandırdı. Stajyer olarak görüşmeye davet edildim!"
              </p>
            </div>
            
            <div className="border-t border-slate-800/60 pt-3 mt-4 text-[11px] text-pink-400 font-bold flex justify-between items-center bg-slate-900/20 px-3 py-1.5 rounded-lg">
              <span>🎨 Ödül: Tablet + Staj Seansı</span>
              <span className="text-slate-500">Paribu Sponsor</span>
            </div>
          </div>

        </div>

      </section>

      {/* 7. CHALLENGE BAŞLAT - “🎙️ SEN DE BİR CHALLENGE BAŞLAT!” */}
      <section className="border-t border-slate-850 bg-slate-950/50 py-16 sm:py-24 relative overflow-hidden">
        
        <div className="absolute inset-0 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center space-y-6">
          <span className="text-xs font-mono font-black text-[#8B5CF6] uppercase tracking-widest block">🎙️ ÖZEL EĞİTMEN YAYINLAMA PANELİ</span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
            🎙️ Sen de Bir Challenge Başlat!
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto font-semibold leading-relaxed">
            Kendi temanı, kurallarını ve ödüllerini özgürce belirle. Öğrencilerini veya takipçilerini meydan okumaya davet et. Topluluğun yeteneklerini gerçek projelerle tescillemesine öncülük et.
          </p>
          
          <div className="pt-2">
            <button 
              onClick={() => {
                setWizardStep(1);
                setShowLaunchWizard(true);
              }}
              className="bg-gradient-to-r from-[#FF6B35] to-[#8B5CF6] hover:opacity-95 text-white font-black text-sm px-8 py-4 rounded-full transition shadow-lg shadow-purple-500/10 cursor-pointer text-center inline-flex items-center gap-1.5"
            >
              🚀 Yeni Challenge Oluştur
            </button>
            <span className="block text-[11px] text-slate-500 font-mono mt-2 font-bold uppercase">SADECE AKREDİTE EĞİTMEN VE ADMİNLER YETKİLİDİR</span>
          </div>
        </div>

      </section>

      {/* 8. SIK SORULAN SORULAR - “❓ SORULARIN MI VAR?” */}
      <section className="max-w-4xl mx-auto px-4 py-16 sm:py-24 relative z-10">
        
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-black text-cyan-400 tracking-wider uppercase block mb-1">SSS</span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
            ❓ Soruların mı Var?
          </h2>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-slate-900/80 rounded-2xl border border-slate-800/80 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-4.5 flex justify-between items-center transition hover:bg-slate-850/50"
                >
                  <span className="font-extrabold text-sm sm:text-base text-slate-100 pr-4">{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#38BDF8] shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed border-t border-slate-800/40 pt-3 bg-slate-950/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* 9. SON CTA – “🏁 ARENAYA KATILMAYA HAZIR MISIN?” */}
      <section className="relative overflow-hidden border-t border-slate-800 bg-slate-950/90 py-20 px-4 text-center">
        <div className="absolute inset-0 bg-[#38BDF8]/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <span className="text-xs font-mono font-black text-[#FF6B35] tracking-widest uppercase block animate-pulse">#LET-THE-CHALLENGE-BEGIN</span>
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
            🏁 Arenaya Katılmaya Hazır mısın?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-semibold">
            Komisyonsuz pazarımızın canlı turnuvalarında gerçek zamanlı oylama heyecanına hemen başlayın.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
              onClick={() => scrollToId('arena-live-board')}
              className="w-full sm:w-auto bg-[#38BDF8] hover:bg-[#4dd2ff] text-slate-950 font-black text-sm px-8 py-4 rounded-full transition duration-150 transform hover:scale-[1.02] shadow-lg shadow-[#38BDF8]/20 cursor-pointer"
            >
              ⚔️ Mevcut Challenge\'ları Keşfet
            </button>
            <button
              onClick={() => {
                setWizardStep(1);
                setShowLaunchWizard(true);
              }}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm px-8 py-4 rounded-full transition duration-150 cursor-pointer"
            >
              🎙️ Challenge Başlat (Eğitmen/Admin)
            </button>
          </div>
        </div>
      </section>


      {/* ================= MODALS & OVERLAYS ================= */}

      {/* SUBMIT WORK DIRECTLY MODAL (B. SAYFA AKIŞI GEREKSİNİMLERİ) */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl animate-fade-in my-8">
            
            <button 
              onClick={() => setShowJoinModal(null)}
              className="absolute top-5 right-5 text-slate-500 hover:text-white transition p-1 rounded-full bg-slate-950/80 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] bg-cyan-950 text-[#38BDF8] px-3 py-1 rounded-full font-black uppercase tracking-wider block w-fit mb-2 border border-cyan-900/30">
              ⚔️ {showJoinModal.category}
            </span>

            <h3 className="text-xl font-black text-white pr-8">{showJoinModal.title}</h3>
            <p className="text-xs text-slate-400 mt-1">Sponsor: {showJoinModal.owner}</p>

            {submissionSuccess ? (
              <div className="my-8 text-center space-y-3 py-4 animate-scale-up">
                <span className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center rounded-full mx-auto text-3xl">✓</span>
                <h4 className="text-lg font-bold text-white">Çalışma Linkiniz Doğrulandı!</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  İstanbul Eğitim Pazaryeri akıllı ve şeffaf kod/doğrulama kontrol süreci tescillendi. Arenanın Canlı Liderlik Tablosunda listelendiniz!
                </p>
              </div>
            ) : (
              <form onSubmit={handleJoinSubmit} className="space-y-5 mt-6 border-t border-slate-800/80 pt-5">
                
                {/* Rules Section block */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-1.5 text-xs text-slate-350 leading-relaxed font-semibold">
                  <span className="text-[10px] text-[#FF6B35] font-mono uppercase tracking-widest block font-black">Meydan Okuma Kuralları:</span>
                  <p className="font-medium text-[11px] text-slate-400">{showJoinModal.rules}</p>
                </div>

                {/* Delivery details platform selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase font-black text-slate-400">Yayınladığınız Platform:</label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {['GitHub', 'Figma', 'Strava', 'YouTube', 'Spotify'].map((pf) => (
                      <button
                        key={pf}
                        type="button"
                        onClick={() => setSelectedPlatform(pf)}
                        className={`py-2 px-3 rounded-xl border font-bold transition text-center ${
                          selectedPlatform === pf 
                            ? 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]' 
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'
                        }`}
                      >
                        {pf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct submission link URL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase font-black text-slate-400 flex justify-between">
                    <span>Eserinizin Yayım Bağlantısı (Link):</span>
                    <span className="text-[#38BDF8]">Sıfır Sunucu Depolaması</span>
                  </label>
                  <input 
                    type="url"
                    required
                    placeholder={`Örn: https://${selectedPlatform.toLowerCase()}.com/tasarimim-veya-kodum`}
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-705 focus:outline-none focus:border-[#38BDF8] font-semibold"
                  />
                  <p className="text-[10px] text-slate-500">
                    * Dosya yüklemenize gerek yoktur. Çalışmanızı {selectedPlatform} vb. yayınlayıp link vermeniz yeterlidir.
                  </p>
                </div>

                {/* Verify connectivity button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#38BDF8] to-[#8B5CF6] hover:opacity-95 text-slate-950 font-black text-xs py-3.5 rounded-xl transition duration-150 flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4 shrink-0 text-slate-950" />
                  🔍 Bağlantıyı Doğrula &amp; Kaydol
                </button>

              </form>
            )}

            <div className="mt-4 pt-4 border-t border-slate-800/40 text-center">
              <button 
                type="button" 
                onClick={() => setShowJoinModal(null)}
                className="text-slate-500 hover:text-white transition font-bold text-xs"
              >
                Pencereyi Kapat
              </button>
            </div>

          </div>
        </div>
      )}


      {/* D. CHALLENGE DETAY SAYFASI (CANLI FEED & LİDERLİK TABLOSU MODAL) */}
      {showFeedModal && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl p-5 sm:p-7 max-w-4xl w-full relative shadow-2xl animate-fade-in my-4">
            
            <button 
              onClick={() => setShowFeedModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition p-1 rounded-full bg-slate-950 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header section info */}
            <div className="pb-4 border-b border-slate-800">
              <span className="text-[9px] font-mono bg-slate-950 text-emerald-400 px-2.5 py-1 rounded border border-slate-800 uppercase tracking-widest font-black inline-block mb-2">
                📡 CANLI AKIŞ &amp; LİDERLİK TABLOSU FEED
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                {showFeedModal.title}
                <span className="text-xs bg-[#FF6B35]/15 text-[#FF6B35] px-2 py-0.5 rounded-full border border-[#FF6B35]/25">
                  Katılımcı: {showFeedModal.participants}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl font-semibold leading-relaxed">
                Ödül: <strong className="text-emerald-400">{showFeedModal.prizePool}</strong> - {showFeedModal.prizeDetail}
              </p>
            </div>

            {/* Two Column Layout: Left (Live Feed submissions) | Right (Real-time Leaderboard) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 max-h-[60vh] overflow-y-auto pr-1">
              
              {/* Left hand column: Submissions Feed */}
              <div className="md:col-span-7 space-y-4 pr-1">
                <h4 className="text-xs font-mono font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 mb-2.5">
                  <Activity className="w-4 h-4 text-[#38BDF8] animate-pulse" />
                  Gönderiler (En Yeni En Üstte)
                </h4>

                {showFeedModal.feed.length === 0 ? (
                  <div className="bg-slate-950 p-8 rounded-2xl text-center border border-slate-850">
                    <span className="text-3xl block mb-2">📥</span>
                    <p className="text-xs text-slate-500">Henüz teslim edilen eser bağlantısı bulunmuyor.</p>
                    <button 
                      onClick={() => {
                        setShowFeedModal(null);
                        setShowJoinModal(showFeedModal);
                      }}
                      className="mt-3 bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/30 px-4 py-2 rounded-xl text-xs font-bold text-[#38BDF8] transition cursor-pointer"
                    >
                      İlk Gönderiyi Sen Getir!
                    </button>
                  </div>
                ) : (
                  showFeedModal.feed.map((sub) => (
                    <div 
                      key={sub.id}
                      className="bg-slate-950/80 p-4 rounded-2xl border border-slate-850/80 space-y-3 text-left relative"
                    >
                      {/* Submitter User Profil e */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img src={sub.userAvatar} alt="Alt" className="w-8 h-8 rounded-full object-cover border border-slate-800" />
                          <div>
                            <span className="text-xs font-black text-white">{sub.userName}</span>
                            <span className="text-[10px] text-slate-500 block leading-tight">{sub.submittedAt}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Flag/Report trigger button */}
                          <button
                            onClick={() => alert('Bu çalışma inceleme için işaretlendi. İS ihbar kanalı devreye girdi.')}
                            title="Rapor Et"
                            className="bg-slate-900 hover:bg-red-950/20 text-slate-500 hover:text-red-400 p-1.5 rounded-lg border border-slate-800/80 transition"
                          >
                            <AlertTriangle className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* URL Embed / Link box */}
                      <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 text-[11px] leading-relaxed">
                        <span className="text-[9px] font-mono text-[#38BDF8] font-bold block uppercase mb-1">🔗 EMBED_PREVIEW:</span>
                        <a 
                          href={sub.submittedLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="font-black text-xs text-white hover:underline flex items-center gap-1"
                        >
                          {sub.embedTitle} <ArrowUpRight className="w-3 h-3 text-[#38BDF8]" />
                        </a>
                        <p className="text-slate-400 font-mono text-[10px] mt-1 break-all truncate">{sub.submittedLink}</p>
                      </div>

                      {/* Likes count & comment box */}
                      <div className="flex items-center gap-6 text-xs border-t border-slate-850/40 pt-2.5">
                        
                        <button
                          onClick={() => handleLikeSubmission(showFeedModal.id, sub.id)}
                          className={`flex items-center gap-1.5 transition font-extrabold ${
                            sub.hasLiked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${sub.hasLiked ? 'fill-current text-red-500' : ''}`} />
                          <span>{sub.likes} Beğeni</span>
                        </button>

                        <span className="text-slate-400 font-bold flex items-center gap-1.5">
                          <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{sub.comments.length} Yorum</span>
                        </span>

                      </div>

                      {/* Display Comments List */}
                      {sub.comments.length > 0 && (
                        <div className="bg-slate-900/40 p-2.5 rounded-xl text-[11px] text-slate-400 space-y-1.5 font-medium">
                          {sub.comments.map((comm, cidx) => (
                            <div key={cidx} className="border-b border-slate-850/30 pb-1.5 last:border-0 last:pb-0">
                              <strong className="text-slate-300 font-extrabold">{comm.author}:</strong> {comm.text}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add comment simulator */}
                      <div className="flex gap-1.5">
                        <input 
                          type="text" 
                          placeholder="Yorum ekle..."
                          value={commentTextState[sub.id] || ''}
                          onChange={(e) => setCommentTextState({ ...commentTextState, [sub.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(showFeedModal.id, sub.id);
                          }}
                          className="w-full bg-slate-900/60 border border-slate-850 rounded-xl px-3 py-1.5 text-[11px] text-white focus:outline-none placeholder-slate-600"
                        />
                        <button
                          onClick={() => handleAddComment(showFeedModal.id, sub.id)}
                          className="bg-slate-800 hover:bg-slate-700 text-[#38BDF8] p-1.5 rounded-xl border border-slate-750 shrink-0 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>

              {/* Right hand column: Live Leaderboard (D. TABLOSU GEREKSİNİMLERİ) */}
              <div className="md:col-span-5 bg-slate-950 p-4 rounded-3xl border border-slate-850">
                <h4 className="text-xs font-mono font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5 mb-4">
                  🏆 Canlı Liderlik Tablosu
                </h4>

                <div className="space-y-2.5">
                  {showFeedModal.feed.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500">
                      Hiç kayıtlı sıralama bulunmuyor.
                    </div>
                  ) : (
                    // Simple simulated dynamic scoring logic (Total score = Likes count + custom coefficients)
                    showFeedModal.feed
                      .map((sub, index) => ({
                        ...sub,
                        totalScore: 70 + (sub.likes * 2) + (sub.comments.length * 3)
                      }))
                      .sort((a, b) => b.totalScore - a.totalScore)
                      .map((item, idx) => (
                        <div 
                          key={item.id}
                          className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2.5 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            {/* Medals designation */}
                            <span className="w-5 h-5 bg-slate-950 text-center rounded-lg flex items-center justify-center font-bold">
                              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                            </span>
                            <span className="font-extrabold text-white truncate max-w-[100px]">{item.userName}</span>
                          </div>

                          <div className="text-right font-mono font-bold text-slate-300">
                            <span className="text-[#38BDF8]">{item.totalScore}</span> Puan
                          </div>
                        </div>
                      ))
                  )}
                </div>

                {/* Automation notice snippet */}
                <p className="text-[9px] uppercase font-mono tracking-widest text-slate-500 block text-center mt-6">
                  Otomatik 30 saniyelik yenileme aktif
                </p>
              </div>

            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
              <button 
                type="button" 
                onClick={() => setShowFeedModal(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2.5 px-6 rounded-xl border border-slate-750 transition cursor-pointer"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}


      {/* C. CHALLENGE BAŞLATMA SİHİRBAZI MODAL (EĞİTMEN & ADMIN ÖZEL PANELİ) */}
      {showLaunchWizard && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl p-5 sm:p-7 max-w-xl w-full relative shadow-2xl animate-fade-in my-8">
            
            <button 
              onClick={() => setShowLaunchWizard(false)}
              className="absolute top-5 right-5 text-slate-500 hover:text-white transition p-1 rounded-full bg-slate-950 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title & step breadcrumb details */}
            <div className="border-b border-indigo-900/30 pb-3 mb-5 text-left">
              <span className="text-[10px] bg-purple-950 text-indigo-400 px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest inline-block mb-1 border border-indigo-900/30">
                SİHİRBAZ: ADIM {wizardStep} / 6
              </span>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                🎙️ Yeni Challenge Oluşturma Sihirbazı
              </h3>
            </div>

            <form onSubmit={handleWizardSubmit} className="space-y-4 text-left">
              
              {/* Step 1: Definition */}
              {wizardStep === 1 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-amber-400 block mb-1">Adım 1: Temel Bilgiler</span>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono font-black uppercase block mb-1">Yarışma Başlığı *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Örn: 48 Saatlik API Tasarım Maratonu"
                      value={newChallengeForm.title}
                      onChange={(e) => setNewChallengeForm({ ...newChallengeForm, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-805 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-705 focus:outline-none focus:border-[#38BDF8] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono font-black uppercase block mb-1">Yarışma Kategorisi</label>
                    <select
                      value={newChallengeForm.category}
                      onChange={(e) => setNewChallengeForm({ ...newChallengeForm, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-805 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                    >
                      <option value="Yazılım & Teknoloji">💻 Yazılım &amp; Teknoloji</option>
                      <option value="Tasarım & Sanat">🎨 Tasarım &amp; Sanat</option>
                      <option value="Spor & Fitness">🏃 Spor &amp; Fitness</option>
                      <option value="Müzik & Ses">🎵 Müzik &amp; Ses</option>
                      <option value="Dil & Akademik">🗣️ Dil &amp; Akademik</option>
                      <option value="Okul Dersleri & Sınav">📚 Okul Dersleri &amp; Sınav</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono font-black uppercase block mb-1">Açıklama &amp; Kurallar *</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Proje tesliminin hangi değerlendirme kurallarıyla tescilleneceğini detaylandırın."
                      value={newChallengeForm.rules}
                      onChange={(e) => setNewChallengeForm({ ...newChallengeForm, rules: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-805 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Date Picker */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-amber-400 block">Adım 2: Zaman &amp; Kapasite Ayarı</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono font-black uppercase block mb-1">Zaman Sınırı (Gün)</label>
                      <input 
                        type="number" 
                        required
                        min={1}
                        value={newChallengeForm.durationDays}
                        onChange={(e) => setNewChallengeForm({ ...newChallengeForm, durationDays: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-805 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono font-black uppercase block mb-1">Maksimum Katılımcı</label>
                      <input 
                        type="text" 
                        placeholder="Örn: 500 veya Sınırsız"
                        value={newChallengeForm.maxParticipants}
                        onChange={(e) => setNewChallengeForm({ ...newChallengeForm, maxParticipants: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-805 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Platform check checkbox selection */}
              {wizardStep === 3 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-amber-400 block mb-1">Adım 3: İzin Verilen Platform Teslimat Kanalları</span>
                  <p className="text-[11px] text-slate-400 leading-tight">Yarışmacıların depolama yükü bindirmeden link tesimi yapacakları platformları seçin.</p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['GitHub', 'Figme/Figma', 'Strava', 'YouTube', 'Spotify', 'Herhangi bir URL'].map((pf) => {
                      const isChecked = newChallengeForm.platformAllowed.includes(pf);
                      return (
                        <button
                          key={pf}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setNewChallengeForm({
                                ...newChallengeForm,
                                platformAllowed: newChallengeForm.platformAllowed.filter(p => p !== pf)
                              });
                            } else {
                              setNewChallengeForm({
                                ...newChallengeForm,
                                platformAllowed: [...newChallengeForm.platformAllowed, pf]
                              });
                            }
                          }}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition text-left ${
                            isChecked 
                              ? 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]' 
                              : 'bg-slate-950 border-slate-805 text-slate-400 hover:text-slate-300'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] leading-none shrink-0">
                            {isChecked ? '✓' : ''}
                          </span>
                          {pf}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Rewards detail */}
              {wizardStep === 4 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-amber-400 block mb-1">Adım 4: Turnuva Ödülleri</span>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1">🥇 BİRİNCİLİK ÖDÜLÜ *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Örn: 20.000 TL + Mentorship"
                        value={newChallengeForm.rewards.first}
                        onChange={(e) => setNewChallengeForm({
                          ...newChallengeForm,
                          rewards: { ...newChallengeForm.rewards, first: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-slate-805 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1">🥈 İKİNCİLİK ÖDÜLÜ</label>
                      <input 
                        type="text" 
                        value={newChallengeForm.rewards.second}
                        onChange={(e) => setNewChallengeForm({
                          ...newChallengeForm,
                          rewards: { ...newChallengeForm.rewards, second: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-slate-805 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1">❤️ HALKIN SEÇİMİ EN BEĞENİLEN EN FAZLA REAKSİYON ALAN</label>
                      <input 
                        type="text" 
                        value={newChallengeForm.rewards.popChoice}
                        onChange={(e) => setNewChallengeForm({
                          ...newChallengeForm,
                          rewards: { ...newChallengeForm.rewards, popChoice: e.target.value }
                        })}
                        className="w-full bg-slate-950 border border-[#38BDF8]/20 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Sponsor Info */}
              {wizardStep === 5 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-amber-400 block mb-1">Adım 5: Sponsor / Koordinatör Bilgileri</span>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono block mb-1">Sponsor Marka / Kurum veya Eğitmen İsmi *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Örn: Trendyol Tech Team"
                      value={newChallengeForm.sponsorName}
                      onChange={(e) => setNewChallengeForm({ ...newChallengeForm, sponsorName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-805 rounded-xl px-3 py-2 text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono block mb-1">Web Sitesi / Logo URL (Opsiyonel)</label>
                    <input 
                      type="url" 
                      placeholder="https://trendyol.com"
                      className="w-full bg-slate-950 border border-slate-805 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Preview & publish */}
              {wizardStep === 6 && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-[#38BDF8] block mb-1">Adım 6: Önizleme &amp; Kurallar Onayı</span>
                  
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2.5 text-xs text-slate-350 leading-relaxed font-semibold">
                    <p className="text-white font-extrabold text-sm">{newChallengeForm.title || 'Başlıksız'}</p>
                    <p>Kategori: {newChallengeForm.category}</p>
                    <p>Sponsor: {newChallengeForm.sponsorName || 'İS Eğitmen Koordinatörü'}</p>
                    <p className="border-t border-slate-850 pt-2 text-[11px] text-slate-400">
                      Ödül Havuzu: {newChallengeForm.rewards.first}
                    </p>
                  </div>

                  <p className="text-[11px] text-[#FF6B35] leading-tight flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    * İSTANBUL EĞİTİM PAZARYERİ Şeffaflık Taahhüdü gereği turnuva sonuçlarının tescili kalıcı rozet olarak işlenecektir.
                  </p>
                </div>
              )}

              {/* Wizard Nav Controls footer */}
              <div className="flex gap-2.5 pt-4 border-t border-slate-800/60 mt-4">
                {wizardStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep - 1)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
                  >
                    Geri
                  </button>
                )}
                
                {wizardStep < 6 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep + 1)}
                    className="flex-1 bg-[#38BDF8] text-slate-950 font-black text-xs py-3 rounded-xl hover:opacity-95 transition cursor-pointer text-center"
                  >
                    İleri
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 bg-[#38BDF8] text-slate-950 font-black text-xs py-3 rounded-xl hover:opacity-95 transition cursor-pointer text-center"
                  >
                    Yayınla &amp; Davet Et
                  </button>
                )}
              </div>

            </form>

          </div>
        </div>
      )}


    </div>
  );
}
