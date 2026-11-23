import { Link, Outlet } from 'react-router-dom'
// import { getUser } from '../lib/session'
import { useAuth } from '../features/auth/AuthContext'
export function AppShell() {
  // const user = getUser()
  const {user} = useAuth()

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <strong>Desk</strong>
          <span>Room booking · React fundamentals</span>
        </div>
        <nav className="nav">
          <Link to="/">Rooms</Link>
          <Link to="/bookings">My bookings</Link>
          {user ? (
            <span className="muted mono">{user.email}</span>
          ) : (
            <Link to="/login">Sign in</Link>
          )}
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
