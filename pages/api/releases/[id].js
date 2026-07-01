import { query } from '../../../lib/db';

export default async function handler(req, res) {
  const id = Number(req.query.id);

  if (req.method === 'GET') {
    const releaseRes = await query(`SELECT * FROM releases WHERE id = $1`, [id]);
    if (releaseRes.rows.length === 0) return res.status(404).json({ error: 'not found' });

    const itemsRes = await query(
      `SELECT item_key, status FROM item_status WHERE release_id = $1`,
      [id]
    );
    const customRes = await query(
      `SELECT id, text, owner, status FROM custom_tasks
       WHERE release_id = $1 ORDER BY created_at ASC`,
      [id]
    );

    return res.status(200).json({
      release: releaseRes.rows[0],
      itemStatus: Object.fromEntries(itemsRes.rows.map(r => [r.item_key, r.status])),
      customTasks: customRes.rows
    });
  }

  if (req.method === 'PATCH') {
    const { tier, status, item_key, item_status } = req.body || {};

    // Update release-level fields (tier, status)
    if (tier !== undefined) {
      await query(`UPDATE releases SET tier = $1, updated_at = now() WHERE id = $2`, [tier, id]);
    }
    if (status !== undefined) {
      await query(`UPDATE releases SET status = $1, updated_at = now() WHERE id = $2`, [status, id]);
    }

    // Update a single checklist item's status (done / na / null to clear)
    if (item_key) {
      if (item_status === null || item_status === undefined) {
        await query(`DELETE FROM item_status WHERE release_id = $1 AND item_key = $2`, [id, item_key]);
      } else {
        await query(
          `INSERT INTO item_status (release_id, item_key, status)
           VALUES ($1, $2, $3)
           ON CONFLICT (release_id, item_key)
           DO UPDATE SET status = EXCLUDED.status, updated_at = now()`,
          [id, item_key, item_status]
        );
      }
    }

    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    await query(`DELETE FROM releases WHERE id = $1`, [id]);
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
