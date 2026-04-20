import { getDb } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const period  = searchParams.get('period')
    const userId  = searchParams.get('userId')
    const db = getDb()

    if (!userId) return Response.json({ ok: false, error: 'userId wajib' }, { status: 400 })

    const entries = period
      ? db.prepare('SELECT * FROM entries WHERE user_id = ? AND period = ? ORDER BY created_at ASC').all(userId, period)
      : db.prepare('SELECT * FROM entries WHERE user_id = ? ORDER BY period DESC, created_at ASC').all(userId)

    return Response.json({ ok: true, data: entries })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { id, userId, catId, name, amount, note, period } = body

    if (!id || !userId || !catId || !name || !amount || !period) {
      return Response.json({ ok: false, error: 'Field tidak lengkap' }, { status: 400 })
    }

    // Validate user exists
    const db = getDb()
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId)
    if (!user) return Response.json({ ok: false, error: 'User tidak ditemukan' }, { status: 404 })

    db.prepare(`
      INSERT INTO entries (id, user_id, cat_id, name, amount, note, period, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, catId, name, amount, note || '', period, new Date().toISOString())

    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}
