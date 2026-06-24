export async function onRequestPost(context: any) {
  try {
    const data = await context.request.json();
    if (!Array.isArray(data)) {
      return new Response(JSON.stringify({ error: "Expected an array" }), { status: 400 });
    }

    const db = context.env.DB;
    const stmt = db.prepare(`
      INSERT INTO teachers (id, name, avatar, rating, commentsCount, experienceYears, experienceLabel, bio, preferredLocation, canCorporate, canOnline, canFaceToFace, tags, category) 
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)
    `);

    const batch = data.map((t: any) => stmt.bind(
      t.id || 't-bulk-' + Date.now() + Math.floor(Math.random()*1000),
      t.name || 'İsimsiz Eğitmen',
      t.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      t.rating || 5.0,
      t.commentsCount || 0,
      t.experienceYears || 1,
      t.experienceLabel || 'Yeni',
      t.bio || '',
      t.preferredLocation || '',
      t.canCorporate ? 1 : 0,
      t.canOnline ? 1 : 0,
      t.canFaceToFace ? 1 : 0,
      JSON.stringify(t.tags || []),
      t.category || 'Diğer'
    ));

    await db.batch(batch);

    return new Response(JSON.stringify({ success: true, count: data.length }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
