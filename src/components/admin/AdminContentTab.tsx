import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, X, Image as ImageIcon, GripVertical, CheckSquare, Square, Globe, ShieldAlert, CheckCircle2, ChevronDown } from 'lucide-react';
import { TeacherForm, CourseForm, SchoolForm, SpecialCourseForm, ChallengeForm } from './AdminForms';

import { COURSES } from '../../data';
import { MOCK_TEACHERS, MOCK_SPECIAL_COURSES } from '../../data/catalogData';

export default function AdminContentTab() {
  const [activeSubTab, setActiveSubTab] = useState('teachers');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tümü');
  
  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination states
  const [page, setPage] = useState(1);
  const LIMIT = 15;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null); // null means + Ekle, object means Düzenle

  // SEO Modal State
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [seoData, setSeoData] = useState<any>(null);
  
  // Dynamic Items Derivation
  const rawItems = useMemo(() => {
    let items: any[] = [];
    switch (activeSubTab) {
      case 'teachers': items = MOCK_TEACHERS; break;
      case 'courses': items = COURSES; break;
      case 'special_courses': items = MOCK_SPECIAL_COURSES; break;
      case 'schools': items = []; break;
      case 'challenges': items = []; break;
      default: items = []; break;
    }
    
    // Inject mock CMS fields if they don't exist
    return items.map(item => ({
      ...item,
      cmsStatus: item.cmsStatus || (item.isActive === 0 ? 'draft' : 'published'),
      seoTitle: item.seoTitle || item.title || item.name || '',
      seoDesc: item.seoDesc || item.bio || item.description || '',
      slug: item.slug || (item.title || item.name || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    }));
  }, [activeSubTab, page]);

  // Filtering
  const filteredItems = useMemo(() => {
    let filtered = rawItems;
    if (searchQuery) {
      filtered = filtered.filter(item => {
        const text = item.title || item.name || item.slug || '';
        return text.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    if (filterStatus !== 'Tümü') {
      const targetStatus = filterStatus === 'Yayınlandı' ? 'published' : (filterStatus === 'Taslak' ? 'draft' : 'review');
      filtered = filtered.filter(item => item.cmsStatus === targetStatus);
    }
    return filtered;
  }, [rawItems, searchQuery, filterStatus]);

  const paginatedItems = filteredItems.slice(0, page * LIMIT);
  const hasMore = paginatedItems.length < filteredItems.length;

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  
  const toggleAll = () => {
    if (selectedIds.length === paginatedItems.length && paginatedItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedItems.map(i => i.id));
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    const item = rawItems.find(i => i.id === id);
    if (item) {
      item.cmsStatus = newStatus;
      item.isActive = newStatus === 'published' ? 1 : 0;
      setPage(p => p); // Trigger re-render
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Emin misiniz? Bu işlem geri alınamaz!')) return;
    const index = rawItems.findIndex((d: any) => d.id === id);
    if (index > -1) {
      rawItems.splice(index, 1);
      let originalArr: any[] = [];
      if (activeSubTab === 'teachers') originalArr = MOCK_TEACHERS;
      else if (activeSubTab === 'courses') originalArr = COURSES;
      else if (activeSubTab === 'special_courses') originalArr = MOCK_SPECIAL_COURSES;
      
      const origIndex = originalArr.findIndex((d: any) => d.id === id);
      if (origIndex > -1) originalArr.splice(origIndex, 1);
      setPage(p => p);
    }
  };

  const handleBulkDelete = () => {
    if (!confirm(`${selectedIds.length} öğeyi silmek istediğinize emin misiniz?`)) return;
    selectedIds.forEach(id => {
      let originalArr: any[] = [];
      if (activeSubTab === 'teachers') originalArr = MOCK_TEACHERS;
      else if (activeSubTab === 'courses') originalArr = COURSES;
      else if (activeSubTab === 'special_courses') originalArr = MOCK_SPECIAL_COURSES;
      
      const origIndex = originalArr.findIndex((d: any) => d.id === id);
      if (origIndex > -1) originalArr.splice(origIndex, 1);
    });
    setSelectedIds([]);
    setPage(p => p);
  };

  const handleOpenModal = (item: any = null) => {
    setModalData(item);
    setIsModalOpen(true);
  };

  const handleSaveForm = async (formData: any) => {
    try {
      const isEdit = !!modalData;
      if (isEdit) {
        let originalArr: any[] = [];
        if (activeSubTab === 'teachers') originalArr = MOCK_TEACHERS;
        else if (activeSubTab === 'courses') originalArr = COURSES;
        else if (activeSubTab === 'special_courses') originalArr = MOCK_SPECIAL_COURSES;
        
        const origItem = originalArr.find(i => i.id === modalData.id);
        if (origItem) Object.assign(origItem, formData);
      } else {
        const newItem = { id: `new-${Date.now()}`, ...formData, cmsStatus: 'draft' };
        if (activeSubTab === 'teachers') MOCK_TEACHERS.unshift(newItem);
        else if (activeSubTab === 'courses') COURSES.unshift(newItem);
        else if (activeSubTab === 'special_courses') MOCK_SPECIAL_COURSES.unshift(newItem);
      }
      setIsModalOpen(false);
      setPage(p => p);
    } catch (e) {
      console.error(e);
      alert('Ağ hatası oluştu.');
    }
  };

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    let originalArr: any[] = [];
    if (activeSubTab === 'teachers') originalArr = MOCK_TEACHERS;
    else if (activeSubTab === 'courses') originalArr = COURSES;
    else if (activeSubTab === 'special_courses') originalArr = MOCK_SPECIAL_COURSES;
    
    const origItem = originalArr.find(i => i.id === seoData.id);
    if (origItem) {
      origItem.seoTitle = seoData.seoTitle;
      origItem.seoDesc = seoData.seoDesc;
      origItem.slug = seoData.slug;
    }
    setIsSeoModalOpen(false);
    setPage(p => p);
  };

  const calculateSeoScore = (item: any) => {
    let score = 0;
    if (item.seoTitle && item.seoTitle.length > 20) score += 33;
    if (item.seoDesc && item.seoDesc.length > 50) score += 33;
    if (item.slug && item.slug.length > 3) score += 34;
    return score;
  };

  return (
    <div className="bg-white p-6 border border-zinc-200/60 rounded-2xl shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold font-display text-zinc-950 flex items-center gap-2">
            Gelişmiş İçerik Yönetimi
            <span className="bg-[#FF6600]/10 text-[#FF6600] text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">CMS v2.0</span>
          </h3>
          <p className="text-sm text-zinc-500 font-medium mt-1">Öğretmenler, Dersler, Okullar ve etkinlikleri detaylı yönetin.</p>
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
            onClick={() => { setActiveSubTab(tab.id); setPage(1); setSearchQuery(''); setSelectedIds([]); setFilterStatus('Tümü'); }}
            className={`px-4 py-2.5 text-sm font-bold rounded-t-lg transition whitespace-nowrap border-b-2 ${activeSubTab === tab.id ? 'border-[#FF6600] text-[#FF6600] bg-[#FF6600]/5' : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-100">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="İsim, ID veya URL (Slug) ara..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full bg-white border border-zinc-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] font-medium transition"
            />
          </div>
          
          <select 
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="bg-white border border-zinc-200 text-zinc-700 w-full sm:w-auto text-sm rounded-lg px-3 py-2 font-medium focus:outline-none focus:border-[#FF6600]"
          >
            <option>Tümü</option>
            <option>Yayınlandı</option>
            <option>Taslak</option>
            <option>İncelemede</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end mt-2 sm:mt-0">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-bold border border-red-100 hover:bg-red-100 transition"
            >
              <Trash2 className="w-4 h-4" /> {selectedIds.length} Seçiliyi Sil
            </button>
          )}
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-[#FF6600] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#d47d38] transition shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Yeni Ekle
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-zinc-200 rounded-xl shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-500 font-bold uppercase tracking-wider">
              <th className="py-4 px-4 w-10 text-center">
                <button onClick={toggleAll} className="text-zinc-400 hover:text-zinc-600">
                  {selectedIds.length === paginatedItems.length && paginatedItems.length > 0 ? <CheckSquare className="w-4 h-4 text-[#FF6600]" /> : <Square className="w-4 h-4" />}
                </button>
              </th>
              <th className="py-4 px-2 w-10 text-center"></th>
              <th className="py-4 px-4 w-16">Medya</th>
              <th className="py-4 px-4">İçerik Detayları</th>
              <th className="py-4 px-4 w-32">Durum</th>
              <th className="py-4 px-4 w-24 text-center">SEO</th>
              <th className="py-4 px-4 text-right w-48">Hızlı İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {paginatedItems.map(item => {
              const isSelected = selectedIds.includes(item.id);
              const seoScore = calculateSeoScore(item);
              
              return (
                <tr key={item.id} className={`transition group ${isSelected ? 'bg-[#FF6600]/5' : 'hover:bg-zinc-50'} ${item.cmsStatus === 'draft' ? 'opacity-80' : ''}`}>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => toggleSelection(item.id)} className="text-zinc-300 hover:text-[#FF6600] transition">
                      {isSelected ? <CheckSquare className="w-4 h-4 text-[#FF6600]" /> : <Square className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <GripVertical className="w-4 h-4 text-zinc-300 cursor-grab hover:text-zinc-500 mx-auto" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-10 h-10 rounded-lg border border-zinc-200 overflow-hidden bg-zinc-100 flex items-center justify-center shrink-0">
                      {(item.image || item.avatar) ? (
                        <img src={item.image || item.avatar} alt="thumb" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-zinc-300" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-sm text-zinc-900 group-hover:text-[#FF6600] transition line-clamp-1">{item.title || item.name || 'İsimsiz İçerik'}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded font-mono">{item.id}</span>
                      <span className="text-[10px] text-zinc-400">/{item.slug}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="relative inline-block">
                      <select 
                        value={item.cmsStatus} 
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`appearance-none text-[11px] font-bold px-2.5 py-1 pr-6 rounded-full border focus:outline-none cursor-pointer transition
                          ${item.cmsStatus === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                          ${item.cmsStatus === 'draft' ? 'bg-zinc-100 text-zinc-600 border-zinc-200' : ''}
                          ${item.cmsStatus === 'review' ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}
                        `}
                      >
                        <option value="published">Yayınlandı</option>
                        <option value="draft">Taslak</option>
                        <option value="review">İncelemede</option>
                      </select>
                      <ChevronDown className="absolute right-1.5 top-1.5 w-3 h-3 pointer-events-none opacity-50" />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        {seoScore >= 90 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />}
                        <span className={`text-xs font-bold ${seoScore >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>%{seoScore}</span>
                      </div>
                      <div className="w-12 h-1 bg-zinc-200 rounded-full overflow-hidden">
                        <div className={`h-full ${seoScore >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${seoScore}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button 
                        onClick={() => { setSeoData(item); setIsSeoModalOpen(true); }}
                        title="SEO Ayarları"
                        className="p-2 text-zinc-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                      >
                        <Globe className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(item)}
                        title="Düzenle"
                        className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        title="Sil"
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {paginatedItems.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 mb-3">
                    <Search className="w-5 h-5 text-zinc-400" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900">Sonuç Bulunamadı</h4>
                  <p className="text-xs text-zinc-500 mt-1">Seçtiğiniz filtrelere uygun içerik bulunmuyor.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button onClick={() => setPage(p => p + 1)} className="bg-white border border-zinc-200 text-zinc-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-50 hover:text-zinc-900 transition shadow-xs">
            Daha Fazla İçerik Yükle ({filteredItems.length - paginatedItems.length} kaldı)
          </button>
        </div>
      )}

      {/* CONTENT EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl relative max-h-[90vh] overflow-y-auto border border-zinc-100">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-zinc-100 flex justify-between items-center z-10">
              <h2 className="text-lg font-bold text-zinc-900">{modalData ? 'İçeriği Düzenle' : 'Yeni İçerik Ekle'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-zinc-50/50 min-h-[400px]">
              {activeSubTab === 'teachers' && <TeacherForm initialData={modalData} onSubmit={handleSaveForm} onCancel={() => setIsModalOpen(false)} />}
              {activeSubTab === 'courses' && <CourseForm initialData={modalData} onSubmit={handleSaveForm} onCancel={() => setIsModalOpen(false)} />}
              {activeSubTab === 'schools' && <SchoolForm initialData={modalData} onSubmit={handleSaveForm} onCancel={() => setIsModalOpen(false)} />}
              {activeSubTab === 'special_courses' && <SpecialCourseForm initialData={modalData} onSubmit={handleSaveForm} onCancel={() => setIsModalOpen(false)} />}
              {activeSubTab === 'challenges' && <ChallengeForm initialData={modalData} onSubmit={handleSaveForm} onCancel={() => setIsModalOpen(false)} />}
            </div>
          </div>
        </div>
      )}

      {/* SEO SETTINGS MODAL */}
      {isSeoModalOpen && seoData && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative">
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-zinc-900 font-bold">
                <Globe className="w-5 h-5 text-sky-500" />
                SEO Yönetimi
              </div>
              <button onClick={() => setIsSeoModalOpen(false)} className="p-1.5 text-zinc-400 hover:text-zinc-600 bg-zinc-100 rounded-full transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveSeo} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Meta Başlık (SEO Title)</label>
                <input 
                  type="text"
                  value={seoData.seoTitle}
                  onChange={e => setSeoData({...seoData, seoTitle: e.target.value})}
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                />
                <div className={`text-[10px] mt-1 text-right ${seoData.seoTitle?.length > 60 ? 'text-red-500' : 'text-zinc-500'}`}>
                  {seoData.seoTitle?.length || 0} / 60 karakter
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">URL Adresi (Slug)</label>
                <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg overflow-hidden">
                  <span className="px-3 text-xs text-zinc-400 bg-zinc-100 border-r border-zinc-200">site.com/</span>
                  <input 
                    type="text"
                    value={seoData.slug}
                    onChange={e => setSeoData({...seoData, slug: e.target.value})}
                    className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">Meta Açıklama (SEO Description)</label>
                <textarea 
                  value={seoData.seoDesc}
                  onChange={e => setSeoData({...seoData, seoDesc: e.target.value})}
                  rows={4}
                  className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none resize-none"
                ></textarea>
                <div className={`text-[10px] mt-1 text-right ${seoData.seoDesc?.length > 160 ? 'text-red-500' : 'text-zinc-500'}`}>
                  {seoData.seoDesc?.length || 0} / 160 karakter
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsSeoModalOpen(false)} className="px-4 py-2 text-sm font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition">İptal</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition shadow-sm">SEO Değişikliklerini Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
