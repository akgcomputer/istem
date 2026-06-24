import fs from 'fs';
import path from 'path';

const entities = ['teachers', 'courses', 'special_courses', 'private_schools', 'challenges'];

for (const entity of entities) {
  const dir = path.join('functions', 'api', entity);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // [id].ts for PUT and DELETE
  const idFilePath = path.join(dir, '[id].ts');
  const idFileContent = `
export const onRequestPut: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const id = context.params.id as string;
    const data = await context.request.json() as any;
    
    // Build dynamic SET clause
    const keys = Object.keys(data).filter(k => k !== 'id');
    if (keys.length === 0) return new Response('No data to update', { status: 400 });
    
    const setClause = keys.map(k => \`\${k} = ?\`).join(', ');
    const values = keys.map(k => {
      const v = data[k];
      return typeof v === 'object' ? JSON.stringify(v) : v;
    });
    
    await context.env.DB.prepare(\`UPDATE ${entity} SET \${setClause} WHERE id = ?\`)
      .bind(...values, id)
      .run();
      
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const id = context.params.id as string;
    await context.env.DB.prepare(\`DELETE FROM ${entity} WHERE id = ?\`).bind(id).run();
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
`;
  fs.writeFileSync(idFilePath, idFileContent.trim());
}

// Special challenges index.ts
const challengesIndex = `
export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const all = url.searchParams.get('all') === 'true';
    const query = all ? 'SELECT * FROM challenges' : 'SELECT * FROM challenges WHERE isActive = 1 OR isActive IS NULL';
    const { results } = await context.env.DB.prepare(query).all();
    return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const data = await context.request.json() as any;
    const id = data.id || 'chal-' + Date.now();
    await context.env.DB.prepare(
      'INSERT INTO challenges (id, title, category, sponsor, limit_text, date, status, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, data.title, data.category, data.sponsor, data.limit_text, data.date, data.status || 'Aktif', 1).run();
    return new Response(JSON.stringify({ success: true, id }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
`;
fs.writeFileSync(path.join('functions', 'api', 'challenges', 'index.ts'), challengesIndex.trim());

console.log("API files generated.");
