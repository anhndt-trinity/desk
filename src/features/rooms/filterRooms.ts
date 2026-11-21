import type { Room } from '../../types'

export function filterRooms(rooms: Room[], query: string): Room[] {
  const q = query.trim().toLowerCase()
  if (!q) return rooms

  // LAB 2: return rooms whose name or description includes `q` (case-insensitive).
  // Hint: room.name.toLowerCase().includes(q)
  return rooms
    .filter(
      r => {
        const name = r.name.toLowerCase();
        const description = r.description.toLowerCase();

        return name.includes(q) || description.includes(q);
      });
}
