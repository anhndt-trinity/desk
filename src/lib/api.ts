import type { Booking, BookingInput, Room, Session } from '../types'
import { getToken } from './session'

export class ApiError extends Error {
  status: number
  fields?: Record<string, string>

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json')
  }

  // TAKE-HOME: attach Authorization from getToken() when a session exists.
  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(path, { ...init, headers })
  const text = await response.text()
  const data = text ? (JSON.parse(text) as unknown) : null

  if (!response.ok) {
    const body = data as { message?: string; fields?: Record<string, string> } | null
    throw new ApiError(
      response.status,
      body?.message ?? `Request failed (${response.status})`,
      body?.fields,
    )
  }

  return data as T
}

export function getRooms(): Promise<Room[]> {
  return request<Room[]>('/api/rooms')
}

export function getRoom(id: string): Promise<Room> {
  return request<Room>(`/api/rooms/${id}`)
}

export function login(email: string, password: string): Promise<Session> {
  return request<Session>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function createBooking(input: BookingInput): Promise<Booking> {
  return request<Booking>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function getBookings(): Promise<Booking[]> {
  return request<Booking[]>('/api/bookings')
}
