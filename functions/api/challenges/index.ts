export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const all = url.searchParams.get('all') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';

    let baseQuery = all ? 'SELECT * FROM challenges WHERE 1=1' : 'SELECT * FROM challenges WHERE (isActive = 1 OR isActive IS NULL)';
    const bindParams: any[] = [];

    if (search) {
      baseQuery += ' AND (title LIKE ? OR category LIKE ? OR sponsor LIKE ?)';
      const searchPattern = `%${search}%`;
      bindParams.push(searchPattern, searchPattern, searchPattern);
    }

    const query = `${baseQuery} ORDER BY id DESC LIMIT ? OFFSET ?`;
    bindParams.push(limit, offset);

    const { results } = await context.env.DB.prepare(query).bind(...bindParams).all();
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