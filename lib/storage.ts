'use client'

import type { StorageData, SessionResult, GradeLevel } from './types'

const STORAGE_KEY = 'ai-reading-trainer-v1'

function getStorage(): StorageData {
  if (typeof window === 'undefined') {
    return { sessions: {}, lastVisited: new Date().toISOString() }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { sessions: {}, lastVisited: new Date().toISOString() }
    return JSON.parse(raw) as StorageData
  } catch {
    return { sessions: {}, lastVisited: new Date().toISOString() }
  }
}

function saveStorage(data: StorageData): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage が利用不可の場合は無視
  }
}

export function getSession(date: string, grade: GradeLevel): SessionResult | null {
  const data = getStorage()
  return data.sessions[`${date}_${grade}`] ?? null
}

export function saveSession(session: SessionResult): void {
  const data = getStorage()
  data.sessions[`${session.date}_${session.grade}`] = session
  data.lastVisited = new Date().toISOString()
  saveStorage(data)
}

export function getAllSessions(): SessionResult[] {
  const data = getStorage()
  return Object.values(data.sessions).sort((a, b) =>
    b.date.localeCompare(a.date)
  )
}

export function hasCompletedToday(date: string, grade: GradeLevel): boolean {
  const session = getSession(date, grade)
  return session !== null && session.completedAt !== null
}

export function clearAllSessions(): void {
  saveStorage({ sessions: {}, lastVisited: new Date().toISOString() })
}
