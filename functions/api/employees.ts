export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare('SELECT * FROM employees').all();
    
    // Convert JSON strings back to arrays and objects
    const employees = results.map((emp: any) => {
      if (typeof emp.assignedCourses === 'string') {
        try { emp.assignedCourses = JSON.parse(emp.assignedCourses); } catch (e) { emp.assignedCourses = []; }
      } else if (!emp.assignedCourses) {
        emp.assignedCourses = [];
      }
      
      if (typeof emp.progress === 'string') {
        try { emp.progress = JSON.parse(emp.progress); } catch (e) { emp.progress = {}; }
      } else if (!emp.progress) {
        emp.progress = {};
      }
      return emp;
    });

    return new Response(JSON.stringify(employees), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
