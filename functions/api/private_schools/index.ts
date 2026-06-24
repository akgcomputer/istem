export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const all = url.searchParams.get('all') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';

    let baseQuery = all ? 'SELECT * FROM private_schools WHERE 1=1' : 'SELECT * FROM private_schools WHERE (isActive = 1 OR isActive IS NULL)';
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
    const schools = results.map((school: any) => {
      const arrayFields = ['lessons', 'deals', 'physicalFacilities', 'services', 'activities', 'languages'];
      for (const field of arrayFields) {
        if (typeof school[field] === 'string') {
          try { school[field] = JSON.parse(school[field]); } catch (e) { school[field] = []; }
        } else if (!school[field]) {
          school[field] = [];
        }
      }
      return school;
    });

    return new Response(JSON.stringify(schools), {
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
    const id = data.id || `s-${Date.now()}`;
    
    // Process JSON array fields
    const arrayFields = ['lessons', 'deals', 'physicalFacilities', 'services', 'activities', 'languages'];
    const processed: Record<string, string> = {};
    for (const field of arrayFields) {
      if (data[field]) {
        if (Array.isArray(data[field])) processed[field] = JSON.stringify(data[field]);
        else if (typeof data[field] === 'string') processed[field] = JSON.stringify(data[field].split(',').map((s:string)=>s.trim()));
      } else {
        processed[field] = '[]';
      }
    }

    await context.env.DB.prepare(`
      INSERT INTO private_schools (id, name, image, location, capacity, teachersCount, type, lessons, lessonHours, schoolHours, parentReviewText, reviewerName, rating, sector, averageClassSize, branchesCount, reviewsCount, imagesCount, deals, monthlyPrice, classSizeCategory, educationSystem, physicalFacilities, services, activities, languages, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, data.name || '', data.image || '', data.district || data.location || '', data.capacity || 0,
      data.teachers || data.teachersCount || 0, data.type || data.level || '', processed.lessons, data.lessonHours || data.duration || '',
      data.schoolHours || '', data.parentReviewText || '', data.reviewerName || '', data.rating || 5, data.sector || '',
      data.averageClassSize || 0, data.branches || data.branchesCount || 1, data.reviews || data.reviewsCount || 0,
      data.imagesCount || 0, processed.deals, data.price || data.monthlyPrice || 0, data.classSizeCategory || '',
      data.educationSystem || '', processed.physicalFacilities, processed.services, processed.activities, processed.languages, 1
    ).run();

    return new Response(JSON.stringify({ success: true, id }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
