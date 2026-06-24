import React from 'react';
import { 
  ArrowLeft, Star, MapPin, MessageSquare, BadgeCheck, Phone, Mail, 
  Clock, Calendar, BookOpen, Sparkles, Building2, Laptop, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { Teacher } from '../data/catalogData';
import { Course } from '../types';
import ShareButtons from './ShareButtons';

interface TeacherProfileViewProps {
  teacher: Teacher;
  onBack: () => void;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export default function TeacherProfileView({ 
  teacher, 
  onBack, 
  courses, 
  onSelectCourse 
}: TeacherProfileViewProps) {
  
  const handleCourseLinkClick = (sessionName: string, linkedCourseId?: string) => {
    if (linkedCourseId) {
      const target = courses.find(c => c.id === linkedCourseId);
      if (target) {
        onSelectCourse(target);
        return;
      }
    }
    // Fallback search
    const match = courses.find(c => 
      c.title.toLowerCase().includes(sessionName.toLowerCase().slice(0, 10)) ||
      c.category.toLowerCase().includes(sessionName.toLowerCase().slice(0, 10))
    );
    onSelectCourse(match || courses[0]);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-650 hover:text-zinc-950 text-xs font-bold transition mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Öğretmen Kataloğuna Geri Dön
        </button>

        <div className="space-y-6">
          
          {/* Header profile banner */}
          <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative shrink-0">
                <img 
                  src={teacher.avatar?.includes('ui-avatars.com') && !teacher.avatar.includes('size=') ? teacher.avatar + '&size=256' : teacher.avatar} 
                  alt={teacher.name} 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white shadow-md"
                />
                <span className="absolute -bottom-1.5 -right-1.5 bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-lg text-[10px] font-black border border-amber-500/20 whitespace-nowrap shadow-xs">
                  {teacher.experienceLabel === '+10 Yıldan Fazla' ? '+10 Yıl' : teacher.experienceLabel === '+5 Yıldan Fazla' ? '+5 Yıl' : teacher.experienceLabel} Tecrübe
                </span>
              </div>
              
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <span className="text-[10px] bg-emerald-500 text-white px-2.5 py-0.5 rounded-md font-extrabold flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5" /> Doğrulanmış eğitmen
                  </span>
                  <span className="text-[10px] bg-zinc-900 text-white px-2.5 py-0.5 rounded-md font-extrabold">
                    {teacher.category}
                  </span>
                </div>
                
                <h1 className="text-xl sm:text-2.5xl font-black text-zinc-950">
                  {teacher.name}
                </h1>
                
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-xs font-semibold text-zinc-500">
                  <span className="flex items-center text-amber-500 font-bold">
                    ★ <strong className="text-zinc-800 ml-0.5">{teacher.rating.toFixed(1)}</strong>
                  </span>
                  <span className="text-zinc-300">|</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                    {teacher.commentsCount} tescilli veli ve öğrenci yorumu
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-2xl flex flex-col items-center justify-center text-center max-w-xs mx-auto shrink-0">
              <span className="text-[10px] font-bold text-zinc-400 block mb-1">Başlangıç Seans Ücreti</span>
              <span className="text-2xl font-black text-zinc-900 font-mono">
                {Math.min(...(teacher.sessions || []).map(s => s.price))}₺ <span className="text-xs font-normal text-zinc-500">/saat</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-bold mt-1.5 bg-amber-50 border border-amber-200/50 text-[#8C3F03] px-2 py-0.5 rounded-md">
                Komisyonsuz Direkt Ödeme
              </span>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left detail Column (span 8) */}
            <div className="md:col-span-8 space-y-6">
              
              {/* 1. Biyografi */}
              <div className="bg-white border border-zinc-200/60 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-black text-zinc-950 border-b border-zinc-100 pb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF6600]" />
                  Eğitmen Hakkında Bilgi
                </h3>
                <p className="text-xs text-zinc-700 leading-relaxed font-semibold whitespace-pre-line">
                  {teacher.bio}
                </p>
              </div>

              {/* 2. Verdiği Dersler ve Ücretleri */}
              <div className="bg-white border border-zinc-200/60 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-zinc-950 border-b border-zinc-100 pb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#FF6600]" />
                  📚 Verdiği dersler ve ücretleri:
                </h3>
                <p className="text-[11px] text-zinc-500 -mt-2">
                  Dilediğiniz dersi seçerek anında eğitim programınızı başlatabilir ve sepet adımlarına geçebilirsiniz.
                </p>
                <div className="space-y-3">
                  {(teacher.sessions || []).slice(0, 5).map((sess, idx) => (
                    <div 
                      key={idx}
                      className="bg-zinc-50 border border-zinc-250/50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition"
                    >
                      <div className="text-left space-y-1">
                        <span className="font-extrabold text-sm text-[#FF6600] block leading-tight">
                          {sess.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-zinc-900 block bg-zinc-200/50 px-2 py-0.5 rounded">
                            {sess.price}₺ <span className="text-[9px] text-zinc-500 font-medium">/saat</span>
                          </span>
                          {sess.courseId && (
                            <span className="inline-block text-[9px] bg-indigo-50 border border-indigo-150 text-indigo-700 px-2 py-0.5 rounded font-black font-mono">
                              Müfredat entegre
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCourseLinkClick(sess.name, sess.courseId)}
                        className="bg-[#FF6600] hover:bg-zinc-950 text-zinc-950 hover:text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition duration-150 shadow-xs whitespace-nowrap text-center active:scale-95 shrink-0"
                      >
                        Eğitim Al
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Çalışma Konum ve Şekilleri */}
              <div className="bg-white border border-zinc-200/60 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-zinc-950 border-b border-zinc-100 pb-2">
                  📍 Yüz yüze konum ve eğitim modelleri
                </h3>
                
                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex items-start gap-2 bg-zinc-50 p-4 rounded-2xl border border-zinc-150">
                    <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="block font-bold text-zinc-400 text-[9px]">Yüz yüze ders verebildiği konum:</span>
                      <span className="text-zinc-900 font-extrabold mt-0.5 block">{teacher.preferredLocation}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-zinc-50/60 p-3 rounded-xl border border-zinc-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Laptop className={`w-4 h-4 ${teacher.canOnline ? 'text-emerald-500' : 'text-zinc-300'}`} />
                        <span className="font-bold">Online Sınıflar</span>
                      </div>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${teacher.canOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-red-55 text-zinc-400 line-through'}`}>
                        {teacher.canOnline ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>

                    <div className="bg-zinc-50/60 p-3 rounded-xl border border-zinc-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className={`w-4 h-4 ${teacher.canCorporate ? 'text-emerald-500' : 'text-zinc-300'}`} />
                        <span className="font-bold">Kurumsal Eğitim</span>
                      </div>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${teacher.canCorporate ? 'bg-emerald-100 text-emerald-800' : 'bg-red-55 text-zinc-400 line-through'}`}>
                        {teacher.canCorporate ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right sidebar Column (span 4) */}
            <div className="md:col-span-4 space-y-6 md:sticky md:top-20">
              
              {/* Cozy info box */}
              <div className="bg-white border border-zinc-250/50 rounded-3xl p-5 space-y-4">
                <span className="text-[10px] text-zinc-400 font-bold block">Ödeme ve Süreç Bilgisi</span>
                <p className="text-xs text-zinc-650 leading-relaxed font-semibold">
                  Seçtiğiniz eğitimlerin yanındaki <strong>"Eğitim Al"</strong> butonunu kullanarak, doğrudan sistem üzerindeki güvenli ödeme sepetine ve ders çalışma alanına yönlendirilirsiniz.
                </p>
                <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-150 p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Komisyon alınmaz, tüm ücret eğitmene aittir.</span>
                </div>
              </div>

              {/* SOCIAL MEDIA SHARE COMPONENT */}
              <div className="bg-white border border-zinc-250/50 rounded-3xl p-5">
                <ShareButtons title={teacher.name} type="öğretmen" />
              </div>

              {/* Side tags box */}
              <div className="bg-zinc-50 border border-zinc-200/60 rounded-3xl p-5 space-y-2.5">
                <span className="text-zinc-400 text-[10px] block font-bold">Uzmanlık etiketleri</span>
                <div className="flex flex-wrap gap-1.5">
                  {(teacher.tags || []).map((tag, i) => (
                    <span key={i} className="text-[10px] bg-white border border-zinc-150 text-zinc-650 px-2.5 py-1 rounded-xl font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
