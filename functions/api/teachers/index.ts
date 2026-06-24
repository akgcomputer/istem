export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const all = url.searchParams.get('all') === 'true';
    const query = all ? 'SELECT * FROM teachers' : 'SELECT * FROM teachers WHERE isActive = 1 OR isActive IS NULL';
    const { results: teachers } = await context.env.DB.prepare(query).all();
    const { results: sessions } = await context.env.DB.prepare('SELECT * FROM teacher_sessions').all();

    // Map DB rows to expected JSON format
    const formattedResults = teachers.map((row: any) => {
      // Find sessions for this teacher
      const teacherSessions = sessions.filter((s: any) => s.teacherId === row.id).map((s: any) => ({
        name: s.name,
        price: s.price,
        duration: '60 dk',
        courseId: s.courseId
      }));

      return {
        ...row,
        tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
        canCorporate: Boolean(row.canCorporate),
        canOnline: Boolean(row.canOnline),
        canFaceToFace: Boolean(row.canFaceToFace),
        sessions: teacherSessions.length > 0 ? teacherSessions : []
      };
    });

    return new Response(JSON.stringify(formattedResults), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
