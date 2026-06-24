import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, Users, BookOpen, Clock, Plus, X, Trash2, Sparkles, Upload, 
  ExternalLink, Globe, Layout, CheckCircle, ChevronRight, Image as ImageIcon, 
  School, Phone, UserCheck, HelpCircle, AlertCircle, Download, FileSpreadsheet,
  Layers, GraduationCap, LogOut
} from 'lucide-react';

interface BranchData {
  id: string;
  name: string;
  capacity: number;
  educationLevel: string;
  ateliers: string;
  lessonsIntensity: string;
  hours: string;
  address: string;
  phone: string;
  authorizedPerson: string;
  authorizedTitle: string;
  images: string[];
}

interface SchoolData {
  name: string;
  location: string;
  capacity: number;
  teachersCount: number;
  type: 'okul' | 'kurs';
  branches: BranchData[];
}

interface BulkLesson {
  id: string;
  code: string;
  name: string;
  hours: number;
  category: string;
  type: string;
}

interface BulkTeacher {
  id: string;
  name: string;
  branch: string;
  phone: string;
  email: string;
  assignedBranch: string;
}

interface BulkSchool {
  id: string;
  name: string;
  location: string;
  capacity: number;
  teachersCount: number;
  type: 'okul';
}

interface BulkCourse {
  id: string;
  name: string;
  location: string;
  educationLevel: string;
  lessonsIntensity: string;
  hours: string;
}

// Pre-seeded beautiful stock images
const STOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80', // Kolej dış cephe
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80', // Sınıf / Atölye
  'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80', // Kütüphane
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80', // Eğlenceli ders
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80'  // Laboratuvar
];

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[üÜ]/g, 'u')
    .replace(/[şŞ]/g, 's')
    .replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[çÇ]/g, 'c')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
};

const DEFAULT_SCHOOL: SchoolData = {
  name: 'Kuzey Bahçeşehir Koleji ve Fen Lisesi',
  location: 'Sarıyer, İstanbul',
  capacity: 200,
  teachersCount: 24,
  type: 'okul',
  branches: [
    {
      id: 'branch-default',
      name: 'Merkez',
      capacity: 200,
      educationLevel: 'Lise',
      ateliers: 'Drama, Kodlama, Ekoloji, Piyano',
      lessonsIntensity: 'Haftalık 42 Ders Saati',
      hours: '08:30-14:30',
      address: 'Kuzey Bahçeşehir Kampüsü, Sarıyer / İstanbul',
      phone: '+90 (212) 555 43 21',
      authorizedPerson: 'Ahmet Kuzey',
      authorizedTitle: 'Kurucu Genel Müdür',
      images: [STOCK_PHOTOS[0], STOCK_PHOTOS[1], STOCK_PHOTOS[2]]
    }
  ]
};

const EDUCATION_LEVEL_OPTIONS = [
  'Anaokulu (3-6 yaş)',
  'Kreş (0-3 yaş)',
  'İlkokul',
  'Ortaokul',
  'Lise',
  'Yabancı Dil Kursu',
  'LGS-YKS Hazırlık',
  'Kodlama Atölyesi'
];

export default function SchoolManagementView({ initialType = 'okul', onLogout }: { initialType?: 'okul' | 'kurs'; onLogout?: () => void }) {
  const [school, setSchool] = useState<SchoolData>(() => {
    const saved = localStorage.getItem(`istanbul_my_single_school_data_${initialType}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, type: initialType };
      } catch (e) {
        return { 
          ...DEFAULT_SCHOOL, 
          type: initialType, 
          name: initialType === 'okul' ? 'Kuzey Bahçeşehir Koleji ve Fen Lisesi' : 'Özel İstanbul Lisan Teknoloji Akademisi' 
        };
      }
    }
    return { 
      ...DEFAULT_SCHOOL, 
      type: initialType, 
      name: initialType === 'okul' ? 'Kuzey Bahçeşehir Koleji ve Fen Lisesi' : 'Özel İstanbul Lisan Teknoloji Akademisi' 
    };
  });

  // Helpers for multi-select education levels
  const getSelectedLevels = (levelStr: string): string[] => {
    if (!levelStr) return [];
    return levelStr.split(',').map(s => s.trim()).filter(Boolean);
  };

  const isLevelSelected = (currentLevelStr: string, levelOption: string) => {
    const currentLevels = getSelectedLevels(currentLevelStr);
    const normOption = levelOption.trim().toLowerCase();
    
    // Support exact and partial fallback comparison compatibility
    return currentLevels.some(l => {
      const normL = l.trim().toLowerCase();
      return normL === normOption || normL.includes(normOption) || normOption.includes(normL);
    });
  };

  const handleToggleEducationLevel = (branchId: string, currentLevelStr: string, levelOption: string) => {
    const currentLevels = getSelectedLevels(currentLevelStr);
    const normOption = levelOption.trim().toLowerCase();
    
    // Check if it exists (using identical logic to isLevelSelected)
    const exists = currentLevels.some(l => {
      const normL = l.trim().toLowerCase();
      return normL === normOption || normL.includes(normOption) || normOption.includes(normL);
    });

    let updatedLevels: string[];
    if (exists) {
      // Remove it (filtering out both exact match and any that include it to be robust)
      updatedLevels = currentLevels.filter(l => {
        const normL = l.trim().toLowerCase();
        return normL !== normOption && !normL.includes(normOption) && !normOption.includes(normL);
      });
    } else {
      updatedLevels = [...currentLevels, levelOption];
    }

    handleUpdateBranchField(branchId, 'educationLevel', updatedLevels.join(', '));
  };

  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    school.branches[0]?.id || 'branch-default'
  );
  
  // Custom multi-view support
  const [activeTab, setActiveTab] = useState<'form' | 'preview' | 'bulk'>('form');
  const isPreviewMode = activeTab === 'preview';
  const setIsPreviewMode = (view: boolean) => setActiveTab(view ? 'preview' : 'form');

  const [successMessage, setSuccessMessage] = useState<string>('');

  // Bulk Import state variables with premium pre-seeded elements
  const [lessonsList, setLessonsList] = useState<BulkLesson[]>([
    { id: 'l-1', code: 'MAT101', name: 'Matematik', hours: 6, category: 'Sayısal', type: 'Zorunlu' },
    { id: 'l-2', code: 'FZK101', name: 'Fizik', hours: 4, category: 'Sayısal', type: 'Zorunlu' },
    { id: 'l-3', code: 'EDB101', name: 'Türk Dili ve Edebiyatı', hours: 5, category: 'Sözel', type: 'Zorunlu' }
  ]);

  const [teachersList, setTeachersList] = useState<BulkTeacher[]>([
    { id: 't-1', name: 'Selin Yılmaz', branch: 'Matematik', phone: '+90 (555) 123 45 67', email: 'selin.yilmaz@istanbul-egitimi.gov.tr', assignedBranch: 'Ataköy Şube' },
    { id: 't-2', name: 'Can Demir', branch: 'Fizik', phone: '+90 (555) 765 43 21', email: 'can.demir@istanbul-egitimi.gov.tr', assignedBranch: 'Merkez' }
  ]);

  const [schoolsList, setSchoolsList] = useState<BulkSchool[]>([
    { id: 's-1', name: 'Kuzey Bahçeşehir Koleji ve Fen Lisesi', location: 'Sarıyer, İstanbul', capacity: 200, teachersCount: 24, type: 'okul' },
    { id: 's-2', name: 'İstanbul Bilim Koleji', location: 'Beşiktaş, İstanbul', capacity: 500, teachersCount: 45, type: 'okul' }
  ]);

  const [coursesList, setCoursesList] = useState<BulkCourse[]>([
    { id: 'c-1', name: 'Lisan Teknoloji Akademisi', location: 'Bakırköy, İstanbul', educationLevel: 'Kodlama Atölyesi', lessonsIntensity: 'Haftalık 24 Saat', hours: '17:00-21:30' }
  ]);

  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: { loading: boolean; progress: number } }>({
    lessons: { loading: false, progress: 0 },
    teachers: { loading: false, progress: 0 },
    schools: { loading: false, progress: 0 },
    courses: { loading: false, progress: 0 },
  });

  // Specimen file downloader with UTF-8 BOM representation
  const handleDownloadTemplate = (fileName: string) => {
    let content = '';
    if (fileName === 'toplu-ders.xlsx') {
      content = "Ders Kodu;Ders Adı;Haftalık Saat;Kategori;Zorunlu/Seçmeli\n" +
                "MAT101;Matematik;6;Sayısal;Zorunlu\n" +
                "FZK101;Fizik;4;Sayısal;Zorunlu\n" +
                "EDB101;Türk Dili ve Edebiyatı;5;Sözel;Zorunlu\n" +
                "ING101;İngilizce;4;Dil;Zorunlu\n" +
                "ROB101;Robotik Kodlama;2;Uygulamalı;Seçmeli";
    } else if (fileName === 'toplu-ogretmen.xlsx') {
      content = "Ad Soyad;Branş;Telefon;E-posta;Şube\n" +
                "Selin Yılmaz;Matematik;+90 (555) 123 45 67;selin.yilmaz@istanbul-egitimi.gov.tr;Ataköy Şube\n" +
                "Can Demir;Fizik;+90 (555) 765 43 21;can.demir@istanbul-egitimi.gov.tr;Merkez\n" +
                "Aylin Kaya;Kimya;+90 (555) 987 65 43;aylin.kaya@istanbul-egitimi.gov.tr;Kadıköy Şube\n" +
                "Mert Çelik;Tarih;+90 (555) 234 56 78;mert.celik@istanbul-egitimi.gov.tr;Bebek Şube";
    } else if (fileName === 'toplu-okul.xlsx') {
      content = "Kurum Adı;Lokasyon;Mevcut Kapasite;Öğretmen Sayısı;Yönetici Ünvanı\n" +
                "İstanbul Bilim Koleji;Beşiktaş, İstanbul;500;45;Genel Koordinatör\n" +
                "Yıldızlar Anadolu Lisesi;Fatih, İstanbul;350;28;Müdür Yardımcısı\n" +
                "Avrasya Koleji;Üsküdar, İstanbul;480;40;Kurucu Ortak";
    } else if (fileName === 'toplu-kurs.xlsx') {
      content = "Kurs Adı;Lokasyon;Eğitim Kademesi;Haftalık Yoğunluk;Ders Saatleri\n" +
                "Lisan Teknoloji Akademisi;Bakırköy, İstanbul;Kodlama Atölyesi, Yabancı Dil Kursu;Haftalık 24 Saat;17:00-21:30\n" +
                "Metropol LGS-YKS Hazırlık;Kadıköy, İstanbul;LGS-YKS Hazırlık;Haftalık 30 Saat;09:00-16:00\n" +
                "Kreatif Sanat ve Müzik Akademisi;Beşiktaş, İstanbul;Anaokulu (3-6 yaş), İlkokul;Haftalık 16 Saat;10:30-18:00";
    }

    // Generate blob down to file
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`Örnek ${fileName} şablon dosyası indirildi!`);
  };

  // Perform realistic parsing of input CSV/XLSX text
  const parseCSVLines = (text: string): string[][] => {
    return text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // support both comma and semicolon separating
        if (line.includes(';')) {
          return line.split(';');
        }
        return line.split(',');
      });
  };

  const handleSimulateUpload = (type: 'lessons' | 'teachers' | 'schools' | 'courses', customTextContent?: string) => {
    setUploadStatus(prev => ({
      ...prev,
      [type]: { loading: true, progress: 10 }
    }));

    let progressInterval = setInterval(() => {
      setUploadStatus(prev => {
        const current = prev[type];
        if (current.progress >= 100) {
          clearInterval(progressInterval);
          return prev;
        }
        return {
          ...prev,
          [type]: { ...current, progress: Math.min(current.progress + 25, 100) }
        };
      });
    }, 250);

    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadStatus(prev => ({
        ...prev,
        [type]: { loading: false, progress: 100 }
      }));

      // Map parsed items
      if (type === 'lessons') {
        const defaultRaw = "Ders Kodu;Ders Adı;Haftalık Saat;Kategori;Zorunlu/Seçmeli\n" +
                           "MAT401;İleri Analiz;6;Sayısal;Zorunlu\n" +
                           "KMY201;Organik Kimya;4;Sayısal;Zorunlu\n" +
                           "COG101;Genel Coğrafya;2;Sözel;Seçmeli";
        const contentToParse = customTextContent || defaultRaw;
        const rows = parseCSVLines(contentToParse);
        const headers = rows[0] || [];
        const dataRows = rows.slice(1);

        const newLessons = dataRows.map((r, i) => ({
          id: 'l-imported-' + Date.now() + '-' + i,
          code: r[0] || 'KOD' + Math.floor(Math.random() * 900),
          name: r[1] || 'Yeni Müfredat Dersi',
          hours: parseInt(r[2]) || 4,
          category: r[3] || 'Sayısal',
          type: r[4] || 'Zorunlu'
        }));

        setLessonsList(prev => [...newLessons, ...prev]);
        
        // Also extend the atölyeler/lessons intensity of the current branch for live sync
        if (activeBranch) {
          const namesStr = newLessons.map(l => l.name).join(', ');
          const extendedAteliers = activeBranch.ateliers 
            ? activeBranch.ateliers + ', ' + namesStr 
            : namesStr;
          handleUpdateBranchField(activeBranch.id, 'ateliers', extendedAteliers);
          handleUpdateBranchField(activeBranch.id, 'lessonsIntensity', `Haftalık ${42 + (newLessons.length * 4)} Ders Saati`);
        }

        showNotification(`${newLessons.length} adet ders başarıyla müfredata eklendi!`);
      } else if (type === 'teachers') {
        const defaultRaw = "Ad Soyad;Branş;Telefon;E-posta;Şube\n" +
                           "Merve Şen;Biyoloji;+90 (555) 777 88 99;merve.sen@istanbul-egitimi.gov.tr;Merkez\n" +
                           "Arda Turan;Beden Eğitimi;+90 (555) 111 22 33;arda.turan@istanbul-egitimi.gov.tr;Ataköy Şube";
        const contentToParse = customTextContent || defaultRaw;
        const rows = parseCSVLines(contentToParse);
        const dataRows = rows.slice(1);

        const newTeachers = dataRows.map((r, i) => ({
          id: 't-imported-' + Date.now() + '-' + i,
          name: r[0] || 'Eğitmen Adı',
          branch: r[1] || 'Branş',
          phone: r[2] || '+90 (555) 000 00 00',
          email: r[3] || 'eposta@istanbul-egitimi.gov.tr',
          assignedBranch: r[4] || 'Merkez'
        }));

        setTeachersList(prev => [...newTeachers, ...prev]);

        // Dynamically increment school's official teachers count
        const totalNew = newTeachers.length;
        handleUpdateSchoolField('teachersCount', school.teachersCount + totalNew);

        showNotification(`${totalNew} adet öğretmen başarıyla kadroya eklendi! Kadro toplamı güncellendi.`);
      } else if (type === 'schools') {
        const defaultRaw = "Kurum Adı;Lokasyon;Mevcut Kapasite;Öğretmen Sayısı;Yönetici Ünvanı\n" +
                           "Florya Uğur Koleji;Bakırköy, İstanbul;600;54;Okul Müdürü\n" +
                           "Kartal Bilim Kursu;Kartal, İstanbul;300;22;Kurucu Müdür";
        const contentToParse = customTextContent || defaultRaw;
        const rows = parseCSVLines(contentToParse);
        const dataRows = rows.slice(1);

        const newSchools = dataRows.map((r, i) => ({
          id: 's-imported-' + Date.now() + '-' + i,
          name: r[0] || 'Yeni İstanbul Okulu',
          location: r[1] || 'İstanbul',
          capacity: parseInt(r[2]) || 400,
          teachersCount: parseInt(r[3]) || 30,
          type: 'okul' as const
        }));

        setSchoolsList(prev => [...newSchools, ...prev]);

        // Load the first imported school to show instantaneous action
        if (newSchools.length > 0) {
          const imported = newSchools[0];
          setSchool({
            name: imported.name,
            location: imported.location,
            capacity: imported.capacity,
            teachersCount: imported.teachersCount,
            type: 'okul',
            branches: [
              {
                id: 'branch-imp-' + Date.now(),
                name: 'Merkez Şubesi',
                capacity: imported.capacity,
                educationLevel: 'Lise',
                ateliers: 'Drama, Robotik, Kodlama',
                lessonsIntensity: 'Haftalık 40 Ders Saati',
                hours: '08:30-15:30',
                address: `${imported.location} Kampüsü`,
                phone: '+90 (212) 001 02 03',
                authorizedPerson: 'Zeynep Aksoy',
                authorizedTitle: 'Eğitim Direktörü',
                images: [STOCK_PHOTOS[0], STOCK_PHOTOS[1]]
              }
            ]
          });
        }

        showNotification(`${newSchools.length} adet yeni okul/kolej sisteme eklendi ve seçili hale getirildi!`);
      } else if (type === 'courses') {
        const defaultRaw = "Kurs Adı;Lokasyon;Eğitim Kademesi;Haftalık Yoğunluk;Ders Saatleri\n" +
                           "Atölye İstanbul;Şişli, İstanbul;Kodlama Atölyesi;Haftalık 12 Saat;18:00-21:00\n" +
                           "Boğaziçi Akademi;Sarıyer, İstanbul;LGS-YKS Hazırlık;Haftalık 32 Saat;09:00-17:00";
        const contentToParse = customTextContent || defaultRaw;
        const rows = parseCSVLines(contentToParse);
        const dataRows = rows.slice(1);

        const newCourses = dataRows.map((r, i) => ({
          id: 'c-imported-' + Date.now() + '-' + i,
          name: r[0] || 'Yeni Akademi Kursu',
          location: r[1] || 'İstanbul',
          educationLevel: r[2] || 'Yabancı Dil Kursu',
          lessonsIntensity: r[3] || 'Haftalık 20 Saat',
          hours: r[4] || '09:00-14:00'
        }));

        setCoursesList(prev => [...newCourses, ...prev]);

        if (newCourses.length > 0) {
          const imported = newCourses[0];
          setSchool({
            name: imported.name,
            location: imported.location,
            capacity: 180,
            teachersCount: 15,
            type: 'kurs',
            branches: [
              {
                id: 'branch-imp-c-' + Date.now(),
                name: 'Merkez Akademi',
                capacity: 180,
                educationLevel: imported.educationLevel,
                ateliers: 'İngilizce Drama, Yazılım',
                lessonsIntensity: imported.lessonsIntensity,
                hours: imported.hours,
                address: `${imported.location} Ana Şubesi`,
                phone: '+90 (212) 999 88 77',
                authorizedPerson: 'Murat Yıldırım',
                authorizedTitle: 'Kurucu Ortak',
                images: [STOCK_PHOTOS[1], STOCK_PHOTOS[3]]
              }
            ]
          });
        }

        showNotification(`${newCourses.length} adet özel Kurs başarıyla yüklendi! Kurum ve ilk şube otomatik başlatıldı.`);
      }
    }, 1100);
  };

  // Live File Selection parser
  const handleFileSystemUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'lessons' | 'teachers' | 'schools' | 'courses') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleSimulateUpload(type, text);
    };
    reader.readAsText(file);
  };

  const activeBranch = school.branches.find(b => b.id === selectedBranchId) || school.branches[0];

  // Save changes to localStorage helper
  const saveSchoolState = (updated: SchoolData) => {
    setSchool(updated);
    localStorage.setItem(`istanbul_my_single_school_data_${initialType}`, JSON.stringify(updated));
  };

  // Sync state with simulated URL output
  const schoolSlug = slugify(school.name || 'marka');
  const branchSlug = slugify(activeBranch?.name || 'sube');
  const typeSlug = school.type === 'okul' ? 'okul' : 'kurs';
  const simulatedPath = `/${schoolSlug}/${branchSlug}`;
  const currentSimulatedUrl = `https://istanbul-egitimi.gov.tr${simulatedPath}`;

  // Keep state sync elegant without breaking rules
  useEffect(() => {
    if (school && activeBranch) {
      // Simulate real browser state shift if desired
      window.history.pushState({ branchId: activeBranch.id }, '', simulatedPath);
    }
  }, [activeBranch?.id, school.name, activeBranch?.name]);

  const handleUpdateSchoolField = (field: keyof Omit<SchoolData, 'branches'>, value: any) => {
    const updated = {
      ...school,
      [field]: value
    };
    saveSchoolState(updated);
  };

  const handleAddBranch = () => {
    const newBranch: BranchData = {
      id: 'branch-' + Date.now(),
      name: `Yeni Şube ${school.branches.length + 1}`,
      capacity: 150,
      educationLevel: school.type === 'okul' ? 'Lise' : 'Yabancı Dil',
      ateliers: 'Drama, Robotik Kodlama',
      lessonsIntensity: 'Haftalık 36 Ders Saati',
      hours: '09:00-15:00',
      address: `${school.location || 'Kadıköy, İstanbul'}`,
      phone: '+90 (212) 000 00 00',
      authorizedPerson: 'Yetkili Yönetici',
      authorizedTitle: 'Şube Müdürü',
      images: [STOCK_PHOTOS[3], STOCK_PHOTOS[4]]
    };

    const updated = {
      ...school,
      branches: [...school.branches, newBranch]
    };
    saveSchoolState(updated);
    setSelectedBranchId(newBranch.id);
    showNotification('Yeni şube başarıyla eklendi! Bilgileri düzenleyebilirsiniz.');
  };

  const handleRemoveBranch = (branchId: string) => {
    if (school.branches.length <= 1) {
      alert('En az bir şubeye sahip olmalısınız. (Sadece Merkez şube varsa silinemez)');
      return;
    }
    const filtered = school.branches.filter(b => b.id !== branchId);
    const updated = {
      ...school,
      branches: filtered
    };
    saveSchoolState(updated);
    // Fallback to remaining
    setSelectedBranchId(filtered[0].id);
    showNotification('Şube kaldırıldı.');
  };

  const handleUpdateBranchField = (branchId: string, field: keyof BranchData, value: any) => {
    const updated = {
      ...school,
      branches: school.branches.map(b => b.id === branchId ? { ...b, [field]: value } : b)
    };
    saveSchoolState(updated);
  };

  const handleAddStockImage = (branchId: string, url: string) => {
    const currentImages = activeBranch?.images || [];
    if (currentImages.length >= 10) {
      alert('Bir şube için en fazla 10 görsel ekleyebilirsiniz.');
      return;
    }
    handleUpdateBranchField(branchId, 'images', [...currentImages, url]);
    showNotification('Yeni görsel galeriye eklendi.');
  };

  const handleRemoveImage = (branchId: string, index: number) => {
    const currentImages = activeBranch?.images || [];
    const filtered = currentImages.filter((_, i) => i !== index);
    handleUpdateBranchField(branchId, 'images', filtered);
  };

  const handleMockFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const randomPic = STOCK_PHOTOS[Math.floor(Math.random() * STOCK_PHOTOS.length)];
    if (activeBranch) {
      handleAddStockImage(activeBranch.id, randomPic);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner notification */}
        {successMessage && (
          <div className="fixed bottom-6 right-6 bg-zinc-950 text-white border border-[#FF6600] py-3.5 px-6 rounded-2xl shadow-2xl z-50 flex items-center gap-2.5 animate-slide-up font-bold text-xs">
            <CheckCircle className="w-5 h-5 text-[#39FF14]" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Dynamic header row section with toggle tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-200 pb-6 mb-8 gap-4">
          <div className="text-left">
            <div className="inline-flex items-center gap-1.5 bg-amber-100/70 border border-amber-200/50 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#8C3F03] mb-3">
              <School className="w-4 h-4 text-[#FF6600] shrink-0" />
              Giriş Türü: {school.type === 'okul' ? 'Okul / Kolej Yetkilisi' : 'Özel Kurs Yönetimi'}
            </div>
            <h1 className="text-3xl font-black text-zinc-950 tracking-tight font-display">
              {school.type === 'okul' ? 'Okul Yönetim Paneli' : 'Kurs Yönetim Paneli'}
            </h1>
            <p className="text-xs text-zinc-500 font-semibold mt-1">
              Kurumunuzun resmi bilgilerini güncelleyin, şubelerinize özel atölyeleri, çalışma saatlerini, görselleri ve iletişim yetkililerini belirleyin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onLogout && (
              <button 
                type="button"
                onClick={onLogout}
                className="bg-red-50 hover:bg-red-150 text-red-700 font-extrabold text-xs px-5 py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 border border-red-200 shadow-3xs"
              >
                <LogOut className="w-4 h-4 text-red-655" />
                Çıkış Yap
              </button>
            )}

            <button 
              type="button"
              onClick={() => {
                saveSchoolState(school);
                showNotification('Tebrikler! Değişiklikler başarıyla kaydedildi ve tüm portal şubelerinde eş zamanlı yayına alındı. (SEO Güncellendi)');
              }}
              className="bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs px-5 py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] border border-[#FF6600]/40 hover:border-[#FF6600]"
              id="header-save-and-publish"
            >
              <CheckCircle className="w-4 h-4 text-[#39FF14]" />
              Kaydet ve Yayınla
            </button>

            <div className="flex bg-white p-1 rounded-xl border border-zinc-200 shadow-sm">
              <button 
                onClick={() => setActiveTab('form')}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'form' ? 'bg-[#FF6600] text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950'}`}
                id="btn-edit-mode"
              >
                <Layout className="w-4 h-4" />
                Yönetim Formu
              </button>
              <button 
                onClick={() => setActiveTab('bulk')}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'bulk' ? 'bg-[#FF6600] text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950'}`}
                id="btn-bulk-mode"
              >
                <FileSpreadsheet className="w-4 h-4 font-black text-emerald-500" />
                Toplu Yükleme
              </button>
              <button 
                onClick={() => setActiveTab('preview')}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'preview' ? 'bg-[#FF6600] text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950'}`}
                id="btn-preview-mode"
              >
                <Globe className="w-4 h-4" />
                Önizleme
              </button>
            </div>
          </div>
        </div>

        {/* Kurum Genel Bilgileri ve Şubeler */}
        {activeTab === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            
            {/* LEFT COLUMN: School and General Branch Form (7 Col) */}
            <div className="col-span-1 lg:col-span-7 space-y-6">
              
              {/* Core School Info Box */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                <div className="border-b border-zinc-100 pb-3 flex justify-between items-center">
                  <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#FF6600] rounded-full" />
                    Kurum Temel Bilgileri
                  </h2>
                  <div className="flex items-center gap-1.5 bg-zinc-100 px-2.5 py-1 rounded-lg">
                    <span className="text-[10px] text-zinc-500 font-bold">Tür Seçiçi:</span>
                    <select
                      value={school.type}
                      onChange={(e) => handleUpdateSchoolField('type', e.target.value)}
                      className="bg-transparent text-[10px] font-black text-zinc-900 focus:outline-none cursor-pointer"
                    >
                      <option value="okul">Özel Okul / Kolej</option>
                      <option value="kurs">Özel Kurs / Akademi</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1.5">Kurum/Okul Resmi Adı *</label>
                    <input 
                      type="text" 
                      value={school.name}
                      onChange={(e) => handleUpdateSchoolField('name', e.target.value)}
                      placeholder="Örn: Kuzey Bahçeşehir Koleji ve Fen Lisesi"
                      className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-500 block mb-1.5">İlçe / Lokasyon *</label>
                      <input 
                        type="text" 
                        value={school.location}
                        onChange={(e) => handleUpdateSchoolField('location', e.target.value)}
                        placeholder="Örn: Sarıyer, İstanbul"
                        className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 block mb-1.5">Mevcut Toplam Öğretmen Sayısı</label>
                      <input 
                        type="number" 
                        value={school.teachersCount || ''}
                        onChange={(e) => handleUpdateSchoolField('teachersCount', parseInt(e.target.value) || 0)}
                        placeholder="Örn: 24"
                        className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-500 block mb-1.5">Toplam Kurum Kapasitesi</label>
                      <input 
                        type="number" 
                        value={school.capacity || ''}
                        onChange={(e) => handleUpdateSchoolField('capacity', parseInt(e.target.value) || 0)}
                        placeholder="Örn: 200"
                        className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 block mb-1.5">Şube Durumu</label>
                      <div className="bg-amber-50 border border-amber-200/40 rounded-xl px-4 py-2.5 text-xs text-amber-900 font-bold flex items-center justify-between">
                        <span>{school.branches.length} Aktif Şube Tanımlı</span>
                        <span className="text-[10px] text-amber-700 bg-white/70 px-1.5 py-0.5 rounded">Eşzamanlı SEO</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Branch Specific Forms and Questions */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                
                <div className="border-b border-zinc-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-rose-500 rounded-full shrink-0" />
                    Şubeler &amp; Müfredat Soruları
                  </h2>
                  <span className="text-[10px] bg-amber-50 text-amber-800 px-2.5 py-1 rounded-md font-bold self-start">
                    + Şube Ekledikçe Aşağıdaki Sorular Ayrı Sorulur
                  </span>
                </div>

                {/* Sub branch selector tabs */}
                <div className="flex flex-wrap gap-1.5 bg-[#FAF9F5] p-1.5 rounded-2xl border border-zinc-150">
                  {school.branches.map((b, idx) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBranchId(b.id)}
                      className={`px-4.5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${selectedBranchId === b.id ? 'bg-[#FF6600] text-white shadow-sm' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'}`}
                    >
                      <Building2 className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      {b.name || (idx === 0 ? 'Merkez' : `Şube ${idx + 1}`)}
                    </button>
                  ))}
                  
                  <button 
                    type="button"
                    onClick={handleAddBranch}
                    className="px-4.5 py-2.5 text-[#FF6600] hover:bg-orange-50 rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer ml-auto border-l border-dashed border-zinc-200"
                    id="btn-add-branch"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    Şube Ekle
                  </button>
                </div>

                {/* Selected Branch Content Fields */}
                {activeBranch ? (
                  <div className="space-y-5 animate-fade-in">
                    
                    <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-2xl border border-zinc-150/60">
                      <div>
                        <span className="text-[9px] font-black text-zinc-400 block uppercase tracking-wider">Seçili Şubenin Soruları</span>
                        <p className="text-xs font-black text-zinc-700">Düzenlenen Şube: <span className="text-emerald-700">{activeBranch.name}</span></p>
                      </div>
                      {school.branches.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBranch(activeBranch.id)}
                          className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Şubeyi Sil
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-500 block mb-1.5">Şube Adı *</label>
                        <input 
                          type="text" 
                          value={activeBranch.name}
                          onChange={(e) => handleUpdateBranchField(activeBranch.id, 'name', e.target.value)}
                          placeholder="Örn: Bebek Şubesi veya Kadıköy Şube"
                          className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-500 block mb-1.5">Şube Kapasitesi</label>
                        <input 
                          type="number" 
                          value={activeBranch.capacity || ''}
                          onChange={(e) => handleUpdateBranchField(activeBranch.id, 'capacity', parseInt(e.target.value) || 0)}
                          placeholder="Örn: 100"
                          className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition"
                        />
                      </div>
                    </div>

                    {/* Eğitim Kademesi Multi-Select */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 block">Eğitim Kademesi (Birden fazla seçebilirsiniz) *</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[#FAF9F5] p-3 rounded-2xl border border-zinc-200">
                        {EDUCATION_LEVEL_OPTIONS.map((option) => {
                          const isSelected = isLevelSelected(activeBranch.educationLevel, option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleToggleEducationLevel(activeBranch.id, activeBranch.educationLevel, option)}
                              className={`px-3 py-2.5 rounded-xl text-left text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
                                isSelected 
                                  ? 'bg-[#FF6600]/10 border-[#FF6600] text-[#8C3F03] shadow-xs' 
                                  : 'bg-white border-zinc-200 text-zinc-650 hover:border-zinc-300'
                              }`}
                            >
                              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all ${
                                isSelected ? 'bg-[#FF6600] border-[#FF6600]' : 'border-zinc-300 bg-white'
                              }`}>
                                {isSelected && (
                                  <svg className="w-2.5 h-2.5 text-white stroke-[3.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </span>
                              <span className="truncate" title={option}>{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-500 block mb-1.5">Haftalık Ders Yoğunluğu *</label>
                        <input 
                          type="text" 
                          value={activeBranch.lessonsIntensity}
                          onChange={(e) => handleUpdateBranchField(activeBranch.id, 'lessonsIntensity', e.target.value)}
                          placeholder="Örn: Haftalık 42 Ders Saati"
                          className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-500 block mb-1.5">Okul Giriş-Çıkış Saatleri *</label>
                        <input 
                          type="text" 
                          value={activeBranch.hours}
                          onChange={(e) => handleUpdateBranchField(activeBranch.id, 'hours', e.target.value)}
                          placeholder="Örn: 08:30-14:30"
                          className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-500 block mb-1.5">Fark Yaratan Atölyeler (Virgülle Ayırın) *</label>
                      <input 
                        type="text" 
                        value={activeBranch.ateliers}
                        onChange={(e) => handleUpdateBranchField(activeBranch.id, 'ateliers', e.target.value)}
                        placeholder="Örn: Drama, Kodlama, Ekoloji, Piyano"
                        className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition"
                      />
                    </div>

                    {/* NEW FIELDS REQUESTED: Adres, Telefon, Yetkili Kişi & Ünvanı */}
                    <div className="border-t border-dashed border-zinc-200 pt-4 space-y-4">
                      <h4 className="text-xs font-black text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#FF6600]" /> 
                        Şube İletişim ve Yetkili Bilgileri
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-zinc-500 block mb-1.5">Şube Telefon Numarası *</label>
                          <input 
                            type="text" 
                            value={activeBranch.phone || ''}
                            onChange={(e) => handleUpdateBranchField(activeBranch.id, 'phone', e.target.value)}
                            placeholder="Örn: +90 (212) 555 12 34"
                            className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-bold text-zinc-500 block mb-1.5">Yetkili Kişi *</label>
                            <input 
                              type="text" 
                              value={activeBranch.authorizedPerson || ''}
                              onChange={(e) => handleUpdateBranchField(activeBranch.id, 'authorizedPerson', e.target.value)}
                              placeholder="Örn: Ahmet Öztürk"
                              className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-zinc-500 block mb-1.5">Yönetici Ünvanı *</label>
                            <input 
                              type="text" 
                              value={activeBranch.authorizedTitle || ''}
                              onChange={(e) => handleUpdateBranchField(activeBranch.id, 'authorizedTitle', e.target.value)}
                              placeholder="Örn: Şube Müdürü"
                              className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-500 block mb-1.5">Şube Açık Adresi *</label>
                        <textarea 
                          rows={2}
                          value={activeBranch.address || ''}
                          onChange={(e) => handleUpdateBranchField(activeBranch.id, 'address', e.target.value)}
                          placeholder="Örn: Atatürk Caddesi, Ihlamur Sokak No:12, Sarıyer / İstanbul"
                          className="w-full bg-[#FAF9F5] border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6600] transition"
                        />
                      </div>
                    </div>

                    {/* School/Branch Görselleri (up to 10) */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-zinc-500 block">Şube &amp; Sınıf Görselleri (Sırayla Listelenir, En Fazla 10 Adet)</label>
                        <span className="text-[10px] font-bold text-[#FF6600]">({activeBranch.images?.length || 0} / 10 Ekli)</span>
                      </div>

                      {/* Mock Drag & Drop Upload Zone */}
                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleMockFileDrop}
                        className="border-2 border-dashed border-zinc-200 bg-zinc-50 rounded-2xl p-6 text-center hover:border-[#FF6600] hover:bg-orange-50/10 cursor-pointer transition flex flex-col items-center justify-center animate-fade-in"
                        onClick={() => {
                          const randPic = STOCK_PHOTOS[Math.floor(Math.random() * STOCK_PHOTOS.length)];
                          handleAddStockImage(activeBranch.id, randPic);
                        }}
                      >
                        <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                        <span className="text-xs font-bold text-zinc-700">Görsel Dosyası Sürükleyin veya Tıklayıp Ekleyin</span>
                        <p className="text-[10px] text-zinc-400 mt-1">Her şube için farklı görseller sunabilirsiniz. Veliler bu görselleri SEO sayfasında görecektir.</p>
                      </div>

                      {/* Easy Selection Presets */}
                      <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-3 text-left">
                        <span className="text-[10px] text-amber-800 font-bold block uppercase mb-1.5">✦ Test Görselleri Ekle (Sanal Simülasyon)</span>
                        <div className="flex flex-wrap gap-1.5">
                          {['Akademik Sınıf', 'Fen Laboratuvarı', 'Yabancı Dil Atölyesi', 'Drama Sınıfı', 'Okul Girişi'].map((label, idx) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => handleAddStockImage(activeBranch.id, STOCK_PHOTOS[idx % STOCK_PHOTOS.length])}
                              className="text-[10px] bg-white border border-zinc-200 hover:border-[#FF6600] text-zinc-700 hover:text-zinc-950 font-bold px-2.5 py-1.5 rounded-lg transition shrink-0 cursor-pointer"
                            >
                              + {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Render Visual Grid of branch images */}
                      {activeBranch.images && activeBranch.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mt-2.5">
                          {activeBranch.images.map((img, i) => (
                            <div key={i} className="relative aspect-video rounded-xl overflow-hidden group border border-zinc-200 bg-zinc-150">
                              <img referrerPolicy="no-referrer" src={img} alt={`Branch visual ${i}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(activeBranch.id, i)}
                                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition shadow cursor-pointer"
                                title="Görseli Kaldır"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>

                    {/* Secondary Save & Publish prominent panel */}
                    <div className="bg-gradient-to-r from-amber-500/5 to-amber-550/10 border border-[#FF6600]/30 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 animate-fade-in text-left">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-10 h-10 bg-amber-100/80 rounded-full flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-[#FF6600]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-zinc-950">Değişiklikleri Dünyayla Paylaşın</h3>
                          <p className="text-[11px] text-zinc-650 font-semibold leading-normal">
                            Tüm kurum ve şube bilgileri otomatik yedeklenir. İstediğiniz an butona tıklayarak tescilli bilgilerinizi veli aramalarında aktif edebilirsiniz.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          saveSchoolState(school);
                          showNotification('Tebrikler! Değişiklikler başarıyla kaydedildi ve tüm portal şubelerinde eş zamanlı yayına alındı. (SEO Güncellendi)');
                        }}
                        className="w-full sm:w-auto bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs px-6 py-3.5 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] border border-[#FF6600]/40 hover:border-[#FF6600] whitespace-nowrap"
                        id="btn-save-and-publish"
                      >
                        <CheckCircle className="w-4 h-4 text-[#39FF14]" />
                        Kaydet ve Yayınla
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-6 text-zinc-400 text-xs">Lütfen üstteki panelden düzenlenecek şubeyi seçiniz.</div>
                )}

              </div>

            </div>

            {/* RIGHT COLUMN: Real-time Public Preview Card & Tips (5 Col) */}
            <div className="col-span-1 lg:col-span-5 space-y-6">

              {/* Simulated browser visual display */}
              <div className="bg-zinc-900 text-[#FAF9F5] rounded-3xl overflow-hidden shadow-2xl relative border border-zinc-800 flex flex-col">
                
                {/* Browser top layout header chrome */}
                <div className="bg-[#1C1A17] px-4 py-3 border-b border-zinc-800 flex items-center justify-between shrink-0">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 bg-red-500 rounded-full inline-block" />
                    <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block" />
                    <span className="w-3 h-3 bg-green-500 rounded-full inline-block" />
                  </div>
                  
                  {/* Dynamic address bar */}
                  <div className="bg-[#12110F] border border-zinc-805 text-zinc-400 px-3.5 py-1.5 rounded-lg text-[10px] font-mono flex items-center gap-2 max-w-sm w-3/4 mx-auto select-all justify-center">
                    <Globe className="w-3 h-3 text-[#FF6600]" />
                    <span className="truncate">{simulatedPath}</span>
                  </div>
                </div>

                {/* Content window */}
                <div className="p-6 bg-zinc-950 flex-1 min-h-[460px] flex flex-col justify-between text-left">
                  
                  <div>
                    {/* Upper title context */}
                    <div className="flex justify-between items-start gap-4 mb-4 border-b border-zinc-800 pb-4">
                      <div>
                        <span className="text-[9px] bg-[#FF6600]/10 text-[#FF6600] px-2 py-0.5 rounded-md font-black tracking-widest uppercase mb-1 inline-block">
                          {school.type === 'okul' ? 'ÖZEL OKUL SAYFASI' : 'ÖZEL KURS PORTALI'}
                        </span>
                        <h3 className="text-lg font-black text-white font-display leading-tight">{school.name || 'Ad Belirtilmedi'}</h3>
                        <div className="flex items-center gap-1 text-zinc-400 text-xs mt-1.0 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{school.location || 'Lokasyon belirtilmedi'}</span>
                        </div>
                      </div>
                      
                      <div className="text-right shrink-[#FAF9F5] max-w-[120px]">
                        <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-widest">AKTİF ŞUBE</span>
                        <span className="text-xs text-amber-400 font-extrabold truncate block">{activeBranch?.name || 'Merkez'}</span>
                      </div>
                    </div>

                    {/* Stats strip */}
                    <div className="grid grid-cols-3 gap-2 border-b border-zinc-850 pb-4 mb-4">
                      <div className="bg-zinc-900 border border-zinc-800/80 p-2 text-center">
                        <Users className="w-3.5 h-3.5 text-[#FF6600] mx-auto mb-1 opacity-85" />
                        <span className="text-[9px] text-zinc-400 block font-semibold">Öğretmen</span>
                        <span className="text-xs font-mono font-black text-white">{school.teachersCount || 0}</span>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800/80 p-2 text-center">
                        <BookOpen className="w-3.5 h-3.5 text-[#FF6600] mx-auto mb-1 opacity-85" />
                        <span className="text-[9px] text-zinc-400 block font-semibold">Şube Kapasitesi</span>
                        <span className="text-xs font-mono font-bold text-white">{activeBranch?.capacity || 0}</span>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800/80 p-2 text-center">
                        <Clock className="w-3.5 h-3.5 text-[#FF6600] mx-auto mb-1 opacity-85" />
                        <span className="text-[9px] text-zinc-400 block font-semibold">Giriş-Çıkış</span>
                        <span className="text-[10px] font-bold text-white leading-none truncate block mt-0.5">{activeBranch?.hours || '--:--'}</span>
                      </div>
                    </div>

                    {/* Education Kademe and Intensity list */}
                    <div className="space-y-3.5 text-xs text-zinc-300">
                      <div>
                        <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Kategori &amp; Seviye</span>
                        <span className="text-xs font-black text-white">{activeBranch?.educationLevel || 'Belirtilmedi'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Program Yoğunluğu</span>
                        <span className="text-xs font-black text-[#39FF14]">{activeBranch?.lessonsIntensity || 'Hakkında bilgi yok'}</span>
                      </div>

                      {/* Contact mini section */}
                      <div className="pt-2 border-t border-zinc-900 grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
                        <div>
                          <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block">Şube İletişim</span>
                          <span className="text-white truncate block">{activeBranch?.phone || 'Telefon Belirtilmedi'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block">Yetkili</span>
                          <span className="text-[#FF6600] truncate block" title={`${activeBranch?.authorizedPerson} (${activeBranch?.authorizedTitle})`}>
                            {activeBranch?.authorizedPerson || 'Yönetici'}
                          </span>
                        </div>
                      </div>

                      {/* Ateliers bento badge matrix */}
                      <div className="pt-2">
                        <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block mb-1.5">Fark Yaratan Atölyeler</span>
                        <div className="flex flex-wrap gap-1">
                          {activeBranch?.ateliers ? (
                            activeBranch.ateliers.split(',').map((tag, idx) => (
                              <span 
                                key={idx} 
                                className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-[#FF6600] font-black px-2 py-0.5 rounded"
                              >
                                {tag.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-zinc-500 italic text-[10px]">Drama, Piyano, Kodlama vb. bulunmuyor</span>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Visual images carousel mock display */}
                  <div className="mt-4 pt-3 border-t border-zinc-800">
                    <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-1.5">Görsel Galeri</span>
                    {activeBranch?.images && activeBranch.images.length > 0 ? (
                      <div className="grid grid-cols-4 gap-1.5">
                        {activeBranch.images.slice(0, 4).map((p, i) => (
                          <div key={i} className="aspect-video rounded overflow-hidden border border-zinc-800">
                            <img referrerPolicy="no-referrer" src={p} alt="School stock preview" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-2 text-center text-zinc-500 text-[10px] italic">
                        Şube görseli eklenmedi
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Informative Guidance details */}
              <div className="bg-gradient-to-r from-amber-50 to-[#FAF9F5] border border-amber-200/50 rounded-3xl p-5 text-left space-y-3">
                <h4 className="font-extrabold text-xs text-[#8C3F03] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF6600]" /> Şube Başına Benzersiz SEO Adresleri
                </h4>
                <p className="text-[11px] text-zinc-600 leading-relaxed font-semibold">
                  Kaydettiğiniz her şube, sistemimiz üzerinde bağımsız ve arama motorlarıyla tam uyumlu benzersiz alt adreslere sahiptir. Okul ve şube isimlerini girdikçe SEO URL yapısı otomatik üretilir:
                </p>
                <div className="bg-white border border-amber-200/40 p-3 rounded-xl font-mono text-[10px] text-zinc-600 space-y-1">
                  <div>Okul için: <span className="text-[#FF6600] font-bold">/{schoolSlug}/merkez-subesi</span></div>
                  <div>Kurs için: <span className="text-[#FF6600] font-bold">/{schoolSlug}/cadde-subesi</span></div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =======================================================
           PREMIUM HIGH-FIDELITY EXCEL BULK IMPORT DASHBOARD 
           ======================================================= */}
        {activeTab === 'bulk' && (
          <div className="space-y-8 animate-fade-in text-left">
            {/* Informational Intro Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-[#FF6600]/35 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 bg-[#FF6600]/10 border border-[#FF6600]/30 px-3 py-1 rounded-full text-xs font-black text-[#8C3F03]">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6600]" /> Multi-Format Excel Seeding Engine
                </div>
                <h2 className="text-xl font-black text-zinc-950 font-display">Sihirbaz Destekli Toplu Veri Yönetimi</h2>
                <p className="text-xs text-zinc-650 font-semibold leading-relaxed">
                  Aşağıdaki hazır şablon dosyalarını indirip dilediğiniz verileri doldurduktan sonra sisteme geri yükleyebilir veya <strong className="text-[#8C3F03]">Hızlı Demo Yükle</strong> butonuyla simüle edilmiş hazır verileri tek tıkla yükleyebilirsiniz.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center shrink-0 w-24 h-24 bg-white/70 border border-[#FF6600]/20 rounded-2xl shadow-inner select-none p-2 text-center">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Toplam Yük</span>
                <span className="text-2xl font-black font-mono text-zinc-900">
                  {lessonsList.length + teachersList.length + schoolsList.length + coursesList.length}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-850 px-2 py-0.5 rounded font-black mt-1 font-mono">Satır</span>
              </div>
            </div>

            {/* BENTO GRID: DOWNLOAD & IMPORT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* CARD 1: TOPLU DERS */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all group relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-indigo-50/20 to-transparent rounded-bl-full pointer-events-none" />
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 transition shadow-xs">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 group-hover:text-indigo-600 transition">Toplu Ders Ekleme</h3>
                    <p className="text-[10px] text-zinc-400 font-bold font-mono mt-0.5">Dosya: toplu-ders.xlsx</p>
                    <p className="text-xs text-zinc-600 font-semibold leading-relaxed mt-2">
                      Müfredata ait ders kodları, haftalık saatler ve kategorileri topluca yükleyin.
                    </p>
                  </div>

                  {/* Column guides */}
                  <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-zinc-150 space-y-1 text-[10px] text-zinc-500 font-semibold font-mono">
                    <span className="text-zinc-400 uppercase tracking-wider block font-bold text-[9px] mb-1">Şablon Kolonları</span>
                    <div>Ders Kodu, Ders Adı, Haftalık Saat, Kategori, Tür</div>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  {uploadStatus.lessons.loading ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-black text-zinc-500 font-mono">
                        <span className="animate-pulse text-indigo-600">Yükleniyor...</span>
                        <span>%{uploadStatus.lessons.progress}</span>
                      </div>
                      <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadStatus.lessons.progress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDownloadTemplate('toplu-ders.xlsx')}
                        className="w-full bg-[#FAF9F5] hover:bg-zinc-100 text-zinc-800 border border-zinc-250 font-black text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-4 h-4 text-indigo-600 shrink-0" />
                        Şablonu İndir (.xlsx)
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <label className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-sm text-center">
                          <Upload className="w-3.5 h-3.5 shrink-0" />
                          Yükle
                          <input
                            type="file"
                            accept=".csv,.xlsx,.xls,.txt"
                            onChange={(e) => handleFileSystemUpload(e, 'lessons')}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleSimulateUpload('lessons')}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-extrabold text-[11px] py-3 rounded-xl transition cursor-pointer text-center"
                          title="Hazır örnek ders verisini doğrudan aktarır"
                        >
                          Hazır Yükle
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* CARD 2: TOPLU ÖĞRETMEN */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all group relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-emerald-50/20 to-transparent rounded-bl-full pointer-events-none" />
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 transition shadow-xs">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 group-hover:text-emerald-600 transition">Toplu Öğretmen Ekleme</h3>
                    <p className="text-[10px] text-zinc-400 font-bold font-mono mt-0.5">Dosya: toplu-ogretmen.xlsx</p>
                    <p className="text-xs text-zinc-600 font-semibold leading-relaxed mt-2">
                      Branş öğretmen isimleri, tescilli telefonlar, e-postalar ve hedef şubeleri eşleştirin.
                    </p>
                  </div>

                  {/* Column guides */}
                  <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-zinc-150 space-y-1 text-[10px] text-zinc-500 font-semibold font-mono">
                    <span className="text-zinc-400 uppercase tracking-wider block font-bold text-[9px] mb-1">Şablon Kolonları</span>
                    <div>Ad Soyad, Branş, Telefon, E-posta, Şube</div>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  {uploadStatus.teachers.loading ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-black text-zinc-500 font-mono">
                        <span className="animate-pulse text-emerald-600">Yükleniyor...</span>
                        <span>%{uploadStatus.teachers.progress}</span>
                      </div>
                      <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadStatus.teachers.progress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDownloadTemplate('toplu-ogretmen.xlsx')}
                        className="w-full bg-[#FAF9F5] hover:bg-zinc-100 text-zinc-800 border border-zinc-250 font-black text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                        Şablonu İndir (.xlsx)
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <label className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-sm text-center">
                          <Upload className="w-3.5 h-3.5 shrink-0" />
                          Yükle
                          <input
                            type="file"
                            accept=".csv,.xlsx,.xls,.txt"
                            onChange={(e) => handleFileSystemUpload(e, 'teachers')}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleSimulateUpload('teachers')}
                          className="bg-emerald-50 hover:bg-indigo-100 text-emerald-850 font-extrabold text-[11px] py-3 rounded-xl transition cursor-pointer text-center"
                          title="Hazır öğretmen verisini doğrudan aktarır"
                        >
                          Hazır Yükle
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* CARD 3: TOPLU OKUL */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all group relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-amber-50/20 to-transparent rounded-bl-full pointer-events-none" />
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 transition shadow-xs">
                    <School className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 group-hover:text-amber-600 transition">Toplu Okul Ekleme</h3>
                    <p className="text-[10px] text-zinc-400 font-bold font-mono mt-0.5">Dosya: toplu-okul.xlsx</p>
                    <p className="text-xs text-zinc-600 font-semibold leading-relaxed mt-2">
                      Portala dahil edilecek yeni özel okul ve kolej yerleşkelerini tescil edin.
                    </p>
                  </div>

                  {/* Column guides */}
                  <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-zinc-150 space-y-1 text-[10px] text-zinc-500 font-semibold font-mono">
                    <span className="text-zinc-400 uppercase tracking-wider block font-bold text-[9px] mb-1">Şablon Kolonları</span>
                    <div>Kurum Adı, Lokasyon, Kapasite, Öğretmen Sayısı, Ünvanı</div>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  {uploadStatus.schools.loading ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-black text-zinc-500 font-mono">
                        <span className="animate-pulse text-amber-600">Yükleniyor...</span>
                        <span>%{uploadStatus.schools.progress}</span>
                      </div>
                      <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadStatus.schools.progress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDownloadTemplate('toplu-okul.xlsx')}
                        className="w-full bg-[#FAF9F5] hover:bg-zinc-100 text-zinc-800 border border-zinc-250 font-black text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-4 h-4 text-amber-600 shrink-0" />
                        Şablonu İndir (.xlsx)
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <label className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[11px] py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-sm text-center">
                          <Upload className="w-3.5 h-3.5 shrink-0" />
                          Yükle
                          <input
                            type="file"
                            accept=".csv,.xlsx,.xls,.txt"
                            onChange={(e) => handleFileSystemUpload(e, 'schools')}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleSimulateUpload('schools')}
                          className="bg-amber-50 hover:bg-indigo-100 text-amber-900 font-extrabold text-[11px] py-3 rounded-xl transition cursor-pointer text-center"
                          title="Hazır okul verisini doğrudan aktarır"
                        >
                          Hazır Yükle
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* CARD 4: TOPLU KURS */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all group relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-rose-50/20 to-transparent rounded-bl-full pointer-events-none" />
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 transition shadow-xs">
                    <GraduationCap className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 group-hover:text-rose-600 transition">Toplu Kurs Ekleme</h3>
                    <p className="text-[10px] text-zinc-400 font-bold font-mono mt-0.5">Dosya: toplu-kurs.xlsx</p>
                    <p className="text-xs text-zinc-600 font-semibold leading-relaxed mt-2">
                      Portala dahil edilecek yeni özel seviye ve hazırlık kurs akademilerini sisteme katın.
                    </p>
                  </div>

                  {/* Column guides */}
                  <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-zinc-150 space-y-1 text-[10px] text-zinc-500 font-semibold font-mono">
                    <span className="text-zinc-400 uppercase tracking-wider block font-bold text-[9px] mb-1">Şablon Kolonları</span>
                    <div>Kurs Adı, Lokasyon, Kademe, Seviye, Saatleri</div>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  {uploadStatus.courses.loading ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-black text-zinc-500 font-mono">
                        <span className="animate-pulse text-rose-600">Yükleniyor...</span>
                        <span>%{uploadStatus.courses.progress}</span>
                      </div>
                      <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-rose-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadStatus.courses.progress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDownloadTemplate('toplu-kurs.xlsx')}
                        className="w-full bg-[#FAF9F5] hover:bg-zinc-100 text-zinc-800 border border-zinc-250 font-black text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-4 h-4 text-rose-600 shrink-0" />
                        Şablonu İndir (.xlsx)
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <label className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[11px] py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-sm text-center">
                          <Upload className="w-3.5 h-3.5 shrink-0" />
                          Yükle
                          <input
                            type="file"
                            accept=".csv,.xlsx,.xls,.txt"
                            onChange={(e) => handleFileSystemUpload(e, 'courses')}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleSimulateUpload('courses')}
                          className="bg-rose-50 hover:bg-indigo-100 text-rose-950 font-extrabold text-[11px] py-3 rounded-xl transition cursor-pointer text-center"
                          title="Hazır Kurs verisini doğrudan aktarır"
                        >
                          Hazır Yükle
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* LIVE PREVIEW TABLES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              
              {/* TABLE 1: LESSONS & CURRICULUM */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                      Müfredat ve Yüklenen Dersler
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Toplu şablon veya manuel girilen aktif ders havuzu</p>
                  </div>
                  <span className="bg-indigo-100 text-indigo-850 px-2.5 py-1 rounded-lg text-xs font-black font-mono">
                    {lessonsList.length} Ders tanımlı
                  </span>
                </div>

                <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-150 text-zinc-500 font-extrabold">
                        <th className="pb-2.5 font-bold">Kod</th>
                        <th className="pb-2.5 font-bold">Ders Adı</th>
                        <th className="pb-2.5 font-bold">Kategori</th>
                        <th className="pb-2.5 font-bold text-center">Haftalık Saat</th>
                        <th className="pb-2.5 text-right font-bold">Eylem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-700 font-semibold">
                      {lessonsList.map(l => (
                        <tr key={l.id} className="hover:bg-zinc-50/50 transition">
                          <td className="py-2.5 font-mono font-black text-[11px] text-[#FF6600] uppercase">{l.code}</td>
                          <td className="py-2.5 font-extrabold text-zinc-900">{l.name}</td>
                          <td className="py-2.5">
                            <span className="bg-zinc-100 text-zinc-650 px-2 py-0.5 rounded text-[10px]">
                              {l.category}
                            </span>
                          </td>
                          <td className="py-2.5 text-center font-mono font-bold text-zinc-900">{l.hours} S.</td>
                          <td className="py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setLessonsList(prev => prev.filter(x => x.id !== l.id));
                                showNotification(`${l.name} müfredattan kaldırıldı.`);
                              }}
                              className="text-zinc-400 hover:text-red-650 transition cursor-pointer p-1 rounded-md hover:bg-red-50 inline-flex items-center"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TABLE 2: TEACHERS LIST */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                      Aktif Öğretmen Kadrosu
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Ders ataması ve şube tescilleri yapılan eğitmen kadrosu</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-850 px-2.5 py-1 rounded-lg text-xs font-black font-mono">
                    {teachersList.length} Eğitmen
                  </span>
                </div>

                <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-150 text-zinc-500 font-extrabold">
                        <th className="pb-2.5 font-bold">Öğretmen Adı</th>
                        <th className="pb-2.5 font-bold">Uzmanlık Branşı</th>
                        <th className="pb-2.5 font-bold">Bağlı Şube</th>
                        <th className="pb-2.5 font-bold">İletişim</th>
                        <th className="pb-2.5 text-right font-bold">Eylem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-700 font-semibold">
                      {teachersList.map(t => (
                        <tr key={t.id} className="hover:bg-zinc-50/50 transition text-[11px]">
                          <td className="py-2.5 font-extrabold text-zinc-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                            {t.name}
                          </td>
                          <td className="py-2.5 font-bold text-zinc-700">{t.branch}</td>
                          <td className="py-2.5 text-zinc-650">{t.assignedBranch}</td>
                          <td className="py-2.5">
                            <div className="text-[10px] text-zinc-450 leading-tight font-mono">
                              <div>{t.phone}</div>
                              <div>{t.email}</div>
                            </div>
                          </td>
                          <td className="py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setTeachersList(prev => prev.filter(x => x.id !== t.id));
                                handleUpdateSchoolField('teachersCount', Math.max(0, school.teachersCount - 1));
                                showNotification(`${t.name} kadrodan çıkarıldı.`);
                              }}
                              className="text-zinc-400 hover:text-red-650 transition cursor-pointer p-1 rounded-md hover:bg-red-50 inline-flex items-center"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TABLE 3: SCHOOLS LIST */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                      Tescilli Okul &amp; Kolej Listesi
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Yüklenen ve portal üzerinden yayın yapan kurumlar</p>
                  </div>
                  <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg text-xs font-black font-mono">
                    {schoolsList.length} Kurum
                  </span>
                </div>

                <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-150 text-zinc-500 font-extrabold">
                        <th className="pb-2.5 font-bold">Kurum Adı</th>
                        <th className="pb-2.5 font-bold">Lokasyon</th>
                        <th className="pb-2.5 font-bold text-center">Kapasite</th>
                        <th className="pb-2.5 font-bold text-center">Öğretmen S.</th>
                        <th className="pb-2.5 text-right font-bold">Eylem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-700 font-semibold">
                      {schoolsList.map(s => (
                        <tr
                          key={s.id}
                          className="hover:bg-zinc-50/50 transition cursor-pointer"
                          onClick={() => {
                            setSchool({
                              name: s.name,
                              location: s.location,
                              capacity: s.capacity,
                              teachersCount: s.teachersCount,
                              type: 'okul',
                              branches: [
                                {
                                  id: 'branch-' + s.id + '-' + Date.now(),
                                  name: 'Merkez Kampüsü',
                                  capacity: s.capacity,
                                  educationLevel: 'Lise',
                                  ateliers: 'Drama, Robotik Kodlama, Piyano',
                                  lessonsIntensity: 'Haftalık 38 Ders Saati',
                                  hours: '09:00-16:00',
                                  address: `${s.location} Kampüs Yerleşkesi`,
                                  phone: '+90 (212) 000 00 00',
                                  authorizedPerson: 'Müdür Yetkilisi',
                                  authorizedTitle: 'Genel Koordinatör',
                                  images: [STOCK_PHOTOS[0], STOCK_PHOTOS[1]]
                                }
                              ]
                            });
                            showNotification(`${s.name} okul temel verileri aktif panele yüklendi!`);
                          }}
                          title="Hızlı Düzenlemek için Tıklayın"
                        >
                          <td className="py-2.5 font-black text-zinc-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                            {s.name}
                          </td>
                          <td className="py-2.5 text-zinc-650">{s.location}</td>
                          <td className="py-2.5 text-center font-mono font-bold text-zinc-900">{s.capacity} Ort.</td>
                          <td className="py-2.5 text-center font-mono font-bold text-[#FF6600]">{s.teachersCount} Öğr.</td>
                          <td className="py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => {
                                setSchoolsList(prev => prev.filter(x => x.id !== s.id));
                                showNotification(`${s.name} silindi.`);
                              }}
                              className="text-zinc-400 hover:text-red-500 transition cursor-pointer p-1 rounded-md hover:bg-red-50 inline-flex items-center"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TABLE 4: COURSES LIST */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                      Eklenen Özel Kurs ve Girişimler
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Aylık veya dönemlik hazırlık/akademi şubeleri listesi</p>
                  </div>
                  <span className="bg-rose-100 text-rose-950 px-2.5 py-1 rounded-lg text-xs font-black font-mono">
                    {coursesList.length} Kurs
                  </span>
                </div>

                <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-150 text-zinc-500 font-extrabold">
                        <th className="pb-2.5 font-bold">Kurs Adı</th>
                        <th className="pb-2.5 font-bold">Lokasyon</th>
                        <th className="pb-2.5 font-bold">Eğitim Kademesi</th>
                        <th className="pb-2.5 font-bold text-center">Yoğunluk</th>
                        <th className="pb-2.5 text-right font-bold">Eylem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-700 font-semibold">
                      {coursesList.map(c => (
                        <tr
                          key={c.id}
                          className="hover:bg-zinc-50/50 transition cursor-pointer"
                          onClick={() => {
                            setSchool({
                              name: c.name,
                              location: c.location,
                              capacity: 150,
                              teachersCount: 12,
                              type: 'kurs',
                              branches: [
                                {
                                  id: 'branch-' + c.id + '-' + Date.now(),
                                  name: 'Ana Kurs Şubesi',
                                  capacity: 150,
                                  educationLevel: c.educationLevel,
                                  ateliers: 'İngilizce Drama, Yazılım Geliştirme',
                                  lessonsIntensity: c.lessonsIntensity,
                                  hours: c.hours,
                                  address: `${c.location} Ana Kurs Yerleşkesi`,
                                  phone: '+90 (212) 000 00 00',
                                  authorizedPerson: 'Koordinatör Üye',
                                  authorizedTitle: 'Kurucu Direktör',
                                  images: [STOCK_PHOTOS[1], STOCK_PHOTOS[2]]
                                }
                              ]
                            });
                            showNotification(`${c.name} kurs temel verileri aktif panele yüklendi!`);
                          }}
                          title="Hızlı Düzenlemek için Tıklayın"
                        >
                          <td className="py-2.5 font-black text-zinc-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />
                            {c.name}
                          </td>
                          <td className="py-2.5 text-zinc-650">{c.location}</td>
                          <td className="py-2.5 text-zinc-800">{c.educationLevel}</td>
                          <td className="py-2.5 text-center font-mono font-bold text-zinc-900">{c.lessonsIntensity}</td>
                          <td className="py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => {
                                setCoursesList(prev => prev.filter(x => x.id !== c.id));
                                showNotification(`${c.name} silindi.`);
                              }}
                              className="text-zinc-400 hover:text-red-500 transition cursor-pointer p-1 rounded-md hover:bg-red-50 inline-flex items-center"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xl animate-fade-in text-left">
            {/* Address Bar Emulator inside the public page */}
            <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-zinc-500 font-extrabold text-xs shrink-0">Canlı SEO Portal URL Adresi:</span>
              <div className="bg-white border border-zinc-250 text-[#FF6600] px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 select-all flex-1 shadow-inner truncate">
                <Globe className="w-4 h-4 text-[#FF6600] shrink-0" />
                <span>{currentSimulatedUrl}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="bg-zinc-950 text-white hover:bg-zinc-800 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shrink-0"
              >
                ← Panele Geri Dön
              </button>
            </div>

            {/* Public Layout */}
            <div className="p-6 sm:p-10 space-y-10">
              
              {/* Profile showcase */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-100 pb-8">
                <div>
                  <div className="flex flex-wrap gap-2 mb-2.5 items-center">
                    <span className="bg-amber-100 text-[#8C3F03] border border-amber-200 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                      {school.type === 'okul' ? 'Özel Okul Kurumsal Yayını' : 'Akademik Kurs Kurumsal Yayını'}
                    </span>
                    <span className="bg-zinc-900 text-[#39FF14] text-[10px] font-mono font-black px-2.5 py-1 rounded uppercase tracking-widest animate-pulse">
                      ● AKTİF SEO YAYININDA
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black font-display text-zinc-950 leading-tight">
                    {school.name}
                  </h1>
                  <p className="text-sm font-semibold text-zinc-500 mt-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    {school.location} / {activeBranch?.name} Şubesi Resmi Bilgilendirme Portalı
                  </p>
                </div>

                <div className="flex gap-2.5-wrap shrink-0">
                  <div className="p-4 bg-[#FAF9F5] border border-zinc-200 rounded-2xl text-center shadow-xs">
                    <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-widest">ÖĞRETMEN OKUL KADROSU</span>
                    <span className="text-2xl font-black text-zinc-950 font-mono">{school.teachersCount || 0} Kişi</span>
                  </div>
                  <div className="p-4 bg-[#FAF9F5] border border-zinc-200 rounded-2xl text-center shadow-xs">
                    <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-widest">ŞUBE REZERV KAPASİTE</span>
                    <span className="text-2xl font-black text-zinc-950 font-mono">{activeBranch?.capacity || 0} Öğrenci</span>
                  </div>
                </div>
              </div>

              {/* Grid content blocks */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Main Body details */}
                <div className="lg:col-span-8 space-y-8">
                  <div>
                    <h3 className="text-lg font-black font-display text-zinc-900 border-b border-zinc-100 pb-2 mb-3 tracking-tight">
                      Şubeye İlişkin Özel Bilgilerin İncelenmesi
                    </h3>
                    <p className="text-sm text-zinc-650 font-medium leading-relaxed">
                      Sayın Veli, Öğrenci ve Eğitim Kursiyeri adaylarımız, <br/>
                      Bu özel portal sayfası, doğrudan <strong>{school.name}</strong> yetkililerince sisteme tescil edilmiş şube verilerini barındırır. Her şubenin kapasitesi, eğitim programları, atölye imkanları ve ilgili şube yöneticisi ayrı ayrı beyan edilmiştir.
                    </p>
                  </div>

                  {/* Branch specifics and cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-5 bg-zinc-50 border border-zinc-150 rounded-2xl shadow-xs">
                      <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-widest mb-1.5">ŞUBE BİLGİSİ &amp; KADEME</span>
                      <p className="text-base font-black text-zinc-950">{activeBranch?.educationLevel || 'Kayıt Yapılmamış'}</p>
                      <p className="text-xs text-zinc-500 mt-2">Bu şubede yalnızca seçilen yaş grubuna ve akademik programa yönelik tescilli eğitimler yapılmaktadır.</p>
                    </div>

                    <div className="p-5 bg-zinc-50 border border-zinc-150 rounded-2xl shadow-xs">
                      <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-widest mb-1.5">MÜFREDAT YOĞUNLUĞU</span>
                      <p className="text-base font-black text-[#8C3F03]">{activeBranch?.lessonsIntensity || 'Kayıt Yapılmamış'}</p>
                      <p className="text-xs text-zinc-500 mt-2">İstanbul Eğitim Standartları rehberliğine ve tescil mevzuatına göre belirlenen haftalık toplam periyot.</p>
                    </div>

                    <div className="p-5 bg-zinc-50 border border-zinc-150 rounded-2xl shadow-xs">
                      <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-widest mb-1.5">DERS GİRİŞ - ÇIKIŞ SAATLERİ</span>
                      <p className="text-base font-black text-rose-800 flex items-center gap-1.5">
                        <Clock className="w-5 h-5 text-rose-700 shrink-0" />
                        {activeBranch?.hours || 'Sorulmamış'}
                      </p>
                      <p className="text-xs text-zinc-500 mt-2">Günlük idari çalışma planı olup, atölyeler ve hobi kulüpleri bu dilim içerisinde paylaştırılmaktadır.</p>
                    </div>

                    <div className="p-5 bg-zinc-50 border border-zinc-150 rounded-2xl shadow-xs">
                      <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-widest mb-1.5">YETKİLİ VE İRTİBAT</span>
                      <p className="text-base font-black text-emerald-800 flex items-center gap-1.5">
                        <UserCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                        {activeBranch?.authorizedPerson || 'Yetkili Yönetici'}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">{activeBranch?.authorizedTitle || 'Şube Müdürü'} ile <strong>{activeBranch?.phone}</strong> numarası üzerinden görüşebilirsiniz.</p>
                    </div>
                  </div>

                  {/* Branch images gallery list view */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-black font-display text-zinc-900 border-b border-zinc-100 pb-2 tracking-tight flex items-center gap-1.5">
                      <ImageIcon className="w-5 h-5 text-[#FF6600]" />
                      Şube Sınıfları, Bahçe ve Atölye Görselleri ({activeBranch?.images?.length || 0} Fotoğraf)
                    </h3>
                    {activeBranch?.images && activeBranch.images.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {activeBranch.images.map((g, i) => (
                          <div key={i} className="group overflow-hidden rounded-2xl shadow-sm border border-zinc-200 bg-zinc-50 aspect-4/3 transition duration-300 hover:scale-[1.01]">
                            <img referrerPolicy="no-referrer" src={g} alt={`Classroom or Branch visual ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-zinc-550 border border-zinc-250 p-8 text-center text-zinc-500 italic text-sm">
                        Henüz sisteme şube fotoğrafı eklenmemiştir.
                      </div>
                    )}
                  </div>

                  {/* Branch Adres Bilgisi Block */}
                  <div className="bg-[#FAF9F5] border border-zinc-200 p-6 rounded-2xl space-y-2">
                    <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-widest">ŞUBE RESMİ LOKASYON ADRESİ</span>
                    <p className="text-xs font-black text-zinc-800 leading-relaxed flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      {activeBranch?.address || 'Adres tescili yapılmamıştır.'}
                    </p>
                  </div>

                </div>

                {/* Right sidebar content */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Fark yaratan atolyeler card panel */}
                  <div className="bg-[#FAF9F5] border border-zinc-200 rounded-3xl p-6 shadow-sm">
                    <span className="text-[11px] text-[#8C3F03] font-black uppercase tracking-widest block mb-1">✦ ÖZEL ŞUBE AKİTLERİ</span>
                    <h4 className="text-sm font-black font-display text-zinc-950 mb-3.5 border-b border-zinc-200/60 pb-2">
                      Fark Yaratan Atölye Dersleri
                    </h4>
                    
                    <div className="space-y-2">
                      {activeBranch?.ateliers ? (
                        activeBranch.ateliers.split(',').map((item, id) => (
                          <div 
                            key={id} 
                            className="bg-white px-3.5 py-3 rounded-xl border border-zinc-200 shadow-xs flex items-center gap-2 text-xs font-bold text-zinc-850 hover:bg-zinc-50 transition"
                          >
                            <span className="w-2 h-2 rounded-full bg-[#FF6600] shrink-0" />
                            <span>{item.trim()} Atölyesi</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-zinc-500 italic">Henüz özel atölye tanımlaması yapılmadı.</p>
                      )}
                    </div>
                  </div>

                  {/* Simulated Breadcrumb list of all branches */}
                  <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-3.5">
                    <div className="pb-1.5 border-b border-zinc-100 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">DİĞER YAYINDAKİ ŞUBELERİ</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black font-mono">
                        {school.branches.length} Aktif
                      </span>
                    </div>
                    <div className="space-y-2">
                      {school.branches.map((b, idx) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            setSelectedBranchId(b.id);
                            window.scrollTo({ top: 120, behavior: 'smooth' });
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${selectedBranchId === b.id ? 'bg-[#FF6600]/10 border-[#FF6600] text-zinc-900' : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50'}`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-2 h-2 rounded-full ${selectedBranchId === b.id ? 'bg-[#FF6600]' : 'bg-zinc-300'}`} />
                            <span className="truncate">{b.name} Şubesi</span>
                          </div>
                          <span className="text-[9px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded shrink-0">
                            {b.educationLevel}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
