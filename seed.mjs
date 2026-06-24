import { MOCK_PRIVATE_SCHOOLS, MOCK_SPECIAL_COURSES, MOCK_TEACHERS } from './src/data/catalogData.ts';
import fs from 'fs';

const escapeSql = (val) => {
  if (val === undefined || val === null) return 'NULL';
  if (typeof val === 'string') return "'" + val.replace(/'/g, "''") + "'";
  if (typeof val === 'boolean') return val ? 1 : 0;
  if (typeof val === 'number') return val;
  if (Array.isArray(val) || typeof val === 'object') return "'" + JSON.stringify(val).replace(/'/g, "''") + "'";
  return "'" + String(val).replace(/'/g, "''") + "'";
};

let sql = '';

for (const s of MOCK_PRIVATE_SCHOOLS) {
  sql += `INSERT INTO private_schools (id, name, image, location, capacity, teachersCount, type, lessons, lessonHours, schoolHours, parentReviewText, reviewerName, rating, sector, averageClassSize, branchesCount, reviewsCount, imagesCount, deals, monthlyPrice, classSizeCategory, educationSystem, physicalFacilities, services, activities, languages) VALUES (${escapeSql(s.id)}, ${escapeSql(s.name)}, ${escapeSql(s.image)}, ${escapeSql(s.location)}, ${escapeSql(s.capacity)}, ${escapeSql(s.teachersCount)}, ${escapeSql(s.type)}, ${escapeSql(s.lessons)}, ${escapeSql(s.lessonHours)}, ${escapeSql(s.schoolHours)}, ${escapeSql(s.parentReviewText)}, ${escapeSql(s.reviewerName)}, ${escapeSql(s.rating)}, ${escapeSql(s.sector)}, ${escapeSql(s.averageClassSize)}, ${escapeSql(s.branchesCount)}, ${escapeSql(s.reviewsCount)}, ${escapeSql(s.imagesCount)}, ${escapeSql(s.deals)}, ${escapeSql(s.monthlyPrice)}, ${escapeSql(s.classSizeCategory)}, ${escapeSql(s.educationSystem)}, ${escapeSql(s.physicalFacilities)}, ${escapeSql(s.services)}, ${escapeSql(s.activities)}, ${escapeSql(s.languages)});\n`;
}

for (const c of MOCK_SPECIAL_COURSES) {
  sql += `INSERT INTO special_courses (id, name, image, type, location, capacity, teachersCount, classes, hoursPerWeek, priceRange, parentReviewText, reviewerName, rating, branchesCount, averageClassSize) VALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.image)}, ${escapeSql(c.type)}, ${escapeSql(c.location)}, ${escapeSql(c.capacity)}, ${escapeSql(c.teachersCount)}, ${escapeSql(c.classes)}, ${escapeSql(c.hoursPerWeek)}, ${escapeSql(c.priceRange)}, ${escapeSql(c.parentReviewText)}, ${escapeSql(c.reviewerName)}, ${escapeSql(c.rating)}, ${escapeSql(c.branchesCount)}, ${escapeSql(c.averageClassSize)});\n`;
}

for (const t of MOCK_TEACHERS) {
  sql += `INSERT INTO teachers (id, name, avatar, rating, commentsCount, experienceYears, experienceLabel, bio, preferredLocation, canCorporate, canOnline, canFaceToFace, tags, category) VALUES (${escapeSql(t.id)}, ${escapeSql(t.name)}, ${escapeSql(t.avatar)}, ${escapeSql(t.rating)}, ${escapeSql(t.commentsCount)}, ${escapeSql(t.experienceYears)}, ${escapeSql(t.experienceLabel)}, ${escapeSql(t.bio)}, ${escapeSql(t.preferredLocation)}, ${escapeSql(t.canCorporate)}, ${escapeSql(t.canOnline)}, ${escapeSql(t.canFaceToFace)}, ${escapeSql(t.tags)}, ${escapeSql(t.category)});\n`;
  for (const sess of t.sessions) {
    sql += `INSERT INTO teacher_sessions (teacherId, name, price, courseId) VALUES (${escapeSql(t.id)}, ${escapeSql(sess.name)}, ${escapeSql(sess.price)}, ${escapeSql(sess.courseId)});\n`;
  }
}

fs.writeFileSync('seed.sql', sql);
console.log("seed.sql created!");
