export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare('SELECT * FROM special_courses').all();
    
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
