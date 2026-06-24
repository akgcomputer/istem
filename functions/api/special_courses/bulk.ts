export async function onRequestPost(context: any) {
  try {
    const data = await context.request.json();
    if (!Array.isArray(data)) {
      return new Response(JSON.stringify({ error: "Expected an array" }), { status: 400 });
    }

    const db = context.env.DB;
    const stmt = db.prepare(`
      INSERT INTO special_courses (id, name, image, type, location, capacity, teachersCount, classes, hoursPerWeek, priceRange, parentReviewText, reviewerName, rating, branchesCount, averageClassSize)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)
    `);

    const batch = data.map((c: any) => stmt.bind(
      c.id || 'c-bulk-' + Date.now() + Math.floor(Math.random()*1000),
      c.name || 'Yeni Kurs',
      c.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
      c.type || 'Kurs',
      c.location || '',
      c.capacity || 0,
      c.teachersCount || 0,
      JSON.stringify(c.classes || []),
      c.hoursPerWeek || '',
      c.priceRange || '',
      c.parentReviewText || '',
      c.reviewerName || '',
      c.rating || 5.0,
      c.branchesCount || 1,
      c.averageClassSize || 0
    ));

    await db.batch(batch);

    return new Response(JSON.stringify({ success: true, count: data.length }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
