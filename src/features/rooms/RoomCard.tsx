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
        {/* <span className="roomid">Room ID: {room.id}</span><br/> */}
      <h2><span className="roomname">{room.name}</span><br/></h2>
      <div className="todo">
        <span>Capacity: {room.capacity}</span><br></br>
        <br></br>
        <span>Price: ${room.pricePerHour}/hr</span><br></br>
        <br></br>
        <span>Description: {room.description}</span><br></br>
        <br></br>
        <span>Amenities: {room.amenities.join(', ')}</span>
      </div>
      <Link to={`/rooms/${room.id}`}>View room</Link>
    </article>
  )
}
