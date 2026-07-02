-- WebYes GTM Tracker — Postgres schema
-- Run this once against your Vercel Postgres database (Storage tab -> Query, or psql).

CREATE TABLE IF NOT EXISTS releases (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  tier SMALLINT NOT NULL CHECK (tier IN (1,2,3,4,5)), -- 4 = New Product Launch, 5 = WordPress Plugin Launch
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','shipped','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per template checklist item per release.
-- item_key matches the template item id defined in lib/checklistTemplate.js (e.g. "timeline-0", "sweep-3").
CREATE TABLE IF NOT EXISTS item_status (
  id SERIAL PRIMARY KEY,
  release_id INTEGER NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL,
  status TEXT CHECK (status IN ('done','na')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (release_id, item_key)
);

-- Free-form tasks added per release, on top of the template checklist.
CREATE TABLE IF NOT EXISTS custom_tasks (
  id SERIAL PRIMARY KEY,
  release_id INTEGER NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  owner TEXT,
  status TEXT CHECK (status IN ('done','na')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_item_status_release ON item_status(release_id);
CREATE INDEX IF NOT EXISTS idx_custom_tasks_release ON custom_tasks(release_id);
