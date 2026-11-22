export type BookingFormValues = {
  date: string
  hours: string
  guests: string
}

export type BookingFieldErrors = Partial<Record<keyof BookingFormValues, string>>

export function validateBooking(
  values: BookingFormValues,
  capacity: number,
): BookingFieldErrors {
  const errors: BookingFieldErrors = {}

  // LAB 5: validate date (required, not in the past), hours (1–8), guests (1–capacity).
  // Return an object of field → message. Empty object means valid.
  if (!values.date) {
    errors.date = 'Date is required.'
  } else {
    const date = new Date(values.date)
    if (date < new Date()) {
      errors.date = 'Date cannot be in the past.'
    }
  }

  if (!values.hours) {
    errors.hours = 'Hours is required.'
  } else {
    const hours = parseInt(values.hours, 10)
    if (isNaN(hours) || hours < 1 || hours > 8) {
      errors.hours = 'Hours must be between 1 and 8.'
    }
  }

  if (!values.guests) {
    errors.guests = 'Guests is required.'
  } else {
    const guests = parseInt(values.guests, 10)
    if (isNaN(guests) || guests < 1 || guests > capacity) {
      errors.guests = `Guests must be between 1 and ${capacity}.`
    }
  }

  void capacity
  void values

  return errors
}
