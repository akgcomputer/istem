import React, { useState, useEffect } from 'react';
import { 
  Trophy, MapPin, Users, BookOpen, Clock, Star, Plus, X, Search, Award, Eye, EyeOff, SlidersHorizontal 
} from 'lucide-react';
import { SpecialCourse, MOCK_SPECIAL_COURSES } from '../data/catalogData';
import ShareButtons from './ShareButtons';

export default function SpecialCoursesCatalogView() {
  const [courses, setCourses] = useState<SpecialCourse[]>(MOCK_SPECIAL_COURSES);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<SpecialCourse | null>(null);
  const [showRegForm, setShowRegForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  
  // Create Course Form State
  const [newCourse, setNewCourse] = useState({
    name: '',
    type: 'YKS' as any,
    location: '',
    capacity: '',
    teachersCount: '',
    classes: '',
    hoursPerWeek: '',
    priceRange: '',
    branchesCount: ''
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('Tümü'); // Tümü, LGS, YKS, Yetenek Sınavları, Özel Eğitim Kurumları, Sürücü Kursu

  // Random sort weights
  const randomWeights = React.useMemo(() => {
    const weights: Record<string, number> = {};
    courses.forEach(c => weights[c.id] = Math.random());
    return weights;
  }, [courses]);

  // Filtration logic
  const filteredCourses = [...courses].sort((a, b) => (randomWeights[a.id] || 0) - (randomWeights[b.id] || 0)).filter(course => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (course.name || '').toLowerCase().includes(q);
      const matchLoc = (course.location || '').toLowerCase().includes(q);
      const matchClasses = (course.classes || []).some(c => (c || '').toLowerCase().includes(q));
      if (!matchName && !matchLoc && !matchClasses) return false;
    }

    if (selectedType !== 'Tümü' && course.type !== selectedType) {
      return false;
    }

    return true;
  });

  // Submit course
  const handleRegisterCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.location) return;

    const created: SpecialCourse = {
      id: `spec-${Date.now()}`,
      name: newCourse.name,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
      type: newCourse.type,
      location: newCourse.location,
      capacity: Number(newCourse.capacity) || 100,
      teachersCount: Number(newCourse.teachersCount) || 8,
      classes: newCourse.classes.split(',').map(c => c.trim()).filter(Boolean),
      hoursPerWeek: newCourse.hoursPerWeek || 'Haftalık 12 Saat Etüt',
      priceRange: newCourse.priceRange || 'Paket Fiyatı 15.000₺',
      parentReviewText: '',
      reviewerName: '',
      rating: 5.0,
      branchesCount: Number(newCourse.branchesCount) || 1,
      averageClassSize: 6
    };

    setCourses([created, ...courses]);
    setSuccessMsg('🎉 Özel eğitim kurumu / kurs kaydınız başarıyla pazaryeri listelerine eklendi! Bilgileri anında kontrol edebilirsiniz.');
    setTimeout(() => {
      setSuccessMsg('');
      setShowRegForm(false);
    }, 4000);

    // reset fields
    setNewCourse({
      name: '',
      type: 'YKS',
      location: '',
      capacity: '',
      teachersCount: '',
      classes: '',
      hoursPerWeek: '',
      priceRange: '',
      branchesCount: ''
    });
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
          <div>
            <span className="text-[10px] tracking-widest font-black text-[#E58F49] uppercase block">
              LGS, YKS, GÜZEL SANATLAR VE SÜRÜCÜ KURSLARI
            </span>
            <h1 id="special-courses-title" className="text-2xl sm:text-3.5xl font-extrabold font-display text-zinc-950 mt-1 leading-tight">
              Arama Yap &amp; Kurs Bul
            </h1>
            <p className="text-xs text-zinc-550 mt-1 max-w-2xl">
              İstanbul genelindeki özel öğretim kurslarını, LGS-YKS hazırlık merkezlerini, özel yetenek sanat atölyelerini ve akredite motorlu taşıt sürücü kurslarını şeffaf ücret aralıklarıyla bulun.
            </p>
          </div>

          <button 
            onClick={() => setShowRegForm(true)}
            className="w-full sm:w-auto bg-zinc-950 hover:bg-zinc-900 hover:scale-[1.02] active:scale-98 text-white text-xs font-black px-6 py-4 rounded-2xl transition shadow-md flex items-center justify-center gap-2 border border-zinc-850"
          >
            <Plus className="text-[#39FF14] w-4 h-4" />
            + Kurs veya Akademini Kaydet
          </button>
        </div>

        {/* DOUBLE COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT FILTERS */}
          {showFilters && (
            <div className="lg:col-span-3 bg-white border border-zinc-200/60 rounded-3xl p-5 shadow-xs space-y-6">
              <h3 className="text-sm font-black text-zinc-855 border-b border-zinc-100 pb-3 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#E58F49]" /> Kurs kategorileri
              </h3>

              {/* Keyword Search */}
              <div className="space-y-1.5 font-semibold">
                <label className="text-[11px] font-black tracking-wider text-zinc-400 block">Kurs veya sınav adı ara</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="LGS, Sürücü, Ataşehir vb..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-850 focus:outline-none focus:ring-1 focus:ring-[#E58F49] font-semibold"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Course Type selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black tracking-wider text-zinc-400 block">Kurs sektör türü</label>
                <div className="flex flex-col gap-1.5">
                  {[
                    { value: 'Tümü', label: '🏫 Tüm Sınav & Kurs Türleri' },
                    { value: 'LGS', label: '📚 LGS Liselere Hazırlık' },
                    { value: 'YKS', label: '🎓 YKS Üniversiteye Hazırlık' },
                    { value: 'Yetenek Sınavları', label: '🎨 Özel Yetenek & Konservatuar' },
                    { value: 'Özel Eğitim Kurumları', label: '🎯 Takviye Etüt Eğitimleri' },
                    { value: 'Sürücü Kursu', label: '🚗 Motorlu Taşıt Sürücü Kursu' },
                    { value: 'Yabancı Dil', label: '🌐 Yabancı Dil Kursları' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedType(opt.value)}
                      className={`text-left text-xs px-3 py-2 rounded-xl border transition text-[11px] ${
                        selectedType === opt.value 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-black' 
                          : 'border-zinc-200/60 text-zinc-600 font-bold hover:bg-zinc-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('Tümü');
                }}
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-black py-2.5 rounded-xl transition"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}

          {/* RIGHT GRID LISTING */}
          <div className={`${showFilters ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-6`}>
            
            {/* Header toolbar with eyeball filter switcher */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 border border-zinc-200/60 rounded-2xl gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100/80 hover:bg-zinc-200 hover:scale-[1.02] active:scale-98 text-zinc-950 text-xs font-extrabold rounded-xl transition duration-150 border border-zinc-200 cursor-pointer"
                  title={showFilters ? "Filtreleri Gizle" : "Filtreleri Göster"}
                >
                  {showFilters ? <EyeOff className="w-3.5 h-3.5 text-zinc-650" /> : <SlidersHorizontal className="w-3.5 h-3.5 text-[#E58F49]" />}
                  <span>{showFilters ? "Filtreleri Gizle" : "Filtreleri Göster"}</span>
                </button>
                <span className="text-xs font-extrabold text-zinc-500">
                  🔍 Toplam <b className="text-zinc-950 font-black">{filteredCourses.length}</b> uyumlu kurs listeleniyor
                </span>
                {selectedType !== 'Tümü' && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2.5 py-1 rounded-md uppercase">
                    {selectedType}
                  </span>
                )}
              </div>
            </div>

            {filteredCourses.length > 0 ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${showFilters ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
                {filteredCourses.map((course) => (
                  <div 
                    key={course.id}
                    className="bg-white border border-zinc-250/60 rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#E58F49] transition duration-200 flex flex-col justify-between group"
                  >
                    
                    {/* Image Cover */}
                    <div className="relative aspect-video">
                      <img src={course.image} alt={course.name} className="object-cover w-full h-full group-hover:scale-[1.02] transition duration-300" />
                      <span className="absolute top-3 left-3 bg-zinc-950 text-[#39FF14] text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {course.type}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-white text-zinc-950 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm shrink-0">
                        ⭐ {course.rating.toFixed(1)} / 5
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      
                      <div>
                        {/* Title (Larger text layout) */}
                        <h3 className="text-base sm:text-[17px] font-black text-zinc-950 group-hover:text-[#E58F49] transition leading-snug mb-1 line-clamp-2">
                          {course.name}
                        </h3>

                        {/* Under title: reviews & location */}
                        <div className="flex flex-col gap-1 text-[11px] text-zinc-500 mb-3">
                          <div className="flex items-center gap-1 font-bold">
                            <span>💬 44</span>
                            <span className="text-zinc-300 mx-1">|</span>
                            <span>🖼️ 12</span>
                          </div>
                          <div className="flex items-center gap-1 text-zinc-650 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-[#E58F49] shrink-0" />
                            <span>{course.location}</span>
                          </div>
                        </div>

                        {/* Metadata Count Tray with Aligned Values */}
                        <div className="flex flex-col gap-1.5 text-xs text-zinc-650 border-t border-b border-zinc-100 py-3 mb-3">
                          <div className="grid grid-cols-[20px_130px_8px_1fr] items-center gap-x-1 font-bold">
                            <span>🏢</span>
                            <span className="text-zinc-550 font-bold">Şube Sayısı</span>
                            <span className="text-zinc-400 font-normal">:</span>
                            <span className="text-zinc-950 font-black">{course.branchesCount || 5}</span>
                          </div>
                          
                          <div className="grid grid-cols-[20px_130px_8px_1fr] items-center gap-x-1 font-bold">
                            <span>👥</span>
                            <span className="text-zinc-550 font-bold">Ort. Sınıf Mevcudu</span>
                            <span className="text-zinc-400 font-normal">:</span>
                            <span className="text-zinc-950 font-black">{course.averageClassSize || 6} Kişilik</span>
                          </div>

                          <div className="grid grid-cols-[20px_130px_8px_1fr] items-center gap-x-1 font-bold">
                            <span>💰</span>
                            <span className="text-zinc-550 font-bold">Aylık Ort. Ücret</span>
                            <span className="text-zinc-400 font-normal">:</span>
                            <span className="text-[#E58F49] font-black">{course.priceRange || '₺12.500'}</span>
                          </div>

                          <div className="grid grid-cols-[20px_130px_8px_1fr] items-center gap-x-1 font-bold">
                            <span>⏰</span>
                            <span className="text-zinc-550 font-bold">Ders Saatleri</span>
                            <span className="text-zinc-400 font-normal">:</span>
                            <span className="text-zinc-950 font-black">{course.hoursPerWeek}</span>
                          </div>
                        </div>

                        {/* Classes specialities */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-black uppercase text-zinc-455 tracking-wider">🎯 Mevcut Şubeler/Sınıflar:</span>
                          <div className="flex flex-wrap gap-1">
                            {course.classes.map((cls, index) => (
                              <span key={index} className="bg-zinc-100 text-zinc-700 px-1.5 py-0.5 text-[10px] rounded font-semibold">
                                {cls}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* CTA Buttons - Randevu Al (Red) & İncele (Green) */}
                      <div className="pt-2 flex flex-col gap-2">
                        <button 
                          onClick={() => {
                            alert(`"${course.name}" için randevu talebiniz İstanbul Eğitim Pazaryeri güvencesiyle sıraya alındı! Temsilcimiz sizinle en kısa sürede iletişime geçecektir.`);
                          }}
                          className="w-full bg-red-600 hover:bg-zinc-950 text-white text-xs font-black py-3 px-4 rounded-xl transition duration-250 text-center cursor-pointer shadow-md"
                        >
                          Randevu Al
                        </button>
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>İncele (Profil Sayfası)</span>
                        </button>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-zinc-200/60 rounded-3xl p-12 text-center">
                <span className="text-4xl">📚</span>
                <h4 className="text-base font-bold text-zinc-900 mt-4">Kriterlere Uygun Özel Kurs Kurumu Bulunamadı</h4>
                <p className="text-xs text-zinc-500 mt-1">Lütfen filtre aramalarını genişletmeyi veya temizlemeyi deneyin.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* --- REGISTRATION KURS KAYDET FORM MODAL --- */}
      {showRegForm && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-zinc-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative border border-zinc-200 shadow-2xl">
            
            <button 
              onClick={() => setShowRegForm(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-900 transition p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-full font-extrabold uppercase tracking-widest block w-fit mb-1">
                Eğitim Kurumu Ekleme Formu
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display text-zinc-950">
                Özel Kurs veya Akademini Pazaryerine Kaydet!
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                LGS/YKS sınav hazırlık, özel ders şubesi, güzel sanatlar eğitim atölyesi veya sürücü kursu kurumunuzu şeffafça sergileyin.
              </p>
            </div>

            {successMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-emerald-800 text-center font-bold">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleRegisterCourse} className="space-y-4 text-xs font-semibold">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-500 block mb-1">Kurum/Şube Resmi Adı *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Örn: Sarıyer Başarı LGS-YKS Şubesi"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#E58F49]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Konum / Adres Detayı *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Örn: Şişli, İstanbul"
                      value={newCourse.location}
                      onChange={(e) => setNewCourse({...newCourse, location: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#E58F49]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-zinc-500 block mb-1">Kapasite (Öğrenci)</label>
                    <input 
                      type="number" 
                      placeholder="Örn: 150"
                      value={newCourse.capacity}
                      onChange={(e) => setNewCourse({...newCourse, capacity: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Eğitmen/Kadrosu Sayısı</label>
                    <input 
                      type="number" 
                      placeholder="Örn: 8"
                      value={newCourse.teachersCount}
                      onChange={(e) => setNewCourse({...newCourse, teachersCount: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Kurs Sektör Türü</label>
                    <select
                      value={newCourse.type}
                      onChange={(e) => setNewCourse({...newCourse, type: e.target.value as any})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#E58F49] text-zinc-700 font-bold"
                    >
                      <option value="LGS">📚 LGS Liselere Hazırlık</option>
                      <option value="YKS">🎓 YKS Üniversiteye Hazırlık</option>
                      <option value="Yetenek Sınavları">🎨 Özel Yetenek &amp; Konservatuar</option>
                      <option value="Özel Eğitim Kurumları">🎯 Takviye Etüt Eğitimleri</option>
                      <option value="Sürücü Kursu">🚗 Motorlu Taşıt Sürücü Kursu</option>
                      <option value="Yabancı Dil">🌐 Yabancı Dil Kursları</option>

                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-500 block mb-1">Şube Sayısı *</label>
                    <input 
                      type="number" 
                      required
                      placeholder="Örn: 3"
                      value={newCourse.branchesCount}
                      onChange={(e) => setNewCourse({...newCourse, branchesCount: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Programlar / Sınıflar (Virgülle Ayırın)</label>
                    <input 
                      type="text" 
                      placeholder="Örn: Sayısal Derece Grubu, Geometri Atölyesi"
                      value={newCourse.classes}
                      onChange={(e) => setNewCourse({...newCourse, classes: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-500 block mb-1">Haftalık Yoğunluk / Saatler</label>
                    <input 
                      type="text" 
                      placeholder="Örn: Haftalık 16 Saat Direksiyon"
                      value={newCourse.hoursPerWeek}
                      onChange={(e) => setNewCourse({...newCourse, hoursPerWeek: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Yıllık/Paket veya Aylık Ort. Ücret</label>
                    <input 
                      type="text" 
                      placeholder="Örn: ₺12.500"
                      value={newCourse.priceRange}
                      onChange={(e) => setNewCourse({...newCourse, priceRange: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-zinc-950 hover:bg-zinc-900 text-[#39FF14] font-black py-3 rounded-xl transition text-center shadow-md cursor-pointer"
                  >
                    Kursa Kaydet &amp; Yayınla
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* DETAYLI KURS/MERKEZ PROFİL MODAL (PROFIL SAYFASI ALTYAPISI) */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs select-none">
          <div className="bg-[#FAF9F5] border border-zinc-200 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] animate-fade-in animate-duration-200">
            
            {/* Header / Cover */}
            <div className="relative aspect-video w-full h-48 sm:h-60 shrink-0 select-none">
              <img src={selectedCourse.image} alt={selectedCourse.name} className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
              <button 
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-emerald-600 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">
                  {selectedCourse.type} Kurs Profili
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-display leading-tight">{selectedCourse.name}</h2>
                <p className="text-xs text-zinc-300 font-semibold mt-1 flex items-center gap-1">
                  📍 {selectedCourse.location}
                </p>
              </div>
            </div>

            {/* Content Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 select-none">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-zinc-200 p-3 rounded-2xl text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase font-mono">Şube Sayısı</span>
                  <span className="text-sm font-black text-zinc-900 mt-1 block">{selectedCourse.branchesCount || 1} Şube</span>
                </div>
                <div className="bg-white border border-zinc-200 p-3 rounded-2xl text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase font-mono">Sınıf Yapısı</span>
                  <span className="text-sm font-black text-zinc-900 mt-1 block">~{selectedCourse.averageClassSize || 6} Kişilik</span>
                </div>
                <div className="bg-white border border-zinc-200 p-3 rounded-2xl text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase font-mono">Ort. Ücret</span>
                  <span className="text-sm font-black text-[#E58F49] mt-1 block font-mono">{selectedCourse.priceRange}</span>
                </div>
                <div className="bg-white border border-zinc-200 p-3 rounded-2xl text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block uppercase font-mono">Haftalık Saat</span>
                  <span className="text-[11px] font-bold text-zinc-800 mt-1 block leading-tight">{selectedCourse.hoursPerWeek}</span>
                </div>
              </div>

              {/* Sınıflar / Seviyeler */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#E58F49]">🎯 Mevcut Hazırlık Sınıfları &amp; Seviyeler</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedCourse.classes.map((cls, index) => (
                    <span key={index} className="bg-zinc-100/90 border border-zinc-200 text-zinc-850 px-2.5 py-1 text-xs rounded-xl font-bold">
                      {cls}
                    </span>
                  ))}
                </div>
              </div>

              {/* Veli/Öğrenci Yorumu */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#8C3F03] block">⭐ Akredite Kursiyer Görüşü:</span>
                <p className="text-xs text-zinc-700 italic font-semibold">
                  "{selectedCourse.parentReviewText || 'Öğretmenlerin ilgisi ve etüt takipleri gerçekten çok disiplinli.'}"
                </p>
                <span className="text-[10px] text-zinc-400 font-bold block text-right">— {selectedCourse.reviewerName || 'Misafir Öğrenci'}</span>
              </div>

              {/* SOCIAL MEDIA SHARE COMPONENT IN THE PROFILE MODAL */}
              <div className="pt-2 border-t border-zinc-200">
                <ShareButtons title={selectedCourse.name} type="kurs" />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="bg-zinc-50 border-t border-zinc-200 px-6 py-4 flex items-center justify-between shrink-0">
              <button 
                onClick={() => setSelectedCourse(null)}
                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-xs font-black px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                Kapat
              </button>
              <button 
                onClick={() => {
                  alert(`"${selectedCourse.name}" için randevu talebiniz İstanbul Eğitim Pazaryeri güvencesiyle sıraya alındı! Temsilcimiz sizinle en kısa sürede iletişime geçecektir.`);
                }}
                className="bg-red-600 hover:bg-zinc-950 text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow-md cursor-pointer"
              >
                Randevu Al
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}



