import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

type RequireAuthProps = {
  children: ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  // TAKE-HOME 3: redirect to /login when there is no session.
  // Starter currently allows the page through so you can read the UI shell.
  const location = useLocation()
  const { session } = useAuth()

  if (!session) {
    const from = `${location.pathname}${location.search}`
    return <Navigate to={`/login?from=${encodeURIComponent(from)}`} replace />
  }

  return children
}
