export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare('SELECT * FROM categories').all();
    
    // Convert JSON strings back to arrays
    const categories = results.map((cat: any) => {
      if (typeof cat.topSkills === 'string') {
        try { cat.topSkills = JSON.parse(cat.topSkills); } catch (e) { cat.topSkills = []; }
      } else if (!cat.topSkills) {
        cat.topSkills = [];
      }
      return cat;
    });

    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
