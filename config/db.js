const { Pool } = require('pg'); // ← WAJIB ADA

const pool = new Pool({
  host: 'db.ocuwghtrsjrfqnqyfvjn.supabase.co',
  port: 5432,
  user: 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
