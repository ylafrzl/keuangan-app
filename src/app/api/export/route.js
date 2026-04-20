import { getDb } from '@/lib/db'
import { ALL_CATEGORIES } from '@/lib/constants'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period')
    const userId = searchParams.get('userId')
    const db = getDb()

    if (!userId) return Response.json({ ok: false, error: 'userId wajib' }, { status: 400 })

    const entries = period
      ? db.prepare('SELECT * FROM entries WHERE user_id = ? AND period = ? ORDER BY created_at ASC').all(userId, period)
      : db.prepare('SELECT * FROM entries WHERE user_id = ? ORDER BY period ASC, created_at ASC').all(userId)

    const remark = period
      ? db.prepare('SELECT content FROM remarks WHERE user_id = ? AND period = ?').get(userId, period)
      : null

    const rows = [['Periode', 'Kategori', 'Nama', 'Jumlah', 'Catatan', 'Waktu']]
    entries.forEach(e => {
      const cat = ALL_CATEGORIES.find(c => c.id === e.cat_id)
      rows.push([e.period, cat?.label || e.cat_id, e.name, e.amount, e.note, e.created_at])
    })

    if (remark?.content) {
      rows.push([''])
      rows.push(['--- Catatan Bulan ---', '', '', '', '', ''])
      rows.push([period, 'Remark', remark.content, '', '', ''])
    }

    const csv = rows.map(r =>
      r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')
    ).join('\n')

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="keuangan_${period || 'all'}.csv"`,
      }
    })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}
