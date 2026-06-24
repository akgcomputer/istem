import fs from 'fs/promises';
import { pathToFileURL } from 'url';
import path from 'path';
import crypto from 'crypto';

async function main() {
  const dir = './eski-veriler-js';
  const mjsFiles = await fs.readdir(dir);

  let allTeachersMap = new Map();
  let allCourses = [];
  let allSessions = [];

  for (const file of mjsFiles) {
    if (!file.endsWith('.mjs')) continue;
    
    const newPath = path.join(dir, file);
    const fileUrl = pathToFileURL(path.resolve(newPath)).href;
    const module = await import(fileUrl);
    const courses = module.courses || module.default || [];
    
    for (const c of courses) {
      const courseId = crypto.randomUUID();
      allCourses.push({
        id: courseId,
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
          let teacherId;
          if (allTeachersMap.has(ins.name)) {
            teacherId = allTeachersMap.get(ins.name).id;
            // Add tags if not present
            const currentTeacher = allTeachersMap.get(ins.name);
            const newTags = ins.specialties || [];
            currentTeacher.tags = Array.from(new Set([...currentTeacher.tags, ...newTags]));
          } else {
            teacherId = crypto.randomUUID();
            allTeachersMap.set(ins.name, {
              id: teacherId,
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

          // Generate Sessions for this teacher based on course pricing
          if (ins.privatePrice) {
            allSessions.push({
              teacherId: teacherId,
              name: `Birebir Ders - ${c.title}`,
              price: ins.privatePrice,
              courseId: courseId
            });
          }
          if (ins.groupPrice) {
            allSessions.push({
              teacherId: teacherId,
              name: `Grup Dersi - ${c.title}`,
              price: ins.groupPrice,
              courseId: courseId
            });
          }
        }
      }
    }
  }

  const uniqueTeachers = Array.from(allTeachersMap.values());
  
  let sql = 'DELETE FROM teacher_sessions;\nDELETE FROM teachers;\nDELETE FROM special_courses;\n\n';
  
  for (const t of uniqueTeachers) {
      sql += `INSERT INTO teachers (id, name, avatar, rating, commentsCount, experienceYears, experienceLabel, bio, preferredLocation, canCorporate, canOnline, canFaceToFace, tags, category) VALUES ('${t.id}', '${t.name.replace(/'/g, "''")}', '${t.avatar}', ${t.rating}, ${t.commentsCount}, ${t.experienceYears}, '${t.experienceLabel}', '${t.bio}', '${t.preferredLocation.replace(/'/g, "''")}', ${t.canCorporate}, ${t.canOnline}, ${t.canFaceToFace}, '${JSON.stringify(t.tags).replace(/'/g, "''")}', '${t.category.replace(/'/g, "''")}');\n`;
  }
  
  for (const c of allCourses) {
      sql += `INSERT INTO special_courses (id, name, image, type, location, capacity, teachersCount, classes, hoursPerWeek, priceRange, parentReviewText, reviewerName, rating, branchesCount, averageClassSize) VALUES ('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.image}', '${c.type.replace(/'/g, "''")}', '${c.location}', ${c.capacity}, ${c.teachersCount}, '${JSON.stringify(c.classes)}', '${c.hoursPerWeek}', '${c.priceRange}', '${c.parentReviewText.replace(/'/g, "''")}', '${c.reviewerName}', ${c.rating}, ${c.branchesCount}, ${c.averageClassSize});\n`;
  }

  for (const s of allSessions) {
      sql += `INSERT INTO teacher_sessions (teacherId, name, price, courseId) VALUES ('${s.teacherId}', '${s.name.replace(/'/g, "''")}', ${s.price}, '${s.courseId}');\n`;
  }
  
  await fs.writeFile('import_v2.sql', sql, 'utf8');
  console.log(`Generated import_v2.sql with ${uniqueTeachers.length} teachers, ${allCourses.length} courses, and ${allSessions.length} sessions!`);
}

main().catch(console.error);
