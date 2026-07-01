import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { rows } = await query(
      `SELECT id, name, tier, status, created_at, updated_at
       FROM releases
       ORDER BY created_at DESC`
    );
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const { name, tier } = req.body || {};
    if (!name || !tier) {
      return res.status(400).json({ error: 'name and tier are required' });
    }
    const { rows } = await query(
      `INSERT INTO releases (name, tier)
       VALUES ($1, $2)
       RETURNING id, name, tier, status, created_at, updated_at`,
      [name, tier]
    );
    return res.status(201).json(rows[0]);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
