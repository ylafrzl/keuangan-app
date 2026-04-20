'use client'
import { useState } from 'react'

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#06b6d4',
]

// ── Avatar bubble ─────────────────────────────────────────────────────────────
export function Avatar({ user, size = 'md', onClick, active = false }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' }
  return (
    <button
      onClick={onClick}
      title={user.name}
      style={{ background: user.color + '33', borderColor: active ? user.color : 'transparent' }}
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold border-2 transition-all hover:scale-105 active:scale-95 select-none`}
    >
      <span style={{ color: user.color }}>{user.avatar}</span>
    </button>
  )
}

// ── PIN dots input ────────────────────────────────────────────────────────────
function PinInput({ value, onChange, onSubmit, error }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Dots */}
      <div className="flex gap-2.5">
        {[0,1,2,3].map(i => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              value.length > i ? 'bg-indigo-400 scale-110' : 'bg-slate-600'
            }`}
          />
        ))}
      </div>
      {/* Hidden real input for mobile keyboard */}
      <input
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={6}
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        onKeyDown={e => e.key === 'Enter' && value.length >= 4 && onSubmit()}
        className="opacity-0 absolute w-0 h-0"
        autoFocus
      />
      {/* Numpad */}
      <div className="grid grid-cols-3 gap-2 mt-1">
        {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
          <button
            key={i}
            onClick={() => {
              if (k === '⌫') onChange(value.slice(0, -1))
              else if (k !== '') onChange((value + k).slice(0, 6))
            }}
            className={`w-14 h-14 rounded-xl text-lg font-medium transition-all
              ${k === ''
                ? 'invisible'
                : k === '⌫'
                ? 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 active:scale-95'
                : 'bg-slate-700/60 text-slate-100 hover:bg-slate-600 active:scale-95'
              }`}
          >
            {k}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-400 text-center">{error}</p>}
    </div>
  )
}

// ── Login modal for a specific user ──────────────────────────────────────────
export function LoginModal({ user, onLogin, onCancel }) {
  const [pin, setPin]     = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy]   = useState(false)

  const handleSubmit = async () => {
    if (pin.length < 4) return
    setBusy(true); setError('')
    const res = await onLogin(user.id, pin)
    if (!res.ok) { setError(res.error || 'PIN salah'); setPin('') }
    setBusy(false)
  }

  // Auto-submit at 4 or 6 digits
  const handlePin = (val) => {
    setPin(val); setError('')
    if (val.length >= 4) setTimeout(() => handleSubmitRef.current?.(), 300)
  }
  // Use ref to avoid stale closure on auto-submit
  const handleSubmitRef = { current: handleSubmit }
  handleSubmitRef.current = handleSubmit

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-80 flex flex-col items-center gap-5 shadow-2xl">
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ background: user.color + '22', border: `2px solid ${user.color}55` }}
        >
          <span style={{ color: user.color }}>{user.avatar}</span>
        </div>
        <div className="text-center">
          <div className="text-white font-semibold">{user.name}</div>
          <div className="text-xs text-slate-400 mt-0.5">Masukkan PIN</div>
        </div>

        <PinInput value={pin} onChange={handlePin} onSubmit={handleSubmit} error={error} />

        <button
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  )
}

// ── Create user modal ─────────────────────────────────────────────────────────
export function CreateUserModal({ onCreate, onCancel }) {
  const [step, setStep]   = useState(1) // 1=name+color, 2=pin
  const [name, setName]   = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [pin, setPin]     = useState('')
  const [pin2, setPin2]   = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy]   = useState(false)

  const initials = name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'

  const handleCreate = async () => {
    if (pin !== pin2) { setError('PIN tidak cocok'); return }
    if (pin.length < 4) { setError('PIN minimal 4 digit'); return }
    setBusy(true); setError('')
    const res = await onCreate({ name, color, pin })
    if (!res.ok) { setError(res.error || 'Gagal membuat profil'); setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-80 flex flex-col gap-5 shadow-2xl">
        <div>
          <div className="text-white font-semibold text-lg">Profil Baru</div>
          <div className="text-xs text-slate-400 mt-0.5">
            {step === 1 ? 'Atur nama dan warna profil' : 'Buat PIN 4–6 digit'}
          </div>
        </div>

        {step === 1 ? (
          <>
            {/* Preview */}
            <div className="flex justify-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{ background: color + '22', border: `2px solid ${color}55` }}
              >
                <span style={{ color }}>{initials}</span>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nama</label>
              <input
                className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-slate-400 transition-colors"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
                placeholder="mis. Budi Santoso"
                autoFocus
                maxLength={30}
              />
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-xs text-slate-400 mb-2 font-medium">Warna</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800' : ''}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <div className="flex gap-2">
              <button onClick={onCancel} className="flex-1 py-2.5 text-sm text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-700/50 transition-all">
                Batal
              </button>
              <button
                onClick={() => { if (!name.trim()) return; setError(''); setStep(2) }}
                className="flex-1 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all disabled:opacity-40"
                disabled={!name.trim()}
              >
                Lanjut →
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center text-sm text-slate-400">PIN untuk <span className="text-white font-medium">{name}</span></div>

            <div>
              <div className="text-xs text-slate-400 mb-2 text-center">Masukkan PIN</div>
              <PinInput value={pin} onChange={setPin} onSubmit={() => pin2 ? handleCreate() : null} error={null} />
            </div>

            {pin.length >= 4 && (
              <div>
                <div className="text-xs text-slate-400 mb-2 text-center">Konfirmasi PIN</div>
                <PinInput value={pin2} onChange={setPin2} onSubmit={handleCreate} error={null} />
              </div>
            )}

            {error && <p className="text-xs text-red-400 text-center">{error}</p>}

            <div className="flex gap-2">
              <button onClick={() => { setStep(1); setPin(''); setPin2('') }} className="flex-1 py-2.5 text-sm text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-700/50 transition-all">
                ← Kembali
              </button>
              <button
                onClick={handleCreate}
                disabled={pin.length < 4 || pin2.length < 4 || busy}
                className="flex-1 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all disabled:opacity-40"
              >
                {busy ? 'Menyimpan...' : 'Buat Profil'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── User Switcher panel (dropdown from header) ────────────────────────────────
export function UserSwitcher({ users, activeUser, onSelect, onCreate, onLogout }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative no-drag">
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all"
      >
        {activeUser ? (
          <>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{ background: activeUser.color + '33', color: activeUser.color }}
            >
              {activeUser.avatar}
            </div>
            <span className="text-sm text-slate-200 font-medium max-w-[80px] truncate">{activeUser.name}</span>
          </>
        ) : (
          <>
            <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs text-slate-400">?</div>
            <span className="text-sm text-slate-400">Pilih Profil</span>
          </>
        )}
        <span className="text-slate-500 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-2 max-h-64 overflow-y-auto">
              {users.length === 0 && (
                <div className="px-3 py-2 text-xs text-slate-500 text-center">Belum ada profil</div>
              )}
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => { setOpen(false); onSelect(u) }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left
                    ${activeUser?.id === u.id ? 'bg-slate-700' : 'hover:bg-slate-700/50'}`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                    style={{ background: u.color + '33', color: u.color }}
                  >
                    {u.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-200 font-medium truncate">{u.name}</div>
                    {activeUser?.id === u.id && (
                      <div className="text-xs text-slate-400">Aktif</div>
                    )}
                  </div>
                  {activeUser?.id === u.id && (
                    <span className="text-xs text-indigo-400">●</span>
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-700 p-2 flex flex-col gap-1">
              <button
                onClick={() => { setOpen(false); onCreate() }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700/50 transition-all"
              >
                <span className="text-slate-500">＋</span>
                Profil Baru
              </button>
              {activeUser && (
                <button
                  onClick={() => { setOpen(false); onLogout() }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <span>↩</span>
                  Keluar dari {activeUser.name}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── Empty state when no user selected ────────────────────────────────────────
export function SelectUserPrompt({ users, onSelect, onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="text-center">
        <div className="text-4xl mb-3">👤</div>
        <h2 className="text-xl font-semibold text-white mb-1">Pilih Profil</h2>
        <p className="text-sm text-slate-400">Setiap profil memiliki data keuangan tersendiri</p>
      </div>

      {users.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4">
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => onSelect(u)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 hover:border-slate-600 transition-all w-28"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ background: u.color + '22', border: `2px solid ${u.color}44` }}
              >
                <span style={{ color: u.color }}>{u.avatar}</span>
              </div>
              <span className="text-sm text-slate-200 font-medium text-center truncate w-full">{u.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">Buat profil pertama Anda</p>
      )}

      <button
        onClick={onCreate}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all"
      >
        ＋ Buat Profil Baru
      </button>
    </div>
  )
}
