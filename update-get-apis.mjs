import fs from 'fs';
import path from 'path';

const entities = ['teachers', 'courses', 'special_courses', 'private_schools'];

for (const entity of entities) {
  const indexFilePath = path.join('functions', 'api', entity, 'index.ts');
  if (fs.existsSync(indexFilePath)) {
    let content = fs.readFileSync(indexFilePath, 'utf-8');
    
    // Check if we already handle ?all=true
    if (!content.includes('all=true')) {
      // Modify the DB.prepare to include query params check
      if (entity === 'teachers') {
        content = content.replace(
          "const { results: teachers } = await context.env.DB.prepare('SELECT * FROM teachers').all();",
          `const url = new URL(context.request.url);
    const all = url.searchParams.get('all') === 'true';
    const query = all ? 'SELECT * FROM teachers' : 'SELECT * FROM teachers WHERE isActive = 1 OR isActive IS NULL';
    const { results: teachers } = await context.env.DB.prepare(query).all();`
        );
      } else {
        content = content.replace(
          `const { results } = await context.env.DB.prepare('SELECT * FROM ${entity}').all();`,
          `const url = new URL(context.request.url);
    const all = url.searchParams.get('all') === 'true';
    const query = all ? 'SELECT * FROM ${entity}' : 'SELECT * FROM ${entity} WHERE isActive = 1 OR isActive IS NULL';
    const { results } = await context.env.DB.prepare(query).all();`
        );
      }
      fs.writeFileSync(indexFilePath, content);
      console.log(\`Updated \${entity}/index.ts\`);
    }
  }
}
