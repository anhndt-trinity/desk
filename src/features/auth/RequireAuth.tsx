import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getSession } from '../../lib/session'

type RequireAuthProps = {
  children: ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  // TAKE-HOME 3: redirect to /login when there is no session.
  // Starter currently allows the page through so you can read the UI shell.
  const enforce = false
  const location = useLocation()
  const session = getSession()

  if (enforce && !session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
