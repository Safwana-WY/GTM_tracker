# WebYes GTM Tracker

A shared, database-backed version of the GTM Playbook checklist (`WebYes_GTM_Playbook_Feature_Releases.docx`). Anyone with the link can open it, create a release, pick its tier, and check off items — everyone sees the same live state instead of a doc that only one person edits.

## What's in the box

- **Next.js app** (`pages/index.js`) — the UI: a sidebar of releases, a main panel with the tier checklist, done/N/A toggles, and a "release-specific tasks" section for anything not in the template.
- **API routes** (`pages/api/releases/...`) — read/write the database.
- **Postgres schema** (`schema.sql`) — three tables: `releases`, `item_status`, `custom_tasks`.
- **Checklist template** (`lib/checklistTemplate.js`) — the Tier 1/2/3 content straight from the playbook, including the video walkthrough step for major releases. Edit this file if the playbook changes; you don't need to touch the database to update the checklist wording.

## Deploy (since you already have a Vercel account)

1. **Push this folder to a GitHub repo.**
   ```
   cd webyes-gtm-tracker
   git init && git add -A && git commit -m "GTM tracker v1"
   git remote add origin <your new repo URL>
   git push -u origin main
   ```
2. **Import the repo in Vercel** (vercel.com → Add New → Project → import the repo). Framework preset should auto-detect as Next.js.
3. **Add a Postgres database**: in the Vercel project → Storage tab → Create Database → Postgres. This automatically injects the `POSTGRES_URL*` environment variables into your project — you don't need to copy/paste them.
4. **Run the schema once** against that database: Storage tab → your database → Query, paste the contents of `schema.sql`, run it. (Or connect with `psql` using the connection string shown in the Storage tab.)
5. **Deploy.** Vercel will build and give you a live URL (e.g. `webyes-gtm-tracker.vercel.app`). Share that link with Melwyn, Sidharth, Anjaly, and Naseem.

No login system is built in yet — anyone with the link can edit anything. That's fine for a 5-person team on a private link; say the word if you want basic password protection added later (Vercel supports this natively via a project setting, no code change needed).

## Running it locally first (optional, to try before deploying)

```
npm install
npm run dev
```
You'll need a `.env.local` with the `POSTGRES_URL*` variables (copy from `.env.example` and fill in real values from Vercel's Storage tab, or point at any local Postgres instance and run `schema.sql` against it).

## Updating the checklist template later

Edit `lib/checklistTemplate.js`. Each item has a stable `key` (e.g. `"timeline-7"`) — don't change existing keys once releases have real data logged against them, since that's what ties a checkbox to its saved status. Add new items with new keys instead.
