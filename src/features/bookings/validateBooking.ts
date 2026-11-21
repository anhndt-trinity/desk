export type BookingFormValues = {
  date: string
  hours: string
  guests: string
}

const validateDate = (date: string): string | null => {
  if (!date.trim()) {
    return 'Date is required'
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) {
    return 'Date must be in YYYY-MM-DD format'
  }

  // Check if the date is valid (e.g., not 2023-02-30)
  const [year, month, day] = date.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() + 1 !== month ||
    dateObj.getDate() !== day
  ) {
    return 'Invalid date'
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (dateObj < today) {
    return 'Date cannot be in the past'
  }

  return null
}

const validateIntRange = (
  raw: string,
  label: string,
  min: number,
  max: number,
): string | null => {
  if (!raw.trim()) {
    return `${label} is required`
  }

  const value = Number(raw)
  if (!Number.isInteger(value) || value < min || value > max) {
    return `${label} must be between ${min} and ${max}`
  }

  return null
}

export type BookingFieldErrors = Partial<Record<keyof BookingFormValues, string>>

export function validateBooking(
  values: BookingFormValues,
  capacity: number,
): BookingFieldErrors {
  const errors: BookingFieldErrors = {}

  // LAB 5: validate date (required, not in the past), hours (1–8), guests (1–capacity).
  // Return an object of field → message. Empty object means valid.

  const { date, hours, guests } = values

  const dateError = validateDate(date)
  if (dateError) errors.date = dateError

  const hoursError = validateIntRange(hours, 'Hours', 1, 8)
  if (hoursError) errors.hours = hoursError

  const guestsError = validateIntRange(guests, 'Guests', 1, capacity)
  if (guestsError) errors.guests = guestsError

  return errors
}
