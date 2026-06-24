export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const all = url.searchParams.get('all') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';

    let baseQuery = all ? 'SELECT * FROM courses WHERE 1=1' : 'SELECT * FROM courses WHERE (isActive = 1 OR isActive IS NULL)';
    const bindParams: any[] = [];

    if (search) {
      baseQuery += ' AND (title LIKE ? OR capstoneDesc LIKE ? OR instructorName LIKE ? OR category LIKE ?)';
      const searchPattern = `%${search}%`;
      bindParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    const query = `${baseQuery} ORDER BY id DESC LIMIT ? OFFSET ?`;
    bindParams.push(limit, offset);

    const { results } = await context.env.DB.prepare(query).bind(...bindParams).all();
    
    // Convert JSON strings back to arrays and fetch lessons
    const courses = await Promise.all(results.map(async (course: any) => {
      // Parse booleans
      course.hasChallenge = !!course.hasChallenge;
      course.hasCohort = !!course.hasCohort;
      course.isPremiumIncluded = !!course.isPremiumIncluded;
      
      // Parse JSON
      if (typeof course.benefits === 'string') {
        try { course.benefits = JSON.parse(course.benefits); } catch (e) { course.benefits = []; }
      }
      
      // Fetch lessons for this course
      const lessonsQuery = await context.env.DB.prepare('SELECT * FROM lessons WHERE courseId = ?').bind(course.id).all();
      course.lessons = lessonsQuery.results.map((lesson: any) => {
        lesson.isLocked = !!lesson.isLocked;
        lesson.isCompleted = !!lesson.isCompleted;
        if (typeof lesson.quizOptions === 'string') {
          try { lesson.quizOptions = JSON.parse(lesson.quizOptions); } catch (e) { lesson.quizOptions = []; }
        }
        return lesson;
      });
      
      return course;
    }));

    return new Response(JSON.stringify(courses), {
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
    const id = data.id || `c-${Date.now()}`;
    
    // Process JSON array fields
    let benefitsStr = '[]';
    if (data.benefits) {
      if (Array.isArray(data.benefits)) benefitsStr = JSON.stringify(data.benefits);
      else if (typeof data.benefits === 'string') benefitsStr = JSON.stringify(data.benefits.split(',').map((s:string)=>s.trim()));
    }

    await context.env.DB.prepare(`
      INSERT INTO courses (id, title, category, level, duration, price, enrolledCount, rating, instructorName, instructorAvatar, instructorBio, image, hasChallenge, hasCohort, lessonsCount, xpReward, isPremiumIncluded, capstoneTitle, capstoneDesc, benefits, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, data.title || '', data.category || '', data.level || '', data.duration || '', data.currentPrice || data.price || 0,
      data.students || data.enrolledCount || 0, data.rating || 5, data.instructorName || '', data.instructorAvatar || '',
      data.instructorBio || '', data.image || '', data.hasChallenge ? 1 : 0, data.hasCohort ? 1 : 0,
      data.totalLessons || data.lessonsCount || 0, data.xpReward || 0, data.isPremiumIncluded ? 1 : 0,
      data.capstoneTitle || '', data.description || data.capstoneDesc || '', benefitsStr, 1
    ).run();

    return new Response(JSON.stringify({ success: true, id }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
