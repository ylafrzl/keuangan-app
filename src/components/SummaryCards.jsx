'use client'
import { formatRp } from '@/lib/constants'

function pct(part, total) {
  if (!total) return 0
  return Math.min(100, Math.round((part / total) * 100))
}

function HealthRemark({ income, expense, loan, savings }) {
  const loanPct = pct(loan, income)
  const expPct  = pct(expense, income)
  const savPct  = pct(savings, income)
  const total   = expPct + loanPct + savPct
  const remarks = []

  if (loan > 0 && loanPct > 30)
    remarks.push({ type: 'danger', icon: '⚠', text: `Cicilan ${loanPct}% dari pemasukan — cash flow tidak sehat. Idealnya di bawah 30%.` })
  else if (loan > 0 && loanPct > 20)
    remarks.push({ type: 'warn', icon: '↗', text: `Cicilan ${loanPct}% dari pemasukan — mendekati batas aman (30%).` })

  if (income > 0 && savPct === 0)
    remarks.push({ type: 'warn', icon: '○', text: 'Belum ada tabungan bulan ini. Target minimal 10–20% dari pemasukan.' })
  else if (savPct > 0 && savPct < 10)
    remarks.push({ type: 'warn', icon: '↗', text: `Tabungan ${savPct}% — coba tingkatkan ke minimal 10%.` })
  else if (savPct >= 20)
    remarks.push({ type: 'ok', icon: '✓', text: `Tabungan ${savPct}% — sangat baik!` })

  if (income > 0 && total > 100)
    remarks.push({ type: 'danger', icon: '⚠', text: 'Total pengeluaran + cicilan + tabungan melebihi pemasukan bulan ini.' })
  else if (income > 0 && total <= 100 && expense > 0 && remarks.length === 0)
    remarks.push({ type: 'ok', icon: '✓', text: 'Cash flow sehat. Pertahankan pola pengeluaran ini.' })

  if (!income || remarks.length === 0) return null

  return (
    <div className="mt-3 flex flex-col gap-1.5">
      {remarks.map((r, i) => (
        <div
          key={i}
          className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs
            ${r.type === 'ok'     ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
            ${r.type === 'warn'   ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
            ${r.type === 'danger' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
          `}
        >
          <span className="font-mono mt-0.5 shrink-0">{r.icon}</span>
          <span>{r.text}</span>
        </div>
      ))}
    </div>
  )
}

function Bar({ income, expense, loan, savings }) {
  if (!income) return null
  const expPct  = pct(expense, income)
  const loanPct = pct(loan, income)
  const savPct  = pct(savings, income)
  const usedPct = Math.min(100, expPct + loanPct + savPct)
  const restPct = Math.max(0, 100 - usedPct)

  const segments = [
    { label: 'Pengeluaran', pct: expPct,  color: 'bg-red-500' },
    { label: 'Cicilan',     pct: loanPct, color: 'bg-amber-500' },
    { label: 'Tabungan',    pct: savPct,  color: 'bg-emerald-500' },
    { label: 'Sisa',        pct: restPct, color: 'bg-slate-600' },
  ].filter(s => s.pct > 0)

  return (
    <div className="mt-4">
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
        {segments.map((s, i) => (
          <div
            key={i}
            className={`${s.color} transition-all`}
            style={{ width: s.pct + '%' }}
            title={`${s.label}: ${s.pct}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className={`w-2 h-2 rounded-full ${s.color}`} />
            <span>{s.label}</span>
            <span className="font-mono text-slate-300">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SummaryCards({ summary }) {
  const { income, expense, loan, savings, net } = summary

  const cards = [
    { label: 'Total Pemasukan',     value: income,           color: 'text-emerald-400', sub: null },
    { label: 'Pengeluaran + Cicilan', value: expense + loan, color: 'text-red-400',     sub: loan > 0 ? `Cicilan: ${formatRp(loan)}` : null },
    { label: 'Saldo Bersih',        value: net - savings,              color: net >= 0 ? 'text-emerald-400' : 'text-red-400', sub: savings > 0 ? `Tabungan: ${formatRp(savings)}` : null },
  ]

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
      <div className="grid grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="text-xs text-slate-400 font-medium">{c.label}</div>
            <div className={`text-lg font-semibold font-mono ${c.color}`}>{formatRp(c.value)}</div>
            {c.sub && <div className="text-xs text-slate-500 font-mono">{c.sub}</div>}
          </div>
        ))}
      </div>
      <Bar income={income} expense={expense} loan={loan} savings={savings} />
      <HealthRemark income={income} expense={expense} loan={loan} savings={savings} />
    </div>
  )
}
