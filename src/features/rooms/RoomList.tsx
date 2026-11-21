import { useMemo, useState } from 'react'
import { ROOMS } from '../../data/rooms'
import { EmptyState } from '../../components/EmptyState'
import { ErrorState } from '../../components/ErrorState'
import { LoadingState } from '../../components/LoadingState'
import { RoomCard } from './RoomCard'
import { filterRooms } from './filterRooms'
import { useRooms } from './useRooms'

const USE_API = true

export function RoomList() {
  // LAB 2: wire this search box with useState and pass the value into filterRooms.
  const [query, setQuery] = useState('')
  const { state, reload } = useRooms()

  const sourceRooms = USE_API
    ? state.status === 'success'
      ? state.rooms
      : []
    : ROOMS

  const rooms = useMemo(() => filterRooms(sourceRooms, query), [sourceRooms, query])

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Rooms</h1>
          <p>Find a space, open a room, then book it.</p>
        </div>
      </div>

      <div className="toolbar">
        <div className="field">
          <label htmlFor="room-search">Search</label>
          <input
            id="room-search"
            type="search"
            placeholder="Try harbor or quiet"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      {!USE_API ? (
        <div className="banner info">
          Lab 3: set <span className="mono">USE_API</span> to{' '}
          <span className="mono">true</span> in <span className="mono">RoomList.tsx</span>{' '}
          after you finish <span className="mono">useRooms</span>.
        </div>
      ) : null}

      {USE_API && state.status === 'loading' ? (
        <LoadingState label="Loading rooms…" />
      ) : null}

      {USE_API && state.status === 'error' ? (
        <ErrorState message={state.message} onRetry={reload} />
      ) : null}

      {(!USE_API || state.status === 'success') && rooms.length === 0 ? (
        <EmptyState message="No rooms match that search." />
      ) : null}

      {(!USE_API || state.status === 'success') && rooms.length > 0 ? (
        <div className="room-grid">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
