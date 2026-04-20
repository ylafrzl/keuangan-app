'use client'
import { useState } from 'react'

const CODE_APPS_SCRIPT = `function importCSV() {
  const csvUrl = 'URL_FILE_CSV_ANDA';
  const ss = SpreadsheetApp.openById('SPREADSHEET_ID');
  const sheet = ss.getSheetByName('Data') || ss.insertSheet('Data');
  const csv = UrlFetchApp.fetch(csvUrl).getContentText();
  const data = Utilities.parseCsv(csv);
  sheet.clearContents();
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}`

const CODE_BUILD = `# Install dependencies
npm install

# Run sebagai web app (Next.js dev)
npm run dev

# Run sebagai desktop app (Electron dev)
npm run electron:dev

# Build desktop installer
npm run electron:dist`

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative group mt-3">
      <pre className="bg-slate-900/70 border border-slate-700/50 rounded-lg px-4 py-3 text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed whitespace-pre">
        {code}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-600 transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">{title}</h3>
      {children}
    </div>
  )
}

const STEPS = [
  'Buat Google Sheet baru → Bagikan → Siapa saja dengan tautan (Editor)',
  'Salin Spreadsheet ID dari URL browser',
  'Klik Export CSV untuk mengunduh data periode aktif',
  'Impor CSV ke Sheet, atau gunakan Google Apps Script untuk otomasi',
]

export default function SheetsSettings({ sheetsId, setSheetsId, apiKey, setApiKey, onExport }) {
  const [status, setStatus] = useState(null)

  const handleExport = () => {
    onExport()
    setStatus({ ok: true, msg: 'CSV diunduh — impor ke Google Sheets atau gunakan Apps Script untuk otomasi.' })
    setTimeout(() => setStatus(null), 5000)
  }

  return (
    <div className="space-y-4">
      {/* Google Sheets config */}
      <Panel title="Google Sheets Configuration">
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Spreadsheet ID</label>
            <input
              className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-slate-400 transition-colors font-mono"
              value={sheetsId}
              onChange={e => setSheetsId(e.target.value)}
              placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">API Key</label>
            <input
              className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-slate-400 transition-colors font-mono"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              type="password"
              placeholder="AIza..."
            />
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-2 mb-4">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-3 text-xs text-slate-400">
              <span className="w-5 h-5 flex items-center justify-center bg-slate-700 text-slate-300 rounded-full shrink-0 font-mono font-medium text-[10px]">
                {i + 1}
              </span>
              <span className="leading-relaxed pt-0.5">{step}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium rounded-lg transition-all"
        >
          <span>⇲</span>
          Export CSV Periode Ini
        </button>

        {status && (
          <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs
            ${status.ok
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            <span>{status.ok ? '✓' : '✗'}</span>
            <span>{status.msg}</span>
          </div>
        )}
      </Panel>

      {/* Apps Script */}
      <Panel title="Apps Script — Otomasi Import">
        <p className="text-xs text-slate-400 mb-1">
          Paste script ini di Google Apps Script editor (Extensions → Apps Script) untuk otomasi import CSV.
        </p>
        <CodeBlock code={CODE_APPS_SCRIPT} />
      </Panel>

      {/* Build guide */}
      <Panel title="Electron / Desktop Build">
        <p className="text-xs text-slate-400 mb-1">
          Perintah untuk menjalankan dan mem-build aplikasi sebagai desktop app.
        </p>
        <CodeBlock code={CODE_BUILD} />
      </Panel>
    </div>
  )
}
