import { getDb } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const period  = searchParams.get('period')
    const userId  = searchParams.get('userId')
    const db = getDb()

    if (!userId) return Response.json({ ok: false, error: 'userId wajib' }, { status: 400 })

    if (period) {
      const row = db.prepare('SELECT * FROM remarks WHERE user_id = ? AND period = ?').get(userId, period)
      return Response.json({ ok: true, data: row || null })
    }

    const rows = db.prepare('SELECT * FROM remarks WHERE user_id = ? ORDER BY period DESC').all(userId)
    return Response.json({ ok: true, data: rows })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { userId, period, content } = await request.json()
    if (!userId || !period) return Response.json({ ok: false, error: 'userId dan period wajib' }, { status: 400 })

    const db = getDb()
    db.prepare(`
      INSERT INTO remarks (user_id, period, content, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, period) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at
    `).run(userId, period, content || '', new Date().toISOString())

    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}
