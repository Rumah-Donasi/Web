const { Pool } = require('pg'); // ← WAJIB ADA

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
