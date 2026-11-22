import type { Room } from '../../types'

export function filterRooms(rooms: Room[], query: string): Room[] {
  const q = query.trim().toLowerCase()
  if (!q) return rooms

  // LAB 2: return rooms whose name or description includes `q` (case-insensitive).
  // Hint: room.name.toLowerCase().includes(q)
  void q
  
  return rooms.filter((room) => room.name.toLowerCase().includes(q) || room.description.toLocaleLowerCase().includes(q))
}
