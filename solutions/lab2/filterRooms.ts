import type { Room } from '../../types'

export function filterRooms(rooms: Room[], query: string): Room[] {
  const q = query.trim().toLowerCase()
  if (!q) return rooms

  return rooms.filter((room) => {
    const name = room.name.toLowerCase()
    const description = room.description.toLowerCase()
    return name.includes(q) || description.includes(q)
  })
}
