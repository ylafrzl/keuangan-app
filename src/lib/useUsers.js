'use client'
import { useState, useEffect, useCallback } from 'react'

const SESSION_KEY = 'keuangan_active_user'

export function useUsers() {
  const [users, setUsers]               = useState([])
  const [activeUser, setActiveUser]     = useState(null) // { id, name, avatar, color }
  const [loadingUsers, setLoadingUsers] = useState(true)

  // Load user list
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users').then(r => r.json())
      if (res.ok) setUsers(res.data)
    } catch (_) {}
    finally { setLoadingUsers(false) }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  // Restore session from sessionStorage (tab-scoped, not persistent across app restart)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) setActiveUser(JSON.parse(saved))
    } catch (_) {}
  }, [])

  const login = useCallback(async (userId, pin) => {
    const res = await fetch('/api/users/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, pin }),
    }).then(r => r.json())

    if (res.ok) {
      setActiveUser(res.data)
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(res.data)) } catch (_) {}
    }
    return res
  }, [])

  const logout = useCallback(() => {
    setActiveUser(null)
    try { sessionStorage.removeItem(SESSION_KEY) } catch (_) {}
  }, [])

  const createUser = useCallback(async ({ name, color, pin }) => {
    const initials = name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, avatar: initials, color, pin }),
    }).then(r => r.json())

    if (res.ok) {
      await fetchUsers()
    }
    return res
  }, [fetchUsers])

  const deleteUser = useCallback(async (userId, pin) => {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    }).then(r => r.json())

    if (res.ok) {
      await fetchUsers()
      if (activeUser?.id === userId) logout()
    }
    return res
  }, [activeUser, fetchUsers, logout])

  return { users, activeUser, loadingUsers, login, logout, createUser, deleteUser, refetchUsers: fetchUsers }
}
