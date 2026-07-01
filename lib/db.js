const { Pool } = require('pg');

let pool;

// Works with Prisma Postgres, plain Vercel Postgres, Neon, Supabase, or any
// standard Postgres connection string exposed as DATABASE_URL.
function getPool() {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL;

    if (!connectionString) {
      throw new Error(
        'No database connection string found. Set DATABASE_URL (or POSTGRES_URL) in your Vercel project environment variables.'
      );
    }

    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
    });
  }
  return pool;
}

async function query(text, params) {
  return getPool().query(text, params);
}

module.exports = { query, getPool };
