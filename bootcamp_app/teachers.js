require('dotenv').config();

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const database = process.env.DB_DATABASE;

const { Pool } = require('pg');

const pool = new Pool({
  user,
  password,
  host,
  database
});

pool.connect((err) => {
  if (err) throw err;
  console.log('Database connected');

});

const cohort = process.argv[2] || 'FEB';
const limit = process.argv[3] || 5;

pool.query(`
SELECT DISTINCT teachers.name AS teacher,
cohorts.name AS cohort
FROM teachers
JOIN assistance_requests ON teacher_id = teachers.id
JOIN students ON student_id = students.id
JOIN cohorts ON cohort_id = cohorts.id
WHERE cohorts.name LIKE $2
ORDER BY teacher
LIMIT $1;
`, [limit, `%${cohort}%`])
  .then(res => {
    for (const teacher of res.rows) {
      console.log(`${teacher.cohort}: ${teacher.teacher}`);
    }
  })
  .catch(err => {
    console.error('query error', err.stack);
  });