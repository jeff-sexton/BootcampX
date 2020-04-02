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
SELECT students.id, students.name, cohorts.name AS cohort
FROM students
JOIN cohorts ON cohort_id = cohort_id
WHERE cohorts.name LIKE $2
LIMIT $1;
`, [limit, `%${cohort}%`])
  .then(res => {
    for (const user of res.rows) {
      console.log(`${user.name} has an id of ${user.id} and was in the ${user.cohort} cohort`);
    }
  })
  .catch(err => {
    console.error('query error', err.stack);
  });