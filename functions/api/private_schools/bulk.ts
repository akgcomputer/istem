export async function onRequestPost(context: any) {
  try {
    const data = await context.request.json();
    if (!Array.isArray(data)) {
      return new Response(JSON.stringify({ error: "Expected an array" }), { status: 400 });
    }

    const db = context.env.DB;
    const stmt = db.prepare(`
      INSERT INTO private_schools (id, name, image, location, capacity, teachersCount, type, lessons, lessonHours, schoolHours, parentReviewText, reviewerName, rating, sector, averageClassSize, branchesCount, reviewsCount, imagesCount, deals, monthlyPrice, classSizeCategory, educationSystem, physicalFacilities, services, activities, languages)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21, ?22, ?23, ?24, ?25, ?26)
    `);

    const batch = data.map((s: any) => stmt.bind(
      s.id || 's-bulk-' + Date.now() + Math.floor(Math.random()*1000),
      s.name || 'Yeni Okul',
      s.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
      s.location || '',
      s.capacity || 0,
      s.teachersCount || 0,
      s.type || 'Lise',
      JSON.stringify(s.lessons || []),
      s.lessonHours || '',
      s.schoolHours || '',
      s.parentReviewText || '',
      s.reviewerName || '',
      s.rating || 5.0,
      s.sector || 'Özel Okul',
      s.averageClassSize || 0,
      s.branchesCount || 1,
      s.reviewsCount || 0,
      s.imagesCount || 0,
      JSON.stringify(s.deals || []),
      s.monthlyPrice || 0,
      s.classSizeCategory || '',
      s.educationSystem || '',
      JSON.stringify(s.physicalFacilities || []),
      JSON.stringify(s.services || []),
      JSON.stringify(s.activities || []),
      JSON.stringify(s.languages || [])
    ));

    await db.batch(batch);

    return new Response(JSON.stringify({ success: true, count: data.length }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
