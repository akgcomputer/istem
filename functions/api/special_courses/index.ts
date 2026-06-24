export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare('SELECT * FROM special_courses').all();

    // Map DB rows to expected JSON format
    const formattedResults = results.map((row: any) => ({
      ...row,
      classes: typeof row.classes === 'string' ? JSON.parse(row.classes) : row.classes,
    }));

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
