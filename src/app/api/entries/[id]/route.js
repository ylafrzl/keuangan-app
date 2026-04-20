import { getDb } from '@/lib/db'

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const db = getDb()
    const result = userId
      ? db.prepare('DELETE FROM entries WHERE id = ? AND user_id = ?').run(id, userId)
      : db.prepare('DELETE FROM entries WHERE id = ?').run(id)

    if (result.changes === 0) {
      return Response.json({ ok: false, error: 'Entry tidak ditemukan' }, { status: 404 })
    }
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}
