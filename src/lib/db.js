import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

function getDbPath() {
  const dataDir = process.env.DB_PATH
    ? process.env.DB_PATH
    : path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  return path.join(dataDir, 'keuangan.db')
}

let _db = null

export function getDb() {
  if (_db) return _db
  _db = new Database(getDbPath())
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  initSchema(_db)
  return _db
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      avatar     TEXT NOT NULL DEFAULT 'A',
      color      TEXT NOT NULL DEFAULT '#6366f1',
      pin_hash   TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS entries (
      id         TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      cat_id     TEXT NOT NULL,
      name       TEXT NOT NULL,
      amount     INTEGER NOT NULL DEFAULT 0,
      note       TEXT DEFAULT '',
      period     TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_entries_period  ON entries(period);
    CREATE INDEX IF NOT EXISTS idx_entries_cat     ON entries(cat_id);
    CREATE INDEX IF NOT EXISTS idx_entries_user    ON entries(user_id);

    CREATE TABLE IF NOT EXISTS remarks (
      user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      period     TEXT NOT NULL,
      content    TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL,
      PRIMARY KEY (user_id, period)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );
  `)

  // Migrate old entries/remarks that have no user_id to guest
  // (only if legacy schema detected)
  try {
    const cols = db.prepare("PRAGMA table_info(entries)").all().map(c => c.name)
    if (!cols.includes('user_id')) {
      // This shouldn't happen since we create fresh, but safety net
    }
  } catch (_) {}
}

// ── PIN helpers ──────────────────────────────────────────────────────────────
export function hashPin(pin) {
  return crypto.createHash('sha256').update('keuangan:' + pin).digest('hex')
}

export function verifyPin(pin, hash) {
  return hashPin(pin) === hash
}
