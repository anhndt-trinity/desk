import type { Room } from '../../types'

export function filterRooms(rooms: Room[], query: string): Room[] {
  const q = query.trim().toLowerCase()
  if (!q) return rooms

  return rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(q) ||
      room.description.toLowerCase().includes(q),
  )
}
