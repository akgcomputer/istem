import React, { useState } from 'react';

export function TeacherForm({ initialData = null, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: initialData?.preferredLocation || initialData?.location || '',
    categoryId: initialData?.category || initialData?.categoryId || 'Bilişim & Yazılım',
    tags: initialData?.tags || '',
    bio: initialData?.bio || '',
    image: initialData?.avatar || initialData?.image || '',
    canOnline: !!initialData?.canOnline,
    canFaceToFace: !!initialData?.canFaceToFace,
    canCorporate: !!initialData?.canCorporate,
    sessions: initialData?.sessions || [{ name: '', price: '' }]
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSessionChange = (index: number, field: string, value: string) => {
    const newSessions = [...formData.sessions];
    newSessions[index][field] = value;
    setFormData({ ...formData, sessions: newSessions });
  };

  const addSession = () => setFormData({ ...formData, sessions: [...formData.sessions, { name: '', price: '' }] });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const mapped = {
      name: formData.name,
      preferredLocation: formData.location,
      category: formData.categoryId,
      tags: Array.isArray(formData.tags) ? JSON.stringify(formData.tags) : JSON.stringify(formData.tags.split(',').map((s:string)=>s.trim())),
      bio: formData.bio,
      avatar: formData.image,
      canOnline: formData.canOnline,
      canFaceToFace: formData.canFaceToFace,
      canCorporate: formData.canCorporate,
    };
    onSubmit(mapped);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="font-bold text-sm text-[#FF6600] mb-4">Eğitmen Formu</div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Eğitmen Adı ve Soyadı *</label>
        <input name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-zinc-300 rounded" placeholder="Örn: Serdar Yılmaz" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Yüz Yüze Konum Opsiyonu</label>
        <input name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" placeholder="Örn: Ankara Mamak" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Ana Eğitim Kategorisi</label>
        <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded">
          <option>Bilişim & Yazılım</option>
          <option>Dil Eğitimi</option>
          <option>Sanat</option>
          <option>Sınavlara Hazırlık</option>
        </select>
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Etiket * (Virgülle ayırın)</label>
        <input name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags} onChange={handleChange} required className="w-full p-2 border border-zinc-300 rounded" placeholder="Örn: React, C#, CSS" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Kendi Tanıtım Biyografiniz *</label>
        <textarea name="bio" value={formData.bio} onChange={handleChange} required maxLength={200} rows={3} className="w-full p-2 border border-zinc-300 rounded" placeholder="2018 yılından beri..." />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Görsel URL (İsteğe Bağlı)</label>
        <input name="image" value={formData.image} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" placeholder="https://..." />
      </div>

      <div className="border-t border-zinc-200 pt-4 mt-4">
        <label className="block text-zinc-700 font-bold mb-2">Verilen Dersler ve Ücretleri</label>
        {formData.sessions.map((s: any, i: number) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={s.name} onChange={e => handleSessionChange(i, 'name', e.target.value)} placeholder="Ders Adı" className="flex-1 p-2 border border-zinc-300 rounded" />
            <input type="number" value={s.price} onChange={e => handleSessionChange(i, 'price', e.target.value)} placeholder="₺ Fiyat" className="w-24 p-2 border border-zinc-300 rounded" />
          </div>
        ))}
        {formData.sessions.length < 5 && (
          <button type="button" onClick={addSession} className="text-[#FF6600] font-bold">+ Ders Ekle</button>
        )}
      </div>

      <div className="border-t border-zinc-200 pt-4 mt-4">
        <label className="block text-zinc-700 font-bold mb-2">Çalışma Şekilleri</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-1"><input type="checkbox" name="canOnline" checked={formData.canOnline} onChange={handleChange} /> Online Sınıflar</label>
          <label className="flex items-center gap-1"><input type="checkbox" name="canFaceToFace" checked={formData.canFaceToFace} onChange={handleChange} /> Yüz Yüze Konum</label>
          <label className="flex items-center gap-1"><input type="checkbox" name="canCorporate" checked={formData.canCorporate} onChange={handleChange} /> Kurumsal Davet</label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-zinc-100 rounded text-zinc-700 font-bold hover:bg-zinc-200">İptal</button>
        <button type="submit" className="px-4 py-2 bg-[#FF6600] rounded text-white font-bold hover:bg-[#d47d38]">Kaydet & Yayınla</button>
      </div>
    </form>
  );
}

export function SchoolForm({ initialData = null, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: initialData?.location || initialData?.district || '',
    capacity: initialData?.capacity?.toString() || '',
    teachersCount: initialData?.teachersCount?.toString() || initialData?.teachers?.toString() || '',
    branchesCount: initialData?.branchesCount || initialData?.branches || 1,
    type: initialData?.type || initialData?.level || 'Lise',
    activities: initialData?.activities || '',
    lessonHours: initialData?.lessonHours || initialData?.duration || '',
    image: initialData?.image || ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const mapped = {
      name: formData.name,
      location: formData.location,
      capacity: formData.capacity ? parseInt(formData.capacity) : 0,
      teachersCount: formData.teachersCount ? parseInt(formData.teachersCount) : 0,
      branchesCount: formData.branchesCount ? parseInt(formData.branchesCount) : 1,
      type: formData.type,
      activities: Array.isArray(formData.activities) ? JSON.stringify(formData.activities) : JSON.stringify(formData.activities.split(',').map((s:string)=>s.trim())),
      lessonHours: formData.lessonHours,
      image: formData.image
    };
    onSubmit(mapped);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="font-bold text-sm text-[#FF6600] mb-4">Okul Başvuru Formu</div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Kurum/Okul Resmi Adı *</label>
        <input name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-zinc-300 rounded" placeholder="Örn: Kuzey Bahçeşehir Koleji" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">İlçe / Lokasyon *</label>
        <input name="location" value={formData.location} onChange={handleChange} required className="w-full p-2 border border-zinc-300 rounded" placeholder="Örn: Sarıyer, İstanbul" />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-zinc-700 font-bold mb-1">Kapasite Sayısı</label>
          <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" />
        </div>
        <div className="flex-1">
          <label className="block text-zinc-700 font-bold mb-1">Öğretmen Sayısı</label>
          <input type="number" name="teachersCount" value={formData.teachersCount} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-zinc-700 font-bold mb-1">Şube Sayısı *</label>
          <input type="number" name="branchesCount" value={formData.branchesCount} onChange={handleChange} required className="w-full p-2 border border-zinc-300 rounded" />
        </div>
        <div className="flex-1">
          <label className="block text-zinc-700 font-bold mb-1">Eğitim Kademesi</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded">
            <option>İlkokul</option>
            <option>Ortaokul</option>
            <option>Lise</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Fark Yaratan Atölyeler (Virgülle Ayırın)</label>
        <input name="activities" value={Array.isArray(formData.activities) ? formData.activities.join(', ') : formData.activities} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" placeholder="Drama, Kodlama, Ekoloji, Piyano" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Haftalık Ders Yoğunluğu / Saatleri</label>
        <input name="lessonHours" value={formData.lessonHours} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" placeholder="Örn: Haftalık 42 Ders Saati" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Görsel URL (İsteğe Bağlı)</label>
        <input name="image" value={formData.image} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" placeholder="https://..." />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-zinc-100 rounded text-zinc-700 font-bold hover:bg-zinc-200">İptal</button>
        <button type="submit" className="px-4 py-2 bg-[#FF6600] rounded text-white font-bold hover:bg-[#d47d38]">Kaydet & Yayınla</button>
      </div>
    </form>
  );
}

export function CourseForm({ initialData = null, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || '',
    instructorName: initialData?.instructorName || '',
    capstoneDesc: initialData?.capstoneDesc || initialData?.description || '',
    image: initialData?.image || '',
    benefits: initialData?.benefits || ''
  });

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const mapped = {
      title: formData.title,
      category: formData.category,
      instructorName: formData.instructorName,
      capstoneDesc: formData.capstoneDesc,
      image: formData.image,
      benefits: Array.isArray(formData.benefits) ? JSON.stringify(formData.benefits) : JSON.stringify(formData.benefits.split(',').map((s:string)=>s.trim()))
    };
    onSubmit(mapped);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="font-bold text-sm text-[#FF6600] mb-4">Ders / E-Eğitim Formu</div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Eğitim Başlığı *</label>
        <input name="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border border-zinc-300 rounded" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Kategori</label>
        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded">
          <option value="">Seçiniz</option>
          <option value="Bilişim">Bilişim & Yazılım</option>
          <option value="Dil">Yabancı Dil</option>
          <option value="Spor">Spor</option>
          <option value="İlköğretim">İlköğretim</option>
          <option value="Lise">Lise</option>
          <option value="Sanat">Sanat</option>
          <option value="Genel">Genel</option>
        </select>
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Öğretmen Adı</label>
        <input name="instructorName" value={formData.instructorName} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Kısa Açıklama</label>
        <textarea name="capstoneDesc" value={formData.capstoneDesc} onChange={handleChange} rows={2} className="w-full p-2 border border-zinc-300 rounded" />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-zinc-700 font-bold mb-1">Güncel Fiyat (₺)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full p-2 border border-zinc-300 rounded" />
        </div>
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Kazanımlar (Virgülle Ayırın)</label>
        <input name="benefits" value={Array.isArray(formData.benefits) ? formData.benefits.join(', ') : formData.benefits} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Görsel URL (İsteğe Bağlı)</label>
        <input name="image" value={formData.image} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-zinc-100 rounded text-zinc-700 font-bold hover:bg-zinc-200">İptal</button>
        <button type="submit" className="px-4 py-2 bg-[#FF6600] rounded text-white font-bold hover:bg-[#d47d38]">Kaydet & Yayınla</button>
      </div>
    </form>
  );
}

export function SpecialCourseForm({ initialData = null, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || '',
    location: initialData?.location || '',
    priceRange: initialData?.priceRange || initialData?.price || '',
    hoursPerWeek: initialData?.hoursPerWeek || initialData?.duration || '',
    classes: initialData?.classes || '',
    image: initialData?.image || ''
  });

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const mapped = {
      name: formData.name,
      type: formData.type,
      location: formData.location,
      priceRange: formData.priceRange,
      hoursPerWeek: formData.hoursPerWeek,
      image: formData.image,
      classes: Array.isArray(formData.classes) ? JSON.stringify(formData.classes) : JSON.stringify(formData.classes.split(',').map((s:string)=>s.trim()))
    };
    onSubmit(mapped);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="font-bold text-sm text-[#FF6600] mb-4">Özel Kurs Formu</div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Kurs Adı *</label>
        <input name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-zinc-300 rounded" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Türü (Dil, Sanat vb.)</label>
        <input name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Lokasyon</label>
        <input name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Fiyat (Aylık/Kur ₺)</label>
        <input name="priceRange" value={formData.priceRange} onChange={handleChange} required className="w-full p-2 border border-zinc-300 rounded" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Sınıflar (Virgülle Ayırın)</label>
        <input name="classes" value={Array.isArray(formData.classes) ? formData.classes.join(', ') : formData.classes} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" placeholder="Çocuk, Genç, Yetişkin" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Görsel URL (İsteğe Bağlı)</label>
        <input name="image" value={formData.image} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-zinc-100 rounded text-zinc-700 font-bold hover:bg-zinc-200">İptal</button>
        <button type="submit" className="px-4 py-2 bg-[#FF6600] rounded text-white font-bold hover:bg-[#d47d38]">Kaydet & Yayınla</button>
      </div>
    </form>
  );
}

export function ChallengeForm({ initialData = null, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || '',
    sponsor: initialData?.sponsor || '',
    limit_text: initialData?.limit_text || '',
    date: initialData?.date || '',
    status: initialData?.status || 'Aktif'
  });

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const mapped = {
      title: formData.title,
      category: formData.category,
      sponsor: formData.sponsor,
      limit_text: formData.limit_text,
      date: formData.date,
      status: formData.status
    };
    onSubmit(mapped);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="font-bold text-sm text-[#FF6600] mb-4">🎙️ Yeni Challenge Oluşturma Sihirbazı</div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Challenge Başlığı *</label>
        <input name="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border border-zinc-300 rounded" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Kategori</label>
        <input name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Sponsor</label>
        <input name="sponsor" value={formData.sponsor} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Kontenjan (Örn: 50 Kişi)</label>
        <input name="limit_text" value={formData.limit_text} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" />
      </div>
      <div>
        <label className="block text-zinc-700 font-bold mb-1">Tarih</label>
        <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full p-2 border border-zinc-300 rounded" />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-zinc-100 rounded text-zinc-700 font-bold hover:bg-zinc-200">İptal</button>
        <button type="submit" className="px-4 py-2 bg-[#FF6600] rounded text-white font-bold hover:bg-[#d47d38]">Kaydet & Yayınla</button>
      </div>
    </form>
  );
}
