# Take-home: paint API 400 field errors

In `BookingForm`, when `createBooking` throws an `ApiError` with `status === 400` and `fields`, merge those messages into `fieldErrors`:

```ts
import { ApiError, createBooking } from '../../lib/api'

// inside catch:
if (error instanceof ApiError && error.status === 400 && error.fields) {
  setFieldErrors(error.fields)
  setSubmitError(error.message)
  return
}
```

# Take-home: 401 clears the session

In `src/lib/api.ts` `request`, after a 401:

```ts
import { clearSession } from './session'

if (response.status === 401) {
  clearSession()
}
```

Then send the user to `/login` from the page that caught the error, or from a small auth helper.
