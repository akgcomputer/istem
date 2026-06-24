export const onRequestPut: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const id = context.params.id as string;
    const data = await context.request.json() as any;
    
    // Build dynamic SET clause
    const keys = Object.keys(data).filter(k => k !== 'id');
    if (keys.length === 0) return new Response('No data to update', { status: 400 });
    
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => {
      const v = data[k];
      return typeof v === 'object' ? JSON.stringify(v) : v;
    });
    
    await context.env.DB.prepare(`UPDATE private_schools SET ${setClause} WHERE id = ?`)
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
    await context.env.DB.prepare(`DELETE FROM private_schools WHERE id = ?`).bind(id).run();
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};