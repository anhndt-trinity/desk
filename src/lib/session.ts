import type { Session, User } from '../types'

const STORAGE_KEY = 'desk.session'

let memorySession: Session | null = null

function readStored(): Session | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export function getSession(): Session | null {
  if (memorySession) return memorySession
  memorySession = readStored()
  return memorySession
}

export function getToken(): string | null {
  return getSession()?.token ?? null
}

export function getUser(): User | null {
  return getSession()?.user ?? null
}

export function setSession(session: Session): void {
  memorySession = session
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  memorySession = null
  sessionStorage.removeItem(STORAGE_KEY)
}
