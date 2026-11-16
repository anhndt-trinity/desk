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
  void capacity
  void values

  return errors
}
