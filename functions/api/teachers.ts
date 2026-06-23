export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare('SELECT * FROM teachers').all();
    
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
