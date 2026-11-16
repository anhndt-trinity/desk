import { describe, expect, it } from 'vitest'
import { ROOMS } from '../../../data/rooms'
import { filterRooms } from '../filterRooms'

describe('filterRooms', () => {
  it('returns all rooms when the query is blank', () => {
    expect(filterRooms(ROOMS, '   ')).toHaveLength(ROOMS.length)
  })

  it('matches room names case-insensitively', () => {
    const result = filterRooms(ROOMS, 'harbor')
    expect(result.map((room) => room.id)).toEqual(['harbor'])
  })

  it('matches descriptions', () => {
    const result = filterRooms(ROOMS, 'quiet')
    expect(result.some((room) => room.id === 'aurora')).toBe(true)
  })
})
