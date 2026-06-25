import fs from 'fs';
import path from 'path';

async function processAll() {
  const dir = './eski-veriler-js';
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mjs'));
  let allOldCourses = [];

  for (const f of files) {
    const mod = await import('./' + path.join(dir, f).replace(/\\/g, '/'));
    if (mod.courses) {
      allOldCourses = allOldCourses.concat(mod.courses);
    } else if (mod.default) {
      allOldCourses = allOldCourses.concat(mod.default);
    }
  }

  const generatedCourses = [];
  const generatedTeachers = [];

  allOldCourses.forEach((oc, i) => {
    // Generate course
    generatedCourses.push({
      id: oc.slug || ('c-' + i),
      title: oc.title || 'İsimsiz Kurs',
      category: oc.category || 'Genel',
      level: 'Her Seviye',
      duration: 'Sürekli',
      price: oc.instructors && oc.instructors.length > 0 ? (oc.instructors[0].privatePrice || 0) : 1000,
      enrolledCount: Math.floor(Math.random() * 500) + 10,
      rating: oc.instructors && oc.instructors.length > 0 ? (oc.instructors[0].rating || 4.5) : 4.5,
      instructorName: oc.instructors && oc.instructors.length > 0 ? oc.instructors[0].name : 'Eğitmen Kadrosu',
      instructorAvatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(oc.instructors && oc.instructors.length > 0 ? oc.instructors[0].name : 'E') + '&background=random',
      instructorBio: 'Uzman Eğitmen',
      description: oc.description || oc.title || '',
      curriculum: ['Bölüm 1', 'Bölüm 2', 'Bölüm 3', 'Bölüm 4'],
      features: ['Sertifika', 'Süresiz Erişim', '7/24 Destek'],
      tags: [oc.category || 'Genel'],
      image: oc.image || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80'
    });

    // Generate teachers
    if (oc.instructors && Array.isArray(oc.instructors)) {
      oc.instructors.forEach((inst, j) => {
        generatedTeachers.push({
          id: inst.slug || ('t-' + i + '-' + j),
          name: inst.name || 'İsimsiz Öğretmen',
          avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(inst.name || 'Ö') + '&background=random',
          rating: inst.rating || 4.5,
          commentsCount: Math.floor(Math.random() * 50),
          experienceYears: new Date().getFullYear() - (inst.since || 2015),
          experienceLabel: 'Uzman',
          bio: inst.bio || (oc.title + ' alanında uzman eğitmen.'),
          preferredLocation: 'Online / Merkez',
          canCorporate: inst.corporate === true,
          canOnline: true,
          canFaceToFace: true,
          tags: [oc.category || 'Eğitim'],
          category: oc.category || 'Eğitim',
          sessions: [
            {
              name: oc.title || 'Ders',
              duration: '60 dk',
              price: inst.privatePrice || 1000
            }
          ]
        });
      });
    }
  });

  // Export as TypeScript file
  const tsContent = `export const GENERATED_COURSES = ${JSON.stringify(generatedCourses, null, 2)};\nexport const GENERATED_TEACHERS = ${JSON.stringify(generatedTeachers, null, 2)};\n`;
  fs.writeFileSync('./src/data/generated.ts', tsContent, 'utf-8');
  console.log('Successfully generated ' + generatedCourses.length + ' courses and ' + generatedTeachers.length + ' teachers.');
}

processAll().catch(console.error);
