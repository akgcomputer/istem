export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const all = url.searchParams.get('all') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';

    let baseQuery = all ? 'SELECT * FROM teachers WHERE 1=1' : 'SELECT * FROM teachers WHERE (isActive = 1 OR isActive IS NULL)';
    const bindParams: any[] = [];

    if (search) {
      baseQuery += ' AND (name LIKE ? OR bio LIKE ? OR location LIKE ? OR tags LIKE ?)';
      const searchPattern = `%${search}%`;
      bindParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    const query = `${baseQuery} ORDER BY id DESC LIMIT ? OFFSET ?`;
    bindParams.push(limit, offset);

    const { results } = await context.env.DB.prepare(query).bind(...bindParams).all();
    
    // Convert JSON strings back to arrays
    const teachers = await Promise.all(results.map(async (teacher: any) => {
      // Parse tags
      if (typeof teacher.tags === 'string') {
        try { teacher.tags = JSON.parse(teacher.tags); } catch (e) { teacher.tags = []; }
      }
      
      // Fetch sessions for this teacher
      const sessionsQuery = await context.env.DB.prepare('SELECT name, price, courseId FROM teacher_sessions WHERE teacherId = ?').bind(teacher.id).all();
      teacher.sessions = sessionsQuery.results;
      
      // Parse booleans
      teacher.canCorporate = !!teacher.canCorporate;
      teacher.canOnline = !!teacher.canOnline;
      teacher.canFaceToFace = !!teacher.canFaceToFace;
      
      return teacher;
    }));

    return new Response(JSON.stringify(teachers), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const data = await context.request.json() as any;
    const id = data.id || `t-${Date.now()}`;
    
    // Process tags
    let tagsStr = '[]';
    if (data.tags) {
      if (Array.isArray(data.tags)) tagsStr = JSON.stringify(data.tags);
      else if (typeof data.tags === 'string') tagsStr = JSON.stringify(data.tags.split(',').map((s:string)=>s.trim()));
    }

    await context.env.DB.prepare(`
      INSERT INTO teachers (id, name, avatar, rating, commentsCount, experienceYears, experienceLabel, bio, preferredLocation, canCorporate, canOnline, canFaceToFace, tags, category, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, data.name || '', data.image || data.avatar || '', data.rating || 5, data.commentsCount || 0,
      data.since ? new Date().getFullYear() - data.since : data.experienceYears || 0, data.experienceLabel || '',
      data.bio || '', data.location || data.preferredLocation || '',
      data.canCorporate ? 1 : 0, data.canOnline ? 1 : 0, data.canFaceToFace ? 1 : 0,
      tagsStr, data.categoryId || data.category || '', 1
    ).run();

    // insert sessions
    if (data.sessions && Array.isArray(data.sessions)) {
      for (const session of data.sessions) {
        if (!session.name || !session.price) continue;
        await context.env.DB.prepare(`
          INSERT INTO teacher_sessions (teacherId, name, price, courseId)
          VALUES (?, ?, ?, ?)
        `).bind(id, session.name || '', session.price || 0, session.courseId || '').run();
      }
    }

    return new Response(JSON.stringify({ success: true, id }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
