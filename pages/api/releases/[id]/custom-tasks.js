import { query } from '../../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'POST') {
    const { text, owner } = req.body || {};
    if (!text) return res.status(400).json({ error: 'text is required' });
    const { rows } = await query(
      `INSERT INTO custom_tasks (release_id, text, owner)
       VALUES ($1, $2, $3)
       RETURNING id, text, owner, status`,
      [id, text, owner || null]
    );
    return res.status(201).json(rows[0]);
  }

  if (req.method === 'PATCH') {
    const { taskId, status } = req.body || {};
    if (!taskId) return res.status(400).json({ error: 'taskId is required' });
    await query(
      `UPDATE custom_tasks SET status = $1 WHERE id = $2 AND release_id = $3`,
      [status, taskId, id]
    );
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const { taskId } = req.query;
    await query(`DELETE FROM custom_tasks WHERE id = $1 AND release_id = $2`, [taskId, id]);
    return res.status(204).end();
  }

  res.setHeader('Allow', ['POST', 'PATCH', 'DELETE']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
