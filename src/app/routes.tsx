import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { LoginPage } from '../features/auth/LoginPage'
import { RequireAuth } from '../features/auth/RequireAuth'
import { BookingsPage } from '../features/bookings/BookingsPage'
import { RoomDetail } from '../features/rooms/RoomDetail'
import { RoomList } from '../features/rooms/RoomList'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <RoomList /> },
      { path: 'rooms/:roomId', element: <RoomDetail /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'bookings',
        element: (
          <RequireAuth>
            <BookingsPage />
          </RequireAuth>
        ),
      },
    ],
  },
])
