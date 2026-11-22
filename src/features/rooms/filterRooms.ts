import type { Room } from '../../types'

export function filterRooms(rooms: Room[], query: string): Room[] {
  const q = query.trim().toLowerCase()
  if (!q) return rooms

  // LAB 2: return rooms whose name or description includes `q` (case-insensitive).
  // Hint: room.name.toLowerCase().includes(q)
  return rooms.filter((room) => {
    return (
      room.name.toLowerCase().includes(q) 
      ||
      room.amenities.join(', ').toLowerCase().includes(q)
      ||
      room.capacity.toString().includes(q)
      ||
      // room.pricePerHour.toString().includes(q)  
      // ||
      room.description.toLowerCase().includes(q)
    )
  })
  void q
  return rooms
}
