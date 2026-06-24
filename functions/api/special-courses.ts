export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const all = url.searchParams.get('all') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';

    let baseQuery = all ? 'SELECT * FROM special_courses WHERE 1=1' : 'SELECT * FROM special_courses WHERE (isActive = 1 OR isActive IS NULL)';
    const bindParams: any[] = [];

    if (search) {
      baseQuery += ' AND (name LIKE ? OR location LIKE ? OR type LIKE ?)';
      const searchPattern = `%${search}%`;
      bindParams.push(searchPattern, searchPattern, searchPattern);
    }

    const query = `${baseQuery} ORDER BY id DESC LIMIT ? OFFSET ?`;
    bindParams.push(limit, offset);

    const { results } = await context.env.DB.prepare(query).bind(...bindParams).all();
    
    // Convert JSON strings back to arrays
    const specialCourses = results.map((course: any) => {
      if (typeof course.classes === 'string') {
        try { course.classes = JSON.parse(course.classes); } catch (e) { course.classes = []; }
      } else if (!course.classes) {
        course.classes = [];
      }
      return course;
    });

    return new Response(JSON.stringify(specialCourses), {
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
    const id = data.id || `sc-${Date.now()}`;
    
    // Process JSON array fields
    let classesStr = '[]';
    if (data.classes) {
      if (Array.isArray(data.classes)) classesStr = JSON.stringify(data.classes);
      else if (typeof data.classes === 'string') classesStr = JSON.stringify(data.classes.split(',').map((s:string)=>s.trim()));
    }

    await context.env.DB.prepare(`
      INSERT INTO special_courses (id, name, image, type, location, capacity, teachersCount, classes, hoursPerWeek, priceRange, parentReviewText, reviewerName, rating, branchesCount, averageClassSize, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, data.name || '', data.image || '', data.type || '', data.location || '',
      data.capacity || data.students || 0, data.teachersCount || data.instructors || 1,
      classesStr, data.hoursPerWeek || data.duration || '', data.priceRange || data.price || '0',
      data.parentReviewText || '', data.reviewerName || '', data.rating || 5, data.branchesCount || 1,
      data.averageClassSize || 0, 1
    ).run();

    return new Response(JSON.stringify({ success: true, id }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
