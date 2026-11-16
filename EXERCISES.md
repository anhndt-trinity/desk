# Desk exercises

Work in the `src/` files named below. Prefer solving the lab yourself. If you are stuck for more than four minutes, peek at `solutions/` and adapt — do not paste blindly.

Run the app with `npm run dev`. Run checks with `npm test`.

---

## In the room

### Lab 1 — Component, JSX, props

**File:** `src/features/rooms/RoomCard.tsx`

**Task:** Render the room `name`, `capacity`, and `pricePerHour` from the typed `room` prop. Keep the “View room” link.

**Done when:** Each card shows those three facts and the red Lab 1 TODO box is gone.

**Solution:** `solutions/lab1/RoomCard.tsx`

---

### Lab 2 — State and derived data

**Files:** `src/features/rooms/filterRooms.ts` (logic), search box already lives in `RoomList.tsx`

**Task:** Make `filterRooms` return rooms whose **name** or **description** includes the query (case-insensitive). Blank query returns all rooms.

**Check:** `npm test` — `filterRooms` tests go green.

**Done when:** Typing `harbor` or `quiet` in Search narrows the grid.

**Solution:** `solutions/lab2/filterRooms.ts`

---

### Lab 3 — Fetch, loading, error

**Files:** `src/features/rooms/useRooms.ts`, then flip the switch in `src/features/rooms/RoomList.tsx`

**Task:**

1. In `useRooms`, call `getRooms()`, set `success` with the rooms, or `error` with a message. Keep the `cancelled` guard.
2. In `RoomList`, set `USE_API` to `true`.

**Done when:** The list loads from the API (brief loading state). Empty search and a failed fetch look different. Use Retry on error.

**Tip:** Temporarily request `/api/rooms?fail=1` inside `getRooms` to force the error UI, then revert.

**Solution:** `solutions/lab3/useRooms.ts` and `solutions/lab3/RoomList.USE_API.patch.md`

---

### Lab 4 — Routing

**File:** `src/features/rooms/RoomDetail.tsx` (route already registered)

**Task:** Read `roomId` from `useParams`, call `getRoom(roomId)`, and set the success state with the room. The card link already points at `/rooms/:roomId`.

**Done when:** Opening a room shows its detail panel and the booking form shell.

**Solution:** `solutions/lab4/RoomDetail.tsx`

---

### Lab 5 — Forms, validation, honest 401

**Files:** `src/features/bookings/validateBooking.ts` (and submit already wired in `BookingForm.tsx`)

**Task:** Validate date (required, not in the past), hours (1–8), guests (1–capacity). Return field messages; `{}` means valid.

**Check:** `npm test` — `validateBooking` tests go green.

**Done when:** Invalid submit shows field errors and does not call the API. Valid submit calls the API and the form shows the **401** message. That is the bridge to tonight’s auth work — do not skip the request to hide it.

**Solution:** `solutions/lab5/validateBooking.ts`

---

## After the session

Complete these in order. Copy-from-stuck files live under `solutions/takehome/`.

1. **Login** — Implement `src/features/auth/LoginPage.tsx`: call `login`, `setSession`, redirect to `from` query or `/bookings`.  
   Solution: `solutions/takehome/LoginPage.tsx`

2. **Attach the token** — `src/lib/api.ts` already sends `Authorization` when `getToken()` is set. On **401**, call `clearSession()` and send the user to login. See `solutions/takehome/BookingForm.apiErrors.md`.

3. **RequireAuth** — In `src/features/auth/RequireAuth.tsx`, set enforcement on: no session → `/login?from=…`.  
   Solution: `solutions/takehome/RequireAuth.tsx`

4. **Bookings list** — Finish `src/features/bookings/BookingsPage.tsx` with `getBookings()`. Guests see their rows; staff see all (server filters by role).  
   Solution: `solutions/takehome/BookingsPage.tsx`

5. **API 400 field errors** — When booking returns 400 with `fields`, paint them on the form.  
   Notes: `solutions/takehome/BookingForm.apiErrors.md`

6. **Error boundary** — Already wrapped in `src/main.tsx` via `ErrorBoundary`. Read `src/components/ErrorBoundary.tsx` and trigger a deliberate throw once to see it.

7. **Optional stretch — AuthContext** — Replace ad hoc `getSession` reads with `solutions/takehome/AuthContext.tsx` so the top bar updates without a full reload dance.

### Demo accounts

| Email | Password | Role |
| --- | --- | --- |
| `guest@desk.dev` | `guest123` | guest |
| `staff@desk.dev` | `staff123` | staff |
