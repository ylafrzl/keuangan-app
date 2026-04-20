'use client'
import { useState } from 'react'
import { formatRp, parseRp } from '@/lib/constants'

const COLOR_MAP = {
  'main-income': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'side-income': 'text-teal-400 bg-teal-500/10 border-teal-500/30',
  'primary':     'text-red-400 bg-red-500/10 border-red-500/30',
  'secondary':   'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'tertiary':    'text-amber-400 bg-amber-500/10 border-amber-500/30',
  'loan':        'text-rose-400 bg-rose-500/10 border-rose-500/30',
  'savings':     'text-blue-400 bg-blue-500/10 border-blue-500/30',
}

const AMT_COLOR = {
  income:  'text-emerald-400',
  savings: 'text-blue-400',
  loan:    'text-rose-400',
  expense: 'text-red-400',
}

export default function CategorySection({ cat, entries, onAdd, onDelete }) {
  const [open, setOpen]           = useState(false)
  const [name, setName]           = useState('')
  const [amtDisplay, setAmtDisplay] = useState('')
  const [note, setNote]           = useState('')

  const total    = entries.reduce((s, e) => s + e.amount, 0)
  const tagClass = COLOR_MAP[cat.color] || 'text-slate-400 bg-slate-500/10 border-slate-500/30'
  const amtColor = AMT_COLOR[cat.type] || 'text-slate-300'

  const handleAmtInput = (e) => {
    const raw = e.target.value.replace(/\D/g, '')
    const num = parseInt(raw) || 0
    setAmtDisplay(num ? 'Rp ' + num.toLocaleString('id-ID') : '')
  }

  const handleSave = () => {
    const amount = parseRp(amtDisplay)
    if (!name.trim() || !amount) return
    onAdd({ name: name.trim(), amount, note: note.trim() })
    setName(''); setAmtDisplay(''); setNote(''); setOpen(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-200">{cat.label}</span>
          {total > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${tagClass}`}>
              {formatRp(total)}
            </span>
          )}
        </div>
        <button
          onClick={() => setOpen(v => !v)}
          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all
            ${open
              ? 'bg-slate-700 text-slate-300 border-slate-600'
              : 'bg-slate-700/50 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
            }`}
        >
          {open ? '✕ Tutup' : '+ Tambah'}
        </button>
      </div>

      {/* Entries */}
      {entries.length > 0 && (
        <div className="border-t border-slate-700/50 divide-y divide-slate-700/30">
          {entries.map(entry => (
            <div key={entry.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700/20 group">
              <div className="flex-1 min-w-0">
                <div className="text-sm text-slate-200 truncate">{entry.name}</div>
                {entry.note && <div className="text-xs text-slate-500 truncate">{entry.note}</div>}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${tagClass}`}>
                {cat.label}
              </span>
              <span className={`text-sm font-mono font-medium shrink-0 ${amtColor}`}>
                {formatRp(entry.amount)}
              </span>
              <button
                onClick={() => onDelete(entry.id)}
                className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded transition-all opacity-0 group-hover:opacity-100 shrink-0"
                title="Hapus"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {entries.length === 0 && !open && (
        <div className="border-t border-slate-700/50 px-4 py-3 text-xs text-slate-500 italic">
          Belum ada entri — klik Tambah untuk mulai
        </div>
      )}

      {/* Add Form */}
      {open && (
        <div className="border-t border-slate-700/50 p-4 bg-slate-800/50">
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nama / Keterangan</label>
              <input
                className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-slate-400 transition-colors"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={handleKey}
                placeholder="mis. Gaji pokok"
                autoFocus
              />
            </div>
            <div className="w-44">
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Jumlah</label>
              <input
                className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-slate-400 transition-colors font-mono"
                value={amtDisplay}
                onChange={handleAmtInput}
                onKeyDown={handleKey}
                placeholder="Rp 0"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Catatan (opsional)</label>
            <input
              className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-slate-400 transition-colors"
              value={note}
              onChange={e => setNote(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Deskripsi tambahan..."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-700/50 transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-all"
            >
              Simpan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
