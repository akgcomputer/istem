import fs from 'fs/promises';
import { pathToFileURL } from 'url';
import path from 'path';
import crypto from 'crypto';

async function main() {
  const dir = './eski-veriler-js';
  const files = await fs.readdir(dir);
  
  let allTeachers = [];
  let allCourses = [];

  for (const file of files) {
    if (!file.endsWith('.js') && !file.endsWith('.mjs')) continue;
    if (file.endsWith('.js')) {
        const oldPath = path.join(dir, file);
        const newPath = path.join(dir, file.replace('.js', '.mjs'));
        await fs.copyFile(oldPath, newPath);
    }
  }

  const mjsFiles = await fs.readdir(dir);

  for (const file of mjsFiles) {
    if (!file.endsWith('.mjs')) continue;
    
    const newPath = path.join(dir, file);
    const fileUrl = pathToFileURL(path.resolve(newPath)).href;
    const module = await import(fileUrl);
    const courses = module.courses || module.default || [];
    
    for (const c of courses) {
      allCourses.push({
        id: crypto.randomUUID(),
        name: c.title,
        category: c.category,
        image: c.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
        type: c.category || 'Kurs',
        location: 'Merkez',
        capacity: 20,
        teachersCount: c.instructors ? c.instructors.length : 0,
        classes: [],
        hoursPerWeek: 'Haftalık 10 Saat',
        priceRange: c.instructors && c.instructors.length > 0 ? (c.instructors[0].groupPrice?.toString() || 'Belirtilmedi') : 'Belirtilmedi',
        parentReviewText: (c.description || '').replace(/'/g, "''"),
        reviewerName: 'Admin',
        rating: 5.0,
        branchesCount: 1,
        averageClassSize: 10
      });

      if (c.instructors) {
        for (const ins of c.instructors) {
          allTeachers.push({
            id: crypto.randomUUID(),
            name: ins.name,
            avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(ins.name) + '&background=random',
            rating: ins.rating || 5.0,
            commentsCount: 0,
            experienceYears: 2026 - (ins.since || 2020),
            experienceLabel: 'Uzman',
            bio: (ins.bio || '').replace(/'/g, "''"),
            preferredLocation: ins.location || '',
            canCorporate: ins.corporate ? 1 : 0,
            canOnline: ins.online ? 1 : 0,
            canFaceToFace: !ins.online ? 1 : 0,
            tags: ins.specialties || [],
            category: c.category || 'Diğer'
          });
        }
      }
    }
  }

  // remove duplicates from teachers by name
  const uniqueTeachers = Array.from(new Map(allTeachers.map(item => [item.name, item])).values());
  
  let sql = '';
  
  for (const t of uniqueTeachers) {
      sql += `INSERT INTO teachers (id, name, avatar, rating, commentsCount, experienceYears, experienceLabel, bio, preferredLocation, canCorporate, canOnline, canFaceToFace, tags, category) VALUES ('${t.id}', '${t.name.replace(/'/g, "''")}', '${t.avatar}', ${t.rating}, ${t.commentsCount}, ${t.experienceYears}, '${t.experienceLabel}', '${t.bio}', '${t.preferredLocation.replace(/'/g, "''")}', ${t.canCorporate}, ${t.canOnline}, ${t.canFaceToFace}, '${JSON.stringify(t.tags).replace(/'/g, "''")}', '${t.category.replace(/'/g, "''")}');\n`;
  }
  
  for (const c of allCourses) {
      sql += `INSERT INTO special_courses (id, name, image, type, location, capacity, teachersCount, classes, hoursPerWeek, priceRange, parentReviewText, reviewerName, rating, branchesCount, averageClassSize) VALUES ('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.image}', '${c.type.replace(/'/g, "''")}', '${c.location}', ${c.capacity}, ${c.teachersCount}, '${JSON.stringify(c.classes)}', '${c.hoursPerWeek}', '${c.priceRange}', '${c.parentReviewText}', '${c.reviewerName}', ${c.rating}, ${c.branchesCount}, ${c.averageClassSize});\n`;
  }
  
  await fs.writeFile('import.sql', sql, 'utf8');
  console.log(`Generated import.sql with ${uniqueTeachers.length} teachers and ${allCourses.length} courses!`);
}

main().catch(console.error);
