export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare('SELECT * FROM private_schools').all();
    
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
