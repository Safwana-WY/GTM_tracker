import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'POST') {
    const { text, owner } = req.body || {};
    if (!text) return res.status(400).json({ error: 'text is required' });
    const { rows } = await sql`
      INSERT INTO custom_tasks (release_id, text, owner)
      VALUES (${id}, ${text}, ${owner || null})
      RETURNING id, text, owner, status
    `;
    return res.status(201).json(rows[0]);
  }

  if (req.method === 'PATCH') {
    const { taskId, status } = req.body || {};
    if (!taskId) return res.status(400).json({ error: 'taskId is required' });
    await sql`UPDATE custom_tasks SET status = ${status} WHERE id = ${taskId} AND release_id = ${id}`;
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const { taskId } = req.query;
    await sql`DELETE FROM custom_tasks WHERE id = ${taskId} AND release_id = ${id}`;
    return res.status(204).end();
  }

  res.setHeader('Allow', ['POST', 'PATCH', 'DELETE']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
