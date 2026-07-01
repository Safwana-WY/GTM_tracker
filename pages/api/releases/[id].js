import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const releaseRes = await sql`SELECT * FROM releases WHERE id = ${id}`;
    if (releaseRes.rows.length === 0) return res.status(404).json({ error: 'not found' });

    const itemsRes = await sql`SELECT item_key, status FROM item_status WHERE release_id = ${id}`;
    const customRes = await sql`
      SELECT id, text, owner, status FROM custom_tasks
      WHERE release_id = ${id} ORDER BY created_at ASC
    `;

    return res.status(200).json({
      release: releaseRes.rows[0],
      itemStatus: Object.fromEntries(itemsRes.rows.map(r => [r.item_key, r.status])),
      customTasks: customRes.rows
    });
  }

  if (req.method === 'PATCH') {
    const { tier, status, item_key, item_status } = req.body || {};

    // Update release-level fields (tier, status)
    if (tier !== undefined || status !== undefined) {
      if (tier !== undefined) {
        await sql`UPDATE releases SET tier = ${tier}, updated_at = now() WHERE id = ${id}`;
      }
      if (status !== undefined) {
        await sql`UPDATE releases SET status = ${status}, updated_at = now() WHERE id = ${id}`;
      }
    }

    // Update a single checklist item's status (done / na / null to clear)
    if (item_key) {
      if (item_status === null) {
        await sql`DELETE FROM item_status WHERE release_id = ${id} AND item_key = ${item_key}`;
      } else {
        await sql`
          INSERT INTO item_status (release_id, item_key, status)
          VALUES (${id}, ${item_key}, ${item_status})
          ON CONFLICT (release_id, item_key)
          DO UPDATE SET status = EXCLUDED.status, updated_at = now()
        `;
      }
    }

    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM releases WHERE id = ${id}`;
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
