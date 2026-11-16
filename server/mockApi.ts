import type { IncomingMessage, ServerResponse } from 'node:http'
import { createHmac, timingSafeEqual } from 'node:crypto'
import type { Connect, Plugin } from 'vite'
import { ROOMS } from '../src/data/rooms.ts'
import type { Booking, Role, User } from '../src/types.ts'

const JWT_SECRET = 'desk-workshop-secret-not-for-production'

type StoredUser = User & { password: string }

const USERS: StoredUser[] = [
  {
    id: 'u-guest',
    email: 'guest@desk.dev',
    password: 'guest123',
    name: 'Guest User',
    role: 'guest',
  },
  {
    id: 'u-staff',
    email: 'staff@desk.dev',
    password: 'staff123',
    name: 'Staff Member',
    role: 'staff',
  },
]

const bookings: Booking[] = []

type JwtPayload = {
  sub: string
  email: string
  role: Role
  name: string
  iat: number
  exp: number
}

function b64url(input: string | Buffer): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return buf.toString('base64url')
}

function signJwt(payload: JwtPayload): string {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = b64url(JSON.stringify(payload))
  const data = `${header}.${body}`
  const sig = createHmac('sha256', JWT_SECRET).update(data).digest('base64url')
  return `${data}.${sig}`
}

function verifyJwt(token: string): JwtPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [header, body, sig] = parts
  const data = `${header}.${body}`
  const expected = createHmac('sha256', JWT_SECRET).update(data).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as JwtPayload
    if (payload.exp * 1000 < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function getBearer(req: IncomingMessage): string | null {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length).trim() || null
}

function requireUser(req: IncomingMessage): JwtPayload | 'missing' | 'invalid' {
  const token = getBearer(req)
  if (!token) return 'missing'
  const payload = verifyJwt(token)
  if (!payload) return 'invalid'
  return payload
}

async function handleApi(
  req: IncomingMessage,
  res: ServerResponse,
  next: Connect.NextFunction,
): Promise<void> {
  const url = new URL(req.url ?? '/', 'http://localhost')
  if (!url.pathname.startsWith('/api/')) {
    next()
    return
  }

  const method = req.method ?? 'GET'
  const path = url.pathname

  try {
    if (method === 'GET' && path === '/api/rooms') {
      const fail = url.searchParams.get('fail')
      if (fail === '1') {
        sendJson(res, 500, { message: 'Room catalog temporarily unavailable.' })
        return
      }
      await delay(400)
      sendJson(res, 200, ROOMS)
      return
    }

    const roomMatch = path.match(/^\/api\/rooms\/([^/]+)$/)
    if (method === 'GET' && roomMatch) {
      await delay(250)
      const room = ROOMS.find((r) => r.id === roomMatch[1])
      if (!room) {
        sendJson(res, 404, { message: 'Room not found.' })
        return
      }
      sendJson(res, 200, room)
      return
    }

    if (method === 'POST' && path === '/api/login') {
      const raw = await readBody(req)
      const body = JSON.parse(raw || '{}') as { email?: string; password?: string }
      const user = USERS.find(
        (u) => u.email === body.email && u.password === body.password,
      )
      if (!user) {
        sendJson(res, 401, { message: 'Invalid email or password.' })
        return
      }
      const now = Math.floor(Date.now() / 1000)
      const token = signJwt({
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        iat: now,
        exp: now + 60 * 60 * 8,
      })
      sendJson(res, 200, {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      })
      return
    }

    if (method === 'GET' && path === '/api/bookings') {
      const auth = requireUser(req)
      if (auth === 'missing') {
        sendJson(res, 401, { message: 'Authentication required.' })
        return
      }
      if (auth === 'invalid') {
        sendJson(res, 401, { message: 'Invalid or expired token.' })
        return
      }
      await delay(300)
      const visible =
        auth.role === 'staff'
          ? bookings
          : bookings.filter((b) => b.userId === auth.sub)
      sendJson(res, 200, visible)
      return
    }

    if (method === 'POST' && path === '/api/bookings') {
      const auth = requireUser(req)
      if (auth === 'missing') {
        sendJson(res, 401, { message: 'Authentication required. Sign in to book a room.' })
        return
      }
      if (auth === 'invalid') {
        sendJson(res, 401, { message: 'Invalid or expired token.' })
        return
      }

      const raw = await readBody(req)
      const body = JSON.parse(raw || '{}') as {
        roomId?: string
        date?: string
        hours?: number
        guests?: number
      }

      const fields: Record<string, string> = {}
      const room = ROOMS.find((r) => r.id === body.roomId)
      if (!room) fields.roomId = 'Choose a valid room.'
      if (!body.date) fields.date = 'Pick a date.'
      else if (Number.isNaN(Date.parse(body.date))) fields.date = 'Date is invalid.'
      else {
        const day = new Date(`${body.date}T12:00:00`)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (day < today) fields.date = 'Date must be today or later.'
      }
      if (body.hours == null || Number.isNaN(Number(body.hours))) {
        fields.hours = 'Hours is required.'
      } else if (Number(body.hours) < 1 || Number(body.hours) > 8) {
        fields.hours = 'Hours must be between 1 and 8.'
      }
      if (body.guests == null || Number.isNaN(Number(body.guests))) {
        fields.guests = 'Guests is required.'
      } else if (room && Number(body.guests) > room.capacity) {
        fields.guests = `This room holds up to ${room.capacity} guests.`
      } else if (Number(body.guests) < 1) {
        fields.guests = 'At least one guest is required.'
      }

      if (Object.keys(fields).length > 0) {
        sendJson(res, 400, { message: 'Check the booking form.', fields })
        return
      }

      await delay(350)
      const booking: Booking = {
        id: `b-${bookings.length + 1}`,
        roomId: room!.id,
        roomName: room!.name,
        userId: auth.sub,
        userEmail: auth.email,
        date: body.date!,
        hours: Number(body.hours),
        guests: Number(body.guests),
        createdAt: new Date().toISOString(),
      }
      bookings.push(booking)
      sendJson(res, 201, booking)
      return
    }

    sendJson(res, 404, { message: 'Not found.' })
  } catch (error) {
    sendJson(res, 500, {
      message: error instanceof Error ? error.message : 'Unexpected server error.',
    })
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function mockApiPlugin(): Plugin {
  return {
    name: 'desk-mock-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        void handleApi(req, res, next)
      })
    },
  }
}
