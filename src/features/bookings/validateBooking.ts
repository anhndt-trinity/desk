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

  const date = values.date.trim()
  if (!date) {
    errors.date = 'Date is required.'
  } else if (isNaN(Date.parse(date))) {
    errors.date = 'Date is invalid.'
  } else {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const bookingDate = new Date(`${date}T00:00:00`)
    if (bookingDate < today) {
      errors.date = 'Date cannot be in the past.'
    }
  }

  const hours = values.hours.trim()
  if (!hours) {
    errors.hours = 'Hours is required.'
  }
  if(Number(hours) <1 || Number(hours) > 8) {
    errors.hours = 'Hours must be between 1 and 8.'
  }

  const guests = values.guests.trim()
  if (!guests) {
    errors.guests = 'Guests is required.'
  }
  if(Number(guests) <1 || Number(guests) > capacity) {
    errors.guests = `Guests must be between 1 and ${capacity}.`
  }

  return errors
}
