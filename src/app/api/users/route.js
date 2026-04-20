import { getDb, hashPin } from '@/lib/db'

// GET /api/users — list all users (no pins)
export async function GET() {
  try {
    const db = getDb()
    const users = db.prepare(
      'SELECT id, name, avatar, color, created_at FROM users ORDER BY created_at ASC'
    ).all()
    return Response.json({ ok: true, data: users })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}

// POST /api/users — create user
export async function POST(request) {
  try {
    const { name, avatar, color, pin } = await request.json()
    if (!name?.trim()) return Response.json({ ok: false, error: 'Nama wajib diisi' }, { status: 400 })
    if (!pin || pin.length < 4) return Response.json({ ok: false, error: 'PIN minimal 4 digit' }, { status: 400 })

    const db = getDb()
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(name) = LOWER(?)').get(name.trim())
    if (existing) return Response.json({ ok: false, error: 'Nama sudah digunakan' }, { status: 409 })

    const id = 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
    const initials = name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

    db.prepare(`
      INSERT INTO users (id, name, avatar, color, pin_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name.trim(), avatar || initials, color || '#6366f1', hashPin(pin), new Date().toISOString())

    return Response.json({ ok: true, data: { id, name: name.trim(), avatar: avatar || initials, color: color || '#6366f1' } })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}
