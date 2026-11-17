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

  if (!values.date) {
    errors.date = 'Pick a date.'
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
  if (!values.hours || Number.isNaN(hours)) {
    errors.hours = 'Hours is required.'
  } else if (hours < 1 || hours > 8) {
    errors.hours = 'Hours must be between 1 and 8.'
  }

  const guests = Number(values.guests)
  if (!values.guests || Number.isNaN(guests)) {
    errors.guests = 'Guests is required.'
  } else if (guests < 1) {
    errors.guests = 'At least one guest is required.'
  } else if (guests > capacity) {
    errors.guests = `This room holds up to ${capacity} guests.`
  }

  return errors
}
