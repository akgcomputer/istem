import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, EyeOff, Eye, Trash2, X } from 'lucide-react';
import { TeacherForm, CourseForm, SchoolForm, SpecialCourseForm, ChallengeForm } from './AdminForms';

import { COURSES } from '../../data';
import { MOCK_TEACHERS, MOCK_SPECIAL_COURSES } from '../../data/catalogData';

export default function AdminContentTab() {
  const [activeSubTab, setActiveSubTab] = useState('teachers');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null); // null means + Ekle, object means Düzenle

  const fetchTabContent = async (resetPage = false, currentSearch = searchQuery) => {
    setLoading(true);
    const currentPage = resetPage ? 0 : page;
    try {
      // D1/Cloudflare backend is not active in this environment, using static data logic for frontend demo
      
      let items: any[] = [];
      if (activeSubTab === 'teachers') items = MOCK_TEACHERS;
      else if (activeSubTab === 'courses') items = COURSES;
      else if (activeSubTab === 'special_courses') items = MOCK_SPECIAL_COURSES;
      else if (activeSubTab === 'schools') items = []; // No mock static export directly
      else if (activeSubTab === 'challenges') items = [];

      if (currentSearch) {
        items = items.filter(item => 
          (item.title || item.name || '').toLowerCase().includes(currentSearch.toLowerCase())
        );
      }

      const paginatedItems = items.slice(currentPage * LIMIT, (currentPage + 1) * LIMIT);
      
      if (resetPage) {
        setData(paginatedItems);
      } else {
        setData(prev => [...prev, ...paginatedItems]);
      }
      
      setHasMore(paginatedItems.length === LIMIT);
      setPage(currentPage + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTabContent(true, searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, activeSubTab]);

  const handleToggleStatus = async (item: any) => {
    const newStatus = item.isActive === undefined ? 0 : (item.isActive === 1 ? 0 : 1);
    try {
      // D1/Cloudflare backend is not active in this environment, using static data logic for frontend demo
      setData(data.map(d => d.id === item.id ? { ...d, isActive: newStatus } : d));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Emin misiniz? Bu işlem geri alınamaz!')) return;
    try {
      // D1/Cloudflare backend is not active in this environment, using static data logic for frontend demo
      setData(data.filter(d => d.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenModal = (item: any = null) => {
    setModalData(item);
    setIsModalOpen(true);
  };

  const handleSaveForm = async (formData: any) => {
    try {
      const isEdit = !!modalData;
      // D1/Cloudflare backend is not active in this environment, using static data logic for frontend demo
      
      if (isEdit) {
        setData(data.map(d => d.id === modalData.id ? { ...d, ...formData } : d));
      } else {
        const newItem = { id: `new-${Date.now()}`, ...formData };
        setData([newItem, ...data]);
      }
      
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      alert('Ağ hatası oluştu.');
    }
  };

  return (
    <div className="bg-white p-6 border border-zinc-200/60 rounded-2xl shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold font-display text-zinc-950">Gelişmiş İçerik Yönetimi (CMS)</h3>
          <p className="text-xs text-zinc-500 font-medium">Öğretmenler, Dersler, Okullar, Kurslar ve Challenge etkinliklerini yönetin.</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-zinc-200 pb-2 overflow-x-auto">
        {[
          { id: 'teachers', label: 'Öğretmenler' },
          { id: 'courses', label: 'Dersler (E-Eğitim)' },
          { id: 'schools', label: 'Özel Okullar' },
          { id: 'special_courses', label: 'Kurslar' },
          { id: 'challenges', label: 'Challenge Arena' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition whitespace-nowrap ${activeSubTab === tab.id ? 'bg-[#FF6600] text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="İsim veya başlık ile tüm kayıtlarda ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#FF6600] font-medium"
          />
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-[#FF6600] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#d47d38] transition"
        >
          <Plus className="w-4 h-4" /> Ekle
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 text-xs text-zinc-500">
              <th className="py-3 px-4 font-semibold">İsim / Başlık</th>
              <th className="py-3 px-4 font-semibold">Durum</th>
              <th className="py-3 px-4 font-semibold text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className={`border-b border-zinc-100 transition hover:bg-zinc-50/50 ${item.isActive === 0 ? 'opacity-60' : ''}`}>
                <td className="py-3 px-4">
                  <div className="font-bold text-sm text-zinc-900">{item.title || item.name || 'İsimsiz İçerik'}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">ID: {item.id}</div>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${item.isActive === 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                    {item.isActive === 0 ? 'Durduruldu' : 'Yayında'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="flex items-center gap-1.5 text-[11px] bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-1.5 rounded transition font-bold"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Düzenle
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(item)}
                      className="flex items-center gap-1.5 text-[11px] bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-1.5 rounded transition font-bold"
                    >
                      {item.isActive === 0 ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {item.isActive === 0 ? 'Yayınla' : 'Durdur'}
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1.5 text-[11px] bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded transition font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && !loading && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-zinc-400 text-xs font-medium">
                  Kayıt bulunamadı. Lütfen internet bağlantınızı veya API durumunu kontrol edin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {hasMore && !loading && (
        <div className="flex justify-center pt-4">
          <button onClick={() => fetchTabContent()} className="bg-zinc-100 text-zinc-600 px-6 py-2 rounded-full text-xs font-bold hover:bg-zinc-200 transition">
            Daha Fazla Yükle
          </button>
        </div>
      )}
      
      {loading && (
        <div className="text-center py-4 text-xs text-zinc-500 font-bold">Yükleniyor...</div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              {activeSubTab === 'teachers' && <TeacherForm initialData={modalData} onSubmit={handleSaveForm} onCancel={() => setIsModalOpen(false)} />}
              {activeSubTab === 'courses' && <CourseForm initialData={modalData} onSubmit={handleSaveForm} onCancel={() => setIsModalOpen(false)} />}
              {activeSubTab === 'schools' && <SchoolForm initialData={modalData} onSubmit={handleSaveForm} onCancel={() => setIsModalOpen(false)} />}
              {activeSubTab === 'special_courses' && <SpecialCourseForm initialData={modalData} onSubmit={handleSaveForm} onCancel={() => setIsModalOpen(false)} />}
              {activeSubTab === 'challenges' && <ChallengeForm initialData={modalData} onSubmit={handleSaveForm} onCancel={() => setIsModalOpen(false)} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
