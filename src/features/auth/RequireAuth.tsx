import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getSession } from '../../lib/session'

type RequireAuthProps = {
  children: ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation()
  const session = getSession()

  if (!session) {
    const from = location.pathname + location.search + location.hash
    return <Navigate to={`/login?from=${encodeURIComponent(from)}`} replace />
  }

  return children
}
