import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Session, User } from '../../types'
import { clearSession as clearStoredSession, getSession, setSession as setStoredSession } from '../../lib/session'

type AuthContextValue = {
  session: Session | null
  user: User | null
  setSession: (session: Session) => void
  clearSession: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(getSession)

  function setSession(session: Session) {
    setStoredSession(session)
    setSessionState(session)
  }

  function clearSession() {
    clearStoredSession()
    setSessionState(null)
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, setSession, clearSession }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}