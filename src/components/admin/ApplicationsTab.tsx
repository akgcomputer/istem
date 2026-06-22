import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';

export interface Application {
  id: string;
  type: string;
  applicant: string;
  details: string;
  date: string;
  status: string;
}

interface ApplicationsTabProps {
  applications: Application[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function ApplicationsTab({ applications, onApprove, onReject }: ApplicationsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const appOnayCount = applications.filter(a => a.status === 'Onaylandı').length;
  const appRedCount = applications.filter(a => a.status === 'Reddedildi').length;
  const appBekleyenCount = applications.filter(a => a.status === 'Beklemede' || a.status === 'İnceleniyor').length;

  const filtered = applications.filter(app => 
    app.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-6 border border-zinc-200/60 rounded-2xl shadow-2xs space-y-6">
      <div className="text-left">
        <h3 className="text-base font-extrabold font-display text-zinc-950">Başvuru Yönetimi (Onay/Red Kuyruğu)</h3>
        <p className="text-xs text-zinc-500 font-medium">Platforma katılmak isteyen eğitmen, okul ve kurs temsilcilerinin belgelerini denetleyin.</p>
      </div>

      {/* High contrast counters row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-amber-500/10 border border-amber-250 p-3 rounded-2xl text-center">
          <span className="text-[9.5px] text-amber-850 font-black block uppercase tracking-wide">Bekleyen</span>
          <span className="font-mono font-black text-sm text-amber-800">{appBekleyenCount} Başvuru</span>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-250 p-3 rounded-2xl text-center">
          <span className="text-[9.5px] text-emerald-800 font-black block uppercase tracking-wide">Onaylanan</span>
          <span className="font-mono font-black text-sm text-emerald-800">{appOnayCount} Onay</span>
        </div>
        <div className="bg-rose-500/10 border border-rose-250 p-3 rounded-2xl text-center">
          <span className="text-[9.5px] text-rose-800 font-black block uppercase tracking-wide">Reddedilen</span>
          <span className="font-mono font-black text-sm text-rose-800">{appRedCount} Red</span>
        </div>
      </div>

      {/* Search box */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400 font-bold" />
        <input 
          type="text" 
          placeholder="Başvuru Sahibi, Detay veya Tip İle Ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#E58F49] font-medium"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        {filtered.map(app => (
          <div 
            key={app.id} 
            className={`p-3.5 border rounded-xl flex flex-col justify-between gap-3 min-h-[175px] transition duration-150 ${
              app.status === 'Beklemede' || app.status === 'İnceleniyor'
                ? 'border-amber-250 bg-amber-500/5' 
                : 'border-zinc-150 bg-zinc-50/50'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="bg-zinc-800 text-white text-[8px] font-mono px-1.5 py-0.5 rounded font-black uppercase">{app.type}</span>
                <span className="text-[9px] text-zinc-400 font-mono">{app.date}</span>
              </div>
              <h4 className="text-xs font-extrabold text-zinc-900 leading-tight block line-clamp-1">{app.applicant}</h4>
              <p className="text-[10px] text-zinc-500 leading-snug line-clamp-3 min-h-[42px]">{app.details}</p>
            </div>

            <div className="pt-2 border-t border-zinc-200/50 flex items-center justify-end">
              {app.status === 'Beklemede' || app.status === 'İnceleniyor' ? (
                <div className="flex gap-1 w-full">
                  <button 
                    type="button"
                    onClick={() => onReject(app.id)}
                    className="flex-1 bg-red-50 hover:bg-rose-100 text-red-700 text-[10px] font-black py-1.5 rounded-lg transition"
                  >
                    Reddet
                  </button>
                  <button 
                    type="button"
                    onClick={() => onApprove(app.id)}
                    className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 text-[10px] font-black py-1.5 rounded-lg transition flex items-center justify-center gap-0.5"
                  >
                    <Check className="w-3 h-3" />
                    <span>Onayla</span>
                  </button>
                </div>
              ) : (
                <span className={`text-[10px] font-black tracking-wide flex items-center gap-0.5 justify-center w-full py-1 rounded-sm ${
                  app.status === 'Onaylandı' ? 'text-emerald-700 bg-emerald-500/10' : 'text-red-700 bg-rose-500/10'
                }`}>
                  {app.status === 'Onaylandı' ? '✓ Onaylandı' : '✗ Reddedildi'}
                </span>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-8 text-center text-zinc-400 text-xs font-medium">
            Arama kriterlerine uygun başvuru bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
