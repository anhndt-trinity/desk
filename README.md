# Desk — React Fundamentals Workshop

A room-booking UI you finish yourself. Five labs cover components, state, data fetching, routing, and forms. A take-home ladder finishes login and the bookings list.

**Thread:** the screen must not lie.

## What’s in this repo

| Path | Purpose |
| --- | --- |
| `src/` | Vite + React + TypeScript app (starter stubs for the labs) |
| `server/mockApi.ts` | Same-origin API with HMAC JWTs (via Vite middleware) |
| `solutions/` | Copy-if-stuck references for each lab and take-home task |
| `EXERCISES.md` | Lab briefs and the after-session ladder |

## Requirements

- Node.js **20+** (22 works)
- npm 10+

If your shell uses a private npm registry, install with the public registry:

```bash
NPM_CONFIG_REGISTRY=https://registry.npmjs.org/ npm install
```

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm test      # Vitest (Lab 2 + Lab 5 turn red → green)
npm run build # production check
```

Work through [`EXERCISES.md`](EXERCISES.md). Prefer solving each lab yourself. If you are stuck for more than four minutes, peek at `solutions/` and adapt — do not paste blindly.

## Demo accounts (take-home auth)

| Email | Password | Role |
| --- | --- | --- |
| `guest@desk.dev` | `guest123` | guest — own bookings |
| `staff@desk.dev` | `staff123` | staff — all bookings |

## API (dev server)

Same origin, no second terminal:

- `GET /api/rooms` — public (`?fail=1` forces 500 for Lab 3 error UI)
- `GET /api/rooms/:id` — public
- `POST /api/login` — `{ email, password }` → `{ token, user }`
- `POST /api/bookings` — bearer token required
- `GET /api/bookings` — bearer token; filtered by role

The mock API verifies JWT signatures with Node `crypto`. Production verification belongs on a real server; this double still checks the signature so 401/403 lessons stay honest.

## Project shape

```
src/
  app/routes.tsx
  components/          # LoadingState, ErrorState, AppShell, ErrorBoundary
  features/
    rooms/             # Labs 1–4
    bookings/          # Lab 5 + take-home list
    auth/              # take-home login + RequireAuth
  lib/api.ts           # fetch helpers
  lib/session.ts       # memory + sessionStorage
  types.ts
```

## Labs

1. Component / JSX / props → **Lab 1** `RoomCard`
2. State / hooks → **Lab 2** search filter
3. Effects / REST → **Lab 3** `useRooms`
4. React Router → **Lab 4** room detail
5. Forms → **Lab 5** validation + honest **401**
6. JWT story → take-home auth ladder in [`EXERCISES.md`](EXERCISES.md)
