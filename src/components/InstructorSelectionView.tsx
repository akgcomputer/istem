import { ArrowLeft, Star, Clock, CheckCircle2, Award, Briefcase } from 'lucide-react';
import { Course } from '../types';
import { MOCK_TEACHERS, Teacher } from '../data/catalogData';

interface InstructorSelectionViewProps {
  course: Course;
  onSelectTeacher: (course: Course, teacher: Teacher) => void;
  onBack: () => void;
}

export default function InstructorSelectionView({ course, onSelectTeacher, onBack }: InstructorSelectionViewProps) {
  // Find teachers that match this course category or title
  const availableTeachers = MOCK_TEACHERS.filter(teacher => 
    teacher.category === course.category || 
    teacher.sessions.some(s => s.name.toLowerCase().includes(course.title.toLowerCase()) || course.title.toLowerCase().includes(s.name.toLowerCase()))
  );

  // If no specific match, show top rated teachers from that category
  const displayTeachers = availableTeachers.length > 0 
    ? availableTeachers 
    : MOCK_TEACHERS.filter(t => t.category === course.category).slice(0, 4);

  // Fallback to top teachers overall if still empty
  const finalTeachers = displayTeachers.length > 0 ? displayTeachers : MOCK_TEACHERS.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 transition mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center group-hover:border-[#FF6600] group-hover:text-[#FF6600] transition">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm">Geri Dön</span>
        </button>

        <div className="bg-white border border-zinc-200 p-6 md:p-10 rounded-3xl mb-10 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FF6600]/10 to-transparent rounded-bl-full pointer-events-none" />
          
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full md:w-48 h-48 object-cover rounded-2xl shadow-md z-10"
          />
          <div className="flex-1 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-xs font-bold mb-3">
              <span>{course.category}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black font-display text-zinc-900 mb-3 tracking-tight">
              {course.title}
            </h1>
            <p className="text-zinc-600 font-medium leading-relaxed max-w-2xl">
              Bu ders için uzman eğitmen kadromuz aşağıda listelenmiştir. Hedeflerinize en uygun eğitmeni seçerek hemen programınızı planlamaya başlayın.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-zinc-900">Eğitmenini Seç</h2>
            <p className="text-sm text-zinc-500 mt-1">Bu branşta {finalTeachers.length} uzman eğitmen bulundu</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {finalTeachers.map(teacher => (
            <div 
              key={teacher.id} 
              className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-xl hover:border-[#FF6600]/30 transition-all duration-300 group flex flex-col"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="relative">
                  <img 
                    src={teacher.avatar} 
                    alt={teacher.name} 
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md group-hover:border-[#FF6600] transition"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-lg group-hover:text-[#FF6600] transition leading-tight">
                    {teacher.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-amber-500 font-bold mt-1.5">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{teacher.rating}</span>
                    <span className="text-zinc-400 font-medium ml-1">({teacher.commentsCount} Yorum)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {teacher.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-zinc-50 border border-zinc-150 text-zinc-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
                {teacher.tags.length > 3 && (
                  <span className="px-2.5 py-1 bg-zinc-50 border border-zinc-150 text-zinc-400 rounded-lg text-[10px] font-bold">
                    +{teacher.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Briefcase className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-semibold">{teacher.experienceLabel} Deneyim</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <Award className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-semibold">Onaylı Eğitmen</span>
                </div>
              </div>
              
              <div className="mt-auto">
                <button 
                  onClick={() => onSelectTeacher(course, teacher)}
                  className="w-full py-3.5 bg-zinc-900 hover:bg-[#FF6600] text-white rounded-xl font-bold text-sm transition shadow-md shadow-zinc-200"
                >
                  Bu Eğitmeni Seç
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
