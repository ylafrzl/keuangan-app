'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { ALL_CATEGORIES, getPeriod } from './constants'

export function useFinance(year, month, userId) {
  const [entries, setEntries]   = useState([])
  const [remark, setRemark]     = useState('')
  const [loading, setLoading]   = useState(false)
  const remarkTimer = useRef(null)

  const period = getPeriod(year, month)

  useEffect(() => {
    if (!userId) { setEntries([]); setRemark(''); return }

    setLoading(true)
    Promise.all([
      fetch(`/api/entries?period=${period}&userId=${userId}`).then(r => r.json()),
      fetch(`/api/remarks?period=${period}&userId=${userId}`).then(r => r.json()),
    ]).then(([entRes, rmRes]) => {
      if (entRes.ok) setEntries(entRes.data.map(row => ({
        id: row.id, catId: row.cat_id, name: row.name,
        amount: row.amount, note: row.note,
        period: row.period, ts: row.created_at,
      })))
      if (rmRes.ok && rmRes.data) setRemark(rmRes.data.content || '')
      else setRemark('')
    }).finally(() => setLoading(false))
  }, [period, userId])

  const addEntry = useCallback(async ({ catId, name, amount, note }) => {
    if (!userId) return
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
    const entry = { id, catId, name, amount, note: note || '', period, ts: new Date().toISOString() }
    setEntries(prev => [...prev, entry])
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, userId, catId, name, amount, note, period }),
    }).then(r => r.json())
    if (!res.ok) setEntries(prev => prev.filter(e => e.id !== id))
  }, [period, userId])

  const deleteEntry = useCallback(async (id) => {
    if (!userId) return
    setEntries(prev => prev.filter(e => e.id !== id))
    const res = await fetch(`/api/entries/${id}?userId=${userId}`, { method: 'DELETE' }).then(r => r.json())
    if (!res.ok) {
      fetch(`/api/entries?period=${period}&userId=${userId}`).then(r => r.json()).then(d => {
        if (d.ok) setEntries(d.data.map(row => ({
          id: row.id, catId: row.cat_id, name: row.name,
          amount: row.amount, note: row.note, period: row.period, ts: row.created_at,
        })))
      })
    }
  }, [period, userId])

  const updateRemark = useCallback((content) => {
    setRemark(content)
    clearTimeout(remarkTimer.current)
    remarkTimer.current = setTimeout(() => {
      if (!userId) return
      fetch('/api/remarks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, period, content }),
      })
    }, 800)
  }, [period, userId])

  const getEntriesForCat = useCallback((catId) => {
    return entries.filter(e => e.catId === catId)
  }, [entries])

  const getSummary = useCallback(() => {
    const income  = entries.filter(e => ['main-income','side-income'].includes(e.catId)).reduce((s,e)=>s+e.amount,0)
    const expense = entries.filter(e => ['primary','secondary','tertiary'].includes(e.catId)).reduce((s,e)=>s+e.amount,0)
    const savings = entries.filter(e => e.catId==='savings').reduce((s,e)=>s+e.amount,0)
    const loan    = entries.filter(e => e.catId==='loan').reduce((s,e)=>s+e.amount,0)
    return { income, expense, savings, loan, net: income - expense - loan }
  }, [entries])

  const exportCSV = useCallback(() => {
    if (!userId) return
    const url = `/api/export?period=${period}&userId=${userId}`
    const a = document.createElement('a')
    a.href = url
    a.download = `keuangan_${period}.csv`
    a.click()
  }, [period, userId])

  return {
    entries, remark, updateRemark,
    loading, addEntry, deleteEntry,
    getEntriesForCat, getSummary, exportCSV,
  }
}
