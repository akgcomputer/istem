import { COURSES } from './src/data';
import { MOCK_TEACHERS } from './src/data/catalogData';

console.log('--- COURSES ---');
console.log('Count:', COURSES.length);
console.log('First 3 COURSES:');
COURSES.slice(0, 3).forEach((c, i) => {
  console.log(`[${i}] ID: ${c.id}`);
  console.log(`    Title: ${c.title}`);
  console.log(`    Name: ${(c as any).name}`);
  console.log(`    Instructor: ${c.instructorName}`);
});

console.log('\n--- TEACHERS ---');
console.log('Count:', MOCK_TEACHERS.length);
console.log('First 3 TEACHERS:');
MOCK_TEACHERS.slice(0, 3).forEach((t, i) => {
  console.log(`[${i}] ID: ${t.id}`);
  console.log(`    Name: ${t.name}`);
});
