import { Link } from 'react-router-dom'
import type { Room } from '../../types'

type RoomCardProps = {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <article className="room-card">
      <h2>{room.name}</h2>
      <div>Description: {room.description}</div>
      <div>Capacity: {room.capacity}</div>
      <div>Price: ${room.pricePerHour}</div>
      <Link to={`/rooms/${room.id}`}>View room</Link>
    </article>
  )
}
