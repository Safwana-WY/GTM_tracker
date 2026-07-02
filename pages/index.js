import { useEffect, useState, useCallback } from 'react';
import { TIERS } from '../lib/checklistTemplate';

const TIER_LABELS = { 1: 'Major', 2: 'Minor', 3: 'Patch', 4: 'New Product', 5: 'WP Plugin' };

function pct(done, total) {
  return total ? Math.round((done / total) * 100) : 0;
}

export default function Home() {
  const [releases, setReleases] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null); // { release, itemStatus, customTasks }
  const [newName, setNewName] = useState('');
  const [newTier, setNewTier] = useState('1');
  const [taskText, setTaskText] = useState('');
  const [taskOwner, setTaskOwner] = useState('');
  const [loading, setLoading] = useState(false);
  const [tierFilter, setTierFilter] = useState('all'); // 'all' | '1' | '2' | '3' | '4' | '5'

  const visibleReleases = tierFilter === 'all'
    ? releases
    : releases.filter(r => String(r.tier) === tierFilter);

  const loadReleases = useCallback(async () => {
    const res = await fetch('/api/releases');
    const data = await res.json();
    setReleases(data);
    if (!selectedId && data.length) setSelectedId(data[0].id);
  }, [selectedId]);

  const loadDetail = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    const res = await fetch(`/api/releases/${id}`);
    const data = await res.json();
    setDetail(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadReleases(); }, []);
  useEffect(() => { if (selectedId) loadDetail(selectedId); }, [selectedId, loadDetail]);

  async function createRelease(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    const res = await fetch('/api/releases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), tier: Number(newTier) })
    });
    const created = await res.json();
    setNewName('');
    await loadReleases();
    setSelectedId(created.id);
  }

  async function setItemStatus(itemKey, status) {
    const current = detail.itemStatus[itemKey] || null;
    const next = current === status ? null : status;
    // optimistic update
    setDetail(d => ({ ...d, itemStatus: { ...d.itemStatus, [itemKey]: next } }));
    await fetch(`/api/releases/${selectedId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_key: itemKey, item_status: next })
    });
  }

  async function addCustomTask(e) {
    e.preventDefault();
    if (!taskText.trim()) return;
    const res = await fetch(`/api/releases/${selectedId}/custom-tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: taskText.trim(), owner: taskOwner.trim() })
    });
    const created = await res.json();
    setDetail(d => ({ ...d, customTasks: [...d.customTasks, created] }));
    setTaskText('');
    setTaskOwner('');
  }

  async function setCustomStatus(taskId, status) {
    const task = detail.customTasks.find(t => t.id === taskId);
    const next = task.status === status ? null : status;
    setDetail(d => ({
      ...d,
      customTasks: d.customTasks.map(t => t.id === taskId ? { ...t, status: next } : t)
    }));
    await fetch(`/api/releases/${selectedId}/custom-tasks`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, status: next })
    });
  }

  async function removeCustomTask(taskId) {
    setDetail(d => ({ ...d, customTasks: d.customTasks.filter(t => t.id !== taskId) }));
    await fetch(`/api/releases/${selectedId}/custom-tasks?taskId=${taskId}`, { method: 'DELETE' });
  }

  async function changeTier(newTierValue) {
    setDetail(d => ({ ...d, release: { ...d.release, tier: newTierValue } }));
    await fetch(`/api/releases/${selectedId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: newTierValue })
    });
    loadReleases();
  }

  async function deleteRelease(id, name) {
    if (!confirm(`Delete "${name}"? This removes its checklist progress and custom tasks permanently.`)) return;
    await fetch(`/api/releases/${id}`, { method: 'DELETE' });
    if (selectedId === id) {
      setSelectedId(null);
      setDetail(null);
    }
    await loadReleases();
  }

  async function markShipped() {
    const nextStatus = detail.release.status === 'shipped' ? 'open' : 'shipped';
    setDetail(d => ({ ...d, release: { ...d.release, status: nextStatus } }));
    await fetch(`/api/releases/${selectedId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    });
    loadReleases();
  }

  const tierData = detail ? TIERS[detail.release.tier] : null;

  let total = 0, doneCount = 0, naCount = 0;
  if (detail && tierData) {
    tierData.sections.forEach(sec => sec.items.forEach(it => {
      total++;
      const s = detail.itemStatus[it.key];
      if (s === 'done') doneCount++;
      if (s === 'na') naCount++;
    }));
    detail.customTasks.forEach(t => {
      total++;
      if (t.status === 'done') doneCount++;
      if (t.status === 'na') naCount++;
    });
  }
  const resolved = doneCount + naCount;

  return (
    <div className="wrap">
      <aside className="sidebar">
        <h1>WebYes GTM Tracker</h1>
        <p className="subtitle">Shared release checklist &mdash; source: GTM Playbook v1.0</p>

        <form className="new-release-form" onSubmit={createRelease}>
          <input
            type="text" placeholder="New release name"
            value={newName} onChange={e => setNewName(e.target.value)}
          />
          <select value={newTier} onChange={e => setNewTier(e.target.value)}>
            <option value="1">Tier 1 &mdash; Major</option>
            <option value="2">Tier 2 &mdash; Minor</option>
            <option value="3">Tier 3 &mdash; Patch</option>
            <option value="4">New Product Launch</option>
            <option value="5">WordPress Plugin Launch</option>
          </select>
          <button type="submit">+ Add release</button>
        </form>

        <div className="release-list-heading">Releases</div>
        <div className="tier-filter">
          {['all', '1', '2', '3', '4', '5'].map(f => (
            <button
              key={f}
              className={'filter-pill' + (tierFilter === f ? ' active t' + f : '')}
              onClick={() => setTierFilter(f)}
            >
              {f === 'all' ? 'All' : TIER_LABELS[f]}
            </button>
          ))}
        </div>
        <div className="release-list">
          {visibleReleases.map(r => (
            <div
              key={r.id}
              className={'release-item' + (r.id === selectedId ? ' active' : '') + (r.status === 'shipped' ? ' shipped' : '')}
              onClick={() => setSelectedId(r.id)}
            >
              <span className={'tier-dot t' + r.tier}></span>
              <div className="release-item-body">
                <div className="release-name">{r.name}</div>
                <div className="release-sub">
                  <span className={'tier-badge t' + r.tier}>{TIER_LABELS[r.tier]}</span>
                  {r.status === 'shipped' ? ' · shipped' : ''}
                </div>
              </div>
              <button
                className="release-delete-btn"
                title="Delete release"
                onClick={(e) => { e.stopPropagation(); deleteRelease(r.id, r.name); }}
              >&times;</button>
            </div>
          ))}
          {visibleReleases.length === 0 && releases.length > 0 && (
            <div className="empty-note">No {tierFilter !== 'all' ? TIER_LABELS[tierFilter].toLowerCase() : ''} releases match this filter.</div>
          )}
          {releases.length === 0 && <div className="empty-note">No releases yet &mdash; add one above.</div>}
        </div>
      </aside>

      <main className="main">
        {!detail && <div className="empty-note">Select or create a release to see its checklist.</div>}

        {detail && tierData && (
          <>
            <div className="detail-head">
              <div>
                <h2>{detail.release.name}</h2>
                <div className={'tier-banner t' + detail.release.tier}>
                  <b>{tierData.label}</b>
                  {tierData.banner}
                </div>
              </div>
              <div className="detail-actions">
                <select value={detail.release.tier} onChange={e => changeTier(Number(e.target.value))}>
                  <option value={1}>Tier 1 — Major</option>
                  <option value={2}>Tier 2 — Minor</option>
                  <option value={3}>Tier 3 — Patch</option>
                  <option value={4}>New Product Launch</option>
                  <option value={5}>WordPress Plugin Launch</option>
                </select>
                <button className="ship-btn" onClick={markShipped}>
                  {detail.release.status === 'shipped' ? 'Reopen' : 'Mark shipped'}
                </button>
              </div>
            </div>

            <div className="progress-row">
              <div className="progress-bar"><div className="progress-fill" style={{ width: pct(resolved, total) + '%' }} /></div>
              <div className="progress-label">{resolved} / {total} resolved ({pct(resolved, total)}%) — {doneCount} done, {naCount} N/A</div>
            </div>

            {tierData.sections.map((section, sIdx) => (
              <div className="section" key={sIdx}>
                <div className="section-head">
                  <span>{section.title}</span>
                  <span className="count">
                    {section.items.filter(it => detail.itemStatus[it.key]).length} / {section.items.length}
                  </span>
                </div>
                {section.items.map(it => {
                  const status = detail.itemStatus[it.key] || null;
                  return (
                    <div className={'item t' + detail.release.tier + (status ? ' ' + status : '')} key={it.key}>
                      <div className="status-toggle">
                        <button
                          className={'status-btn done-btn' + (status === 'done' ? ' active' : '')}
                          onClick={() => setItemStatus(it.key, 'done')}
                        >Done</button>
                        <button
                          className={'status-btn na-btn' + (status === 'na' ? ' active' : '')}
                          onClick={() => setItemStatus(it.key, 'na')}
                        >N/A</button>
                      </div>
                      <div className="item-body">
                        <div className="item-text">{it.text}</div>
                        <div className="item-meta">
                          {it.when && <span className="when-tag">{it.when}</span>}
                          {it.owner && <span className="owner-tag">{it.owner}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            <div className="section">
              <div className="section-head">
                <span>Release-specific tasks</span>
                <span className="count">{detail.customTasks.filter(t => t.status).length} / {detail.customTasks.length}</span>
              </div>
              {detail.customTasks.map(t => (
                <div className={'item t' + detail.release.tier + (t.status ? ' ' + t.status : '')} key={t.id}>
                  <div className="status-toggle">
                    <button
                      className={'status-btn done-btn' + (t.status === 'done' ? ' active' : '')}
                      onClick={() => setCustomStatus(t.id, 'done')}
                    >Done</button>
                    <button
                      className={'status-btn na-btn' + (t.status === 'na' ? ' active' : '')}
                      onClick={() => setCustomStatus(t.id, 'na')}
                    >N/A</button>
                  </div>
                  <div className="item-body">
                    <div className="item-text">{t.text}</div>
                    <div className="item-meta">
                      <span className="custom-tag">Custom</span>
                      {t.owner && <span className="owner-tag">{t.owner}</span>}
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => removeCustomTask(t.id)} title="Remove task">&times;</button>
                </div>
              ))}
              <form className="add-task-row" onSubmit={addCustomTask}>
                <input
                  type="text" className="task-input" placeholder="Add a task specific to this release..."
                  value={taskText} onChange={e => setTaskText(e.target.value)}
                />
                <input
                  type="text" className="owner-input" placeholder="Owner (optional)"
                  value={taskOwner} onChange={e => setTaskOwner(e.target.value)}
                />
                <button type="submit">+ Add task</button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
