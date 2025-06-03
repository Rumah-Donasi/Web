const { Pool } = require('pg');

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_USER_PASSWORD,
//   port: 5432,
// });
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'donasi',
  password: 'Feelinggood1',
  port: 5432,
});

module.exports = pool;