import { Link } from 'react-router-dom'
import type { Room } from '../../types'

type RoomCardProps = {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <article className="room-card">
      <div>
        <div>Name: {room.name}</div>
        <div>Capacity: {room.capacity}</div>
        <div>Hourly price: ${room.pricePerHour}/hr</div>
      </div>

      <div className="room-meta">
        <Link to={`/rooms/${room.id}`}>View room</Link>
      </div>
    </article>
  )
}
