const { PrismaClient } = require('@prisma/client');

// Standard Next.js serverless pattern: cache the client on the global object
// so warm function invocations reuse the same connection instead of opening
// a fresh one every time (this is the main fix for the slowness — Prisma's
// client is built to hold and reuse a pooled connection to Prisma Postgres,
// unlike a raw `pg` connection which re-handshakes on every cold start).
const globalForPrisma = globalThis;

const prisma = globalForPrisma.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}

// Thin wrapper so the API routes barely need to change: same query(text, params)
// shape as before, but backed by Prisma's $queryRawUnsafe / $executeRawUnsafe.
// (Using *Unsafe variants because our SQL already has $1/$2-style placeholders
// from the previous pg-based code; Prisma substitutes them positionally.)
async function query(text, params = []) {
  const trimmed = text.trim().toUpperCase();
  if (trimmed.startsWith('SELECT') || trimmed.includes('RETURNING')) {
    const rows = await prisma.$queryRawUnsafe(text, ...params);
    return { rows };
  }
  const count = await prisma.$executeRawUnsafe(text, ...params);
  return { rows: [], rowCount: count };
}

module.exports = { query, prisma };
