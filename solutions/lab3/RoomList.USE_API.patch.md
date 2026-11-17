# Lab 3 switch

In `src/features/rooms/RoomList.tsx`, change:

```ts
const USE_API = false
```

to:

```ts
const USE_API = true
```

After `useRooms` is implemented, the list loads from `GET /api/rooms`.
To practice the error UI, temporarily call `request('/api/rooms?fail=1')` inside `getRooms` or open that URL in the network tab via a temporary change.
