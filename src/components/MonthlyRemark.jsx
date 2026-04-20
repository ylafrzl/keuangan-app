'use client'

export default function MonthlyRemark({ value, onChange, period }) {
  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 mt-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-slate-300">📝 Catatan Bulan</span>
        <span className="text-xs font-mono text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-md">{period}</span>
        <span className="text-xs text-slate-600 ml-auto">tersimpan otomatis</span>
      </div>
      <textarea
        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-500 transition-colors resize-none leading-relaxed"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Tulis catatan, evaluasi, atau target bulan ini... Contoh: Bulan ini pengeluaran membengkak karena servis motor. Target bulan depan kurangi makan di luar."
        rows={3}
      />
    </div>
  )
}
