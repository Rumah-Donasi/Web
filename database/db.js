require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const checkDB = async () => {
  try {
    const client = await pool.query('SELECT NOW()');
    console.log('Database connected successfully', client.rows[0].now, '(timestamp)');
  } catch (err) {
    console.error('Error connecting to the database', err);
  }
}

module.exports = { pool, checkDB };