import { afterEach, describe, expect, it, vi } from 'vitest'
import { validateBooking } from '../validateBooking'

function tomorrow(): string {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

describe('validateBooking', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('rejects yesterday and accepts today in local time', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 17, 0, 30))

    expect(
      validateBooking({ date: '2026-11-16', hours: '2', guests: '2' }, 8).date,
    ).toBeTruthy()
    expect(
      validateBooking({ date: '2026-11-17', hours: '2', guests: '2' }, 8),
    ).toEqual({})
  })

  it('accepts a valid booking', () => {
    expect(
      validateBooking({ date: tomorrow(), hours: '2', guests: '3' }, 8),
    ).toEqual({})
  })

  it('requires a date', () => {
    const errors = validateBooking({ date: '', hours: '2', guests: '2' }, 8)
    expect(errors.date).toBeTruthy()
  })

  it('rejects hours outside 1–8', () => {
    const errors = validateBooking({ date: tomorrow(), hours: '9', guests: '2' }, 8)
    expect(errors.hours).toBeTruthy()
  })

  it('rejects guests above capacity', () => {
    const errors = validateBooking({ date: tomorrow(), hours: '2', guests: '12' }, 8)
    expect(errors.guests).toBeTruthy()
  })
})
