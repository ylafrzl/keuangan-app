export const MONTHS = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
]

export const CATEGORIES = {
  income: [
    { id: 'main-income', label: 'Main Income',  type: 'income',  color: 'main-income' },
    { id: 'side-income', label: 'Side Income',  type: 'income',  color: 'side-income' },
  ],
  expense: [
    { id: 'primary',    label: 'Primary',    type: 'expense', color: 'primary' },
    { id: 'secondary',  label: 'Secondary',  type: 'expense', color: 'secondary' },
    { id: 'tertiary',   label: 'Tertiary',   type: 'expense', color: 'tertiary' },
  ],
  savings: [
    { id: 'loan',    label: 'Loan',    type: 'loan',    color: 'loan' },
    { id: 'savings', label: 'Savings', type: 'savings', color: 'savings' },
  ],
}

export const ALL_CATEGORIES = [
  ...CATEGORIES.income,
  ...CATEGORIES.expense,
  ...CATEGORIES.savings,
]

export function formatRp(n) {
  const num = parseInt(String(n).replace(/\D/g, '')) || 0
  return 'Rp ' + num.toLocaleString('id-ID')
}

export function parseRp(str) {
  return parseInt(String(str).replace(/\D/g, '')) || 0
}

export function getPeriod(year, month) {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}
