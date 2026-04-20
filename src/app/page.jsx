'use client'
import { useState } from 'react'
import { MONTHS, CATEGORIES, getPeriod } from '@/lib/constants'
import { useFinance } from '@/lib/useFinance'
import { useUsers } from '@/lib/useUsers'
import SummaryCards from '@/components/SummaryCards'
import CategorySection from '@/components/CategorySection'
import SheetsSettings from '@/components/SheetsSettings'
import MonthlyRemark from '@/components/MonthlyRemark'
import {
  UserSwitcher,
  LoginModal,
  CreateUserModal,
  SelectUserPrompt,
} from '@/components/UserAuth'

const TABS = [
  { id: 'income',   label: 'Pemasukan',          icon: '↑' },
  { id: 'expense',  label: 'Pengeluaran',         icon: '↓' },
  { id: 'savings',  label: 'Tabungan & Pinjaman', icon: '⬡' },
]

export default function Home() {
  const now = new Date()
  const [year, setYear]           = useState(now.getFullYear())
  const [month, setMonth]         = useState(now.getMonth())
  const [activeTab, setActiveTab] = useState('income')
  const [syncState, setSyncState] = useState('idle')

  // Multi-user state
  const { users, activeUser, loadingUsers, login, logout, createUser } = useUsers()
  const [pendingLogin, setPendingLogin]   = useState(null) // user object awaiting PIN
  const [showCreate, setShowCreate]       = useState(false)
  const [sheetsId, setSheetsId]           = useState('')
  const [apiKey, setApiKey]               = useState('')

  // Finance data — scoped to activeUser
  const {
    remark, updateRemark,
    loading, addEntry, deleteEntry,
    getEntriesForCat, getSummary, exportCSV,
  } = useFinance(year, month, activeUser?.id)

  const summary = getSummary()
  const period  = getPeriod(year, month)

  const periodOptions = []
  for (let y = year - 1; y <= year + 1; y++) {
    MONTHS.forEach((m, i) => periodOptions.push({ label: `${m} ${y}`, y, m: i }))
  }

  const handleSync = () => {
    setSyncState('syncing')
    exportCSV()
    setTimeout(() => setSyncState('done'), 800)
    setTimeout(() => setSyncState('idle'), 3500)
  }

  // When a profile is clicked in switcher/prompt
  const handleSelectUser = (user) => {
    // Already logged in as this user → do nothing
    if (activeUser?.id === user.id) return
    // Otherwise ask for PIN
    setPendingLogin(user)
  }

  const handleLogin = async (userId, pin) => {
    const res = await login(userId, pin)
    if (res.ok) setPendingLogin(null)
    return res
  }

  const handleCreate = async (data) => {
    const res = await createUser(data)
    if (res.ok) {
      setShowCreate(false)
      // Auto-login after creation
      await login(res.data.id, data.pin)
    }
    return res
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Titlebar / drag region */}
      <div className="h-8 drag-region bg-slate-900/80 fixed top-0 left-0 right-0 z-40 border-b border-slate-800/60" />

      <div className="max-w-4xl mx-auto px-4 pt-12 pb-10">

        {/* Header */}
        <header className="flex items-center justify-between gap-4 mb-6 mt-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Peng
              <span className="ml-2 text-slate-500 font-light text-xl">pencatat keuangan</span>
            </h1>

          </div>

          {/* Right side: sync + user switcher */}
          <div className="flex items-center gap-2 no-drag">
            {activeUser && (
              <button
                onClick={handleSync}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                  ${syncState === 'done'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : syncState === 'syncing'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                <span>{syncState === 'syncing' ? '⟳' : syncState === 'done' ? '✓' : '⇲'}</span>
                {syncState === 'syncing' ? 'Exporting...' : syncState === 'done' ? 'Tersimpan' : 'Export CSV'}
              </button>
            )}

            <UserSwitcher
              users={users}
              activeUser={activeUser}
              onSelect={handleSelectUser}
              onCreate={() => setShowCreate(true)}
              onLogout={logout}
            />
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        {!activeUser ? (
          /* No user selected → prompt */
          loadingUsers ? (
            <div className="flex items-center justify-center h-64 text-slate-500 text-sm">Memuat profil...</div>
          ) : (
            <SelectUserPrompt
              users={users}
              onSelect={handleSelectUser}
              onCreate={() => setShowCreate(true)}
            />
          )
        ) : (
          /* User is logged in → show finance app */
          <>
            {/* Active user badge */}
            <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-slate-800/30 border border-slate-700/40 rounded-xl">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: activeUser.color + '22', color: activeUser.color }}
              >
                {activeUser.avatar}
              </div>
              <div>
                <span className="text-sm text-slate-200 font-medium">{activeUser.name}</span>
                <span className="text-xs text-slate-500 ml-2">data pribadi</span>
              </div>
              {loading && <span className="text-xs text-blue-400 animate-pulse ml-auto">memuat...</span>}
            </div>

            {/* Summary */}
            <SummaryCards summary={summary} />

            {/* Period selector */}
            <div className="flex items-center gap-3 mt-5 mb-3">
              <select
                className="no-drag bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-slate-500 cursor-pointer"
                value={`${year}-${month}`}
                onChange={e => {
                  const [y, m] = e.target.value.split('-')
                  setYear(+y); setMonth(+m)
                }}
              >
                {periodOptions.map(p => (
                  <option key={`${p.y}-${p.m}`} value={`${p.y}-${p.m}`}>{p.label}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">periode aktif</span>
            </div>

            <MonthlyRemark value={remark} onChange={updateRemark} period={period} />

            {/* Tabs */}
            <div className="flex gap-1 mt-5 mb-4 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`no-drag flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${activeTab === t.id
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }`}
                >
                  <span className="text-xs opacity-60">{t.icon}</span>
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <main>
              <div className="space-y-3">
                {CATEGORIES[activeTab]?.map(cat => (
                  <CategorySection
                    key={cat.id}
                    cat={cat}
                    entries={getEntriesForCat(cat.id)}
                    onAdd={data => addEntry({ ...data, catId: cat.id })}
                    onDelete={deleteEntry}
                  />
                ))}
              </div>
            </main>
          </>
        )}
      </div>

      {/* Modals */}
      {pendingLogin && (
        <LoginModal
          user={pendingLogin}
          onLogin={handleLogin}
          onCancel={() => setPendingLogin(null)}
        />
      )}
      {showCreate && (
        <CreateUserModal
          onCreate={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      )}
    </div>
  )
}
