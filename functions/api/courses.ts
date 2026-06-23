export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare('SELECT * FROM courses').all();
    
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
