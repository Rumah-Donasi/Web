const pool = new Pool({
  host: 'db.ocuwghtrsjrfqnqyfvjn.supabase.co',
  port: 5432,
  user: 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false, // Wajib untuk koneksi ke Supabase
  },
});
