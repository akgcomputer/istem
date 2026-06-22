import React, { useState } from 'react';
import { Search, Building, PlusCircle, Trash2 } from 'lucide-react';

export interface School {
  id: string;
  name: string;
  location: string;
  capacity: number;
  teachersCount: number;
  type: 'okul';
}

interface SchoolsTabProps {
  schools: School[];
  onAddSchool: (school: Omit<School, 'id'>) => void;
  onDeleteSchool: (id: string) => void;
}

export default function SchoolsTab({ schools, onAddSchool, onDeleteSchool }: SchoolsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCapacity, setNewCapacity] = useState('');
  const [newTeachers, setNewTeachers] = useState('');

  const filtered = schools.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newLocation) {
      alert('Lütfen Okul Adı ve Lokasyon bilgilerini giriniz.');
      return;
    }
    onAddSchool({
      name: newName,
      location: newLocation,
      capacity: Number(newCapacity) || 150,
      teachersCount: Number(newTeachers) || 10,
      type: 'okul'
    });
    setNewName('');
    setNewLocation('');
    setNewCapacity('');
    setNewTeachers('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white p-6 border border-zinc-200/60 rounded-2xl shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h3 className="text-base font-extrabold font-display text-zinc-950">Özel Okul/Kolej Yönetimi</h3>
          <p className="text-xs text-zinc-500">Sisteme kayıtlı özel eğitim kurumlarını ekleyin, listeleyin ve kapasitelerini kontrol edin.</p>
        </div>
        <button 
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#E58F49] hover:bg-[#D4803A] text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Yeni Okul Ekle
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-4 bg-zinc-50 border border-zinc-150 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase">Okul Adı</label>
            <input 
              type="text"
              required
              placeholder="Örn: Kuzey Koleji"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#E58F49] font-bold text-zinc-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase">Şehir / Semt</label>
            <input 
              type="text"
              required
              placeholder="Örn: Sarıyer, İstanbul"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#E58F49] font-bold text-zinc-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase">Kapasite</label>
            <input 
              type="number"
              placeholder="Örn: 250"
              value={newCapacity}
              onChange={(e) => setNewCapacity(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#E58F49] font-bold text-zinc-800"
            />
          </div>
          <div className="space-y-1 flex flex-col justify-end">
            <button 
              type="submit"
              className="w-full bg-zinc-900 text-white font-bold text-xs py-2 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
            >
              Kaydet
            </button>
          </div>
        </form>
      )}

      {/* Search box */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400 font-bold" />
        <input 
          type="text" 
          placeholder="İsim veya Konuma Göre Ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#E58F49] font-medium"
        />
      </div>

      {/* Schools List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
        {filtered.map(school => (
          <div key={school.id} className="p-4 border border-zinc-150 rounded-xl bg-zinc-50/40 flex flex-col justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#E58F49]">
                <Building className="w-4 h-4 shrink-0" />
                <span className="text-[10px] font-bold tracking-wider uppercase font-mono">Okul / Kolej</span>
              </div>
              <h4 className="text-xs font-black text-zinc-950 leading-tight line-clamp-2 min-h-[32px]">{school.name}</h4>
              <p className="text-[11px] text-zinc-500 font-medium">{school.location}</p>
            </div>

            <div className="pt-3 border-t border-zinc-200/50 flex items-center justify-between text-[11px] font-mono font-bold text-zinc-600">
              <div>
                Cap: <span className="text-zinc-800 font-black">{school.capacity} Öğr</span>
              </div>
              <div>
                Tch: <span className="text-zinc-800 font-black">{school.teachersCount || 10} Eğitmen</span>
              </div>
              <button 
                type="button" 
                onClick={() => onDeleteSchool(school.id)}
                className="text-red-600 hover:text-red-800 p-1 shrink-0 transition"
                title="Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-8 text-center text-zinc-400 text-xs font-medium">
            Arama kriterlerine uygun okul kayıtı bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
