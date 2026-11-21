import { Link } from 'react-router-dom'
import type { Room } from '../../types'

type RoomCardProps = {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <article className="room-card">
      {/*
        LAB 1: Render the room name, capacity, and hourly price from the `room` prop.
        Done when each card shows those three facts (no TODO box left).
      */}
      <div className="todo">
        <span className="mono">{room.id}</span>
        <div>name: {room.name}</div>
        <div>capacity: {room.capacity}</div>
        <div>price: ${room.pricePerHour}/hr</div>
        <div>description: {room.description}</div>
      </div>
      <div className="room-meta">
        <Link to={`/rooms/${room.id}`}>View room</Link>
      </div>
    </article>
  )
}
