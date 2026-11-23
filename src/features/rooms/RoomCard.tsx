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
      <span className="mono">{room.id}</span>
      <h3>Room name: {room.name}</h3>
      <p>Capacity: {room.capacity}</p>
      <p>Price Hour: {room.pricePerHour}$/hr</p>
      {/* <div className="todo">
        Lab 1: finish <span className="mono">RoomCard</span> for{' '}
        <span className="mono">{room.id}</span>
        
      </div> */}
      <div className="room-meta">
        <Link to={`/rooms/${room.id}`}>View room</Link>
      </div>
    </article>
  )
}
