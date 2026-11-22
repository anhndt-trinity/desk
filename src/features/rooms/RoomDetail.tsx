import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState } from '../../components/ErrorState'
import { LoadingState } from '../../components/LoadingState'
import { getRoom } from '../../lib/api'
import type { Room } from '../../types'
import { BookingForm } from '../bookings/BookingForm'

type DetailState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; room: Room }

export function RoomDetail() {
  const params = useParams()
  const roomId = params.roomId
  const [state, setState] = useState<DetailState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!roomId) {
        setState({ status: 'error', message: 'Missing room id in the URL.' })
        return
      }

      setState({ status: 'loading' })
      try {
        const room = await getRoom(roomId)
        if (!cancelled) {
          setState({ status: 'success', room })
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to load room.',
          })
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [roomId])

  if (state.status === 'loading') {
    return <LoadingState label="Loading room…" />
  }

  if (state.status === 'error') {
    return (
      <section>
        <ErrorState message={state.message} />
        <p>
          <Link to="/">Back to rooms</Link>
        </p>
      </section>
    )
  }

  const { room } = state

  return (
    <section>
      <p>
        <Link to="/">← Rooms</Link>
      </p>
      <div className="detail-layout">
        <article className="panel">
          <h1>{room.name}</h1>
          <p className="muted">{room.description}</p>
          <p>
            Holds <strong>{room.capacity}</strong> ·{' '}
            <span className="price">${room.pricePerHour}/hr</span>
          </p>
          <ul className="amenity-list">
            {room.amenities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <BookingForm room={room} />
      </div>
    </section>
  )
}
