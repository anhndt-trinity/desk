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
    const day = new Date(`${values.date}T12:00:00`)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (Number.isNaN(day.getTime())) {
      errors.date = 'Date is invalid.'
    } else if (day < today) {
      errors.date = 'Date must be today or later.'
    }
  }

  const hours = Number(values.hours)
  if (!Number.isFinite(hours) || hours < 1 || hours > 8) {
    errors.hours = 'Hours must be between 1 and 8.'
  }

  const guests = Number(values.guests)
  if (!Number.isFinite(guests) || guests < 1) {
    errors.guests = 'At least one guest is required.'
  } else if (guests > capacity) {
    errors.guests = `This room holds up to ${capacity} guests.`
  }
  return errors
}
