# Booking API errors

## 401 handling

In `src/lib/api.ts`, clear the session and redirect to login whenever the response status is `401`:

```ts
import { clearSession, getToken } from './session'

if (!response.ok) {
  if (response.status === 401) {
    clearSession()

    const currentPath = `${window.location.pathname}${window.location.search}`
    window.location.assign(`/login?from=${encodeURIComponent(currentPath)}`)
  }

  const body = data as { message?: string; fields?: Record<string, string> } | null
  throw new ApiError(
    response.status,
    body?.message ?? `Request failed (${response.status})`,
    body?.fields,
  )
}
```

## 400 field errors

Import `ApiError` in `BookingForm.tsx`:

```ts
import { ApiError, createBooking } from '../../lib/api'
```

In the `createBooking` catch block, copy server field errors into the form state:

```tsx
} catch (error) {
  if (
    error instanceof ApiError &&
    error.status === 400 &&
    error.fields
  ) {
    setFieldErrors((current) => ({
      ...current,
      ...(error.fields?.date ? { date: error.fields.date } : {}),
      ...(error.fields?.hours ? { hours: error.fields.hours } : {}),
      ...(error.fields?.guests ? { guests: error.fields.guests } : {}),
    }))
  }

  setSubmitError(error instanceof Error ? error.message : 'Booking failed.')
}
```
