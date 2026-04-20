import { getDb, hashPin, verifyPin } from '@/lib/db'

// DELETE /api/users/:id — delete user + all their data (requires pin confirmation)
export async function DELETE(request, { params }) {
  try {
    const { pin } = await request.json()
    const { id } = params

    const db = getDb()
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
    if (!user) return Response.json({ ok: false, error: 'User tidak ditemukan' }, { status: 404 })
    if (!verifyPin(pin, user.pin_hash)) return Response.json({ ok: false, error: 'PIN salah' }, { status: 401 })

    db.prepare('DELETE FROM users WHERE id = ?').run(id)
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}

// PATCH /api/users/:id — update name/avatar/color (requires pin)
export async function PATCH(request, { params }) {
  try {
    const { pin, name, avatar, color, newPin } = await request.json()
    const { id } = params

    const db = getDb()
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
    if (!user) return Response.json({ ok: false, error: 'User tidak ditemukan' }, { status: 404 })
    if (!verifyPin(pin, user.pin_hash)) return Response.json({ ok: false, error: 'PIN salah' }, { status: 401 })

    const updates = []
    const vals = []
    if (name)   { updates.push('name = ?');     vals.push(name.trim()) }
    if (avatar) { updates.push('avatar = ?');   vals.push(avatar) }
    if (color)  { updates.push('color = ?');    vals.push(color) }
    if (newPin && newPin.length >= 4) { updates.push('pin_hash = ?'); vals.push(hashPin(newPin)) }

    if (updates.length) {
      vals.push(id)
      db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...vals)
    }

    const updated = db.prepare('SELECT id, name, avatar, color FROM users WHERE id = ?').get(id)
    return Response.json({ ok: true, data: updated })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}
