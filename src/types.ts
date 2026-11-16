export type Role = 'guest' | 'staff'

export type Room = {
  id: string
  name: string
  capacity: number
  pricePerHour: number
  description: string
  amenities: string[]
}

export type User = {
  id: string
  email: string
  name: string
  role: Role
}

export type Session = {
  token: string
  user: User
}

export type Booking = {
  id: string
  roomId: string
  roomName: string
  userId: string
  userEmail: string
  date: string
  hours: number
  guests: number
  createdAt: string
}

export type BookingInput = {
  roomId: string
  date: string
  hours: number
  guests: number
}

export type ApiErrorBody = {
  message: string
  fields?: Record<string, string>
}
