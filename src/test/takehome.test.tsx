import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { LoginPage } from '../features/auth/LoginPage'
import { RequireAuth } from '../features/auth/RequireAuth'
import { BookingForm } from '../features/bookings/BookingForm'
import { BookingsPage } from '../features/bookings/BookingsPage'
import { clearSession, getSession, setSession } from '../lib/session'
import type { Session } from '../types'

const session: Session = {
  token: 'demo-token',
  user: { id: 'u-guest', email: 'guest@desk.dev', name: 'Guest User', role: 'guest' },
}
const room = {
  id: 'r1', name: 'Harbor', capacity: 8, pricePerHour: 20,
  description: 'A quiet room', amenities: [],
}
const fetchMock = vi.fn<typeof fetch>()

function response(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status })
}

function Location() {
  const location = useLocation()
  return <output aria-label="Current URL">{location.pathname + location.search + location.hash}</output>
}

function open(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Location />
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/rooms/:roomId" element={<BookingForm room={room} />} />
          <Route path="/bookings" element={<RequireAuth><BookingsPage /></RequireAuth>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

function submitBooking() {
  fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2099-01-01' } })
  fireEvent.click(screen.getByRole('button', { name: 'Request booking' }))
}

beforeEach(() => {
  clearSession()
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  cleanup()
  clearSession()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('take-home auth and bookings', () => {
  it('protects bookings and preserves the requested URL', async () => {
    open('/bookings?view=all#top')
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(screen.getByLabelText('Current URL')).toHaveTextContent(
      '/login?from=%2Fbookings%3Fview%3Dall%23top',
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('logs in, persists the session, and attaches the token', async () => {
    fetchMock.mockResolvedValueOnce(response(session)).mockResolvedValueOnce(response([]))
    open('/login')
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByText('No bookings yet.')).toBeInTheDocument()
    expect(getSession()).toEqual(session)
    expect(JSON.parse(sessionStorage.getItem('desk.session')!)).toEqual(session)
    const [, options] = fetchMock.mock.calls[1]
    expect(new Headers(options?.headers).get('Authorization')).toBe('Bearer demo-token')
    expect(screen.getByLabelText('Current URL')).toHaveTextContent('/bookings')
  })

  it('returns to the room specified by the from query after login', async () => {
    fetchMock.mockResolvedValueOnce(response(session))
    open('/login?from=%2Frooms%2Fr1')
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByRole('heading', { name: 'Book Harbor' })).toBeInTheDocument()
    expect(screen.getByLabelText('Current URL')).toHaveTextContent('/rooms/r1')
  })

  it('shows invalid credentials without saving a session', async () => {
    fetchMock.mockResolvedValueOnce(response({ message: 'Invalid email or password.' }, 401))
    open('/login')
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument()
    expect(getSession()).toBeNull()
  })

  it('loads the rows returned by the server for staff', async () => {
    setSession({ ...session, user: { ...session.user, role: 'staff' } })
    fetchMock.mockResolvedValueOnce(response([
      { id: 'b1', roomName: 'Harbor', userEmail: 'other@desk.dev', date: '2099-01-01', hours: 2, guests: 3 },
    ]))
    open('/bookings')
    expect(screen.getByRole('heading', { name: 'All bookings' })).toBeInTheDocument()
    expect(await screen.findByText('other@desk.dev')).toBeInTheDocument()
    expect(screen.getByText('Harbor')).toBeInTheDocument()
  })

  it('retries a failed bookings request', async () => {
    setSession(session)
    fetchMock.mockResolvedValueOnce(response({ message: 'Temporarily unavailable.' }, 500))
      .mockResolvedValueOnce(response([]))
    open('/bookings')
    expect(await screen.findByRole('alert')).toHaveTextContent('Temporarily unavailable.')
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('No bookings yet.')).toBeInTheDocument()
  })

  it('clears an expired session when loading bookings', async () => {
    setSession(session)
    fetchMock.mockResolvedValueOnce(response({ message: 'Invalid or expired token.' }, 401))
    open('/bookings')
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(getSession()).toBeNull()
    expect(screen.getByLabelText('Current URL')).toHaveTextContent('/login?from=%2Fbookings')
  })

  it('shows API 400 field errors beside the corresponding booking inputs', async () => {
    setSession(session)
    fetchMock.mockResolvedValueOnce(response({
      message: 'Check the booking form.',
      fields: { date: 'Date rejected by server.', hours: 'Hours rejected by server.', guests: 'Guests rejected by server.' },
    }, 400))
    open('/rooms/r1')
    submitBooking()
    expect(await screen.findByText('Date rejected by server.')).toBeInTheDocument()
    expect(screen.getByText('Hours rejected by server.')).toBeInTheDocument()
    expect(screen.getByText('Guests rejected by server.')).toBeInTheDocument()
    expect(getSession()).toEqual(session)
  })

  it('clears an expired session and returns to the same room after signing in', async () => {
    setSession(session)
    fetchMock.mockResolvedValueOnce(response({ message: 'Invalid or expired token.' }, 401))
    open('/rooms/r1')
    submitBooking()
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(getSession()).toBeNull()
    expect(screen.getByLabelText('Current URL')).toHaveTextContent('/login?from=%2Frooms%2Fr1')
  })
})

it('catches a deliberate render error and recovers when the cause is removed', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  let shouldThrow = true
  function DeliberateError() {
    if (shouldThrow) throw new Error('Deliberate take-home error.')
    return <p>Recovered successfully.</p>
  }
  render(<ErrorBoundary><DeliberateError /></ErrorBoundary>)
  expect(screen.getByRole('alert')).toHaveTextContent('Deliberate take-home error.')
  shouldThrow = false
  fireEvent.click(screen.getByRole('button', { name: 'Try to recover' }))
  await waitFor(() => expect(screen.getByText('Recovered successfully.')).toBeInTheDocument())
})
