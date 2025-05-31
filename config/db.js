const { Pool } = require('pg');

const pool = new Pool({
  user: env.DB_USER,
  host: env.DB_HOST,
  database: env.DB_NAME,
  password: env.DB_USER_PASSWORD,
  port: 5432,
});

module.exports = pool;