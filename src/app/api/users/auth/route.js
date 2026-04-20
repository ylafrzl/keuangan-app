import { getDb, verifyPin } from '@/lib/db'

// POST /api/users/auth — verify pin, return user (no token needed for local app)
export async function POST(request) {
  try {
    const { userId, pin } = await request.json()
    if (!userId || !pin) return Response.json({ ok: false, error: 'userId dan pin wajib diisi' }, { status: 400 })

    const db = getDb()
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId)
    if (!user) return Response.json({ ok: false, error: 'User tidak ditemukan' }, { status: 404 })

    if (!verifyPin(pin, user.pin_hash)) {
      return Response.json({ ok: false, error: 'PIN salah' }, { status: 401 })
    }

    return Response.json({ ok: true, data: { id: user.id, name: user.name, avatar: user.avatar, color: user.color } })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}
