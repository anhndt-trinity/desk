import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/EmptyState'
import { ErrorState } from '../../components/ErrorState'
import { LoadingState } from '../../components/LoadingState'
import { getBookings } from '../../lib/api'
import { getUser } from '../../lib/session'
import type { Booking } from '../../types'

type BookingsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; bookings: Booking[] }

export function BookingsPage() {
  const user = getUser()
  const [state, setState] = useState<BookingsState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      setState({ status: 'loading' })
      try {
        // TAKE-HOME 4: call getBookings() and set success. Guests see theirs; staff see all.
        const bookings = await getBookings()
        if (!cancelled) {
          void bookings
          throw new Error('Take-home: load bookings with getBookings().')
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to load bookings.',
          })
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>{user?.role === 'staff' ? 'All bookings' : 'My bookings'}</h1>
          <p className="muted">
            {user ? (
              <>
                Signed in as <span className="mono">{user.email}</span>
              </>
            ) : (
              'Sign in to see bookings.'
            )}
          </p>
        </div>
        <Link to="/">Browse rooms</Link>
      </div>

      {state.status === 'loading' ? <LoadingState label="Loading bookings…" /> : null}
      {state.status === 'error' ? <ErrorState message={state.message} /> : null}
      {state.status === 'success' && state.bookings.length === 0 ? (
        <EmptyState message="No bookings yet." />
      ) : null}
      {state.status === 'success' && state.bookings.length > 0 ? (
        <div className="booking-list">
          {state.bookings.map((booking) => (
            <article key={booking.id} className="booking-row">
              <div>
                <strong>{booking.roomName}</strong>
                <div className="muted mono">{booking.userEmail}</div>
              </div>
              <div>{booking.date}</div>
              <div>{booking.hours}h</div>
              <div>{booking.guests} guests</div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}
