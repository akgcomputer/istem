import React from 'react';

interface ReportsTabProps {
  onExportExcel?: () => void;
}

export default function ReportsTab({ onExportExcel }: ReportsTabProps) {
  const handleExport = () => {
    if (onExportExcel) {
      onExportExcel();
    } else {
      alert('📊 Excel/CSV Dışa Aktarımı:\n\nSon 30 günlük satış raporu, kullanıcı listesi ve eğitmen katılım oranları Excel tablosu olarak cihazınıza yüklenmiştir.');
    }
  };

  return (
    <div className="bg-white p-6 border border-zinc-200/60 rounded-2xl shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h3 className="text-base font-extrabold font-display text-zinc-950">İstatistik &amp; Raporlar</h3>
          <p className="text-xs text-zinc-500">Platformun haftalık büyüme oranlarını, popüler ders kategorilerini ve kullanıcı kırılım istatistiklerini raporlayın.</p>
        </div>
        <button 
          type="button"
          onClick={handleExport}
          className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-bold px-3.5 py-2.5 rounded-xl transition cursor-pointer"
        >
          Verileri CSV/Excel Olarak İndir
        </button>
      </div>

      {/* Sub-menu features visual graphic representation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        
        {/* Performance stats */}
        <div className="bg-[#FAF9F5] p-5 border border-zinc-150 rounded-2xl space-y-3 text-xs leading-relaxed">
          <span className="text-[10px] text-zinc-400 font-bold block uppercase">KULLANICI KIRILIM ORANLARI</span>
          <div className="space-y-2">
            <div className="flex justify-between font-bold text-zinc-850">
              <span>Bireysel Öğrenciler:</span>
              <span>%72</span>
            </div>
            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
              <div className="bg-[#FF6600] h-full" style={{ width: '72%' }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between font-bold text-zinc-850">
              <span>Bağımsız Eğitmenler:</span>
              <span>%18</span>
            </div>
            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
              <div className="bg-[#FF6600] h-full" style={{ width: '18%' }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between font-bold text-zinc-850">
              <span>Kurumsal / Okul / Kurs Temsilcileri:</span>
              <span>%10</span>
            </div>
            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
              <div className="bg-[#FF6600] h-full" style={{ width: '10%' }} />
            </div>
          </div>
        </div>

        {/* Populer charts info */}
        <div className="bg-[#FAF9F5] p-5 border border-zinc-150 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-[#FF6600] font-black uppercase tracking-wider block">CHALLENGE ANALYTICS YAPILANDIRMASI</span>
            <h4 className="text-xs font-black text-zinc-900 mt-1">Ödev &amp; Challenge Tamamlanma Başarı Sıklığı</h4>
            <p className="text-[11px] text-zinc-550 leading-relaxed mt-1">Öğrencilerin challenge maratonlarında kod teslim etme ortalama tamamlanma sıklığı %86 seviyesinde rekor düzeydedir.</p>
          </div>
          <div className="text-[10px] text-zinc-400 font-semibold font-mono mt-3">
            ✓ Ortalama Jüri Skoru: 84.50 / 100
          </div>
        </div>

      </div>
    </div>
  );
}
