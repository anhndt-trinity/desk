import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { login } from '../../lib/api'
import { useAuth } from './AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('guest@desk.dev')
  const [password, setPassword] = useState('guest123')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { setSession } = useAuth()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      // TAKE-HOME 1: call login(email, password), setSession(session), then navigate.
      const session = await login(email, password)
      setSession(session)

      const destination = params.get('from') || '/bookings'
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="panel" style={{ maxWidth: 420 }}>
      <h1>Sign in</h1>
      <p className="muted">
        Demo accounts: <span className="mono">guest@desk.dev</span> /{' '}
        <span className="mono">guest123</span> and{' '}
        <span className="mono">staff@desk.dev</span> /{' '}
        <span className="mono">staff123</span>
      </p>

      {error ? <div className="banner error">{error}</div> : null}

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="form-actions">
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
          <Link to="/">Cancel</Link>
        </div>
      </form>
    </section>
  )
}
