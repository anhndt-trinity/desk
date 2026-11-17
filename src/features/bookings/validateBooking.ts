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

  const hours: number = Number(values.hours);

  if (Number.isNaN(hours) || hours < 1 || hours > 8) {
    errors.hours = 'hours must be a number in range 1 to 8';
  }

  const guests = Number(values.guests);
  if (Number.isNaN(guests) || guests < 1 || guests > capacity) {
    errors.guests = `guests must be a number in range 1 to ${capacity} (capacity)`;
  }

  if (!values.date || values.date.trim().length === 0) {
    errors.date = 'date i required';
  }
  const date = new Date(values.date);
  if (new Date() > date) {
    errors.date = `date cannot in the past`
  }

  return errors
}
